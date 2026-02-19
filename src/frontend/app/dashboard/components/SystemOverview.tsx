'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { api, SystemOverview as ISystemOverview } from '@/lib/api';
import { Activity, Shield, Users, Server } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    icon: React.ElementType;
    color: string;
}

function StatCard({ title, value, subtext, icon: Icon, color }: StatCardProps) {
    return (
        <Card>
            <CardContent className="p-6 flex items-center justify-between space-x-4">
                <div>
                    <div className="text-sm font-medium text-muted-foreground">{title}</div>
                    <div className="text-2xl font-bold mt-1">{value}</div>
                    {subtext && <div className="text-xs text-muted-foreground mt-1">{subtext}</div>}
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </CardContent>
        </Card>
    );
}

export default function SystemOverview() {
    const [data, setData] = useState<ISystemOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.getSystemOverview()
            .then(setData)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-4 text-muted-foreground">Loading system overview...</div>;
    if (error) return <div className="p-4 text-red-500">Error loading system overview: {error}</div>;
    if (!data) return null;

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">System overview</h2>
                <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-border rounded">v{data.panelVersion}</span>
                    <span className="px-2 py-1 bg-success/20 text-success rounded">Online</span>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="VLESS Configs"
                    value={data.vlConfigCount}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Trojan Configs"
                    value={data.trConfigCount}
                    icon={Shield}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Warp Status"
                    value={data.warpStatus}
                    icon={Activity}
                    color={data.warpStatus === 'Enabled' ? 'bg-green-500' : 'bg-yellow-500'}
                />
                <StatCard
                    title="Panel Version"
                    value={data.panelVersion}
                    icon={Server}
                    color="bg-gray-500"
                />
            </div>

            {/* 
                Legacy charts removed as they are not supported in Worker environment.
                Usage Analytics is handled in a separate component.
            */}
        </section>
    );
}


