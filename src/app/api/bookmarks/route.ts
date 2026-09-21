import { NextRequest, NextResponse } from "next/server";
import { db, ensureDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
	try {
		await ensureDb();
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		if (!userId) {
			return NextResponse.json({ error: "userId is required" }, { status: 400 });
		}

		const res = await db.execute({
			sql: "SELECT * FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC",
			args: [userId],
		});

		return NextResponse.json({ bookmarks: res.rows });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		await ensureDb();
		const body = await req.json();
		const { userId, slug, title, cover, type, latestChapter } = body;

		if (!userId || !slug || !title) {
			return NextResponse.json(
				{ error: "userId, slug, and title are required" },
				{ status: 400 }
			);
		}

		const id = `${userId}_${slug}`;
		await db.execute({
			sql: `INSERT INTO bookmarks (id, user_id, slug, title, cover, type, latest_chapter)
			      VALUES (?, ?, ?, ?, ?, ?, ?)
			      ON CONFLICT(user_id, slug) DO UPDATE SET 
			        title = excluded.title,
			        cover = excluded.cover,
			        type = excluded.type,
			        latest_chapter = excluded.latest_chapter`,
			args: [id, userId, slug, title, cover || "", type || "Manga", latestChapter || ""],
		});

		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	try {
		await ensureDb();
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		const slug = searchParams.get("slug");

		if (!userId || !slug) {
			return NextResponse.json(
				{ error: "userId and slug are required" },
				{ status: 400 }
			);
		}

		await db.execute({
			sql: "DELETE FROM bookmarks WHERE user_id = ? AND slug = ?",
			args: [userId, slug],
		});

		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
