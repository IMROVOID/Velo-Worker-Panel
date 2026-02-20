"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react"; // Removed Plus, MoreHorizontal
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { api, Admin } from "@/lib/api";

export default function AdminsPage() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.getAdmins()
            .then(setAdmins)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Admins</h1>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search admins..."
                        className="pl-8"
                        disabled
                    />
                </div>
            </div>

            <div className="rounded-md border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead>Status</TableHead>
                            {/* <TableHead className="text-right">Actions</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-red-500">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : admins.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    No admins found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            admins.map((admin) => (
                                <TableRow key={admin.id}>
                                    <TableCell className="font-medium">{admin.username}</TableCell>
                                    <TableCell>{admin.role}</TableCell>
                                    <TableCell>{admin.usage}</TableCell>
                                    <TableCell>
                                        <Badge variant={admin.status === "Active" ? "success" : "secondary"}>
                                            {admin.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
