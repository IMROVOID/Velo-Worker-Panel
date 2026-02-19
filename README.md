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

### Deployment

#### GitHub Pages

The frontend is automatically deployed to GitHub Pages via GitHub Actions on push to `main`.

- **Live URL**: [https://IMROVOID.github.io/Velo-Worker-Panel/](https://IMROVOID.github.io/Velo-Worker-Panel/)

#### Cloudflare Workers

**One-Command Setup & Deployment:**

Run the interactive setup wizard:

```bash
npm run setup
```

*This command handles login, custom naming, configuration, and deployment automatically.*

**Local Development** (Optional)

To test the worker locally:

```bash
npm run worker:dev
```

## Getting started

- [Installation methods](https://IMROVOID.github.io/Velo-Worker-Panel/installation/wizard/)
- [Configuration](https://IMROVOID.github.io/Velo-Worker-Panel/configuration/)
- [How to use](https://IMROVOID.github.io/Velo-Worker-Panel/usage/)
- [FAQ](https://IMROVOID.github.io/Velo-Worker-Panel/faq/)

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

## Stargazers Over Time

[![Stargazers Over Time](https://starchart.cc/IMROVOID/Velo-Worker-Panel.svg?variant=adaptive)](https://starchart.cc/IMROVOID/Velo-Worker-Panel)

---

### Special Thanks

- VLESS, Trojan [Cloudflare-workers/pages proxy script](https://github.com/yonggekkk/Cloudflare-workers-pages-vless) created by [yonggekkk](https://github.com/yonggekkk)
- CF-vless code author [3Kmfi6HP](https://github.com/3Kmfi6HP/EDtunnel)
- CF preferred IP program author [badafans](https://github.com/badafans/Cloudflare-IP-SpeedTest), [XIU2](https://github.com/XIU2/CloudflareSpeedTest)
