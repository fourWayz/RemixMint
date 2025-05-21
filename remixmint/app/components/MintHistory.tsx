'use client';

import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaShare, FaExternalLinkAlt, FaCopy, FaChevronDown } from 'react-icons/fa';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const SweetAlert = withReactContent(Swal);

interface MintedCoin {
  name: string;
  symbol: string;
  image: string;
  txHash: string;
  contractAddress?: string;
  timestamp: number;
  ipfsUrl: string;
}

// Theme configuration
const theme = {
  light: {
    bg: 'bg-white',
    card: 'bg-white border-gray-200',
    text: 'text-gray-900',
    secondaryText: 'text-gray-500',
    hover: 'hover:bg-gray-50',
    button: 'bg-white border-gray-300 hover:bg-gray-50',
    modal: 'bg-white',
    divider: 'border-gray-100'
  },
  dark: {
    bg: 'bg-gray-900',
    card: 'bg-gray-800 border-gray-700',
    text: 'text-white',
    secondaryText: 'text-gray-400',
    hover: 'hover:bg-gray-700',
    button: 'bg-gray-700 border-gray-600 hover:bg-gray-600',
    modal: 'bg-gray-800',
    divider: 'border-gray-700'
  }
}

type SortOption = 'newest' | 'oldest' | 'name';
type FilterOption = 'all' | 'withContract' | 'withoutContract';

