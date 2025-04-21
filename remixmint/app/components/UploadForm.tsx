import { useState } from 'react';

export default function UploadForm({
  onRemixComplete,
}: {
  onRemixComplete: (base64: string, file: File) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/remix', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.base64) throw new Error('Remix failed');

      onRemixComplete(data.base64, file);
    } catch (err) {
      console.error(err);
      setError('Something went wrong while remixing your image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="mb-4 text-gray-600 text-sm">
        Upload an image to turn it into a viral AI-powered meme.
      </p>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {loading && <p className="mt-3 text-sm text-blue-600">Remixing...</p>}
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  );
}
