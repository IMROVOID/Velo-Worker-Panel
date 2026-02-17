import UsageAnalytics from '../dashboard/components/UsageAnalytics';

export default function UsagePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Usage Analytics</h1>
            <p className="text-muted-foreground">Track usage trends across services, admins, and nodes from a single place.</p>

            <div className="grid grid-cols-1 gap-6">
                <UsageAnalytics />
                {/* We can reuse the UsageAnalytics component or add more specific charts here */}
            </div>
        </div>
    );
}
