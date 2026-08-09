import type { Metadata } from "next";
import {
  DM_Sans,
  Geist_Mono,
  Inter,
  Nunito_Sans,
  Outfit,
  Public_Sans,
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SettingsScript } from "@/components/settings/settings-script";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

// Font families offered in the settings drawer. Each exposes a CSS variable;
// the active one is wired to --font-sans by the settings reflect effect.
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "yTemplate",
  description: "Personal Next.js starter template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        outfit.variable,
        publicSans.variable,
        inter.variable,
        dmSans.variable,
        nunitoSans.variable,
        geistMono.variable,
      )}
    >
      <head>
        <SettingsScript />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
