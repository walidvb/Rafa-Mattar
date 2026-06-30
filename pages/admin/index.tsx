import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { fetchAdminPages, logout } from '../../features/admin/api';
import { requireAdmin } from '../../lib/require-admin';
import { Page } from '@shared/strapi-types';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await requireAdmin(context);
  if (redirect) {
    return redirect;
  }

  return { props: {} };
};

export default function AdminIndexPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminPages()
      .then(setPages)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
        <div className="mx-auto max-w-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Pages</h1>
            <Button
              variant="outline"
              onClick={async () => {
                await logout();
                window.location.href = '/admin/login';
              }}
            >
              Log out
            </Button>
          </div>

          {loading ? <p>Loading…</p> : null}
          {error ? <p className="text-red-600">{error}</p> : null}

          <div className="space-y-3">
            {pages.map((page) => (
              <Card key={page.documentId}>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">{page.name}</CardTitle>
                    <p className="text-sm text-neutral-500">/{page.slug}</p>
                  </div>
                  <Link href={`/admin/pages/${page.slug}`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">
                    {page.items?.length ?? 0} media items ·{' '}
                    {page.publishedAt ? 'Published' : 'Draft'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
