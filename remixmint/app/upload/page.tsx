"use client"

import { useState } from 'react';
import UploadForm from '../components/UploadForm';
import RemixPreview from '../components/RemixPreview';

export default function UploadPage() {
  const [remixBase64, setRemixBase64] = useState('');
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🖼️ Upload & Remix</h1>

      {!remixBase64 ? (
        <UploadForm
          onRemixComplete={(base64, file) => {
            setRemixBase64(base64);
            setOriginalFile(file);
          }}
        />
      ) : (
        <RemixPreview base64={remixBase64} file={originalFile} />
      )}
    </div>
  );
}
