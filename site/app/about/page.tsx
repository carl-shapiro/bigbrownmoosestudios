import type { Metadata } from "next";
import { about } from "@/lib/content";

export const metadata: Metadata = {
  title: "About | Big Brown Moose Studios",
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight">About</h1>
      <div className="flex flex-col gap-4 text-neutral-700 dark:text-neutral-300">
        {about.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
