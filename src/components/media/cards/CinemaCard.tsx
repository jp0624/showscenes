import type { SyntheticEvent } from "react";
import { Link } from "react-router-dom";

interface Props {
  to: string;
  title: string;
  image: string;
  kind: string;
  detail?: string;
  rating?: number;
  className?: string;
  onIntent?: () => void;
}

export default function CinemaCard({ to, title, image, kind, detail, rating, className = "", onIntent }: Props) {
  function fallback(event: SyntheticEvent<HTMLImageElement>) {
    if (!event.currentTarget.src.endsWith("/no-image.svg")) event.currentTarget.src = "/no-image.svg";
  }
  return (
    <Link to={to} className={`cinema-card ${className}`} onMouseEnter={onIntent} onFocus={onIntent}>
      <div className="cinema-card-art">
        <img src={image} alt={title} loading="lazy" decoding="async" onError={fallback} />
        <span className="cinema-card-kind">{kind}</span>
        {rating != null && Number.isFinite(rating) && rating > 0 && (
          <span className="cinema-card-rating" aria-label={`TMDB rating ${rating.toFixed(1)} out of 10`}><span aria-hidden="true">★</span> {rating.toFixed(1)}</span>
        )}
        <span className="cinema-card-invite" aria-hidden="true">Explore <b>↗</b></span>
      </div>
      <div className="cinema-card-copy">
        <h3 title={title}>{title}</h3>
        {detail && <p title={detail}>{detail}</p>}
        <span className="cinema-card-corner" aria-hidden="true">↗</span>
      </div>
    </Link>
  );
}
