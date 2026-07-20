"use client";

import { useState } from "react";
import Link from "next/link";
import { List, X } from "lucide-react";

interface Chapter {
	id: string;
	number: number;
	title: string;
}

interface Props {
	chapters: Chapter[];
	slug: string;
	currentChapterId: string;
}

export default function ChapterPopup({
	chapters,
	slug,
	currentChapterId,
}: Props) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="flex items-center gap-1 text-sm text-muted hover:text-foreground"
			>
				<List size={16} />
				<span className="hidden sm:inline">Daftar chapter</span>
			</button>

			{open && (
				<div
					className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
					onClick={() => setOpen(false)}
				>
					<div
						className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl border border-line bg-background max-h-[70vh] flex flex-col"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between px-4 py-3 border-b border-line shrink-0">
							<span className="font-display tracking-wide text-sm">
								PILIH CHAPTER
							</span>
							<button
								onClick={() => setOpen(false)}
								className="text-muted hover:text-foreground"
							>
								<X size={18} />
							</button>
						</div>
						<ul className="overflow-y-auto divide-y divide-line">
							{chapters.map((c) => {
								const active = c.id === currentChapterId;
								return (
									<li key={c.id}>
										<Link
											href={`/komik/${slug}/baca/${c.id}`}
											onClick={() => setOpen(false)}
											className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${
												active
													? "bg-accent/10 text-accent font-medium"
													: "hover:bg-surface-2 text-foreground"
											}`}
										>
											<span>Chapter {c.number}</span>
											{active && (
												<span className="text-xs rounded-full bg-accent text-background px-2 py-0.5">
													Sedang dibaca
												</span>
											)}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			)}
		</>
	);
}
