import { useEffect, useState } from 'react';
import slugify from 'slugify';
import { toast } from 'sonner';

import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { createPage } from './api';
import { Page } from '@shared/strapi-types';

interface NewPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingSlugs: string[];
  onCreated: (page: Page) => void;
}

export function NewPageDialog({
  open,
  onOpenChange,
  existingSlugs,
  onCreated,
}: NewPageDialogProps) {
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle('');
    }
  }, [open]);

  const trimmedTitle = title.trim();
  const slug = slugify(trimmedTitle, { lower: true, strict: true });

  let error = '';
  if (!trimmedTitle) {
    error = 'Title is required';
  } else if (!slug) {
    error = 'Title must contain letters or numbers';
  } else if (existingSlugs.includes(slug)) {
    error = 'A page with this slug already exists';
  }

  async function create() {
    if (error) {
      return;
    }

    setCreating(true);

    try {
      const created = await createPage({ name: trimmedTitle, slug });
      toast.success('Page created');
      onCreated(created);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not create page');
    } finally {
      setCreating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="New page">
      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="new-page-title">Title</Label>
          <Input
            id="new-page-title"
            value={title}
            autoFocus
            placeholder="e.g. Photography"
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                create();
              }
            }}
          />
          <p className="text-xs text-neutral-500">
            {slug ? `Slug: /${slug}` : 'Slug is generated from the title'}
          </p>
          {title.length > 0 && error ? (
            <p className="text-xs text-red-400">{error}</p>
          ) : null}
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            className="dialog-btn-outline"
            onClick={() => onOpenChange(false)}
            disabled={creating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="dialog-btn-primary"
            onClick={create}
            disabled={creating || Boolean(error)}
          >
            {creating ? 'Creating…' : 'Create'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
