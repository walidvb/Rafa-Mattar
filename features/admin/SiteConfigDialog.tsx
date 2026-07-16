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
  const [bio, setBio] = useState('')
  const [pictureId, setPictureId] = useState<number | null>(null)
  const [pictureUrl, setPictureUrl] = useState<string | undefined>(undefined)
  const [ogDescription, setOgDescription] = useState('');
  const [ogImageId, setOgImageId] = useState<number | null>(null);
  const [ogImageUrl, setOgImageUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const pictureInputRef = useRef<HTMLInputElement>(null)
  const ogImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setLoading(true);
    fetchSiteConfig()
      .then((config) => {
        setBio(config?.about?.bio ?? '')
        setPictureId(config?.about?.picture?.id ?? null)
        setPictureUrl(adminMediaUrl(config?.about?.picture?.url))
        setOgDescription(config?.og?.description ?? '');
        setOgImageId(config?.og?.image?.id ?? null);
        setOgImageUrl(adminMediaUrl(config?.og?.image?.url));
      })
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [open]);

  async function onPictureSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      return
    }

    try {
      const uploaded = await uploadFiles([file])
      const image = uploaded[0]
      setPictureId(image.id ?? null)
      setPictureUrl(adminMediaUrl(image.url))
      toast.success('Picture uploaded')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    }
  }

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
        about: {
          bio,
          picture: pictureId,
        },
        og: {
          description: ogDescription,
          image: ogImageId,
        },
      })
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
        ref={pictureInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPictureSelected}
      />
      <input
        ref={ogImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onOgImageSelected}
      />

      <Dialog open={open} onOpenChange={onOpenChange} title="Site settings">
        <div className="space-y-6 max-h-[90vh] overflow-y-auto">
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-neutral-200">About</h3>

            <div className="space-y-1">
              <Label>Picture</Label>
              <button
                type="button"
                onClick={() => pictureInputRef.current?.click()}
                className="w-full cursor-pointer rounded-lg border border-dashed border-neutral-600 bg-neutral-700/50 p-4 text-center transition-colors hover:border-neutral-500"
              >
                {pictureUrl ? (
                  <Image
                    src={pictureUrl}
                    alt="About"
                    width={240}
                    height={240}
                    className="mx-auto rounded object-cover"
                  />
                ) : (
                  <p className="text-neutral-400">Click to upload a picture</p>
                )}
              </button>
            </div>

            <div className="space-y-1">
              <Label htmlFor="site-about-bio">Bio</Label>
              <Textarea
                id="site-about-bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                className="min-h-[96px]"
                disabled={loading}
              />
            </div>
          </section>

          <section className="space-y-4 border-t border-neutral-700 pt-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-neutral-200">OG</h3>
              <p className="text-xs text-neutral-500">
                Displayed when sharing the linkon social media and messenging
                apps.
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="site-og-description">Description</Label>
              <Textarea
                id="site-og-description"
                value={ogDescription}
                onChange={(event) => setOgDescription(event.target.value)}
                className="min-h-[72px]"
                disabled={loading}
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
          </section>

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
  )
}
