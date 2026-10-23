import { preload } from "../../../hooks/useTmdbPreload";
import { getTvSeason } from "../../../services/api";
import { tmdbPoster } from "../../../utils/tmdbImage";
import type { Season } from "../../../types/Tv";
import CinemaCard from "./CinemaCard";
export default function SeasonCard({ showId, season }: { showId: number; season: Season }) {
  const title = season.name || `Season ${season.season_number}`;
  function onIntent() { preload(() => getTvSeason(showId, season.season_number)); }
  const episodes = season.episode_count;
  return <CinemaCard to={`/tv/${showId}/season/${season.season_number}`} title={title}
    image={season.poster_path ? tmdbPoster(season.poster_path, "md") : "/no-image.svg"}
    kind="Season" detail={episodes != null ? `${episodes} episode${episodes === 1 ? "" : "s"}` : season.air_date?.slice(0, 4)} onIntent={onIntent} />;
}
