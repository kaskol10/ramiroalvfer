import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'posts'>;

/** Posts sharing the most tags and categories with `post`, newest first on ties. */
export function relatedTo(post: Post, all: Post[], limit = 3): Post[] {
  const terms = new Set([...post.data.tags, ...post.data.categories]);
  return all
    .filter((other) => other.id !== post.id)
    .map((other) => ({
      other,
      score: [...other.data.tags, ...other.data.categories].filter((term) => terms.has(term)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.other.data.date.valueOf() - a.other.data.date.valueOf())
    .slice(0, limit)
    .map(({ other }) => other);
}
