'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import ThemeToggle from './components/ThemeToggle';
import PrivyLogin from './components/PrivyLogin';

export default function Home() {
  const [digest, setDigest] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDigest() {
      try {
        const res = await fetch('/api/digest');
        const data = await res.json();
        if (data) {
          const cleaned = data.summary.content.replace(/<think>[\s\S]*?<\/think>/, '').trim();
          setDigest(cleaned);
        }
      } catch (err) {
        console.error('Failed to load digest:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDigest();
  }, []);

  return (
    <main className="min-h-screen bg-white text-black dark:bg-gradient-to-br dark:from-black dark:via-zinc-900 dark:to-neutral-900 dark:text-white p-6 md:p-12 max-w-6xl mx-auto transition-colors duration-300">

      {/* 🎨 Connect + Theme Toggle + PrivyLogin */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4 items-center">
          <ConnectButton />
          <PrivyLogin />
        </div>
        <ThemeToggle />
      </div>


      {/* 🎨 Hero */}
      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-4">
          RemixMint 🎨
        </h1>
        <p className="text-gray-300 dark:text-gray-700 text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Turn any image into a viral, tradable meme coin — powered by AI & Zora.
        </p>

        <div className="flex justify-center gap-6 flex-wrap">
          <Link href="/upload">
            <button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white dark:text-white font-semibold px-8 py-3 rounded-2xl shadow-lg transition-all duration-300">
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
        <h2 className="text-3xl font-bold text-center mb-10">✨ How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: '1. Upload', desc: 'Drop a selfie, doodle, or meme you want to remix.' },
            { title: '2. Remix with AI', desc: 'We use Hugging Face / Stability AI to generate a viral version.' },
            { title: '3. Deploy & Share', desc: 'Launch it as a meme coin on Zora. Earn, share, or trade it.' },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/5 dark:bg-black/10 backdrop-blur-lg border border-white/10 dark:border-black/20 rounded-2xl p-6 shadow-xl hover:shadow-fuchsia-900/30 transition"
            >
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 dark:text-gray-700 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🧠 AI Digest */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-4">🧠 Trending Coins Digest</h2>
        <div className="bg-zinc-800/50 dark:bg-zinc-200/50 border border-white/10 dark:border-black/10 p-6 rounded-2xl shadow-lg">
          {loading ? (
            <p className="text-gray-400 dark:text-gray-700">Generating insights...</p>
          ) : digest ? (
            <p className="text-gray-300 dark:text-gray-800 whitespace-pre-line leading-relaxed">{digest}</p>
          ) : (
            <p className="text-gray-400 dark:text-gray-700">No summary available at the moment.</p>
          )}
        </div>
      </section>

      {/* 🔥 Latest Deployments */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-4">🔥 Latest Deployments</h2>
        <p className="text-gray-400 dark:text-gray-700 mb-4">See what others are remixing!</p>
        <Link href="/recent-coins">
          <button className="text-fuchsia-400 dark:text-fuchsia-600 hover:underline font-medium">
            Explore Gallery →
          </button>
        </Link>
      </section>

      {/* 📎 Footer */}
      <footer className="text-center text-sm text-gray-600 dark:text-gray-500 mt-16 pt-10 border-t border-white/10 dark:border-black/10">
        Built with 💙 on Zora · RemixMint © {new Date().getFullYear()}
      </footer>
    </main>
  );
}
