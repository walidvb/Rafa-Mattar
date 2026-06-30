import { GetServerSideProps } from 'next';
import { Cog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

import { Header } from '../../features/Header';
import { EditableGallery } from '../../features/gallery/EditableGallery';
import { PageFieldsDialog } from '../../features/gallery/PageFieldsDialog';
import {
  EditableMediaItem,
  fetchAdminPageBySlug,
  toEditableItems,
} from '../../features/admin/api';
import { requireAdmin } from '../../lib/require-admin';
import { getPages } from '@shared/api';
import OGTags from '@shared/layout/OGTags';
import { Page } from '@shared/strapi-types';

interface PageEditProps {
  slug: string;
  pages: Page[];
}

export const getServerSideProps: GetServerSideProps<PageEditProps> = async (context) => {
  const redirect = requireAdmin(context);
  if (redirect) {
    return redirect;
  }

  const slug = context.params?.slug as string;
  const pages = await getPages();

  return {
    props: {
      slug,
      pages,
    },
  };
};

export default function PageEdit({ slug, pages }: PageEditProps) {
  const [page, setPage] = useState<Page | null>(null);
  const [items, setItems] = useState<EditableMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageFieldsOpen, setPageFieldsOpen] = useState(false);

  useEffect(() => {
    fetchAdminPageBySlug(slug)
      .then((loaded) => {
        if (!loaded) {
          setError('Page not found');
          return;
        }

        setPage(loaded);
        setItems(toEditableItems(loaded.items ?? []));
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[1921px] items-center justify-center px-4">
        <p className="text-white/70">Loading editor…</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[1921px] items-center justify-center px-4">
        <p className="text-red-400">{error || 'Page not found'}</p>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="mx-auto max-w-[1921px] min-h-screen px-2 md:px-4 pb-24 flex flex-col">
        <OGTags title={`Edit ${page.name}`} path={`${page.slug}/edit`} />
        <Header pages={pages} className="px-2 w-full" />

        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-widest text-white/60">
          <span>Editing /{page.slug}</span>
          <button
            type="button"
            onClick={() => setPageFieldsOpen(true)}
            className="rounded p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Page settings"
          >
            <Cog className="h-4 w-4" />
          </button>
        </div>

        <PageFieldsDialog
          open={pageFieldsOpen}
          onOpenChange={setPageFieldsOpen}
          page={page}
          slug={slug}
          onPageChange={(nextPage) => {
            setPage(nextPage);
            setItems(toEditableItems(nextPage.items ?? []));
          }}
        />

        <EditableGallery
          slug={slug}
          page={page}
          initialItems={items}
          onPageChange={(nextPage) => {
            setPage(nextPage);
            setItems(toEditableItems(nextPage.items ?? []));
          }}
        />
      </div>
    </>
  );
}
