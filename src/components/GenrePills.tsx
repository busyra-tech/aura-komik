"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface Genre {
	name: string;
	slug: string;
}

interface Props {
	genres: Genre[];
	activeGenres: string[];
	baseParams: Record<string, string | undefined>;
}

export default function GenrePills({
	genres,
	activeGenres,
	baseParams,
}: Props) {
	const router = useRouter();
	const [query, setQuery] = useState("");

	function buildUrl(newGenres: string[]) {
		const params = new URLSearchParams();
		for (const [k, v] of Object.entries(baseParams)) {
			if (v) params.set(k, v);
		}
		if (newGenres.length > 0) params.set("genre", newGenres.join(","));
		return `/cari?${params.toString()}`;
	}

	function toggle(slug: string) {
		const next = activeGenres.includes(slug)
			? activeGenres.filter((g) => g !== slug)
			: [...activeGenres, slug];
		router.push(buildUrl(next));
	}

	// Always show active genres first, then filter the rest by query
	const displayGenres = useMemo(() => {
		const active = genres.filter(g => activeGenres.includes(g.slug));
		const inactive = genres.filter(g => !activeGenres.includes(g.slug));
		const filteredInactive = inactive.filter(g => 
			g.name.toLowerCase().includes(query.toLowerCase())
		);
		return { active, filteredInactive };
	}, [genres, activeGenres, query]);

	return (
		<div className="flex flex-col gap-3">
			{/* Mini search for genres */}
			<div className="flex items-center gap-2 rounded-lg border border-line bg-surface/50 px-2.5 py-1.5 focus-within:border-accent transition-colors">
				<Search size={14} className="text-muted" />
				<input
					type="text"
					placeholder="Cari genre..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="w-full bg-transparent text-[11px] outline-none placeholder:text-muted"
				/>
			</div>

			<div className="max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-line scrollbar-track-transparent pr-1">
				<div className="flex flex-wrap gap-1.5">
					<button
						onClick={() => {
							setQuery("");
							router.push(buildUrl([]));
						}}
						className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors ${
							activeGenres.length === 0
								? "border-accent bg-accent text-background"
								: "border-line text-muted hover:border-accent hover:text-foreground"
						}`}
					>
						Semua
					</button>
					
					{/* Render active genres first */}
					{displayGenres.active.map((g) => (
						<button
							key={g.slug}
							onClick={() => toggle(g.slug)}
							className="rounded-md border border-accent bg-accent/10 text-accent px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-accent hover:text-background"
						>
							{g.name}
						</button>
					))}

					{/* Render inactive genres that match search */}
					{displayGenres.filteredInactive.map((g) => (
						<button
							key={g.slug}
							onClick={() => toggle(g.slug)}
							className="rounded-md border border-line text-muted px-2.5 py-1 text-[11px] font-medium transition-colors hover:border-accent hover:text-foreground"
						>
							{g.name}
						</button>
					))}

					{displayGenres.filteredInactive.length === 0 && query && (
						<span className="text-[11px] text-muted italic p-1">
							Genre tidak ditemukan
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
