import { cookies } from "next/headers";
import { dictionaries } from "./dictionaries";

export type Locale = "id" | "en";

export async function getLanguage(): Promise<Locale> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("NEXT_LOCALE")?.value;
  if (lang === "en") return "en";
  return "id";
}

export async function getDictionary() {
  const lang = await getLanguage();
  return dictionaries[lang];
}
