import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Komik } from "@/types/komik";
import { Dictionary } from "@/lib/i18n/dictionaries";

function getShortTime(dateString: string | undefined, common: Dictionary["common"]) {
  if (!dateString) return "";
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${Math.max(1, minutes)} ${common.timeMins}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${common.timeHours}`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ${common.timeDays}`;
  const weeks = Math.floor(days / 7);
  if (days < 30) return `${weeks} ${common.timeWeeks}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${common.timeMonths}`;
  const years = Math.floor(days / 365);
  return `${years} ${common.timeYears}`;
}

function getFlag(type: string) {
  const t = type.toLowerCase();
  if (t.includes("manhwa")) return "🇰🇷";
  if (t.includes("manga")) return "🇯🇵";
  if (t.includes("manhua")) return "🇨🇳";
  return "";
}

export default function LatestUpdateCard({ komik, t }: { komik: Komik, t: Dictionary }) {
  const latestChapterNum = komik.latestChapterNumber;
  const timeAgo = getShortTime(komik.updatedAt, t.common);
  
  const isRecent =
    timeAgo.includes(t.common.timeHours) ||
    timeAgo.includes(t.common.timeMins) ||
    (timeAgo.includes(t.common.timeDays) && parseInt(timeAgo) <= 3);

  return (
    <div className="group flex flex-col h-full gap-2 relative">
      {/* Cover Image */}
      <Link href={`/komik/${komik.slug}`} className="relative shrink-0 aspect-[1/1.4] w-full overflow-hidden rounded-md border border-line bg-surface block">
        {komik.cover ? (
          <Image
            src={komik.cover}
            alt={komik.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
          />
        ) : null}

        {/* Top Left: UP badge */}
        <div className="absolute left-1.5 top-1.5 flex items-center gap-1 z-10">
          {isRecent && (
            <span className="flex items-center rounded bg-red-600 px-1 py-0.5 text-[10px] font-bold text-white shadow-sm leading-none">
              UP
            </span>
          )}
        </div>

        {/* Top Right: Flag */}
        {getFlag(komik.type) && (
          <span className="absolute right-1.5 top-1.5 flex h-[18px] w-[20px] items-center justify-center rounded-sm bg-white text-[12px] shadow-sm z-10 leading-none">
            {getFlag(komik.type)}
          </span>
        )}

        {/* Gradient overlay for top contrast */}
        <div className="absolute inset-x-0 top-0 h-12 bg-linear-to-b from-black/50 to-transparent pointer-events-none" />
      </Link>

      {/* Info Container */}
      <div className="flex flex-col grow">
        <Link href={`/komik/${komik.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground group-hover:text-accent-ink transition-colors mb-2">
            {komik.title}
          </h3>
        </Link>

        {/* Chapter Pills */}
        <div className="mt-auto flex flex-col gap-1.5">
          {komik.chapters && komik.chapters.length > 0 ? (
            komik.chapters.slice(0, 2).map((ch, index) => (
              <Link
                key={ch.id}
                href={`/komik/${komik.slug}/baca/${ch.id}`}
                className={`flex items-center justify-between rounded-[8px] bg-[#2a2a2a] px-3 py-2 text-[12px] font-semibold transition-colors border border-white/5 ${
                  index === 0
                    ? "text-white hover:bg-[#333]"
                    : "text-white/80 hover:bg-[#333]"
                }`}
              >
                <span>Chapter {ch.number}</span>
                {ch.releasedAt && (
                  <span className="text-white/70 font-normal">
                    {getShortTime(ch.releasedAt, t.common)}
                  </span>
                )}
              </Link>
            ))
          ) : (
            <div className="flex items-center justify-center rounded-[8px] bg-[#2a2a2a] px-3 py-2 text-[12px] text-white/50 border border-white/5">
              {t.home.noChapter}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
