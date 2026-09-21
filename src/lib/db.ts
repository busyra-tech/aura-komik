import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL || "file:aurakomik.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient({
	url,
	authToken,
});

let isInitialized = false;

/**
 * Otomatis inisialisasi tabel SQLite / Turso jika belum ada
 */
export async function ensureDb() {
	if (isInitialized) return;
	try {
		await db.batch([
			`CREATE TABLE IF NOT EXISTS bookmarks (
				id TEXT PRIMARY KEY,
				user_id TEXT NOT NULL,
				slug TEXT NOT NULL,
				title TEXT NOT NULL,
				cover TEXT,
				type TEXT,
				latest_chapter TEXT,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				UNIQUE(user_id, slug)
			);`,
			`CREATE TABLE IF NOT EXISTS reading_history (
				id TEXT PRIMARY KEY,
				user_id TEXT NOT NULL,
				slug TEXT NOT NULL,
				title TEXT NOT NULL,
				cover TEXT,
				chapter_id TEXT NOT NULL,
				chapter_number TEXT NOT NULL,
				read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				UNIQUE(user_id, slug)
			);`,
			`CREATE TABLE IF NOT EXISTS manga_cache (
				slug TEXT PRIMARY KEY,
				data TEXT NOT NULL,
				updated_at INTEGER NOT NULL
			);`,
			`CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);`,
			`CREATE INDEX IF NOT EXISTS idx_history_user ON reading_history(user_id);`,
		]);
		isInitialized = true;
	} catch (err) {
		console.error("Turso Database Init Warning:", err);
	}
}

/**
 * Cache helper untuk menyimpan & mengambil respon API di Turso
 */
export async function getCachedManga<T>(key: string): Promise<T | null> {
	try {
		await ensureDb();
		const res = await db.execute({
			sql: "SELECT data, updated_at FROM manga_cache WHERE slug = ?",
			args: [key],
		});
		if (res.rows.length === 0) return null;
		const row = res.rows[0];
		return JSON.parse(row.data as string) as T;
	} catch {
		return null;
	}
}

export async function setCachedManga(key: string, data: unknown): Promise<void> {
	try {
		await ensureDb();
		await db.execute({
			sql: `INSERT INTO manga_cache (slug, data, updated_at) 
			      VALUES (?, ?, ?) 
			      ON CONFLICT(slug) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
			args: [key, JSON.stringify(data), Date.now()],
		});
	} catch (err) {
		console.error("Failed to save to Turso cache:", err);
	}
}
