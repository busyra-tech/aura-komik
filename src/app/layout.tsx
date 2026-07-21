import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
	title: "AuraKomik — Baca Komik Online",
	description:
		"Platform baca komik: manga, manhwa, dan manhua. Dibangun dengan Next.js.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="id" className="h-full" suppressHydrationWarning>
			<body
				className="min-h-full flex flex-col bg-background text-foreground antialiased"
				suppressHydrationWarning
			>
				<Navbar />
				<main className="flex-1 pb-20 md:pb-0">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
