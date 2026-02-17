import { Authenticate, generateJWTToken, resetPassword } from "auth";
import { getDataset, updateDataset } from "kv";
import { setSettings } from "@init";
import { getClNormalConfig, getClWarpConfig } from "@clash/configs";
import { getSbCustomConfig, getSbWarpConfig } from "@sing-box/configs";
import { getXrCustomConfigs, getXrWarpConfigs } from "@xray/configs";
import { fetchWarpAccounts } from "@warp";
import { VlOverWSHandler } from "@vless";
import { TrOverWSHandler } from "@trojan";
import JSZip from "jszip";
import { HttpStatus, respond } from "@common";

export async function handleWebsocket(request: Request): Promise<Response> {
    const { pathName } = globalThis.globalConfig;
    const encodedPathConfig = pathName.replace("/", "");

    try {
        const { protocol, mode, panelIPs } = JSON.parse(atob(encodedPathConfig));
        globalThis.wsConfig = {
            ...globalThis.wsConfig,
            wsProtocol: protocol,
            proxyMode: mode,
            panelIPs: panelIPs
        };

        switch (protocol) {
            case 'vl':
                return await VlOverWSHandler(request);

            case 'tr':
                return await TrOverWSHandler(request);

            default:
                return await fallback(request);
        }

    } catch (error) {
        return new Response('Failed to parse WebSocket path config', { status: HttpStatus.BAD_REQUEST });
    }
}


let staticAssets: Record<string, string> | null = null;

function getMimeType(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'html': return 'text/html; charset=utf-8';
        case 'css': return 'text/css; charset=utf-8';
        case 'js': return 'application/javascript; charset=utf-8';
        case 'json': return 'application/json; charset=utf-8';
        case 'png': return 'image/png';
        case 'jpg': case 'jpeg': return 'image/jpeg';
        case 'svg': return 'image/svg+xml';
        case 'ico': return 'image/x-icon';
        case 'txt': return 'text/plain; charset=utf-8';
        default: return 'application/octet-stream';
    }
}

export async function handlePanel(request: Request, env: Env): Promise<Response> {
    if (!staticAssets) {
        try {
            // @ts-ignore
            staticAssets = JSON.parse(__STATIC_ASSETS__);
        } catch (e) {
            console.error("Failed to parse static assets", e);
            return new Response("Internal Server Error: Assets Corrupted", { status: 500 });
        }
    }

    const url = new URL(request.url);
    let pathname = url.pathname;

    // Handle basePath stripping
    // The worker might be receiving requests at /root/path/panel/...
    // globalConfig.pathName is the configured path, e.g. /uuid/panel
    // So we should verify if the request starts with this path.
    // The request usually matches the worker route.

    // Simpler approach: check if it starts with /panel (from next.config.ts)
    // If we are serving from a subpath defined in globalConfig, we need to respect that.
    // But for now, let's assume the request comes in as /.../panel/...

    // If the pathName (config) is used for routing in worker.ts, we are here because a switch matched.
    // We can try to look up the asset relative to the panel root.

    // If pathName is "/secret/panel", and request is "/secret/panel/dashboard",
    // we want "/dashboard.html".

    const { pathName } = globalThis.globalConfig;
    if (pathname.startsWith(pathName)) {
        pathname = pathname.slice(pathName.length);
    } else if (pathname.startsWith('/panel')) {
        pathname = pathname.slice('/panel'.length);
    }

    if (pathname === '' || pathname === '/') {
        pathname = '/index.html';
    }

    // Try exact match first
    let assetKey = pathname;
    if (staticAssets![assetKey]) {
        // found
    } else if (staticAssets![pathname + '.html']) {
        // try adding .html (e.g. /dashboard -> /dashboard.html)
        assetKey = pathname + '.html';
    } else if (pathname.endsWith('/') && staticAssets![pathname + 'index.html']) {
        assetKey = pathname + 'index.html';
    } else {
        // Not found
        // If it's a navigation request, maybe 404.html?
        if (staticAssets!['/404.html']) {
            assetKey = '/404.html';
            // We should probably return 404 status, but for SPA it might be different.
            // Next.js static export: 404.html is just a page.
        } else {
            return new Response("Not Found", { status: 404 });
        }
    }

    const contentBase64 = staticAssets![assetKey];
    if (!contentBase64) {
        return new Response("Not Found", { status: 404 });
    }

    const body = Uint8Array.from(atob(contentBase64), c => c.charCodeAt(0));

    return new Response(body, {
        headers: {
            'Content-Type': getMimeType(assetKey),
            'Content-Encoding': 'gzip',
            'Cache-Control': 'public, max-age=86400',
        },
        status: assetKey === '/404.html' ? 404 : 200
    });
}

