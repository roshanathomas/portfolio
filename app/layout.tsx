import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roshan Thomas — AI Engineer",
  description:
    "AI Engineer building production agents, RAG systems, and full-stack apps powered by LLMs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased font-sans">{children}</body>
    </html>
  );
}
