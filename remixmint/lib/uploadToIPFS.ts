import axios from 'axios';
export async function uploadToIPFS(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET
        }
      }
    );
  
    if (!res.data) {
      throw new Error('Pinata upload failed');
    }
  
    const data = await res.data;
    const cid = data.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  }
  