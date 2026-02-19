import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';
import { build } from 'esbuild';
import { globSync } from 'glob';
import { minify as jsMinify } from 'terser';
import { minify as htmlMinify } from 'html-minifier';
import JSZip from "jszip";
import obfs from 'javascript-obfuscator';
import pkg from '../package.json' with { type: 'json' };
import { gzipSync } from 'zlib';

const env = process.env.NODE_ENV || 'mangle';
const mangleMode = env === 'mangle';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);

const ASSET_PATH = join(__dirname, '../src/assets');
const DIST_PATH = join(__dirname, '../dist/');

const green = '\x1b[32m';
const red = '\x1b[31m';
const reset = '\x1b[0m';

const success = `${green}✔${reset}`;
const failure = `${red}✗${reset}`;

const version = pkg.version;

const FRONTEND_OUT_DIR = join(__dirname, '../src/frontend/out');

async function processNextJsAssets() {
    const assetFiles = globSync('**/*', { cwd: FRONTEND_OUT_DIR, nodir: true });
    const result = {};

    for (const relativePath of assetFiles) {
        const fullPath = join(FRONTEND_OUT_DIR, relativePath);
        const fileContent = readFileSync(fullPath);

        const compressed = gzipSync(fileContent);
        const base64 = compressed.toString('base64');

        // Normalize path for web (forward slashes, start with /)
        const webPath = '/' + relativePath.split(pathDirname(relativePath).split(pathDirname(relativePath)[0])[0]).join('/').replace(/\\/g, '/');
        // Actually, just simple replacement is safer
        const normalizedPath = '/' + relativePath.replace(/\\/g, '/');

        // key matching logic in worker seems to rely on exact paths or appending .html
        // We store it directly as string
        result[normalizedPath] = base64;
    }

    console.log(`${success} Next.js assets bundled successfuly!`);
    return result;
}

// ... helper functions like generateJunkCode remain ...
function generateJunkCode() {
    const minVars = 50, maxVars = 500;
    const minFuncs = 50, maxFuncs = 500;

    const varCount = Math.floor(Math.random() * (maxVars - minVars + 1)) + minVars;
    const funcCount = Math.floor(Math.random() * (maxFuncs - minFuncs + 1)) + minFuncs;

    const junkVars = Array.from({ length: varCount }, (_, i) => {
        const varName = `__junk_${Math.random().toString(36).substring(2, 10)}_${i}`;
        const value = Math.floor(Math.random() * 100000);
        return `let ${varName} = ${value};`;
    }).join('\n');

    const junkFuncs = Array.from({ length: funcCount }, (_, i) => {
        const funcName = `__junkFunc_${Math.random().toString(36).substring(2, 10)}_${i}`;
        return `function ${funcName}() { return ${Math.floor(Math.random() * 1000)}; }`;
    }).join('\n');

    return `${junkVars}\n${junkFuncs}\n`;
}

async function buildWorker() {

    // First, ensure frontend is built (optional, can be manual)
    // For now we assume npm run build was run in src/frontend

    const assets = await processNextJsAssets();
    const assetsString = JSON.stringify(assets); // This might be huge, check size limits

    const code = await build({
        entryPoints: [join(__dirname, '../src/worker.ts')],
        bundle: true,
        format: 'esm',
        write: false,
        external: ['cloudflare:sockets'],
        platform: 'browser',
        target: 'esnext',
        loader: { '.ts': 'ts' },
        define: {
            __STATIC_ASSETS__: JSON.stringify(assetsString),
            __VERSION__: JSON.stringify(version)
        }
    });

    console.log(`${success} Worker built successfuly!`);

    const minifyCode = async (code) => {
        const minified = await jsMinify(code, {
            module: true,
            output: {
                comments: false
            },
            compress: {
                dead_code: false,
                unused: false
            }
        });

        console.log(`${success} Worker minified successfuly!`);
        return minified;
    }

    let finalCode;

    if (mangleMode) {
        const junkCode = generateJunkCode();
        const minifiedCode = await minifyCode(junkCode + code.outputFiles[0].text);
        finalCode = minifiedCode.code;
    } else {
        const minifiedCode = await minifyCode(code.outputFiles[0].text);
        const obfuscationResult = obfs.obfuscate(minifiedCode.code, {
            stringArrayThreshold: 1,
            stringArrayEncoding: [
                "rc4"
            ],
            numbersToExpressions: true,
            transformObjectKeys: true,
            renameGlobals: true,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.2,
            target: "browser"
        });

        console.log(`${success} Worker obfuscated successfuly!`);
        finalCode = obfuscationResult.getObfuscatedCode();
    }

    const buildTimestamp = new Date().toISOString();
    const buildInfo = `// Build: ${buildTimestamp}\n`;
    const worker = `${buildInfo}// @ts-nocheck\n${finalCode}`;
    mkdirSync(DIST_PATH, { recursive: true });
    writeFileSync('./dist/worker.js', worker, 'utf8');

    const zip = new JSZip();
    zip.file('_worker.js', worker);
    zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE'
    }).then(nodebuffer => writeFileSync('./dist/worker.zip', nodebuffer));

    console.log(`${success} Done!`);
}

buildWorker().catch(err => {
    console.error(`${failure} Build failed:`, err);
    process.exit(1);
});

