import { applyPageOrder } from '@shared/page-order';
import {
  MediaItem,
  Page,
  SiteConfig,
  StrapiListResponse,
  StrapiMedia,
  StrapiSingleResponse,
} from '@shared/strapi-types';

const PAGE_POPULATE =
  'populate[og][populate]=image&populate[items][populate]=image';

const SITE_CONFIG_POPULATE =
  'populate[og][populate]=image&populate[about][populate]=picture';

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/strapi/${path}`, init);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  try {
    return res.json()
  } catch (error) {
    console.error(error)
    console.log(await res.text())
    console.log(path)
    throw new Error(`Request failed: ${res.status}`)
  }
  return res.json();
}

export function adminMediaUrl(url?: string | null): string | undefined {
  if (!url) {
    return undefined;
  }

  if (url.startsWith('http')) {
    return url;
  }

  const base =
    process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace(/\/$/, '') ??
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:1337'
      : '');
  return `${base}${url}`;
}

export async function fetchAdminPages(): Promise<Page[]> {
  const json = await adminFetch<StrapiListResponse<Page>>(`pages?status=draft&${PAGE_POPULATE}`);

  let pageOrder: string[] | null = null;
  try {
    const config = await fetchSiteConfig();
    pageOrder = config?.pageOrder ?? null;
  } catch {
    // Site config may not be initialized yet; fall back to unsorted pages.
  }

  return applyPageOrder(json.data, pageOrder);
}

export async function fetchAdminPageBySlug(
  slug: string,
  status: 'draft' | 'published' = 'draft',
): Promise<Page | null> {
  const json = await adminFetch<StrapiListResponse<Page>>(
    `pages?filters[slug][$eq]=${encodeURIComponent(slug)}&status=${status}&${PAGE_POPULATE}`
  );

  return json.data[0] ?? null;
}

export async function createPage(data: { name: string; slug: string }): Promise<Page> {
  const json = await adminFetch<{ data: Page }>(`pages?status=draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });

  return json.data;
}

export async function deletePage(documentId: string) {
  return adminFetch(`pages/${documentId}`, { method: 'DELETE' });
}

export async function fetchSiteConfig(): Promise<SiteConfig | null> {
  const json = await adminFetch<StrapiSingleResponse<SiteConfig>>(
    `site-config?${SITE_CONFIG_POPULATE}`
  );

  return json.data;
}

export async function saveSiteConfig(data: {
  about?: {
    bio?: string;
    picture?: number | null;
  };
  og?: {
    title?: string;
    description?: string;
    image?: number | null;
  };
  pageOrder?: string[];
}) {
  return adminFetch(`site-config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
}

export async function savePageOrder(pageOrder: string[]) {
  return saveSiteConfig({ pageOrder });
}

export async function uploadFiles(files: File[]): Promise<StrapiMedia[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const res = await fetch('/api/strapi/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Upload failed: ${res.status}`);
  }

  const json = await res.json();
  return Array.isArray(json) ? json : json.data ?? [];
}

export type EditableMediaItem = MediaItem & {
  clientId: string;
  uploading?: boolean;
  localPreviewUrl?: string;
};

export function toEditableItems(items: MediaItem[] = []): EditableMediaItem[] {
  return items.map((item) => ({
    ...item,
    clientId: String(item.id),
  }));
}

export function serializeItems(items: EditableMediaItem[]) {
  return items.filter((item) => !item.uploading).map((item) => {
    const payload: Record<string, unknown> = {
      type: item.type,
      title: item.title,
      description: item.description ?? '',
      published: item.published !== false,
    };

    if (item.id > 0) {
      payload.id = item.id;
    }

    if (item.type === 'image' && item.image?.id) {
      payload.image = item.image.id;
    }

    if (item.type === 'video' && item.videoUrl) {
      payload.videoUrl = item.videoUrl;
    }

    return payload;
  });
}

export async function savePageDraft(
  documentId: string,
  data: {
    name?: string;
    og?: {
      title?: string;
      description?: string;
      image?: number | null;
    };
    items?: ReturnType<typeof serializeItems>;
  }
) {
  return adminFetch(`pages/${documentId}?status=draft`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
}

export async function setPagePublished(documentId: string, published: boolean) {
  const action = published ? 'actions/publish' : 'actions/unpublish';
  return adminFetch(`pages/${documentId}/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
}

export async function fetchAdminSession(): Promise<boolean> {
  const res = await fetch('/api/admin/login');
  if (!res.ok) {
    return false;
  }

  const json = (await res.json()) as { admin?: boolean };
  return Boolean(json.admin);
}

export async function login(password: string) {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    throw new Error('Invalid password');
  }
}

export async function logout() {
  await fetch('/api/admin/login', { method: 'DELETE' });
}

export async function deleteUploadFile(fileId: number) {
  return adminFetch(`upload/files/${fileId}`, { method: 'DELETE' });
}
