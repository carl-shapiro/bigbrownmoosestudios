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
export const imageCollections: ImageCollection[] = imagesJson;
