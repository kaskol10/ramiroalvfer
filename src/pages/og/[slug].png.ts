import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgImage } from '../../lib/og';
import { site } from '../../data/socials';
import { gpuGuide } from '../../data/gpu-guide';

type Props = { label: string; title: string };

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts');
  return [
    { params: { slug: 'default' }, props: { label: site.persona, title: site.pitch } },
    { params: { slug: 'gpu-on-kubernetes' }, props: { label: 'Field guide', title: gpuGuide.title } },
    ...posts.map((post) => ({
      params: { slug: post.id },
      props: { label: 'Field note', title: post.data.title },
    })),
  ];
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props as Props);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
