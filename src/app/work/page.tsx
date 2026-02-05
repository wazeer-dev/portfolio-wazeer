import Image from "next/image";
import Navbar from "@/components/Navbar";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const revalidate = 0; // Disable static caching for real-time updates

async function getProjects() {
    try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (e) {
        console.error("Firestore Error:", e);
        return [];
    }
}

import WorkBackground from "@/components/work/WorkBackground";

export default async function WorkPage() {
    const projects = await getProjects();

    return (
        <main className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-white pb-20 relative">
            <WorkBackground />
            <Navbar />

            <div className="pt-32 px-6 max-w-7xl mx-auto">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-12 animate-fade-in-up">
                    SELECTED <br className="md:hidden" /> WORK
                </h1>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Render Dynamic Projects */}
                    {projects.map((project: any) => (
                        <a
                            key={project.id}
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-video bg-neutral-900 rounded-xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-colors block"
                        >
                            {/* Background Image */}
                            {(project.image && (project.image.startsWith("http") || project.image.startsWith("/"))) ? (
                                <Image
                                    src={project.image}
                                    alt={project.title || "Project"}
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-neutral-800" />
                            )}

                            {/* Overlay Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 group-hover:bg-transparent transition-colors duration-300">
                                <span className="text-white font-black text-3xl tracking-tighter mix-blend-difference group-hover:scale-110 transition-transform duration-300 text-center px-4">
                                    {project.title.toUpperCase()}
                                </span>
                                <span className="mt-2 text-orange-400 text-xs font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                    View Project
                                </span>
                            </div>
                        </a>
                    ))}

                    {/* Placeholder for future expansion (if needed) or empty state */}
                    {projects.length === 0 && (
                        <div className="col-span-2 text-white/40 text-center py-20 font-mono">
                            No projects loaded.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
