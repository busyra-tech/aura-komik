"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setLanguage(lang: "id" | "en") {
  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", lang, {
    path: "/",
    maxAge: 31536000, // 1 year
    sameSite: "lax",
  });
  
  // Revalidate the layout so the whole app updates its translations
  revalidatePath("/", "layout");
}
