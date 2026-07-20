import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Komik } from "@/types/komik";

export type StoredKomik = {
  slug: string;
  title: string;
  cover: string;
  type: string;
  latestChapterNumber?: number;
};

export type HistoryItem = StoredKomik & {
  chapterId: string;
  chapterNumber: number;
  readAt: string;
};

interface LibraryState {
  bookmarks: StoredKomik[];
  readlist: StoredKomik[];
  history: HistoryItem[];
  readChapters: Record<string, boolean>;

  // Actions
  addBookmark: (komik: Komik) => void;
  removeBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;

  addReadlist: (komik: Komik) => void;
  removeReadlist: (slug: string) => void;
  isReadlisted: (slug: string) => boolean;

  addToHistory: (komik: Komik, chapterId: string, chapterNumber: number) => void;
  removeFromHistory: (slug: string) => void;

  markChapterRead: (chapterId: string) => void;
  isChapterRead: (chapterId: string) => boolean;
}

const extractStoredKomik = (komik: Komik): StoredKomik => ({
  slug: komik.slug,
  title: komik.title,
  cover: komik.cover || "",
  type: komik.type,
  latestChapterNumber: komik.latestChapterNumber,
});

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      readlist: [],
      history: [],
      readChapters: {},

      addBookmark: (komik) => {
        const current = get().bookmarks;
        if (!current.some((b) => b.slug === komik.slug)) {
          set({ bookmarks: [...current, extractStoredKomik(komik)] });
        }
      },
      removeBookmark: (slug) => {
        set({ bookmarks: get().bookmarks.filter((b) => b.slug !== slug) });
      },
      isBookmarked: (slug) => get().bookmarks.some((b) => b.slug === slug),

      addReadlist: (komik) => {
        const current = get().readlist;
        if (!current.some((r) => r.slug === komik.slug)) {
          set({ readlist: [...current, extractStoredKomik(komik)] });
        }
      },
      removeReadlist: (slug) => {
        set({ readlist: get().readlist.filter((r) => r.slug !== slug) });
      },
      isReadlisted: (slug) => get().readlist.some((r) => r.slug === slug),

      addToHistory: (komik, chapterId, chapterNumber) => {
        const currentHistory = get().history.filter((h) => h.slug !== komik.slug);
        const newItem: HistoryItem = {
          ...extractStoredKomik(komik),
          chapterId,
          chapterNumber,
          readAt: new Date().toISOString(),
        };
        // Add to top of history
        set({ history: [newItem, ...currentHistory].slice(0, 50) }); // keep latest 50
      },
      removeFromHistory: (slug) => {
        set({ history: get().history.filter((h) => h.slug !== slug) });
      },

      markChapterRead: (chapterId) => {
        set((state) => ({
          readChapters: { ...state.readChapters, [chapterId]: true },
        }));
      },
      isChapterRead: (chapterId) => !!get().readChapters[chapterId],
    }),
    {
      name: "rakkomik-library-storage", // local storage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
