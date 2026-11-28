/**
 * Content for /gpu-on-kubernetes. Every number here comes from the two posts in `sources`;
 * when a new test is published, add it here and bump `updated`.
 */
export const gpuGuide = {
  title: 'GPU on Kubernetes: a field guide',
  description:
    'How to share NVIDIA GPUs on Kubernetes: HAMi against MIG on H100 hardware, with measured numbers, operating costs and a way to choose.',
  updated: '2026-11-28',
  tested: 'July 2025, two weeks on NVIDIA H100 hardware',
  sources: ['gpu-hami-k8s', 'gpu-operator-mig'],
};

export const comparison: { aspect: string; hami: string; mig: string }[] = [
  {
    aspect: 'How it shares the GPU',
    hami: 'Software: time-slicing with per-pod memory limits',
    mig: 'Hardware: the GPU is split into isolated instances',
  },
  {
    aspect: 'BERT-base training, time per batch',
    hami: '35.3 ms (12 GB slice)',
    mig: '60.0 ms (1g.12gb instance)',
  },
  {
    aspect: 'Changing an allocation',
    hami: 'Restart the job, about 30 seconds; other workloads keep running',
    mig: 'Drain, reconfigure and reboot the node, about 15 minutes; every workload on it moves',
  },
  {
    aspect: 'Running out of GPU memory',
    hami: 'A CUDA out-of-memory error with usage, request size and free memory',
    mig: 'An internal PyTorch assertion with nothing to act on',
  },
  {
    aspect: 'Five identical jobs at once',
    hami: 'All scheduled immediately; finish within 5% of each other',
    mig: 'No interference at all; unused capacity cannot be reclaimed',
  },
  {
    aspect: 'How a pod asks for it',
    hami: 'nvidia.com/gpu: 1 and nvidia.com/gpumem: 12000',
    mig: 'nvidia.com/mig-1g.12gb: 1',
  },
];

export const synthetic: { test: string; hami: string; mig: string }[] = [
  { test: 'Memory bandwidth, GPU internal', hami: '1,667 GB/s', mig: '202 GB/s' },
  { test: 'Matrix multiplication', hami: '45.4 TFLOPS', mig: '4.8 TFLOPS' },
];

/** MIG profiles reported by `nvidia-smi mig -lgip` on an H100. */
export const migProfiles: { name: string; instances: number; memoryGiB: string }[] = [
  { name: '1g.12gb', instances: 7, memoryGiB: '10.75' },
  { name: '1g.24gb', instances: 4, memoryGiB: '21.62' },
  { name: '2g.24gb', instances: 3, memoryGiB: '21.62' },
  { name: '3g.47gb', instances: 2, memoryGiB: '46.38' },
  { name: '4g.47gb', instances: 1, memoryGiB: '46.38' },
  { name: '7g.94gb', instances: 1, memoryGiB: '93.12' },
];

export const chooseHami = [
  'Your users are internal and trusted, such as data science or research teams.',
  'You run long training jobs, where 6 hours against 10 matters.',
  'You change GPU allocations often.',
  'You debug GPU memory problems regularly and want errors you can act on.',
];

export const chooseMig = [
  'You serve external users or have compliance requirements, so hardware isolation is required.',
  'You prefer predictable performance to peak performance.',
  'You can plan allocations in advance.',
  'You can afford maintenance windows for reconfiguration.',
];

export const measureYourself = [
  'Training time with your own models, not synthetic benchmarks.',
  'What the error looks like when a job runs out of GPU memory.',
  'Several users submitting jobs at the same time.',
  'How long a configuration change takes and what it interrupts.',
  'How you debug a failed job with the tools you already have.',
];

export const comingNext = [
  'Multi-node GPU scheduling strategies',
  'Cost optimisation for shared GPU infrastructure',
  'Production monitoring for GPU workloads',
  'Migrating between sharing technologies',
];
