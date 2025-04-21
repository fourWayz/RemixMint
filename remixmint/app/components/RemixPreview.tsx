import { useWalletClient, useAccount } from 'wagmi';
import { mintRemixNFT } from '@/lib/mintWithZora';
import { useState } from 'react';

export default function RemixPreview({ base64, file }: { base64: string; file: File | null }) {
    const [minted, setMinted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [ipfsUrl, setIpfsUrl] = useState('');
    const [copied, setCopied] = useState(false);
  
    const { data: walletClient } = useWalletClient();
    const { address } = useAccount();
  
    const handleMint = async () => {
      if (!walletClient || !address || !file) {
        setError('Missing wallet connection or file.');
        return;
      }
  
      setLoading(true);
      setError('');
  
      try {
        const { uploadToIPFS } = await import('@/lib/uploadToIPFS');
        const { uploadMetadataToIPFS } = await import('@/lib/uploadMetadataToIPFS');
  
        const ipfsImageUrl = await uploadToIPFS(file);
  
        const metadataURI = await uploadMetadataToIPFS({
          name: 'Remixed Meme',
          description: 'AI-generated meme using RemixMint',
          image: ipfsImageUrl,
          createdBy: address,
          remixPrompt: 'turn this into a viral meme',
        });
  
        const tx = await mintRemixNFT({
          imageUrl: metadataURI,
          walletClient,
          address,
        });
  
        setMinted(true);
        setIpfsUrl(metadataURI);
        console.log('Minted:', tx);
      } catch (err) {
        console.error(err);
        setError('Something went wrong during minting.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Remixed Image</h2>
        <img
          src={`data:image/png;base64,${base64}`}
          alt="Remixed"
          className="rounded-lg shadow"
        />
  
        <button
          onClick={handleMint}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          disabled={loading || minted}
        >
          {loading ? 'Minting...' : minted ? 'Minted ✅' : 'Mint as NFT'}
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
  
        {error && (
          <p className="text-red-500 mt-3 text-sm">{error}</p>
        )}
      </div>
    );
  }
  
