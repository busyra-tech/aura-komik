"use client";

import { useTransition } from "react";
import { setLanguage } from "@/lib/i18n/actions";

export default function LanguageSwitcher({ currentLang }: { currentLang: "id" | "en" }) {
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const newLang = currentLang === "id" ? "en" : "id";
    startTransition(() => {
      setLanguage(newLang);
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:border-accent transition-colors disabled:opacity-50"
      title="Ubah Bahasa / Change Language"
    >
      <span className={currentLang === "id" ? "text-foreground font-bold" : ""}>ID</span>
      <span className="text-line">|</span>
      <span className={currentLang === "en" ? "text-foreground font-bold" : ""}>EN</span>
    </button>
  );
}
