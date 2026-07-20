import Link from "next/link";
import Image from "next/image";
import { Eye, Clock } from "lucide-react";
import { Komik } from "@/types/komik";

function getShortTime(dateString?: string) {
  if (!dateString) return "";
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${Math.max(1, minutes)}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (days < 30) return `${weeks}w`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}m`;
  const years = Math.floor(days / 365);
  return `${years}y`;
}

function formatViews(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return num.toString();
}

function getFlag(type: string) {
  const t = type.toLowerCase();
  if (t.includes("manhwa")) return "🇰🇷";
  if (t.includes("manga")) return "🇯🇵";
  if (t.includes("manhua")) return "🇨🇳";
  return "";
}

export default function ComicCard({ komik }: { komik: Komik }) {
  const latestChapter = komik.chapters?.[0];
  const latestChapterNum = latestChapter?.number ?? komik.latestChapterNumber;
  const timeAgo = getShortTime(latestChapter?.releasedAt || komik.updatedAt);
  
  // Consider recent if < 3 days old for the "UP" badge
  const isRecent =
    timeAgo.includes("h") ||
    timeAgo.includes("m") && !timeAgo.includes("mo") || // simple check, m here means minutes if no 'o' but we use m for both month and min, wait our month is 'm'. Let's just check raw hours.
    (Date.now() - new Date(latestChapter?.releasedAt || komik.updatedAt).getTime()) < 3 * 24 * 60 * 60 * 1000;

  return (
    <Link href={`/komik/${komik.slug}`} className="group flex flex-col h-full gap-2">
      {/* Cover Image */}
      <div className="relative shrink-0 aspect-[1/1.4] w-full overflow-hidden rounded-md border border-line bg-surface">
        {komik.cover ? (
          <Image
            src={komik.cover}
            alt={komik.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
          />
        ) : null}

        {/* Top Left: Time & UP badge */}
        <div className="absolute left-1.5 top-1.5 flex items-center gap-1 z-10">
          {timeAgo && (
            <span className="flex items-center gap-0.5 rounded bg-white px-1 py-0.5 text-[10px] font-bold text-violet-700 shadow-sm leading-none">
              <Clock size={10} strokeWidth={3} />
              {timeAgo}
            </span>
          )}
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
      </div>

      {/* Info Container */}
      <div className="flex flex-col grow pt-2">
        <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-foreground group-hover:text-accent-ink transition-colors mb-1">
          {komik.title}
        </h3>

        {/* Stats Pill */}
        <div className="mt-auto flex items-center justify-center gap-1.5 rounded-md bg-surface-2 px-2 py-1.5 text-[11px] font-semibold text-muted border border-line/50">
          <Eye size={12} className="text-muted/70" strokeWidth={2.5} />
          <span>{formatViews(komik.views || 0)}</span>
          {latestChapterNum != null && (
            <>
              <span className="w-1 h-1 rounded-full bg-line" />
              <span>CH.{latestChapterNum}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

