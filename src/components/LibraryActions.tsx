"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookOpen } from "lucide-react";
import { useLibraryStore } from "@/lib/store";
import { Komik } from "@/types/komik";

export default function LibraryActions({ komik }: { komik: Komik }) {
  const store = useLibraryStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="flex gap-2 animate-pulse mt-4"><div className="h-10 w-32 bg-surface rounded-full"></div></div>;

  const isBookmarked = store.isBookmarked(komik.slug);
  const isReadlisted = store.isReadlisted(komik.slug);

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <button
        onClick={() => {
          if (isBookmarked) store.removeBookmark(komik.slug);
          else store.addBookmark(komik);
        }}
        className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors border ${
          isBookmarked
            ? "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20"
            : "border-line text-foreground hover:border-accent hover:text-accent-ink"
        }`}
      >
        <Bookmark size={16} className={isBookmarked ? "fill-accent" : ""} />
        {isBookmarked ? "Tersimpan" : "Simpan ke Bookmark"}
      </button>

      <button
        onClick={() => {
          if (isReadlisted) store.removeReadlist(komik.slug);
          else store.addReadlist(komik);
        }}
        className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors border ${
          isReadlisted
            ? "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20"
            : "border-line text-foreground hover:border-accent hover:text-accent-ink"
        }`}
      >
        <BookOpen size={16} className={isReadlisted ? "fill-accent" : ""} />
        {isReadlisted ? "Di Readlist" : "Tambah Readlist"}
      </button>
    </div>
  );
}
