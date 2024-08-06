import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "../../providers/ReactQueryProvider";
import { ToastProvider } from "../../custom-hooks/useToast";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
          <GoogleOAuthProvider clientId="19202244146-puac5q9i2qquf8tj8b1qam2ha3teuukr.apps.googleusercontent.com">
            <ToastProvider>{children}</ToastProvider>
          </GoogleOAuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
