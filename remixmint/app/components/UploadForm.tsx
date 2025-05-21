"use client"

import { useState } from 'react';

export default function UploadForm({
  onRemixComplete,
}: {
  onRemixComplete: (base64: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prompt, setPrompt] = useState('');

  const handleFileUpload = async () => {

    setLoading(true);
    setError('');

    try {

      const res = await fetch('/api/remix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      

      const { image } = await res.json();
      // if (!data.base64) throw new Error('Remix failed');
      onRemixComplete(image);
    } catch (err) {
      console.error(err);
      setError('Something went wrong while remixing your image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
       <label className="block mb-2 text-gray-700 font-semibold">
        Enter a prompt to generate your meme:
      </label>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-xl"
        placeholder="e.g. Sassy cat wearing sunglasses in space"
      />
      
      <button 
      onClick={handleFileUpload}
      className={`
        px-6 py-3 rounded-lg font-medium text-white
        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
      `}>Remix</button>
      {loading && <p className="mt-3 text-sm text-blue-600">Remixing...</p>}
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  );
}
