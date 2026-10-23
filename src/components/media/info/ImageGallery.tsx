import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import "./ImageGallery.css";

interface GalleryImage {
  file_path: string;
  aspect_ratio?: number;
  width?: number;
  height?: number;
}
interface ImageGalleryProps {
  backdrops?: GalleryImage[];
  posters?: GalleryImage[];
  stills?: GalleryImage[];
  logos?: GalleryImage[];
  profiles?: GalleryImage[];
  title?: string;
}
const EMPTY: GalleryImage[] = [];
const IMAGE_BASE = "https://image.tmdb.org/t/p";
function imageFallback(event: SyntheticEvent<HTMLImageElement>) {
  if (!event.currentTarget.src.endsWith("/no-image.svg")) {
    event.currentTarget.src = "/no-image.svg";
  }
}

export default function ImageGallery({
  backdrops = EMPTY, posters = EMPTY, stills = EMPTY,
  logos = EMPTY, profiles = EMPTY, title = "Images",
}: ImageGalleryProps) {
  const all = useMemo(() => {
    const seen = new Set<string>();
    return [
      ...backdrops.map(image => ({ ...image, type: "Backdrop" })),
      ...posters.map(image => ({ ...image, type: "Poster" })),
      ...stills.map(image => ({ ...image, type: "Still" })),
      ...logos.map(image => ({ ...image, type: "Logo" })),
      ...profiles.map(image => ({ ...image, type: "Profile" })),
    ].filter(image => {
      if (!image.file_path || seen.has(image.file_path)) return false;
      seen.add(image.file_path);
      return true;
    });
  }, [backdrops, posters, stills, logos, profiles]);
  const [selected, setSelected] = useState<number | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const labelId = useId();
  const countId = useId();
  const isOpen = selected !== null && all.length > 0;
  const index = all.length ? (selected ?? 0) % all.length : 0;
  const current = all[index];

  useEffect(() => {
    if (!isOpen) return;
    const node = dialog.current;
    if (!node) return;
    const previousOverflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      node.close();
      document.body.style.overflow = previousOverflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const move = (direction: number) => setSelected(value =>
    ((value ?? 0) + direction + all.length) % all.length);
  const scroll = (direction: number) => rail.current?.scrollBy({
    left: direction * rail.current.clientWidth * 0.85,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });

  if (!all.length) return <p className="text-muted">No images available yet.</p>;

  return (
    <div className="media-gallery">
      <div className="media-gallery-toolbar">
        <p>{all.length} {all.length === 1 ? "image" : "images"} <span>· Scroll to browse. Select to enlarge.</span></p>
        <div className="media-gallery-scroll-controls">
          <button type="button" aria-label="Scroll images left" onClick={() => scroll(-1)}>‹</button>
          <button type="button" aria-label="Scroll images right" onClick={() => scroll(1)}>›</button>
        </div>
      </div>
      <div ref={rail} className="media-gallery-rail" role="region"
        aria-label={`${title} image gallery`} tabIndex={0}
        onKeyDown={event => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            scroll(event.key === "ArrowRight" ? 1 : -1);
          }
        }}>
        {all.map((image, i) => (
          <button key={image.file_path} type="button"
            className={`media-gallery-card media-gallery-card--${image.type.toLowerCase()}`}
            aria-label={`Open ${image.type.toLowerCase()} ${i + 1} of ${all.length} for ${title}`}
            aria-haspopup="dialog"
            onClick={event => { opener.current = event.currentTarget; setSelected(i); }}>
            <img src={`${IMAGE_BASE}/w500${image.file_path}`} loading="lazy" decoding="async"
              alt={`${title} — ${image.type.toLowerCase()} ${i + 1}`} onError={imageFallback} />
            <span>{image.type} <b aria-hidden="true">↗</b></span>
          </button>
        ))}
      </div>
      <dialog ref={dialog} className="media-gallery-dialog" aria-labelledby={labelId}
        aria-describedby={countId} onClose={() => setSelected(null)}
        onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}
        onKeyDown={event => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault(); event.stopPropagation();
            move(event.key === "ArrowRight" ? 1 : -1);
          } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault(); setSelected(event.key === "Home" ? 0 : all.length - 1);
          }
        }}>
        <header className="media-gallery-dialog-head">
          <div><p>IMAGE GALLERY</p><h2 id={labelId}>{title}</h2></div>
          <button type="button" className="media-gallery-close" aria-label="Close image gallery"
            onClick={() => dialog.current?.close()}>×</button>
        </header>
        <div className="media-gallery-stage"
          onTouchStart={event => { touch.current = event.touches.length === 1
            ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null; }}
          onTouchCancel={() => { touch.current = null; }}
          onTouchEnd={event => {
            const start = touch.current; touch.current = null;
            if (!start || event.touches.length || !event.changedTouches.length) return;
            const dx = event.changedTouches[0].clientX - start.x;
            const dy = event.changedTouches[0].clientY - start.y;
            if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.4) move(dx < 0 ? 1 : -1);
          }}>
          {current && <img key={current.file_path} src={`${IMAGE_BASE}/original${current.file_path}`}
            alt={`${title} — ${current.type.toLowerCase()} ${index + 1}`} onError={imageFallback}
            draggable={false} />}
        </div>
        <footer className="media-gallery-dialog-footer">
          <button type="button" aria-label="Previous image" onClick={() => move(-1)} disabled={all.length < 2}>‹ <span>Previous</span></button>
          <p id={countId} aria-live="polite" aria-atomic="true">{current?.type}<strong>{index + 1} / {all.length}</strong></p>
          <button type="button" aria-label="Next image" onClick={() => move(1)} disabled={all.length < 2}><span>Next</span> ›</button>
        </footer>
        <p className="media-gallery-hint">← → to browse · Esc to close · Swipe on touch screens</p>
      </dialog>
    </div>
  );
}
