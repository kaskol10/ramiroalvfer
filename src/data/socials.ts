export const site = {
  name: 'Ramiro Alvarez',
  persona: 'K8sCockpit',
  title: 'Staff Platform Engineer · Lead Architecture Board @ Empathy.co',
  claim: 'First Golden Kubestronaut in Spain',
  /** One-line pitch; reuse it wherever the site needs a headline. */
  pitch: 'I run AI and GPU workloads on Kubernetes, and make them cheaper.',
  description:
    'Staff Platform Engineer running AI and GPU workloads on Kubernetes and cutting what they cost. Golden Kubestronaut, creator of karpenter-optimizer and CanISpot.ai.',
  url: 'https://k8scockpit.tech',
  email: 'ramiroalvfer@gmail.com',
  location: 'Asturias, Spain',
  portrait: '/images/KCDSpainPic.jpeg',
  logo: '/images/k8scockpitlogo.png',
} as const;

export const socials = {
  github: 'https://github.com/kaskol10',
  linkedin: 'https://www.linkedin.com/in/ramiroalvfer/',
  x: 'https://x.com/ramiroalvfer',
  xHandle: '@ramiroalvfer',
  buyMeACoffee: 'https://www.buymeacoffee.com/ramiroalvfer',
  canispot: 'https://canispot.ai/',
  minirss: 'https://minirss.ai/',
} as const;

/** Cloudflare-native broadcast: Pages Function + D1 + Turnstile (+ optional Resend). */
export const newsletter = {
  enabled: true,
  endpoint: '/api/subscribe',
} as const;
