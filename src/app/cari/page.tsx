import ComicCard from "@/components/ComicCard";
import GenrePills from "@/components/GenrePills";
import {
	searchKomikAdvanced,
	getAllGenres,
	SortBy,
	SortOrder,
} from "@/lib/api";
import Link from "next/link";
import { Search, ArrowUpDown } from "lucide-react";

const FORMATS = ["Manga", "Manhwa", "Manhua"];
const STATUSES = [
	{ label: "Ongoing", value: "ongoing" },
	{ label: "Completed", value: "completed" },
	{ label: "Hiatus", value: "hiatus" },
];
const SORT_OPTIONS: { label: string; value: SortBy }[] = [
	{ label: "Terbaru", value: "latest" },
	{ label: "Populer", value: "popular" },
	{ label: "Rating", value: "rating" },
	{ label: "Bookmark", value: "bookmark" },
];

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{
		q?: string;
		genre?: string;
		format?: string;
		status?: string;
		sortBy?: string;
		sortOrder?: string;
	}>;
}) {
	const { q, genre, format, status, sortBy, sortOrder } = await searchParams;
	// genre is comma-separated slugs e.g. "action,romance"
	const activeGenres = genre ? genre.split(",").filter(Boolean) : [];
	const validSortBy = (SORT_OPTIONS.map((s) => s.value) as string[]).includes(
		sortBy ?? "",
	)
		? (sortBy as SortBy)
		: "latest";
	const validSortOrder: SortOrder = sortOrder === "asc" ? "asc" : "desc";

	const [{ data: results, totalRecord }, genres] = await Promise.all([
		searchKomikAdvanced({
			q,
			genre,
			format,
			status,
			sortBy: validSortBy,
			sortOrder: validSortOrder,
			pageSize: 20,
		}),
		getAllGenres(),
	]);

	const topGenres = genres;

	function buildUrl(overrides: Record<string, string | undefined>) {
		const params = new URLSearchParams();
		const merged = {
			q,
			genre,
			format,
			status,
			sortBy,
			sortOrder,
			...overrides,
		};
		for (const [k, v] of Object.entries(merged)) {
			if (v) params.set(k, v);
		}
		return `/cari?${params.toString()}`;
	}

	return (
		<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
			<h1 className="font-display text-3xl tracking-wide mb-6">CARI KOMIK</h1>

			{/* Search bar */}
			<form method="GET" action="/cari" className="mb-6">
				{genre && <input type="hidden" name="genre" value={genre} />}
				{format && <input type="hidden" name="format" value={format} />}
				{status && <input type="hidden" name="status" value={status} />}
				{sortBy && <input type="hidden" name="sortBy" value={sortBy} />}
				{sortOrder && (
					<input type="hidden" name="sortOrder" value={sortOrder} />
				)}
				<div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 focus-within:border-accent transition-colors">
					<Search size={18} className="text-muted shrink-0" />
					<input
						name="q"
						type="text"
						defaultValue={q}
						placeholder="Cari judul komik…"
						className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
					/>
					<button
						type="submit"
						className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-background hover:bg-accent-ink transition-colors"
					>
						Cari
					</button>
				</div>
			</form>

			<div className="flex flex-col gap-6 md:flex-row">
				{/* Sidebar filter */}
				<aside className="w-full shrink-0 space-y-6 md:w-52">
					{/* Genre - multi-select via GenrePills client component */}
					<div>
						<p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
							Genre
						</p>
						<GenrePills
							genres={topGenres}
							activeGenres={activeGenres}
							baseParams={{ q, format, status, sortBy, sortOrder }}
						/>
					</div>

					{/* Format */}
					<div>
						<p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
							Format
						</p>
						<div className="flex flex-wrap gap-1.5">
							<Link
								href={buildUrl({ format: undefined })}
								className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
									!format
										? "border-accent bg-accent text-background"
										: "border-line text-muted hover:border-accent hover:text-foreground"
								}`}
							>
								Semua
							</Link>
							{FORMATS.map((f) => (
								<Link
									key={f}
									href={buildUrl({ format: f.toLowerCase() })}
									className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
										format === f.toLowerCase()
											? "border-accent bg-accent text-background"
											: "border-line text-muted hover:border-accent hover:text-foreground"
									}`}
								>
									{f}
								</Link>
							))}
						</div>
					</div>

					{/* Status */}
					<div>
						<p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
							Status
						</p>
						<div className="flex flex-wrap gap-1.5">
							<Link
								href={buildUrl({ status: undefined })}
								className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
									!status
										? "border-accent bg-accent text-background"
										: "border-line text-muted hover:border-accent hover:text-foreground"
								}`}
							>
								Semua
							</Link>
							{STATUSES.map((s) => (
								<Link
									key={s.value}
									href={buildUrl({ status: s.value })}
									className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
										status === s.value
											? "border-accent bg-accent text-background"
											: "border-line text-muted hover:border-accent hover:text-foreground"
									}`}
								>
									{s.label}
								</Link>
							))}
						</div>
					</div>
				</aside>

				{/* Results */}
				<div className="flex-1">
					{/* Sort bar */}
					<div className="mb-4 flex flex-wrap items-center gap-2">
						<span className="flex items-center gap-1 text-xs text-muted">
							<ArrowUpDown size={12} /> Urutkan:
						</span>
						{SORT_OPTIONS.map((s) => (
							<Link
								key={s.value}
								href={buildUrl({ sortBy: s.value, sortOrder: validSortOrder })}
								className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
									validSortBy === s.value
										? "border-accent bg-accent text-background"
										: "border-line text-muted hover:border-accent hover:text-foreground"
								}`}
							>
								{s.label}
							</Link>
						))}
						<span className="ml-auto flex gap-1">
							<Link
								href={buildUrl({ sortOrder: "desc" })}
								className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
									validSortOrder === "desc"
										? "border-accent bg-accent text-background"
										: "border-line text-muted hover:border-accent hover:text-foreground"
								}`}
							>
								↓ Desc
							</Link>
							<Link
								href={buildUrl({ sortOrder: "asc" })}
								className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
									validSortOrder === "asc"
										? "border-accent bg-accent text-background"
										: "border-line text-muted hover:border-accent hover:text-foreground"
								}`}
							>
								↑ Asc
							</Link>
						</span>
					</div>
					<p className="mb-4 text-sm text-muted">
						{totalRecord > 0
							? `${totalRecord} komik ditemukan${q ? ` untuk "${q}"` : ""}${activeGenres.length ? ` · genre: ${activeGenres.join(", ")}` : ""}`
							: q
								? `Tidak ada hasil untuk "${q}"`
								: "Menampilkan 20 komik terbaru"}
					</p>

					{results.length > 0 ? (
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
							{results.map((k) => (
								<ComicCard key={k.slug} komik={k} />
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-20 text-center text-muted">
							<div className="mb-3 text-4xl opacity-30">🔍</div>
							<p className="text-sm">
								Tidak ada komik yang cocok dengan filter ini.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