export async function renderError(error: any): Promise<Response> {
    const message = error instanceof Error ? error.message : String(error);
    // Use the bundled 404 or error page if available, or fallback to simple text
    // for now just simple text to avoid complexity
    return new Response(`Error: ${message}`, {
        status: HttpStatus.OK,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
}


export async function handleLogin(request: Request, env: Env): Promise<Response> {
    const { pathName } = globalThis.globalConfig;
    const { urlOrigin } = globalThis.httpConfig;

    if (pathName === '/login') {
        const auth = await Authenticate(request, env);
        if (auth) {
            return Response.redirect(`${urlOrigin}/panel`, 302);
        }
        return Response.redirect(`${urlOrigin}/panel/login`, 302);
    }

    if (pathName === '/login/authenticate') {
        return await generateJWTToken(request, env);
    }

    return await fallback(request);
}

export function logout(): Response {
    return respond(true, HttpStatus.OK, 'Successfully logged out!', null, {
        'Set-Cookie': 'jwtToken=; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'Content-Type': 'text/plain'
    });
}

export async function handleSubscriptions(request: Request, env: Env): Promise<Response> {
    await setSettings(request, env);
    const {
        globalConfig: { pathName },
        httpConfig: { client, subPath }
    } = globalThis;

    switch (pathName) {
        case `/sub/normal/${subPath}`:
            switch (client) {
                case 'xray':
                    return await getXrCustomConfigs(false);

                case 'sing-box':
                    return await getSbCustomConfig(false);

                case 'clash':
                    return await getClNormalConfig();

                default:
                    break;
            }

        case `/sub/fragment/${subPath}`:
            switch (client) {
                case 'xray':
                    return await getXrCustomConfigs(true);

                case 'sing-box':
                    return await getSbCustomConfig(true);

                default:
                    break;
            }

        case `/sub/warp/${subPath}`:
            switch (client) {
                case 'xray':
                    return await getXrWarpConfigs(request, env, false, false);

                case 'sing-box':
                    return await getSbWarpConfig(request, env);

                case 'clash':
                    return await getClWarpConfig(request, env, false);

                default:
                    break;
            }

        case `/sub/warp-pro/${subPath}`:
            switch (client) {
                case 'xray':
                    return await getXrWarpConfigs(request, env, true, false);

                case 'xray-knocker':
                    return await getXrWarpConfigs(request, env, true, true);

                case 'clash':
                    return await getClWarpConfig(request, env, true);

                default:
                    break;
            }

        default:
            return await fallback(request);
    }
}

async function updateSettings(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'PUT') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed.');
    }

    const auth = await Authenticate(request, env);

    if (!auth) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
    }

    const proxySettings = await updateDataset(request, env);
    return respond(true, HttpStatus.OK, '', proxySettings);
}

async function resetSettings(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowed!');
    }

    const auth = await Authenticate(request, env);

    if (!auth) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.');
    }

    try {
        const { settings } = globalThis;
        await env.kv.put("proxySettings", JSON.stringify(settings));
        return respond(true, HttpStatus.OK, '', settings);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(error);
        throw new Error(`An error occurred while updating KV: ${message}`);
    }
}

async function getSettings(request: Request, env: Env): Promise<Response> {
    const isPassSet = Boolean(await env.kv.get('pwd'));
    const auth = await Authenticate(request, env);

    if (!auth) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized or expired session.', { isPassSet });
    }

    const dataset = await getDataset(request, env);
    const { subPath } = globalThis.httpConfig;

    const data = {
        proxySettings: dataset.settings,
        isPassSet,
        subPath: subPath
    };

    return respond(true, HttpStatus.OK, undefined, data);
}

export async function fallback(request: Request): Promise<Response> {
    const { fallbackDomain } = globalThis.globalConfig;
    const { url, method, headers, body } = request;

    const newURL = new URL(url);
    newURL.hostname = fallbackDomain;
    newURL.protocol = 'https:';
    const newRequest = new Request(newURL.toString(), {
        method,
        headers,
        body,
        redirect: 'manual'
    });

    return await fetch(newRequest);
}

