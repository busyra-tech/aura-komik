import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";
import ComicCard from "@/components/ComicCard";
import LatestUpdateCard from "@/components/LatestUpdateCard";
import FormatFilter from "@/components/FormatFilter";
import { getLatestUpdates, getByFormat } from "@/lib/api";
import { getDictionary } from "@/lib/i18n";

export default async function HomePage() {
	const [manga, manhwa, manhua, latest, t] = await Promise.all([
		getByFormat("manga", 10),
		getByFormat("manhwa", 10),
		getByFormat("manhua", 10),
		getLatestUpdates(1, 20),
		getDictionary(),
	]);

	const formats = [
		{ label: "Manhwa", data: manhwa },
		{ label: "Manga", data: manga },
		{ label: "Manhua", data: manhua },
	];

	return (
		<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-14">
			{/* Section 1: Format filter */}
			<section>
				<h2 className="flex items-center gap-2 font-display text-2xl tracking-wide mb-6">
					<BookOpen size={20} className="text-accent" /> {t.home.recommendation}
				</h2>
				<FormatFilter formats={formats} />
			</section>

			{/* Section 2: Update Terbaru */}
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

