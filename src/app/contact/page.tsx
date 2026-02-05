"use client";

import Navbar from "@/components/Navbar";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-white pb-20">
            <Navbar />

            <div className="pt-32 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

                {/* Left: Info */}
                <div className="space-y-12">
                    <div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 animate-fade-in-up uppercase leading-none">
                            Let's <br /> Talk
                        </h1>
                        <p className="text-xl text-neutral-400 font-light max-w-md animate-fade-in-up delay-100">
                            Have a visionary project? I'm currently open for freelance work and collaborations.
                        </p>
                    </div>

                    <div className="space-y-6 animate-fade-in-up delay-200">
                        <div className="group">
                            <h3 className="text-xs font-mono uppercase text-neutral-500 mb-1">Email</h3>
                            <a href="mailto:wazeert13@gmail.com" className="text-2xl font-bold text-white group-hover:text-orange-500 transition-colors">wazeert13@gmail.com</a>
                        </div>
                        <div className="group">
                            <h3 className="text-xs font-mono uppercase text-neutral-500 mb-1">Phone / WhatsApp</h3>
                            <a href="https://wa.me/919497483212" className="text-2xl font-bold text-white group-hover:text-orange-500 transition-colors">+91 9497 483 212</a>
                        </div>
                    </div>

                    <div className="flex space-x-6 animate-fade-in-up delay-300 pt-8 border-t border-white/10">
                        <a href="https://www.linkedin.com/in/waz1r-t-936617385/" target="_blank" className="text-neutral-400 hover:text-white uppercase text-xs tracking-widest">LinkedIn</a>
                        <a href="https://github.com/wazeer-dev" target="_blank" className="text-neutral-400 hover:text-white uppercase text-xs tracking-widest">GitHub</a>
                        <a href="https://www.instagram.com/v4zee_r/" target="_blank" className="text-neutral-400 hover:text-white uppercase text-xs tracking-widest">Instagram</a>
                    </div>
                </div>

                {/* Right: Mock Form */}
                <form className="bg-neutral-900/50 p-8 rounded-3xl border border-white/5 space-y-6 animate-fade-in-up delay-200 backdrop-blur-sm" onSubmit={(e) => e.preventDefault()}>
                    <h3 className="text-2xl font-bold mb-6">Send a Message</h3>

                    <div className="space-y-1">
                        <label className="text-xs uppercase text-neutral-500 font-bold ml-1">Name</label>
                        <input type="text" placeholder="John Doe" className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white focus:border-orange-500 outline-none transition-colors" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase text-neutral-500 font-bold ml-1">Email</label>
                        <input type="email" placeholder="john@example.com" className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white focus:border-orange-500 outline-none transition-colors" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase text-neutral-500 font-bold ml-1">Project Details</label>
                        <textarea rows={4} placeholder="Tell me about your idea..." className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white focus:border-orange-500 outline-none transition-colors resize-none" />
                    </div>

                    <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all duration-300 rounded-xl mt-4">
                        Send Request
                    </button>
                    <p className="text-center text-xs text-neutral-600 mt-4">* This form is currently a demo. Please email directly.</p>
                </form>

            </div>
        </main>
    );
}
