export async function uploadToIPFS(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT!}`,
      },
      body: formData,
    });
  
    if (!res.ok) {
      throw new Error('Pinata upload failed');
    }
  
    const data = await res.json();
    const cid = data.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  }
  