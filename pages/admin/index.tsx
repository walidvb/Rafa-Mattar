import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';

import { AdminLayout } from '../../components/admin/admin-layout';
import { Button } from '../../components/ui/button';
import { fetchAdminPages } from '../../features/admin/api';
import { requireAdmin } from '../../lib/require-admin';
import { Page } from '@shared/strapi-types';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = requireAdmin(context);
  if (redirect) {
    return redirect;
  }

  return { props: {} };
};

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        published ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10'
      }`}
    >
      {published ? 'Published' : 'Draft'}
    </span>
  );
}

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
    <AdminLayout title="Pages">
      {loading ? <p className="text-gray-500">Loading…</p> : null}
      {error ? <p className="text-red-600">{error}</p> : null}

      {!loading && !error && pages.length === 0 ? (
        <p className="text-gray-500">No pages yet.</p>
      ) : null}

      {pages.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <ul className="divide-y divide-gray-200">
            {pages.map((page) => (
              <li key={page.documentId} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">{page.name}</p>
                  <p className="truncate text-gray-500">/{page.slug}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden text-gray-500 sm:inline">
                    {page.items?.length ?? 0} items
                  </span>
                  <StatusBadge published={Boolean(page.publishedAt)} />
                  <Link href={`/admin/pages/${page.slug}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </AdminLayout>
  );
}
