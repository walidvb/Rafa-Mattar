import type { NextApiRequest, NextApiResponse } from 'next';

import { isAdminAuthenticated } from '../../../lib/admin-auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

function getPath(req: NextApiRequest): string {
  const segments = req.query.path;

  if (Array.isArray(segments)) {
    return segments.join('/');
  }

  return segments ?? '';
}

function getQueryString(req: NextApiRequest): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path' || value == null) {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry));
      continue;
    }

    params.append(key, value);
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

function getRequestBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAdminAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const strapiUrl = process.env.STRAPI_API_URL?.replace(/\/$/, '');
  const strapiToken = process.env.STRAPI_API_TOKEN;

  if (!strapiUrl) {
    return res.status(500).json({ error: 'STRAPI_API_URL is not set' });
  }

  const path = getPath(req);
  const query = getQueryString(req);
  const body = ['GET', 'HEAD'].includes(req.method ?? '') ? undefined : await getRequestBody(req);

  const headers: Record<string, string> = {};

  if (req.headers['content-type']) {
    headers['content-type'] = req.headers['content-type'];
  }

  if (strapiToken) {
    headers.Authorization = `Bearer ${strapiToken}`;
  }

  const upstream = await fetch(`${strapiUrl}/api/${path}${query}`, {
    method: req.method,
    headers,
    body: body?.length ? body : undefined,
  });

  const responseBody = await upstream.arrayBuffer();
  const contentType = upstream.headers.get('content-type');

  res.status(upstream.status);

  if (contentType) {
    res.setHeader('content-type', contentType);
  }

  return res.send(Buffer.from(responseBody));
}
