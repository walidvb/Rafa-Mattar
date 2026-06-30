import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { Button } from '../../../components/ui/button';
import { AdminLayout } from '../../../components/admin/admin-layout';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Textarea } from '../../../components/ui/textarea';
import {
  EditableMediaItem,
  adminMediaUrl,
  fetchAdminPageBySlug,
  savePageDraft,
  serializeItems,
  setPagePublished,
  toEditableItems,
  uploadFiles,
} from '../../../features/admin/api';
import { requireAdmin } from '../../../lib/require-admin';
import { Page } from '@shared/strapi-types';

interface AdminPageEditorProps {
  slug: string;
}

export const getServerSideProps: GetServerSideProps<AdminPageEditorProps> = async (context) => {
  const redirect = requireAdmin(context);
  if (redirect) {
    return redirect;
  }

  const slug = context.params?.slug as string;

  return {
    props: { slug },
  };
};

function SortableMediaRow({
  item,
  onChange,
}: {
  item: EditableMediaItem;
  onChange: (next: EditableMediaItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.clientId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const previewUrl =
    item.type === 'image'
      ? adminMediaUrl(item.image?.url)
      : item.videoUrl ?? undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3"
    >
      <button
        type="button"
        className="cursor-grab self-start rounded border border-gray-200 px-1.5 py-1 text-xs text-gray-400 hover:text-gray-600"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        ⠿
      </button>

      <div className="h-16 w-24 shrink-0 overflow-hidden rounded bg-gray-100">
        {item.type === 'image' && previewUrl ? (
          <Image
            src={previewUrl}
            alt={item.title}
            width={128}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-1 text-center text-xs text-gray-400">
            {item.type === 'video' ? 'Video' : 'No image'}
          </div>
        )}
      </div>

      <div className="grid flex-1 gap-2.5 md:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs text-gray-600">Title</Label>
          <Input
            value={item.title}
            onChange={(event) => onChange({ ...item, title: event.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-gray-600">Published</Label>
          <div className="flex h-9 items-center gap-2">
            <Switch
              checked={item.published !== false}
              onCheckedChange={(checked) => onChange({ ...item, published: checked })}
            />
            <span className="text-gray-500">
              {item.published !== false ? 'Visible' : 'Hidden'}
            </span>
          </div>
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs text-gray-600">Description</Label>
          <Textarea
            value={item.description ?? ''}
            onChange={(event) => onChange({ ...item, description: event.target.value })}
          />
        </div>

        {item.type === 'video' ? (
          <div className="space-y-1 md:col-span-2">
            <Label className="text-xs text-gray-600">Video URL</Label>
            <Input
              value={item.videoUrl ?? ''}
              onChange={(event) => onChange({ ...item, videoUrl: event.target.value })}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminPageEditor({ slug }: AdminPageEditorProps) {
  const [page, setPage] = useState<Page | null>(null);
  const [items, setItems] = useState<EditableMediaItem[]>([]);
  const [name, setName] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImageId, setOgImageId] = useState<number | null>(null);
  const [ogImageUrl, setOgImageUrl] = useState<string | undefined>();
  const [pagePublished, setPagePublishedState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchAdminPageBySlug(slug)
      .then((loaded) => {
        if (!loaded) {
          setError('Page not found');
          return;
        }

        setPage(loaded);
        setName(loaded.name);
        setItems(toEditableItems(loaded.items ?? []));
        setOgTitle(loaded.og?.title ?? '');
        setOgDescription(loaded.og?.description ?? '');
        setOgImageId(loaded.og?.image?.id ?? null);
        setOgImageUrl(adminMediaUrl(loaded.og?.image?.url));
        setPagePublishedState(Boolean(loaded.publishedAt));
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) {
      return;
    }

    try {
      const uploaded = await uploadFiles(acceptedFiles);

      setItems((current) => [
        ...current,
        ...uploaded.map((file, index) => ({
          id: -Date.now() - index,
          clientId: `new-${Date.now()}-${index}`,
          type: 'image' as const,
          title: file.alternativeText || file.name || 'Untitled',
          description: '',
          published: true,
          image: file,
        })),
      ]);

      toast.success(`Added ${uploaded.length} image(s)`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const onOgDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }

    try {
      const uploaded = await uploadFiles([file]);
      const image = uploaded[0];
      setOgImageId(image.id ?? null);
      setOgImageUrl(adminMediaUrl(image.url));
      toast.success('OG image uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    }
  }, []);

  const ogDropzone = useDropzone({
    onDrop: onOgDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  function updateItem(clientId: string, next: EditableMediaItem) {
    setItems((current) => current.map((item) => (item.clientId === clientId ? next : item)));
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    setItems((current) => {
      const oldIndex = current.findIndex((item) => item.clientId === active.id);
      const newIndex = current.findIndex((item) => item.clientId === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
  }

  async function saveMedia() {
    if (!page) {
      return;
    }

    setSaving(true);
    try {
      await savePageDraft(page.documentId, { items: serializeItems(items) });
      const refreshed = await fetchAdminPageBySlug(slug);
      if (refreshed) {
        setPage(refreshed);
        setItems(toEditableItems(refreshed.items ?? []));
      }
      toast.success('Media saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function savePageTab() {
    if (!page) {
      return;
    }

    setSaving(true);
    try {
      await savePageDraft(page.documentId, {
        name,
        og: {
          title: ogTitle,
          description: ogDescription,
          image: ogImageId,
        },
      });

      const refreshed = await fetchAdminPageBySlug(slug);
      if (refreshed) {
        setPage(refreshed);
        setName(refreshed.name);
        setPagePublishedState(Boolean(refreshed.publishedAt));
      }

      toast.success('Page saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function togglePagePublished(checked: boolean) {
    if (!page) {
      return;
    }

    try {
      await setPagePublished(page.documentId, checked);
      setPagePublishedState(checked);
      toast.success(checked ? 'Page published' : 'Page unpublished');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Publish failed');
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Loading…">
        <p className="text-gray-500">Loading page…</p>
      </AdminLayout>
    );
  }

  if (error || !page) {
    return (
      <AdminLayout title="Error" backHref="/admin" backLabel="Pages">
        <p className="text-red-600">{error || 'Page not found'}</p>
      </AdminLayout>
    );
  }

  return (
    <>
      <AdminLayout
        title={page.name}
        subtitle={`/${page.slug}`}
        backHref="/admin"
        backLabel="Pages"
      >
        <Tabs defaultValue="media">
          <TabsList className="mb-4">
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="page">Page / OG</TabsTrigger>
          </TabsList>

          <TabsContent value="media" className="space-y-3">
            <div
              {...getRootProps()}
              className={`rounded-lg border border-dashed bg-white p-6 text-center transition-colors ${
                isDragActive ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <p className="text-gray-500">
                Drop images here, or click to select files
              </p>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={items.map((item) => item.clientId)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {items.map((item) => (
                    <SortableMediaRow
                      key={item.clientId}
                      item={item}
                      onChange={(next) => updateItem(item.clientId, next)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {items.length === 0 ? (
              <p className="text-gray-500">No media items yet. Upload images above.</p>
            ) : null}

            <div className="pt-1">
              <Button onClick={saveMedia} disabled={saving} size="sm">
                {saving ? 'Saving…' : 'Save media'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="page" className="space-y-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Name</Label>
                  <Input value={name} onChange={(event) => setName(event.target.value)} />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Published</Label>
                  <div className="flex items-center gap-2">
                    <Switch checked={pagePublished} onCheckedChange={togglePagePublished} />
                    <span className="text-gray-500">
                      {pagePublished ? 'Live on site' : 'Draft only'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Open Graph
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Title</Label>
                      <Input value={ogTitle} onChange={(event) => setOgTitle(event.target.value)} />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Description</Label>
                      <Textarea
                        value={ogDescription}
                        onChange={(event) => setOgDescription(event.target.value)}
                        className="min-h-[72px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Image</Label>
                      <div
                        {...ogDropzone.getRootProps()}
                        className="cursor-pointer rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center transition-colors hover:border-gray-400"
                      >
                        <input {...ogDropzone.getInputProps()} />
                        {ogImageUrl ? (
                          <Image
                            src={ogImageUrl}
                            alt="OG"
                            width={320}
                            height={180}
                            className="mx-auto rounded object-cover"
                          />
                        ) : (
                          <p className="text-gray-500">Drop an image or click to upload</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={savePageTab} disabled={saving} size="sm">
              {saving ? 'Saving…' : 'Save page'}
            </Button>
          </TabsContent>
        </Tabs>
      </AdminLayout>
    </>
  );
}
