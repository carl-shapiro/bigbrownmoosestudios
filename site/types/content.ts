export interface Repo {
  name: string;
  url: string;
  description: string;
  tags?: string[];
}

export interface MusicProject {
  slug: string;
  title: string;
  description: string;
  /** Omit for projects with no Spotify presence — renders description-only. */
  spotifyEmbedUrl?: string;
}

export interface ImageItem {
  src: string;
  alt: string;
  caption?: string;
  /** Set to "video" to render this entry as an MP4 player instead of an image. Defaults to "image". */
  type?: "image" | "video";
}

export interface ImageCollection {
  slug: string;
  name: string;
  description: string;
  images: ImageItem[];
  /** Set to true to keep this collection in the file but skip rendering it (e.g. still a TODO). */
  hidden?: boolean;
}

export interface ContactMethod {
  label: string;
  value: string;
  href: string;
}

export interface AboutContent {
  /** One-line teaser used on the landing page tile. */
  teaser: string;
  paragraphs: string[];
  /** Optional portrait shown next to the heading on the About page. */
  image?: ImageItem;
}

export interface ProfessionalContent {
  /** Short summary used both on the landing tile and at the top of the page. */
  summary: string;
  paragraphs: string[];
  /** Path under public/, e.g. "/resume.pdf". */
  resumeFile: string;
}
