import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence, motion } from 'motion/react';
import { Cog, GripVertical, Pencil, Plus, Settings2, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { PageFieldsDialog } from '../gallery/PageFieldsDialog';
import { ConfirmDialog } from './ConfirmDialog';
import { NewPageDialog } from './NewPageDialog';
import { SiteConfigDialog } from './SiteConfigDialog';
import {
  deletePage,
  fetchAdminPages,
  fetchAdminSession,
  savePageOrder,
} from './api';
import { Page } from '@shared/strapi-types';

export function SiteMenuDrawer() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [newPageOpen, setNewPageOpen] = useState(false);
  const [siteConfigOpen, setSiteConfigOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [deletingPage, setDeletingPage] = useState<Page | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  useEffect(() => {
    fetchAdminSession().then((admin) => {
      if (!admin) {
        return;
      }
      setIsAdmin(true);
      refreshPages();
    });
  }, []);

  function refreshPages() {
    fetchAdminPages()
      .then(setPages)
      .catch((err: Error) => toast.error(err.message));
  }

  function handleReorder(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const from = pages.findIndex((page) => page.documentId === active.id);
    const to = pages.findIndex((page) => page.documentId === over.id);
    if (from < 0 || to < 0) {
      return;
    }

    const next = arrayMove(pages, from, to);
    setPages(next);

    savePageOrder(next.map((page) => page.documentId)).catch((err: Error) => {
      toast.error(err.message || 'Could not save order');
      refreshPages();
    });
  }

  async function confirmDelete() {
    if (!deletingPage) {
      return;
    }

    setDeleting(true);

    try {
      await deletePage(deletingPage.documentId);
      toast.success('Page deleted');

      if (editingPage?.documentId === deletingPage.documentId) {
        setEditingPage(null);
      }
      setDeletingPage(null);
      refreshPages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <div className="fixed right-3 top-3 z-[90] flex flex-col items-end font-body">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-neutral-900/80 text-white/80 backdrop-blur transition-colors hover:bg-neutral-800 hover:text-white"
          aria-label="Site menu"
        >
          {open ? <X className="h-4 w-4" /> : <Settings2 className="h-4 w-4" />}
        </button>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="mt-2 w-[320px] overflow-hidden rounded-lg border border-white/15 bg-neutral-900/95 text-neutral-200 shadow-xl backdrop-blur"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                <span className="text-xs font-medium uppercase tracking-widest text-white/50">
                  Pages
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setNewPageOpen(true)}
                    className="rounded p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="New page"
                    title="New page"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSiteConfigOpen(true)}
                    className="rounded p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Site settings"
                    title="Site settings"
                  >
                    <Cog className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {pages.length === 0 ? (
                <p className="px-3 py-4 text-sm text-white/50">No pages yet.</p>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleReorder}
                >
                  <SortableContext
                    items={pages.map((page) => page.documentId)}
                    strategy={verticalListSortingStrategy}
                  >
                    <ul className="max-h-[60vh] divide-y divide-white/5 overflow-y-auto">
                      {pages.map((page) => (
                        <SortablePageRow
                          key={page.documentId}
                          page={page}
                          onEdit={() => setEditingPage(page)}
                          onDelete={() => setDeletingPage(page)}
                        />
                      ))}
                    </ul>
                  </SortableContext>
                </DndContext>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <NewPageDialog
        open={newPageOpen}
        onOpenChange={setNewPageOpen}
        existingSlugs={pages.map((page) => page.slug)}
        onCreated={(page) => {
          refreshPages();
          router.push(`/${page.slug}/edit`);
        }}
      />

      <SiteConfigDialog open={siteConfigOpen} onOpenChange={setSiteConfigOpen} />

      {editingPage ? (
        <PageFieldsDialog
          open={Boolean(editingPage)}
          onOpenChange={(value) => {
            if (!value) {
              setEditingPage(null);
            }
          }}
          page={editingPage}
          slug={editingPage.slug}
          onPageChange={() => refreshPages()}
          onDelete={() => setDeletingPage(editingPage)}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deletingPage)}
        onOpenChange={(value) => {
          if (!value) {
            setDeletingPage(null);
          }
        }}
        title="Delete page"
        description={
          deletingPage
            ? `Delete “${deletingPage.name}” (/${deletingPage.slug})? This cannot be undone.`
            : ''
        }
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}

interface SortablePageRowProps {
  page: Page;
  onEdit: () => void;
  onDelete: () => void;
}

function SortablePageRow({ page, onEdit, onDelete }: SortablePageRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: page.documentId,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-1 bg-neutral-900/95 px-2 py-2 ${
        isDragging ? 'opacity-60' : ''
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none rounded p-1 text-white/40 transition-colors hover:text-white/80 active:cursor-grabbing"
        aria-label={`Reorder ${page.name}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <Link
        href={`/${page.slug}/edit`}
        className="min-w-0 flex-1 truncate text-sm hover:text-white"
        title={`Edit /${page.slug}`}
      >
        {page.name}
        <span className="ml-2 text-xs text-white/40">/{page.slug}</span>
      </Link>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onEdit}
          className="rounded p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={`Edit ${page.name} settings`}
          title="Page settings"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded p-1.5 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          aria-label={`Delete ${page.name}`}
          title="Delete page"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
