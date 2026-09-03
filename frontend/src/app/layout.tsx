import type { Metadata } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space-grotesk' });
const ibmPlexMono = IBM_Plex_Mono({ weight: '400', subsets: ["latin"], variable: '--font-ibm-plex-mono' });

export const metadata: Metadata = {
  title: "ReachInbox Job Scheduler",
  description: "Email outreach automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} font-body bg-plum-base text-text-base antialiased`}>
        {children}
      </body>
    </html>
  );
}
