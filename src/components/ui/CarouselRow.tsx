import { Children, useId, useRef, type ReactNode } from "react";
import "../media/info/ImageGallery.css";

interface Props<T> {
  items?: T[];
  renderItem?: (item: T) => ReactNode;
  itemWidth?: number;
  children?: ReactNode;
  className?: string;
}

export default function CarouselRow<T = ReactNode>({
  items, renderItem, itemWidth, children, className = "",
}: Props<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const railId = useId();
  const count = items ? items.length : Children.toArray(children).length;
  const scroll = (direction: number) => ref.current?.scrollBy({
    left: direction * ref.current.clientWidth * 0.85,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });

  return (
    <div className={`media-gallery ${className}`}>
      <div className="media-gallery-toolbar">
        <p>{count} {count === 1 ? "item" : "items"} <span>· Scroll to browse.</span></p>
        <div className="media-gallery-scroll-controls">
          <button type="button" aria-label="Scroll cards left" aria-controls={railId}
            disabled={count < 2} onClick={() => scroll(-1)}>‹</button>
          <button type="button" aria-label="Scroll cards right" aria-controls={railId}
            disabled={count < 2} onClick={() => scroll(1)}>›</button>
        </div>
      </div>
      <div id={railId} ref={ref} className="media-gallery-rail" tabIndex={0}
        role="region" aria-label="Scrollable cards"
        onKeyDown={event => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            scroll(event.key === "ArrowRight" ? 1 : -1);
          }
        }}>
        {items ? items.map((item, i) => (
          <div className="snap-start shrink-0" style={itemWidth ? { width: itemWidth } : undefined} key={i}>
            {renderItem ? renderItem(item) : item as ReactNode}
          </div>
        )) : children}
      </div>
    </div>
  );
}
