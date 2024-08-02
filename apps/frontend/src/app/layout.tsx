import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "../../providers/ReactQueryProvider";
import { ToastProvider } from "../../custom-hooks/useToast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XPLR",
  description: "Xplore the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-dvh bg-white`}>
        <ReactQueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
