import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal } from "lucide-react";

// Mock data
const users = [
    { id: 1, name: "Customer A", service: "Premium Plan", usage: "12.5 GB / 100 GB", expire: "2026-03-15", status: "Active" },
    { id: 2, name: "Customer B", service: "Standard Plan", usage: "45 GB / 50 GB", expire: "2026-02-28", status: "Warning" },
    { id: 3, name: "Customer C", service: "Premium Plan", usage: "100 GB / 100 GB", expire: "2026-02-10", status: "Expired" },
];

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search users..."
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="rounded-md border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead>Expire Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.service}</TableCell>
                                <TableCell>{user.usage}</TableCell>
                                <TableCell>{user.expire}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        user.status === "Active" ? "success" :
                                            user.status === "Warning" ? "warning" : "error"
                                    }>
                                        {user.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
