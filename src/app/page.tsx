import Link from "next/link";
import { BookOpen, Clock, Star, TrendingUp } from "lucide-react";
import ComicCard from "@/components/ComicCard";
import LatestUpdateCard from "@/components/LatestUpdateCard";
import FormatFilter from "@/components/FormatFilter";
import { getLatestUpdates, getTopBySort, getPopular } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";

export default async function HomePage() {
	const [
		popDaily,
		popWeekly,
		popAll,
		ratingManhwa,
		ratingManga,
		ratingManhua,
		latest,
		t,
	] = await Promise.all([
		getPopular("daily", 10),
		getPopular("weekly", 10),
		getPopular("all", 10),
		getTopBySort("rating", "manhwa", 10),
		getTopBySort("rating", "manga", 10),
		getTopBySort("rating", "manhua", 10),
		getLatestUpdates(1, 20),
		getDictionary(),
	]);

	const popularFilters = [
		{ label: t.home.filterDaily, data: popDaily, filterValue: "daily" },
		{ label: t.home.filterWeekly, data: popWeekly, filterValue: "weekly" },
		{ label: t.home.filterAll, data: popAll, filterValue: "all" },
	];

	const ratingFormats = [
		{ label: "Manhwa", data: ratingManhwa },
		{ label: "Manga", data: ratingManga },
		{ label: "Manhua", data: ratingManhua },
	];

	return (
		<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-14">
			{/* Section 1: Top Populer */}
			<section>
				<h2 className="flex items-center gap-2 font-display text-2xl tracking-wide mb-6">
					<TrendingUp size={20} className="text-accent" /> {t.home.topPopular}
				</h2>
				<FormatFilter
					formats={popularFilters}
					sortKey="popular"
					t={t}
					isPopular
				/>
			</section>

			{/* Section 2: Top Rating */}
			<section>
				<h2 className="flex items-center gap-2 font-display text-2xl tracking-wide mb-6">
					<Star size={20} className="text-accent" /> {t.home.topRating}
				</h2>
				<FormatFilter formats={ratingFormats} sortKey="rating" t={t} />
			</section>

			{/* Section 3: Update Terbaru */}
			<section>
				<div className="flex items-center justify-between mb-4">
					<h2 className="flex items-center gap-2 font-display text-2xl tracking-wide">
						<Clock size={20} className="text-accent" /> {t.home.latestUpdate}
					</h2>
					<Link
						href="/cari"
						className="text-xs text-muted hover:text-accent-ink transition-colors"
					>
						{t.home.seeAll}
					</Link>
				</div>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5">
					{latest.map((k) => (
						<LatestUpdateCard key={k.slug} komik={k} t={t} />
					))}
				</div>
			</section>
		</div>
	);
}
