import Link from "next/link";

type GalleryGridProps = {
  count: number;
  placeholderCount: number;
  imageHeightClassName?: string;
  itemHref?: string;
};

export function GalleryGrid({
  count,
  placeholderCount,
  imageHeightClassName = "h-44",
  itemHref,
}: GalleryGridProps) {
  const images = Array.from({ length: count }, (_, i) => {
    const n = (i % placeholderCount) + 1;
    return {
      src: `/gallery/placeholder-${n}.svg`,
      alt: `Gallery placeholder ${(i % placeholderCount) + 1}`,
    };
  });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {images.map((img, idx) => {
        const inner = (
          <div
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:bg-zinc-900"
            aria-label={img.alt}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              className={`w-full ${imageHeightClassName} object-cover`}
            />
          </div>
        );

        return itemHref ? (
          <Link
            key={`${img.src}-${idx}`}
            href={itemHref}
            className="block transition-transform duration-300 hover:scale-[1.02]"
          >
            {inner}
          </Link>
        ) : (
          <div key={`${img.src}-${idx}`}>{inner}</div>
        );
      })}
    </div>
  );
}

