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
import { Search, Plus, MoreHorizontal } from "lucide-react";

const services = [
    { id: 1, name: "Premium Plan", dataLimit: "100 GB", expire: "30 Days", ipLimit: "2" },
    { id: 2, name: "Standard Plan", dataLimit: "50 GB", expire: "30 Days", ipLimit: "1" },
    { id: 3, name: "Unlimited", dataLimit: "Unlimited", expire: "Unlimited", ipLimit: "5" },
];

export default function ServicesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Services</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Service
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search services..."
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="rounded-md border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Data Limit</TableHead>
                            <TableHead>Expire Time</TableHead>
                            <TableHead>IP Limit</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">{service.name}</TableCell>
                                <TableCell>{service.dataLimit}</TableCell>
                                <TableCell>{service.expire}</TableCell>
                                <TableCell>{service.ipLimit}</TableCell>
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
