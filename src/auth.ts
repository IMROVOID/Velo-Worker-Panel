import { SignJWT, jwtVerify } from 'jose';
import { HttpStatus, respond } from '@common';

export async function generateJWTToken(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
        return respond(false, 405, 'Method not allowed.');
    }

    let username, password;
    try {
        const body = await request.json() as any;
        username = body.username;
        password = body.password;
    } catch (e) {
        return respond(false, HttpStatus.BAD_REQUEST, 'Invalid request body.');
    }

    if (!username || !password) {
        return respond(false, HttpStatus.BAD_REQUEST, 'Username and Password are required.');
    }

    const { userID, TrPass } = globalThis.globalConfig;
    const savedPass = await env.kv.get('pwd');

    // Default username is the UUID if not set otherwise (but logic implies UUID is the admin ID)
    // If globalConfig.userID is not set (unlikely via setup), we might fallback, but setup guarantees it.
    if (username !== userID) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Invalid Username.');
    }

    const validPassword = savedPass || TrPass;
    if (password !== validPassword) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Invalid Password.');
    }

    let secretKey = await env.kv.get('secretKey');

    if (!secretKey) {
        secretKey = generateSecretKey();
        await env.kv.put('secretKey', secretKey);
    }

    const secret = new TextEncoder().encode(secretKey);

    const jwtToken = await new SignJWT({ userID })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);

    return respond(true, HttpStatus.OK, 'Successfully logged in', null, {
        'Set-Cookie': `jwtToken=${jwtToken}; HttpOnly; Secure; Max-Age=${24 * 60 * 60}; Path=/; SameSite=Strict`,
        'Content-Type': 'application/json',
    });
}

function generateSecretKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);

    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function Authenticate(request: Request, env: Env): Promise<boolean> {
    try {
        const secretKey = await env.kv.get('secretKey');

        if (secretKey === null) {
            console.log("Secret key not found in KV.");
            return false;
        }

        const secret = new TextEncoder().encode(secretKey);
        const cookie = request.headers.get('Cookie')?.match(/(^|;\s*)jwtToken=([^;]*)/);
        const token = cookie ? cookie[2] : null;

        if (!token) {
            console.log('Unauthorized: Token not available!');
            return false;
        }

        const { payload } = await jwtVerify(token, secret);
        console.log(`Successfully authenticated, User ID: ${payload.userID}`);

        return true;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(message);
        return false;
    }
}

export async function resetPassword(request: Request, env: Env): Promise<Response> {
    let auth = await Authenticate(request, env);
    const oldPwd = await env.kv.get('pwd');

    if (oldPwd && !auth) {
        return respond(false, HttpStatus.UNAUTHORIZED, 'Unauthorized.');
    }

    const newPwd = await request.text();
    if (newPwd === oldPwd) {
        return respond(false, HttpStatus.BAD_REQUEST, 'Please enter a new Password.');
    }

    await env.kv.put('pwd', newPwd);

    return respond(true, HttpStatus.OK, 'Successfully logged in!', null, {
        'Set-Cookie': 'jwtToken=; Path=/; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'Content-Type': 'text/plain',
    });
}