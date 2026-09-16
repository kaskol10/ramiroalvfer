export type Certification = {
  name: string;
  issuer: string;
  date: string;
  url?: string;
  highlight?: boolean;
};

export const certifications: Certification[] = [
  {
    name: 'AWS Certified Generative AI Developer — Professional',
    issuer: 'AWS',
    date: '2026-01-04',
    url: '/images/certs/AWSCertifiedGenerativeAIDeveloper-Professional.pdf',
  },
  {
    name: 'Certified Cloud Native Platform Engineering',
    issuer: 'Linux Foundation',
    date: '2025-11-29',
    url: '/images/certs/cnpe.pdf',
  },
  {
    name: 'Golden Kubestronaut',
    issuer: 'Linux Foundation',
    date: '2025-09-30',
    url: 'https://www.credly.com/badges/3b37018d-3a90-4e3d-b292-91c2ca159d08/public_url',
    highlight: true,
  },
  {
    name: 'Exam Contributor: CNPA',
    issuer: 'Linux Foundation',
    date: '2025-06-11',
    url: '/images/certs/cnpa_contributor.png',
  },
  {
    name: 'Certified Cloud Native Platform Engineering Associate',
    issuer: 'Linux Foundation',
    date: '2025-06-11',
    url: '/images/certs/cnpa.pdf',
  },
  {
    name: 'Understanding the EU Cyber Resilience Act (LFEL1001)',
    issuer: 'Linux Foundation',
    date: '2025-04-21',
    url: '/images/certs/cra.pdf',
  },
  {
    name: 'Certified Open Source Developer for Enterprise (CODE)',
    issuer: 'Linux Foundation',
    date: '2025-04-01',
    url: '/images/certs/CODE.pdf',
  },
  {
    name: 'Istio Certified Associate (ICA)',
    issuer: 'Linux Foundation',
    date: '2025-03-01',
    url: '/images/certs/istio.pdf',
  },
  {
    name: 'Linux Foundation Certified System Administrator (LFCS)',
    issuer: 'Linux Foundation',
    date: '2025-02-14',
    url: '/images/certs/LFCS.pdf',
  },
  {
    name: 'Cilium Certified Associate',
    issuer: 'Linux Foundation',
    date: '2025-01-30',
    url: '/images/certs/cilium.pdf',
  },
  {
    name: 'Certified Backstage Associate (CBA)',
    issuer: 'Linux Foundation',
    date: '2025-01-19',
    url: '/images/certs/cba.pdf',
  },
  {
    name: 'Kyverno Certified Associate',
    issuer: 'Linux Foundation',
    date: '2025-01-09',
    url: '/images/certs/KyvernoCertifiedAssociate.pdf',
  },
  {
    name: 'OpenTelemetry Certified Associate',
    issuer: 'Linux Foundation',
    date: '2024-12-19',
    url: '/images/certs/OTEL.pdf',
  },
  {
    name: 'Kubestronaut',
    issuer: 'Linux Foundation',
    date: '2024-09-30',
    url: '/images/certs/Kubestronaut.png',
    highlight: true,
  },
  {
    name: 'Certified Kubernetes Security Specialist (CKS)',
    issuer: 'Linux Foundation',
    date: '2024-09-30',
    url: '/images/certs/CKS.pdf',
  },
  {
    name: 'AWS Certified AI Practitioner',
    issuer: 'AWS',
    date: '2024-09-12',
    url: '/images/certs/AWSCertifiedAIPractitioner.pdf',
  },
  {
    name: 'Kubernetes and Cloud Native Security Associate (KCSA)',
    issuer: 'Linux Foundation',
    date: '2024-09-09',
    url: '/images/certs/KCSA.pdf',
  },
  {
    name: 'Certified GitOps Associate (CGOA)',
    issuer: 'Linux Foundation',
    date: '2024-08-31',
    url: '/images/certs/CGOA.pdf',
  },
  {
    name: 'FinOps Certified Engineer (FOCE)',
    issuer: 'Linux Foundation',
    date: '2024-08-29',
    url: '/images/certs/FOCE.png',
  },
  {
    name: 'Scaleway Foundations',
    issuer: 'Scaleway',
    date: '2024-08-21',
    url: '/images/certs/scalewayFoundations.pdf',
  },
  {
    name: 'Certified Argo Project Associate',
    issuer: 'Linux Foundation',
    date: '2024-03-06',
    url: '/images/certs/capa.pdf',
  },
  {
    name: 'Prometheus Certified Associate',
    issuer: 'Linux Foundation',
    date: '2022-09-01',
    url: '/images/certs/PrometheusCertifiedAssociate.pdf',
  },
  {
    name: 'Neo4j Certified Professional',
    issuer: 'Neo4j',
    date: '2022-03-14',
    url: '/images/certs/Neo4jProfessional.pdf',
  },
  {
    name: 'Kubernetes and Cloud Native Associate (KCNA)',
    issuer: 'Linux Foundation',
    date: '2022-01-26',
    url: '/images/certs/KCNA.pdf',
  },
  {
    name: 'AWS Solutions Architect Professional',
    issuer: 'AWS',
    date: '2021-10-25',
    url: '/images/certs/AWSCertifiedSolutionsArchitectProfessional.pdf',
  },
  {
    name: 'FinOps Certified Practitioner (FOCP)',
    issuer: 'Linux Foundation',
    date: '2021-10-03',
    url: '/images/certs/FOCP.pdf',
  },
  {
    name: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Linux Foundation',
    date: '2021-07-28',
    url: '/images/certs/CKA.pdf',
    highlight: true,
  },
  {
    name: 'Chaos Engineering Practitioner',
    issuer: 'Gremlin',
    date: '2021-07-22',
    url: '/images/certs/GremlinChaosEngineering.pdf',
  },
  {
    name: 'AWS DevOps Engineer Professional',
    issuer: 'AWS',
    date: '2021-05-25',
    url: '/images/certs/DevOpsEngineerProfessional.pdf',
  },
  {
    name: 'Alibaba Cloud DevOps Engineer',
    issuer: 'Alibaba Cloud',
    date: '2021-01-14',
    url: '/images/certs/alibaba_devops_cert.png',
  },
  {
    name: 'Using Kubernetes to Manage Containers and Cluster Resources',
    issuer: 'Alibaba Cloud',
    date: '2021-01-11',
    url: '/images/certs/alibaba_k8s.png',
  },
  {
    name: 'MongoDB Certified DBA Associate',
    issuer: 'MongoDB',
    date: '2020-09-01',
    url: '/images/certs/mongodba.pdf',
  },
  {
    name: 'Microsoft Azure Fundamentals',
    issuer: 'Microsoft',
    date: '2020-07-01',
    url: '/images/certs/AZ900.pdf',
  },
  {
    name: 'HashiCorp Terraform Associate',
    issuer: 'HashiCorp',
    date: '2020-06-01',
    url: '/images/certs/terraformAssociate.pdf',
  },
  {
    name: 'Elastic Certified Engineer',
    issuer: 'Elastic',
    date: '2020-04-10',
    url: '/images/certs/ElasticCertified.pdf',
  },
  {
    name: 'Google Cloud Professional Cloud Architect',
    issuer: 'Google Cloud',
    date: '2019-12-27',
    url: '/images/certs/GoogleProfessionalCloudArchitect.pdf',
  },
  {
    name: 'Certified Kubernetes Application Developer (CKAD)',
    issuer: 'Linux Foundation',
    date: '2019-07-01',
    url: '/images/certs/ckad.pdf',
    highlight: true,
  },
  {
    name: 'Google Cloud Associate Cloud Engineer',
    issuer: 'Google Cloud',
    date: '2019-04-01',
    url: '/images/certs/GoogleCloudAssociateCloudEngineer.pdf',
  },
  {
    name: 'AWS Developer Associate',
    issuer: 'AWS',
    date: '2018-12-01',
    url: '/images/certs/AWSDeveloper.pdf',
  },
  {
    name: 'AWS Solutions Architect Associate',
    issuer: 'AWS',
    date: '2018-11-01',
    url: '/images/certs/SolutionsArchitect.pdf',
  },
  {
    name: 'AWS SysOps Administrator Associate',
    issuer: 'AWS',
    date: '2018-09-01',
    url: '/images/certs/AWS-SysOps-Administrator-Associate.png',
  },
  {
    name: 'Jenkins Engineer',
    issuer: 'CloudBees',
    date: '2017-12-21',
    url: '/images/certs/JenkinsEngineer.png',
  },
];

export const highlightCerts = certifications.filter((c) => c.highlight);
