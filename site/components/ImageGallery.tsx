"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { ImageItem } from "@/types/content";

export default function ImageGallery({ images }: { images: ImageItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const showNext = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (openIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openIndex, close, showPrev, showNext]);

  const openItem = openIndex !== null ? images[openIndex] : null;

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, index) => (
          <figure key={image.src}>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
              {image.type === "video" ? (
                <>
                  <video
                    src={image.src}
                    controls
                    playsInline
                    aria-label={image.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setOpenIndex(index)}
                    aria-label={`Enlarge video: ${image.alt}`}
                    className="absolute right-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white hover:bg-black/80"
                  >
                    Enlarge
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`Enlarge photo: ${image.alt}`}
                  className="absolute inset-0 h-full w-full cursor-zoom-in"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </button>
              )}
            </div>
            {image.caption && (
              <figcaption className="mt-1 text-xs text-neutral-500">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {openItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openItem.alt}
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 text-3xl text-white/80 hover:text-white"
          >
            &times;
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-white/80 hover:text-white"
              >
                &larr;
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="Next photo"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl text-white/80 hover:text-white"
              >
                &rarr;
              </button>
            </>
          )}

          <div
            className="flex h-full max-h-[85vh] w-full max-w-4xl flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full min-h-0 flex-1">
              {openItem.type === "video" ? (
                <video
                  src={openItem.src}
                  controls
                  playsInline
                  autoPlay
                  aria-label={openItem.alt}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Image
                  src={openItem.src}
                  alt={openItem.alt}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <p className="max-w-2xl text-center text-sm text-white/80">
              {openItem.alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
