"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpDown, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import { Dictionary } from "@/lib/i18n/dictionaries";
import { useLibraryStore } from "@/lib/store";

interface Chapter {
	id: string;
	number: number;
	title: string;
	releasedAt: string;
}

interface Props {
	chapters: Chapter[]; // already sorted desc (latest first)
	slug: string;
    t: Dictionary;
}

export default function ChapterSort({ chapters, slug, t }: Props) {
	const [asc, setAsc] = useState(false);
	const displayed = asc ? [...chapters].reverse() : chapters;
	const store = useLibraryStore();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="font-display text-2xl tracking-wide uppercase">{t.detail.chapterList}</h2>
				<button
					onClick={() => setAsc((v) => !v)}
					className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:border-accent hover:text-foreground transition-colors"
				>
					<ArrowUpDown size={12} />
					{asc ? t.detail.oldest : t.detail.newest}
				</button>
			</div>
			<ul className="divide-y divide-line rounded-md border border-line bg-surface">
				{displayed.map((c) => {
					const isRead = isMounted && store.isChapterRead(c.id);
					return (
						<li key={c.id}>
							<Link
								href={`/komik/${slug}/baca/${c.id}`}
								className={`flex items-center justify-between px-4 py-3 transition-colors ${
									isRead
										? "bg-surface/50 text-muted hover:bg-surface"
										: "hover:bg-surface-2"
								}`}
							>
								<span className="font-medium flex items-center gap-2">
									Chapter {c.number}
									{isRead && <CheckCircle2 size={14} className="text-accent opacity-70" />}
									<span className="ml-2 text-sm text-muted">{c.title}</span>
								</span>
								<span className="text-xs text-muted">
									{formatDate(c.releasedAt)}
								</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
