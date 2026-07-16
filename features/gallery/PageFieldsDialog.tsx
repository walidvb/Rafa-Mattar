import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Textarea } from '../../components/ui/textarea';
import {
  adminMediaUrl,
  fetchAdminPageBySlug,
  savePageDraft,
  setPagePublished,
  uploadFiles,
} from '../admin/api';
import { Page } from '@shared/strapi-types';

interface PageFieldsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: Page;
  slug: string;
  onPageChange: (page: Page) => void;
  onDelete?: () => void;
}

export function PageFieldsDialog({
  open,
  onOpenChange,
  page,
  slug,
  onPageChange,
  onDelete,
}: PageFieldsDialogProps) {
  const [name, setName] = useState(page.name);
  const [pagePublished, setPagePublishedState] = useState(Boolean(page.publishedAt));
  const [ogTitle, setOgTitle] = useState(page.og?.title ?? '');
  const [ogDescription, setOgDescription] = useState(page.og?.description ?? '');
  const [ogImageId, setOgImageId] = useState<number | null>(page.og?.image?.id ?? null);
  const [ogImageUrl, setOgImageUrl] = useState<string | undefined>(
    adminMediaUrl(page.og?.image?.url)
  );
  const [saving, setSaving] = useState(false);
  const ogImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(page.name);
    setPagePublishedState(Boolean(page.publishedAt));
    setOgTitle(page.og?.title ?? '');
    setOgDescription(page.og?.description ?? '');
    setOgImageId(page.og?.image?.id ?? null);
    setOgImageUrl(adminMediaUrl(page.og?.image?.url));
  }, [open, page]);

  async function onOgImageSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
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
  }

  async function save() {
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

      if (pagePublished !== Boolean(page.publishedAt)) {
        await setPagePublished(page.documentId, pagePublished);
      }

      const refreshed = await fetchAdminPageBySlug(slug);
      if (refreshed) {
        onPageChange(refreshed);
      }

      toast.success('Page saved');
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <input
        ref={ogImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onOgImageSelected}
      />

      <Dialog open={open} onOpenChange={onOpenChange} title="Page settings">
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="page-name">Name</Label>
            <Input
              id="page-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Published</Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={pagePublished}
                onCheckedChange={setPagePublishedState}
              />
              <span className="text-sm text-neutral-400">
                {pagePublished ? 'Live on site' : 'Draft only'}
              </span>
            </div>
          </div>

          <div className="border-t border-neutral-600 pt-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-400">
              Open Graph
            </p>
            <p className="mb-3 text-xs text-neutral-400">
              Displayed when sharing the linkon social media and messenging
              apps.
            </p>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="og-title">Title</Label>
                <Input
                  id="og-title"
                  value={ogTitle}
                  onChange={(event) => setOgTitle(event.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="og-description">Description</Label>
                <Textarea
                  id="og-description"
                  value={ogDescription}
                  onChange={(event) => setOgDescription(event.target.value)}
                  className="min-h-[72px]"
                />
              </div>

              <div className="space-y-1">
                <Label>Image</Label>
                <button
                  type="button"
                  onClick={() => ogImageInputRef.current?.click()}
                  className="w-full cursor-pointer rounded-lg border border-dashed border-neutral-600 bg-neutral-700/50 p-4 text-center transition-colors hover:border-neutral-500"
                >
                  {ogImageUrl ? (
                    <Image
                      src={ogImageUrl}
                      alt="OG"
                      width={320}
                      height={180}
                      className="mx-auto rounded object-cover"
                    />
                  ) : (
                    <p className="text-neutral-400">Click to upload an image</p>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            {onDelete ? (
              <Button
                type="button"
                className="bg-red-600 text-white hover:bg-red-500"
                onClick={onDelete}
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="dialog-btn-outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="dialog-btn-primary"
                onClick={save}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}
