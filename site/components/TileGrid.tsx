import type { ReactNode } from "react";

export default function TileGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}
