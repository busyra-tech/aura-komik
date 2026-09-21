import Link from "next/link";
import { BookOpen, Home, Search } from "lucide-react";

export default function NotFound() {
	return (
		<div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
			<div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
				<BookOpen className="h-10 w-10" />
			</div>
			<h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
				404
			</h1>
			<h2 className="mt-2 text-xl font-semibold text-foreground">
				Halaman Tidak Ditemukan
			</h2>
			<p className="mt-2 max-w-md text-sm text-muted">
				Komik, bab, atau halaman yang kamu tuju mungkin sudah dipindahkan atau
				sedang tidak tersedia.
			</p>
			<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
				<Link
					href="/"
					className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
				>
					<Home className="h-4 w-4" />
					<span>Kembali ke Beranda</span>
				</Link>
				<Link
					href="/cari"
					className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-white/5 transition-colors"
				>
					<Search className="h-4 w-4" />
					<span>Cari Judul Lain</span>
				</Link>
			</div>
		</div>
	);
}
