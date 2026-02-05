"use client";

import Navbar from "@/components/Navbar";
import TextReveal from "@/components/animations/TextReveal";
import StaggerReveal from "@/components/animations/StaggerReveal";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-white pb-20 overflow-hidden">
            <Navbar />

            {/* Hero Section */}
            <div className="pt-32 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">

                {/* Text Content */}
                <div className="md:w-1/2 z-10">
                    <TextReveal>
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 uppercase leading-[0.8]">
                            About <br /><span className="text-orange-500">Wazeer</span>
                        </h1>
                    </TextReveal>

                    <StaggerReveal delay={0.2}>
                        <div className="space-y-6">
                            <p className="text-xl md:text-2xl text-neutral-300 font-light leading-relaxed">
                                I am a creative technologist based in <span className="text-white font-bold border-b border-orange-500">Kasaragod</span>, obsessed with the sweet spot between performance and beauty.
                            </p>
                            <p className="text-neutral-400 leading-relaxed max-w-lg">
                                My philosophy is simple: <span className="text-white italic">"If it's not fluid, it's broken."</span> I build digital experiences that respect the user's time and delight their senses. From complex backend architectures to pixel-perfect frontend animations, I handle the full spectrum of development.
                            </p>
                        </div>
                    </StaggerReveal>

                    {/* Stats / Details */}
                    <StaggerReveal delay={0.4}>
                        <div className="grid grid-cols-2 gap-8 mt-12">
                            <div>
                                <span className="block text-4xl font-bold text-white">2+</span>
                                <span className="text-sm text-neutral-500 uppercase tracking-widest">Years Experience</span>
                            </div>
                            <div>
                                <span className="block text-4xl font-bold text-white">100%</span>
                                <span className="text-sm text-neutral-500 uppercase tracking-widest">Client Satisfaction</span>
                            </div>
                        </div>
                    </StaggerReveal>
                </div>

                {/* Abstract Visual / Custom Card */}
                <div className="md:w-1/2 relative h-[500px] w-full animate-fade-in-up delay-300">
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-purple-500/10 rounded-full blur-[100px] animate-pulse" />

                    <div className="relative z-10 w-full h-full border border-white/10 rounded-2xl overflow-hidden group hover:border-orange-500/30 transition-colors">
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            {/* Note: User provided image path */}
                            <img
                                src="/Whisk_99324cb0f1394b6a7ee4a5e88aa9e827dr (1).jpg"
                                alt="Creative Stack"
                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                            <div className="text-8xl animate-float"></div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-4">The Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "React", "Next.js", "JS", "Firebase", "GitHub", // Core
                                        "HTML/CSS", "Bootstrap", // Basics
                                        "CapCut", "Alight Motion", "Lightroom", // Visual
                                        "Antigravity UI", "Modeling" // Specialty
                                    ].map((tech) => (
                                        <span key={tech} className="px-3 py-1 text-xs border border-white/20 bg-white/5 backdrop-blur-md rounded-full text-white/80 group-hover:text-white group-hover:border-white/40 transition-colors">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Philosophy / Skills Strip */}
            <div className="mt-32 border-y border-white/5 py-12 bg-neutral-900/30">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <h4 className="text-orange-500 font-mono text-sm uppercase tracking-widest">01. Design</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Every pixel serves a purpose. I design interfaces that are intuitive, accessible, and visually striking.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-orange-500 font-mono text-sm uppercase tracking-widest">02. Development</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Clean, scalable code. I prioritize performance, SEO, and maintainability in every codebase.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-orange-500 font-mono text-sm uppercase tracking-widest">03. Deployment</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            CI/CD pipelines, cloud infrastructure, and robust testing ensure your project launches without a hitch.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
