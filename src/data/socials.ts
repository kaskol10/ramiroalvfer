export const site = {
  name: 'Ramiro Alvarez',
  persona: 'K8sCockpit',
  title: 'Staff Platform Engineer · Lead Architecture Board @ Empathy.co',
  claim: 'First Golden Kubestronaut in Spain',
  description:
    'Platform engineer shipping Kubernetes tooling, self-hosted AI, and products like CanISpot.ai and MiniRSS.ai — CloudNativePG, FinOps, GPUs, inference, and observability. Co-founder & advisor at Resizes.',
  url: 'https://k8scockpit.tech',
  email: 'contact@k8scockpit.com',
  /** Personal address used on the downloadable CV */
  cvEmail: 'ramiroalvfer@gmail.com',
  location: 'Asturias, Spain',
  portrait: '/images/KCDSpainPic.jpeg',
  logo: '/images/k8scockpitlogo.png',
} as const;

export const socials = {
  github: 'https://github.com/kaskol10',
  linkedin: 'https://www.linkedin.com/in/ramiroalvfer/',
  buyMeACoffee: 'https://www.buymeacoffee.com/ramiroalvfer',
  canispot: 'https://canispot.ai/',
  minirss: 'https://minirss.ai/',
} as const;

/** Cloudflare-native broadcast: Pages Function + D1 + Turnstile (+ optional Resend). */
export const newsletter = {
  enabled: true,
  endpoint: '/api/subscribe',
} as const;
