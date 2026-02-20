import { init, initHttp, initWs } from '@init';
import {
	fallback,
	handleSubscriptions,
	handleLogin,
	logout,
	renderError,
	handleWebsocket,
	handleDoH,
	handleApi
} from '@handlers';
import { Authenticate } from '@auth';

let staticAssets: Record<string, string> | null = null;

function getMimeType(filename: string): string {
	if (filename.endsWith('.html')) return 'text/html';
	if (filename.endsWith('.css')) return 'text/css';
	if (filename.endsWith('.js')) return 'application/javascript';
	if (filename.endsWith('.json')) return 'application/json';
	if (filename.endsWith('.png')) return 'image/png';
	if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
	if (filename.endsWith('.gif')) return 'image/gif';
	if (filename.endsWith('.svg')) return 'image/svg+xml';
	if (filename.endsWith('.ico')) return 'image/x-icon';
	if (filename.endsWith('.woff')) return 'font/woff';
	if (filename.endsWith('.woff2')) return 'font/woff2';
	if (filename.endsWith('.ttf')) return 'font/ttf';
	if (filename.endsWith('.eot')) return 'application/vnd.ms-fontobject';
	if (filename.endsWith('.otf')) return 'font/otf';
	if (filename.endsWith('.wasm')) return 'application/wasm';
	// Default to application/octet-stream if unsure
	return 'application/octet-stream';
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
	const pathname = url.pathname;

	// Authentication Check
	// We protect everything under /panel except:
	// 1. /panel/login (The login page itself)
	// 2. /_next/static resources (CSS, JS, Images needed for login page) - usually fetched as /_next/...
	// 3. /favicon.ico (Browser often requests this)

	// Note: The worker serves /_next assets via handlePanel as well if they come through /panel?
	// Actually next assets are usually at /_next/..., not /panel/_next/... unless basePath is enforced strictly on assets too.
	// Login page will be at /panel/login.

	const isLogin = pathname === '/panel/login' ||
		pathname === '/panel/login/' ||
		pathname === '/panel/login.html' ||
		pathname === '/panel/login.txt';
	const isAsset = pathname.includes('/_next/') || pathname.includes('/static/') || pathname.endsWith('.ico') || pathname.endsWith('.css') || pathname.endsWith('.js') || pathname.endsWith('.png') || pathname.endsWith('.svg');

	if (!isLogin && !isAsset) {
		// Check if authenticated
		const auth = await Authenticate(request, env);
		if (!auth) {
			// Redirect to login
			// We need to know the base path. Assuming /panel/login
			const loginUrl = new URL(url);
			loginUrl.pathname = '/panel/login';
			return Response.redirect(loginUrl.toString(), 302);
		}
	}

	// Helper to try finding asset
	const tryFindAsset = (path: string): string | null => {
		// exact match
		if (staticAssets![path]) return path;
		// .html extension
		if (staticAssets![path + '.html']) return path + '.html';
		// index.html
		if (path.endsWith('/') && staticAssets![path + 'index.html']) return path + 'index.html';
		if (staticAssets![path + '/index.html']) return path + '/index.html';

		return null;
	}

	let assetKey: string | null = null;

	// 1. Try stripping /panel if present (standard case for pages)
	// The build script stores keys like /dashboard.html, /index.html
	const panelIndex = pathname.indexOf('/panel');
	let cleanStripped = pathname;
	if (panelIndex !== -1) {
		const stripped = pathname.slice(panelIndex + '/panel'.length);
		// If stripped is empty/root, it should be index
		cleanStripped = (stripped === '' || stripped === '/') ? '/index.html' : stripped;
		assetKey = tryFindAsset(cleanStripped);
	}

	// 2. RSC Payload Fix: Next.js requests usage/__next.usage.__PAGE__.txt but it is usage/__next.usage/__PAGE__.txt on disk
	if (!assetKey && cleanStripped.endsWith('.__PAGE__.txt')) {
		const rewritten = cleanStripped.replace('.__PAGE__.txt', '/__PAGE__.txt');
		assetKey = tryFindAsset(rewritten);
	}

	// 3. Fallback: try original pathname (in case routing is weird)
	if (!assetKey) {
		assetKey = tryFindAsset(pathname);
		// Also try RSC fix on original pathname
		if (!assetKey && pathname.endsWith('.__PAGE__.txt')) {
			const rewritten = pathname.replace('.__PAGE__.txt', '/__PAGE__.txt');
			assetKey = tryFindAsset(rewritten);
		}
	}

	// 4. Special case for defaults
	if (!assetKey && (pathname.endsWith('/panel') || pathname.endsWith('/panel/'))) {
		assetKey = tryFindAsset('/index.html');
	}

	// 5. Hard 404 check or SPA fallback
	if (!assetKey) {
		// If it's a page navigation (no extension), serve 404 or maybe index (but next export usually relies on .html for pages)
		if (staticAssets!['/404.html']) {
			assetKey = '/404.html';
			// Return 404 status
		} else {
			return new Response("Not Found", { status: 404 });
		}
	}

	const contentBase64 = staticAssets![assetKey];
	// If we fell back to 404.html but it wasn't found (should be covered above), double check
	if (!contentBase64) {
		return new Response("Not Found", { status: 404 });
	}

	// Decompress the asset on the fly
	const bytes = Uint8Array.from(atob(contentBase64), c => c.charCodeAt(0));
	const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));

	// Determine status: if we served 404.html because the original wasn't found, status 404.
	// However, if the request was actually FOR /404.html (unlikely), it should be 200? 
	// Usually 404 page is served with 404 status.
	const status = (assetKey === '/404.html' && pathname !== '/404.html') ? 404 : 200;

	return new Response(stream, {
		headers: {
			'Content-Type': getMimeType(assetKey),
			'Cache-Control': assetKey.startsWith('/_next/') ? 'public, max-age=31536000, immutable' : 'public, max-age=86400',
		},
		status
	});
}

export default {
	async fetch(request: Request, env: Env) {
		try {
			const upgradeHeader = request.headers.get('Upgrade');
			init(request, env);

			if (upgradeHeader === 'websocket') {
				initWs(env);
				return await handleWebsocket(request);
			} else {
				initHttp(request, env);
				const { pathName } = globalThis.globalConfig;
				const path = pathName.split('/')[1];

				switch (path) {
					case 'panel':
						return await handlePanel(request, env);

					case 'sub':
						return await handleSubscriptions(request, env);

					case 'login':
						return await handleLogin(request, env);

					case 'logout':
						return logout();

					case `dns-query`:
						return await handleDoH(request);

					case 'api':
						return await handleApi(request, env);



					default:
						return await fallback(request);
				}
			}
		} catch (error) {
			return await renderError(error);
		}
	}
}