export function MintHistory() {
  const [history, setHistory] = useState<MintedCoin[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
   const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    
    let storedHistory = JSON.parse(localStorage.getItem('mintHistory') || '[]');
    
    // Apply filters
    if (filterBy === 'withContract') {
      storedHistory = storedHistory.filter((item: MintedCoin) => item.contractAddress);
    } else if (filterBy === 'withoutContract') {
      storedHistory = storedHistory.filter((item: MintedCoin) => !item.contractAddress);
    }

    // Apply sorting
    storedHistory.sort((a: MintedCoin, b: MintedCoin) => {
      if (sortBy === 'newest') return b.timestamp - a.timestamp;
      if (sortBy === 'oldest') return a.timestamp - b.timestamp;
      return a.name.localeCompare(b.name);
    });

    setHistory(storedHistory);
  }, [isConnected, sortBy, filterBy]);

    // Check for dark mode preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Get current theme classes
  const t = darkMode ? theme.dark : theme.light;
 const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    SweetAlert.fire({
      icon: 'success',
      title: 'Copied!',
      background: t.modal,
      color: t.text,
      showConfirmButton: false,
      timer: 1500
    });
  };

 const openDetailModal = (coin: MintedCoin) => {
    SweetAlert.fire({
      title: `${coin.name} ($${coin.symbol})`,
      html: `
        <div class="text-left space-y-3 ${t.text}">
          <img src="${coin.image}" alt="${coin.name}" class="w-full max-h-64 object-contain mx-auto rounded-lg"/>
          
          <div class="${t.card} p-3 rounded-lg border ${t.divider}">
            <p class="font-medium">Created: <span class="${t.secondaryText}">${new Date(coin.timestamp).toLocaleString()}</span></p>
            
            ${coin.contractAddress ? `
              <div class="mt-2">
                <p class="font-medium">Contract Address:</p>
                <div class="flex items-center gap-2 mt-1">
                  <a href="https://basescan.org/address/${coin.contractAddress}" 
                     target="_blank" 
                     class="text-blue-500 hover:underline flex items-center">
                    ${coin.contractAddress.slice(0, 6)}...${coin.contractAddress.slice(-4)}
                    <i class="ml-1 text-xs"><FaExternalLinkAlt/></i>
                  </a>
                  <button onclick="copyToClipboard('${coin.contractAddress}')" 
                          class="${t.secondaryText} hover:text-blue-500">
                    <i class="text-sm"><FaCopy/></i>
                  </button>
                </div>
              </div>
            ` : ''}
            
            <div class="mt-2">
              <p class="font-medium">Transaction:</p>
              <div class="flex items-center gap-2 mt-1">
                <a href="https://basescan.org/tx/${coin.txHash}" 
                   target="_blank" 
                   class="text-blue-500 hover:underline flex items-center">
                  ${coin.txHash.slice(0, 6)}...${coin.txHash.slice(-4)}
                  <i class="ml-1 text-xs"><FaExternalLinkAlt/></i>
                </a>
                <button onclick="copyToClipboard('${coin.txHash}')" 
                        class="${t.secondaryText} hover:text-blue-500">
                  <i class="text-sm"><FaCopy/></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `,
      background: t.modal,
      color: t.text,
      showConfirmButton: false,
      showCloseButton: true
    });
  };

  return (
    <div className={`${t.bg} min-h-screen mt-5 p-4 sm:p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className={`text-2xl font-bold ${t.text}`}>Your Mint History</h2>
            <p className={`${t.secondaryText} mt-1`}>
              {history.length} {history.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <button 
                onClick={() => setSortOpen(!sortOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${t.button} ${t.text}`}
              >
                Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : 'Name'}
                <FaChevronDown className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <div className={`absolute z-10 mt-1 w-40 shadow-lg rounded-lg py-1 border ${t.card} ${t.text}`}>
                  <button 
                    onClick={() => { setSortBy('newest'); setSortOpen(false); }}
                    className={`block w-full text-left px-4 py-2 ${t.hover}`}
                  >
                    Newest First
                  </button>
                  <button 
                    onClick={() => { setSortBy('oldest'); setSortOpen(false); }}
                    className={`block w-full text-left px-4 py-2 ${t.hover}`}
                  >
                    Oldest First
                  </button>
                  <button 
                    onClick={() => { setSortBy('name'); setSortOpen(false); }}
                    className={`block w-full text-left px-4 py-2 ${t.hover}`}
                  >
                    By Name
                  </button>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${t.button} ${t.text}`}
              >
                Filter: {filterBy === 'all' ? 'All' : filterBy === 'withContract' ? 'With Contract' : 'Without Contract'}
                <FaChevronDown className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
              </button>
              {filterOpen && (
                <div className={`absolute z-10 mt-1 w-48 shadow-lg rounded-lg py-1 border ${t.card} ${t.text}`}>
                  <button 
                    onClick={() => { setFilterBy('all'); setFilterOpen(false); }}
                    className={`block w-full text-left px-4 py-2 ${t.hover}`}
                  >
                    All Mints
                  </button>
                  <button 
                    onClick={() => { setFilterBy('withContract'); setFilterOpen(false); }}
                    className={`block w-full text-left px-4 py-2 ${t.hover}`}
                  >
                    With Contract
                  </button>
                  <button 
                    onClick={() => { setFilterBy('withoutContract'); setFilterOpen(false); }}
                    className={`block w-full text-left px-4 py-2 ${t.hover}`}
                  >
                    Without Contract
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {history.length === 0 ? (
          <div className={`rounded-xl p-8 text-center ${t.card}`}>
            <p className={`${t.secondaryText} text-lg`}>No mint history found</p>
            <p className={`${t.secondaryText} mt-2`}>Your minted coins will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {history.map((item) => (
              <div 
                key={item.txHash} 
                className={`rounded-xl overflow-hidden transition-all duration-200 border ${t.card} hover:shadow-md`}
              >
                <div 
                  className="relative h-48 bg-gray-100 dark:bg-gray-700 cursor-pointer"
                  onClick={() => openDetailModal(item)}
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="absolute inset-0 w-full h-full object-contain p-4"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 
                        className={`font-bold text-lg cursor-pointer hover:text-blue-500 line-clamp-1 ${t.text}`}
                        onClick={() => openDetailModal(item)}
                      >
                        {item.name}
                      </h3>
                      <p className={t.secondaryText}>${item.symbol}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(item.txHash);
                      }}
                      className={`p-1 ${t.secondaryText} hover:text-blue-500`}
                      title="Copy TX Hash"
                    >
                      <FaCopy />
                    </button>
                  </div>
                  
                  <div className={`mt-4 pt-4 border-t ${t.divider} flex justify-between items-center`}>
                    <span className={`text-sm ${t.secondaryText}`}>
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    
                    <div className="flex gap-2">
                      <a 
                        href={`https://basescan.org/tx/${item.txHash}`} 
                        target="_blank"
                        className={`p-1 ${t.secondaryText} hover:text-blue-500`}
                        title="View Transaction"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaExternalLinkAlt />
                      </a>
                      
                      {item.contractAddress && (
                        <a 
                          href={`https://basescan.org/address/${item.contractAddress}`} 
                          target="_blank"
                          className={`p-1 ${t.secondaryText} hover:text-blue-500`}
                          title="View Contract"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaExternalLinkAlt />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

}