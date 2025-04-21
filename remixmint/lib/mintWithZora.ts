import { ZoraNFTCreatorV1Factory } from '@zoralabs/protocol-sdk';
import { parseEther } from 'ethers';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { zora } from 'viem/chains';
import { useAccount, useWriteContract } from 'wagmi';
import { createCoinCall } from '@zoralabs/coins-sdk';

export async function mintRemixNFT({
  imageUrl,
  walletClient,
  address,
}: {
  imageUrl: string;
  walletClient: any;
  address: string;
}) {
  
  const { writeContract } = useWriteContract();
  const zoraFactory = new ZoraNFTCreatorV1Factory({
    chain: zora,
    walletClient,
  });

  const tx = await zoraFactory.createDrop({
    name: 'Remixed Meme',
    symbol: 'REMIX',
    imageURI: imageUrl,
    metadataURI: imageUrl,
    maxSupply: 1,
    pricePerToken: parseEther('0'),
    royaltyBPS: 500, // 5% royalties
    defaultAdmin: address,
  });

  return tx;
}
