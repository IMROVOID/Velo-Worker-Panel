"use client";

import { useState } from "react";
import { Search, ChevronRight, FileText, ArrowLeft, Server, Shield, Globe, Database, Cpu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

const sidebarItems = [
    {
        category: "GENERAL",
        items: [
            { title: "Introduction", id: "introduction", icon: Globe },
            { title: "Features", id: "features", icon: Shield },
            { title: "Limitations", id: "limitations", icon: Server },
        ],
    },
    {
        category: "USAGE",
        items: [
            { title: "Supported Clients", id: "supported-clients", icon: Cpu },
            { title: "Environment Variables", id: "env-variables", icon: Database },
        ],
    },
];

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("introduction");

    const renderContent = () => {
        switch (activeSection) {
            case "introduction":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">Introduction</h1>
                            <p className="text-xl text-muted-foreground">
                                Welcome to Velo Panel
                            </p>
                        </div>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                This project is aimed to provide a user panel to access <strong className="text-foreground">FREE, SECURE and PRIVATE</strong> VLESS, Trojan and Warp configs.
                                It ensures connectivity even when domains or Warp services are blocked by ISPs, offering two deployment options:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
                                <li><strong className="text-foreground">Workers</strong> deployment</li>
                                <li><strong className="text-foreground">Pages</strong> deployment (Velo Panel Frontend)</li>
                            </ul>

                            <div className="mt-8 p-6 rounded-xl bg-card border border-border">
                                <h3 className="text-lg font-semibold mb-2 text-foreground">Overview</h3>
                                <p className="text-muted-foreground">
                                    Velo Panel streamlines the management of your proxy configurations, providing a robust and accessible interface for both administrators and users.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case "features":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">Features</h1>
                            <p className="text-xl text-muted-foreground">
                                Key capabilities of Velo Panel
                            </p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2">
                            {[
                                { title: "Free and Private", desc: "No costs involved and the server is private." },
                                { title: "Intuitive Panel", desc: "Streamlined for effortless navigation, configuration and use." },
                                { title: "Versatile Protocols", desc: "Provides VLESS, Trojan and Wireguard (Warp) protocols." },
                                { title: "Warp Pro configs", desc: "Optimized Warp for crucial circumstances." },
                                { title: "Fragment support", desc: "Supports Fragment functionality for crucial network situations." },
                                { title: "Comprehensive Routing", desc: "Bypassing Iran/China/Russia, Blocking QUIC, Porn, Ads, Malwares, Phishing." },
                                { title: "Chain Proxy", desc: "Capable of adding a chain proxy (VLESS, Trojan, Shadowsocks, socks and http) to fix IP." },
                                { title: "Broad Compatibility", desc: "Offers subscription links for Xray, Sing-box and Clash-Mihomo core clients." },
                                { title: "Secure Panel", desc: "Provides secure and private panel with password protection." },
                                { title: "Fully Customizable", desc: "Supports clean IP-domains, Proxy IPs, DNS servers, ports, protocols, endpoints and more." },
                            ].map((feature, i) => (
                                <div key={i} className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "limitations":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">Limitations</h1>
                            <p className="text-xl text-muted-foreground">
                                Current constraints to be aware of
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                                <h3 className="text-lg font-semibold text-yellow-500 mb-2">UDP Transport</h3>
                                <p className="text-muted-foreground">
                                    VLESS and Trojan protocols on workers do not handle <strong className="text-foreground">UDP</strong> properly, so it is disabled by default (affecting features like Telegram video calls). UDP DNS is also unsupported. DoH is enabled by default for enhanced security.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <h3 className="text-lg font-semibold text-blue-500 mb-2">Request Limit</h3>
                                <p className="text-muted-foreground">
                                    Each worker supports 100K requests per day for VLESS and Trojan, suitable for 2-3 users. You can use limitless Warp configs.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case "supported-clients":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">Supported Clients</h1>
                            <p className="text-xl text-muted-foreground">
                                Compatibility matrix for various clients
                            </p>
                        </div>
                        <div className="rounded-xl border border-border overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4">Client</th>
                                        <th className="px-6 py-4">Version</th>
                                        <th className="px-6 py-4 text-center">Fragment</th>
                                        <th className="px-6 py-4 text-center">Warp Pro</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {[
                                        { name: "v2rayNG", ver: "1.10.26+", frag: true, warp: true },
                                        { name: "MahsaNG", ver: "14+", frag: true, warp: true },
                                        { name: "v2rayN", ver: "7.15.4+", frag: true, warp: true },
                                        { name: "v2rayN-PRO", ver: "1.9+", frag: true, warp: true },
                                        { name: "Sing-box", ver: "1.12.0+", frag: true, warp: false },
                                        { name: "Streisand", ver: "1.6.64+", frag: true, warp: true },
                                        { name: "Clash Meta", ver: "-", frag: false, warp: true },
                                        { name: "Clash Verge Rev", ver: "-", frag: false, warp: true },
                                        { name: "FLClash", ver: "-", frag: false, warp: true },
                                        { name: "AmneziaVPN", ver: "-", frag: false, warp: true },
                                        { name: "WG Tunnel", ver: "-", frag: false, warp: true },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-foreground">{row.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{row.ver}</td>
                                            <td className="px-6 py-4 text-center">{row.frag ? "✅" : "❌"}</td>
                                            <td className="px-6 py-4 text-center">{row.warp ? "✅" : "❌"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case "env-variables":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">Environment Variables</h1>
                            <p className="text-xl text-muted-foreground">
                                Configuration options for deployment
                            </p>
                        </div>
                        <div className="rounded-xl border border-border overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4">Variable</th>
                                        <th className="px-6 py-4">Usage</th>
                                        <th className="px-6 py-4 text-center">Mandatory</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {[
                                        { name: "UUID", usage: "VLESS UUID", mandatory: true },
                                        { name: "TR_PASS", usage: "Trojan Password", mandatory: true },
                                        { name: "PROXY_IP", usage: "Proxy IP or domain (VLESS, Trojan)", mandatory: false },
                                        { name: "PREFIX", usage: "NAT64 Prefixes (VLESS, Trojan)", mandatory: false },
                                        { name: "SUB_PATH", usage: "Subscriptions' URI", mandatory: false },
                                        { name: "FALLBACK", usage: "Fallback domain (VLESS, Trojan)", mandatory: false },
                                        { name: "DOH_URL", usage: "Core DOH", mandatory: false },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-family-mono text-primary">{row.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{row.usage}</td>
                                            <td className="px-6 py-4 text-center">{row.mandatory ? "✅" : "❌"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Documentation</h1>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search guides..."
                        className="pl-9 bg-muted/50 border-input/50 focus-visible:bg-background transition-colors"
                    />
                </div>
            </div>

            <div className="flex flex-1 gap-8 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 space-y-6 overflow-y-auto pr-2 shrink-0 hidden lg:block custom-scrollbar">
                    {sidebarItems.map((category) => (
                        <div key={category.category}>
                            <h3 className="mb-2 text-xs font-semibold text-muted-foreground tracking-wider pl-3">
                                {category.category}
                            </h3>
                            <div className="space-y-0.5">
                                {category.items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={cn(
                                            "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all relative group",
                                            activeSection === item.id
                                                ? "text-foreground bg-accent"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "w-4 h-4 mr-3 transition-colors",
                                            activeSection === item.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                                        )} />
                                        {item.title}
                                        {activeSection === item.id && (
                                            <motion.div
                                                layoutId="activeDocs"
                                                className="absolute left-0 w-1 h-1/2 top-1/4 bg-primary rounded-r-full"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </aside>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto pr-4 scroll-smooth custom-scrollbar">
                    <div className="max-w-4xl space-y-8 pb-12">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <span>{sidebarItems.find(c => c.items.some(i => i.id === activeSection))?.category}</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-foreground">
                                {sidebarItems.flatMap(c => c.items).find(i => i.id === activeSection)?.title}
                            </span>
                        </div>

                        {renderContent()}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-8 border-t border-border/50 text-sm text-muted-foreground mt-12">
                            <span>Velo Panel Documentation</span>
                            <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                                <FileText className="w-4 h-4" />
                                Updated February 2026
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
