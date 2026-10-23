import { memo } from "react";
import type { Episode } from "../../../types/Tv";
import { tmdbBackdrop } from "../../../utils/tmdbImage";
import CinemaCard from "./CinemaCard";
interface Props { showId: number; episode: Episode; seasonNumber: number; className?: string }
function EpisodeCard({ showId, episode, seasonNumber, className = "" }: Props) {
  return <CinemaCard to={`/tv/${showId}/season/${seasonNumber}/episode/${episode.episode_number}`}
    title={episode.name || `Episode ${episode.episode_number}`}
    image={episode.still_path ? tmdbBackdrop(episode.still_path, "md") : "/no-image.svg"}
    kind={`Episode ${episode.episode_number}`} rating={episode.vote_average}
    detail={[episode.runtime ? `${episode.runtime} min` : "", episode.air_date].filter(Boolean).join(" · ")}
    className={`cinema-card--still ${className}`} />;
}
export default memo(EpisodeCard);
