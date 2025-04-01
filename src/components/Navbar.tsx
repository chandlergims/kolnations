'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { address, isConnected, isLoading, connectWallet, disconnectWallet, error } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isWalletOpen) setIsWalletOpen(false);
  };

  return (
    <nav className="bg-[#120e14]">
      <div className="w-full px-0 sm:px-2">
        <div className="flex justify-between h-16 px-4">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo.png" 
                  alt="Sovra Nations Logo" 
                  width={32} 
                  height={32} 
                  className="h-8 w-auto" 
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link href="/" className="text-[#4ade80] hover:text-[#6ee7a0] inline-flex items-center px-1 pt-1 text-sm font-medium">
                home
              </Link>
              <Link href="/about" className="text-[#4ade80] hover:text-[#6ee7a0] inline-flex items-center px-1 pt-1 text-sm font-medium">
                about
              </Link>
              <Link href="/explore" className="text-[#4ade80] hover:text-[#6ee7a0] inline-flex items-center px-1 pt-1 text-sm font-medium">
                explore
              </Link>
              <Link href="/create" className="text-[#4ade80] hover:text-[#6ee7a0] inline-flex items-center px-1 pt-1 text-sm font-medium">
                create
              </Link>
              <Link href="/nations" className="text-[#4ade80] hover:text-[#6ee7a0] inline-flex items-center px-1 pt-1 text-sm font-medium">
                nations
              </Link>
              <Link href="/rewards" className="text-[#4ade80] hover:text-[#6ee7a0] inline-flex items-center px-1 pt-1 text-sm font-medium">
                rewards
              </Link>
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center space-x-4">
            <a 
              href="https://x.com/sovranations" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#4ade80] hover:text-[#6ee7a0]"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className="text-[#4ade80]"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {isConnected ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 text-[#4ade80] hover:text-[#6ee7a0] text-sm font-medium"
                  onClick={() => setIsWalletOpen(!isWalletOpen)}
                >
                  <span>{address?.slice(0, 6).toLowerCase()}...{address?.slice(-4).toLowerCase()}</span>
                  <svg 
                    className="h-4 w-4" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    {isWalletOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    )}
                  </svg>
                </button>
                {isWalletOpen && (
                  <div className="absolute right-0 mt-1 w-32 bg-[#120e14] z-10">
                    <button
                      onClick={disconnectWallet}
                      className="block w-full text-left px-4 py-2 text-sm text-[#4ade80] hover:text-[#6ee7a0] font-medium"
                    >
                      logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="text-[#4ade80] hover:text-[#6ee7a0] text-sm font-medium"
              >
                {isLoading ? 'connecting...' : 'connect'}
              </button>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-[#120e14] border-t border-gray-700">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className="bg-[#120e14] text-[#4ade80] hover:text-[#6ee7a0] block px-3 py-2 rounded-md text-base font-medium">
              home
            </Link>
            <Link href="/about" className="bg-[#120e14] text-[#4ade80] hover:text-[#6ee7a0] block px-3 py-2 rounded-md text-base font-medium">
              about
            </Link>
            <Link href="/explore" className="bg-[#120e14] text-[#4ade80] hover:text-[#6ee7a0] block px-3 py-2 rounded-md text-base font-medium">
              explore
            </Link>
            <Link href="/create" className="bg-[#120e14] text-[#4ade80] hover:text-[#6ee7a0] block px-3 py-2 rounded-md text-base font-medium">
              create
            </Link>
            <Link href="/nations" className="bg-[#120e14] text-[#4ade80] hover:text-[#6ee7a0] block px-3 py-2 rounded-md text-base font-medium">
              nations
            </Link>
            <Link href="/rewards" className="bg-[#120e14] text-[#4ade80] hover:text-[#6ee7a0] block px-3 py-2 rounded-md text-base font-medium">
              rewards
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center justify-center px-4">
              {isConnected ? (
                <div className="flex flex-col space-y-2 w-full">
                  <span className="text-sm text-gray-300 text-center">
                    {address?.slice(0, 6).toLowerCase()}...{address?.slice(-4).toLowerCase()}
                  </span>
                  <button
                    onClick={disconnectWallet}
                    className="bg-[#120e14] hover:bg-[#1a1520] text-[#4ade80] hover:text-[#6ee7a0] px-4 py-2 text-sm font-light transition-colors w-full"
                  >
                    logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="w-full bg-[#120e14] hover:bg-[#1a1520] text-[#4ade80] hover:text-[#6ee7a0] px-4 py-2 text-sm font-light transition-colors"
                >
                  {isLoading ? 'connecting...' : 'connect'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-[#1a1520] bg-opacity-70 text-[#4ade80] px-2 py-1 text-sm text-center mx-auto max-w-xs rounded" role="alert">
          {error}
        </div>
      )}
    </nav>
  );
}
