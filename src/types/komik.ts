export type Genre = string;

export type Chapter = {
	id: string;
	number: number;
	title: string;
	releasedAt: string; // ISO date
	thumbnailUrl?: string;
};

export type Komik = {
	slug: string; // manga_id (UUID)
	title: string;
	altTitle?: string;
	cover: string; // cover_portrait_url or cover_image_url
	synopsis: string;
	genres: Genre[];
	status: "Ongoing" | "Tamat" | "Hiatus";
	type: string; // Format taxonomy name
	author: string;
	rating: number;
	views: number;
	updatedAt: string;
	chapters: Chapter[];
	latestChapterId?: string;
	latestChapterNumber?: number;
};

// Raw API types from api.shngm.io/v1
export type ApiManga = {
	manga_id: string;
	title: string;
	alternative_title: string;
	description: string;
	release_year: string;
	status: number; // 1=ongoing, 2=completed, 3=hiatus
	cover_image_url: string;
	cover_portrait_url: string;
	view_count: number;
	user_rate: number;
	latest_chapter_id: string;
	latest_chapter_number: number;
	latest_chapter_time: string;
	country_id: string;
	bookmark_count: number;
	updated_at: string;
	created_at: string;
	taxonomy?: {
		Genre?: { name: string; slug: string }[];
		Format?: { name: string; slug: string }[];
		Author?: { name: string; slug: string }[];
		Artist?: { name: string; slug: string }[];
		Type?: { name: string; slug: string }[];
	};
	chapters?: {
		chapter_id: string;
		chapter_number: number;
		created_at: string;
	}[];
};

export type ApiChapter = {
	chapter_id: string;
	manga_id: string;
	chapter_title: string;
	chapter_number: number;
	thumbnail_image_url: string;
	view_count: number;
	release_date: string;
};

export type ApiChapterDetail = {
	chapter_id: string;
	manga_id: string;
	chapter_number: number;
	chapter_title: string;
	base_url: string;
	base_url_low: string;
	chapter: {
		path: string;
		data: string[];
	};
	prev_chapter_id: string | null;
	prev_chapter_number: number | null;
	next_chapter_id: string | null;
	next_chapter_number: number | null;
	release_date: string;
};

export type ApiResponse<T> = {
	retcode: number;
	message: string;
	meta: {
		page?: number;
		page_size?: number;
		total_page?: number;
		total_record?: number;
	};
	data: T;
};
