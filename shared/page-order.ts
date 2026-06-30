import { Page } from './strapi-types';

// Sorts pages by their position in `order` (a list of documentIds). Pages not
// present in the list keep their original relative order and go to the end.
export function applyPageOrder(pages: Page[], order: string[] | null | undefined): Page[] {
  const positions = order ?? [];

  const rank = (documentId: string) => {
    const index = positions.indexOf(documentId);
    return index === -1 ? Number.POSITIVE_INFINITY : index;
  };

  return [...pages].sort((a, b) => rank(a.documentId) - rank(b.documentId));
}
