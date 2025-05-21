"use client"

import { useState } from 'react';
import UploadForm from '@/app/components/UploadForm';
import RemixPreview from '@/app/components/RemixPreview';
import { MintHistory } from '../components/MintHistory';


export default function UploadPage() {
  const [remixBase64, setRemixBase64] = useState('');

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🖼️ Upload & Remix</h1>

      {!remixBase64 ? (
        <UploadForm
          onRemixComplete={(base64) => {
            setRemixBase64(base64);
          }}
        />
      ) : (
           <RemixPreview base64={remixBase64}  />
      )}
          <MintHistory />

    </div>
  );
}
