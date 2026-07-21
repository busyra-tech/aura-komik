"use client";

import { useState } from "react";
import ComicCard from "@/components/ComicCard";
import Link from "next/link";
import { Komik } from "@/types/komik";

interface FormatData {
  label: string;
  data: Komik[];
}

interface Props {
  formats: FormatData[];
}

export default function FormatFilter({ formats }: Props) {
  const [active, setActive] = useState(formats[0]?.label ?? "");

  const current = formats.find((f) => f.label === active);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6">
        {formats.map(({ label }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
              active === label
                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                : "bg-[#1e1e1e] text-foreground hover:bg-[#2a2a2a]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Horizontal scroll row */}
      {current && (
        <>
          <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {current.data.map((k) => (
              <div key={k.slug} className="w-35 shrink-0 sm:w-40">
                <ComicCard komik={k} />
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link
              href={`/cari?format=${current.label.toLowerCase()}`}
              className="text-xs text-muted hover:text-accent-ink transition-colors"
            >
              Lihat semua {current.label} →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
