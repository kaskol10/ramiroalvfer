#!/usr/bin/env node
/**
 * Refresh star counts in src/data/projects.ts from the GitHub API.
 * Usage: node scripts/refresh-stars.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(root, 'src/data/projects.ts');
let source = readFileSync(file, 'utf8');

const repos = [
  'karpenter-optimizer',
  'cnpg-migrator',
  'self-hosted-renovate-review',
  'rss-ai-reader',
  'external-snapshotter',
  'asturiassoftwarecrafters-noviembre-2024-ops-slides',
];

for (const repo of repos) {
  const res = await fetch(`https://api.github.com/repos/kaskol10/${repo}`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'k8scockpit-stars' },
  });
  if (!res.ok) {
    console.warn(`skip ${repo}: ${res.status}`);
    continue;
  }
  const data = await res.json();
  const stars = data.stargazers_count ?? 0;
  const re = new RegExp(
    `(slug: '${repo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?stars: )\\d+`,
  );
  if (re.test(source)) {
    source = source.replace(re, `$1${stars}`);
    console.log(`${repo}: ${stars}`);
  } else {
    console.warn(`pattern miss: ${repo}`);
  }
}

writeFileSync(file, source);
console.log('updated', file);
