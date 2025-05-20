'use client';

import { useWalletClient, useAccount } from 'wagmi';
import { useWriteContract } from 'wagmi';
import { createCoinCall } from '@zoralabs/coins-sdk';
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Address } from 'viem';
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

export default function RemixPreview({ base64, file }: { base64: string; file: File | null }) {
  const [minted, setMinted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ipfsUrl, setIpfsUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [txHash, setTxHash] = useState('');

  const { data: walletClient } = useWalletClient();
  const { writeContract } = useWriteContract();

  const saveMintToHistory = (coin: MintedCoin) => {
    const history = JSON.parse(localStorage.getItem('mintHistory') || '[]');
    history.unshift(coin); // Add newest first
    localStorage.setItem('mintHistory', JSON.stringify(history));
  };

  const fetchContractAddress = async (txHash: string) => {
  try {
    const response = await fetch(`https://api.basescan.org/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}`);
    const data = await response.json();
    if (data.result?.contractAddress) {
      // Update localStorage with contract address
      const history = JSON.parse(localStorage.getItem('mintHistory') || '[]');
      const updatedHistory = history.map((item: MintedCoin) => 
        item.txHash === txHash ? { ...item, contractAddress: data.result.contractAddress } : item
      );
      localStorage.setItem('mintHistory', JSON.stringify(updatedHistory));
    }
  } catch (error) {
    console.error('Failed to fetch contract address:', error);
  }
};

  const handleMint = async () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    if (!walletClient || !address || !file) {
      setError('Missing wallet connection or file.');
      return;
    }


    const { value: formValues } = await SweetAlert.fire({
      title: 'Customize Your Meme Coin',
      html:
        '<input id="coin-name" class="swal2-input" placeholder="Coin Name">' +
        '<input id="coin-symbol" class="swal2-input" placeholder="Symbol (e.g. MEME)">',
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById('coin-name') as HTMLInputElement)?.value;
        const symbol = (document.getElementById('coin-symbol') as HTMLInputElement)?.value;
        if (!name || !symbol) {
          Swal.showValidationMessage('Both fields are required');
          return;
        }
        return { name, symbol };
      },
    });

    if (!formValues) return; // Cancelled

    const { name, symbol } = formValues;

    setLoading(true);
    setError('');

    try {
      const { uploadToIPFS } = await import('@/lib/uploadToIPFS');
      const { uploadMetadataToIPFS } = await import('@/lib/uploadMetadataToIPFS');

      const ipfsImageUrl = await uploadToIPFS(base64);

      const metadataURI = await uploadMetadataToIPFS({
        name,
        description: 'AI-generated meme using RemixMint',
        image: ipfsImageUrl,
      });

      const coinParams = {
        name,
        symbol,
        uri: metadataURI,
        payoutRecipient: address as Address,
        platformReferrer: address as Address,
      };

      const callParams = await createCoinCall(coinParams);

      writeContract(callParams, {
        onSuccess: async (result) => {
          setMinted(true);
          setIpfsUrl(metadataURI);

          const txHash = result;
          setTxHash(txHash);
          // Store in history immediately 
          saveMintToHistory({
            name,
            symbol,
            image: base64, 
            txHash,
            ipfsUrl: metadataURI,
            timestamp: Date.now(),
          });
          SweetAlert.fire({
            title: '🎉 Coin Minted!',
            html: `
              <p>Your meme coin is live!</p>
              <p><strong>Tx Hash:</strong> <a href="https://basescan.org/tx/${txHash}" target="_blank">${txHash}</a></p>
            `,
            icon: 'success',
          });

            setTimeout(() => fetchContractAddress(txHash), 10000);
        },

        onError: (err) => {
          console.error(err);
          setError('Failed to deploy coin.');
          SweetAlert.fire('Error', 'Failed to deploy your coin.', 'error');
        },
      });
    } catch (err) {
      console.error(err);
      setError('Something went wrong during minting.');
      SweetAlert.fire('Error', 'Something went wrong during minting.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-2">Remixed Image</h2>
      <img
        src={`${base64}`}
        alt="Generated"
        className="rounded-lg shadow max-w-full max-h-[500px] object-contain"
      />

      <button
        onClick={handleMint}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        disabled={loading || minted}
      >
        {loading ? 'Minting Coin...' : minted ? 'Coin Minted ✅' : 'Mint as Meme Coin'}
      </button>

      {ipfsUrl && (
        <div className="mt-3">
          <p className="text-sm text-gray-600">Metadata IPFS:</p>
          <div className="flex items-center gap-2">
            <a href={ipfsUrl} target="_blank" className="text-blue-600 underline">
              {ipfsUrl}
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(ipfsUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-gray-500 underline"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {txHash && (
        <div className="mt-3 text-sm text-gray-700">
          <p>
            Tx Hash:{' '}
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              className="text-blue-600 underline"
            >
              {txHash}
            </a>
          </p>

        </div>
      )}

      {error && (
        <p className="text-red-500 mt-3 text-sm">{error}</p>
      )}
    </div>
  );
}
