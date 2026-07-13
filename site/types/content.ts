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
}

export interface ImageCollection {
  slug: string;
  name: string;
  description: string;
  images: ImageItem[];
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
