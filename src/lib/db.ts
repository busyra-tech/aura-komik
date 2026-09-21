import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL || "file:aurakomik.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient({
	url,
	authToken,
});

/**
 * Inisialisasi tabel SQLite / Turso jika belum ada
 */
export async function initDb() {
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
}
