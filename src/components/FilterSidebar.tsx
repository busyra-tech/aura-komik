"use client";

import { Suspense, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Genre {
	name: string;
	slug: string;
}

interface FilterSidebarProps {
	genres: Genre[];
}

function FilterSidebarContent({ genres }: FilterSidebarProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [openSection, setOpenSection] = useState<string | null>("Genre");
	const [genreSearch, setGenreSearch] = useState("");

	const currentGenre = searchParams.get("genre");

	const filteredGenres = genres.filter((g) =>
		g.name.toLowerCase().includes(genreSearch.toLowerCase()),
	);

	const handleGenreClick = (slug: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (currentGenre === slug) {
			params.delete("genre");
		} else {
			params.set("genre", slug);
		}
		router.push(`/cari?${params.toString()}`);
	};

	const toggleSection = (section: string) => {
		setOpenSection(openSection === section ? null : section);
	};

	return (
		<div className="w-full md:w-64 shrink-0 space-y-4">
			{/* Genre Section */}
			<div className="rounded-lg bg-surface p-4 border border-line">
				<button
					onClick={() => toggleSection("Genre")}
					className="flex w-full items-center justify-between font-bold text-lg"
				>
					Genre
					{openSection === "Genre" ? (
						<ChevronUp size={20} />
					) : (
						<ChevronDown size={20} />
					)}
				</button>

				{openSection === "Genre" && (
					<div className="mt-4 space-y-4">
						<div className="relative">
							<input
								type="text"
								placeholder="Search Genre"
								value={genreSearch}
								onChange={(e) => setGenreSearch(e.target.value)}
								className="w-full rounded-md bg-background px-3 py-2 pl-9 text-sm border border-line focus:border-accent focus:outline-none"
							/>
							<Search
								size={16}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
							/>
						</div>

						<div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto custom-scrollbar">
							{filteredGenres.map((g) => (
								<button
									key={g.slug}
									onClick={() => handleGenreClick(g.slug)}
									className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
										currentGenre === g.slug
											? "bg-accent text-accent-ink"
											: "bg-background border border-line text-muted hover:text-foreground"
									}`}
								>
									{g.name}
								</button>
							))}
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Inclusion mode</label>
							<div className="relative">
								<select className="w-full appearance-none rounded-md bg-background px-3 py-2 text-sm border border-line focus:border-accent focus:outline-none">
									<option>And</option>
									<option>Or</option>
								</select>
								<ChevronDown
									size={16}
									className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Exclusion mode</label>
							<div className="relative">
								<select className="w-full appearance-none rounded-md bg-background px-3 py-2 text-sm border border-line focus:border-accent focus:outline-none">
									<option>And</option>
									<option>Or</option>
								</select>
								<ChevronDown
									size={16}
									className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted"
								/>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Other Sections (Mock) */}
			{["Format", "Type", "Status", "Author"].map((section) => (
				<div
					key={section}
					className="rounded-lg bg-surface p-4 border border-line"
				>
					<button
						onClick={() => toggleSection(section)}
						className="flex w-full items-center justify-between font-bold text-lg"
					>
						{section}
						{openSection === section ? (
							<ChevronUp size={20} />
						) : (
							<ChevronDown size={20} />
						)}
					</button>
					{openSection === section && (
						<div className="mt-4 text-sm text-muted">
							Filter {section.toLowerCase()} belum tersedia.
						</div>
					)}
				</div>
			))}
		</div>
	);
}

export default function FilterSidebar(props: FilterSidebarProps) {
	return (
		<Suspense
			fallback={
				<div className="w-full md:w-64 shrink-0 animate-pulse bg-surface rounded-lg h-96"></div>
			}
		>
			<FilterSidebarContent {...props} />
		</Suspense>
	);
}
