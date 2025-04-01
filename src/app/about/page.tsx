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
        className="w-full text-left flex items-center text-xl font-mono text-[#4ade80] hover:text-[#6ee7a0] focus:outline-none"
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

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#120e14] p-4">
      <div className="max-w-4xl ml-4 md:ml-8">
        <div className="mb-10">
          <h1 className="text-3xl font-mono text-[#4ade80] mb-2">about kol nations</h1>
          <p className="text-lg text-gray-300 mb-6">what happens when the trenches come together to colonize nations?</p>
        </div>
        
        <Dropdown title="what is kol nations?">
          <p className="text-gray-300 mb-4">
            kol nations is a platform that allows users to create, join, and manage virtual nations on a digital map of the united states. 
            each nation can claim territory, earn rewards, and build a community of members.
          </p>
          <p className="text-gray-300 mb-4">
            with hundreds of nations evolving simultaneously, each shaped by unique member contributions, we invite you to witness and influence the journey of nation-building.
          </p>
        </Dropdown>
        
        <Dropdown title="get involved: shape the digital world">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-[#4ade80] mb-2">connect your wallet</h3>
            <p className="text-gray-300 mb-2">
              to use kol nations, connect your phantom wallet using the button in the top right corner of the navigation bar.
            </p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium text-[#4ade80] mb-2">create or join a nation</h3>
            <p className="text-gray-300 mb-2">
              once connected, you can either create your own nation or join an existing one:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li className="mb-2">
                <strong className="text-white">create a nation:</strong> go to the "create" page and enter a name for your nation. you'll become the founder of this nation.
              </li>
              <li className="mb-2">
                <strong className="text-white">join a nation:</strong> browse existing nations on the "create" page and click "join nation" to become a member.
              </li>
            </ul>
            <p className="text-gray-300">
              you can only be a member of one nation at a time. if you're a founder, you cannot join another nation, and if you're a member, you cannot create your own nation without leaving your current one.
            </p>
          </div>
        </Dropdown>
        
        <Dropdown title="territory system: claiming and managing states">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-[#4ade80] mb-2">territory system</h3>
            <p className="text-gray-300 mb-2">
              each nation can claim one u.s. state as its territory. only the founder of a nation can claim territory.
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li className="mb-2">
                <strong className="text-white">member requirements:</strong> each state has a minimum member requirement to claim it. larger states like california (15+ members) and texas (12+ members) require more members than smaller states.
              </li>
              <li className="mb-2">
                <strong className="text-white">claiming process:</strong> go to the "explore" page, and if you're a founder with enough members, you can click on an unclaimed state to claim it.
              </li>
              <li className="mb-2">
                <strong className="text-white">exclusive claims:</strong> once a state is claimed, it belongs exclusively to that nation until the map resets.
              </li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium text-[#4ade80] mb-2">map resets</h3>
            <p className="text-gray-300">
              the territory map resets periodically, allowing nations to claim new territories. this keeps the platform dynamic and gives new nations a chance to claim valuable territories. the current map will reset on april 7, 2025.
            </p>
          </div>
        </Dropdown>
        
        <Dropdown title="rewards and leaderboard: earning and competing">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-[#4ade80] mb-2">rewards system</h3>
            <p className="text-gray-300 mb-2">
              nations earn rewards based on their territory and member count. the rewards are calculated hourly and distributed to the nation's members.
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li className="mb-2">
                <strong className="text-white">base rate:</strong> each state has a fixed hourly rate (from $0.15 to $0.50).
              </li>
              <li className="mb-2">
                <strong className="text-white">member bonus:</strong> additional rewards based on your nation's member count.
              </li>
              <li className="mb-2">
                <strong className="text-white">formula:</strong> base rate + (member count × member multiplier)
              </li>
            </ul>
            <p className="text-gray-300 mb-2">
              for detailed information about reward rates for each state, visit the "rewards" page.
            </p>
            <p className="text-gray-300">
              at the end of each map reset, rewards are distributed to nation founders/creators. automatic checks for holders of our token will be conducted to ensure eligibility for claiming rewards.
            </p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium text-[#4ade80] mb-2">leaderboard</h3>
            <p className="text-gray-300">
              the "nations" page displays a leaderboard of all nations that have claimed territories. nations are ranked by member count and earnings. this leaderboard showcases the most successful nations and provides a competitive element to the platform.
            </p>
          </div>
        </Dropdown>
        
        
        <Dropdown title="inspired by">
          <p className="text-gray-300">
            kol nations draws inspiration from various sources including digital governance models, online communities, and social experiments. we're creating a space where digital nations can evolve and thrive based on member participation and strategic decisions.
          </p>
        </Dropdown>
        
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-mono text-[#4ade80] mb-4">join the experiment: the future of nation-building</h2>
          <p className="text-gray-300 mb-6">
            kol nations is more than a project—it is a new way of understanding leadership, community, and governance in the digital age. with hundreds of nations evolving simultaneously, each shaped by unique model weights, we invite you to witness and influence the unpredictable journey of nation-building.
          </p>
          <p className="text-gray-300 mb-8">
            the question isn't just about how these digital nations will evolve—it's about what we can learn from them. get involved, make your mark, and help us shape the next frontier of society.
          </p>
          
        </div>
      </div>
    </div>
  );
}
