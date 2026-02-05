import MasterScrollSequence from "@/components/sequence/MasterScrollSequence";
import Navbar from "@/components/Navbar";

export default function Page() {
  return (
    <main className="bg-black text-white selection:bg-orange-500 selection:text-white">
      <Navbar />
      <MasterScrollSequence />
    </main>
  );
}
