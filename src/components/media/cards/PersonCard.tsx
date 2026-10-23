import { preload } from "../../../hooks/useTmdbPreload";
import { getPerson } from "../../../services/api";
import { tmdbPoster } from "../../../utils/tmdbImage";
import type { CastMember } from "../../../types/Shared";
import CinemaCard from "./CinemaCard";
export default function PersonCard({ person }: { person: CastMember }) {
  function onIntent() { if (person.id) preload(() => getPerson(person.id)); }
  return <CinemaCard to={`/person/${person.id}`} title={person.name || "Unknown performer"}
    image={person.profile_path ? tmdbPoster(person.profile_path, "md") : "/no-image.svg"}
    kind="Cast" detail={person.character || person.known_for_department || "View profile"}
    className="cinema-card--person" onIntent={onIntent} />;
}
