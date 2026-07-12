import type { Metadata } from "next";
import { professional } from "@/lib/content";

export const metadata: Metadata = {
  title: "Professional | Big Brown Moose Studios",
};

export default function ProfessionalPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Professional</h1>
      <div className="flex flex-col gap-4 text-neutral-700 dark:text-neutral-300">
        <p className="font-medium text-foreground">{professional.summary}</p>
        {professional.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <a
        href={professional.resumeFile}
        download
        className="w-fit rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium underline underline-offset-4 dark:border-neutral-800"
      >
        Download resume
      </a>
    </main>
  );
}
