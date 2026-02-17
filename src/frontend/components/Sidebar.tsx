'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Turn as Hamburger } from 'hamburger-react';
import {
    LayoutDashboard,
    Users,
    Settings,
    Activity,
    FileText,
    Shield,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VeloSidebarIcon } from './icons/VeloSidebarIcon';
import { LogoutIcon } from './icons/LogoutIcon';

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
    }, [pathname, isMobile]);

    const sidebarVariants: Variants = {
        open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        closed: { x: '-100%', opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    };

    const desktopVariants: Variants = {
        open: { width: '250px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
        closed: { width: '70px', transition: { type: 'spring', stiffness: 300, damping: 30 } }, // Smaller closed width
    };

    const titleVariants = {
        open: { opacity: 1, width: "auto", transition: { duration: 0.2, delay: 0.1 } },
        closed: { opacity: 0, width: 0, transition: { duration: 0.2 } }
    };

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
                initial={isMobile ? 'closed' : 'open'}
                animate={isOpen ? 'open' : (isMobile ? 'closed' : 'closed')}
                variants={isMobile ? sidebarVariants : desktopVariants}
                className={cn(
                    "fixed top-0 left-0 h-full bg-sidebar-background border-r border-border z-40 flex flex-col justify-between overflow-hidden",
                    isMobile ? "w-64" : ""
                )}
            >
                <div>
                    {/* Logo Area */}
                    <div className="h-16 flex items-center justify-between px-3 border-b border-border/10">
                        {/* Desktop Collapse Button */}
                        {!isMobile && (
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className={cn("p-1.5 rounded-md hover:bg-neutral-800 transition-colors text-muted-foreground hover:text-foreground", !isOpen && "mx-auto")}
                            >
                                <VeloSidebarIcon className="w-5 h-5" />
                            </button>
                        )}

                        <motion.div
                            variants={titleVariants}
                            initial={false}
                            animate={isOpen ? "open" : "closed"}
                            className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
                        >
                            <h1 className="font-semibold text-base">
                                Velo Panel
                            </h1>
                        </motion.div>
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
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden text-sm",
                                        isActive
                                            ? "bg-[var(--sidebar-selected)] text-foreground font-medium"
                                            : "text-muted-foreground/70 hover:bg-neutral-800/50 hover:text-foreground", // Darker default, lighter hover
                                        !isOpen && !isMobile && "justify-center px-2"
                                    )}
                                >
                                    <item.icon size={18} className={cn("min-w-[18px]", isActive ? "text-foreground" : "text-muted-foreground/70 group-hover:text-foreground")} />
                                    <span className={cn(
                                        "whitespace-nowrap transition-all duration-300 origin-left",
                                        !isOpen && !isMobile ? "hidden" : "block"
                                    )}>
                                        {item.name}
                                    </span>

                                    {/* Tooltip for collapsed state */}
                                    {!isOpen && !isMobile && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
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
                        "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-muted-foreground/70 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 text-sm group",
                        !isOpen && !isMobile && "justify-center px-0"
                    )}>
                        <LogoutIcon className="w-5 h-5 min-w-[20px] group-hover:text-red-500" />
                        <span className={cn(
                            "whitespace-nowrap transition-all duration-300",
                            !isOpen && !isMobile ? "hidden" : "block"
                        )}>
                            Logout
                        </span>
                    </button>
                </div>
            </motion.aside>

            {/* Spacer for desktop content to not be hidden behind fixed sidebar */}
            {!isMobile && (
                <motion.div
                    animate={isOpen ? { width: 250 } : { width: 80 }}
                    className="shrink-0 hidden lg:block h-screen"
                />
            )}
        </>
    );
}
