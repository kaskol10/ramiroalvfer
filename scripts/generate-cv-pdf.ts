import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from 'pdf-lib';
import { site, socials } from '../src/data/socials';
import { experience, skills } from '../src/data/experience';
import { certifications } from '../src/data/certifications';
import { projects } from '../src/data/projects';
import { talks } from '../src/data/talks';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'public', 'ramiro-alvarez-cv.pdf');

const PAGE = { width: 595.28, height: 841.89 }; // A4
const MARGIN = { top: 48, bottom: 48, left: 48, right: 48 };
const ink = rgb(0.09, 0.12, 0.11);
const ash = rgb(0.35, 0.4, 0.38);
const accent = rgb(0.08, 0.55, 0.5);
const line = rgb(0.82, 0.86, 0.84);

type Ctx = {
  doc: PDFDocument;
  page: PDFPage;
  font: PDFFont;
  fontBold: PDFFont;
  y: number;
};

function newPage(doc: PDFDocument, font: PDFFont, fontBold: PDFFont): Ctx {
  const page = doc.addPage([PAGE.width, PAGE.height]);
  return { doc, page, font, fontBold, y: PAGE.height - MARGIN.top };
}

function ensureSpace(ctx: Ctx, needed: number) {
  if (ctx.y - needed < MARGIN.bottom) {
    const next = newPage(ctx.doc, ctx.font, ctx.fontBold);
    ctx.page = next.page;
    ctx.y = next.y;
  }
}

function drawLine(ctx: Ctx) {
  ensureSpace(ctx, 12);
  ctx.page.drawLine({
    start: { x: MARGIN.left, y: ctx.y },
    end: { x: PAGE.width - MARGIN.right, y: ctx.y },
    thickness: 0.8,
    color: line,
  });
  ctx.y -= 14;
}

/** Standard Helvetica (WinAnsi) cannot encode many Unicode glyphs. */
function sanitize(text: string): string {
  return text
    .replace(/★/g, '*')
    .replace(/[—–]/g, '-')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, '...')
    .replace(/·/g, '|')
    .replace(/→/g, '->')
    .replace(/[^\x00-\xFF]/g, '');
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = sanitize(text).split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

function sectionTitle(ctx: Ctx, title: string) {
  ensureSpace(ctx, 28);
  ctx.y -= 6;
  ctx.page.drawText(title.toUpperCase(), {
    x: MARGIN.left,
    y: ctx.y,
    size: 9,
    font: ctx.fontBold,
    color: accent,
  });
  ctx.y -= 8;
  drawLine(ctx);
}

function paragraph(ctx: Ctx, text: string, opts?: { size?: number; color?: ReturnType<typeof rgb>; bold?: boolean; gap?: number }) {
  const size = opts?.size ?? 10;
  const font = opts?.bold ? ctx.fontBold : ctx.font;
  const color = opts?.color ?? ink;
  const maxWidth = PAGE.width - MARGIN.left - MARGIN.right;
  const lines = wrapText(text, font, size, maxWidth);
  for (const lineText of lines) {
    ensureSpace(ctx, size + 4);
    ctx.page.drawText(lineText, {
      x: MARGIN.left,
      y: ctx.y,
      size,
      font,
      color,
    });
    ctx.y -= size + 3;
  }
  ctx.y -= opts?.gap ?? 4;
}

async function main() {
  const doc = await PDFDocument.create();
  doc.setTitle(`${site.name} — CV`);
  doc.setAuthor(site.name);
  doc.setSubject(site.title);
  doc.setCreator('k8scockpit.tech');
  doc.setProducer('k8scockpit.tech');

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const ctx = newPage(doc, font, fontBold);

  // Header
  ctx.page.drawText(sanitize(site.name), {
    x: MARGIN.left,
    y: ctx.y,
    size: 22,
    font: fontBold,
    color: ink,
  });
  ctx.y -= 22;
  paragraph(ctx, site.title, { size: 11, color: ash, gap: 2 });
  paragraph(ctx, site.claim, { size: 10, color: accent, bold: true, gap: 6 });
  paragraph(
    ctx,
    `${site.location}  |  ${site.cvEmail}  |  ${socials.github.replace('https://', '')}  |  ${site.url.replace('https://', '')}`,
    { size: 9, color: ash, gap: 4 },
  );
  drawLine(ctx);

  paragraph(ctx, site.description, { size: 10, gap: 8 });

  sectionTitle(ctx, 'Experience');
  for (const job of experience) {
    ensureSpace(ctx, 48);
    paragraph(ctx, `${job.role}${job.current ? '  ·  current' : ''}`, {
      size: 11,
      bold: true,
      gap: 1,
    });
    paragraph(ctx, `${job.org}  ·  ${job.period}`, { size: 9, color: ash, gap: 2 });
    paragraph(ctx, job.summary, { size: 9.5, color: ink, gap: 8 });
  }

  sectionTitle(ctx, 'Products & open source');
  for (const project of projects) {
    const badge = project.tier === 'flagship' ? '  |  flagship' : '';
    const meta =
      project.kind === 'product'
        ? `product${badge}`
        : `${project.language}, ${project.stars ?? 0} stars${badge}`;
    paragraph(ctx, `${project.name}  (${meta})`, {
      size: 10,
      bold: true,
      gap: 1,
    });
    paragraph(ctx, project.description, { size: 9, color: ash, gap: 2 });
    paragraph(ctx, project.url, { size: 8, color: ash, gap: 6 });
  }

  sectionTitle(ctx, 'Speaking');
  for (const talk of talks) {
    paragraph(ctx, talk.title, { size: 10, bold: true, gap: 1 });
    paragraph(
      ctx,
      `${talk.session ? `${talk.session}  |  ` : ''}${talk.event}  |  ${talk.date}`,
      { size: 9, color: ash, gap: talk.url ? 1 : 5 },
    );
    if (talk.url) {
      paragraph(ctx, talk.url, { size: 8, color: ash, gap: 5 });
    }
  }

  sectionTitle(ctx, 'Skills');
  paragraph(ctx, skills.join('  |  '), { size: 9.5, color: ink, gap: 8 });

  sectionTitle(ctx, `Credentials (${certifications.length})`);
  paragraph(ctx, site.claim, { size: 10, bold: true, color: accent, gap: 4 });
  for (const cert of certifications) {
    const mark = cert.highlight ? '  |  highlight' : '';
    paragraph(ctx, `${cert.name} - ${cert.issuer} (${cert.date})${mark}`, {
      size: 9,
      gap: 2,
    });
  }
  ctx.y -= 6;

  sectionTitle(ctx, 'Links');
  paragraph(ctx, `Portfolio   ${site.url}`, { size: 9.5, gap: 2 });
  paragraph(ctx, `CanISpot.ai ${socials.canispot}`, { size: 9.5, gap: 2 });
  paragraph(ctx, `MiniRSS.ai  ${socials.minirss}`, { size: 9.5, gap: 2 });
  paragraph(ctx, `GitHub      ${socials.github}`, { size: 9.5, gap: 2 });
  paragraph(ctx, `LinkedIn    ${socials.linkedin}`, { size: 9.5, gap: 2 });
  paragraph(ctx, `Email       ${site.cvEmail}`, { size: 9.5, gap: 8 });

  ensureSpace(ctx, 20);
  paragraph(
    ctx,
    `Generated ${new Date().toISOString().slice(0, 10)} · ${site.persona}`,
    { size: 8, color: ash, gap: 0 },
  );

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, await doc.save());
  console.log(`wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
