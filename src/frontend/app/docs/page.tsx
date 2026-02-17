export default function DocsPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h2>Introduction</h2>
                <p>
                    Welcome to the Velo Panel documentation. This panel helps you manage your Velo server, users, and services efficiently.
                </p>

                <h2>Features</h2>
                <ul>
                    <li>**Dashboard**: Real-time system monitoring.</li>
                    <li>**Admins**: Manage admin access levels (Standard, Full Access).</li>
                    <li>**Services**: Create reusable templates for user configurations.</li>
                    <li>**Users**: Manage customers, set data limits, and expiration dates.</li>
                    <li>**Usage**: Detailed analytics of system and user usage.</li>
                </ul>

                <h2>Getting Started</h2>
                <p>
                    Navigate to the <strong>Services</strong> page to create your first service template. Then, go to the <strong>Users</strong> page to add customers and assign them a service.
                </p>
            </div>
        </div>
    );
}
