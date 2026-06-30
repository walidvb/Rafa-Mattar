import { EditableMediaItem } from '../admin/api';

export function moveItemByOffset(
  items: EditableMediaItem[],
  clientId: string,
  offset: -1 | 1,
): EditableMediaItem[] {
  const index = items.findIndex((item) => item.clientId === clientId);
  if (index < 0) {
    return items;
  }

  const newIndex = index + offset;
  if (newIndex < 0 || newIndex >= items.length) {
    return items;
  }

  const next = [...items];
  [next[index], next[newIndex]] = [next[newIndex], next[index]];
  return next;
}

export function arrayMove<T>(items: T[], from: number, to: number): T[] {
  const next = items.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
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
