import { EditableMediaItem } from '../admin/api';

export function moveItemRelative(
  items: EditableMediaItem[],
  movingClientId: string,
  targetClientId: string,
  side: 'left' | 'right'
): EditableMediaItem[] {
  if (movingClientId === targetClientId) {
    return items;
  }

  const movingIndex = items.findIndex((item) => item.clientId === movingClientId);
  const targetIndex = items.findIndex((item) => item.clientId === targetClientId);

  if (movingIndex < 0 || targetIndex < 0) {
    return items;
  }

  const next = [...items];
  const [moving] = next.splice(movingIndex, 1);

  let insertIndex = targetIndex;
  if (movingIndex < targetIndex) {
    insertIndex = targetIndex - 1;
  }

  if (side === 'right') {
    insertIndex += 1;
  }

  next.splice(insertIndex, 0, moving);
  return next;
}

export function insertItemsAt(
  items: EditableMediaItem[],
  index: number,
  newItems: EditableMediaItem[]
): EditableMediaItem[] {
  const next = [...items];
  next.splice(index, 0, ...newItems);
  return next;
}
