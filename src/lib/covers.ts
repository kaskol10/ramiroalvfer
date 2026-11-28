import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/covers/*.{png,jpg,jpeg,webp,gif}',
  { eager: true },
);

/** Resolve a post's `cover` frontmatter (for example `covers/my-post.png`, under `src/assets/images/`) to an image. */
export function coverImage(cover?: string): ImageMetadata | undefined {
  if (!cover) return undefined;
  const image = images[`/src/assets/images/${cover}`]?.default;
  if (!image) throw new Error(`Cover not found: src/assets/images/${cover}`);
  return image;
}
