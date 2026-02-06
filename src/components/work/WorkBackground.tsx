"use client";

export default function WorkBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-black">
            <img
                src="/Whisk_99324cb0f1394b6a7ee4a5e88aa9e827dr (1).jpg"
                alt="Work Background"
                className="w-full h-full object-cover opacity-60 grayscale"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />
        </div>
    );
}
