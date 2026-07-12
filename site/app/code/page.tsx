import type { Metadata } from "next";
import SectionCard from "@/components/SectionCard";
import { repos } from "@/lib/content";

export const metadata: Metadata = {
  title: "Code | Big Brown Moose Studios",
};

export default function CodePage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Code</h1>
      <div className="flex flex-col gap-4">
        {repos.map((repo) => (
          <SectionCard key={repo.name} title={repo.name}>
            <p>{repo.description}</p>
            {repo.tags && repo.tags.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {repo.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-neutral-200 px-2 py-0.5 text-xs dark:border-neutral-800"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium underline underline-offset-4"
            >
              View repository &rarr;
            </a>
          </SectionCard>
        ))}
      </div>
    </main>
  );
}
