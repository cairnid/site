import type { CollectionEntry } from 'astro:content';

export type DocEntry = CollectionEntry<'docs'>;

export function docRoute(doc: DocEntry): string {
  return doc.id === 'index' ? '/docs/' : `/docs/${doc.id}/`;
}

export function sortDocs(docs: DocEntry[]): DocEntry[] {
  return [...docs].sort((left, right) => {
    const order = left.data.order - right.data.order;
    if (order !== 0) {
      return order;
    }

    return left.data.title.localeCompare(right.data.title);
  });
}

export function groupDocsByCategory(docs: DocEntry[]): Map<string, DocEntry[]> {
  const groups = new Map<string, DocEntry[]>();

  for (const doc of sortDocs(docs)) {
    const group = groups.get(doc.data.category) ?? [];
    group.push(doc);
    groups.set(doc.data.category, group);
  }

  return groups;
}

export function getDocOrThrow(docs: DocEntry[], id: string): DocEntry {
  const doc = docs.find((entry) => entry.id === id);
  if (!doc) {
    throw new Error(`Missing docs entry: ${id}`);
  }

  return doc;
}
