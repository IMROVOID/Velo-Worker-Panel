# Velo Panel

## 🌏 Readme in [Farsi](README_fa.md)

## Introduction

This project is aimed to provide a user panel to access FREE, SECURE and PRIVATE **VLESS**, **Trojan** and **Warp** configs, It ensures connectivity even when domains or Warp services are blocked by ISPs, offering two deployment options:

- **Workers** deployment
- **Pages** deployment (Velo Panel Frontend)

## Features

1. **Free and Private**: No costs involved and the server is private.
2. **Intuitive Panel:** Streamlined for effortless navigation, configuration and use.
3. **Versatile Protocols:** Provides VLESS, Trojan and Wireguard (Warp) protocols.
4. **Warp Pro configs:** Optimized Warp for crucial circumstances.
5. **Fragment support:** Supports Fragment functionality for crucial network situations.
6. **Comprehensive Routing Rules:** Bypassing Iran/China/Russia, Blocking QUIC, Porn, Ads, Malwares, Phishing and also bypassing sanctions.
7. **Chain Proxy:** Capable of adding a chain proxy (VLESS, Trojan, Shadowsocks, socks and http) to fix IP.
8. **Broad client compatibility:** Offers subscription links for Xray, Sing-box and Clash-Mihomo core clients.
9. **Password-protected panel:** Provides secure and private panel with password protection.
10. **Fully customizable:** Supports setting up clean IP-domains, Proxy IPs, DNS servers, choosing ports and protocols, Warp endpoints and more.
11. **Custom Branding:** Option to set custom names for Worker and KV storage during setup.

## Limitations

1. **UDP transport**: VLESS and Trojan protocols on workers do not handle **UDP** properly, so it is disabled by default (affecting features like Telegram video calls), UDP DNS is also unsupported. DoH is enabled by default for enhanced security.
2. **Request limit**: each worker supports 100K requests per day for VLESS and Trojan, suitable for 2-3 users. You can use limitless Warp configs.

## Installation & Deployment

### Cloudflare Workers Deployment

Here are two ways to deploy your worker. The **Easy** method is highly recommended for everyone.

**Prerequisites:**
Before you begin, ensure you have [Node.js](https://nodejs.org/en/download/) installed on your computer.
Open your terminal (or command prompt), clone or download this repository, navigate to the folder, and install the required packages:

```bash
# 1. Open the project folder
# 2. Install dependencies (First time only)
npm install
```

#### Method 1: Easy Setup & Deployment (Recommended)

We have included an interactive wizard that handles everything for you automatically—from logging in to Cloudflare, generating secure credentials, and deploying the panel.

```bash
npm run setup
```

*Just follow the prompts on your screen!*

#### Method 2: Manual Installation

If you prefer to configure everything yourself from the Cloudflare Dashboard:

1. Build the unified Worker file by running `npm run build`. This generates a `dist/worker.js` file.
2. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com) and create a new **Worker**.
3. Copy the contents of `dist/worker.js` and paste it into your new Worker's code editor, then deploy it.
4. Go to **Workers & Pages** -> **KV** and create a new namespace (e.g., `secure-storage`).
5. Go back to your Worker's **Settings** -> **Variables**, and under **KV Namespace Bindings**, add a binding named `kv` pointing to the namespace you just created.
6. Open your Worker's URL (e.g. `https://your-worker.subdomain.workers.dev/panel`).
7. **Don't worry about setting up passwords just yet!** The panel is smart enough to detect that you haven't set up the `UUID` and `TR_PASS` environment variables. It will automatically generate secure credentials for you and show you exactly how to copy and paste them into your Cloudflare Dashboard's Environment Variables section.

#### Local Development (Optional)

To test the worker locally with a live-reloading panel and pinned credentials:

```bash
npm run worker:dev
```

### GitHub Pages

The frontend is automatically deployed to GitHub Pages via GitHub Actions on push to `main`.

