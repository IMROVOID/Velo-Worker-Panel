'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Loader2, Save, Plus, Trash2, AlertCircle, CheckCircle2, User, Shield } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function UsersPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [vlessUsers, setVlessUsers] = useState<string[]>([]);
    const [trojanUsers, setTrojanUsers] = useState<string[]>([]);

    const [newVless, setNewVless] = useState("");
    const [newTrojan, setNewTrojan] = useState("");

    useEffect(() => {
        api.getSettings()
            .then(s => {
                setVlessUsers(s.vlessUsers || []);
                setTrojanUsers(s.trojanUsers || []);
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
                vlessUsers,
                trojanUsers
            });
            setMessage({ type: 'success', text: "User configuration has been updated successfully." });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            setMessage({ type: 'error', text: errorMessage || "Failed to save settings" });
        } finally {
            setSaving(false);
        }
    };

    const addVlessUser = () => {
        if (!newVless.trim()) return;
        if (vlessUsers.includes(newVless.trim())) {
            setMessage({ type: 'error', text: "User already exists" });
            return;
        }
        setVlessUsers([...vlessUsers, newVless.trim()]);
        setNewVless("");
        setMessage(null);
    };

    const removeVlessUser = (user: string) => {
        setVlessUsers(vlessUsers.filter(u => u !== user));
    };

    const addTrojanUser = () => {
        if (!newTrojan.trim()) return;
        if (trojanUsers.includes(newTrojan.trim())) {
            setMessage({ type: 'error', text: "User already exists" });
            return;
        }
        setTrojanUsers([...trojanUsers, newTrojan.trim()]);
        setNewTrojan("");
        setMessage(null);
    };

    const removeTrojanUser = (user: string) => {
        setTrojanUsers(trojanUsers.filter(u => u !== user));
    };

    const generateUUID = () => {
        // Simple random UUID generator for client side
        setNewVless(crypto.randomUUID());
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Loading users...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
                    <p className="text-muted-foreground">Manage VLESS UUIDs and Trojan Passwords.</p>
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
                {/* VLESS Users */}
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" /> VLESS Users
                        </CardTitle>
                        <CardDescription>Manage authorized VLESS UUIDs.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                        <div className="flex gap-2">
                            <Input
                                value={newVless}
                                onChange={e => setNewVless(e.target.value)}
                                placeholder="Enter UUID"
                                className="font-mono"
                            />
                            <Button variant="outline" onClick={generateUUID} title="Generate UUID">
                                Rand
                            </Button>
                            <Button onClick={addVlessUser} disabled={!newVless.trim()}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="rounded-md border flex-1 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>UUID</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vlessUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center text-muted-foreground h-24">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        vlessUsers.map((user) => (
                                            <TableRow key={user}>
                                                <TableCell className="font-mono text-xs break-all">{user}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" onClick={() => removeVlessUser(user)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Trojan Users */}
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" /> Trojan Users
                        </CardTitle>
                        <CardDescription>Manage authorized Trojan passwords.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                        <div className="flex gap-2">
                            <Input
                                value={newTrojan}
                                onChange={e => setNewTrojan(e.target.value)}
                                placeholder="Enter Password"
                            />
                            <Button onClick={addTrojanUser} disabled={!newTrojan.trim()}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="rounded-md border flex-1 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Password</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trojanUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center text-muted-foreground h-24">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        trojanUsers.map((user) => (
                                            <TableRow key={user}>
                                                <TableCell className="font-mono text-sm">{user}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" onClick={() => removeTrojanUser(user)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
