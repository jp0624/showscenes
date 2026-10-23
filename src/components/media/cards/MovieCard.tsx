import type { Movie } from "../../../types/Movie";
import type { TvShow } from "../../../types/Tv";
import { tmdbPoster } from "../../../utils/tmdbImage";
import { preload } from "../../../hooks/useTmdbPreload";
import { getMovie, getTv } from "../../../services/api";
import CinemaCard from "./CinemaCard";

interface Props { item: Movie | TvShow; mediaType?: "movie" | "tv"; className?: string }
export default function MovieCard({ item, mediaType = "movie", className = "" }: Props) {
  const title = mediaType === "movie" ? (item as Movie).title || item.name || "Untitled film" : item.name || "Untitled series";
  const date = mediaType === "movie" ? (item as Movie).release_date : item.first_air_date;
  const kind = mediaType === "movie" ? "Film" : "Series";
  function onIntent() { if (item.id) preload(() => mediaType === "tv" ? getTv(item.id) : getMovie(item.id)); }
  return <CinemaCard to={`/${mediaType}/${item.id}`} title={title}
    image={item.poster_path ? tmdbPoster(item.poster_path, "md") : "/no-image.svg"}
    kind={kind} detail={[date?.slice(0, 4), kind].filter(Boolean).join(" · ")}
    rating={item.vote_average} className={className} onIntent={onIntent} />;
}
