"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, BookOpen, History, Trash2 } from "lucide-react";
import { useLibraryStore } from "@/lib/store";

type StoredKomik = {
	slug: string;
	title: string;
	cover: string;
	type: string;
	latestChapterNumber?: number;
};

type HistoryItem = StoredKomik & {
	chapterId: string;
	chapterNumber: number;
	readAt: string;
};

type Tab = "bookmarks" | "readlist" | "history";

function EmptyState({ label }: { label: string }) {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-center text-muted">
			<div className="mb-3 text-4xl opacity-30">📚</div>
			<p className="text-sm">{label}</p>
		</div>
	);
}

function KomikMiniCard({
	item,
	onRemove,
}: {
	item: StoredKomik;
	onRemove: () => void;
}) {
	return (
		<div className="group relative flex gap-3 rounded-lg border border-line bg-surface p-3 hover:border-accent/50 transition-colors">
			<Link href={`/komik/${item.slug}`} className="shrink-0">
				<div className="relative h-16 w-12 overflow-hidden rounded">
					{item.cover ? (
						<Image
							src={item.cover}
							alt={item.title}
							fill
							className="object-cover"
							sizes="48px"
						/>
					) : (
						<div className="h-full w-full bg-surface-2" />
					)}
				</div>
			</Link>
			<div className="flex-1 min-w-0">
				<Link href={`/komik/${item.slug}`}>
					<p className="line-clamp-2 text-sm font-medium leading-tight hover:text-accent-ink transition-colors">
						{item.title}
					</p>
				</Link>
				<p className="mt-1 text-xs text-muted">{item.type}</p>
				{item.latestChapterNumber && (
					<p className="text-xs text-muted">Ch. {item.latestChapterNumber}</p>
				)}
			</div>
			<button
				onClick={onRemove}
				className="shrink-0 self-start rounded p-1 text-muted opacity-0 group-hover:opacity-100 hover:text-accent transition-all"
				aria-label="Hapus"
			>
				<Trash2 size={14} />
			</button>
		</div>
	);
}

function HistoryCard({
	item,
	onRemove,
}: {
	item: HistoryItem;
	onRemove: () => void;
}) {
	return (
		<div className="group relative flex gap-3 rounded-lg border border-line bg-surface p-3 hover:border-accent/50 transition-colors">
			<Link href={`/komik/${item.slug}`} className="shrink-0">
				<div className="relative h-16 w-12 overflow-hidden rounded">
					{item.cover ? (
						<Image
							src={item.cover}
							alt={item.title}
							fill
							className="object-cover"
							sizes="48px"
						/>
					) : (
						<div className="h-full w-full bg-surface-2" />
					)}
				</div>
			</Link>
			<div className="flex-1 min-w-0">
				<Link href={`/komik/${item.slug}`}>
					<p className="line-clamp-2 text-sm font-medium leading-tight hover:text-accent-ink transition-colors">
						{item.title}
					</p>
				</Link>
				<p className="mt-1 text-xs text-muted">
					Terakhir baca: Ch. {item.chapterNumber}
				</p>
				<p className="text-xs text-muted/60">
					{new Date(item.readAt).toLocaleDateString("id-ID", {
						day: "numeric",
						month: "short",
						year: "numeric",
					})}
				</p>
			</div>
			<div className="flex shrink-0 flex-col items-end gap-1">
				<Link
					href={`/komik/${item.slug}/baca/${item.chapterId}`}
					className="rounded bg-accent px-2 py-1 text-[10px] font-medium text-background hover:bg-accent-ink transition-colors"
				>
					Lanjut
				</Link>
				<button
					onClick={onRemove}
					className="rounded p-1 text-muted opacity-0 group-hover:opacity-100 hover:text-accent transition-all"
					aria-label="Hapus"
				>
					<Trash2 size={14} />
				</button>
			</div>
		</div>
	);
}

export default function BookmarksPage() {
	const [tab, setTab] = useState<Tab>("bookmarks");
	const store = useLibraryStore();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>;
	}

	const bookmarks = store.bookmarks;
	const readlist = store.readlist;
	const history = store.history;

	function removeBookmark(slug: string) {
		store.removeBookmark(slug);
	}

	function removeReadlist(slug: string) {
		store.removeReadlist(slug);
	}

	function removeHistory(slug: string) {
		store.removeFromHistory(slug);
	}

	const tabs: {
		id: Tab;
		label: string;
		icon: React.ReactNode;
		count: number;
	}[] = [
		{
			id: "bookmarks",
			label: "Bookmark",
			icon: <Bookmark size={16} />,
			count: bookmarks.length,
		},
		{
			id: "readlist",
			label: "Read List",
			icon: <BookOpen size={16} />,
			count: readlist.length,
		},
		{
			id: "history",
			label: "Riwayat",
			icon: <History size={16} />,
			count: history.length,
		},
	];

	return (
		<div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
			<h1 className="font-display text-3xl tracking-wide mb-6">PUSTAKA SAYA</h1>

			{/* Tab bar */}
			<div className="flex gap-1 rounded-xl border border-line bg-surface p-1 mb-6">
				{tabs.map((t) => (
					<button
						key={t.id}
						onClick={() => setTab(t.id)}
						className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
							tab === t.id
								? "bg-accent text-background"
								: "text-muted hover:text-foreground"
						}`}
					>
						{t.icon}
						<span className="hidden sm:inline">{t.label}</span>
						{t.count > 0 && (
							<span
								className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
									tab === t.id
										? "bg-background/20 text-background"
										: "bg-surface-2 text-muted"
								}`}
							>
								{t.count}
							</span>
						)}
					</button>
				))}
			</div>

			{/* Content */}
			{tab === "bookmarks" && (
				<div>
					{bookmarks.length === 0 ? (
						<EmptyState label="Belum ada bookmark. Tambahkan dari halaman detail komik." />
					) : (
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							{bookmarks.map((b) => (
								<KomikMiniCard
									key={b.slug}
									item={b}
									onRemove={() => removeBookmark(b.slug)}
								/>
							))}
						</div>
					)}
				</div>
			)}

			{tab === "readlist" && (
				<div>
					{readlist.length === 0 ? (
						<EmptyState label="Belum ada komik di read list." />
					) : (
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							{readlist.map((b) => (
								<KomikMiniCard
									key={b.slug}
									item={b}
									onRemove={() => removeReadlist(b.slug)}
								/>
							))}
						</div>
					)}
				</div>
			)}

			{tab === "history" && (
				<div>
					{history.length === 0 ? (
						<EmptyState label="Belum ada riwayat baca." />
					) : (
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							{history.map((h) => (
								<HistoryCard
									key={h.slug}
									item={h}
									onRemove={() => removeHistory(h.slug)}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
