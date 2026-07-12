import Link from "next/link";
import type { ReactNode } from "react";

interface TileProps {
  title: string;
  /** Omit for tiles with nothing further to link to (Contact). */
  href?: string;
  children: ReactNode;
}

export default function Tile({ title, href, children }: TileProps) {
  return (
    <div className="flex h-full min-h-56 flex-col rounded-xl border border-neutral-200 p-6 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 flex-1 text-sm text-neutral-600 dark:text-neutral-400">
        {children}
      </div>
      {href && (
        <Link
          href={href}
          className="mt-auto pt-4 text-sm font-medium underline underline-offset-4"
        >
          See more &rarr;
        </Link>
      )}
    </div>
  );
}
