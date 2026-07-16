import debounce from 'debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Camera, Save, Video } from 'lucide-react'
import { LayoutGroup } from 'motion/react';
import { toast } from 'sonner';

import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { cn } from '../../lib/utils';
import { Masonry } from '../../shared/Masonry';
import {
  EditableMediaItem,
  deleteUploadFile,
  fetchAdminPageBySlug,
  savePageDraft,
  serializeItems,
  setPagePublished,
  toEditableItems,
  uploadFiles,
} from '../admin/api';
import { DragFollowPreview } from './DragFollowPreview';
import { EditableMediaTile } from './EditableMediaTile';
import { galleryDragLayoutId } from './gallery-dnd';
import { arrayMove, insertItemsAt, moveItemByOffset } from './item-order';
import { Page } from '@shared/strapi-types';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

interface EditableGalleryProps {
  slug: string;
  page: Page;
  initialItems: EditableMediaItem[];
  onPageChange: (page: Page) => void;
}

function resolveDragTarget(
  event: DragOverEvent | DragEndEvent,
  activeDragId: string | null,
): string | null {
  if (!event.over || !activeDragId) {
    return null;
  }

  const overId = String(event.over.id);
  return overId === activeDragId ? null : overId;
}

export function EditableGallery({ slug, page, initialItems, onPageChange }: EditableGalleryProps) {
  const [items, setItems] = useState(initialItems);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dragHover, setDragHover] = useState<string | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [newVideoIndex, setNewVideoIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('')
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [fileDragActive, setFileDragActive] = useState(false);
  // undefined = still loading published snapshot; null = never published
  const [publishedSnapshot, setPublishedSnapshot] = useState<string | null | undefined>(
    undefined,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const insertIndexRef = useRef(0);
  const fileDragDepthRef = useRef(0);
  const lastSavedRef = useRef<string | null>(null);
  const pageDocumentIdRef = useRef(page.documentId);
  pageDocumentIdRef.current = page.documentId;

  useEffect(() => {
    let cancelled = false;

    fetchAdminPageBySlug(slug, 'published')
      .then((published) => {
        if (cancelled) {
          return;
        }
        setPublishedSnapshot(
          published
            ? JSON.stringify(serializeItems(toEditableItems(published.items ?? [])))
            : null,
        );
      })
      .catch(() => {
        if (!cancelled) {
          setPublishedSnapshot(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const hasPendingPublish =
    publishedSnapshot === null ||
    (typeof publishedSnapshot === 'string' &&
      publishedSnapshot !== JSON.stringify(serializeItems(items)));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const editingItem = items.find((item) => item.clientId === editingClientId) ?? null;

  function updateItem(clientId: string, next: EditableMediaItem) {
    setItems((current) => current.map((item) => (item.clientId === clientId ? next : item)));
  }

  function openEditDialog(clientId: string) {
    const item = items.find((entry) => entry.clientId === clientId);
    if (!item) {
      return;
    }

    setEditingClientId(clientId);
    setEditTitle(item.title ?? '');
    setEditDescription(item.description ?? '');
    setEditVideoUrl(item.videoUrl ?? '')
  }

  function closeEditDialog() {
    setEditingClientId(null);
    setNewVideoIndex(null);
  }

  function saveEditDialog() {
    if (newVideoIndex !== null) {
      const stamp = Date.now();
      const newItem: EditableMediaItem = {
        id: -stamp,
        clientId: `new-${stamp}`,
        type: 'video',
        title: editTitle,
        description: editDescription,
        published: true,
        videoUrl: editVideoUrl,
      };

      setItems((current) => insertItemsAt(current, newVideoIndex, [newItem]));
      closeEditDialog();
      return;
    }

    if (!editingClientId) {
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.clientId === editingClientId
          ? {
              ...item,
              title: editTitle,
              description: editDescription,
              ...(item.type === 'video' ? { videoUrl: editVideoUrl } : {}),
            }
          : item,
      ),
    )
    closeEditDialog();
  }

  function triggerAdd(atIndex: number) {
    insertIndexRef.current = atIndex;
    fileInputRef.current?.click();
  }

  function addVideoAtIndex(atIndex: number) {
    setNewVideoIndex(atIndex)
    setEditingClientId(null)
    setEditTitle('')
    setEditDescription('')
    setEditVideoUrl('')
  }

  async function addFilesAtIndex(files: File[], atIndex: number) {
    if (!files.length) {
      return;
    }

    const stamp = Date.now();
    const placeholders: EditableMediaItem[] = files.map((file, index) => ({
      id: -stamp - index,
      clientId: `upload-${stamp}-${index}`,
      type: 'image' as const,
      title: '',
      description: '',
      published: true,
      uploading: true,
      localPreviewUrl: URL.createObjectURL(file),
    }));

    setItems((current) => insertItemsAt(current, atIndex, placeholders));

    try {
      const uploaded = await uploadFiles(files);

      setItems((current) => {
        const next = [...current];
        placeholders.forEach((placeholder, index) => {
          const itemIndex = next.findIndex(
            (item) => item.clientId === placeholder.clientId,
          );
          if (itemIndex < 0) {
            return;
          }

          if (placeholder.localPreviewUrl) {
            URL.revokeObjectURL(placeholder.localPreviewUrl);
          }

          next[itemIndex] = {
            ...next[itemIndex],
            uploading: false,
            localPreviewUrl: undefined,
            image: uploaded[index],
          };
        });
        return next;
      });

      toast.success(`Added ${uploaded.length} image(s)`);
    } catch (err) {
      const placeholderIds = new Set(
        placeholders.map((placeholder) => placeholder.clientId),
      );
      placeholders.forEach((placeholder) => {
        if (placeholder.localPreviewUrl) {
          URL.revokeObjectURL(placeholder.localPreviewUrl);
        }
      });
      setItems((current) =>
        current.filter((item) => !placeholderIds.has(item.clientId)),
      );
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    }
  }

  async function onFilesSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;
    if (!fileList?.length) {
      return;
    }

    const files = Array.from(fileList);
    event.target.value = '';
    await addFilesAtIndex(files, insertIndexRef.current);
  }

  function isFileDrag(event: React.DragEvent) {
    return event.dataTransfer.types.includes('Files');
  }

  function handleGalleryDragEnter(event: React.DragEvent) {
    if (!isFileDrag(event)) {
      return;
    }

    fileDragDepthRef.current += 1;
    setFileDragActive(true);
  }

  function handleGalleryDragLeave(event: React.DragEvent) {
    if (!isFileDrag(event)) {
      return;
    }

    fileDragDepthRef.current -= 1;
    if (fileDragDepthRef.current <= 0) {
      fileDragDepthRef.current = 0;
      setFileDragActive(false);
    }
  }

  function handleGalleryDrop(event: React.DragEvent) {
    if (items.length > 0 || !isFileDrag(event)) {
      return;
    }

    event.preventDefault();
    fileDragDepthRef.current = 0;
    setFileDragActive(false);

    const files = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/'),
    );
    if (files.length) {
      void addFilesAtIndex(files, 0);
    }
  }

  useEffect(() => {
    function resetFileDrag() {
      fileDragDepthRef.current = 0;
      setFileDragActive(false);
    }

    window.addEventListener('dragend', resetFileDrag);
    window.addEventListener('drop', resetFileDrag);

    return () => {
      window.removeEventListener('dragend', resetFileDrag);
      window.removeEventListener('drop', resetFileDrag);
    };
  }, []);

  async function deleteItem(clientId: string) {
    const item = items.find((entry) => entry.clientId === clientId);
    if (!item) {
      return;
    }

    try {
      if (item.uploading) {
        if (item.localPreviewUrl) {
          URL.revokeObjectURL(item.localPreviewUrl);
        }
      } else if (item.type === 'image' && item.image?.id) {
        await deleteUploadFile(item.image.id);
      }

      setItems((current) => current.filter((entry) => entry.clientId !== clientId));

      if (activeDragId === clientId) {
        setActiveDragId(null);
      }

      toast.success('Image deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  function moveItem(clientId: string, offset: -1 | 1) {
    setItems((current) => moveItemByOffset(current, clientId, offset));
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(String(event.active.id));
    setDragHover(null);
  }

  function handleDragOver(event: DragOverEvent) {
    setDragHover(resolveDragTarget(event, activeDragId));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active } = event;
    setDragHover(null);
    setActiveDragId(null);

    const targetClientId = resolveDragTarget(event, String(active.id));
    if (!targetClientId) {
      return;
    }

    setItems((current) => {
      const from = current.findIndex((item) => item.clientId === String(active.id));
      const to = current.findIndex((item) => item.clientId === targetClientId);
      if (from < 0 || to < 0 || from === to) {
        return current;
      }
      return arrayMove(current, from, to);
    });
  }

  function handleDragCancel() {
    setDragHover(null);
    setActiveDragId(null);
  }

  const persistDraft = useCallback(
    async (itemsToSave: EditableMediaItem[], options?: { silent?: boolean }) => {
      setSaving(true);

      try {
        await savePageDraft(pageDocumentIdRef.current, {
          items: serializeItems(itemsToSave),
        });
        const refreshed = await fetchAdminPageBySlug(slug);

        if (refreshed) {
          onPageChange(refreshed);
          const nextItems = toEditableItems(refreshed.items ?? []);
          lastSavedRef.current = JSON.stringify(serializeItems(nextItems));
          setItems(nextItems);
        }

        if (!options?.silent) {
          toast.success('Draft saved');
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Save failed');
      } finally {
        setSaving(false);
      }
    },
    [slug, onPageChange],
  );

  const persistDraftRef = useRef(persistDraft);
  persistDraftRef.current = persistDraft;

  const scheduleAutoSave = useMemo(
    () =>
      debounce((itemsToSave: EditableMediaItem[]) => {
        persistDraftRef.current(itemsToSave, { silent: true });
      }, 800),
    [],
  );

  useEffect(() => {
    return () => scheduleAutoSave.clear();
  }, [scheduleAutoSave]);

  useEffect(() => {
    const serialized = JSON.stringify(serializeItems(items));
    if (lastSavedRef.current === null) {
      lastSavedRef.current = serialized;
      return;
    }
    if (lastSavedRef.current === serialized) {
      return;
    }
    scheduleAutoSave(items);
  }, [items, scheduleAutoSave]);

  async function publish() {
    scheduleAutoSave.clear();
    setPublishing(true);

    try {
      await savePageDraft(pageDocumentIdRef.current, { items: serializeItems(items) });
      await setPagePublished(pageDocumentIdRef.current, true);
      const refreshed = await fetchAdminPageBySlug(slug);

      if (refreshed) {
        onPageChange(refreshed);
        const nextItems = toEditableItems(refreshed.items ?? []);
        const snapshot = JSON.stringify(serializeItems(nextItems));
        lastSavedRef.current = snapshot;
        setPublishedSnapshot(snapshot);
        setItems(nextItems);
      }

      toast.success('Page published');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Publish failed');
    } finally {
      setPublishing(false);
    }
  }

  const activeDragItem =
    items.find((item) => item.clientId === activeDragId) ?? null;

  const dragFromIndex = activeDragId
    ? items.findIndex((item) => item.clientId === activeDragId)
    : -1;

  const dragToIndex = dragHover
    ? items.findIndex((item) => item.clientId === dragHover)
    : -1;

  // Live reorder preview: the hovered tile is always the destination, so the
  // dragged image previews in that tile regardless of which side is hovered.
  const previewItems =
    dragFromIndex >= 0 && dragToIndex >= 0
      ? arrayMove(items, dragFromIndex, dragToIndex)
      : items;

  function displayItemAt(index: number): EditableMediaItem {
    return previewItems[index] ?? items[index];
  }

  function swipeDirectionAt(index: number): 'left' | 'right' | null {
    if (dragFromIndex < 0 || dragToIndex < 0) {
      return null;
    }
    const shown = previewItems[index];
    if (!shown) {
      return null;
    }
    const origIndex = items.findIndex((item) => item.clientId === shown.clientId);
    if (origIndex === index) {
      return null;
    }
    return origIndex > index ? 'left' : 'right';
  }

  return (
    <div className="flex flex-1 flex-col">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onFilesSelected}
      />

      {fileDragActive && !activeDragId ? (
        <div className="mb-3 text-center font-sans text-sm font-normal text-black">
          {items.length === 0
            ? 'Drop images here'
            : 'Drop on an image to add it there'}
        </div>
      ) : null}

      {activeDragId ? (
        <div className="mb-3 text-center font-sans text-sm font-normal text-black">
          Drag onto another image to reorder
        </div>
      ) : null}

      <div
        className={
          items.length === 0
            ? `flex min-h-[calc(100vh-10rem)] flex-1 flex-col rounded-lg transition-colors${
                fileDragActive ? ' border-2 border-dashed border-white/50 bg-white/5' : ''
              }`
            : undefined
        }
        onDragEnter={handleGalleryDragEnter}
        onDragLeave={handleGalleryDragLeave}
        onDragOver={(event) => {
          if (isFileDrag(event)) {
            event.preventDefault()
          }
        }}
        onDrop={handleGalleryDrop}
      >
        <LayoutGroup>
          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <Masonry>
              {items.map((item, index) => (
                <EditableMediaTile
                  // Remount the tile when a video's URL changes so Masonry
                  // re-measures a fresh node and react-player picks up the new
                  // source (its light preview won't refresh on the same mount).
                  key={
                    item.type === 'video'
                      ? `${item.clientId}:${item.videoUrl ?? ''}`
                      : item.clientId
                  }
                  page={page}
                  item={item}
                  displayItem={displayItemAt(index)}
                  swipeDirection={swipeDirectionAt(index)}
                  onAddImageLeft={() => triggerAdd(index)}
                  onAddImageRight={() => triggerAdd(index + 1)}
                  onAddVideoLeft={() => addVideoAtIndex(index)}
                  onAddVideoRight={() => addVideoAtIndex(index + 1)}
                  onMoveLeft={() => moveItem(item.clientId, -1)}
                  onMoveRight={() => moveItem(item.clientId, 1)}
                  canMoveLeft={index > 0}
                  canMoveRight={index < items.length - 1}
                  onDropFilesLeft={(files) => addFilesAtIndex(files, index)}
                  onDropFilesRight={(files) =>
                    addFilesAtIndex(files, index + 1)
                  }
                  onTogglePublished={(published) =>
                    updateItem(item.clientId, { ...item, published })
                  }
                  onEdit={() => openEditDialog(item.clientId)}
                  onDelete={() => deleteItem(item.clientId)}
                />
              ))}
            </Masonry>
            <DragFollowPreview
              item={activeDragItem}
              layoutId={activeDragId ? galleryDragLayoutId(activeDragId) : null}
            />
          </DndContext>
        </LayoutGroup>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
            <p className="mb-4 text-white/70">
              {fileDragActive ? 'Drop images to add them' : 'No images yet.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => triggerAdd(0)}
              >
                <Camera className="h-4 w-4" />
                Add image
              </Button>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => addVideoAtIndex(0)}
              >
                <Video className="h-4 w-4" />
                Add video
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="fixed bottom-14 left-3 z-[90]">
        <button
          type="button"
          onClick={publish}
          disabled={saving || publishing}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-neutral-900/80 text-white/80 backdrop-blur transition-colors hover:bg-neutral-800 hover:text-white disabled:opacity-50',
            hasPendingPublish && 'animate-pulse text-white',
          )}
          aria-label="Publish page"
          title={
            publishing
              ? 'Publishing…'
              : hasPendingPublish
                ? 'Publish unpublished changes'
                : 'Publish page'
          }
        >
          <Save className="h-4 w-4" />
        </button>
      </div>

      <Dialog
        open={Boolean(editingItem) || newVideoIndex !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeEditDialog()
          }
        }}
        title={newVideoIndex !== null ? 'Add video' : 'Edit media'}
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="media-title">Title</Label>
            <Input
              id="media-title"
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              placeholder="Required"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="media-description">Description</Label>
            <Textarea
              id="media-description"
              value={editDescription}
              onChange={(event) => setEditDescription(event.target.value)}
              className="min-h-[96px]"
            />
          </div>

          {editingItem?.type === 'video' || newVideoIndex !== null ? (
            <div className="space-y-1">
              <Label htmlFor="media-video-url">Video URL</Label>
              <Input
                id="media-video-url"
                value={editVideoUrl}
                onChange={(event) => setEditVideoUrl(event.target.value)}
                placeholder="https://youtube.com/watch?v=…"
              />
              {editVideoUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded bg-black">
                  <ReactPlayer
                    url={editVideoUrl}
                    width="100%"
                    height="100%"
                    controls
                    light
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="dialog-btn-outline"
              onClick={closeEditDialog}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="dialog-btn-primary"
              onClick={saveEditDialog}
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
