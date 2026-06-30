export interface StrapiMedia {
  id?: number;
  url: string;
  name?: string;
  width?: number;
  height?: number;
  alternativeText?: string | null;
}

export interface Og {
  title?: string | null;
  description?: string | null;
  image?: StrapiMedia | null;
}

export interface MediaItem {
  id: number;
  type: 'image' | 'video';
  image?: StrapiMedia | null;
  videoUrl?: string | null;
  title: string;
  description?: string | null;
  published?: boolean;
}

export interface Page {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  publishedAt?: string | null;
  og?: Og | null;
  items?: MediaItem[] | null;
}

export interface StrapiListResponse<T> {
  data: T[];
}

export interface StrapiSingleResponse<T> {
  data: T[];
}
