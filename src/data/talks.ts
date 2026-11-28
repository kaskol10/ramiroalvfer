export type Talk = {
  title: string;
  event: string;
  date: string;
  url?: string;
  /** What the link points at; drives the link label on the speaking page. */
  link?: 'video' | 'slides' | 'event';
};

export const talks: Talk[] = [
  {
    title: 'Agentic AI for Platform Engineering: Building Agent-Ready Platforms',
    event: 'Packt Publishing (workshop)',
    date: '2026-10-27',
    url: 'https://www.eventbrite.co.uk/e/agentic-ai-for-platform-engineering-building-agent-ready-platforms-tickets-2003193305100',
    link: 'event',
  },
  {
    title: 'From Ops to DevOps to Platform Engineering',
    event: 'Asturias Software Crafters',
    date: '2024-11',
    url: 'https://github.com/kaskol10/asturiassoftwarecrafters-noviembre-2024-ops-slides',
    link: 'slides',
  },
  {
    title: 'Cloud FinOps: Estrategias de ahorro en la nube',
    event: 'AWS Community Day Spain 2024',
    date: '2024-10',
    url: 'https://github.com/kaskol10/awscommunitydayspain2024-cloudfinops-slides',
    link: 'slides',
  },
  {
    title: 'Cloud FinOps: Experiencias en el mundo real',
    event: 'KCD Spain 2023',
    date: '2023-10-12',
    url: 'https://youtu.be/ePBn8cE-_uI?si=UjmifB0InyTss5Qy',
    link: 'video',
  },
  {
    title: 'Made Load Testing Dev-Friendly Again! When K6 meets Argo',
    event: 'KCD Munich 2022',
    date: '2022-10-12',
    url: 'https://docs.google.com/presentation/d/1ujIw4NCcU3M2CVviTZC5GvbPjSvylTDqiCPMqxWUb6A/edit?usp=sharing',
    link: 'slides',
  },
  {
    title: 'Cloud FinOps and Sustainability on Kubernetes',
    event: 'Cloud Rejekts 2022',
    date: '2022-04-14',
    url: 'https://youtu.be/S07OdFshwDk?t=18360',
    link: 'video',
  },
  {
    title: 'Cloud FinOps and Sustainability on Kubernetes',
    event: 'WTF is SRE 2022',
    date: '2022-03-28',
    url: 'https://youtu.be/bHRBWbPkuX8',
    link: 'video',
  },
  {
    title: 'Kubernetes Backup y estrategias de migración con Velero',
    event: 'KCD Guatemala 2021',
    date: '2021-11-27',
  },
  {
    title: 'Kubernetes Backup and Migration Strategies with Velero',
    event: 'KCD Italy 2021',
    date: '2021-11-18',
    url: 'https://youtu.be/xe-ZCvbrnoM?list=PLj6h78yzYM2M3cMd-zoDppjMo9eRmQrYU',
    link: 'video',
  },
  {
    title: 'Tag Allocation Strategies',
    event: 'HashiTalks Spain 2021',
    date: '2021-11-04',
    url: 'https://youtu.be/0JdG9kP6EB0?list=PL81sUbsFNc5a9a3tHKJXBqssaU4_nhGpG',
    link: 'video',
  },
  {
    title: 'Running Apache Spark on K8s',
    event: 'KCD Spain 2021',
    date: '2021-06-08',
    url: 'https://youtu.be/UBZqr8q9ygo',
    link: 'video',
  },
  {
    title: 'Kubernetes PSP',
    event: 'Cloud Native Asturias 2020',
    date: '2020-12-21',
    url: 'https://youtu.be/ufDk1LGd3dw',
    link: 'video',
  },
  {
    title: 'From Localhost to Prod',
    event: 'DevFest Spain 2020',
    date: '2020-09-10',
    url: 'https://youtu.be/i2OdR6EfJXg',
    link: 'video',
  },
  {
    title: 'Deploying Spark on the Cloud (GCP, AWS, Azure)',
    event: 'DevFest Asturias 2019',
    date: '2019-11-14',
    url: 'https://youtu.be/HREbuQbuv-k',
    link: 'video',
  },
];
