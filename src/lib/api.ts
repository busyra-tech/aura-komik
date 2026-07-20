import {
	ApiManga,
	ApiChapter,
	ApiChapterDetail,
	ApiResponse,
	Komik,
	Chapter,
} from "@/types/komik";

const BASE = "https://api.shngm.io/v1";

const HEADERS = {
	Origin: "https://g.shinigami.asia",
	Referer: "https://g.shinigami.asia/",
};

async function apiFetch<T>(path: string): Promise<T> {
	const res = await fetch(`${BASE}${path}`, {
		headers: HEADERS,
		next: { revalidate: 300 }, // 5 min cache
	});
	if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
	const json: ApiResponse<T> = await res.json();
	return json.data;
}

// Map status number → string
function mapStatus(s: number): Komik["status"] {
	if (s === 2) return "Tamat";
	if (s === 3) return "Hiatus";
	return "Ongoing";
}

export function mangaToKomik(m: ApiManga, chapters: Chapter[] = []): Komik {
	const genres = m.taxonomy?.Genre?.map((g) => g.name) ?? [];
	const format = m.taxonomy?.Format?.[0]?.name ?? "Manga";
	const author = m.taxonomy?.Author?.[0]?.name ?? "Unknown";
	const cover = m.cover_portrait_url || m.cover_image_url || "";
	
	// Map internal chapters if API returned them
	const internalChapters: Chapter[] = m.chapters ? m.chapters.map(c => ({
		id: c.chapter_id,
		number: c.chapter_number,
		title: `Chapter ${c.chapter_number}`,
		releasedAt: c.created_at,
	})) : chapters;

	return {
		slug: m.manga_id,
		title: m.title,
		altTitle: m.alternative_title || undefined,
		cover,
		synopsis: m.description,
		genres,
		status: mapStatus(m.status),
		type: format,
		author,
		rating: m.user_rate,
		views: m.view_count,
		updatedAt: m.updated_at,
		chapters: internalChapters,
		latestChapterId: m.latest_chapter_id,
		latestChapterNumber: m.latest_chapter_number,
	};
}

function apiChapterToChapter(c: ApiChapter): Chapter {
	return {
		id: c.chapter_id,
		number: c.chapter_number,
		title: c.chapter_title || `Chapter ${c.chapter_number}`,
		releasedAt: c.release_date,
		thumbnailUrl: c.thumbnail_image_url,
	};
}

// ── List / search ──────────────────────────────────────────────────────────

export async function getLatestUpdates(page = 1, pageSize = 12) {
	const data = await apiFetch<ApiManga[]>(
		`/manga/list?type=project&page=${page}&page_size=${pageSize}&is_update=true&sort=latest&sort_order=desc`,
	);
	return (data || []).map((m) => mangaToKomik(m));
}

export async function getByFormat(
	format: "manga" | "manhwa" | "manhua",
	pageSize = 10,
) {
	const data = await apiFetch<ApiManga[]>(
		`/manga/list?page=1&page_size=${pageSize}&sort=latest&sort_order=desc&format=${format}`,
	);
	return (data || []).map((m) => mangaToKomik(m));
}

export async function getPopular(
	filter: "daily" | "weekly" | "all" = "daily",
	pageSize = 12,
) {
	const data = await apiFetch<ApiManga[]>(
		`/manga/top?filter=${filter}&page=1&page_size=${pageSize}`,
	);
	return (data || []).map((m) => mangaToKomik(m));
}

export async function getAllKomik(params?: {
	page?: number;
	pageSize?: number;
	genre?: string;
	format?: string;
	sort?: "latest" | "popular";
}) {
	const p = params ?? {};
	const page = p.page ?? 1;
	const pageSize = p.pageSize ?? 24;
	const sort = p.sort === "popular" ? "bookmark" : "latest"; // ponytail: API only supports latest/bookmark
	let qs = `/manga/list?page=${page}&page_size=${pageSize}&sort=${sort}&sort_order=desc`;
	if (p.genre)
		qs += `&genre_include=${encodeURIComponent(p.genre.toLowerCase())}&genre_include_mode=or`;
	if (p.format) qs += `&format=${encodeURIComponent(p.format)}`;

	const res = await fetch(`${BASE}${qs}`, {
		headers: HEADERS,
		next: { revalidate: 300 },
	});
	const json: ApiResponse<ApiManga[]> = await res.json();
	return {
		data: (json.data || []).map((m) => mangaToKomik(m)),
		totalPage: json.meta?.total_page ?? 1,
		totalRecord: json.meta?.total_record ?? 0,
	};
}

export async function searchKomik(q: string, page = 1, pageSize = 24) {
	const res = await fetch(
		`${BASE}/manga/list?page=${page}&page_size=${pageSize}&sort=latest&sort_order=desc&q=${encodeURIComponent(q)}`,
		{ headers: HEADERS, next: { revalidate: 60 } },
	);
	const json: ApiResponse<ApiManga[]> = await res.json();
	return {
		data: (json.data || []).map((m) => mangaToKomik(m)),
		totalPage: json.meta?.total_page ?? 1,
	};
}

