export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <div className="font-display text-xl text-foreground tracking-wide">AURAKOMIK</div>
            <p className="mt-2 max-w-sm">
              Platform baca komik online modern. Semua judul dan sampul di sini dihimpun
              untuk kemudahan navigasi pembaca manga, manhwa, dan manhua.
            </p>
          </div>
          <div className="flex gap-10">
            <div>
              <div className="mb-2 font-medium text-foreground">Jelajah</div>
              <ul className="space-y-1">
                <li>Daftar Komik</li>
                <li>Genre</li>
                <li>Terpopuler</li>
              </ul>
            </div>
            <div>
              <div className="mb-2 font-medium text-foreground">Info</div>
              <ul className="space-y-1">
                <li>Tentang</li>
                <li>Kontak</li>
                <li>DMCA</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-line pt-4 text-xs">
          © {new Date().getFullYear()}{" "}AuraKomik. Ditenagai oleh Next.js &amp; Busyra Tech.
        </div>
      </div>
    </footer>
  );
}
