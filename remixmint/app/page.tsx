import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  return (
    <main className="p-6 md:p-12 max-w-5xl mx-auto">
      {/* 🧠 Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4">
          RemixMint 🎨 — Remix-to-Earn Memes
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Turn any image into a viral, tradable meme NFT — powered by AI & Zora.
        </p>

         {/* 💼 Wallet Connect */}
         <div className="mb-6">
         <ConnectButton />
        </div>
        <div className="flex justify-center gap-4">
          <Link href="/upload">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
              Start Remixing
            </button>
          </Link>
          <Link href="/gallery">
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition">
              View Gallery
            </button>
          </Link>
        </div>
      </section>

      {/* ⚡ How It Works */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">How it Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold mb-2">1. Upload</h3>
            <p className="text-gray-600 text-sm">
              Drop a selfie, doodle, or meme you want to remix.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold mb-2">2. Remix with AI</h3>
            <p className="text-gray-600 text-sm">
              We use AI (via Hugging Face / Stability) to generate a viral version.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold mb-2">3. Mint & Share</h3>
            <p className="text-gray-600 text-sm">
              Mint your remix as an NFT via Zora. Earn, share, or trade it.
            </p>
          </div>
        </div>
      </section>

      {/* 🖼️ Gallery Preview */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🔥 Latest Minting</h2>
        <p className="text-gray-600 mb-4">See what others are minting!</p>
        <Link href="/recent-mints">
          <button className="text-blue-600 underline">Explore Gallery →</button>
        </Link>
      </section>

      {/* 📎 Footer */}
      <footer className="text-center text-sm text-gray-400 mt-12">
        Built with 💙 on Zora. RemixMint © {new Date().getFullYear()}.
      </footer>
    </main>
  );
}
