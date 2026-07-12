import ContactMethods from "@/components/ContactMethods";
import Tile from "@/components/Tile";
import TileGrid from "@/components/TileGrid";
import {
  about,
  imageCollections,
  musicProjects,
  professional,
  repos,
} from "@/lib/content";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-16 sm:py-24">
      <TileGrid>
        <Tile title="About" href="/about">
          <p className="line-clamp-4">{about.teaser}</p>
        </Tile>

        <Tile title="Professional" href="/professional">
          <p className="line-clamp-4">{professional.summary}</p>
        </Tile>

        <Tile title="Code" href="/code">
          <ul className="space-y-1">
            {repos.slice(0, 3).map((repo) => (
              <li key={repo.name} className="truncate">
                {repo.name}
              </li>
            ))}
          </ul>
        </Tile>

        <Tile title="Music" href="/music">
          <ul className="space-y-1">
            {musicProjects.slice(0, 2).map((project) => (
              <li key={project.slug} className="truncate">
                {project.title}
              </li>
            ))}
          </ul>
        </Tile>

        <Tile title="Images" href="/images">
          <ul className="space-y-1">
            {imageCollections.slice(0, 2).map((collection) => (
              <li key={collection.slug} className="truncate">
                {collection.name}
              </li>
            ))}
          </ul>
        </Tile>

        <Tile title="Contact">
          <ContactMethods />
        </Tile>
      </TileGrid>
    </main>
  );
}
