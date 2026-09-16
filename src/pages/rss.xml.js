import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../data/socials';

export async function GET(context) {
  const posts = (await getCollection('posts')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: `${site.name} · ${site.persona}`,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}`,
      categories: post.data.categories,
    })),
    customData: `<language>en-us</language>`,
  });
}
