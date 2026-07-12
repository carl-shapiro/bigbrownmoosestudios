import type { Metadata } from "next";
import SectionCard from "@/components/SectionCard";
import SpotifyEmbed from "@/components/SpotifyEmbed";
import { musicProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Music | Big Brown Moose Studios",
};

export default function MusicPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Music</h1>
      <div className="flex flex-col gap-4">
        {musicProjects.map((project) => (
          <SectionCard key={project.slug} title={project.title}>
            <p>{project.description}</p>
            {project.spotifyEmbedUrl && (
              <SpotifyEmbed embedUrl={project.spotifyEmbedUrl} />
            )}
          </SectionCard>
        ))}
      </div>
    </main>
  );
}
