'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
    { name: '2024-01-19', uv: 0 },
    { name: '2024-01-20', uv: 0 },
    { name: '2024-01-21', uv: 0 },
    { name: '2024-01-22', uv: 0 },
    { name: '2024-01-23', uv: 0 },
    { name: '2024-01-24', uv: 0 },
    { name: '2024-01-25', uv: 5.8 }, // Spike
    { name: '2024-01-26', uv: 0 },
    { name: '2024-01-27', uv: 0 },
];

export default function UsageAnalytics() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} MB`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                itemStyle={{ color: 'var(--foreground)' }}
                            />
                            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                            <Area type="monotone" dataKey="uv" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUv)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
