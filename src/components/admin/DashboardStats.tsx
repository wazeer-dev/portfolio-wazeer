"use client";

import { useMemo } from "react";

interface DashboardStatsProps {
    projects: any[];
}

export default function DashboardStats({ projects = [] }: DashboardStatsProps) {

    const stats = useMemo(() => {
        const totalProjects = projects.length;
        // Example logic: Extract unique categories if they existed, for now placeholder
        const categories = new Set(projects.map(p => p.category).filter(Boolean)).size || "N/A";

        return [
            { label: "Total Projects", value: totalProjects, color: "text-blue-400", border: "border-blue-500/30" },
            { label: "Categories", value: categories, color: "text-purple-400", border: "border-purple-500/30" },
            { label: "Storage Used", value: "ImgBB", color: "text-green-400", border: "border-green-500/30" },
            { label: "Status", value: "Active", color: "text-orange-400", border: "border-orange-500/30" },
        ];
    }, [projects]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
                <div key={stat.label} className={`bg-neutral-900 border ${stat.border} p-4 rounded-xl`}>
                    <p className="text-xs uppercase text-gray-500 font-semibold">{stat.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
            ))}
        </div>
    );
}
