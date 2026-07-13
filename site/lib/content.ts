import aboutJson from "@/content/about.json";
import professionalJson from "@/content/professional.json";
import contactJson from "@/content/contact.json";
import reposJson from "@/content/repos.json";
import musicJson from "@/content/music.json";
import imagesJson from "@/content/images.json";
import type {
  AboutContent,
  ContactMethod,
  ImageCollection,
  MusicProject,
  ProfessionalContent,
  Repo,
} from "@/types/content";

export const about: AboutContent = aboutJson;
export const professional: ProfessionalContent = professionalJson;
export const contactMethods: ContactMethod[] = contactJson;
export const repos: Repo[] = reposJson;
export const musicProjects: MusicProject[] = musicJson;
// JSON imports widen string literals (e.g. `type: "video"`) to plain
// `string`, so ImageItem's `type` union needs an explicit assertion here.
// Filtered here (not in each page) so both the Images page and the landing
// tile's preview automatically skip collections marked `hidden`.
export const imageCollections: ImageCollection[] = (
  imagesJson as ImageCollection[]
).filter((collection) => !collection.hidden);
