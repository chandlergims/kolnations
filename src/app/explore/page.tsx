'use client';

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { 
  ComposableMap, 
  Geographies, 
  Geography,
  ZoomableGroup
} from "react-simple-maps";

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

// US States GeoJSON data URL
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// State requirements mapping (example)
const stateRequirements = {
  "California": 15,
  "Texas": 12,
  "Florida": 10,
  "New York": 10,
  "Pennsylvania": 8,
  "Illinois": 8,
  "Ohio": 7,
  "Georgia": 7,
  "North Carolina": 6,
  "Michigan": 6,
  "New Jersey": 5,
  "Virginia": 5,
  "Washington": 5,
  "Arizona": 4,
  "Massachusetts": 4,
  "Tennessee": 4,
  "Indiana": 3,
  "Missouri": 3,
  "Maryland": 3,
  "Wisconsin": 3,
  "Colorado": 3,
  "Minnesota": 3,
  "South Carolina": 2,
  "Alabama": 2,
  "Louisiana": 2,
  "Kentucky": 2,
  "Oregon": 2,
  "Oklahoma": 2,
  "Connecticut": 2,
  "Utah": 1,
  "Iowa": 1,
  "Nevada": 1,
  "Arkansas": 1,
  "Mississippi": 1,
  "Kansas": 1,
  "New Mexico": 1,
  "Nebraska": 1,
  "West Virginia": 1,
  "Idaho": 1,
  "Hawaii": 1,
  "New Hampshire": 1,
  "Maine": 1,
  "Montana": 1,
  "Rhode Island": 1,
  "Delaware": 1,
  "South Dakota": 1,
  "North Dakota": 1,
  "Alaska": 1,
  "Vermont": 1,
  "Wyoming": 1
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

export default function ExplorePage() {
  const { isConnected, address } = useAuth();
  
  const [nations, setNations] = useState<Nation[]>([]);
  const [filteredNations, setFilteredNations] = useState<Nation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState("");
  const [joiningNationId, setJoiningNationId] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [leaveError, setLeaveError] = useState("");
  const [leaveSuccess, setLeaveSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [hoveredState, setHoveredState] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [isClaimingTerritory, setIsClaimingTerritory] = useState(false);
  const [claimError, setClaimError] = useState("");
  const [claimSuccess, setClaimSuccess] = useState("");
  const [claimedTerritories, setClaimedTerritories] = useState<{[key: string]: Nation}>({});
  
  const [userNation, setUserNation] = useState<Nation | null>(null);
  const [isCheckingNation, setIsCheckingNation] = useState(true);

  // Fetch all nations and claimed territories
  useEffect(() => {
    const fetchNations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/nations");
        const data = await response.json();

        if (data.success) {
          // Sort nations by creation date (newest first)
          const sortedNations = [...data.nations].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setNations(sortedNations);
          setFilteredNations(sortedNations);
          
          // Build claimed territories map
          const territoriesMap: {[key: string]: Nation} = {};
          sortedNations.forEach(nation => {
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

  // Filter nations based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredNations(nations);
    } else {
      const filtered = nations.filter(nation => 
        nation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nation.founderAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNations(filtered);
    }
  }, [searchTerm, nations]);

  // Check if the user already has a nation
  useEffect(() => {
    const checkUserNation = async () => {
      if (!isConnected || !address) {
        setIsCheckingNation(false);
        return;
      }

      try {
        setIsCheckingNation(true);
        const response = await fetch(`/api/nations/user?address=${address}`);
        const data = await response.json();

        if (data.success && data.hasNation) {
          setUserNation(data.nation);
        }
      } catch (error) {
        console.error("Error checking user nation:", error);
      } finally {
        setIsCheckingNation(false);
      }
    };

    checkUserNation();
  }, [isConnected, address]);

  const handleJoinNation = async (nationId: string) => {
    if (!isConnected) {
      setJoinError("Please connect your wallet first");
      return;
    }

    try {
      setJoiningNationId(nationId);
      setJoinError("");
      
      const response = await fetch("/api/nations/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nationId,
          address,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to join nation");
      }
      
      setJoinSuccess("Successfully joined the nation!");
      setUserNation(data.nation);
      
      // Update the nations list to reflect the new member count
      setNations(prevNations => 
        prevNations.map(nation => 
          nation._id === nationId 
            ? { ...nation, memberCount: nation.memberCount + 1 } 
            : nation
        )
      );
    } catch (error: any) {
      setJoinError(error.message);
    } finally {
      setJoiningNationId("");
    }
  };

  const handleLeaveNation = async () => {
    if (!isConnected || !userNation) {
      return;
    }

    try {
      setIsLeaving(true);
      setLeaveError("");
      
      const response = await fetch("/api/nations/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to leave nation");
      }
      
      setLeaveSuccess("Successfully left the nation!");
      
      // Update the nations list to reflect the new member count
      if (userNation) {
        setNations(prevNations => 
          prevNations.map(nation => 
            nation._id === userNation._id 
              ? { ...nation, memberCount: Math.max(0, nation.memberCount - 1) } 
              : nation
          )
        );
      }
      
      // Clear the user's nation
      setUserNation(null);
    } catch (error: any) {
      setLeaveError(error.message);
    } finally {
      setIsLeaving(false);
    }
  };

  const handleDeleteNation = async () => {
    if (!isConnected || !userNation) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");
      
      const response = await fetch("/api/nations/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nationId: userNation._id,
          address,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete nation");
      }
      
      setDeleteSuccess("Nation deleted successfully!");
      
      // Remove the nation from the list
      setNations(prevNations => 
        prevNations.filter(nation => nation._id !== userNation._id)
      );
      
      // Clear the user's nation
      setUserNation(null);
    } catch (error: any) {
      setDeleteError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle claiming territory
  const handleClaimTerritory = async (stateName: string) => {
    if (!isConnected || !userNation || !address) {
      return;
    }

    // Check if user is founder
    if (userNation.founderAddress.toLowerCase() !== address.toLowerCase()) {
      setClaimError("Only nation founders can claim territory");
      return;
    }

    // Check if nation meets member requirements
    const requiredMembers = stateRequirements[stateName as keyof typeof stateRequirements] || 1;
    if (userNation.memberCount < requiredMembers) {
      setClaimError(`Your nation needs at least ${requiredMembers} members to claim ${stateName}`);
      return;
    }

    // Check if territory is already claimed
    if (claimedTerritories[stateName]) {
      setClaimError(`${stateName} is already claimed by ${claimedTerritories[stateName].name}`);
      return;
    }

    // Check if nation already has a territory
    if (userNation.territory) {
      setClaimError("Your nation has already claimed a territory");
      return;
    }

    try {
      setIsClaimingTerritory(true);
      setClaimError("");

      // Make API call to claim the territory
      const response = await fetch("/api/nations/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nationId: userNation._id,
          address,
          territory: stateName,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to claim territory");
      }
      
      // Update the user's nation with the claimed territory
      setUserNation(data.nation);
      
      // Update nations list to reflect the territory claim
      setNations(prevNations => 
        prevNations.map(nation => 
          nation._id === userNation._id 
            ? { ...nation, territory: stateName } 
            : nation
        )
      );
      
      // Update claimed territories
      setClaimedTerritories(prev => ({
        ...prev,
        [stateName]: data.nation
      }));
      
      setClaimSuccess(`Successfully claimed ${stateName} for ${userNation.name}!`);
      
      // Close modal immediately
      setShowClaimModal(false);
      setSelectedState("");
      
      // Refresh the nations data to ensure everything is up-to-date
      const fetchNations = async () => {
        try {
          const response = await fetch("/api/nations");
          const data = await response.json();
          
          if (data.success) {
            // Sort nations by creation date (newest first)
            const sortedNations = [...data.nations].sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setNations(sortedNations);
            
            // Build claimed territories map
            const territoriesMap: {[key: string]: Nation} = {};
            sortedNations.forEach(nation => {
              if (nation.territory) {
                territoriesMap[nation.territory] = nation;
              }
            });
            setClaimedTerritories(territoriesMap);
            
            // Update user nation
            if (userNation) {
              const updatedUserNation = sortedNations.find(n => n._id === userNation._id);
              if (updatedUserNation) {
                setUserNation(updatedUserNation);
              }
            }
          }
        } catch (error) {
          console.error("Error refreshing nations:", error);
        }
      };
      
      fetchNations();
      
    } catch (error: any) {
      setClaimError(error.message || "Failed to claim territory");
    } finally {
      setIsClaimingTerritory(false);
    }
  };

  // Get color based on member requirements
  const getStateColor = (stateName: string) => {
    const requirement = stateRequirements[stateName as keyof typeof stateRequirements] || 1;
    
    if (requirement >= 10) return "#1e40af"; // dark blue
    if (requirement >= 5) return "#3b82f6"; // medium blue
    if (requirement >= 3) return "#60a5fa"; // light blue
    return "#93c5fd"; // very light blue
  };

  // Loading state is now handled within each component that needs data

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#120e14] p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-mono text-[#4ade80] mb-6">explore nations</h1>
        
        {error && (
          <div className="bg-[#1a1520] border border-red-500 text-red-400 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        {joinError && (
          <div className="bg-[#1a1520] border border-red-500 text-red-400 px-4 py-2 rounded mb-4 text-sm">
            {joinError}
          </div>
        )}
        
        {joinSuccess && (
          <div className="bg-[#1a1520] border border-[#4ade80] text-[#4ade80] px-4 py-2 rounded mb-4 text-sm">
            {joinSuccess}
          </div>
        )}
        
        {/* Interactive Map */}
        <div className="bg-[#120e14] rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-mono text-[#4ade80]">sovra nations territory map</h2>
            
            {/* Map Reset Timer */}
            <div className="bg-[#120e14] border border-[#4ade80] rounded p-3">
              <p className="text-[#4ade80] text-xs font-medium">Map Reset Countdown</p>
              <p className="text-gray-300 text-xs">
                The map will reset on April 7, 2025
              </p>
              <div className="mt-1 text-center">
                <span className="bg-[#1a1520] text-[#4ade80] text-xs px-2 py-1 rounded font-mono">
                  {Math.floor((new Date('2025-04-07').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Territory List - Left Side */}
            <div className="md:w-1/4 bg-[#120e14] border border-gray-700 rounded-lg p-4">
              <h3 className="text-md font-mono text-[#4ade80] mb-3">Claimed Territories</h3>
              
              {Object.keys(claimedTerritories).length === 0 ? (
                <div className="text-center p-4 bg-[#120e14] border border-gray-700 rounded-lg">
                  <p className="text-gray-400 text-sm">No territories have been claimed yet.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {Object.entries(claimedTerritories).map(([territory, nation]) => (
                    <div key={territory} className="relative p-2 bg-[#120e14] border border-gray-700 rounded-lg">
                      <div className="absolute top-2 right-2">
                        <span className="bg-[#1a1520] text-[#4ade80] text-xs px-1.5 py-0.5 rounded-full">
                          {nation.memberCount} {nation.memberCount === 1 ? 'member' : 'members'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[#1a1520] rounded-full flex items-center justify-center text-[#4ade80] font-bold mr-2">
                          {nation.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-sm font-semibold text-[#4ade80]">{territory}</h4>
                          <p className="text-xs text-gray-400">
                            Claimed by {nation.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {userNation && userNation.founderAddress.toLowerCase() === address?.toLowerCase() && !userNation.territory && (
                <div className="mt-4 bg-[#120e14] border border-[#4ade80] rounded p-3">
                  <p className="text-[#4ade80] text-xs">
                    Click on a state to claim it for your nation.
                  </p>
                </div>
              )}
            </div>
            
            {/* Map - Right Side */}
            <div className="md:w-3/4 relative" style={{ height: '500px', overflow: 'hidden' }}>
              <ComposableMap projection="geoAlbersUsa" style={{ width: "100%", height: "100%" }}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map(geo => {
                      const stateName = geo.properties.name;
                      const requirement = stateRequirements[stateName as keyof typeof stateRequirements] || 1;
                      const isHovered = hoveredState === stateName;
                      const isClaimed = !!claimedTerritories[stateName];
                      const claimingNation = claimedTerritories[stateName];
                      
                      // Check if this is the user's nation's territory
                      const isUserTerritory = userNation && userNation.territory === stateName;
                      
                      // Determine fill color based on claim status and if it's user's territory
                      let fillColor = "#2d2f39"; // Dark grey for unclaimed
                      if (isClaimed) {
                        if (isUserTerritory) {
                          fillColor = "#166534"; // Darker green for user's territory
                        } else {
                          fillColor = "#991b1b"; // Darker red for other claimed territories
                        }
                      }
                      
                      return (
                        <React.Fragment key={geo.rsmKey}>
                          <Geography
                            geography={geo}
                            onMouseEnter={() => {
                              setHoveredState(stateName);
                            }}
                            onMouseLeave={() => {
                              setHoveredState("");
                            }}
                            onClick={() => {
                              // Only allow founders to claim territory
                              if (userNation && userNation.founderAddress.toLowerCase() === address?.toLowerCase() && !isClaimed) {
                                setSelectedState(stateName);
                                setShowClaimModal(true);
                              }
                            }}
                            style={{
                              default: {
                                fill: fillColor,
                                stroke: "#1a1520",
                                strokeWidth: 0.5,
                                outline: "none",
                              },
                              hover: {
                                fill: isUserTerritory ? "#15803d" : isClaimed ? "#b91c1c" : "#4b5563",
                                stroke: "#1a1520",
                                strokeWidth: 1,
                                outline: "none",
                                cursor: userNation && userNation.founderAddress.toLowerCase() === address?.toLowerCase() && !isClaimed ? "pointer" : "default"
                              },
                              pressed: {
                                fill: isUserTerritory ? "#166534" : isClaimed ? "#991b1b" : "#374151",
                                stroke: "#1a1520",
                                strokeWidth: 1,
                                outline: "none",
                              }
                            }}
                          />
                          
                          {/* Add nation name label for claimed territories */}
                          {isClaimed && geo.properties && geo.properties.centroid && (
                            <text
                              textAnchor="middle"
                              style={{
                                fontFamily: "Arial",
                                fontSize: "8px",
                                fontWeight: "bold",
                                fill: "#000000",
                                textShadow: "0px 0px 2px #FFFFFF, 0px 0px 2px #FFFFFF, 0px 0px 2px #FFFFFF, 0px 0px 2px #FFFFFF"
                              }}
                              x={geo.properties.centroid[0]}
                              y={geo.properties.centroid[1]}
                            >
                              {claimingNation.name}
                            </text>
                          )}
                        </React.Fragment>
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
              
              {/* State info tooltip */}
              {hoveredState && (
                <div className="absolute top-2 left-2 bg-[#1a1520] p-2 rounded shadow-md border border-gray-700 z-10">
                  <p className="font-bold text-[#4ade80]">{hoveredState}</p>
                  <p className="text-sm text-gray-300">
                    {stateRequirements[hoveredState as keyof typeof stateRequirements] || 1}+ members required
                  </p>
                </div>
              )}
              
              {/* Map status banner */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                {/* Founder status indicator */}
                <div className="bg-[#120e14] bg-opacity-90 px-4 py-2 rounded-lg shadow-sm border border-gray-700">
                  {!isConnected ? (
                    <p className="text-gray-300 text-sm">
                      <span className="font-semibold text-red-400">⚠️ Connect wallet</span> to interact with the map
                    </p>
                  ) : !userNation ? (
                    <p className="text-gray-300 text-sm">
                      <span className="font-semibold text-yellow-400">⚠️ Create a nation</span> to claim territory
                    </p>
                  ) : userNation.territory ? (
                    <p className="text-gray-300 text-sm">
                      <span className="font-semibold text-[#4ade80]">✓ Your nation</span> has claimed {userNation.territory}
                    </p>
                  ) : userNation.founderAddress.toLowerCase() !== address?.toLowerCase() ? (
                    <p className="text-gray-300 text-sm">
                      {!userNation.territory ? (
                        <><span className="font-semibold text-yellow-400">ℹ️ Note:</span> Only the founder of {userNation.name} can claim territory</>
                      ) : (
                        <><span className="font-semibold text-[#4ade80]">ℹ️ Your nation</span> is a member of {userNation.name}</>
                      )}
                    </p>
                  ) : userNation.territory ? (
                    <p className="text-gray-300 text-sm">
                      <span className="font-semibold text-[#4ade80]">✓ You've claimed</span> {userNation.territory}
                    </p>
                  ) : (
                    <p className="text-gray-300 text-sm">
                      <span className="font-semibold text-[#4ade80]">✓ As a founder</span> you can claim territory
                    </p>
                  )}
                </div>
                
                {/* Action button */}
                <div>
                  {!isConnected ? (
                    <button className="bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm font-medium opacity-50 cursor-not-allowed">
                      Connect Wallet First
                    </button>
                  ) : !userNation ? (
                    <Link href="/create" className="inline-block bg-[#1a1520] hover:bg-[#2d2f39] text-[#4ade80] border border-[#4ade80] px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Create a Nation
                    </Link>
                  ) : userNation.founderAddress.toLowerCase() !== address?.toLowerCase() ? (
                    <Link href="/create" className="inline-block bg-[#1a1520] hover:bg-[#2d2f39] text-[#4ade80] border border-[#4ade80] px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Create Your Own Nation
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          
          {/* Claim Territory Modal */}
          {showClaimModal && selectedState && (
            <div 
              className="fixed inset-0 flex items-center justify-center z-50"
              onClick={() => {
                setShowClaimModal(false);
                setSelectedState("");
                setClaimError("");
                setClaimSuccess("");
              }}
            >
              <div 
                className="bg-[#120e14] rounded-lg shadow-lg p-6 max-w-md w-full border border-gray-700"
                onClick={(e) => e.stopPropagation()} // Prevent clicks on the modal from closing it
              >
                <h3 className="text-xl font-mono text-[#4ade80] mb-4">Claim {selectedState}</h3>
                
                {claimError && (
                  <div className="bg-[#120e14] border border-red-500 text-red-400 px-4 py-2 rounded mb-4 text-sm">
                    {claimError}
                  </div>
                )}
                
                {claimSuccess && (
                  <div className="bg-[#120e14] border border-[#4ade80] text-[#4ade80] px-4 py-2 rounded mb-4 text-sm">
                    {claimSuccess}
                  </div>
                )}
                
                <p className="text-gray-300 mb-4">
                  Are you sure you want to claim {selectedState} for your nation?
                </p>
                
                <div className="bg-[#120e14] border border-[#4ade80] rounded p-3 mb-4">
                  <p className="text-[#4ade80] text-sm font-medium mb-1">Requirements:</p>
                  <ul className="text-gray-300 text-sm list-disc pl-5">
                    <li>Your nation must have at least {stateRequirements[selectedState as keyof typeof stateRequirements] || 1} members</li>
                    <li>You can only claim one territory per nation</li>
                    <li>Once claimed, this territory will belong exclusively to your nation</li>
                  </ul>
                </div>
                
                {userNation && userNation.memberCount < (stateRequirements[selectedState as keyof typeof stateRequirements] || 1) && (
                  <div className="bg-[#120e14] border border-yellow-500 text-yellow-400 px-4 py-2 rounded mb-4 text-sm">
                    Your nation doesn't have enough members to claim this territory. You need {stateRequirements[selectedState as keyof typeof stateRequirements] || 1} members, but you only have {userNation.memberCount}.
                  </div>
                )}
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowClaimModal(false);
                      setSelectedState("");
                      setClaimError("");
                      setClaimSuccess("");
                    }}
                    className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-[#2d2f39] text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={() => handleClaimTerritory(selectedState)}
                    disabled={isClaimingTerritory || !userNation || userNation.memberCount < (stateRequirements[selectedState as keyof typeof stateRequirements] || 1)}
                    className="px-4 py-2 bg-[#1a1520] hover:bg-[#2d2f39] text-[#4ade80] border border-[#4ade80] rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isClaimingTerritory ? "Claiming..." : "Claim Territory"}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4 bg-[#120e14] rounded-lg p-4">
            <Dropdown title="how territory claiming works">
              <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
                <li><strong className="text-white">Only nation founders</strong> can claim territory on the map</li>
                <li>Each founder can claim <strong className="text-white">only one territory</strong></li>
                <li>Your nation must meet the <strong className="text-white">member requirements</strong> to claim a territory</li>
                <li>Each state has different member requirements based on its size and importance</li>
                <li>Larger states like California (15+ members) and Texas (12+ members) require more members</li>
                <li>Once claimed, a state belongs exclusively to your nation</li>
                <li>Hover over a state to see its specific member requirements</li>
              </ul>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}
