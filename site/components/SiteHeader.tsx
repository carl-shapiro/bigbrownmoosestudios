import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex w-full max-w-4xl items-center px-6 py-5">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Big Brown Moose Studios
        </Link>
      </div>
    </header>
  );
}
