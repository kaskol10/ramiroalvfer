---
id: "hami-vs-mig-real-world-testing"
title: "HAMi vs MIG: 2 Weeks of Real Testing on H100 GPUs"
description: "Real-world comparison of HAMi and MIG GPU sharing technologies. Performance benchmarks, operational complexity, and debugging experience with actual workloads on H100 hardware."
date: "2025-07-16"
categories:
  - engineering
  - kubernetes
  - gpu
tags:
  - gpu
  - kubernetes
  - nvidia
  - mig
  - hami
  - h100
  - production
  - testing
cover: "covers/hamivsmig.jpg"
---

## The GPU Sharing Question That Started This

After my [previous post about MIG setup](/posts/gpu-operator-mig) gained traction on [Reddit](https://www.reddit.com/r/kubernetes/comments/1l9l8gz/multitenant_gpu_workloads_are_finally_possible/), the community asked a critical question: **How does MIG compare to HAMi for real workloads?**

I spent 2 weeks testing both technologies on H100 hardware with actual ML workloads. Here's what surprised me.

## Three Things That Surprised Me

### 1. Synthetic Benchmarks Are Misleading
**Expected:** 4x performance difference based on synthetic benchmarks  
**Reality:** 1.7x performance difference with real BERT training  
**Lesson:** Always test with your actual workloads

### 2. Error Messages Matter More Than Performance Numbers
**HAMi:** Clear, actionable CUDA out-of-memory errors with specific usage details  
**MIG:** Cryptic internal PyTorch assertions that waste debugging time  
**Impact:** When things break at 3 AM, clear error messages save hours

### 3. MIG Operations Are an SRE Nightmare
**HAMi:** 30-second job restart for configuration changes  
**MIG:** 15-minute node reboot cycle affecting all workloads  
**Reality:** MIG's operational immaturity in Kubernetes makes simple changes painful

## Real-World Performance Results

### BERT Training: The Transformer Test

I trained BERT-base for 100 epochs with 32-sequence batches on both technologies.

| Technology | Average Time per Batch | Real Performance Difference |
|------------|------------------------|----------------------------|
| **HAMi 12GB** | 35.3ms | **70% faster** |
| **MIG 1g.12gb** | 60.0ms | Baseline |

Training a custom model overnight? HAMi finishes in 6 hours, MIG takes 10 hours. This is not only time but more cost too.

**The consistency story:**
```bash
# HAMi performance (consistent across epochs)
HAMi - Epoch 70: 32.5ms
HAMi - Epoch 80: 33.1ms
HAMi - Epoch 90: 33.6ms

# MIG performance (predictably stable)
MIG - Epoch 70: 58.7ms
MIG - Epoch 80: 58.8ms
MIG - Epoch 90: 59.3ms
```

HAMi delivered consistent performance with software time-slicing. MIG provided predictably stable performance through hardware isolation. Both approaches worked reliably, just at different speeds.

## The Debugging Experience That Actually Matters

I deliberately triggered memory pressure to see how each technology handles failures.

### When HAMi Hits Memory Limits
```bash
[HAMI-core ERROR]: Device 0 OOM 12889096192 / 12582912000
Failed at 22 GB: CUDA out of memory. Tried to allocate 512.00 MiB. 
GPU 0 has a total capacity of 11.72 GiB of which 220.00 MiB is free.
Including non-PyTorch memory, this process has 11.50 GiB memory in use.
```

**Analysis:** Clear error with exact memory usage, allocation attempt size, and available memory. Your data scientist knows exactly what to fix.

### When MIG Hits Memory Limits
```bash
Failed at 21 GB: NVML_SUCCESS == r INTERNAL ASSERT FAILED at 
"/opt/conda/conda-bld/pytorch_1708025847130/work/c10/cuda/CUDACachingAllocator.cpp":830, 
please report a bug to PyTorch.
```

**Analysis:** Cryptic internal assertion with no actionable information. The on-call engineer gets paged at 3 AM, sees this error, and has no idea what to do. With HAMi, they know exactly what happened and how to fix it.

This error message quality alone makes HAMi worth considering for teams that value debugging efficiency over perfect isolation.

## Multi-User Reality: How They Handle Contention

**Test:** 5 identical training jobs submitted simultaneously

### HAMi Multi-User Behavior
- All jobs scheduled immediately
- Time-slicing managed fairly by scheduler lock
- Jobs completed within 5% variance of each other
- No job starvation observed
- **Trade-off:** Brief scheduling delays when many jobs compete for time slices

### MIG Multi-User Behavior  
- Jobs ran in complete hardware isolation
- Zero interference between workloads
- Identical performance regardless of other activity
- **Trade-off:** Fixed resource allocation means unused capacity can't be reclaimed

**The reality:** HAMi optimizes for maximum utilization through intelligent scheduling. MIG optimizes for predictable performance through hardware guarantees.

## Operational Complexity: The SRE Perspective

### Changing Resource Allocations

**HAMi workflow:**
```bash
kubectl delete job training-job
kubectl apply -f training-job-updated.yaml  # New memory allocation
# Impact: 30-second job restart, other workloads unaffected
```

**MIG workflow:**
```bash
# Full node maintenance cycle required:
1. kubectl drain gpu-node-1           # Evacuate ALL workloads  
2. Reconfigure MIG profiles           # Modify hardware partitions
3. Reboot node                        # Apply changes (mandatory)
4. kubectl uncordon gpu-node-1        # Resume scheduling
# Impact: 15-minute downtime affecting entire node
```

**The SRE reality:** MIG in Kubernetes feels operationally immature. Simple configuration changes require maintenance windows, node labeling, and complex coordination. HAMi treats GPU resources like standard Kubernetes resources.

### Monitoring and Debugging

**Common challenges (both technologies):**
- DCGM metrics show node/instance-level data only
- Missing per-pod GPU utilization metrics
- Custom monitoring required for detailed workload insights

**HAMi advantages:**
- Standard Kubernetes debugging workflows
- Clear error messages with actionable details
- Application logs contain useful GPU context

**MIG advantages:**
- Hardware isolation simplifies problem identification
- Per-instance metrics via `nvidia-smi mig -lgip`
- No cross-workload interference during troubleshooting

## Simple Decision Framework

Most teams should start with HAMi unless they have specific compliance requirements

**Choose HAMi if:**
- You run overnight training jobs (6 hours vs 10 hours matters)
- You debug GPU memory issues regularly (clear error messages save hours)
- You need to change GPU allocations frequently (30 seconds vs 15 minutes)
- You have trusted internal users (data science teams, research groups)

**Choose MIG if:**
- You have external users or compliance requirements (hardware isolation is non-negotiable)
- You prefer predictable performance over peak performance
- You can plan resource allocations in advance
- You have the operational overhead budget for complex reconfiguration workflows

## Supporting Evidence: Synthetic Benchmarks

*These controlled tests explain the theoretical differences but don't predict real-world performance*

### Memory Bandwidth Performance

| Configuration | GPU Internal (GB/s) |
|---------------|---------------------|
| HAMi 12GB     | 1,667              |
| MIG 1g.12gb   | 202                |

### Compute Performance  

| Configuration | Matrix Multiplication (TFLOPS) |
|---------------|---------------------------------|
| HAMi 12GB     | 45.4                           |
| MIG 1g.12gb   | 4.8                            |

**Key insight:** Synthetic benchmarks showed 8x performance differences, but real BERT training achieved only 1.7x improvement. This proves why testing with actual workloads is critical.

## Getting Started: Test Both Approaches

### Week 1: HAMi Evaluation
```bash
# Install HAMi
helm repo add hami-charts https://project-hami.github.io/HAMi/
helm install hami hami-charts/hami -n kube-system

# Test with your actual training job
kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: Job
metadata:
  name: bert-training-hami
spec:
  template:
    spec:
      containers:
      - name: training
        image: your-training-image
        resources:
          limits:
            nvidia.com/gpu: 1
            nvidia.com/gpumem: 12000
EOF
```

### Week 2: MIG Evaluation  
```bash
# Configure MIG profiles (prepare for operational complexity)
kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: mig-config
  namespace: gpu-operator
data:
  config.yaml: |
    version: v1
    mig-configs:
      test-config:
        - devices: [0]
          mig-enabled: true
          mig-devices:
            "1g.12gb": 2
EOF

kubectl label nodes gpu-node-1 nvidia.com/mig.config=test-config

# Run same training job for comparison
kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: Job
metadata:
  name: bert-training-mig
spec:
  template:
    spec:
      containers:
      - name: training
        image: your-training-image
        resources:
          limits:
            nvidia.com/mig-1g.12gb: 1
EOF
```

### What to Measure
1. **Training time with your actual models** (ignore synthetic benchmarks)
2. **Error handling experience** during memory pressure
3. **Multi-user scenarios** with your team's usage patterns
4. **Configuration change complexity** and acceptable downtime
5. **Debugging workflows** when things inevitably break

## My Honest Recommendation

**For most internal ML teams:** Start with HAMi, keep it simple. The 70% performance improvement matters for iteration speed, the error messages save debugging time, and the operational model fits Kubernetes better.

**For multi-tenant platforms:** Although the operational complexity is a nightmare, I'd choose MIG. Hardware isolation and compliance guarantees are worth the overhead when serving external users.

**Hybrid approach:** Use HAMi for training clusters (performance-critical) and MIG for inference serving (isolation-critical).

**Most importantly:** Test with YOUR workloads. These results show what's possible, but your specific models, team dynamics, and operational requirements determine the right choice.

## What's Next

I'm continuing to test these technologies in production-scale scenarios. Upcoming posts will cover:
- Multi-node GPU scheduling strategies
- Cost optimization for shared GPU infrastructure
- Production monitoring best practices
- Migration strategies between technologies

## Resources

**Reproduce these tests:** [github.com/kaskol10/gpu-benchmark](https://github.com/kaskol10/gpu-benchmark)  
**HAMi project:** [github.com/Project-HAMi/HAMi](https://github.com/Project-HAMi/HAMi)  
**MIG setup guide:** [NVIDIA MIG User Guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/)  
**Previous MIG post:** [Setting Up MIG on H100](/posts/gpu-operator-mig)  
**Community discussion:** [Reddit r/kubernetes thread](https://www.reddit.com/r/kubernetes/comments/1l9l8gz/multitenant_gpu_workloads_are_finally_possible/)

---

*Results based on 2 weeks of testing with H100 hardware. Performance will vary based on your workloads, cluster configuration, and operational requirements.*


