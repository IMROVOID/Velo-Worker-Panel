'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UsageAnalytics() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent className="pl-6 pb-6">
                <div className="flex items-center justify-center h-[100px] text-muted-foreground border-2 border-dashed rounded-lg">
                    <span>Usage tracking is not supported in this version.</span>
                </div>
            </CardContent>
        </Card>
    );
}

