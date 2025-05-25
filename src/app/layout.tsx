import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import AuthProvider from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
    title: "Famendar",
    description: "가족 일정 공유 캘린더 서비스",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col">
                <AuthProvider>
                    <Header />
                    <main className="basis-0 flex-grow">{children}</main>
                </AuthProvider>
            </body>
        </html>
    );
}
