---
id: "cloud-finops-tag-allocation"
title: "Cloud FinOps — Part 2: Tag Allocation Strategy"
description: "A detailed guide on implementing an effective tag allocation strategy for cloud resources as part of FinOps culture"
date: "2021-11-15"
categories:
  - cloud
  - finops
  - best-practices
tags:
  - cloud-cost
  - finops
  - tag-strategy
  - platform-engineering
  - devops
cover: "covers/flowchart.webp"
series: "Cloud FinOps"
---

> This article was originally published on [Medium - Empathy.co](https://medium.com/empathyco/tag-allocation-strategy-part-2-3c7f8595186a).

In [Part 1 of this series](/posts/cloud-finops-principles), we explored Cloud FinOps principles and key milestones. Now, let's dive deep into a crucial step in the _Inform_ phase of FinOps culture: creating a tag allocation strategy.

## Motivation

Managing cloud resource costs becomes challenging without proper resource tagging. When investigating billing spikes, identifying resources by team or workload can be tedious without consistent tag allocation. Establishing mandatory tags and enforcement tools is essential for preventing untagged resources and maintaining financial visibility.

## Strategy Basics

The three key pillars for building an effective tag allocation strategy are:

### 1. Communicate the Plan
- Create a company-wide strategy
- Involve all teams
- Use consistent patterns:
  - Team
  - Service
  - Business Unit/Cost Centre
  - Organisation

### 2. Keep it Simple
- Start with 3-5 core areas
- Focus on essential cost tracking
- Build complexity gradually

### 3. Formulate Questions 
- Which business unit within the organisation should this cost be charged to?
- Which cost centres are driving your costs up?
- How much does it cost to operate a product that a certain team is responsible for?
- Are you able to establish which costs are non-production and safe to turn off?

Some tags that companies with successful FinOps implement:

- A cost centre/business unit tag that clearly defines where the costs of the resource should be allocated within the organisation.
- A service/workload name tag that identifies which business service the resource belongs to.
- A resource owner tag to help identify the individual/team responsible for the resource.
- A name tag to help identify the resource using a friendlier identifier than the one given to you by your cloud services provider.
- An environment tag to help determine cost differences among development, test, staging, production, etc.

Some optional tags:

- A tier tag to identify the part of the service layer the resource belongs to (like frontend, backend, or web).
- A data classification tag to help identify the type of data contained on the resource.

## Mandatory Tags for Cloud Resources 

![Mandatory Tags for Cloud Resources](/images/posts/mandatory-tags.webp) 

Upper camel case (initial uppercase letter) validation.

## Optional Tags for Cloud Resources 

![Optional Tags for Cloud Resources](/images/posts/optional-tags.webp) 

Upper camel case (initial uppercase letter) validation.

## Mandatory Tags for Kubernetes Resources 

Kubernetes resources should be tagged properly too. In this case, Kubernetes labels will be used instead of tags.

![Mandatory Tags for Kubernetes Resources](/images/posts/mandatory-tags-k8s.webp) 

Valid label values:
- must be 63 characters or less (can be empty),
- unless empty, must begin and end with an alphanumeric character, lowercase ([a-z0–9]),
- could contain dashes (-), underscores (_), dots (.), and alphanumerics between.

## Tag Hygiene

By maintaining tag hygiene, we eliminate the risk of working with inaccurate data, which would throw off the accuracy of the decisions. For instance, if a team uses the tag value ‘prod’ and another uses ‘production’, these tags would be grouped differently.

Tags should be done on code to ensure consistency and avoid human error. Besides, tagging correctly can avoid the usual scenario of ‘This resource doesn’t belong to me’ (CloudCustodian can help here, implemented some months ago to maintain tag hygiene).

In the next diagram, we can review the flow to maintain a strong tag allocation strategy using a GitOps approach.

## Flowchart

![Flowchart](/images/posts/flowchart.webp)
![Generic Pipeline](/images/posts/generic-pipeline.webp)

## To sum up

Providing a good tag allocation strategy is fundamental for allocating the usage of resources and billing. It also allows us to identify possible undesired bills and provide the feedback necessary to reallocate the bill to workloads/resources.

A tag allocation strategy by itself is not enough; some other actions are essential to enforce and maintain tag hygiene. With these actions in place, it’s a good starting point to move on to the next topic, Cost Report.

## Future

- Mature tagging in next iterations
- Enforce and maintain hygiene in Kubernetes workloads

Like tagging cloud resources, containers without any identifiers make it hard from the outside to determine what is what. In the container world, the containers should be labelled. Therese labels form the identification that we can use to allocate costs. Namespaces for teams, or for specific services, allow us to create a coarse-grained cost allocation group.

Stay tuned! In the third post in this four-part series, the focus will be the Cloud Report, from a cloud and a Kubernetes perspective.

P.S: [This post has been part of HashiTalks Spain 2021 too. You can watch the video here.](https://www.youtube.com/watch?v=pm7DzYLVgkw&t=6984s)

## References
- [Resource naming and tagging decision guide](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming-and-tagging-decision-guide)
- [Use automation to proactively tag resources](https://docs.aws.amazon.com/pdfs/whitepapers/latest/tagging-best-practices/tagging-best-practices.pdf#use-automation-to-proactively-tag-resources)
- [Cloud FinOps: Collaborative, Real-Time Cloud Financial Management](https://www.finops.org/resources/finops-book/)
- [The guide to Kubernetes Labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
- [Conftest](https://www.conftest.dev/)
- [Conftest Policy Checking | Atlantis](https://www.conftest.dev/docs/policy-checking/)
- [Kubernetes Recommended Labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)
- [Open Policy Agent | Conftest Samples](https://www.conftest.dev/docs/policy-checking/)
- [Hashitalks Spain 2021: Tag Allocation Strategies](https://www.youtube.com/watch?v=pm7DzYLVgkw&t=6984s)

## About the Author

I'm a Platform Engineer Architect specializing in cloud-native technologies and engineering leadership. With extensive experience in cloud cost optimization and FinOps practices, I help organizations build efficient and cost-effective cloud infrastructure.

[Connect with me on LinkedIn](https://www.linkedin.com/in/ramiroalvfer/) or [contact me](/contact) for more information.

Stay tuned for Part 3 of this series, where we'll explore Cloud Cost Reporting from both cloud and Kubernetes perspectives.
