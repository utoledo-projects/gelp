import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import getUser from "@/actions/getUser";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gelp",
  description: "Track, Review, and Discover Games",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const access = cookieStore.get('G_ACCESS_TOKEN');
  const rawUser = access ? await getUser(access.value) : null;  
  const user = rawUser ? {
    username: rawUser.username,
    email: rawUser.email,
    isAdmin: rawUser.isAdministrator,
  } : null;

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <Navbar user={user} />
        {children}
      </body>
    </html>
  );
}
