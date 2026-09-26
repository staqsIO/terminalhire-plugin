/**
 * captureEntry.ts — screenshots of a web app, as the capture container's main process
 * (TERM-1258).
 *
 * Runs inside our own image (`capture.ts`, `CAPTURE_DOCKERFILE`), never inside the
 * repository's. The repository's code has already run: its build wrote files into the
 * clone, or its serve script is listening in a container this one shares a network
 * namespace with. This process serves or reaches that app over loopback, drives a
 * headless Chromium through each planned shot (with no spec, one per route: desktop,
 * light), and writes PNGs plus `manifest.json` to /out.
 *
 * No network in either mode: static capture runs under `--network=none`, and server
 * capture joins an app container that itself has `--network=none`. Whatever the page
 * requests from the internet fails, so what is shown is what the repository renders
 * on its own, which is also why the gallery says "without a backend".
 *
 * Self-contained on purpose: this file is copied alone into the container, so it
 * imports node builtins and `playwright-core` (installed in the image) and nothing
 * from this package.
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, realpathSync, statSync, writeFileSync, } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { extname, isAbsolute, join, relative, sep } from 'node:path';
export const VIEWPORTS = {
    desktop: { width: 1280, height: 800, isMobile: false },
    mobile: { width: 390, height: 844, isMobile: true },
};
export const SCHEMES = ['light', 'dark'];
/**
 * What gets shot. With no spec, one picture per route at desktop size in light mode
 * (TERM-1272). The desktop/mobile × light/dark matrix this replaces suited one claim
 * and cost every other one three more renders of the same screen, most often a
 * loading state; mobile and dark are for a spec to ask for, shot by shot.
 */
export function plannedShots(req) {
    return req.routes.map((route) => ({ route, viewport: 'desktop', scheme: 'light' }));
}
// ---- which directory is the site -------------------------------------------
/**
 * When the build started, read off the marker the build step wrote. Taken from the
 * file's own mtime rather than the host's clock, because the build ran in a VM on
 * Docker Desktop whose clock can drift from the host's by seconds — enough to
 * mistake a source index.html cloned just before for build output.
 */
export function buildStartedAt(siteRoot, sinceFile) {
    if (sinceFile === undefined)
        return Number.POSITIVE_INFINITY;
    try {
        return statSync(join(siteRoot, sinceFile)).mtimeMs;
    }
    catch {
        return Number.POSITIVE_INFINITY;
    }
}
const NEVER_SITE = new Set(['node_modules', '.git']);
const MAX_DEPTH = 6;
/**
 * The directory to serve, or null when there is nothing static to serve.
 *
 * A build's output is recognised by what it did, not by what it is called: any
 * `index.html` written after the build started. Output directories are named by
 * each toolchain differently and are configurable in all of them, so a list of
 * names would be a list of the toolchains someone thought of. The shallowest wins,
 * because nested ones are pages of the site, not the site.
 */
export function findStaticSite(root, sinceMs, rootHtml) {
    const fresh = [];
    const walk = (dir, depth) => {
        if (depth > MAX_DEPTH)
            return;
        let names;
        try {
            names = readdirSync(dir).sort();
        }
        catch {
            return;
        }
        for (const name of names) {
            if (NEVER_SITE.has(name))
                continue;
            const path = join(dir, name);
            let st;
            try {
                st = statSync(path);
            }
            catch {
                continue;
            }
            if (st.isDirectory())
                walk(path, depth + 1);
            else if (name === 'index.html' && st.mtimeMs >= sinceMs)
                fresh.push(dir);
        }
    };
    walk(root, 0);
    fresh.sort((a, b) => a.split(sep).length - b.split(sep).length || a.localeCompare(b));
    const dir = fresh[0] ?? (rootHtml && existsSync(join(root, 'index.html')) ? root : null);
    if (dir === null)
        return null;
    return { dir, basePath: inferBasePath(readFileSync(join(dir, 'index.html'), 'utf8'), dir) };
}
/**
 * The URL prefix the site was built for. A site built for `/app/` asks for
 * `/app/assets/x.js` while the file sits at `assets/x.js`. If most absolute asset
 * URLs resolve only after dropping their first segment, that segment is the base.
 */
