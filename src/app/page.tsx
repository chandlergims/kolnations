'use client';

import { useAuth } from "../context/AuthContext";
import Link from 'next/link';
import BackgroundMap from "../components/BackgroundMap";

export default function Home() {
  const { isConnected, address } = useAuth();

  return (
    <div className="h-[calc(100vh-4rem)] bg-[#120e14] p-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Map */}
      <BackgroundMap />
      
      {/* Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-4xl font-mono text-[#4ade80] mb-2 flashing-text">kol nations</h1>
        <p className="text-xl text-[#4ade80] mb-16 typewriter">what happens when the trenches come together to colonize nations?</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/explore" className="bg-[#1a1520] hover:bg-[#2d2f39] text-[#4ade80] border border-[#4ade80] px-4 py-2 rounded text-sm font-mono transition-colors">
            explore nations
          </Link>
          <Link href="/create" className="bg-[#1a1520] hover:bg-[#2d2f39] text-[#4ade80] border border-[#4ade80] px-4 py-2 rounded text-sm font-mono transition-colors">
            create nation
          </Link>
        </div>
      </div>
    </div>
  );
}
