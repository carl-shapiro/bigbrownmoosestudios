import type { Metadata } from "next";
import Image from "next/image";
import { about } from "@/lib/content";

export const metadata: Metadata = {
  title: "About | Big Brown Moose Studios",
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-16 sm:py-24">
      <h1 className="text-4xl font-semibold tracking-tight">About</h1>
      <div className="text-neutral-700 dark:text-neutral-300">
        {about.image && (
          <div className="relative mb-6 h-72 w-full overflow-hidden rounded-xl bg-neutral-100 sm:float-right sm:ml-8 sm:w-80 dark:bg-neutral-900">
            <Image
              src={about.image.src}
              alt={about.image.alt}
              fill
              className="object-cover"
            />
          </div>
        )}
        {about.paragraphs.map((paragraph, index) => (
          <p key={index} className="mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
        <div className="clear-both" />
      </div>
    </main>
  );
}
