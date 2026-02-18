'use client';

import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';


// Mock Data
const data = Array.from({ length: 20 }, () => ({
    value: Math.floor(Math.random() * 100)
}));

function Sparkline({ color }: { color: string }) {
    return (
        <div className="h-[40px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function StatCard({ title, value, subtext, color }: { title: string, value: string, subtext?: string, color: string }) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">{title}</div>
                        <div className="text-2xl font-bold mt-1">{value}</div>
                        {subtext && <div className="text-xs text-muted-foreground mt-1">{subtext}</div>}
                    </div>
                    <div className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">View history</div>
                </div>
                <Sparkline color={color} />
            </CardContent>
        </Card>
    );
}

export default function SystemOverview() {
    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">System overview</h2>
                <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-border rounded">v4.1.0</span>
                    <span className="px-2 py-1 bg-success/20 text-success rounded">Update available</span>
                    <span className="px-2 py-1 bg-border rounded">Load: 0.04 | 0.14 | 0.45</span>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard title="CPU usage" value="13.7%" color="#e5e5e5" />
                <StatCard title="Memory usage" value="55.6%" color="#e5e5e5" />
                <StatCard title="Network history" value="24.88 KB/s" subtext="Incoming" color="#e5e5e5" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Card className="flex flex-col justify-center">
                    <CardContent className="flex justify-between items-center p-6">
                        <div>
                            <div className="text-sm text-muted-foreground">Incoming speed</div>
                            <div className="text-lg font-mono text-success">24.88 KB/s</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-muted-foreground">Outgoing speed</div>
                            <div className="text-lg font-mono text-blue-500">3.58 KB/s</div>
                        </div>
                    </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Memory usage</div>
                            <div className="text-lg font-mono">924.14 MB / 1.92 GB</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Disk usage</div>
                            <div className="text-lg font-mono">6.9 GB / 39.3 GB</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex gap-4 mt-4 text-xs font-mono">
                <span className="px-2 py-1 bg-success/10 text-success border border-success/20 rounded">System uptime: 2d 11h 29m 56s</span>
                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded">Panel uptime: 2d 11h 29m 34s</span>
                <span className="px-2 py-1 bg-warning/10 text-warning border border-warning/20 rounded">Xray uptime: 2d 7h 47m 45s</span>
            </div>
        </section>
    );
}
