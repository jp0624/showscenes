// src/pages/Home/HomeGrid.tsx
import { useEffect, useState } from "react";

import type { Movie } from "../../types/Movie";
import type { TvShow } from "../../types/Tv";

import {
	getPopular,
	getPopularTv,
	searchMovies,
	searchTv,
} from "../../services/api";

import MovieGrid from "../../components/media/lists/MovieGrid";
import MovieSkeleton from "../../components/media/MovieSkeleton";

import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import type { Mode } from "./HomeHero";

interface HomeGridProps {
	mode: Mode;
	query: string; // debounced query
}

export default function HomeGrid({ mode, query }: HomeGridProps) {
	const [error,setError]=useState('');
	const [items, setItems] = useState<(Movie | TvShow)[]>([]);
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

	// Reset when mode or query changes
	useEffect(() => {
		setItems([]);
		setPage(1);
		setHasMore(true);
		setIsInitialLoadDone(false);
	}, [mode, query]);

	// Load grid data
	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			if (!hasMore) return;

			setIsLoading(true);setError('');

			try {
				const currentPage = page;
				let data: { results: (Movie | TvShow)[] } = { results: [] };

				const searching = !!query;

				if (mode === "movie") {
					data = searching
						? await searchMovies(query, currentPage)
						: await getPopular(currentPage);
				} else {
					data = searching
						? await searchTv(query, currentPage)
						: await getPopularTv(currentPage);
				}

				if (cancelled) return;

				const results = data.results ?? [];

				setItems((prev) => {
					const merged = currentPage === 1 ? results : [...prev, ...results];
					const seen = new Set<number>();
					return merged.filter((m: any) => {
						if (!m?.id || seen.has(m.id)) return false;
						seen.add(m.id);
						return true;
					});
				});

				setHasMore(results.length > 0);

				if (!isInitialLoadDone) setIsInitialLoadDone(true);
			} catch (err) {
				// Avoid killing the UI if TMDB throws (e.g. 404, quota, etc.)
				console.error("[HomeGrid] Failed to load items:", err);if(!cancelled)setError("We couldn’t load these titles. Please try again.");
				if(!cancelled)setHasMore(false);
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		};

		void load();
		return () => {
			cancelled = true;
		};
	}, [page, mode, query]);

	// Infinite scroll
	useInfiniteScroll(() => {
		if (!isInitialLoadDone) return;
		if (!isLoading && hasMore) {
			setPage((p) => p + 1);
		}
	});

	// Render
	if (items.length === 0 && isLoading) {
		return (
			<>
				<div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
					{Array.from({ length: 10 }).map((_, i) => (
						<MovieSkeleton key={i} />
					))}
				</div>
				<div id="infinite-trigger" className="h-12" />
			</>
		);
	}

	return (
		<>
			<div aria-live="polite">{error&&<p role="alert" className="mt-8 rounded-xl border border-token bg-surface p-5">{error} <button className="underline" onClick={()=>window.location.reload()}>Retry</button></p>}{!error&&!isLoading&&items.length===0&&<p className="py-12 text-muted">No titles found. Try another search.</p>}</div>
			<MovieGrid movies={items} mediaType={mode} className="mt-6" />

			{isLoading && items.length > 0 && (
				<div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
					{Array.from({ length: 5 }).map((_, i) => (
						<MovieSkeleton key={`more-${i}`} />
					))}
				</div>
			)}

			{/* Infinite scroll anchor (used by useInfiniteScroll) */}
			<div id="infinite-trigger" className="h-12" />
		</>
	);
}

