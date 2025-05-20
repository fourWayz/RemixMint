'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface MintedCoin {
  name: string;
  symbol: string;
  image: string; 
  txHash: string;
  contractAddress?: string; 
  timestamp: number;
  ipfsUrl: string;
}

export function MintHistory() {
  const { address } = useAccount();
  const [history, setHistory] = useState<MintedCoin[]>([]);

  useEffect(() => {
    if (address) {
      const storedHistory = JSON.parse(localStorage.getItem('mintHistory') || '[]');
      setHistory(storedHistory);
    }
  }, [address]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Your Mint History</h2>
      
      {history.length === 0 ? (
        <p className="text-gray-500">No mints yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item) => (
            <div key={item.txHash} className="border rounded-lg p-4">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-32 object-contain mb-2"
              />
              <h3 className="font-bold">{item.name} (${item.symbol})</h3>
              <p className="text-sm text-gray-500">
                {new Date(item.timestamp).toLocaleString()}
              </p>
              <div className="mt-2 space-x-2">
                <a 
                  href={`https://basescan.org/tx/${item.txHash}`} 
                  target="_blank"
                  className="text-blue-500 text-sm"
                >
                  View Tx
                </a>
                {item.ipfsUrl && (
                  <a 
                    href={item.ipfsUrl} 
                    target="_blank"
                    className="text-blue-500 text-sm"
                  >
                    IPFS
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}