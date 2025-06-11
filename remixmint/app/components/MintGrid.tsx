// components/mint-grid.tsx
'use client';

import { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaCopy, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const SweetAlert = withReactContent(Swal);

interface MintedCoin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  txHash: string;
  contractAddress?: string;
  timestamp: number;
  minterAddress: string;
  marketCap?: number;
}

type FetchType = 'recent';

export function MintGrid({ fetchType }: { fetchType: FetchType }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mints, setMints] = useState<MintedCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const t = darkMode ? theme.dark : theme.light;

  const fetchMints = async () => {
    setLoading(true);
    try {
      console.log('hey')
      const endpoint = fetchType === 'recent'
        ? `/api/mints/recent?cursor=${cursor || ''}`
        : '/api/mints/history';

      const res = await fetch(endpoint);
      const data = await res.json();

      console.log(data, 'hey')

      if (data.error) throw new Error(data.error);

      setMints(prev => [...prev, ...data.coins]);
      setCursor(data.cursor);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to fetch mints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);

    fetchMints();

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);


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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mints?.map((item, index) => (
          <CoinCard
            key={`${item.txHash}-${index}`}
            coin={item}
            darkMode={darkMode}
          />
        ))}
      </div>
  
      {loading && (
        <div className="flex justify-center py-8">
          <FaSpinner className="animate-spin text-2xl text-blue-500" />
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center">
          <button
            onClick={() => fetchMints()}
            className={`px-6 py-2 rounded-lg ${t.secondaryText} ${t.text} hover:opacity-90`}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

const CoinCard = ({ coin, darkMode }: { coin: MintedCoin; darkMode: boolean }) => {
  const t = darkMode ? theme.dark : theme.light;

  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-200 border ${t.card} hover:shadow-md`}>
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
        <img
          src='/remix-mint.png'
          alt={coin.name}
          className="absolute inset-0 w-full h-full object-contain p-4"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-coin.png';
          }}
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-bold text-lg ${t.text}`}>
              {coin.name}
            </h3>
            <p className={t.secondaryText}>${coin.symbol}</p>
          </div>
          <div className={`text-sm ${coin.marketCap ? t.text : t.secondaryText}`}>
            {coin.marketCap ? `$${coin.marketCap.toLocaleString()}` : 'No cap'}
          </div>
        </div>

        <div className={`mt-3 text-sm ${t.secondaryText} truncate`}>
          By: {coin.minterAddress?.slice(0, 6)}...{coin.minterAddress?.slice(-4)}
        </div>

        <div className={`mt-4 pt-4 border-t ${t.divider} flex justify-between items-center`}>
          {/* <span className={`text-sm ${t.secondaryText}`}>
            {new Date(coin.timestamp).toLocaleDateString()}
          </span> */}

          <div className="flex gap-2">
            <a
              href={`https://basescan.org/tx/${coin.txHash}`}
              target="_blank"
              className={`p-1 ${t.secondaryText} hover:text-blue-500`}
              title="View Transaction"
            >
              <FaExternalLinkAlt />
            </a>

            {coin.contractAddress && (
              <a
                href={`https://basescan.org/address/${coin.contractAddress}`}
                target="_blank"
                className={`p-1 ${t.secondaryText} hover:text-blue-500`}
                title="View Contract"
              >
                <FaExternalLinkAlt />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Shared theme config
const theme = {
  light: {
    card: 'bg-white border-gray-200',
    text: 'text-gray-900',
    secondaryText: 'text-gray-500',
    modal: 'bg-white',
    divider: 'border-gray-100'
  },
  dark: {
    card: 'bg-gray-800 border-gray-700',
    text: 'text-white',
    secondaryText: 'text-gray-400',
    modal: 'bg-gray-800',
    divider: 'border-gray-700'
  }
};