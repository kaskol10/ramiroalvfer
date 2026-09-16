---
id: "cloud-finops-kubernetes-cost"
title: "Cloud FinOps — Part 4: Kubernetes Cost Report"
description: "A detailed guide on implementing cost visibility for Kubernetes workloads, including architecture, implementation, and practical dashboards"
date: "2022-06-09"
categories:
  - cloud
  - finops
  - kubernetes
tags:
  - cloud-cost
  - finops
  - kubernetes
  - monitoring
  - platform-engineering
cover: "covers/high-level-diagram.webp"
series: "Cloud FinOps"
---

> This article was originally published on [Medium - Empathy.co](https://medium.com/empathyco/cloud-finops-part-4-kubernetes-cost-report-b4964be02dc3).

After covering [FinOps Principles](/posts/cloud-finops-principles), [Tag Allocation Strategy](/posts/cloud-finops-tag-allocation), and Cloud Cost Report, let's explore gaining cost visibility on Kubernetes Workloads.

## Motivation

Nowadays, a lot of companies run their workloads on Kubernetes because there are many benefits to choosing Kubernetes as the main solutions orchestrator for microservices. Although there is some visibility of cloud costs from the main public cloud provider, costs from within the Kubernetes cluster tend not to be clearly defined.

Some solutions have already been created to tackle this lack of data, such as Vantage.sh and Kubecost, and gain Kubernetes Cost Visibility. Before going ahead with this solution proposal, the Platform Engineering team Empathy.co explored two Kubecost options: Kubecost as a Prometheus metric explorer and the Kubecost Helm Chart.

![Kubecost Prometheus Metrics Explorer](/images/posts/kubecost-metrics-explorer.webp)

![Kubecost Helm Chart](/images/posts/kubecost-helm-chart.webp)

![AWS Cost Explorer Daily Cost EC2 Test Account](/images/posts/aws-daily-cost-test.webp)

![AWS Cost Explorer Daily Cost EC2 & EKS Free Test Account](/images/posts/aws-daily-cost-test-k8s.webp)

In the graphs above, Kubecost doesn’t show the same cost per cluster, nor is the price correlated with those in AWS Cost Explorer:

- Kubecost reports approximately $65/day
- AWS Cost Explorer reports around $23/day for EC2 instances and approximately $2.40/day for EKS Free

It’s a significant difference, therefore we investigated other approaches as we began to create our own dashboards, based on autoscaling instance type info.

![Grafana Dashboard Cluster Cost Hourly based on Autoscaling info for the first week of December 2021](/images/posts/grafana-hourly-cost.webp)

![AWS Cost Explorer for first week of December 2021](/images/posts/aws-cost-explorer.webp)

Calculating the average of the first week of December 2021, based on the Autoscaling instance type, the corresponding costs using the following tools are:

- **Grafana Dashboard**
  - $0.795/hour * 24hrs/day * 7 days = **$133.56/week**
- **AWS Cost Explorer**
  - Around **$134.36/week**

Based on these calculations, Grafana Dashboard provides a more accurate cost overview than Kubecost does. At the same time, it does not require any type of dependency and the solution is completely autonomous.

## Architecture 

### Basic Structure

AWS Cost Explorer API incurs a charge of $0.01 per each paginated API request, and does not provide information in real time.

Based on cluster autoscaler info, we can apply a service to the AWS Pricing API to determine the cost per month/day/hour. Additionally, we could identify the equivalent core — GB ram per node. The goal is to have a fairly approximate idea of workload cost.

### High Level Diagram

![High Level Diagram](/images/posts/high-level-diagram.webp)

The above approach looks pretty simple: an app that exports cost metrics to Prometheus provides all the necessary dashboards in Grafana. Prometheus and Grafana are part of our monitoring stack, as they are for the vast majority of software companies nowadays. Therefore, after testing the solution at Empathy.co, we decided to make it open source so as to contribute to the community and embrace feedback.

Check out our repository on how to implement Kubernetes Cost Report using an EKS cluster.

The Kubernetes Cost allocation can be split into multiple layers:

1. Cluster Cost: The sum of the cost of each node
2. Namespace Cost:
- The Namespace Cost concept is usually used on Kubernetes to handle a group of pods, which can run in multiple nodes. The cost can be split into:
    - Namespace Resource Requests: The sum of resources requests for each pod
    - Namespace Resources Used: The sum of resources used for all the pods in that namespace
3. Pod Cost:
    - Each pod requests different resources, so the cost can be split into:
        - Resource Requests: What each pod requests
        - Resources Used: What each pod really used

The following diagram illustrates the difference between requests and usage.

![Cluster Cost](/images/posts/cluster-cost.webp)

Resource Requests are those that are added to the final invoice, but knowing the usage allows underutilization to be measured and determine how much can be saved by doing a pod rightsizing.

### Total Cluster Cost & Taxonomy

Knowing the instance type and the availability zone, the cost is simply a sum between different values based on the cost report deployment (the value of which is calculated by the AWS Pricing API every 12 hours).

![cost-taxonomy](/images/posts/cost-taxonomy.webp)

The total cluster cost presented above can be divided into a number of different costs, attending to their origins (that is, the resources they originate from):

- **Usage Costs**: As outlined above, these costs are related to the actual usage of resources coming from each pod.
- **Request Costs**: Stemming from the resource requests of each pod, as these requested resources have to be guaranteed.
- **Underutilization Costs**: As explained above, the difference between the resources a pod requests and those that it actually uses is labeled as underutilization. This difference is reserved for a given pod, even though it is not using it; so, no other pod can make use of it. In a sense, said pod is “hoarding“ but not actually using these resources. Hence, these costs can be calculated as Request Costs/Usage Costs.
- **Available Costs**: Related to the resources that no pod is reserving, hence available for any pod to use, i.e., to accommodate new workloads or spikes in currently running pods. It may seem tempting to reduce Available Costs to zero in order to reduce total costs, yet having a relatively small amount of Available Costs (and, therefore, available resources) is good practice to easily accommodate spikes in workloads or new workloads.
- **Idle Costs**: Originating from resources that are not being used in any sense, these costs encompass both Underutilization Costs and Available Costs (resources that are available for pod to use, but are not actually in use). These costs can be calculated as Underutilization Costs + Available Costs. The ideal situation would be to eliminate Underutilization Costs, so that Idle Costs = Available Costs. This situation basically means that no workload is “hoarding“ resources, and the idle resources that are at the ready can be used for spikes in workloads or new workloads.
- **Shared Costs**: These costs arise from resources that the actual Kubernetes cluster reserves for itself in order to work properly. No workload can use these resources, yet it is a price that must be paid for the cluster to work (think of these costs as the service costs, e.g., in your water bill — service availability, sewer charges, etc.). So, while we call them “Shared“ in the sense that they are not associated exclusively with any workload, they are costs that have to be paid by all workloads, in order to have a Kubernetes cluster. There is much more to be learned about [allocatable resources](https://learnk8s.io/allocatable-resources).

To summarize the taxonomy, here’s a visual representation of one node and one pod running in that node:

![Container Usage](/images/posts/container-usage.webp)


## Implementation

### Open Source Solution

We've made our solution open source:
- [GitHub Repository](https://github.com/empathyco/kubernetes-cost-report)
- [Helm Chart](https://github.com/empathyco/helm-charts/tree/main/charts/cost-report)

### Grafana Dashboards

Two dashboards available:
1. **Executive Summary**
   - High-level cost overview
   - Key metrics visualization

2. **Detailed Cost Report**
   - In-depth analysis
   - Resource utilization
   - Cost breakdown

## Future Developments

1. **Enhanced Cost Analysis**
   - Underutilization cost impact
   - Spot instance optimization
   - Minute-precision tracking

2. **Sustainability Focus**
   - Energy efficiency reports
   - Carbon footprint tracking

3. **Advanced Features**
   - Multi-cluster support
   - Custom pricing models
   - Predictive analytics

## Key Takeaways

1. **Improved Visibility**
   - Real-time cost tracking
   - Workload-level insights

2. **Actionable Insights**
   - Resource optimization
   - Cost allocation
   - Budget planning

3. **Business Value**
   - Data-driven decisions
   - Resource accountability
   - Cost optimization

## Resources

- [Analyzing your costs with AWS Cost Explorer — AWS Cost Management](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html)
- [GitHub — kubecost/cost-analyzer-helm-chart: Kubecost helm chart](https://github.com/kubecost/cost-analyzer-helm-chart)
- [GitHub — cost-model/kubecost-exporter.md at develop · kubecost/cost-model](https://github.com/kubecost/cost-model/blob/develop/docs/kubecost-exporter.md)
- [Prometheus Cheat Sheet — How to Join Multiple Metrics (Vector Matching)](https://iximiuz.com/en/posts/prometheus-vector-matching/)
- [Understanding Kubernetes Limits and Requests | Sysdig](https://sysdig.com/blog/kubernetes-limits-requests/)
- [GitHub — empathyco/kubernetes-cost-report: Cost Report service for Kubernetes](https://github.com/empathyco/kubernetes-cost-report)

## About the Author

I'm a Platform Engineer Architect specializing in cloud-native technologies and engineering leadership. With extensive experience in cloud cost optimization and FinOps practices, I help organizations build efficient and cost-effective cloud infrastructure.

[Connect with me on LinkedIn](https://www.linkedin.com/in/ramiroalvfer/) or [contact me](/contact) for more information.