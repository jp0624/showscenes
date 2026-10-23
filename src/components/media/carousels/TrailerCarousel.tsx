import CarouselRow from "../../ui/CarouselRow";
import type { Video } from "../../../types/Shared";
export default function TrailerCarousel({ videos }: { videos: Video[] }) {
  if (!Array.isArray(videos)) return null;
  return <CarouselRow items={videos} className="video-carousel" renderItem={video => (
    <article className="cinema-video-card">
      <div className="cinema-video-screen"><iframe title={video.name || "Video trailer"}
        src={`https://www.youtube.com/embed/${video.key}`} loading="lazy" allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" /></div>
      <div className="cinema-video-copy"><span>{video.type || "Video"}{video.official ? " · Official" : ""}</span><h3 title={video.name}>{video.name || "Watch video"}</h3></div>
    </article>
  )} />;
}
