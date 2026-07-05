import type { Metadata } from "next";
import { Anybody, Hanken_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Focus Wapas Lao | 19 July Mega Youth Fest Dhanbad",
  description: "19 July — ek din jo focus wapas la dega. 2500+ log is saal join kar rahe hain Dhanbad ke sabse bade youth fest mein.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anybody.variable} ${hankenGrotesk.variable} ${spaceMono.variable} h-full antialiased dark`}
    >
      <head>
        <link rel="icon" href="/Fabicon.png" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <style>{`
          .font-display { font-family: var(--font-anybody), sans-serif; }
          .font-body { font-family: var(--font-hanken), sans-serif; }
          .font-mono { font-family: var(--font-space-mono), monospace; }
          .label-caps { font-family: var(--font-space-mono), monospace; text-transform: uppercase; letter-spacing: 0.1em; font-size: 14px; }
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; vertical-align: middle; }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
