'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Turn as Hamburger } from 'hamburger-react';
import {
    LayoutDashboard,
    Users,
    Settings,
    Activity,
    FileText,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VeloSidebarIcon } from './icons/VeloSidebarIcon';
import { LogoutIcon } from './icons/LogoutIcon';

const sidebarTransition = { type: "spring", stiffness: 300, damping: 30 } as const;

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Admins', href: '/admins', icon: Shield },
    { name: 'Services', href: '/services', icon: Settings },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Usage', href: '/usage', icon: Activity },
    { name: 'Docs', href: '/docs', icon: FileText },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    // Check if we act as mobile
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setIsOpen(false); // Default close on mobile
            else setIsOpen(true); // Default open on desktop
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close sidebar on navigation on mobile
    useEffect(() => {
        if (isMobile) setIsOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // Hide sidebar on login page
    if (pathname === '/login' || pathname === '/panel/login') {
        return null;
    }

    const sidebarWidth = isMobile ? (isOpen ? 256 : 0) : (isOpen ? 256 : 70);

    return (
        <>
            {/* Mobile Toggle Button */}
            {isMobile && (
                <div className="fixed top-4 left-4 z-50 p-2 bg-background rounded-full shadow-lg border border-border">
                    <Hamburger
                        toggled={isOpen}
                        toggle={setIsOpen}
                        size={24}
                        direction="left"
                        duration={0.3}
                    />
                </div>
            )}

            {/* Overlay for mobile */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarWidth }}
                transition={sidebarTransition}
                className="fixed top-0 left-0 h-full bg-sidebar-background border-r border-border z-40 flex flex-col justify-between overflow-hidden will-change-[width]"
            >
                <div>
                    {/* Logo Area */}
                    <div className="h-16 flex items-center px-4 border-b border-border/10 overflow-hidden">
                        <motion.div
                            animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                                "flex items-center gap-2 whitespace-nowrap",
                                isMobile && "ml-2"
                            )}
                        >
                            <h1 className="font-semibold text-base">
                                Velo Panel
                            </h1>
                        </motion.div>

                        {/* Desktop Collapse Button */}
                        {!isMobile && (
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className={cn(
                                    "p-1.5 rounded-md hover:bg-neutral-800 transition-colors text-muted-foreground hover:text-foreground shrink-0",
                                    isOpen ? "ml-auto" : "mx-auto" // Center when collapsed, right when open
                                )}
                            >
                                <VeloSidebarIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="mt-6 px-2 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center py-3 rounded-2xl transition-colors duration-200 group relative overflow-hidden text-sm",
                                        (isOpen || isMobile) ? "pl-5 pr-3 justify-start" : "justify-center px-2",
                                        isActive
                                            ? "bg-[var(--sidebar-selected)] text-foreground font-medium"
                                            : "text-muted-foreground/70 hover:bg-neutral-800/50 hover:text-foreground"
                                    )}
                                >
                                    <item.icon size={18} className={cn("min-w-[18px] shrink-0 transition-colors", isActive ? "text-foreground" : "text-muted-foreground/70 group-hover:text-foreground")} />

                                    <motion.span
                                        initial={false}
                                        animate={{
                                            opacity: (isOpen || isMobile) ? 1 : 0,
                                            width: (isOpen || isMobile) ? "auto" : 0,
                                            marginLeft: (isOpen || isMobile) ? 12 : 0
                                        }}
                                        transition={sidebarTransition}
                                        className="whitespace-nowrap overflow-hidden origin-left"
                                    >
                                        {item.name}
                                    </motion.span>

                                    {/* Tooltip for collapsed state (Desktop only) */}
                                    {!isOpen && !isMobile && (
                                        <div className="absolute left-full ml-4 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                            {item.name}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-border/10">
                    <button className={cn(
                        "flex items-center w-full py-3 rounded-2xl text-muted-foreground/70 hover:bg-red-500/5 hover:text-red-500 transition-colors duration-200 text-sm group",
                        (isOpen || isMobile) ? "pl-5 pr-3 justify-start" : "justify-center px-2"
                    )}>
                        <LogoutIcon className="w-5 h-5 min-w-[20px] shrink-0 group-hover:text-red-500" />
                        <motion.span
                            initial={false}
                            animate={{
                                opacity: (isOpen || isMobile) ? 1 : 0,
                                width: (isOpen || isMobile) ? "auto" : 0,
                                marginLeft: (isOpen || isMobile) ? 12 : 0
                            }}
                            transition={sidebarTransition}
                            className="whitespace-nowrap overflow-hidden"
                        >
                            Logout
                        </motion.span>
                    </button>
                </div>
            </motion.aside>

            {/* Spacer for desktop content */}
            {!isMobile && (
                <motion.div
                    initial={false}
                    animate={{ width: sidebarWidth }}
                    transition={sidebarTransition}
                    className="shrink-0 hidden lg:block h-screen will-change-[width]"
                />
            )}
        </>
    );
}
