import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { adminMediaUrl, fetchSiteConfig, saveSiteConfig, uploadFiles } from './api';

interface SiteConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SiteConfigDialog({ open, onOpenChange }: SiteConfigDialogProps) {
  const [ogDescription, setOgDescription] = useState('');
  const [ogImageId, setOgImageId] = useState<number | null>(null);
  const [ogImageUrl, setOgImageUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const ogImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setLoading(true);
    fetchSiteConfig()
      .then((config) => {
        setOgDescription(config?.og?.description ?? '');
        setOgImageId(config?.og?.image?.id ?? null);
        setOgImageUrl(adminMediaUrl(config?.og?.image?.url));
      })
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [open]);

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
      await saveSiteConfig({
        og: {
          description: ogDescription,
          image: ogImageId,
        },
      });
      toast.success('Site settings saved');
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

      <Dialog open={open} onOpenChange={onOpenChange} title="Site settings">
        <div className="space-y-4">
          <p className="text-xs text-neutral-500">
            Default Open Graph data used when a page has none of its own.
          </p>

          <div className="space-y-1">
            <Label htmlFor="site-og-description">OG description</Label>
            <Textarea
              id="site-og-description"
              value={ogDescription}
              onChange={(event) => setOgDescription(event.target.value)}
              className="min-h-[72px]"
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <Label>OG image</Label>
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

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="dialog-btn-outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="dialog-btn-primary"
              onClick={save}
              disabled={saving || loading}
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
