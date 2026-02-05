"use client";

import React, { memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Footer() {
    const router = useRouter();

    return (
        <footer className="w-full bg-black py-16 px-6 border-t border-white/10 text-gray-400 text-sm">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                {/* Brand / Intro */}
                <div className="flex flex-col space-y-4">
                    <h3 className="text-xl font-bold text-white tracking-tight">Wazeer T</h3>
                    <p className="leading-relaxed text-gray-500">
                        Web Developer & Designer <br />
                        Creating weightless digital experiences.
                    </p>
                </div>

                {/* Socials */}
                <div className="flex flex-col space-y-4">
                    <h3 className="font-semibold text-white uppercase tracking-wider text-xs">Connect</h3>
                    <Link href="https://www.linkedin.com/in/waz1r-t-936617385/" target="_blank" className="hover:text-orange-500 transition-colors">LinkedIn</Link>
                    <Link href="https://github.com/wazeer-dev" target="_blank" className="hover:text-orange-500 transition-colors">GitHub</Link>
                    <Link href="https://www.instagram.com/v4zee_r/" target="_blank" className="hover:text-orange-500 transition-colors">Instagram</Link>
                    <Link href="https://wa.me/919497483212" target="_blank" className="hover:text-orange-500 transition-colors">WhatsApp</Link>
                </div>

                {/* Services */}
                <div className="flex flex-col space-y-4">
                    <h3 className="font-semibold text-white uppercase tracking-wider text-xs">Services</h3>
                    <span className="cursor-default hover:text-white transition-colors">Web Development</span>
                    <span className="cursor-default hover:text-white transition-colors">UI/UX Design</span>
                    <span className="cursor-default hover:text-white transition-colors">Motion Graphics</span>
                    <span className="cursor-default hover:text-white transition-colors">Antigravity Interfaces</span>
                </div>

                {/* Contact / Location */}
                <div className="flex flex-col space-y-4">
                    <h3 className="font-semibold text-white uppercase tracking-wider text-xs">Info</h3>
                    <p className="hover:text-white transition-colors">Kasaragod, Kerala</p>
                    <Link href="mailto:wazeert13@gmail.com" className="hover:text-orange-500 transition-colors">
                        wazeert13@gmail.com
                    </Link>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-6xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
                <p
                    className="cursor-pointer select-none hover:text-white transition-colors"
                    onDoubleClick={() => router.push("/admin")}
                    title="Double click for Admin Access"
                >
                    Copyright © 2026 Wazeer T. All rights reserved.
                </p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                </div>
            </div>
        </footer>
    );
}

export default memo(Footer);