export function inferBasePath(html, siteDir) {
    const urls = [...html.matchAll(/\b(?:src|href)\s*=\s*["'](\/[^"'#?]*)/g)]
        .map((m) => m[1] ?? '')
        .filter((u) => !u.startsWith('//'));
    const votes = new Map();
    let asIs = 0;
    for (const url of urls) {
        if (isFile(join(siteDir, url))) {
            asIs++;
            continue;
        }
        const [, first, ...rest] = url.split('/');
        if (first && rest.length > 0 && isFile(join(siteDir, ...rest))) {
            votes.set(first, (votes.get(first) ?? 0) + 1);
        }
    }
    let best = null;
    for (const entry of votes)
        if (best === null || entry[1] > best[1])
            best = entry;
    return best !== null && best[1] > asIs ? `/${best[0]}/` : '/';
}
// ---- serving ---------------------------------------------------------------
/**
 * Map a request path to a file under the site, the way static hosts do: the file
 * itself, then `dir/index.html`, then `name.html`, then — for a path with no
 * extension — the root `index.html`, which is how a client-side router gets its
 * shell. A missing asset is a 404 rather than the shell, so a broken asset shows
 * up broken instead of as HTML parsed as script.
 */
export function resolveRequestPath(siteDir, basePath, urlPath) {
    let decoded;
    try {
        decoded = decodeURIComponent(urlPath);
    }
    catch {
        return { status: 404 };
    }
    const prefix = basePath.replace(/\/$/, '');
    if (prefix !== '' && decoded !== prefix && !decoded.startsWith(`${prefix}/`)) {
        return { status: 404 };
    }
    const rel = decoded.slice(prefix.length).replace(/^\/+/, '');
    // Lexically AND after following links: the build wrote this tree, and a
    // `dist/leak -> /etc/passwd` passes any check on the path as written.
    const within = (base, p) => {
        const r = relative(base, p);
        return r === '' || (r !== '..' && !r.startsWith(`..${sep}`) && !isAbsolute(r));
    };
    let realSite;
    try {
        realSite = realpathSync(siteDir);
    }
    catch {
        return { status: 404 };
    }
    const inside = (p) => {
        if (!within(siteDir, p))
            return false;
        try {
            return within(realSite, realpathSync(p));
        }
        catch {
            return true; // does not exist; isFile() below says no
        }
    };
    const candidate = join(siteDir, rel);
    if (!inside(candidate))
        return { status: 404 };
    const tries = [candidate, join(candidate, 'index.html'), `${candidate.replace(/\/$/, '')}.html`];
    for (const t of tries)
        if (inside(t) && isFile(t))
            return { file: t };
    if (extname(rel) !== '')
        return { status: 404 };
    const shell = join(siteDir, 'index.html');
    return inside(shell) && isFile(shell) ? { file: shell } : { status: 404 };
}
const CONTENT_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.wasm': 'application/wasm',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml',
    '.webmanifest': 'application/manifest+json',
};
function serveStatic(siteDir, basePath) {
    const server = createServer((req, res) => {
        const path = new URL(req.url ?? '/', 'http://site').pathname;
        const found = resolveRequestPath(siteDir, basePath, path);
        if ('status' in found) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, {
            'content-type': CONTENT_TYPES[extname(found.file).toLowerCase()] ?? 'application/octet-stream',
        });
        res.end(readFileSync(found.file));
    });
    return new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', () => {
            const address = server.address();
            resolve({ server, port: typeof address === 'object' && address ? address.port : 0 });
        });
    });
}
// ---- server strategy: which port the app opened ----------------------------
/**
 * Ports in LISTEN state (st 0A), from /proc/net/tcp or tcp6. Sharing the app
 * container's network namespace makes its sockets ours to read, so the app's port
 * is observed rather than assumed: no framework's default port, and no reliance on
 * the app honouring $PORT.
 */
export function listeningPorts(procNetTcp) {
    const ports = new Set();
    for (const line of procNetTcp.split('\n').slice(1)) {
        const cols = line.trim().split(/\s+/);
        if (cols[3] !== '0A')
            continue;
        const port = Number.parseInt((cols[1] ?? '').split(':')[1] ?? '', 16);
        if (Number.isInteger(port) && port > 0)
            ports.add(port);
    }
    return [...ports].sort((a, b) => a - b);
}
// ---- naming and flags ------------------------------------------------------
/**
 * The slug is for people; the hash is what keeps routes apart. `/a/b` and `/a-b`
 * slug the same, and a later shot overwriting an earlier one would leave the
 * manifest describing a file that is no longer there. `/` alone keeps the bare name.
 */
