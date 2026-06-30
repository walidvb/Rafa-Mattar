import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { LayoutGroup } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
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
import { galleryDragLayoutId, parseGalleryDropZone } from './gallery-dnd';
import { insertItemsAt, moveItemRelative } from './item-order';
import { Page } from '@shared/strapi-types';

interface EditableGalleryProps {
  slug: string;
  page: Page;
  initialItems: EditableMediaItem[];
  onPageChange: (page: Page) => void;
}

export function EditableGallery({ slug, page, initialItems, onPageChange }: EditableGalleryProps) {
  const [items, setItems] = useState(initialItems);
  const [movingClientId, setMovingClientId] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [fileDragActive, setFileDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const insertIndexRef = useRef(0);
  const fileDragDepthRef = useRef(0);

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
  }

  function saveEditDialog() {
    if (!editingClientId) {
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.clientId === editingClientId
          ? { ...item, title: editTitle, description: editDescription }
          : item
      )
    );
    setEditingClientId(null);
  }

  function triggerAdd(atIndex: number) {
    insertIndexRef.current = atIndex;
    fileInputRef.current?.click();
  }

  async function addFilesAtIndex(files: File[], atIndex: number) {
    if (!files.length) {
      return;
    }

    try {
      const uploaded = await uploadFiles(files);
      const stamp = Date.now();
      const newItems: EditableMediaItem[] = uploaded.map((file, index) => ({
        id: -stamp - index,
        clientId: `new-${stamp}-${index}`,
        type: 'image' as const,
        title: '',
        description: '',
        published: true,
        image: file,
      }));

      setItems((current) => insertItemsAt(current, atIndex, newItems));
      toast.success(`Added ${uploaded.length} image(s)`);
    } catch (err) {
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
      if (item.type === 'image' && item.image?.id) {
        await deleteUploadFile(item.image.id);
      }

      setItems((current) => current.filter((entry) => entry.clientId !== clientId));

      if (movingClientId === clientId) {
        setMovingClientId(null);
      }

      if (activeDragId === clientId) {
        setActiveDragId(null);
      }

      toast.success('Image deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  function toggleMove(clientId: string) {
    setMovingClientId((current) => (current === clientId ? null : clientId));
  }

  function placeItem(
    targetClientId: string,
    side: 'left' | 'right',
    sourceId = movingClientId,
  ) {
    if (!sourceId) {
      return;
    }

    setItems((current) => moveItemRelative(current, sourceId, targetClientId, side));
    setMovingClientId(null);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) {
      return;
    }

    const zone = parseGalleryDropZone(String(over.id));
    if (zone) {
      placeItem(zone.clientId, zone.side, String(active.id));
    }
  }

  function handleDragCancel() {
    setActiveDragId(null);
  }

  async function saveDraft() {
    setSaving(true);

    try {
      await savePageDraft(page.documentId, { items: serializeItems(items) });
      const refreshed = await fetchAdminPageBySlug(slug);

      if (refreshed) {
        onPageChange(refreshed);
        setItems(toEditableItems(refreshed.items ?? []));
      }

      toast.success('Draft saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    setPublishing(true);

    try {
      await savePageDraft(page.documentId, { items: serializeItems(items) });
      await setPagePublished(page.documentId, true);
      const refreshed = await fetchAdminPageBySlug(slug);

      if (refreshed) {
        onPageChange(refreshed);
        setItems(toEditableItems(refreshed.items ?? []));
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

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onFilesSelected}
      />

      {movingClientId ? (
        <div className="mb-3 flex items-center justify-center gap-3 font-sans text-sm font-normal text-black">
          <span>Click a side on another image to place it</span>
          <button
            type="button"
            className="rounded border border-black/30 px-2 py-0.5 font-sans text-sm font-normal text-black hover:bg-black/5"
            onClick={() => setMovingClientId(null)}
          >
            Cancel
          </button>
        </div>
      ) : null}

      {fileDragActive && !movingClientId && !activeDragId ? (
        <div className="mb-3 text-center font-sans text-sm font-normal text-black">
          Drop on a red or green zone to add images
        </div>
      ) : null}

      {activeDragId && !movingClientId ? (
        <div className="mb-3 text-center font-sans text-sm font-normal text-black">
          Drop on a zone to reorder
        </div>
      ) : null}

      <div
        onDragEnter={handleGalleryDragEnter}
        onDragLeave={handleGalleryDragLeave}
        onDragOver={(event) => {
          if (isFileDrag(event)) {
            event.preventDefault();
          }
        }}
      >
        <LayoutGroup>
          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <Masonry>
              {items.map((item, index) => (
                <EditableMediaTile
                  key={item.clientId}
                  page={page}
                  item={item}
                  movingClientId={movingClientId}
                  showPositionZones={
                    fileDragActive || movingClientId !== null || activeDragId !== null
                  }
                  onAddLeft={() => triggerAdd(index)}
                  onAddRight={() => triggerAdd(index + 1)}
                  onStartMove={() => toggleMove(item.clientId)}
                  onPlaceLeft={() => placeItem(item.clientId, 'left')}
                  onPlaceRight={() => placeItem(item.clientId, 'right')}
                  onDropFilesLeft={(files) => addFilesAtIndex(files, index)}
                  onDropFilesRight={(files) => addFilesAtIndex(files, index + 1)}
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
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="mb-4 text-white/70">No images yet.</p>
          <Button type="button" variant="outline" onClick={() => triggerAdd(0)}>
            Add first image
          </Button>
        </div>
      ) : null}

      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-3">
        <Button type="button" variant="outline" onClick={saveDraft} disabled={saving || publishing}>
          {saving ? 'Saving…' : 'Save draft'}
        </Button>
        <Button type="button" onClick={publish} disabled={saving || publishing}>
          {publishing ? 'Publishing…' : 'Publish'}
        </Button>
      </div>

      <Dialog
        open={Boolean(editingItem)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingClientId(null);
          }
        }}
        title="Edit media"
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

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setEditingClientId(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveEditDialog}>
              Save
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
