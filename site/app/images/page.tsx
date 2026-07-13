import type { Metadata } from "next";
import ImageGallery from "@/components/ImageGallery";
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
              <ImageGallery images={collection.images} />
            )}
          </SectionCard>
        ))}
      </div>
    </main>
  );
}
