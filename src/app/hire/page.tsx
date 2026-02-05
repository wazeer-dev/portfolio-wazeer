"use client";

import Navbar from "@/components/Navbar";
import StaggerReveal from "@/components/animations/StaggerReveal";

export default function HirePage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-white pb-20">
            <Navbar />

            <div className="pt-32 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 animate-fade-in-up uppercase">
                        Work With <br className="md:hidden" /> Me
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-400 font-light max-w-2xl mx-auto animate-fade-in-up delay-100">
                        Turning complex ideas into weightless, high-performance digital reality.
                    </p>
                </div>

                {/* Services Grid */}
                {/* Services Grid */}
                <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Service 1 */}
                    <div className="opacity-0 p-8 border border-white/10 rounded-3xl hover:border-orange-500 hover:bg-neutral-900/50 transition-all duration-300 group cursor-default">
                        <div className="mb-4 text-4xl group-hover:scale-110 transition-transform duration-300">💻</div>
                        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-orange-500 transition-colors">Web Development</h3>
                        <p className="text-neutral-400 leading-relaxed mb-6 group-hover:text-neutral-300">
                            Full-stack applications built with Next.js, React, and TypeScript. Fast, responsive, and scalable.
                        </p>
                        <span className="text-xs font-mono uppercase tracking-widest text-white/30 group-hover:text-white/80 transition-colors">Frontend • Backend • API</span>
                    </div>

                    {/* Service 2 */}
                    <div className="opacity-0 p-8 border border-white/10 rounded-3xl hover:border-orange-500 hover:bg-neutral-900/50 transition-all duration-300 group cursor-default">
                        <div className="mb-4 text-4xl group-hover:scale-110 transition-transform duration-300">🎨</div>
                        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-orange-500 transition-colors">UI/UX Design</h3>
                        <p className="text-neutral-400 leading-relaxed mb-6 group-hover:text-neutral-300">
                            Premium aesthetic interfaces that focus on user experience and visual storytelling.
                        </p>
                        <span className="text-xs font-mono uppercase tracking-widest text-white/30 group-hover:text-white/80 transition-colors">Prototyping • Systems</span>
                    </div>

                    {/* Service 3 */}
                    <div className="opacity-0 p-8 border border-white/10 rounded-3xl hover:border-orange-500 hover:bg-neutral-900/50 transition-all duration-300 group cursor-default">
                        <div className="mb-4 text-4xl group-hover:scale-110 transition-transform duration-300">✨</div>
                        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-orange-500 transition-colors">Motion & 3D</h3>
                        <p className="text-neutral-400 leading-relaxed mb-6 group-hover:text-neutral-300">
                            Adding depth and life to websites with WebGL, Spline, and fluid animations.
                        </p>
                        <span className="text-xs font-mono uppercase tracking-widest text-white/30 group-hover:text-white/80 transition-colors">GSAP • Spline</span>
                    </div>
                </StaggerReveal>

                {/* Process Section */}
                <div className="mt-32 mb-20 animate-fade-in-up delay-300">
                    <h2 className="text-3xl font-black text-center mb-12 uppercase tracking-tight">The Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "Discovery", desc: "Understanding the vision and goals." },
                            { step: "02", title: "Design", desc: "Crafting the visual identity and flow." },
                            { step: "03", title: "Build", desc: "Coding with precision and clean logic." },
                            { step: "04", title: "Launch", desc: "Deploying and optimizing for the world." }
                        ].map((item) => (
                            <div key={item.step} className="text-center relative">
                                <div className="text-6xl font-black text-neutral-800 absolute -top-4 left-1/2 -translate-x-1/2 -z-10 select-none">{item.step}</div>
                                <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                <p className="text-sm text-neutral-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center animate-fade-in-up delay-300">
                    <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-white/20 via-orange-500 to-white/20">
                        <a
                            href="mailto:wazeert13@gmail.com"
                            className="block px-12 py-4 bg-black rounded-full text-xl font-bold tracking-wide hover:bg-white/10 transition-colors"
                        >
                            Start a Project
                        </a>
                    </div>
                    <p className="mt-6 text-neutral-500 text-sm">Currently accepting new clients for 2026.</p>
                </div>

            </div>
        </main>
    );
}
