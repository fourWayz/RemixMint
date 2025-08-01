import { MintGrid } from "../components/MintGrid";

export default function RecentMintsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Some Recently Deployed Coins
      </h1>
      <MintGrid fetchType="recent" />
    </div>
  );
}