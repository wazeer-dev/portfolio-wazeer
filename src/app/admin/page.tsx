"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    // Dashboard State
    const [projects, setProjects] = useState<any[]>([]);
    const [formData, setFormData] = useState({ title: "", image: "", link: "" });
    const [loading, setLoading] = useState(false);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Check auth
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple mock password
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
            // Check if data is array and doesn't contain error
            if (Array.isArray(data)) {
                setProjects(data);
            } else {
                console.warn("API returned non-array:", data);
                setProjects([]);
            }
        } catch (e) {
            console.error("Failed to fetch projects:", e);
            setProjects([]);
        }
    };

    const handleImageUpload = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append("image", file);

        // Debugging: Hardcoded key to ensure it works. 
        // TODO: Revert to process.env after confirmation.
        const API_KEY = "2d78cb0a82dc30eedac7158c574fdafb";

        console.log("Uploading with Key:", API_KEY ? "Present" : "Missing");

        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                return data.data.url;
            } else {
                console.error("ImgBB Error:", data);
                if (data.error) alert(`Upload Error: ${data.error.message}`);
                return null;
            }
        } catch (e) {
            console.error("Upload network failed", e);
            alert("Upload failed due to network error.");
            return null;
        }
    };

    const resetForm = () => {
        setFormData({ title: "", image: "", link: "" });
        setImageFile(null);
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
            let imageUrl = formData.image;

            // Handle File Upload if selected
            if (imageFile) {
                setUploading(true);
                const uploadedUrl = await handleImageUpload(imageFile);
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                } else {
                    alert("Image upload failed");
                    setLoading(false);
                    setUploading(false);
                    return;
                }
                setUploading(false);
            }

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
        <main className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <button onClick={() => setIsAuthenticated(false)} className="text-red-500 hover:text-red-400">Logout</button>
                </div>

                {/* Add/Edit Form */}
                <section className="bg-neutral-900 border border-white/10 p-6 rounded-xl space-y-6">
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
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-orange-500 hover:file:bg-neutral-700 transition"
                                />
                                {formData.image && !imageFile && (
                                    <p className="text-xs text-green-500">Current Image: <a href={formData.image} target="_blank" className="underline">View</a></p>
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
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">Existing Projects</h2>
                    <div className="grid gap-4">
                        {projects.map((p) => (
                            <div key={p.id} className="flex items-center justify-between bg-neutral-900/50 p-4 rounded border border-white/5 group hover:border-white/20 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-10 bg-gray-800 rounded overflow-hidden relative">
                                        {p.image ? (
                                            <img src={p.image} className="object-cover w-full h-full" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500 bg-neutral-800">No Img</div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <p className="font-bold">{p.title}</p>
                                            {p.category && (
                                                <span className="text-[10px] bg-neutral-800 border border-white/10 px-2 py-0.5 rounded text-gray-400 uppercase tracking-wider">{p.category}</span>
                                            )}
                                        </div>
                                        {p.description && (
                                            <p className="text-xs text-gray-500 line-clamp-1 max-w-md">{p.description}</p>
                                        )}
                                        <a href={p.link} target="_blank" className="text-xs text-blue-400 hover:underline">{p.link}</a>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="text-xs bg-red-900/30 hover:bg-red-900/50 text-red-500 px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
