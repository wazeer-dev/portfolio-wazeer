"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
    onLogout: () => void;
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: "📊" },
        { label: "Projects", href: "#projects", icon: "📁" }, // Scroll to anchor for now as single page
        { label: "Settings", href: "#settings", icon: "⚙️" },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 bg-neutral-900 border-r border-white/10 min-h-screen p-6 fixed left-0 top-0 z-50">
            <div className="mb-10 flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold text-black">
                    A
                </div>
                <span className="text-xl font-bold tracking-tight text-white">AdminPanel</span>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 text-gray-400 hover:text-white",
                            // Simple active check logic for now since it is single page mostly
                            item.label === "Dashboard" ? "text-white bg-white/5" : ""
                        )}
                    >
                        <span>{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="pt-6 border-t border-white/10">
                <button
                    onClick={onLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 hover:text-red-400 w-full transition-colors"
                >
                    <span>🚪</span>
                    Logout
                </button>
            </div>
        </aside>
    );
}
