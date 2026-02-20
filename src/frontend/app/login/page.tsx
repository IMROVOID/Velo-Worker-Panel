'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, User, Info, Copy } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [envSetup, setEnvSetup] = useState<boolean | null>(null);
    const [generatedCreds, setGeneratedCreds] = useState<{ uuid: string, pass: string } | null>(null);

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // We use the relative path mapped by next.config.ts basePath if applicable, 
            // but api requests usually go to ../api/login/authenticate relative to the page
            // or absolute path /api/login/authenticate.
            // Since we are at /panel/login, the api is likely at /api/login/authenticate (root level handled by worker)
            // OR relative ../../api/login/authenticate

            // Let's use the explicit path that the worker handles.
            // The worker maps /api/* calls. 
            // We need to fetch /login/authenticate which is handled by handleLogin in handlers.ts
            // handlers.ts: if (path.endsWith('/login/authenticate')) ...

            const response = await fetch('../login/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                // Try to parse error message
                const text = await response.text();
                try {
                    const json = JSON.parse(text);
                    throw new Error(json.message || 'Login failed');
                } catch {
                    throw new Error(text || 'Login failed');
                }
            }

            const data = await response.json();
            if (data.success) {
                router.push('/dashboard');
            } else {
                throw new Error(data.message || 'Login failed');
            }

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch('../api/env-status')
            .then(res => res.json())
            .then(data => {
                if (data.success && !data.data.isSetup) {
                    setEnvSetup(false);
                    // Generate securely
                    setGeneratedCreds({
                        uuid: crypto.randomUUID(),
                        pass: Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('')
                    });
                } else {
                    setEnvSetup(true);
                }
            })
            .catch(() => setEnvSetup(true)); // fallback
    }, []);

    const copyCreds = () => {
        if (!generatedCreds) return;
        navigator.clipboard.writeText(`UUID=${generatedCreds.uuid}\nTR_PASS=${generatedCreds.pass}`)
            .then(() => alert('Copied to clipboard!'));
    };

    if (envSetup === false && generatedCreds) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Info className="h-6 w-6 text-blue-500" />
                            Environment Setup Required
                        </CardTitle>
                        <CardDescription>
                            Your Cloudflare Worker is missing the required environment variables.
                            You must add them to access the panel.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-muted p-4 rounded-md space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">Generated Credentials</h3>
                                <Button variant="outline" size="sm" onClick={copyCreds}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy Both
                                </Button>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-2 items-center text-sm">
                                <span className="font-mono bg-background p-1 px-2 rounded w-fit">UUID</span>
                                <span className="font-mono break-all font-semibold">{generatedCreds.uuid}</span>
                                <span className="font-mono bg-background p-1 px-2 rounded w-fit">TR_PASS</span>
                                <span className="font-mono break-all font-semibold">{generatedCreds.pass}</span>
                            </div>
                        </div>

                        <div className="space-y-3 relative">
                            <h3 className="font-semibold text-lg">Detailed Setup Instructions:</h3>
                            <ol className="list-decimal list-inside space-y-2 text-sm leading-relaxed">
                                <li>Go to your <a href="https://dash.cloudflare.com" target="_blank" rel="noreferrer" className="text-blue-500 underline">Cloudflare Dashboard</a> and select <b>Workers & Pages</b>.</li>
                                <li>Select the worker you deployed.</li>
                                <li>Navigate to <b>Settings</b> &rarr; <b>Variables</b> &rarr; <b>Environment Variables</b>.</li>
                                <li>Click <b>Edit Variables</b> and click <b>Add variable</b>.</li>
                                <li>Add <code>UUID</code> as the Variable name, and paste the generated UUID above as the value.</li>
                                <li>Add another variable named <code>TR_PASS</code>, and paste the generated TR_PASS above.</li>
                                <li>Click <b>Deploy</b> to save changes and restart the worker.</li>
                                <li><b>Refresh this page</b> once deployment finishes to login!</li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Velo Panel</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access the admin panel
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md text-center">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Enter username"
                                    className="pl-9"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    className="pl-9"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