async function getMyIP(request: Request): Promise<Response> {
    const ip = await request.text();

    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?nocache=${Date.now()}`);
        const geoLocation = await response.json();

        return respond(true, HttpStatus.OK, '', geoLocation);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Error fetching IP address:', error);
        return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, `Error fetching IP address: ${message}`)
    }
}

async function getWarpConfigs(request: Request, env: Env): Promise<Response> {
    const {
        httpConfig: { client },
        dict: { _project_ }
    } = globalThis;

    const isPro = client === 'amnezia';
    const auth = await Authenticate(request, env);

    if (!auth) {
        return new Response('Unauthorized or expired session.', { status: HttpStatus.UNAUTHORIZED });
    }

    const { warpAccounts, settings } = await getDataset(request, env);
    const { warpIPv6, publicKey, privateKey } = warpAccounts[0];
    const {
        warpEndpoints,
        warpRemoteDNS,
        amneziaNoiseCount,
        amneziaNoiseSizeMin,
        amneziaNoiseSizeMax
    } = settings;

    const zip = new JSZip();
    const trimLines = (str: string) => str.split("\n").map(line => line.trim()).join("\n");

    try {
        warpEndpoints?.forEach((endpoint, index) => {
            const config =
                `[Interface]
                PrivateKey = ${privateKey}
                Address = 172.16.0.2/32, ${warpIPv6}
                DNS = ${warpRemoteDNS}
                MTU = 1280
                ${isPro ?
                    `Jc = ${amneziaNoiseCount}
                    Jmin = ${amneziaNoiseSizeMin}
                    Jmax = ${amneziaNoiseSizeMax}
                    S1 = 0
                    S2 = 0
                    H1 = 0
                    H2 = 0
                    H3 = 0
                    H4 = 0`
                    : ''
                }
                [Peer]
                PublicKey = ${publicKey}
                AllowedIPs = 0.0.0.0/0, ::/0
                Endpoint = ${endpoint}
                PersistentKeepalive = 25`;

            zip.file(`${_project_}-Warp-${index + 1}.conf`, trimLines(config));
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const arrayBuffer = await zipBlob.arrayBuffer();

        return new Response(arrayBuffer, {
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${_project_}-Warp-${isPro ? "Pro-" : ""}configs.zip"`,
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return new Response(`Error generating ZIP file: ${message}`, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}

export async function serveIcon(): Promise<Response> {
    const faviconBase64 = __ICON__;
    const body = Uint8Array.from(atob(faviconBase64), c => c.charCodeAt(0));

    return new Response(body, {
        headers: {
            'Content-Type': 'image/x-icon',
            'Cache-Control': 'public, max-age=86400',
        }
    });
}


// renderPanel, renderLogin, renderSecrets and decompressHtml removed as they are replaced by static asset serving


async function updateWarpConfigs(request: Request, env: Env): Promise<Response> {
    if (request.method === 'POST') {
        const auth = await Authenticate(request, env);

        if (!auth) {
            return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized.');
        }

        try {
            await fetchWarpAccounts(env);
            return respond(true, HttpStatus.OK, 'Warp configs updated successfully!');
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log(error);
            return respond(false, HttpStatus.INTERNAL_SERVER_ERROR, `An error occurred while updating Warp configs: ${message}`);
        }
    }

    return respond(false, HttpStatus.METHOD_NOT_ALLOWED, 'Method not allowd.');
}

async function decompressHtml(content: string, asString: boolean): Promise<string | ReadableStream<Uint8Array>> {
    const bytes = Uint8Array.from(atob(content), c => c.charCodeAt(0));
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));

    if (asString) {
        const decompressedArrayBuffer = await new Response(stream).arrayBuffer();
        const decodedString = new TextDecoder().decode(decompressedArrayBuffer);
        return decodedString;
    }

    return stream;
}

export async function handleDoH(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const { subPath } = globalThis.httpConfig;
    const { dohURL } = globalThis.globalConfig;

    if (url.pathname !== `/dns-query/${subPath}`) {
        return fallback(request);
    }

    const targetURL = new URL(dohURL);
    url.searchParams.forEach((value, key) => {
        targetURL.searchParams.set(key, value);
    });

    const proxyRequest = new Request(targetURL.toString(), request);
    return fetch(proxyRequest);
}
