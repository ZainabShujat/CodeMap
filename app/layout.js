import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://code-map-gamma.vercel.app"),
  title: "CodeMap",
  description: "Turn a GitHub repository into a readable project map.",
  openGraph: {
    title: "CodeMap",
    description:
      "Turn a GitHub repository into a clear project map — stack, structure, setup notes, and where to start.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeMap",
    description: "Turn a GitHub repository into a readable project map.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-stone-300/70 bg-white/55 px-4 py-5 text-center text-xs text-stone-500 backdrop-blur-sm sm:px-6">
          Built with Claude for the AB Talks 60-Day Claude AI Challenge —
          powered by Google Gemini.
        </footer>
      </body>
    </html>
  );
}
