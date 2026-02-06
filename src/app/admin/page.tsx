"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardStats from "@/components/admin/DashboardStats";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    // Dashboard State
    const [projects, setProjects] = useState<any[]>([]);
    const [formData, setFormData] = useState({ title: "", image: "", link: "" });
    const [loading, setLoading] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);

    // Check auth
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "admin123") {
            setIsAuthenticated(true);
            fetchProjects();
        } else {
            alert("Incorrect Password");
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/projects");
            const data = await res.json();
            if (Array.isArray(data)) {
                setProjects(data);
            } else {
                setProjects([]);
            }
        } catch (e) {
            setProjects([]);
        }
    };

    const resetForm = () => {
        setFormData({ title: "", image: "", link: "" });
        setEditingId(null);
    };

    const handleEdit = (project: any) => {
        setFormData({
            title: project.title,
            image: project.image,
            link: project.link
        });
        setEditingId(project.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            await fetch(`/api/projects/${id}`, { method: "DELETE" });
            fetchProjects();
        } catch (e) {
            alert("Failed to delete");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const imageUrl = formData.image;
            // Legacy upload logic removed - ImageUploader handles this now.

            const payload = { ...formData, image: imageUrl };

            if (editingId) {
                // Update Mode
                const res = await fetch(`/api/projects/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) alert("Project Updated!");
            } else {
                // Create Mode
                const res = await fetch("/api/projects", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) alert("Project Added!");
            }

            resetForm();
            fetchProjects();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center p-6">
                <form onSubmit={handleLogin} className="bg-neutral-900 border border-white/10 p-8 rounded-xl w-full max-w-md space-y-6">
                    <h1 className="text-2xl font-bold text-white text-center">Admin Access</h1>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black border border-white/20 p-3 rounded text-white focus:border-orange-500 outline-none transition-colors"
                    />
                    <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded transition-colors">
                        Unlock
                    </button>
                    <div className="text-center">
                        <Link href="/" className="text-sm text-gray-500 hover:text-white">Back to Home</Link>
                    </div>
                </form>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <AdminSidebar onLogout={() => setIsAuthenticated(false)} />

            {/* Main Content */}
            <div className="flex-1 md:ml-64 p-6 md:p-12 transition-all duration-300">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-white/10 pb-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
                            <p className="text-gray-400 text-sm mt-1">Manage your portfolio works and content.</p>
                        </div>
                        {/* Mobile Logout (Sidebar hides on mobile realistically, but for now simple) */}
                        <button onClick={() => setIsAuthenticated(false)} className="md:hidden text-red-500 text-sm">Logout</button>
                    </div>

                    {/* Stats */}
                    <DashboardStats projects={projects} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Add/Edit Form - Sticky or Side */}
                        <section className="lg:col-span-1 bg-neutral-900 border border-white/10 p-6 rounded-xl space-y-6 h-fit sticky top-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-orange-500">{editingId ? "Edit Work" : "Add New Work"}</h2>
                                {editingId && (
                                    <button onClick={resetForm} className="text-xs text-gray-500 hover:text-white">Cancel Edit</button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase text-gray-400 mb-1">Project Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black border border-white/20 p-3 rounded text-white focus:border-orange-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-gray-400 mb-1">Project Image</label>
                                    <div className="space-y-4">
                                        {/* Image Uploader Component */}
                                        <ImageUploader
                                            onUploadComplete={(url) => {
                                                setFormData(prev => ({ ...prev, image: url }));
                                            }}
                                        />

                                        {/* Preview / Manual Input Fallback */}
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Or paste image URL..."
                                                value={formData.image}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                className="flex-1 bg-black border border-white/20 p-2 rounded text-xs text-white focus:border-orange-500 outline-none"
                                            />
                                        </div>

                                        {formData.image && (
                                            <div className="relative w-full h-32 bg-neutral-800 rounded-lg overflow-hidden border border-white/10 group">
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <a href={formData.image} target="_blank" className="text-xs text-white underline">View Full</a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-gray-400 mb-1">Project Link</label>
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://..."
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full bg-black border border-white/20 p-3 rounded text-white focus:border-orange-500 outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full font-bold px-6 py-3 rounded transition-colors disabled:opacity-50 ${editingId ? 'bg-orange-600 text-white hover:bg-orange-500' : 'bg-white text-black hover:bg-gray-200'}`}
                                >
                                    {loading ? "Processing..." : (editingId ? "Update Project" : "Add Project")}
                                </button>
                            </form>
                        </section>

                        {/* Existing List */}
                        <section className="lg:col-span-2 space-y-4">
                            <h2 className="text-xl font-semibold text-white">Existing Projects ({projects.length})</h2>
                            <div className="space-y-3">
                                {projects.map((p) => (
                                    <div key={p.id} className="flex items-center justify-between bg-neutral-900/50 p-4 rounded-xl border border-white/5 group hover:border-white/20 transition-all hover:bg-neutral-900">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-20 h-14 bg-gray-800 rounded-lg overflow-hidden relative border border-white/5">
                                                {p.image ? (
                                                    <img src={p.image} className="object-cover w-full h-full" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500 bg-neutral-800">No Img</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <p className="font-bold text-white group-hover:text-orange-500 transition-colors">{p.title}</p>
                                                    {p.category && (
                                                        <span className="text-[10px] bg-neutral-800 border border-white/10 px-2 py-0.5 rounded text-gray-400 uppercase tracking-wider">{p.category}</span>
                                                    )}
                                                </div>
                                                <a href={p.link} target="_blank" className="text-xs text-gray-500 hover:text-white transition-colors">{p.link}</a>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(p)}
                                                className="text-xs bg-gray-800 hover:bg-white hover:text-black text-gray-300 px-3 py-2 rounded transition-all"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="text-xs bg-red-900/20 hover:bg-red-500 text-red-500 hover:text-white px-3 py-2 rounded transition-all"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {projects.length === 0 && (
                                    <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-xl">
                                        No projects found. Add one to get started.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
