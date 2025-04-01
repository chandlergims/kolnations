'use client';

import React, { useState } from "react";
import Link from "next/link";

// Dropdown component for expandable sections
const Dropdown = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-center text-xl font-mono text-blue-500 hover:text-blue-400 focus:outline-none"
      >
        <span className="mr-2">{isOpen ? '>' : '>'}</span>
        {title}
      </button>
      {isOpen && (
        <div className="mt-4 pl-6 border-l border-blue-500">
          {children}
        </div>
      )}
    </div>
  );
};

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl font-mono text-blue-600 mb-2">about terminal of nations</h1>
          <p className="text-lg text-gray-600 mb-6">can ai build future societies?</p>
        </div>
        
        <Dropdown title="what is terminal of nations?">
          <p className="text-gray-600 mb-4">
            Terminal of Nations is a platform that allows users to create, join, and manage virtual nations on a digital map of the United States. 
            Each nation can claim territory, earn rewards, and build a community of members.
          </p>
          <p className="text-gray-600 mb-4">
            With hundreds of nations evolving simultaneously, each shaped by unique member contributions, we invite you to witness and influence the journey of nation-building.
          </p>
        </Dropdown>
        
        <Dropdown title="get involved: shape the digital world">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600 mb-2">
              To use Terminal of Nations, connect your Phantom wallet using the button in the top right corner of the navigation bar.
            </p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Create or Join a Nation</h3>
            <p className="text-gray-600 mb-2">
              Once connected, you can either create your own nation or join an existing one:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li className="mb-2">
                <strong>Create a Nation:</strong> Go to the "Create" page and enter a name for your nation. You'll become the founder of this nation.
              </li>
              <li className="mb-2">
                <strong>Join a Nation:</strong> Browse existing nations on the "Create" page and click "Join Nation" to become a member.
              </li>
            </ul>
            <p className="text-gray-600">
              You can only be a member of one nation at a time. If you're a founder, you cannot join another nation, and if you're a member, you cannot create your own nation without leaving your current one.
            </p>
          </div>
        </Dropdown>
        
        <Dropdown title="technical foundations: where technology and creativity meet">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Territory System</h3>
            <p className="text-gray-600 mb-2">
              Each nation can claim one U.S. state as its territory. Only the founder of a nation can claim territory.
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li className="mb-2">
                <strong>Member Requirements:</strong> Each state has a minimum member requirement to claim it. Larger states like California (15+ members) and Texas (12+ members) require more members than smaller states.
              </li>
              <li className="mb-2">
                <strong>Claiming Process:</strong> Go to the "Explore" page, and if you're a founder with enough members, you can click on an unclaimed state to claim it.
              </li>
              <li className="mb-2">
                <strong>Exclusive Claims:</strong> Once a state is claimed, it belongs exclusively to that nation until the map resets.
              </li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Map Resets</h3>
            <p className="text-gray-600">
              The territory map resets periodically, allowing nations to claim new territories. This keeps the platform dynamic and gives new nations a chance to claim valuable territories. The current map will reset on April 7, 2025.
            </p>
          </div>
        </Dropdown>
        
        <Dropdown title="a living map: tracking the evolution">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Rewards System</h3>
            <p className="text-gray-600 mb-2">
              Nations earn rewards based on their territory and member count. The rewards are calculated hourly and distributed to the nation's members.
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li className="mb-2">
                <strong>Base Rate:</strong> Each state has a fixed hourly rate (from $0.15 to $0.50).
              </li>
              <li className="mb-2">
                <strong>Member Bonus:</strong> Additional rewards based on your nation's member count.
              </li>
              <li className="mb-2">
                <strong>Formula:</strong> Base Rate + (Member Count × Member Multiplier)
              </li>
            </ul>
            <p className="text-gray-600">
              For detailed information about reward rates for each state, visit the "Rewards" page.
            </p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Leaderboard</h3>
            <p className="text-gray-600">
              The "Nations" page displays a leaderboard of all nations that have claimed territories. Nations are ranked by member count and earnings. This leaderboard showcases the most successful nations and provides a competitive element to the platform.
            </p>
          </div>
        </Dropdown>
        
        <Dropdown title="our ai model: simulating complexity at scale">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Managing Your Nation</h3>
            <p className="text-gray-600 mb-2">
              As a founder, you can claim territory for your nation and delete your nation if needed. As a member, you can leave your current nation and create your own after leaving.
            </p>
          </div>
        </Dropdown>
        
        <Dropdown title="inspired by">
          <p className="text-gray-600">
            Terminal of Nations draws inspiration from various sources including digital governance models, online communities, and social experiments. We're creating a space where digital nations can evolve and thrive based on member participation and strategic decisions.
          </p>
        </Dropdown>
        
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-mono text-blue-600 mb-4">join the experiment: the future of nation-building</h2>
          <p className="text-gray-600 mb-6">
            Terminal of Nations is more than a project—it is a new way of understanding leadership, community, and governance in the digital age. With hundreds of nations evolving simultaneously, each shaped by unique model weights, we invite you to witness and influence the unpredictable journey of nation-building.
          </p>
          <p className="text-gray-600 mb-8">
            The question isn't just about how these digital nations will evolve—it's about what we can learn from them. Get involved, make your mark, and help us shape the next frontier of society.
          </p>
          
          <div className="flex justify-center space-x-6">
            <Link href="/explore" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium transition-colors">
              Explore the Map
            </Link>
            <Link href="/create" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium transition-colors">
              Create a Nation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
