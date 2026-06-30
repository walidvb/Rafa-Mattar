import { MediaItem, Page, StrapiListResponse, StrapiMedia } from '@shared/strapi-types';

const PAGE_POPULATE =
  'populate[og][populate]=image&populate[items][populate]=image';

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/strapi/${path}`, init);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
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
  return json.data;
}

export async function fetchAdminPageBySlug(slug: string): Promise<Page | null> {
  const json = await adminFetch<StrapiListResponse<Page>>(
    `pages?filters[slug][$eq]=${encodeURIComponent(slug)}&status=draft&${PAGE_POPULATE}`
  );

  return json.data[0] ?? null;
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

export type EditableMediaItem = MediaItem & { clientId: string };

export function toEditableItems(items: MediaItem[] = []): EditableMediaItem[] {
  return items.map((item) => ({
    ...item,
    clientId: String(item.id),
  }));
}

export function serializeItems(items: EditableMediaItem[]) {
  return items.map((item) => {
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
