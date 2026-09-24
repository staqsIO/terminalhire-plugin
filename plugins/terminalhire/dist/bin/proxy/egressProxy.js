/**
 * sandbox/egressProxy.ts — the application half of egress control.
 *
 * The seatbelt grants the fenced child exactly one remote: loopback to this
 * proxy's ephemeral port. That grant is IP/port based, which is why it is
 * reliable — and also why it carries no notion of WHICH host the child wants.
 * Host allowlisting therefore lives up here, in a process the child cannot
 * reach or modify.
 *
 * Only used for the dependency-install step. Every later step runs under
 * fence-offline.sb with no network grant at all, so this proxy is not merely
 * denying requests then — it is unreachable.
 *
 * `denyAll` is not a convenience. It is the DISCRIMINATOR that proves the child
 * has no direct-network path: if a request succeeds while the proxy is refusing
 * everything, the child reached the network without us, and the fence leaks.
 */
import net from 'node:net';
import http from 'node:http';
/** Registry hosts a dependency install legitimately needs. */
export const DEFAULT_INSTALL_ALLOWLIST = [
    'registry.npmjs.org',
    // TERM-1240. `yarn install` is derived for every repo with a yarn.lock, and yarn
    // classic writes this host into each lockfile entry — so every yarn repo could start
    // and could never install, the TERM-1139 shape again. It serves the same packages as
    // the npm registry, so the grant widens where a package comes from, not what can come.
    'registry.yarnpkg.com',
    'pypi.org',
    'files.pythonhosted.org',
    'proxy.golang.org',
    'sum.golang.org',
    'static.crates.io',
    'index.crates.io',
    'crates.io',
    // TERM-1139. `ruby` has had an image since the mapping existed and `bundle install`
    // as its derived command, and this host was missing — so every ruby repo could start
    // and could never install. Install is the ONLY step with a network grant at all, so a
    // denial here is terminal, not a slow path.
    //
    // One entry, not two: `hostAllowed` is dot-anchored SUFFIX matching, so this covers
    // `index.rubygems.org` as well. Listing that separately would advertise the grant as
    // narrower than it is, which the `github.com` note below rejects for the same reason.
    'rubygems.org',
    // TERM-1139, added with the `dotnet` image mapping. `dotnet restore` fetches from
    // NuGet; the coupling test refuses a mapped runtime whose registry is unreachable, and
    // it caught this one the moment the image landed.
    'api.nuget.org',
    // TERM-1122, added with the `jvm` image mapping, each from a MEASURED denial
    // through `th run` (the proxy's 403 in the build's own output), not a guess:
    //   - Maven Central, where both `mvn` and Gradle's `mavenCentral()` resolve.
    //   - `services.gradle.org`, where a Gradle wrapper fetches its distribution.
    //   - `release-assets.githubusercontent.com`, where that fetch LANDS. Measured
    //     chain: services.gradle.org 307 -> github.com 302 -> this host 200. The
    //     `github.com` note below keeps `githubusercontent.com` denied until a real
    //     install needs it; this is that install. Only this one host: raw blobs and
    //     `objects.githubusercontent.com` stay denied.
    'repo.maven.apache.org',
    'services.gradle.org',
    'release-assets.githubusercontent.com',
    // Git dependencies. Approved by Eric 2026-07-22 after a live run measured the
    // chokepoint working under load (20 events, 16 allowed / 4 denied by host).
    //
    // READ THE MATCHER BEFORE JUDGING THIS ENTRY'S SCOPE. `hostAllowed` is
    // dot-anchored SUFFIX matching, so this one line grants every `*.github.com`
    // — codeload, api, gist, raw — not just the apex. `codeload.github.com` is
    // therefore deliberately NOT listed separately: a redundant entry would
    // advertise the grant as narrower than it is, which is a worse defect in an
    // allowlist than breadth.
    //
    // What it does NOT grant: `githubusercontent.com` is a DIFFERENT domain, so
    // raw blobs and `objects.githubusercontent.com` stay denied; only
    // `release-assets.githubusercontent.com` is listed, above, for the Gradle
    // wrapper. If a real install needs more, that should arrive as a measured
    // egress denial, not a pre-emptive guess.
    //
    // WHO RUNS INSTALL SCRIPTS THROUGH THIS GRANT (TERM-1157). This comment used
    // to say install "already runs with `--ignore-scripts`". That is true of
    // `apps/merge-agent` (`src/sandbox/plan.ts` adds the flag on every branch)
    // and false of `th run`: `packages/envspec/src/manifest.ts` derives a plain
    // `npm ci`, so there every dependency's `preinstall`/`install`/`postinstall`
    // executes behind this proxy. TERM-1157 chose to keep them running.
    //
    // For `th run`, then, the grant reaches code the repo's dependencies chose,
    // not only the package manager. What bounds it:
    //   - no credential of ours is in the fence: `auditEnv` (`env.ts`) refuses to
    //     spawn when a variable's name or a GitHub-token-shaped value says
    //     otherwise, so a script cannot act on GitHub as us;
    //   - the fence holds the repo's tree and its dependencies, nothing else of
    //     ours;
    //   - every step after install runs with no network at all.
    // What it does NOT bound: a script can download and run any public GitHub
    // content, and one that brings its author's own token can push what the
    // fence holds to its author's account. `registry.npmjs.org` above gives the
    // same script the same reach (download anything, publish with its own
    // token), so this entry adds a second address for a capability the install
    // already has rather than a new one. That is the case for keeping it; it is
    // not a claim that GitHub is read-only from here.
    'github.com',
];
/**
 * Is this host permitted?
 *
 * Suffix matching is anchored on a dot so that `evil-registry.npmjs.org.attacker.com`
 * cannot pass as `registry.npmjs.org` — a plain `endsWith` would let it, which is
 * the classic allowlist bypass.
 */
