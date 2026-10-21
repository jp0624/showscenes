// src/components/media/lists/MovieGrid.tsx
import MovieCard from "../cards/MovieCard";

interface Props {
	movies: any[];
 mediaType?: "movie" | "tv";
	className?: string;
}

export default function MovieGrid({ movies, mediaType = "movie", className = "" }: Props) {
	if (!Array.isArray(movies)) return null;

	return (
		<div
			className={
				"grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 " + className
			}
		>
			{movies.map((m) => (m ? <MovieCard key={m.id} item={m} mediaType={mediaType} /> : null))}
		</div>
	);
}

