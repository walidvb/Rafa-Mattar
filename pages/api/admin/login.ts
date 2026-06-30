import type { NextApiRequest, NextApiResponse } from 'next';

import {
  adminSessionCookie,
  clearAdminSessionCookie,
  isAdminAuthenticated,
} from '../../../lib/admin-auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!process.env.ADMIN_PW || password !== process.env.ADMIN_PW) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.setHeader('Set-Cookie', adminSessionCookie());
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearAdminSessionCookie());
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
