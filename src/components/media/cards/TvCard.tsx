import type { TvShow } from "../../../types/Tv";
import MovieCard from "./MovieCard";
export default function TvCard({ show }: { show: TvShow }) {
  return <MovieCard item={show} mediaType="tv" />;
}