- **Live URL**: [https://IMROVOID.github.io/Velo-Worker-Panel/](https://IMROVOID.github.io/Velo-Worker-Panel/)

## Getting started

- [Installation methods](https://IMROVOID.github.io/Velo-Worker-Panel/installation/wizard/)
- [Configuration](https://IMROVOID.github.io/Velo-Worker-Panel/configuration/)
- [How to use](https://IMROVOID.github.io/Velo-Worker-Panel/usage/)

## Development & Build

### Frontend Development (Next.js)

To run the frontend locally for UI development:

```bash
cd src/frontend
npm install
npm run dev
```

Open [http://localhost:3000/Velo-Worker-Panel](http://localhost:3000/Velo-Worker-Panel) to view the panel.

### Worker Build (Production)

To build the full project (Worker + bundled Frontend):

```bash
# In the root directory
npm install
node scripts/build.js
```

This generates `dist/worker.js` containing the logic and compressed static assets.

## Supported Clients

|       Client        |      Version      |  Fragment support  |  Warp Pro support  |
| :-----------------: | :---------------: | :----------------: | :----------------: |
|     **v2rayNG**     | 1.10.26 or higher | :heavy_check_mark: | :heavy_check_mark: |
|     **MahsaNG**     |   14 or higher    | :heavy_check_mark: | :heavy_check_mark: |
|     **v2rayN**      | 7.15.4 or higher  | :heavy_check_mark: | :heavy_check_mark: |
|   **v2rayN-PRO**    |   1.9 or higher   | :heavy_check_mark: | :heavy_check_mark: |
|    **Sing-box**     | 1.12.0 or higher  | :heavy_check_mark: |        :x:         |
|    **Streisand**    | 1.6.64 or higher  | :heavy_check_mark: | :heavy_check_mark: |
|   **Clash Meta**    |                   |        :x:         | :heavy_check_mark: |
| **Clash Verge Rev** |                   |        :x:         | :heavy_check_mark: |
|     **FLClash**     |                   |        :x:         | :heavy_check_mark: |
|   **AmneziaVPN**    |                   |        :x:         | :heavy_check_mark: |
|    **WG Tunnel**    |                   |        :x:         | :heavy_check_mark: |

## Environment variables

|   Variable   |               Usage                |     Mandatory      |
| :----------: | :--------------------------------: | :----------------: |
|   **UUID**   |             VLESS UUID             | :heavy_check_mark: |
| **TR_PASS**  |          Trojan Password           | :heavy_check_mark: |
| **PROXY_IP** | Proxy IP or domain (VLESS, Trojan) |        :x:         |
|  **PREFIX**  |   NAT64 Prefixes (VLESS, Trojan)   |        :x:         |
| **SUB_PATH** |         Subscriptions' URI         |        :x:         |
| **FALLBACK** |  Fallback domain (VLESS, Trojan)   |        :x:         |
| **DOH_URL**  |              Core DOH              |        :x:         |

---

## 📜 License

This project is open-source and licensed under the **[GNU General Public License v3.0 (GPL-3.0)](https://choosealicense.com/licenses/gpl-3.0/)**.

### Summary of Key Requirements

The GPL-3.0 is a strong copyleft license that ensures the software remains free. If you use, modify, or distribute this code, you must adhere to the following:

* **Disclose Source:** You must make the source code available when you distribute the software.
* **License & Copyright Notice:** You must include a copy of the license and the original author's copyright notice.
* **Same License (Copyleft):** Any modifications or derived works must also be licensed under GPL-3.0.
* **State Changes:** You must clearly indicate if you have modified the original files.
* **No Warranty:** This software is provided "as is" without any warranty of any kind.

> This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
>
> This program is distributed in the hope that it will be useful, but **WITHOUT ANY WARRANTY**; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

For full details, please refer to the [LICENSE](/LICENSE) file in this repository.

---

## Stargazers Over Time

[![Stargazers Over Time](https://starchart.cc/IMROVOID/Velo-Worker-Panel.svg?variant=adaptive)](https://starchart.cc/IMROVOID/Velo-Worker-Panel)

---

### Special Thanks

- VLESS, Trojan [Cloudflare-workers/pages proxy script](https://github.com/yonggekkk/Cloudflare-workers-pages-vless) created by [yonggekkk](https://github.com/yonggekkk)
- CF-vless code author [3Kmfi6HP](https://github.com/3Kmfi6HP/EDtunnel)
- CF preferred IP program author [badafans](https://github.com/badafans/Cloudflare-IP-SpeedTest), [XIU2](https://github.com/XIU2/CloudflareSpeedTest)
