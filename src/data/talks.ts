export type Talk = {
  title: string;
  event: string;
  date: string;
  url?: string;
  session?: string;
};

export const talks: Talk[] = [
  {
    title: 'From Ops to DevOps to Platform Engineering',
    event: 'Asturias Software Crafters',
    date: '2024-11',
    url: 'https://github.com/kaskol10/asturiassoftwarecrafters-noviembre-2024-ops-slides',
    session: 'SX 12',
  },
  {
    title: 'Cloud FinOps: Experiencias en el mundo real',
    event: 'KCD Spain 2023',
    date: '2023-10-12',
    url: 'https://youtu.be/ePBn8cE-_uI?si=UjmifB0InyTss5Qy',
    session: 'SX 11',
  },
  {
    title: 'Made Load Testing Dev-Friendly Again! When K6 meets Argo',
    event: 'KCD Munich 2022',
    date: '2022-10-12',
    url: 'https://docs.google.com/presentation/d/1ujIw4NCcU3M2CVviTZC5GvbPjSvylTDqiCPMqxWUb6A/edit?usp=sharing',
    session: 'SX 10',
  },
  {
    title: 'Cloud FinOps and Sustainability on Kubernetes',
    event: 'Cloud Rejekts 2022',
    date: '2022-04-14',
    url: 'https://youtu.be/S07OdFshwDk?t=18360',
    session: 'SX 09',
  },
  {
    title: 'Cloud FinOps and Sustainability on Kubernetes',
    event: 'WTF is SRE 2022',
    date: '2022-03-28',
    url: 'https://youtu.be/bHRBWbPkuX8',
    session: 'SX 08',
  },
  {
    title: 'Kubernetes Backup y estrategias de migración con Velero',
    event: 'KCD Guatemala 2021',
    date: '2021-11-27',
    url: 'https://youtu.be/bHRBWbPkuX8',
    session: 'SX 07',
  },
  {
    title: 'Kubernetes Backup and Migration Strategies with Velero',
    event: 'KCD Italy 2021',
    date: '2021-11-18',
    url: 'https://youtu.be/xe-ZCvbrnoM?list=PLj6h78yzYM2M3cMd-zoDppjMo9eRmQrYU',
    session: 'SX 06',
  },
  {
    title: 'Tag Allocation Strategies',
    event: 'HashiTalks Spain 2021',
    date: '2021-11-04',
    url: 'https://youtu.be/0JdG9kP6EB0?list=PL81sUbsFNc5a9a3tHKJXBqssaU4_nhGpG',
    session: 'SX 05',
  },
  {
    title: 'Running Apache Spark on K8s',
    event: 'KCD Spain 2021',
    date: '2021-06-08',
    url: 'https://youtu.be/UBZqr8q9ygo',
    session: 'SX 04',
  },
  {
    title: 'Kubernetes PSP',
    event: 'Cloud Native Asturias 2020',
    date: '2020-12-21',
    url: 'https://youtu.be/ufDk1LGd3dw',
    session: 'SX 03',
  },
  {
    title: 'From Localhost to Prod',
    event: 'DevFest Spain 2020',
    date: '2020-09-10',
    url: 'https://youtu.be/i2OdR6EfJXg',
    session: 'SX 02',
  },
  {
    title: 'Deploying Spark on the Cloud (GCP, AWS, Azure)',
    event: 'DevFest Asturias 2019',
    date: '2019-11-14',
    url: 'https://youtu.be/HREbuQbuv-k',
    session: 'SX 01',
  },
];
