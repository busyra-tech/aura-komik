"use client";

import { useRouter } from "next/navigation";

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

	return (
		<div className="flex flex-wrap gap-1.5">
			<button
				onClick={() => router.push(buildUrl([]))}
				className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
					activeGenres.length === 0
						? "border-accent bg-accent text-background"
						: "border-line text-muted hover:border-accent hover:text-foreground"
				}`}
			>
				Semua
			</button>
			{genres.map((g) => {
				const active = activeGenres.includes(g.slug);
				return (
					<button
						key={g.slug}
						onClick={() => toggle(g.slug)}
						className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
							active
								? "border-accent bg-accent text-background"
								: "border-line text-muted hover:border-accent hover:text-foreground"
						}`}
					>
						{g.name}
					</button>
				);
			})}
		</div>
	);
}
