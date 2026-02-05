export interface SequenceConfig {
    id: string;
    folder: string;
    totalFrames: number;
    suffix: string; // e.g. "_delay-0.037s"
    padding: number; // e.g. 3 or 4
    label: string; // Text to display for this section
    description?: string; // Optional description text
    subtext?: string; // Optional smaller subtext (like location)
    buttonText?: string; // Optional CTA button text
    buttonLink?: string; // Optional CTA link
}

export const SEQUENCES: SequenceConfig[] = [
    {
        id: "web1",
        folder: "https://pwhyyqvqxmjkbwqlcipn.supabase.co/storage/v1/object/public/web%201",
        totalFrames: 273,
        suffix: "_delay-0.037s",
        padding: 3,
        label: "Wazeer T",
        description: "Web Developer & Designer",
        subtext: "📍 Kasaragod, Kerala"
    },
    {
        id: "web2",
        folder: "https://pwhyyqvqxmjkbwqlcipn.supabase.co/storage/v1/object/public/web%202",
        totalFrames: 280,
        suffix: "_delay-0.036s",
        padding: 3,
        label: "Experience",
        description: "Web Developer | TRGADS",
        subtext: "Building high-performance web solutions with Antigravity principles."
    },
    {
        id: "web3",
        folder: "https://pwhyyqvqxmjkbwqlcipn.supabase.co/storage/v1/object/public/web%203",
        totalFrames: 280,
        suffix: "_delay-0.036s",
        padding: 3,
        label: "Web Basics",
        description: "HTML, CSS, Bootstrap",
    },
    {
        id: "web4",
        folder: "https://pwhyyqvqxmjkbwqlcipn.supabase.co/storage/v1/object/public/web%204",
        totalFrames: 280,
        suffix: "_delay-0.036s",
        padding: 3,
        label: "Core Coding",
        description: "React, Next.js, JavaScript, API",
        subtext: "Firebase, GitHub"
    },
    {
        id: "web5",
        folder: "https://pwhyyqvqxmjkbwqlcipn.supabase.co/storage/v1/object/public/web%205",
        totalFrames: 280,
        suffix: "_delay-0.036s",
        padding: 3,
        label: "Visual Tech",
        description: "CapCut, Alight Motion, Lightroom",
    },
    {
        id: "web6",
        folder: "https://pwhyyqvqxmjkbwqlcipn.supabase.co/storage/v1/object/public/web%206",
        totalFrames: 280,
        suffix: "_delay-0.036s",
        padding: 3,
        label: "Specialty",
        description: "Antigravity UI/UX",
        subtext: "Trending Design, Modeling"
    },
    {
        id: "web7",
        folder: "https://pwhyyqvqxmjkbwqlcipn.supabase.co/storage/v1/object/public/web%207",
        totalFrames: 280,
        suffix: "_delay-0.036s",
        padding: 3,
        label: "Antigravity Expert",
        description: "Specialist in weightless interface movements",
        subtext: "High-end design aesthetics"
    },
    {
        id: "web8",
        folder: "https://pwhyyqvqxmjkbwqlcipn.supabase.co/storage/v1/object/public/web%208",
        totalFrames: 280,
        suffix: "_delay-0.036s",
        padding: 3,
        label: "Full-Stack",
        description: "Bridging Logic & Creativity",
        subtext: "Clean code meets trending styles",
        buttonText: "See the Work",
        buttonLink: "/work"
    },
    {
        id: "web9",
        folder: "https://pwhyyqvqxmjkbwqlcipn.supabase.co/storage/v1/object/public/web%209",
        totalFrames: 280,
        suffix: "_delay-0.036s",
        padding: 3,
        label: "Education",
        description: "Full Stack Development",
        subtext: "G-TEC Education"
    },
    {
        id: "web10",
        folder: "https://pwhyyqvqxmjkbwqlcipn.supabase.co/storage/v1/object/public/web%2010",
        totalFrames: 280,
        suffix: "_delay-0.036s",
        padding: 3,
        label: "Education",
        description: "Higher Secondary (+2)",
        subtext: "School Name"
    },
    {
        id: "web11",
        folder: "https://pwhyyqvqxmjkbwqlcipn.supabase.co/storage/v1/object/public/web%2011",
        totalFrames: 280,
        suffix: "_delay-0.036s",
        padding: 3,
        label: "Location",
        description: "Kasaragod, Kerala",
    },
    {
        id: "web12",
        folder: "https://pwhyyqvqxmjkbwqlcipn.supabase.co/storage/v1/object/public/web%2012",
        totalFrames: 182,
        suffix: "_delay-0.036s",
        padding: 3,
        label: "Contact Me",
        description: "Ready to Create?",
    },
];
