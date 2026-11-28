import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { site } from '../data/socials';

const WIDTH = 1200;
const HEIGHT = 630;

const fontFile = (pkg: string, file: string) =>
  readFileSync(join(process.cwd(), 'node_modules', '@fontsource', pkg, 'files', file));

let fonts: { name: string; data: Buffer; weight: 400 | 700; style: 'normal' }[] | undefined;

function loadFonts() {
  fonts ??= [
    { name: 'Syne', data: fontFile('syne', 'syne-latin-700-normal.woff'), weight: 700, style: 'normal' },
    {
      name: 'IBM Plex Mono',
      data: fontFile('ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff'),
      weight: 400,
      style: 'normal',
    },
  ];
  return fonts;
}

const el = (style: Record<string, unknown>, children: unknown) => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

/** Render a 1200x630 share card as PNG. */
export async function renderOgImage(opts: { label: string; title: string }): Promise<Buffer> {
  const titleSize = opts.title.length > 70 ? 54 : opts.title.length > 40 ? 64 : 76;

  const tree = el(
    {
      width: WIDTH,
      height: HEIGHT,
      backgroundColor: '#0e1210',
      backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(45,212,191,0.22), rgba(14,18,16,0) 55%)',
    },
    [
      el({ width: 12, height: HEIGHT, backgroundColor: '#2dd4bf' }, []),
      el(
        {
          width: WIDTH - 12,
          height: HEIGHT,
          boxSizing: 'border-box',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
        },
        [
          el(
            { fontFamily: 'IBM Plex Mono', fontSize: 24, letterSpacing: 4, color: '#2dd4bf', textTransform: 'uppercase' },
            opts.label,
          ),
          el(
            { fontFamily: 'Syne', fontWeight: 700, fontSize: titleSize, lineHeight: 1.08, letterSpacing: -1.5, color: '#e8eee9' },
            opts.title,
          ),
          el({ justifyContent: 'space-between', fontFamily: 'IBM Plex Mono', fontSize: 24, color: '#c5d0c8' }, [
            el({}, site.name),
            el({ color: '#7a8a80' }, site.url.replace('https://', '')),
          ]),
        ],
      ),
    ],
  );

  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    fonts: loadFonts(),
  });
  return new Resvg(svg).render().asPng();
}
