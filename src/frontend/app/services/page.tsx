'use client';

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Loader2, Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ServicesPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [cleanIPs, setCleanIPs] = useState("");
    const [warpEndpoints, setWarpEndpoints] = useState("");
    const [proxyIPs, setProxyIPs] = useState("");

    useEffect(() => {
        api.getSettings()
            .then(s => {
                setCleanIPs(s.cleanIPs?.join('\n') || "");
                setWarpEndpoints(s.warpEndpoints?.join('\n') || "");
                setProxyIPs(s.proxyIPs?.join('\n') || "");
            })
            .catch(err => {
                setMessage({ type: 'error', text: err.message || "Failed to fetch settings" });
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await api.updateSettings({
                cleanIPs: cleanIPs.split('\n').map(s => s.trim()).filter(s => s),
                warpEndpoints: warpEndpoints.split('\n').map(s => s.trim()).filter(s => s),
                proxyIPs: proxyIPs.split('\n').map(s => s.trim()).filter(s => s)
            });
            setMessage({ type: 'success', text: "Services configuration has been updated successfully." });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            setMessage({ type: 'error', text: errorMessage || "Failed to save settings" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Loading configuration...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Services Configuration</h1>
                    <p className="text-muted-foreground">Manage IP addresses and endpoints for your services.</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            {message && (
                <div className={`p-4 rounded-md flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {message.text}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Clean IPs</CardTitle>
                        <CardDescription>List of clean IP addresses to use (one per line).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={cleanIPs}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCleanIPs(e.target.value)}
                            placeholder="1.2.3.4&#10;5.6.7.8"
                            rows={8}
                            className="font-mono"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Warp Endpoints</CardTitle>
                        <CardDescription>Warp endpoints for wireguard connections (one per line).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={warpEndpoints}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setWarpEndpoints(e.target.value)}
                            placeholder="engage.cloudflareclient.com:2408"
                            rows={8}
                            className="font-mono"
                        />
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Proxy IPs</CardTitle>
                        <CardDescription>Proxy IPs to route traffic through (one per line).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={proxyIPs}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProxyIPs(e.target.value)}
                            placeholder="1.1.1.1"
                            rows={5}
                            className="font-mono"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
