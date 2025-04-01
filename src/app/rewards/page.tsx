'use client';

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

// Dropdown component for expandable sections
const Dropdown = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-center text-md font-mono text-[#4ade80] hover:text-[#6ee7a0] focus:outline-none"
      >
        <span className="mr-2">{isOpen ? 'v' : '>'}</span>
        {title}
      </button>
      {isOpen && (
        <div className="mt-4 pl-6 border-l border-[#4ade80]">
          {children}
        </div>
      )}
    </div>
  );
};

// State requirements and hourly rates mapping
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

export default function RewardsPage() {
  const { isConnected, address } = useAuth();
  
  const [nations, setNations] = useState<Nation[]>([]);
  const [claimedTerritories, setClaimedTerritories] = useState<{[key: string]: Nation}>({});
  const [userNation, setUserNation] = useState<Nation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"state" | "rate" | "requirement">("rate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Fetch all nations and claimed territories
  useEffect(() => {
    const fetchNations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/nations");
        const data = await response.json();

        if (data.success) {
          setNations(data.nations);
          
          // Build claimed territories map
          const territoriesMap: {[key: string]: Nation} = {};
          data.nations.forEach((nation: Nation) => {
            if (nation.territory) {
              territoriesMap[nation.territory] = nation;
            }
          });
          setClaimedTerritories(territoriesMap);
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

  // Check if the user already has a nation
  useEffect(() => {
    const checkUserNation = async () => {
      if (!isConnected || !address) {
        return;
      }

      try {
        const response = await fetch(`/api/nations/user?address=${address}`);
        const data = await response.json();

        if (data.success && data.hasNation) {
          setUserNation(data.nation);
        }
      } catch (error) {
        console.error("Error checking user nation:", error);
      }
    };

    checkUserNation();
  }, [isConnected, address]);

  // Calculate the total hourly rate for a state based on member count
  const calculateHourlyRate = (stateName: string, memberCount: number) => {
    const stateData = stateRewards[stateName as keyof typeof stateRewards];
    if (!stateData) return 0;
    
    // Formula: Base rate + (member count * member multiplier)
    return stateData.baseRate + (memberCount * stateData.memberMultiplier);
  };

  // Filter states based on search term
  const filteredStates = Object.keys(stateRewards).filter(state => 
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort states based on selected criteria
  const sortedStates = [...filteredStates].sort((a, b) => {
    const stateDataA = stateRewards[a as keyof typeof stateRewards];
    const stateDataB = stateRewards[b as keyof typeof stateRewards];
    
    if (sortBy === "state") {
      return sortDirection === "asc" 
        ? a.localeCompare(b) 
        : b.localeCompare(a);
    } else if (sortBy === "rate") {
      return sortDirection === "asc" 
        ? stateDataA.baseRate - stateDataB.baseRate 
        : stateDataB.baseRate - stateDataA.baseRate;
    } else { // requirement
      return sortDirection === "asc" 
        ? stateDataA.requirement - stateDataB.requirement 
        : stateDataB.requirement - stateDataA.requirement;
    }
  });

  // Toggle sort direction
  const toggleSort = (criteria: "state" | "rate" | "requirement") => {
    if (sortBy === criteria) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortDirection("desc");
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ade80]"></div>
    </div>
  );

  // Check if user has a nation with territory
  const hasUserNationWithTerritory = userNation && userNation.territory;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#120e14] p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-mono text-[#4ade80] mb-6">territory rewards</h1>
        
        {error && (
          <div className="bg-[#120e14] border border-red-500 text-red-400 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <div className="bg-[#120e14] rounded-lg p-6 mb-6">
          {isConnected && (
            <div className="bg-[#120e14] rounded-lg p-4 mb-6">
              <h3 className="text-md font-mono text-[#4ade80] mb-2">your nation's rewards</h3>
              
              {isLoading ? (
                <LoadingSpinner />
              ) : hasUserNationWithTerritory ? (
                <>
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="bg-[#1a1721] rounded-lg border border-gray-700 p-4 flex-grow">
                      <p className="text-gray-400 text-sm mb-1">territory</p>
                      <p className="text-xl font-mono text-[#4ade80]">{userNation.territory}</p>
                    </div>
                    <div className="bg-[#1a1721] rounded-lg border border-gray-700 p-4 flex-grow">
                      <p className="text-gray-400 text-sm mb-1">base rate</p>
                      <p className="text-xl font-mono text-[#4ade80]">
                        ${stateRewards[userNation.territory as keyof typeof stateRewards]?.baseRate.toFixed(2)}/hour
                      </p>
                    </div>
                    <div className="bg-[#1a1721] rounded-lg border border-gray-700 p-4 flex-grow">
                      <p className="text-gray-400 text-sm mb-1">member count</p>
                      <p className="text-xl font-mono text-[#4ade80]">{userNation.memberCount}</p>
                    </div>
                    <div className="bg-[#1a1721] rounded-lg border border-gray-700 p-4 flex-grow">
                      <p className="text-gray-400 text-sm mb-1">current hourly rate</p>
                      <p className="text-xl font-mono text-[#4ade80]">
                        ${calculateHourlyRate(userNation.territory || "", userNation.memberCount).toFixed(2)}/hour
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mt-4">
                    grow your nation by inviting more members to increase your hourly rewards!
                  </p>
                </>
              ) : (
                <p className="text-gray-300 text-sm">
                  you don't have a nation with a claimed territory yet. create or join a nation and claim a territory to start earning rewards!
                </p>
              )}
            </div>
          )}
          
          <div className="mb-4">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="md:w-1/2">
                <label htmlFor="search" className="block text-sm font-mono text-[#4ade80] mb-1">
                  search states
                </label>
                <input
                  type="text"
                  id="search"
                  className="w-full px-3 py-2 bg-[#120e14] border border-gray-700 rounded-md shadow-sm text-gray-300 focus:outline-none focus:ring-[#4ade80] focus:border-[#4ade80]"
                  placeholder="search by state name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="md:w-1/2">
                <label className="block text-sm font-mono text-gray-300 mb-1">
                  sort by
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSort("state")}
                    className={`px-3 py-2 border rounded-md text-sm font-mono ${
                      sortBy === "state" 
                        ? "bg-[#120e14] border-[#4ade80] text-[#4ade80]" 
                        : "bg-[#120e14] border-gray-700 text-gray-300 hover:bg-[#1a1721]"
                    }`}
                  >
                    state name {sortBy === "state" && (sortDirection === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => toggleSort("rate")}
                    className={`px-3 py-2 border rounded-md text-sm font-mono ${
                      sortBy === "rate" 
                        ? "bg-[#120e14] border-[#4ade80] text-[#4ade80]" 
                        : "bg-[#120e14] border-gray-700 text-gray-300 hover:bg-[#1a1721]"
                    }`}
                  >
                    base rate {sortBy === "rate" && (sortDirection === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => toggleSort("requirement")}
                    className={`px-3 py-2 border rounded-md text-sm font-mono ${
                      sortBy === "requirement" 
                        ? "bg-[#120e14] border-[#4ade80] text-[#4ade80]" 
                        : "bg-[#120e14] border-gray-700 text-gray-300 hover:bg-[#1a1721]"
                    }`}
                  >
                    requirement {sortBy === "requirement" && (sortDirection === "asc" ? "↑" : "↓")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto overflow-y-auto h-[400px]">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-[#120e14]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">
                    state
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">
                    base rate ($/hour)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">
                    member multiplier
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">
                    min. members required
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">
                    status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-mono text-gray-400 uppercase tracking-wider">
                    current rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ade80]"></div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedStates.map((state, index) => {
                    const stateData = stateRewards[state as keyof typeof stateRewards];
                    const isClaimed = !!claimedTerritories[state];
                    const claimingNation = claimedTerritories[state];
                    const currentRate = isClaimed 
                      ? calculateHourlyRate(state, claimingNation.memberCount) 
                      : stateData.baseRate;
                    
                    return (
                      <tr key={state} className={index % 2 === 0 ? 'bg-[#120e14]' : 'bg-[#1a1721]'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                          {state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          ${stateData.baseRate.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          ${stateData.memberMultiplier.toFixed(3)} per member
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {stateData.requirement}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isClaimed ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-mono rounded-full bg-[#120e14] text-[#4ade80] border border-[#4ade80]">
                              claimed by {claimingNation.name}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-mono rounded-full bg-[#120e14] text-gray-300 border border-gray-700">
                              available
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          <span className={isClaimed ? "text-[#4ade80]" : "text-gray-300"}>
                            ${currentRate.toFixed(2)}/hour
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {filteredStates.length === 0 && !isLoading && (
            <div className="text-center py-4">
              <p className="text-gray-400">no states match your search criteria.</p>
            </div>
          )}
        </div>
        
        <div className="bg-[#120e14] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-mono text-[#4ade80] mb-4">how rewards work</h2>
          
          <Dropdown title="reward system">
            <p className="text-gray-300 text-sm mb-3">
              each territory earns a base hourly rate plus bonuses based on your nation's member count.
            </p>
            <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
              <li><strong className="text-[#4ade80]">base rate:</strong> each state has a fixed hourly rate (from $0.15 to $0.50)</li>
              <li><strong className="text-[#4ade80]">member bonus:</strong> additional rewards based on your nation's member count</li>
              <li><strong className="text-[#4ade80]">formula:</strong> base rate + (member count × member multiplier)</li>
              <li><strong className="text-[#4ade80]">larger states:</strong> higher base rates but require more members to claim</li>
              <li><strong className="text-[#4ade80]">smaller states:</strong> lower base rates but easier to claim</li>
              <li><strong className="text-[#4ade80]">payments:</strong> rewards are paid out to the nation founder</li>
            </ul>
          </Dropdown>
        </div>
        
        <div className="bg-[#120e14] rounded-lg p-6">
          <h2 className="text-xl font-mono text-[#4ade80] mb-4">reward examples</h2>
          
          <Dropdown title="reward examples">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#120e14] border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-mono text-[#4ade80] mb-2">small state example</h3>
                <p className="text-gray-300 text-sm mb-3">Wyoming with 5 members:</p>
                <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
                  <li>Base Rate: $0.15/hour</li>
                  <li>Member Bonus: 5 × $0.005 = $0.025/hour</li>
                  <li>Total Hourly Rate: $0.175/hour</li>
                  <li>Daily Earnings: $4.20</li>
                  <li>Monthly Earnings: $126.00</li>
                </ul>
              </div>
              
              <div className="bg-[#120e14] border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-mono text-[#4ade80] mb-2">medium state example</h3>
                <p className="text-gray-300 text-sm mb-3">Virginia with 10 members:</p>
                <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
                  <li>Base Rate: $0.25/hour</li>
                  <li>Member Bonus: 10 × $0.01 = $0.10/hour</li>
                  <li>Total Hourly Rate: $0.35/hour</li>
                  <li>Daily Earnings: $8.40</li>
                  <li>Monthly Earnings: $252.00</li>
                </ul>
              </div>
              
              <div className="bg-[#120e14] border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-mono text-[#4ade80] mb-2">large state example</h3>
                <p className="text-gray-300 text-sm mb-3">California with 20 members:</p>
                <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
                  <li>Base Rate: $0.50/hour</li>
                  <li>Member Bonus: 20 × $0.02 = $0.40/hour</li>
                  <li>Total Hourly Rate: $0.90/hour</li>
                  <li>Daily Earnings: $21.60</li>
                  <li>Monthly Earnings: $648.00</li>
                </ul>
              </div>
            </div>
          </Dropdown>
          
          <div className="mt-6">
            <Dropdown title="important notes">
              <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
                <li>rewards are calculated hourly and paid out to nation founders and members</li>
                <li>growing your nation by adding more members increases your hourly rate</li>
                <li>larger states have higher base rates but require more members to claim</li>
                <li>rewards are subject to change based on platform growth and economy</li>
                <li>unclaimed territories do not generate rewards</li>
              </ul>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}
