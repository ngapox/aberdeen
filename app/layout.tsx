import type { Metadata } from "next";
import "./globals.css";
import { PortalProvider } from "@/components/ui/portal-context";

export const metadata: Metadata = {
  title:
    "Aberdeen Daycare & Nursery School | Step by Step, the child is prospering",
  description:
    "Step by Step, the child is prospering. Premier early childhood education in Tanzania offering Step 1 (Daycare), Step 2 (Nursery), and Step 3 (Pre-Unit) under Director Madam Elizabeth Nkya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased selection:bg-aberdeen-600 selection:text-white">
        <PortalProvider>{children}</PortalProvider>
      </body>
    </html>
  );
}
