'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PublicKey, Connection } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import Cookies from 'js-cookie';

// Add Phantom wallet type to the window object
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom?: boolean;
        connect: () => Promise<{ publicKey: PublicKey }>;
        disconnect: () => Promise<void>;
      };
    };
  }
}

interface AuthContextType {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAdapter, setWalletAdapter] = useState<PhantomWalletAdapter | null>(null);

  // Initialize wallet adapter
  useEffect(() => {
    const adapter = new PhantomWalletAdapter();
    setWalletAdapter(adapter);

    return () => {
      if (adapter) {
        adapter.disconnect();
      }
    };
  }, []);

  // Check if user was previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (!walletAdapter) return;

      try {
        // Check if we have a stored connection in cookies
        const storedAddress = Cookies.get('connectedAddress');
        
        if (storedAddress) {
          // Try to reconnect
          await walletAdapter.connect();
          
          if (walletAdapter.connected && walletAdapter.publicKey) {
            const publicKeyString = walletAdapter.publicKey.toString();
            setAddress(publicKeyString);
            setIsConnected(true);
            
            // Register the user or check if they exist
            await registerOrLoginUser(publicKeyString);
          } else {
            // Clear stored address if it's no longer valid
            Cookies.remove('connectedAddress');
          }
        }
      } catch (err) {
        console.error('Failed to check connection:', err);
        // Clear stored address if there's an error
        Cookies.remove('connectedAddress');
      }
    };
    
    if (walletAdapter) {
      checkConnection();
    }
  }, [walletAdapter]);

  // Listen for wallet adapter events
  useEffect(() => {
    if (!walletAdapter) return;

    const onConnect = () => {
      if (walletAdapter.publicKey) {
        const publicKeyString = walletAdapter.publicKey.toString();
        setAddress(publicKeyString);
        setIsConnected(true);
        
        // Store the connected address in a cookie (expires in 7 days)
        Cookies.set('connectedAddress', publicKeyString, { expires: 7, sameSite: 'strict' });
        
        // Register the user or check if they exist
        registerOrLoginUser(publicKeyString);
      }
    };

    const onDisconnect = () => {
      setAddress(null);
      setIsConnected(false);
      // Clear the stored address cookie
      Cookies.remove('connectedAddress');
    };

    walletAdapter.on('connect', onConnect);
    walletAdapter.on('disconnect', onDisconnect);

    return () => {
      walletAdapter.off('connect', onConnect);
      walletAdapter.off('disconnect', onDisconnect);
    };
  }, [walletAdapter]);

  const registerOrLoginUser = async (walletAddress: string) => {
    try {
      const response = await fetch('/api/auth/phantom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: walletAddress }),
      });
      
      if (!response.ok) {
        console.warn('Authentication API returned an error, but continuing with wallet connection');
        // Don't throw an error, just log it and continue
      } else {
        const data = await response.json();
        console.log('User registered/logged in:', data);
        // You could store additional user data here if needed
      }
    } catch (err) {
      console.warn('Error registering/logging in user, but continuing with wallet connection:', err);
      // Don't set error state, just log it and continue
    }
  };

  const connectWallet = async () => {
    if (!walletAdapter) {
      setError('Phantom wallet adapter not initialized');
      return;
    }

    // Check if Phantom is available in the browser
    if (typeof window !== 'undefined' && !window.phantom) {
      setError('Phantom wallet is not installed');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await walletAdapter.connect();
      
      // The connection event handler will update the state
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
      setIsConnected(false);
      setAddress(null);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    if (walletAdapter && walletAdapter.connected) {
      walletAdapter.disconnect();
    }
    
    // The disconnection event handler will update the state
  };

  const value = {
    address,
    isConnected,
    isLoading,
    connectWallet,
    disconnectWallet,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
