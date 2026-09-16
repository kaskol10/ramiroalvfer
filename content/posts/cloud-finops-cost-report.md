---
id: "cloud-finops-cost-report"
title: "Cloud FinOps – Part 3: Cloud Cost Report"
description: "A practical guide to implementing cloud cost visualization using AWS Cost & Usage Reports, Athena, and Grafana"
date: "2022-03-12"
categories:
  - cloud
  - finops
  - observability
tags:
  - cloud-cost
  - finops
  - aws
  - athena
  - grafana
  - platform-engineering
cover: "covers/diagram-cost-report.png"
series: "Cloud FinOps"
author: "lukasg"
---

> This article was originally published on [Empathy.co Engineering Blog](https://engineering.empathy.co/cloud-cost-report/).

Following our previous posts on [Cloud FinOps Principles](/posts/cloud-finops-principles) and [Tag Allocation Strategy](/posts/cloud-finops-tag-allocation), it's time to dive into implementing a solution for visualizing cloud costs. In this post, I'll share how to build an effective cloud cost reporting system using AWS Cost & Usage Reports (CUR), Athena, and Grafana.


## Introduction

The expenses incurred by companies operating in the cloud are important to keep under control, so they can be reported in the first phase of FinOps. There are numerous sources of information that can be used to consult cloud providers and compile expenses, but building a solution can be tedious if there are many sources employed, as all the data has to be grouped and processed. To avoid such a fiasco, the Empathy.co team has outlined an approach that uses a reduced number of tools and allows the information to be obtained and analysed in a simple, visual way.

As part of the first phase in FinOps (increasing visibility for allocation and creating shared accountability), it is necessary to know the cost of each cloud resource; therefore setting the stage for cost reduction and optimised cloud efficiency in the future. In the event that you are using AWS as a cloud provider, it is possible to build a solution by making use of their Cost & Usage Reports (CUR), Athena and Grafana.

This solution provides a way to visualize cloud spending simply and intuitively, so vertical communication does not create friction between departments. As a result, it lays the groundwork and ensures the optimization phase runs smoothly, while ease of communication and visualization support the six principles of FinOps.

Every cloud provider offers a cost explorer and reports for each account or project. However, following the Cloud FinOps principles, a cost report should be accessible to many members of a company and centralised in one tool to avoid having to toggle between multiple systems to view the various reports.

One method of compiling costs is to input the data from each cloud provider into Grafana. This option provides convenient dashboards for multiple resources from various cloud providers, in a single tool.

## Architecture

### What is a Cost & Usage Report
The Cost & Usage Reports (CUR) contain a set of cost and usage data that includes additional metadata about services, pricing, credit, fees, taxes, discounts, cost categories, Reserved Instances and Savings Plans. In AWS, Cost & Usage Reports can publish billing reports to an Amazon Simple Storage Service (Amazon S3) bucket that you own. You can receive reports that break down your costs by time (hour, day or month), product, product resources or tags that you define. Reports also can be saved in Parquet format (SQL), enabling data integration for Athena to facilitate analysis.

### What is Athena?
Athena is an interactive, serverless service that makes it easy to analyse data in Amazon S3 using standard SQL. It supports a wide variety of data formats (CSV, JSON, ORC, Parquet, etc.) and integrates with AWS Glue Data Catalog, which allows you to create tables and query data based on a central metadata store of many AWS services.

> Note: Athena is not a database is for querying data in S3. Tables in Athena are defined as external tables, which means when a table is removed from the Athena catalogue, it does not affect data stored in S3 because it is treated as a read-only service from the S3 perspective. Athena uses Apache Hive to define tables and create databases, which are essentially a logical namespace of tables.

A database in Athena is a logical grouping for tables created within it. When you create a new table schema in Athena, the schema is stored in a data catalogue and used when queries are run. This approach is known as schema-on-read, which means a schema is projected onto data as the query is run. This eliminates the need for data loading or transformation.

### Athena Plugin in Grafana
Grafana is a visualization tool with a dashboard that provides an array of graphs to explore and understand data. Grafana supports the Athena data source plugin, which allows Athena data metrics to be queried and visualized from within the platform. The plugin takes full advantage of the wide range of visualization options that Grafana offers and combines them with other data from multiple sources, in a single dashboard.

### Diagram

![](/images/posts/diagram-cost-report.png)

With all these compatible components, building a solution is simple. The first step is to retrieve the CURs from AWS, preferably with all the billing information consolidated into a single account. Applying this best practice provides benefits, such as:

Getting a single bill for all accounts
Tracking charges across multiple accounts
Combining usage across all accounts, in order to share volume pricing discounts, Reserved Instance discounts and Savings Plans
Following consolidation, a Cost & Usage Report with an .sql extension containing all the information about the organization's accounts will be generated and stored in a dedicated S3 bucket.

Because the integration of report data for Athena can take place simultaneously while CURs are generated and stored in an S3, it facilitates the process by eliminating the need to transform said data.

Now is when the pieces of the puzzle begin to fit together. After locating the CUR and the bucket it is contained in, the next step is to configure Athena to create the database and the table schema that will store the CUR information.

> Note: To determine the schema of the database and the columns, check out one of the stored CURs. Referencing Data Dictionary documentation may be helpful.

Indicate which columns will be included in the table and the bucket from which the CUR information will be extracted. Additionally, Athena needs to employ another bucket to store a history of the queries that will be launched.

After the schema has been created and the CURs have been located, it is time to start extracting and visualizing the data. The Platform Engineering team here at Empathy.co has decided to use Grafana because it provides the ability to generate dashboards that can be modified at will. The main advantage, thanks to the Athena Plugin, is that queries can be launched against Athena directly from Grafana, without having to use the AWS Management Console.

With all the elements in place, it is time to launch queries and generate dashboards.

> Note: The Athena database and any other resources needed to use the Athena Plugin in Grafana are created using Terraform.
## Cloud Cost Dashboard
For this step, it is extremely important to consider the [logic of the dashboard](https://aws.amazon.com/blogs/aws-cloud-financial-management/a-detailed-overview-of-the-cost-intelligence-dashboard/?ref=k8scockpit.tech) you want to create. Usually, dashboards are focused on locating the costs of all teams in a company, reviewing the total cost for each, and identifying each team's incurred costs in the different AWS accounts and services used. In addition, a graph showing the teams with the highest AWS spending and the total cost of all accounts is normally provided. It is important to emphasise that this dashboard and solution is only possible thanks to a strong [tag allocation strategy](/posts/cloud-finops-tag-allocation); without it, recognising which resource belongs to which team and which account they are working on would be extremely difficult, not to mention time-consuming. The following are some commonly used dashboard categories:

- Most expensive departments
- Cost of a department in each account
- Cost of services per department
- Invoice spend by department
- Invoice spend by account


![](/images/posts/dashboard-cost-report.png)

These graphs are grouped in a row titled 'Billing Summary', which provides invoice spend information. The invoice spend is the sum of the previous month's invoice, whereas the amortized spend is that month's cost of AWS usage, including any upfront or partial fees paid for Reserved Instances of Savings Plan (even if they were paid in another account, such as a payer account).

The dashboard is created thanks to the transformation of the data obtained from the SQL query launched in Athena. For the visual representation, bar charts are used by default, although the graph type can be changed; just keep in mind that simple visualization provides ease of understanding. It is also convenient to order the results from most- to least-expensive when displaying the graph.

Grafana additionally features a variable that allows for navigation between teams, making it simple to choose the team you want to analyse. Plus, by modifying the provided time range in the dashboards, accumulated costs over different periods of time can be examined.

## To Sum It Up
By making use of a well-developed tag allocation strategy and consolidating billing, information about all cloud resources utilised by a company can be obtained. What's more is that it can be presented in a practical, visually appealing and understandable way. The integration between Athena and Grafana, combined with data retrieved through SQL queries facilitates the creation of cost graphs that can easily be shared within the organization, in order to promote further cost optimization in the future.

## Future

The future of cloud cost reporting and FinOps is evolving rapidly. Here are some key trends and improvements to consider:

1. **Enhanced Cost Intelligence**
   - Integration with machine learning for cost prediction
   - Automated cost anomaly detection
   - Real-time cost optimization recommendations
   - Historical cost trend analysis

2. **Advanced Visualization**
   - Interactive cost breakdowns
   - Customizable dashboard templates
   - Multi-cloud cost comparison views
   - Cost-to-value ratio visualizations

3. **Automation and Integration**
   - Automated cost allocation workflows
   - Integration with CI/CD pipelines
   - Automated resource rightsizing
   - Cost-aware deployment strategies

4. **Community Resources**
   - Open-source dashboard templates
   - Shared best practices
   - Community-driven cost optimization patterns
   - Collaborative cost management tools

The [Grafana Community Dashboard](https://grafana.com/grafana/dashboards/15970?ref=k8scockpit.tech) provides a great starting point for implementing these improvements. Feel free to explore and adapt it to your organization's needs.

## References
- [Cloud FinOps — Part 1: Principles](/posts/cloud-finops-principles)
- [Cloud FinOps — Part 2: Tag Allocation Strategy](/posts/cloud-finops-tag-allocation)
- [Query and analyze Amazon S3 data with the new Amazon Athena plugin for Grafana](https://grafana.com/blog/2021/12/13/query-and-analyze-amazon-s3-data-with-the-new-amazon-athena-plugin-for-grafana/?ref=k8scockpit.tech)
- [What are AWS Cost and Usage Reports? — AWS Cost and Usage Reports](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html/?ref=k8scockpit.tech)
- [What is FinOps? — FinOps Foundation](https://www.finops.org/introduction/what-is-finops/?ref=k8scockpit.tech)
- [FinOps Phases — FinOps Foundation](https://www.finops.org/framework/phases/?ref=k8scockpit.tech)
- [FinOps Principles — FinOps Foundation](https://www.finops.org/framework/principles/?ref=k8scockpit.tech)
- [Amazon Athena](https://aws.amazon.com/athena/?whats-new-cards.sort-by=item.additionalFields.postDateTime&whats-new-cards.sort-order=desc&ref=k8scockpit.tech)
- [Introduction to Grafana](https://grafana.com/docs/grafana/latest/introduction/?ref=k8scockpit.tech)
- [Terraform](https://www.terraform.io/?ref=k8scockpit.tech)
- [Creating Tables in Athena — Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/creating-tables.html?ref=k8scockpit.tech)
- [Consolidated billing for AWS Organizations — AWS Billing](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html?ref=k8scockpit.tech)
- [A Detailed Overview of the Cost Intelligence Dashboard](https://aws.amazon.com/blogs/aws-cloud-financial-management/a-detailed-overview-of-the-cost-intelligence-dashboard/?ref=k8scockpit.tech)


## Next Steps

Stay tuned for [Part 4](/posts/cloud-finops-kubernetes-cost) of this series, where we'll explore the Kubernetes Cost Report


## About the Author

I'm a Platform Engineer who's been riding the cloud-native wave since the early days of Backstage.io. For the past 4 years, I've been diving deep into the CNCF ecosystem, helping teams build better developer platforms and internal developer portals. My passion lies in crafting elegant design systems and architecting platforms that developers actually want to use. When I'm not tinkering with service meshes or automating platform workflows, you'll find me sharing insights about developer experience and platform engineering best practices. I believe in building platforms that are not just functional, but delightful to use.

[Connect with me on LinkedIn](https://www.linkedin.com/in/lukas-g0mez/) or [contact me](/contact) for more information.