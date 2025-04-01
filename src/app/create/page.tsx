'use client';

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

interface Nation {
  _id: string;
  name: string;
  founderAddress: string;
  memberCount: number;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export default function CreatePage() {
  const { isConnected, address } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState("");
  const [joiningNationId, setJoiningNationId] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [leaveError, setLeaveError] = useState("");
  const [leaveSuccess, setLeaveSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  
  const [nations, setNations] = useState<Nation[]>([]);
  const [filteredNations, setFilteredNations] = useState<Nation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userNation, setUserNation] = useState<Nation | null>(null);
  const [isCheckingNation, setIsCheckingNation] = useState(true);
  const [isLoadingNations, setIsLoadingNations] = useState(true);
  const [displayCount, setDisplayCount] = useState(12);

  // Fetch all nations
  useEffect(() => {
    const fetchNations = async () => {
      try {
        setIsLoadingNations(true);
        const response = await fetch("/api/nations");
        const data = await response.json();

        if (data.success) {
          // Sort nations by creation date (newest first)
          const sortedNations = [...data.nations].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setNations(sortedNations);
          setFilteredNations(sortedNations);
        }
      } catch (error) {
        console.error("Error fetching nations:", error);
      } finally {
        setIsLoadingNations(false);
      }
    };

    fetchNations();
  }, []);

  // Search nations using the API
  useEffect(() => {
    const searchNations = async () => {
      try {
        setIsLoadingNations(true);
        
        // If search term is empty, reset to show all nations
        if (searchTerm.trim() === "") {
          setFilteredNations(nations);
          setIsLoadingNations(false);
          return;
        }
        
        // Otherwise, use the search API
        const response = await fetch(`/api/nations/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (data.success) {
          setFilteredNations(data.nations);
        }
      } catch (error) {
        console.error("Error searching nations:", error);
      } finally {
        setIsLoadingNations(false);
      }
    };
    
    // Debounce search to avoid too many requests
    const timeoutId = setTimeout(() => {
      searchNations();
    }, 300);
    
    return () => clearTimeout(timeoutId);
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
      
      // Refresh the page using Next.js router
      router.refresh();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }
    
    if (!name.trim()) {
      setError("Please enter a nation name");
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");
      
      const response = await fetch("/api/nations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          address,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create nation");
      }
      
      setSuccess("Nation created successfully!");
      setUserNation(data.nation);
      setName("");
      
      // Add the new nation to the list
      setNations(prevNations => [data.nation, ...prevNations]);
      
      // Refresh the page using Next.js router
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#120e14] p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-mono text-[#4ade80] mb-6">create nation</h1>
        
        {isCheckingNation ? (
          <div className="mb-8">
            <h2 className="text-2xl font-mono text-center text-[#4ade80] mb-6">your nation</h2>
            <div className="max-w-md mx-auto bg-[#120e14] border border-gray-700 rounded-lg shadow-md p-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ade80]"></div>
            </div>
          </div>
        ) : userNation ? (
          <div className="mb-8">
            <h2 className="text-2xl font-mono text-center text-[#4ade80] mb-6">your nation</h2>
            <div className="max-w-md mx-auto bg-[#120e14] border border-gray-700 rounded-lg shadow-md p-4">
              <h3 className="text-xl font-mono text-[#4ade80] mb-4">{userNation.name}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">Founded by</p>
                  <p className="text-gray-300">{userNation.founderAddress.slice(0, 6)}...{userNation.founderAddress.slice(-4)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">Members</p>
                  <p className="text-gray-300">{userNation.memberCount}</p>
                </div>
              </div>
              <div className="bg-[#120e14] border border-[#4ade80] text-[#4ade80] px-4 py-2 rounded text-sm text-center mb-4">
                {userNation.founderAddress.toLowerCase() === address?.toLowerCase() 
                  ? "You are the creator of this nation" 
                  : "You are a member of this nation"}
              </div>

              {leaveError && (
                <div className="bg-[#120e14] border border-red-500 text-red-400 px-4 py-2 rounded mb-4 text-sm">
                  {leaveError}
                </div>
              )}
              
              {deleteError && (
                <div className="bg-[#120e14] border border-red-500 text-red-400 px-4 py-2 rounded mb-4 text-sm">
                  {deleteError}
                </div>
              )}
              
              {leaveSuccess && (
                <div className="bg-[#120e14] border border-[#4ade80] text-[#4ade80] px-4 py-2 rounded mb-4 text-sm">
                  {leaveSuccess}
                </div>
              )}
              
              {deleteSuccess && (
                <div className="bg-[#120e14] border border-[#4ade80] text-[#4ade80] px-4 py-2 rounded mb-4 text-sm">
                  {deleteSuccess}
                </div>
              )}
              
              <div className="flex gap-2">
                {userNation && userNation.founderAddress.toLowerCase() === address?.toLowerCase() ? (
                  <button
                    onClick={handleDeleteNation}
                    disabled={isDeleting}
                    className="w-full bg-[#8B0000] hover:bg-[#A50000] text-white px-3 py-2 rounded text-sm font-mono transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? "deleting..." : "delete nation"}
                  </button>
                ) : (
                  <button
                    onClick={handleLeaveNation}
                    disabled={isLeaving}
                    className="w-full bg-[#8B0000] hover:bg-[#A50000] text-white px-3 py-2 rounded text-sm font-mono transition-colors disabled:opacity-50"
                  >
                    {isLeaving ? "leaving..." : "leave nation"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : isConnected ? (
          <div className="max-w-2xl mx-auto mb-8">
            {error && (
              <div className="bg-[#120e14] border border-red-500 text-red-400 px-4 py-2 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-[#120e14] border border-[#4ade80] text-[#4ade80] px-4 py-2 rounded mb-4 text-sm">
                {success}
              </div>
            )}
            
            {joinError && (
              <div className="bg-[#120e14] border border-red-500 text-red-400 px-4 py-2 rounded mb-4 text-sm">
                {joinError}
              </div>
            )}
            
            {joinSuccess && (
              <div className="bg-[#120e14] border border-[#4ade80] text-[#4ade80] px-4 py-2 rounded mb-4 text-sm">
                {joinSuccess}
              </div>
            )}
            
            <div className="bg-[#120e14] border border-gray-700 rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-mono text-[#4ade80]">create your nation</h3>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="text-gray-400 hover:text-gray-300 focus:outline-none"
                >
                  {showForm ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              
              {showForm && (
                <div className="p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm text-[#4ade80] font-mono mb-1">
                        nation name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#120e14] border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-[#4ade80] text-gray-300"
                        placeholder="enter nation name (max 14 chars)"
                        maxLength={14}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#120e14] hover:bg-[#2d2f39] text-[#4ade80] border border-[#4ade80] px-4 py-2 rounded text-sm font-mono transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "creating..." : "create nation"}
                    </button>
                    
                    <div className="mt-4 text-center">
                      <p className="text-gray-400 text-sm">
                        note: you can only create one nation. once created, you cannot create or join another nation.
                      </p>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        ) : null}
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-mono text-[#4ade80]">all nations</h2>
            <div className="text-sm text-gray-400">
              Showing {Math.min(filteredNations.length, displayCount)} of {filteredNations.length} nations
            </div>
          </div>
          
          <div className="mb-6 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="search nations by name or founder address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#120e14] border border-gray-700 rounded-lg px-4 py-2 pl-10 pr-10 focus:outline-none focus:border-[#4ade80] text-gray-300 shadow-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {isLoadingNations ? (
          <div className="bg-[#120e14] border border-gray-700 rounded-lg p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ade80]"></div>
          </div>
        ) : filteredNations.length === 0 ? (
          <div className="bg-[#120e14] border border-gray-700 rounded-lg p-6 text-center">
            <p className="text-gray-400 mb-4">
              {nations.length === 0 
                ? "No nations have been created yet." 
                : "No nations match your search criteria."}
            </p>
          </div>
        ) : (
          <div className="max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredNations.slice(0, displayCount).map((nation) => (
                <div key={nation._id} className="flex flex-col bg-[#120e14] border border-gray-700 shadow-md hover:shadow-lg transition-all duration-200">
                  {/* Nation Header */}
                  <div className="p-3 border-b border-gray-700 relative">
                    <h3 className="text-lg font-mono text-[#4ade80] truncate text-center">{nation.name}</h3>
                    {/* Share Button */}
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join the #${nation.name.replace(/\s+/g, '')} nation on sovranations.app!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-1/2 right-1 transform -translate-y-1/2 flex items-center justify-center text-[#4ade80] hover:text-[#6ee7a0] transition-colors"
                      title="Share on Twitter"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 1024 1024" 
                        fill="currentColor"
                      >
                        <path d="M752 664c-28.5 0-54.8 10-75.4 26.7L469.4 540.8a160.68 160.68 0 0 0 0-57.6l207.2-149.9C697.2 350 723.5 360 752 360c66.2 0 120-53.8 120-120s-53.8-120-120-120-120 53.8-120 120c0 11.6 1.6 22.7 4.7 33.3L439.9 415.8C410.7 377.1 364.3 352 312 352c-88.4 0-160 71.6-160 160s71.6 160 160 160c52.3 0 98.7-25.1 127.9-63.8l196.8 142.5c-3.1 10.6-4.7 21.8-4.7 33.3 0 66.2 53.8 120 120 120s120-53.8 120-120-53.8-120-120-120zm0-476c28.7 0 52 23.3 52 52s-23.3 52-52 52-52-23.3-52-52 23.3-52 52-52zM312 600c-48.5 0-88-39.5-88-88s39.5-88 88-88 88 39.5 88 88-39.5 88-88 88zm440 236c-28.7 0-52-23.3-52-52s23.3-52 52-52 52 23.3 52 52-23.3 52-52 52z" />
                      </svg>
                    </a>
                  </div>
                  
                  {/* Nation Info */}
                  <div className="p-3 flex-grow">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Founded by</p>
                        <p className="text-sm font-medium text-gray-300">{nation.founderAddress.slice(0, 6)}...{nation.founderAddress.slice(-4)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Members</p>
                        <p className="text-sm font-medium text-gray-300">{nation.memberCount}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Join Button or Status */}
                  <div className="px-3 pb-3 mt-auto">
                    {!userNation && isConnected ? (
                      <button 
                        onClick={() => handleJoinNation(nation._id)}
                        disabled={joiningNationId === nation._id}
                        className="w-full bg-[#120e14] hover:bg-[#2d2f39] text-[#4ade80] border border-[#4ade80] px-3 py-2 text-sm font-mono transition-colors disabled:opacity-50"
                      >
                        {joiningNationId === nation._id ? "joining..." : "join nation"}
                      </button>
                    ) : userNation ? (
                      <div className="w-full px-3 py-2 text-center text-sm text-gray-500">
                        {userNation._id === nation._id ? "Your Nation" : "Already in a Nation"}
                      </div>
                    ) : (
                      <div className="w-full px-3 py-2 text-center text-sm text-gray-500">
                        Connect wallet to join
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            {filteredNations.length > displayCount && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setDisplayCount(prev => prev + 12)}
                  className="bg-[#120e14] hover:bg-[#2d2f39] text-[#4ade80] border border-[#4ade80] px-6 py-2 text-sm font-mono transition-colors"
                >
                  load more
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
