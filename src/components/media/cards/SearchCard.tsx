import { preload } from "../../../hooks/useTmdbPreload";
import { getMovie, getTv, getPerson } from "../../../services/api";
import { tmdbPoster } from "../../../utils/tmdbImage";
import CinemaCard from "./CinemaCard";
interface SearchItem {
  id: number; media_type: "movie" | "tv" | "person"; title?: string; name?: string;
  poster_path?: string | null; profile_path?: string | null; vote_average?: number;
  release_date?: string; first_air_date?: string; known_for_department?: string;
}
export default function SearchCard({ item }: { item: SearchItem }) {
  const type = item.media_type;
  function onIntent() {
    if (type === "movie") preload(() => getMovie(item.id));
    else if (type === "tv") preload(() => getTv(item.id));
    else if (type === "person") preload(() => getPerson(item.id));
  }
  const path = item.poster_path || item.profile_path;
  const kind = type === "movie" ? "Film" : type === "tv" ? "Series" : "Person";
  const year = (item.release_date || item.first_air_date)?.slice(0, 4);
  return <CinemaCard to={`/${type}/${item.id}`} title={item.title || item.name || "Untitled"}
    image={path ? tmdbPoster(path, "md") : "/no-image.svg"} kind={kind}
    detail={type === "person" ? item.known_for_department || "View profile" : [year, kind].filter(Boolean).join(" · ")}
    rating={item.vote_average} onIntent={onIntent} />;
}
