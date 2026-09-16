export type Experience = {
  role: string;
  org: string;
  url?: string;
  period: string;
  current?: boolean;
  summary: string;
};

export const experience: Experience[] = [
  {
    role: 'Staff Platform Engineer · Lead Architecture Board',
    org: 'Empathy.co',
    url: 'https://empathy.co/',
    period: '2022-03 — present',
    current: true,
    summary:
      'Lead Platform Engineering and the Architecture Board. Kubernetes platforms, self-hosted AI and inference workloads, CI/CD, Elasticsearch, MongoDB, multi-cloud (AWS, GCP, Azure), FinOps, and observability.',
  },
  {
    role: 'Co-Founder & Advisor',
    org: 'Resizes',
    url: 'https://resiz.es/',
    period: '2024-06 — present',
    current: true,
    summary: 'Advising on platform, cloud economics, and product direction.',
  },
  {
    role: 'E-commerce build',
    org: 'Bitke',
    url: 'https://bitke.es/',
    period: '2023-11',
    summary: 'Shipped the Bitke e-commerce website.',
  },
  {
    role: 'DevOps Engineer',
    org: 'Empathy.co',
    url: 'https://empathy.co/',
    period: '2018-01 — 2022-03',
    summary: 'Platform and infrastructure for search products; cloud-native adoption.',
  },
  {
    role: 'DevOps Engineer',
    org: 'DXC',
    url: 'https://dxc.com/',
    period: '2015-10 — 2018-01',
    summary: 'Enterprise DevOps, automation, and delivery pipelines.',
  },
  {
    role: 'Network Engineer',
    org: 'Informática El Corte Inglés',
    period: '2014-07 — 2015-07',
    summary: 'Network engineering and operations.',
  },
  {
    role: 'IoT Research Engineer',
    org: 'IK4-Ikerlan',
    url: 'https://www.ikerlan.es/en',
    period: '2013-10 — 2014-03',
    summary: 'IoT research engineering.',
  },
];

export const skills = [
  'Kubernetes',
  'Platform Engineering',
  'Inference Engineering',
  'Self-hosted AI platforms',
  'Ollama / local LLMs',
  'GPU on K8s (MIG / HAMi)',
  'CloudNativePG',
  'Karpenter',
  'Argo / GitOps',
  'FinOps',
  'Observability',
  'AWS / GCP / Azure',
  'Go',
  'Terraform',
  'Elasticsearch',
  'MongoDB',
  'CI/CD',
];
