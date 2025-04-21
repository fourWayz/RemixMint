export async function uploadMetadataToIPFS(metadata: Record<string, any>): Promise<string> {
    const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT!}`,
      },
      body: JSON.stringify(metadata),
    });
  
    if (!res.ok) {
      throw new Error('Failed to upload metadata to Pinata');
    }
  
    const data = await res.json();
    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
  }
  