export function shotName(route, viewport, scheme) {
    const slug = route
        .replace(/^\/+|\/+$/g, '')
        .replace(/[^A-Za-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'root';
    const id = route === '/' ? '' : `-${createHash('sha256').update(route).digest('hex').slice(0, 8)}`;
    return `${slug}${id}--${viewport}--${scheme}.png`;
}
/** Route and viewport pairs whose light and dark shots are byte-identical. */
export function sameAcrossSchemes(items) {
    const out = [];
    for (const light of items) {
        if (light.scheme !== 'light')
            continue;
        const dark = items.find((i) => i.scheme === 'dark' && i.route === light.route && i.viewport === light.viewport);
        if (dark && dark.sha256 === light.sha256) {
            out.push({ route: light.route, viewport: light.viewport });
        }
    }
    return out;
}
function isFile(path) {
    try {
        return statSync(path).isFile();
    }
    catch {
        return false;
    }
}
const PNG_SIZE = (png) => ({
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
});
async function shoot(origin, basePath, req, out) {
    const load = createRequire(join(process.env.NODE_PATH ?? '/usr/local/lib/node_modules', '_'));
    const { chromium } = load('playwright-core');
    // The container is the sandbox: no capabilities, no network, a throwaway
    // filesystem. Chromium's own sandbox needs privileges this container refuses.
    const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    const items = [];
    const failures = [];
    try {
        for (const { route, viewport, scheme } of plannedShots(req)) {
            const url = `${origin}${basePath.replace(/\/$/, '')}${route.startsWith('/') ? route : `/${route}`}`;
            const v = VIEWPORTS[viewport];
            const context = await browser.newContext({
                viewport: { width: v.width, height: v.height },
                isMobile: v.isMobile,
                hasTouch: v.isMobile,
                colorScheme: scheme,
                deviceScaleFactor: 1,
            });
            try {
                const page = await context.newPage();
                await page.goto(url, { waitUntil: 'load', timeout: 20_000 });
                // A page with no backend may keep retrying forever, so idle is
                // waited for briefly and never required.
                await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => undefined);
                await page.waitForTimeout(300);
                // Frozen, so two shots of the same page are the same bytes: a spinner
                // caught on different frames would otherwise hide that light and dark
                // render identically, which is the one comparison the notes rely on.
                const png = await page.screenshot({ animations: 'disabled', caret: 'hide' });
                const file = shotName(route, viewport, scheme);
                writeFileSync(join(out, file), png);
                items.push({
                    route,
                    viewport,
                    scheme,
                    file,
                    sha256: createHash('sha256').update(png).digest('hex'),
                    bytes: png.length,
                    ...PNG_SIZE(png),
                });
            }
            catch (err) {
                failures.push({
                    route,
                    viewport,
                    scheme,
                    error: String(err?.message ?? err).slice(0, 300),
                });
            }
            finally {
                await context.close();
            }
        }
    }
    finally {
        await browser.close();
    }
    return { items, failures };
}
async function waitForPort(ms) {
    const deadline = Date.now() + ms;
    while (Date.now() < deadline) {
        const text = ['/proc/net/tcp', '/proc/net/tcp6']
            .map((p) => (existsSync(p) ? readFileSync(p, 'utf8') : ''))
            .join('\n');
        const ports = listeningPorts(text);
        if (ports.length > 0)
            return ports[0] ?? null;
        await new Promise((r) => setTimeout(r, 500));
    }
    return null;
}
async function main() {
    const req = JSON.parse(process.argv[2] ?? '{}');
    const out = '/out';
    const write = (m) => writeFileSync(join(out, 'manifest.json'), `${JSON.stringify(m, null, 2)}\n`);
    const empty = { items: [], failures: [], notes: [] };
    let origin;
    let basePath = '/';
    let server = null;
    if (req.mode === 'static') {
        const root = realpathSync('/site');
        const site = findStaticSite(root, buildStartedAt(root, req.sinceFile), req.rootHtml === true);
        if (site === null) {
            write({
                status: 'no-site',
                reason: 'the build wrote no index.html, and there is none at the repository root',
                mode: 'static',
                basePath: null,
                ...empty,
            });
            return;
        }
        basePath = site.basePath;
        const served = await serveStatic(site.dir, basePath);
        server = served.server;
        origin = `http://127.0.0.1:${served.port}`;
    }
    else {
        const port = await waitForPort(req.waitForPortMs ?? 60_000);
        if (port === null) {
            write({
                status: 'failed',
                reason: `the serve script opened no port within ${Math.round((req.waitForPortMs ?? 60_000) / 1000)}s`,
                mode: 'server',
                basePath: null,
                ...empty,
            });
            return;
        }
        origin = `http://127.0.0.1:${port}`;
    }
    try {
        const { items, failures } = await shoot(origin, basePath, req, out);
        const notes = sameAcrossSchemes(items).map((p) => `${p.route} (${p.viewport}) looks the same in light and dark: the page does not respond to prefers-color-scheme`);
        write({
            status: items.length > 0 ? 'captured' : 'failed',
            reason: items.length > 0 ? null : (failures[0]?.error ?? 'no screenshot was taken'),
            mode: req.mode,
            basePath,
            items,
            failures,
            notes,
        });
    }
    finally {
        server?.close();
    }
}
if (process.argv[1]?.endsWith('captureEntry.js')) {
    main().catch((err) => {
        console.error(`captureEntry: ${String(err?.stack ?? err)}`);
        process.exit(1);
    });
}
