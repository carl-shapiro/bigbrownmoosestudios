import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  children: ReactNode;
}

/** Shared visual shell for individual entries on the Code/Music/Images list pages. */
export default function SectionCard({ title, children }: SectionCardProps) {
  return (
    <section className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
        {children}
      </div>
    </section>
  );
}
