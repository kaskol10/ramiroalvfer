export type Project = {
  name: string;
  slug: string;
  description: string;
  language: string;
  role: 'creator' | 'maintainer';
  tier: 'flagship' | 'supporting';
  /** Product site or GitHub repo URL */
  url: string;
  /** GitHub stars; omit for shipped products that are not OSS repos */
  stars?: number;
  kind?: 'oss' | 'product';
  relatedPost?: string;
  themes?: Array<'platform' | 'ai' | 'data' | 'finops'>;
};

/** Star counts captured at build time; refresh via GitHub API in CI when desired. */
export const projects: Project[] = [
  {
    name: 'CanISpot.ai',
    slug: 'canispot',
    description:
      'Filter-first shortlist for EC2 Spot instances — interruption band, savings, cores, RAM, and $/hour–$/year in one view. Free, no login. Built after too many 2am Spot pages.',
    language: 'Product',
    role: 'creator',
    tier: 'flagship',
    kind: 'product',
    url: 'https://canispot.ai/',
    themes: ['finops', 'platform'],
  },
  {
    name: 'MiniRSS.ai',
    slug: 'minirss',
    description:
      'Privacy-first RSS reader with AI summaries powered by small language models (Granite4). Zero tracking, EU-hosted, custom prompts — free in beta. Self-hosted sibling: rss-ai-reader.',
    language: 'Product',
    role: 'creator',
    tier: 'flagship',
    kind: 'product',
    url: 'https://minirss.ai/',
    relatedPost: 'rss-ai',
    themes: ['ai'],
  },
  {
    name: 'karpenter-optimizer',
    slug: 'karpenter-optimizer',
    description:
      'Cost optimization for Karpenter NodePools — usage analysis and AI-powered recommendations (Ollama / LiteLLM / Bedrock) to cut EC2 spend without losing performance.',
    language: 'Go',
    role: 'creator',
    tier: 'flagship',
    kind: 'oss',
    url: 'https://github.com/kaskol10/karpenter-optimizer',
    stars: 78,
    themes: ['platform', 'finops', 'ai'],
  },
  {
    name: 'cnpg-migrator',
    slug: 'cnpg-migrator',
    description:
      'Web UI and API to migrate PostgreSQL (e.g. AWS RDS) to CloudNativePG with dump & restore Jobs on Kubernetes.',
    language: 'Go',
    role: 'creator',
    tier: 'flagship',
    kind: 'oss',
    url: 'https://github.com/kaskol10/cnpg-migrator',
    stars: 2,
    relatedPost: 'cnpg-migrator',
    themes: ['platform', 'data'],
  },
  {
    name: 'rss-ai-reader',
    slug: 'rss-ai-reader',
    description:
      'Self-hosted OSS sibling of MiniRSS.ai — local SLM inference via Ollama, private summaries, browser storage, no cloud APIs.',
    language: 'TypeScript',
    role: 'creator',
    tier: 'supporting',
    kind: 'oss',
    url: 'https://github.com/kaskol10/rss-ai-reader',
    stars: 4,
    relatedPost: 'rss-ai',
    themes: ['ai'],
  },
  {
    name: 'self-hosted-renovate-review',
    slug: 'self-hosted-renovate-review',
    description:
      'Inference-backed GitHub Action: reviews Renovate PRs with a self-hosted LLM — keep dependency AI on your infra.',
    language: 'Go',
    role: 'creator',
    tier: 'supporting',
    kind: 'oss',
    url: 'https://github.com/kaskol10/self-hosted-renovate-review',
    stars: 11,
    themes: ['ai', 'platform'],
  },
  {
    name: 'external-snapshotter',
    slug: 'external-snapshotter',
    description:
      'CSI external-snapshotter sidecar for Kubernetes VolumeSnapshot CRDs.',
    language: 'Go',
    role: 'maintainer',
    tier: 'supporting',
    kind: 'oss',
    url: 'https://github.com/kaskol10/external-snapshotter',
    stars: 2,
    themes: ['platform', 'data'],
  },
  {
    name: 'ops-platform-slides',
    slug: 'asturiassoftwarecrafters-noviembre-2024-ops-slides',
    description:
      'Ops → DevOps → Platform Engineering — talk slides from Asturias Software Crafters (Nov 2024).',
    language: 'Markdown',
    role: 'creator',
    tier: 'supporting',
    kind: 'oss',
    url: 'https://github.com/kaskol10/asturiassoftwarecrafters-noviembre-2024-ops-slides',
    stars: 1,
    themes: ['platform'],
  },
];

export const flagshipProjects = projects.filter((p) => p.tier === 'flagship');
export const supportingProjects = projects.filter((p) => p.tier === 'supporting');
export const productProjects = projects.filter((p) => p.kind === 'product');
export const totalStars = projects.reduce((sum, p) => sum + (p.stars ?? 0), 0);
