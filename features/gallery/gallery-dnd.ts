export function galleryDropZoneId(clientId: string, side: 'left' | 'right') {
  return `${clientId}::${side}`;
}

export function galleryDragLayoutId(clientId: string) {
  return `gallery-drag-${clientId}`;
}

export const DRAG_PREVIEW_PX = 96;

export function parseGalleryDropZone(
  id: string,
): { clientId: string; side: 'left' | 'right' } | null {
  const separator = id.lastIndexOf('::');
  if (separator === -1) {
    return null;
  }

  const clientId = id.slice(0, separator);
  const side = id.slice(separator + 2);
  if (side !== 'left' && side !== 'right') {
    return null;
  }

  return { clientId, side };
}
