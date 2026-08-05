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
    'pypi.org',
    'files.pythonhosted.org',
    'proxy.golang.org',
    'sum.golang.org',
    'static.crates.io',
    'index.crates.io',
    'crates.io',
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
    // release assets and raw blobs stay denied. If a real install needs them,
    // that should arrive as a measured egress denial, not a pre-emptive guess.
    //
    // Proportionality: install already runs with `--ignore-scripts`, and the
    // fenced environment carries no GitHub token, so the added capability is
    // "fetch a public tarball or ref", not "act as us".
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
        log.push({ host: host ?? '', port, allowed: permitted, at: new Date().toISOString() });
        if (!permitted) {
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
