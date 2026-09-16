---
id: "cloud-finops-principles"
title: "Cloud FinOps, Part 1: Principles"
description: "A comprehensive guide to Cloud Financial Operations (FinOps) principles, helping teams optimize cloud costs while balancing speed and quality"
date: "2021-11-02"
categories:
  - cloud
  - finops
  - best-practices
tags:
  - cloud-cost
  - finops
  - cloud-optimization
  - platform-engineering
  - devops
cover: "covers/finops-lifecycle.webp"
series: "Cloud FinOps"
---

> This article was originally published on [Medium - Empathy.co](https://medium.com/empathyco/cloud-finops-part-1-principles-79b88aeeab4f).

FinOps, short for Cloud Financial Operations, helps teams optimise cloud costs to get the most value for their projects. Teams adopt best practices and a collaborative culture to manage cloud operations with greater financial accountability: balancing cost, speed and quality.

When your teams have problems managing their cloud costs, following Cloud FinOps culture is a key solution. It provides financial and operational control and allows cross-functional teams to work together, improving speed and efficiency.

In this four-part blog series, we will share approaches that can help others to adopt Cloud FinOps culture in their company. These approaches are better suited for companies in a Crawl FinOps status. Their purpose is to provide teams with an informed status and to allow the cost of team actions to be quantified.

## Why FinOps?

As DevOps revolutionised development by breaking down silos and increasing agility, FinOps increased the business value of cloud by bringing together technology, business and finance professionals with a new set of processes and culture.

## Cultural Shift and FinOps Team

![FinOps Team Organization](/images/posts/finops-team.webp)

Key organizational principles:
- All teams have a say in FinOps
- Teams have different motivators that drive spending and savings
- Teams need to work together with an understanding of other teams' goals
- FinOps practitioners help align teams to organizational goals

## Common Language: FinOps and Cloud

When distributed teams work together, one very important step is to create a common vocabulary, providing a centralised base of knowledge and definitions. Remember, engineering teams will always focus on performance and financial teams on cost coverage. Discussions between the two teams are often a bit tedious due to a mutual lack of understanding. In the end, their targets are the same, but one team doesn’t know the terminology of the other and vice versa. The main goal is to provide a common terminology, create mutual understanding and ensure everyone is on the same page.

### Essential Elements:
1. **Common Vocabulary**: Consistency with the terms used in reporting. This will avoid confusion.
2. **Abstract Measurements**: This will help build reports that are more meaningful, relevant and understandable to all the teams.
3. **Efficiency Metrics**: Cost-to-value ratios for business units

A common vocabulary set can be found in the [FinOps Terminology official docs](https://www.finops.org/assets/terminology/).

## FinOps Principles

1. **Collaboration**
   - Teams must work together
   - Shared understanding of goals

2. **Business Value**
   - Decisions driven by cloud value
   - ROI-focused approach

3. **Ownership**
   - Everyone takes responsibility
   - Clear accountability

4. **Transparency**
   - Accessible reporting
   - Timely updates

5. **Centralization**
   - Dedicated FinOps team
   - Consistent governance

6. **Opportunity**
   - Leverage variable cost models
   - Optimize cloud resources

## FinOps Lifecycle

Three distinct phases: Inform, Optimize and Operate. These phases aren’t linear; you should plan to iterate over them constantly.

1. **Inform**: This phase will be focused on providing visibility for allocation and shared accountability, showing teams what they are spending and why. This phase enables individuals to start seeing the direct impact of their actions on the bill.
2. **Optimize**: This phase will focus on empowering teams to identify and measure efficiency optimisations, like rightsizing, storage access frequency, or improving RI coverages. Goals are set upon the identified optimisations, which align with each team’s focus.
3. **Operate**: This phase will be focused on procedures, defining processes that make the goals of technology, finance and business achievable. Automation could be a good way to perform the process, avoiding repeated human error.

![FinOps Lifecycle](/images/posts/finops-lifecycle.webp)

Companies can be in one of the three phases defined above; currently, Empathy.co is in the inform phase.

Questions that helped us get started:

- What do you want to report on? Applications, products, business units…
- Where is the bulk of spending coming from? From which set of services? Data, network…
- Are you going to chargeback? Are you going to do a showback? (important financial questions)
- How will you account for people shifting between teams? This is important to answer if your teams have a high turnover rate.
- How will you notify people that there have been changes to the allocation constructions? This documentation is important to sync with all the teams involved.
- What are the tags you really need? Make it simple first and repeat it. Avoid starting with 20 mandatory tags.
- Will you do things like “training days” to regularly present best practices and gain people’s interest? This should be planned to maintain momentum.
- What happens with the shared costs? Things like CI, logging, monitoring…This is going to be split up in a proportional way, based on the relative percentage of direct costs.


As you can see, these questions primarily apply when taking off in your journey on Cloud FinOps. Some other deeper questions can arise too:

- Which teams are driving the costs? Define clear owners.
- Do you have budgets in place for each team? Difficult question to answer if you are a startup and speed is the priority.
- What’s the state of the tagging strategy? Maintain tag hygiene.

These questions are more difficult to answer in the first draft of your Inform phase, but as soon as you evolve and start to know and understand the FinOps culture, these questions will be answered.

## Conclusion

FinOps is not about saving money. FinOps is about making money. Cloud spending can drive more revenue, signal customer base growth, enable more product and feature release speed, or even help shut down unused resources.

To help us to understand where things are, the Inform phase could be faced as follows:

- **Tags**
    - Create a tag allocation strategy
    - Tag hygiene
- **Cost Report**
    - What do we want to report on? Cost centres, applications, products, business units…
- **Usage Report**
    - What resources are used by each workload? Are there unused resources?
- **Mindset**
    - Generate a FinOps culture allowing the teams to see how their actions affect the billing.


## Next Steps

Stay tuned for [Part 2](/posts/cloud-finops-tag-allocation) of this series, where we'll explore tag allocation strategies for budget management and FinOps adoption.

## Resources

- [Cloud FinOps Foundation](https://www.finops.org/)
- [FinOps Terminology](https://www.finops.org/terminology/)
- [Cloud FinOps Book](https://www.oreilly.com/library/view/cloud-finops/9781492054610/)

## About the Author

I'm a Platform Engineer Architect specializing in cloud-native technologies and engineering leadership. With extensive experience in cloud cost optimization and FinOps practices, I help organizations build efficient and cost-effective cloud infrastructure.

[Connect with me on LinkedIn](https://www.linkedin.com/in/ramiroalvfer/) or [contact me](/contact) for more information.