import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
	getKomikBySlug,
	getChapterDetail,
	getChapterImageUrls,
} from "@/lib/api";
import ReaderTapOverlay from "@/components/ReaderTapOverlay";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string; chapter: string }>;
}): Promise<Metadata> {
	const { slug, chapter: chapterId } = await params;
	const [komik, chapterDetail] = await Promise.all([
		getKomikBySlug(slug).catch(() => null),
		getChapterDetail(chapterId).catch(() => null),
	]);

	if (!komik || !chapterDetail) {
		return {
			title: "Baca Komik — AuraKomik",
		};
	}

	const chNum = chapterDetail.chapter_number;
	const title = `Baca ${komik.title} Chapter ${chNum} — AuraKomik`;
	const desc = `Baca komik ${komik.title} Chapter ${chNum} online bahasa Indonesia gratis di AuraKomik.`;

	return {
		title,
		description: desc,
		openGraph: {
			title,
			description: desc,
			images: komik.cover ? [{ url: komik.cover }] : [],
		},
	};
}

export default async function ReaderPage({
	params,
}: {
	params: Promise<{ slug: string; chapter: string }>;
}) {
	const { slug, chapter: chapterId } = await params;

	const [komik, chapterDetail, t] = await Promise.all([
		getKomikBySlug(slug),
		getChapterDetail(chapterId),
		getDictionary(),
	]);

	if (!komik || !chapterDetail) notFound();

	const images = getChapterImageUrls(chapterDetail);

	return (
		<div className="relative min-h-screen">
			<ReaderTapOverlay
				komik={komik}
				chapters={komik.chapters}
				slug={komik.slug}
				currentChapterId={chapterId}
				prevChapterId={chapterDetail.prev_chapter_id}
				nextChapterId={chapterDetail.next_chapter_id}
				chapterNumber={chapterDetail.chapter_number}
				t={t.reader}
			/>

			{/* Pages */}
			<div className="flex flex-col items-center">
				{images.map((url, i) => (
					<div key={i} className="relative w-full max-w-3xl mx-auto">
						<img
							src={url}
							alt={`Halaman ${i + 1}`}
							className="w-full h-auto block"
							loading={i < 3 ? "eager" : "lazy"}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
