import { Page, StrapiListResponse } from './strapi-types';

const STRAPI_URL = process.env.STRAPI_API_URL?.replace(/\/$/, '') ?? '';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

const PAGE_POPULATE =
  'populate[og][populate]=image&populate[items][populate]=image';

function strapiHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
  }

  return headers;
}

async function fetchStrapi<T>(path: string): Promise<T> {
  if (!STRAPI_URL) {
    throw new Error('STRAPI_API_URL is not set');
  }

  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    headers: strapiHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Strapi request failed: ${res.status} ${path}`);
  }

  return res.json();
}

export function strapiMediaUrl(url?: string | null): string | undefined {
  if (!url) {
    return undefined;
  }

  if (url.startsWith('http')) {
    return url;
  }

  const base =
    (typeof window !== 'undefined'
      ? process.env.NEXT_PUBLIC_STRAPI_API_URL
      : process.env.STRAPI_API_URL)?.replace(/\/$/, '') ??
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:1337'
      : '');

  return `${base}${url}`;
}

export async function getPages(): Promise<Page[]> {
  const json = await fetchStrapi<StrapiListResponse<Page>>(
    `/pages?${PAGE_POPULATE}&sort=createdAt:asc`
  );

  return json.data.filter((page) => page.items?.length);
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const json = await fetchStrapi<StrapiListResponse<Page>>(
    `/pages?filters[slug][$eq]=${encodeURIComponent(slug)}&${PAGE_POPULATE}`
  );

  return json.data[0] ?? null;
}

export async function getPageSlugs(): Promise<string[]> {
  const json = await fetchStrapi<StrapiListResponse<Page>>(
    '/pages?fields[0]=slug&pagination[pageSize]=100'
  );

  return json.data.map((page) => page.slug);
}
