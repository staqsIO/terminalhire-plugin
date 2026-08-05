/**
 * proxyEntry.ts — the egress proxy, as a container's main process.
 *
 * The container tier (TERM-78 P3) cannot reach the host-loopback proxy the
 * seatbelt tier uses (a `--network=none`/`--internal` guest has no route to the
 * host's 127.0.0.1). So the proxy runs as its OWN throwaway container on the
 * isolated internal network, and this module is what it runs — the SAME
 * `startEgressProxy` the seatbelt path uses, bound to 0.0.0.0 so the workload
 * container reaches it over the internal network. Reusing the audited proxy
 * rather than a second implementation is the point: there is one allowlist
 * chokepoint, one matcher, one place to review.
 *
 * Config arrives by env, because the argv of a `docker run` is world-visible in
 * `docker inspect` and the audit trail, and an allowlist is not a secret but a
 * long list is noise there:
 *   PROXY_PORT   — the port to listen on (required; the caller pins it so it can
 *                  wire HTTPS_PROXY without a round-trip to read an ephemeral one)
 *   PROXY_ALLOW  — comma-separated allowlist; empty/unset means DENY ALL, which
 *                  is the discriminator the offline-egress checks depend on
 *
 * It binds 0.0.0.0 by construction (see ProxyOptions.host): only ever correct
 * inside a container whose networks hold nothing but our own containers.
 */
import { startEgressProxy } from './egressProxy.js';
async function main() {
    const port = Number(process.env.PROXY_PORT);
    if (!Number.isInteger(port) || port <= 0 || port > 65535) {
        console.error(`proxyEntry: PROXY_PORT must be a valid port, got ${JSON.stringify(process.env.PROXY_PORT)}`);
        process.exit(2);
    }
    const raw = (process.env.PROXY_ALLOW ?? '').trim();
    const allow = raw.length > 0
        ? raw
            .split(',')
            .map((h) => h.trim())
            .filter(Boolean)
        : [];
    const denyAll = allow.length === 0;
    await startEgressProxy({ host: '0.0.0.0', port, allow, denyAll });
    // Announce readiness on a line the launcher waits for before starting the
    // workload — a proxy the workload races ahead of is a spurious egress failure.
    console.log(`proxy-ready port=${port} allow=${allow.length} denyAll=${denyAll}`);
    // Keep the event loop alive; the container is torn down by the launcher.
    setInterval(() => { }, 1 << 30);
}
void main();
