import Link from "next/link";
import Image from "next/image";
import { Search, Bookmark, Home } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { getDictionary, getLanguage } from "@/lib/i18n";

export default async function Navbar() {
	const t = await getDictionary();
	const currentLang = await getLanguage();

	return (
		<>
		<header className="global-navbar sticky top-0 z-50 border-b border-line/80 bg-background/90 backdrop-blur">
			<div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
				<Link href="/" className="flex items-center gap-3 shrink-0 group">
					<div className="relative h-9 w-9 overflow-hidden rounded-md transition-transform group-hover:scale-105">
						<Image src="/icon.png" alt="AuraKomik Logo" fill className="object-cover" />
					</div>
					<span className="font-display text-2xl tracking-wide bg-linear-to-r from-accent to-purple-500 bg-clip-text text-transparent">AURAKOMIK</span>
				</Link>

				<nav className="hidden items-center gap-1 md:flex ml-4">
					<Link
						href="/"
						className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground transition-colors"
					>
						<Home size={15} /> {t.navbar.home}
					</Link>
					<Link
						href="/cari"
						className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground transition-colors"
					>
						<Search size={15} /> {t.navbar.search}
					</Link>
					<Link
						href="/bookmarks"
						className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground transition-colors"
					>
						<Bookmark size={15} /> {t.navbar.bookmarks}
					</Link>
				</nav>

				<form
					action="/cari"
					className="ml-auto hidden flex-1 items-center gap-2 sm:flex sm:max-w-xs"
				>
					<div className="flex w-full items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5">
						<Search size={16} className="text-muted shrink-0" />
						<input
							name="q"
							type="text"
							placeholder={t.navbar.searchPlaceholder}
							className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
						/>
					</div>
				</form>

				<div className="hidden sm:block">
					<LanguageSwitcher currentLang={currentLang} />
				</div>

				{/* Mobile bottom nav icons */}
				<div className="flex items-center gap-2 sm:hidden">
					<LanguageSwitcher currentLang={currentLang} />
					<Link
						href="/bookmarks"
						className="rounded-full border border-line p-2 hover:border-accent hover:text-accent transition-colors"
					>
						<Bookmark size={18} />
					</Link>
				</div>
			</div>

			</header>

			{/* Mobile bottom navigation */}
			<nav className="global-navbar fixed bottom-0 left-0 right-0 z-50 flex border-t border-line bg-background/95 backdrop-blur md:hidden pb-[env(safe-area-inset-bottom)]">
				<Link
					href="/"
					className="flex flex-1 flex-col items-center gap-1 py-3 text-muted hover:text-foreground transition-colors"
				>
					<Home size={20} />
					<span className="text-[10px]">{t.navbar.home}</span>
				</Link>
				<Link
					href="/cari"
					className="flex flex-1 flex-col items-center gap-1 py-3 text-muted hover:text-foreground transition-colors"
				>
					<Search size={20} />
					<span className="text-[10px]">{t.navbar.search}</span>
				</Link>
				<Link
					href="/bookmarks"
					className="flex flex-1 flex-col items-center gap-1 py-3 text-muted hover:text-foreground transition-colors"
				>
					<Bookmark size={20} />
					<span className="text-[10px]">{t.navbar.bookmarks}</span>
				</Link>
			</nav>
		</>
	);
}
