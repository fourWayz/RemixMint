'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  const [digest, setDigest] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDigest() {
      try {
        const res = await fetch('/api/digest');
        const data = await res.json();
        console.log(data)
        if (data) setDigest(data.summary.content);
      } catch (err) {
        console.error('Failed to load digest:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDigest();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-neutral-900 text-white p-6 md:p-12 max-w-6xl mx-auto">
      {/* 🎨 Hero */}
      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-4">
          RemixMint 🎨
        </h1>
        <p className="text-gray-300 text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Turn any image into a viral, tradable meme coin — powered by AI & Zora.
        </p>

        <div className="mb-8">
          <ConnectButton />
        </div>

        <div className="flex justify-center gap-6 flex-wrap">
          <Link href="/upload">
            <button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg transition-all duration-300">
              🚀 Start Remixing
            </button>
          </Link>
          <Link href="/gallery">
            <button className="bg-transparent border border-fuchsia-500 text-fuchsia-400 font-semibold px-8 py-3 rounded-2xl hover:bg-fuchsia-500/10 transition-all duration-300">
              🖼 View Gallery
            </button>
          </Link>
        </div>
      </section>

      {/* ⚡ How It Works */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-10 text-white">✨ How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: '1. Upload', desc: 'Drop a selfie, doodle, or meme you want to remix.' },
            { title: '2. Remix with AI', desc: 'We use Hugging Face / Stability AI to generate a viral version.' },
            { title: '3. Deploy & Share', desc: 'Launch it as a meme coin on Zora. Earn, share, or trade it.' },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-fuchsia-900/30 transition"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🧠 AI Digest */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-4 text-white">🧠 Trending Coins Digest</h2>
        <div className="bg-zinc-800/50 border border-white/10 p-6 rounded-2xl shadow-lg">
          {loading ? (
            <p className="text-gray-400">Generating insights...</p>
          ) : digest ? (
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">{digest}</p>
          ) : (
            <p className="text-gray-400">No summary available at the moment.</p>
          )}
        </div>
      </section>

      {/* 🔥 Latest Deployments */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-4 text-white">🔥 Latest Deployments</h2>
        <p className="text-gray-400 mb-4">See what others are remixing!</p>
        <Link href="/recent-coins">
          <button className="text-fuchsia-400 hover:underline font-medium">
            Explore Gallery →
          </button>
        </Link>
      </section>

      {/* 📎 Footer */}
      <footer className="text-center text-sm text-gray-600 mt-16 pt-10 border-t border-white/10">
        Built with 💙 on Zora · RemixMint © {new Date().getFullYear()}
      </footer>
    </main>
  );
}
