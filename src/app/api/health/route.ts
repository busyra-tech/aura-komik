import { NextResponse } from "next/server";
import { db, ensureDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		await ensureDb();
		const res = await db.execute("SELECT 1 as connected;");
		return NextResponse.json({
			status: "ok",
			database: "Turso / LibSQL Connected",
			connected: res.rows.length > 0,
			timestamp: new Date().toISOString(),
		});
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);
		return NextResponse.json(
			{
				status: "error",
				message,
			},
			{ status: 500 }
		);
	}
}
