'use client';

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

interface Nation {
  _id: string;
  name: string;
  founderAddress: string;
  memberCount: number;
  members: string[];
  territory?: string;
  createdAt: string;
  updatedAt: string;
}

export default function NationsPage() {
  const { isConnected, address } = useAuth();
  
  const [nations, setNations] = useState<Nation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all nations
  useEffect(() => {
    const fetchNations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/nations");
        const data = await response.json();

        if (data.success) {
          // Filter nations to only include those with territories
          const nationsWithTerritories = data.nations.filter((nation: Nation) => nation.territory);
          
          // Sort by member count (descending)
          const sortedNations = [...nationsWithTerritories].sort((a, b) => 
            b.memberCount - a.memberCount
          );
          
          setNations(sortedNations);
        } else {
          setError(data.error || "Failed to fetch nations");
        }
      } catch (error: any) {
        setError(error.message || "Failed to fetch nations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNations();
  }, []);

  // State requirements and hourly rates mapping (copied from rewards page)
  const stateRewards = {
    "California": { baseRate: 0.50, memberMultiplier: 0.02, requirement: 15 },
    "Texas": { baseRate: 0.45, memberMultiplier: 0.02, requirement: 12 },
    "Florida": { baseRate: 0.40, memberMultiplier: 0.02, requirement: 10 },
    "New York": { baseRate: 0.40, memberMultiplier: 0.02, requirement: 10 },
    "Pennsylvania": { baseRate: 0.35, memberMultiplier: 0.015, requirement: 8 },
    "Illinois": { baseRate: 0.35, memberMultiplier: 0.015, requirement: 8 },
    "Ohio": { baseRate: 0.30, memberMultiplier: 0.015, requirement: 7 },
    "Georgia": { baseRate: 0.30, memberMultiplier: 0.015, requirement: 7 },
    "North Carolina": { baseRate: 0.25, memberMultiplier: 0.015, requirement: 6 },
    "Michigan": { baseRate: 0.25, memberMultiplier: 0.015, requirement: 6 },
    "New Jersey": { baseRate: 0.25, memberMultiplier: 0.01, requirement: 5 },
    "Virginia": { baseRate: 0.25, memberMultiplier: 0.01, requirement: 5 },
    "Washington": { baseRate: 0.25, memberMultiplier: 0.01, requirement: 5 },
    "Arizona": { baseRate: 0.20, memberMultiplier: 0.01, requirement: 4 },
    "Massachusetts": { baseRate: 0.20, memberMultiplier: 0.01, requirement: 4 },
    "Tennessee": { baseRate: 0.20, memberMultiplier: 0.01, requirement: 4 },
    "Indiana": { baseRate: 0.20, memberMultiplier: 0.01, requirement: 3 },
    "Missouri": { baseRate: 0.20, memberMultiplier: 0.01, requirement: 3 },
    "Maryland": { baseRate: 0.20, memberMultiplier: 0.01, requirement: 3 },
    "Wisconsin": { baseRate: 0.20, memberMultiplier: 0.01, requirement: 3 },
    "Colorado": { baseRate: 0.20, memberMultiplier: 0.01, requirement: 3 },
    "Minnesota": { baseRate: 0.20, memberMultiplier: 0.01, requirement: 3 },
    "South Carolina": { baseRate: 0.15, memberMultiplier: 0.01, requirement: 2 },
    "Alabama": { baseRate: 0.15, memberMultiplier: 0.01, requirement: 2 },
    "Louisiana": { baseRate: 0.15, memberMultiplier: 0.01, requirement: 2 },
    "Kentucky": { baseRate: 0.15, memberMultiplier: 0.01, requirement: 2 },
    "Oregon": { baseRate: 0.15, memberMultiplier: 0.01, requirement: 2 },
    "Oklahoma": { baseRate: 0.15, memberMultiplier: 0.01, requirement: 2 },
    "Connecticut": { baseRate: 0.15, memberMultiplier: 0.01, requirement: 2 },
    "Utah": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "Iowa": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "Nevada": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "Arkansas": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "Mississippi": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "Kansas": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "New Mexico": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "Nebraska": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "West Virginia": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "Idaho": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "Hawaii": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "New Hampshire": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "Maine": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "Montana": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "Rhode Island": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "Delaware": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "South Dakota": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "North Dakota": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "Alaska": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "Vermont": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 },
    "Wyoming": { baseRate: 0.15, memberMultiplier: 0.005, requirement: 1 }
  };

  // Calculate hourly earnings based on territory and member count
  const calculateHourlyRate = (nation: Nation): number => {
    if (!nation.territory) return 0;
    
    const stateData = stateRewards[nation.territory as keyof typeof stateRewards];
    if (!stateData) return 0;
    
    // Formula: Base rate + (member count * member multiplier)
    return stateData.baseRate + (nation.memberCount * stateData.memberMultiplier);
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-[#120e14] p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-mono text-[#4ade80] mb-6">nations leaderboard</h1>
          
          <div className="bg-[#120e14] border border-gray-700 rounded-lg p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ade80]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#120e14] p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-mono text-[#4ade80] mb-6">nations leaderboard</h1>
        
        {error && (
          <div className="bg-[#120e14] border border-red-500 text-red-400 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <div className="bg-[#1a1721] border border-gray-700 rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-4 bg-[#120e14] border-b border-gray-700">
            <h2 className="text-lg font-mono text-[#4ade80]">top nations with claimed territories</h2>
            <p className="text-sm text-gray-400 mt-1">
              displaying the top 7 nations ranked by member count and earnings
            </p>
          </div>
          
          {nations.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-400">no nations have claimed territories yet.</p>
              <Link href="/explore" className="text-[#4ade80] hover:underline mt-2 inline-block">
                explore the map to see available territories
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1a1721] text-left">
                    <th className="px-6 py-3 text-xs font-mono text-gray-400 uppercase tracking-wider">rank</th>
                    <th className="px-6 py-3 text-xs font-mono text-gray-400 uppercase tracking-wider">nation</th>
                    <th className="px-6 py-3 text-xs font-mono text-gray-400 uppercase tracking-wider">territory</th>
                    <th className="px-6 py-3 text-xs font-mono text-gray-400 uppercase tracking-wider">members</th>
                    <th className="px-6 py-3 text-xs font-mono text-gray-400 uppercase tracking-wider">earnings</th>
                    <th className="px-6 py-3 text-xs font-mono text-gray-400 uppercase tracking-wider">founder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {nations.slice(0, 7).map((nation, index) => (
                    <tr key={nation._id} className={index % 2 === 0 ? 'bg-[#120e14]' : 'bg-[#1a1721]'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`
                            flex items-center justify-center w-8 h-8 rounded-full 
                            ${index === 0 ? 'bg-[#ffd700] text-black' : 
                              index === 1 ? 'bg-[#c0c0c0] text-black' : 
                              index === 2 ? 'bg-[#cd7f32] text-black' : 'bg-[#1a1721] text-[#4ade80] border border-[#4ade80]'}
                            font-mono text-sm
                          `}>
                            {index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[#1a1721] border border-[#4ade80] rounded-full flex items-center justify-center text-[#4ade80] font-mono mr-3">
                            {nation.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-mono text-gray-300">{nation.name}</div>
                            <div className="text-xs text-gray-500">created {new Date(nation.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-mono rounded-full bg-[#1a1721] text-[#4ade80] border border-[#4ade80]">
                          {nation.territory}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                          </svg>
                          {nation.memberCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#4ade80]">${calculateHourlyRate(nation).toFixed(2)}/hour</div>
                        <div className="text-xs text-gray-500">based on formula</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {nation.founderAddress.slice(0, 6)}...{nation.founderAddress.slice(-4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <Link href="/explore" className="inline-block bg-[#120e14] hover:bg-[#2d2f39] text-[#4ade80] border border-[#4ade80] px-4 py-2 rounded text-sm font-mono transition-colors">
            explore the map
          </Link>
          <p className="text-sm text-gray-400 mt-2">
            visit the map to see all claimed territories and available states
          </p>
        </div>
      </div>
    </div>
  );
}
