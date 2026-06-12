import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const title = "Roshan Thomas — AI Engineer";
const description =
  "AI Engineer building production LLM systems — tool-using agents (MCP), multimodal apps, and full-stack platforms on Spring AI + Java 21, shipped to real users.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
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
