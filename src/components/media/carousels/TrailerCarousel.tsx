// src/components/media/carousels/TrailerCarousel.tsx
import CarouselRow from "../../ui/CarouselRow";

interface Props {
	videos: any[];
}

export default function TrailerCarousel({ videos }: Props) {
	if (!Array.isArray(videos)) return null;

	return (
		<CarouselRow
			items={videos}
			className="video-carousel"
			renderItem={(v) => (
				<iframe
					key={v.id}
					title={v.name || "Video trailer"}
					src={`https://www.youtube.com/embed/${v.key}`}
					className="aspect-video w-full rounded-xl border border-token bg-black"
					loading="lazy"
					allowFullScreen
				/>
			)}
		/>
	);
}
