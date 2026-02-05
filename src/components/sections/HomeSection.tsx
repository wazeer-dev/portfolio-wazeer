import ScrollSequenceBackground from "@/components/sequence/ScrollSequenceBackground";

export default function HomeSection() {
    return (
        <section id="home" className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Sequence */}
            <ScrollSequenceBackground sequenceId="web1" />

            {/* Foreground Content */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
                {/* "iPhone 17" - Positioned near top 1/3 */}
                <div className="absolute top-[25%] md:top-[30%] flex flex-col items-center animate-fade-in-up">
                    <h2 className="text-orange-500 font-semibold text-xl md:text-3xl tracking-wide">
                        iPhone 17
                    </h2>
                </div>

                {/* "PRO" - Massive, Center */}
                <div className="flex items-center justify-center">
                    <h1 className="text-orange-500 font-black text-[120px] md:text-[200px] lg:text-[300px] leading-none tracking-tighter drop-shadow-2xl">
                        PRO
                    </h1>
                </div>

                {/* "Buy" Button - Bottom 1/3 */}
                <div className="absolute bottom-[20%] md:bottom-[25%] pointer-events-auto">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 py-3 text-lg font-medium transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20">
                        Buy
                    </button>
                </div>
            </div>
        </section>
    );
}
