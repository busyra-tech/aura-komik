import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, Eye, BookOpen, Clock } from "lucide-react";
import { getKomikBySlug } from "@/lib/api";
import { formatViews, timeAgo } from "@/lib/format";
import ChapterSort from "@/components/ChapterSort";
import LibraryActions from "@/components/LibraryActions";
import { getDictionary } from "@/lib/i18n";

export default async function KomikDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const [komik, t] = await Promise.all([
		getKomikBySlug(slug),
		getDictionary(),
	]);
	
	if (!komik) notFound();

	const firstChapter = komik.chapters[komik.chapters.length - 1];
	const latestChapter = komik.chapters[0];

	return (
		<div>
			<div className="halftone border-b border-line relative">
				{komik.cover && (
					<Image
						src={komik.cover}
						alt={komik.title}
						fill
						className="object-cover opacity-10"
						priority
					/>
				)}
				<div className="absolute inset-0 bg-linear-to-b from-background/40 via-background to-background" />
				<div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-[220px_1fr] sm:px-6 sm:py-14">
					<div className="panel-clip aspect-3/4 w-full max-w-[220px] rounded-md border border-line bg-surface relative overflow-hidden">
						{komik.cover && (
							<Image
								src={komik.cover}
								alt={komik.title}
								fill
								className="object-cover"
								sizes="220px"
							/>
						)}
					</div>
					<div>
						<span className="rounded-full border border-line px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted">
							{komik.type} · {komik.status}
						</span>
						<h1 className="mt-3 font-display text-4xl tracking-wide sm:text-5xl">
							{komik.title}
						</h1>
						{komik.altTitle && (
							<p className="mt-1 text-muted">{komik.altTitle}</p>
						)}

						<div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
							<span className="inline-flex items-center gap-1">
								<Star size={14} className="fill-accent text-accent" />{" "}
								{komik.rating}
							</span>
							<span className="inline-flex items-center gap-1">
								<Eye size={14} /> {formatViews(komik.views)} {t.detail.views.toLowerCase()}
							</span>
							<span className="inline-flex items-center gap-1">
								<BookOpen size={14} /> {komik.chapters.length} {t.detail.chapters.toLowerCase()}
							</span>
							<span className="inline-flex items-center gap-1">
								<Clock size={14} /> {t.detail.updated} {timeAgo(komik.updatedAt)}
							</span>
						</div>

						<div className="mt-3 flex flex-wrap gap-2">
							{komik.genres.map((g) => (
								<Link
									key={g}
									href={`/cari?genre=${encodeURIComponent(g.toLowerCase())}`}
									className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted hover:border-accent hover:text-accent-ink"
								>
									{g}
								</Link>
							))}
						</div>

						<LibraryActions komik={komik} />

						<p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted whitespace-pre-wrap">
							{komik.synopsis}
						</p>

						<div className="mt-6 flex flex-wrap gap-3">
							{firstChapter && (
								<Link
									href={`/komik/${komik.slug}/baca/${firstChapter.id}`}
									className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background hover:bg-accent-ink transition-colors"
								>
									{t.detail.readFirst}
								</Link>
							)}
							{latestChapter && (
								<Link
									href={`/komik/${komik.slug}/baca/${latestChapter.id}`}
									className="rounded-full border border-line px-5 py-2.5 text-sm hover:border-accent hover:text-accent-ink transition-colors"
								>
									{t.detail.readLatest}
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
				<ChapterSort chapters={komik.chapters} slug={komik.slug} t={t} />
			</div>
		</div>
	);
}