export type SortBy = "latest" | "popular" | "rating" | "bookmark";
export type SortOrder = "asc" | "desc";

// Map friendly sort key → API sort param + default order
const SORT_MAP: Record<SortBy, { sort: string; defaultOrder: SortOrder }> = {
	latest: { sort: "latest", defaultOrder: "desc" },
	popular: { sort: "rank", defaultOrder: "asc" }, // rank asc = most popular first
	rating: { sort: "rating", defaultOrder: "desc" },
	bookmark: { sort: "bookmark", defaultOrder: "desc" },
};

export async function searchKomikAdvanced(params: {
	q?: string;
	genre?: string;
	format?: string;
	status?: string;
	sortBy?: SortBy;
	sortOrder?: SortOrder;
	page?: number;
	pageSize?: number;
}) {
	const page = params.page ?? 1;
	const pageSize = params.pageSize ?? 20;
	const mapped = SORT_MAP[params.sortBy ?? "latest"];
	const sort = mapped.sort;
	const sortOrder = params.sortOrder ?? mapped.defaultOrder;
	let qs = `/manga/list?page=${page}&page_size=${pageSize}&genre_include_mode=or&genre_exclude_mode=or&sort=${sort}&sort_order=${sortOrder}`;
	if (params.q) qs += `&q=${encodeURIComponent(params.q)}`;
	if (params.genre)
		qs += `&genre_include=${encodeURIComponent(params.genre.toLowerCase())}`;
	if (params.format) qs += `&format=${encodeURIComponent(params.format)}`;
	if (params.status) qs += `&status=${encodeURIComponent(params.status)}`;
	const res = await fetch(`${BASE}${qs}`, {
		headers: HEADERS,
		next: { revalidate: 60 },
	});
	const json: ApiResponse<ApiManga[]> = await res.json();
	return {
		data: (json.data || []).map((m) => mangaToKomik(m)),
		totalPage: json.meta?.total_page ?? 1,
		totalRecord: json.meta?.total_record ?? 0,
	};
}

export async function getAllGenres(): Promise<
	{ name: string; slug: string }[]
> {
	try {
		const data =
			await apiFetch<{ name: string; slug: string }[]>("/genre/list");
		return data || [];
	} catch {
		return [];
	}
}

// ── Detail ─────────────────────────────────────────────────────────────────

async function fetchAllChapters(mangaId: string): Promise<Chapter[]> {
	// Fetch first page to get total_page, then fetch remaining pages in parallel
	const firstRes = await fetch(
		`${BASE}/chapter/${mangaId}/list?page=1&page_size=100&sort_by=chapter_number&sort_order=desc`,
		{ headers: HEADERS, next: { revalidate: 300 } },
	);
	const firstJson: ApiResponse<ApiChapter[]> = await firstRes.json();
	const totalPage = firstJson.meta?.total_page ?? 1;
	const allChapters: ApiChapter[] = [...(firstJson.data || [])];

	if (totalPage > 1) {
		const rest = await Promise.all(
			Array.from({ length: totalPage - 1 }, (_, i) =>
				fetch(
					`${BASE}/chapter/${mangaId}/list?page=${i + 2}&page_size=100&sort_by=chapter_number&sort_order=desc`,
					{ headers: HEADERS, next: { revalidate: 300 } },
				).then((r) => r.json() as Promise<ApiResponse<ApiChapter[]>>),
			),
		);
		for (const r of rest) allChapters.push(...(r.data || []));
	}

	return allChapters.map(apiChapterToChapter);
}

export async function getKomikBySlug(mangaId: string): Promise<Komik | null> {
	try {
		const [detail, chapters] = await Promise.all([
			apiFetch<ApiManga>(`/manga/detail/${mangaId}`),
			fetchAllChapters(mangaId),
		]);
		return mangaToKomik(detail, chapters);
	} catch {
		return null;
	}
}

// ── Chapter reader ─────────────────────────────────────────────────────────

export async function getChapterDetail(
	chapterId: string,
): Promise<ApiChapterDetail | null> {
	try {
		return await apiFetch<ApiChapterDetail>(`/chapter/detail/${chapterId}`);
	} catch {
		return null;
	}
}

export function getChapterImageUrls(detail: ApiChapterDetail): string[] {
	const base = detail.base_url;
	const path = detail.chapter.path;
	return detail.chapter.data.map((file) => `${base}${path}${file}`);
}

// ── Chapter list helpers ───────────────────────────────────────────────────

export async function getChaptersByMangaId(
	mangaId: string,
	page = 1,
	pageSize = 100,
) {
	const data = await apiFetch<ApiChapter[]>(
		`/chapter/${mangaId}/list?page=${page}&page_size=${pageSize}&sort_by=chapter_number&sort_order=desc`,
	);
	return (data || []).map(apiChapterToChapter);
}
