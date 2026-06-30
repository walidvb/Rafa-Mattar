import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import { strapiMediaUrl } from '@shared/api';
import { MediaItem, Page } from '@shared/strapi-types';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface MediaTileProps {
  page: Page;
  item: MediaItem;
  editMode?: boolean;
}

export function MediaTile({ page, item, editMode = false }: MediaTileProps) {
  let body: React.ReactNode = null;

  if (item.type === 'video' && item.videoUrl) {
    body = (
      <div
        className="aspect-video relative h-full w-full group legends-wrapper"
      >
        {editMode ? (
          <div className="flex image-container relative h-full w-full">
            <ReactPlayer
              light
              showPreview
              controls
              url={item.videoUrl}
              width="100%"
              height="100%"
              className="h-full w-full z-0 pointer-events-none"
            />
            {item.title ? (
              <div className="absolute p-4 inset-0 flex items-center place-content-center font-body text-neutral-50 bg-neutral-900/40 uppercase text-xs pointer-events-none">
                {item.title}
              </div>
            ) : null}
          </div>
        ) : (
          <a
            data-fancybox={page.slug}
            href={item.videoUrl}
            className="flex image-container cursor-pointer relative h-full w-full"
          >
            <ReactPlayer
              light
              showPreview
              controls
              url={item.videoUrl}
              width="100%"
              height="100%"
              className="h-full w-full z-0 pointer-events-none"
            />
            {item.title && (
              <div className="absolute p-4 inset-0 flex items-center place-content-center font-body text-neutral-50 bg-neutral-900/40 invisible group-hover:visible pointer-events-none uppercase text-xs">
                {item.title}
              </div>
            )}
          </a>
        )}
      </div>
    );
  } else if (item.type === 'image' && item.image?.url) {
    const imageUrl = strapiMediaUrl(item.image.url);
    const width = item.image.width ?? 800;
    const height = item.image.height ?? 600;
    const okWidth = 800;
    const newWidth = okWidth;
    const newHeight = (height * okWidth) / width;

    if (!imageUrl) {
      return null;
    }

    body = editMode ? (
      <div className="image-container">
        <Image
          src={imageUrl}
          alt={item.title}
          loading="lazy"
          width={newWidth}
          height={newHeight}
          className="image"
        />
      </div>
    ) : (
      <a data-fancybox={page.slug} href={imageUrl} className="image-container">
        <Image
          src={imageUrl}
          alt={item.title}
          loading="lazy"
          width={newWidth}
          height={newHeight}
          className="image"
        />
      </a>
    );
  } else {
    return null;
  }

  return (
    <div
      data-size={item.type === 'video' ? 'lg' : 'md'}
      className={clsx(
        'h-full w-full overflow-hidden',
        !editMode && 'hover:brightness-[0.7]',
        item.type === 'video' ? 'aspect-video' : ''
      )}
    >
      {body}
    </div>
  );
}
