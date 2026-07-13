import type { Metadata } from "next";
import Image from "next/image";
import { about } from "@/lib/content";

export const metadata: Metadata = {
  title: "About | Big Brown Moose Studios",
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-16 sm:py-24">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        {about.image && (
          <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900">
            <Image
              src={about.image.src}
              alt={about.image.alt}
              fill
              className="object-cover"
            />
          </div>
        )}
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>
      </div>
      <div className="flex flex-col gap-4 text-neutral-700 dark:text-neutral-300">
        {about.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
