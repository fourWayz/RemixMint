import axios from 'axios';

export async function uploadToIPFS(base64Data: string): Promise<string> {
    // Extract MIME type and Base64 payload from the data URI
    const matches = base64Data.match(/^data:(.+?);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid Base64 data URI format');
    }

    const mimeType = matches[1]; // e.g., "image/png"
    const base64String = matches[2]; // Raw Base64 data
    const fileExtension = mimeType.split('/')[1] || 'bin'; // Extract extension (e.g., "png")

    // Convert Base64 to Blob
    const byteCharacters = atob(base64String);
    const byteArrays = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArrays], { type: mimeType });

    // Prepare FormData with a generated filename (e.g., "file-20240521.png")
    const formData = new FormData();
    formData.append('file', blob, `file-${Date.now()}.${fileExtension}`);

    // Upload to Pinata
    const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                pinata_api_key: process.env.NEXT_PUBLIC_PINATA_KEY,
                pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET,
            },
        }
    );

    if (!res.data?.IpfsHash) {
        throw new Error('Pinata upload failed');
    }

    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
}