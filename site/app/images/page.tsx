import type { Metadata } from "next";
import Image from "next/image";
import SectionCard from "@/components/SectionCard";
import { imageCollections } from "@/lib/content";

export const metadata: Metadata = {
  title: "Images | Big Brown Moose Studios",
};

export default function ImagesPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Images</h1>
      <div className="flex flex-col gap-4">
        {imageCollections.map((collection) => (
          <SectionCard key={collection.slug} title={collection.name}>
            <p>{collection.description}</p>
            {collection.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {collection.images.map((image) => (
                  <figure key={image.src}>
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {image.caption && (
                      <figcaption className="mt-1 text-xs text-neutral-500">
                        {image.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </SectionCard>
        ))}
      </div>
    </main>
  );
}
