import SystemOverview from './components/SystemOverview';
import UsageAnalytics from './components/UsageAnalytics';

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <SystemOverview />

            <section>
                <h2 className="text-xl font-semibold mb-4">Panel Usage</h2>
                <div className="grid grid-cols-1 gap-4">
                    <UsageAnalytics />
                </div>
            </section>
        </div>
    );
}
