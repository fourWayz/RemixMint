"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { createConfig, http } from 'wagmi'
import { base, baseSepolia } from 'viem/chains'
import { injected, walletConnect } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from "./components/ThemeProvider";
import { PrivyProvider } from "@privy-io/react-auth";

const queryClient = new QueryClient()

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

const wagmiConfig = createConfig({
  chains: [base, baseSepolia] as const,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
    })
  ]
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className="bg-black">
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <ThemeProvider>
                <PrivyProvider
                  appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
                  config={{
                    appearance: { theme: "dark" }, // or "light" or auto
                  }}
                >
                  {children}
                </PrivyProvider>
              </ThemeProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>

      </body>
    </html>
  );
}