export function hostAllowed(host, allow) {
    const h = host.toLowerCase().replace(/\.$/, '');
    return allow.some((entry) => {
        const e = entry.toLowerCase().replace(/^\./, '');
        return h === e || h.endsWith(`.${e}`);
    });
}
/**
 * The sidecar's record of one refusal, one line on stdout (TERM-1157).
 *
 * Defined here rather than in `container.ts` because the sidecar mounts only
 * this file and `proxyEntry.js`, so the writer and `parseDeniedHosts` must live
 * where both ends can import them.
 */
const DENIAL_PREFIX = 'proxy-denied ';
export function formatDenialLine(e) {
    return `${DENIAL_PREFIX}${JSON.stringify({ host: e.host, port: e.port })}`;
}
/** A DNS name: letters, digits, dots and hyphens, at most 253 characters. */
const HOSTNAME = /^[a-z0-9](?:[a-z0-9.-]{0,251}[a-z0-9])?$/;
/**
 * The refused hosts in a sidecar's output, lowercased, deduplicated, first seen
 * first.
 *
 * The workload chooses what it CONNECTs to, so each host is repo-controlled text
 * that ends up in a sentence a poster reads. Anything that is not a hostname is
 * dropped rather than escaped: a name we cannot print as-is tells the reader
 * nothing a package author could act on.
 */
export function parseDeniedHosts(output) {
    const seen = new Set();
    for (const line of output.split(/\r?\n/)) {
        if (!line.startsWith(DENIAL_PREFIX))
            continue;
        let parsed;
        try {
            parsed = JSON.parse(line.slice(DENIAL_PREFIX.length));
        }
        catch {
            continue;
        }
        const host = parsed?.host;
        if (typeof host !== 'string')
            continue;
        const h = host.toLowerCase().replace(/\.$/, '');
        if (HOSTNAME.test(h))
            seen.add(h);
    }
    return [...seen];
}
export function startEgressProxy(opts = {}) {
    const allow = opts.allow ?? DEFAULT_INSTALL_ALLOWLIST;
    const log = [];
    const server = http.createServer((_req, res) => {
        // Plain HTTP is not proxied at all: everything a package manager fetches is
        // HTTPS, and supporting cleartext would add a second code path to audit.
        res.writeHead(405, { 'content-type': 'text/plain' });
        res.end('this proxy tunnels CONNECT only\n');
    });
    server.on('connect', (req, clientSocket, head) => {
        const [host, portRaw] = String(req.url ?? '').split(':');
        const port = Number(portRaw || 443);
        const permitted = !opts.denyAll && !!host && hostAllowed(host, allow);
        const event = {
            host: host ?? '',
            port,
            allowed: permitted,
            at: new Date().toISOString(),
        };
        log.push(event);
        if (!permitted) {
            opts.onDenied?.(event);
            clientSocket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
            clientSocket.destroy();
            return;
        }
        const upstream = net.connect(port, host, () => {
            clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
            if (head?.length)
                upstream.write(head);
            upstream.pipe(clientSocket);
            clientSocket.pipe(upstream);
        });
        upstream.on('error', () => {
            clientSocket.write('HTTP/1.1 502 Bad Gateway\r\n\r\n');
            clientSocket.destroy();
        });
        clientSocket.on('error', () => upstream.destroy());
    });
    return new Promise((resolve, reject) => {
        server.once('error', reject);
        // Default 127.0.0.1: for the seatbelt tier, binding 0.0.0.0 would expose the
        // proxy to the network the fence exists to keep the child off. The container
        // tier overrides to 0.0.0.0 — see ProxyOptions.host for why that is safe
        // there and nowhere else.
        server.listen(opts.port ?? 0, opts.host ?? '127.0.0.1', () => {
            const address = server.address();
            if (typeof address === 'string' || address === null) {
                reject(new Error('proxy bound to a non-TCP address'));
                return;
            }
            resolve({
                port: address.port,
                log,
                close: () => new Promise((done) => {
                    server.closeAllConnections?.();
                    server.close(() => done());
                }),
            });
        });
    });
}
