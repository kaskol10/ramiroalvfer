---
id: "cloudnative-pg"
title: "Migrating from Bitnami PostgreSQL to CloudNative-PG on Kubernetes"
description: "A practical guide to replacing Bitnami's PostgreSQL Helm chart with the open-source CloudNative-PG operator."
date: "2025-08-27"
categories: 
  - engineering 
tags:
  - bitnami
  - kubernetes
  - cloudnative-pg
  - cloud-native
  - postgresql
cover: "covers/cloudnative-pg.png"
---

## Why Move Away from Bitnami's Charts?

If you're running PostgreSQL on Kubernetes, chances are you've used Bitnami's popular Helm charts. They've been a go-to for many, but a significant change is on the horizon. As outlined in [this GitHub issue](https://github.com/bitnami/charts/issues/35164), Bitnami is moving its production-ready charts and images to a commercial offering. For those of us who rely on and advocate for open-source solutions, this means it's time to find a robust alternative.

This is where [CloudNative-PG](https://cloudnative-pg.io/) comes in.

## Introducing CloudNative-PG

CloudNative-PG is a Kubernetes operator designed to manage the full lifecycle of PostgreSQL clusters. It embraces a declarative, cloud-native approach to database management. It was accepted as a CNCF incubating project in March 2024, highlighting its maturity and strong community backing.

Some of its standout features include:
- **Declarative Management**: Define your entire PostgreSQL cluster—including roles, databases, and configurations—in a single YAML file.
- **High Availability and Self-Healing**: Automates failover and recovery, ensuring your database remains online without manual intervention.
- **Built-in Monitoring**: Comes with a Prometheus exporter for easy integration into your existing observability stack.
- **Seamless Data Import**: Provides a straightforward way to import data from an existing PostgreSQL database, which is perfect for our migration scenario.

This guide will walk you through the process of deploying a new PostgreSQL cluster with CloudNative-PG and importing the data from a database previously managed by a Bitnami Helm chart.


## Step 1: Installing the CloudNative-PG Operator

First things first, we need to install the operator in our Kubernetes cluster. The operator includes the Custom Resource Definitions (CRDs) that we'll use to define our database clusters.

The following command installs the latest version of the operator:
```sh
kubectl apply --server-side -f \
  https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.27/releases/cnpg-1.27.0.yaml
```

A quick tip: using the `--server-side` flag is recommended here. The operator manifest is quite large, and this flag helps prevent issues with tools like ArgoCD that might otherwise struggle with the size of the resource.

## Step 2: Configuring the Cluster and Importing Data

Now for the exciting part. We'll define our new PostgreSQL cluster using a `Cluster` resource. This definition will also include the configuration to import data from our old Bitnami-managed database.

Below is the full manifest, which we'll break down further. It includes three main resources:
1.  **Cluster**: The PostgreSQL cluster itself.
2.  **Pooler**: A PgBouncer connection pooler for high availability.
3.  **PodMonitor**: A resource for Prometheus to scrape metrics.

### The Cluster Resource

This is the core resource for our PostgreSQL database. Let's look at some of the key settings:

-   `.spec.instances`: We're creating a 3-node cluster for high availability. CloudNative-PG will ensure one is a primary and the others are streaming replication standbys.
-   `.spec.managed.roles`: We define a user role named `test` directly in the manifest. This is an example of the declarative role management feature.
-   `.spec.externalClusters`: This is the key to our migration. We're defining a reference to our old database. The operator will use these connection details to orchestrate the data import. The `host` should point to the service of your existing PostgreSQL.
-   `.spec.bootstrap.initdb.import`: This section tells the operator to bootstrap the new cluster by importing data from the `externalCluster` we defined. The `type: microservice` setting is used to import a single database.
-   `.spec.storage`: Here we define the storage for our database, requesting 8Gi of storage from the `gp3` storage class.

```yaml
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: postgres
spec:
  managed:
    roles:
    - name: test
      ensure: present
  instances: 3
  imageName: ghcr.io/cloudnative-pg/postgresql:17.5
  externalClusters: # Create the reference for the external cluster
  - name: source-db
    connectionParameters:
      host: test-postgresql-ha-pgpool.test.svc.cluster.local # Using K8s DNS
      user: postgres
      sslmode: disable
      dbname: test
    password: # Use the password located in my secret test-postgresql
      name: test-postgresql
      key: PASSWORD
  bootstrap:
    initdb: # Automatic migration 
      database: test
      owner: test
      import:
        type: microservice # Only that database for the postgresql
        databases:
          - test
        source:
          externalCluster: source-db

  enableSuperuserAccess: true 
  storage:
    size: 8Gi
    storageClass: gp3
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 1000m
      memory: 1Gi
---
```
### The Connection Pooler

A connection pooler like PgBouncer is essential for managing connections in a high-availability setup. It helps prevent connection storms on the primary database, especially during a failover.

-   `.spec.cluster.name`: This links the pooler to our `postgres` cluster.
-   `.spec.instances`: We're running two replicas of the pooler for redundancy.
-   `.spec.pgbouncer.poolMode`: `session` is a common and safe choice, where a client gets a connection for the duration of its session.
-   `.spec.type: rw`: This configures the pooler to point to the read-write primary instance of the cluster.
```yaml
apiVersion: postgresql.cnpg.io/v1
kind: Pooler # Because I'm going to use it in HA
metadata:
  name: "pooler-postgres"
spec:
  cluster: 
    name: postgres
  instances: 2
  pgbouncer: 
    poolMode: session
  type: rw
---
```
### The PodMonitor

CloudNative-PG comes with a built-in metrics exporter for Prometheus. This `PodMonitor` resource, which is part of the Prometheus Operator API, tells Prometheus how to discover and scrape the metrics from our PostgreSQL pods.

-   `.spec.selector.matchLabels`: This selector targets the pods belonging to our `postgres` cluster.
-   `.metadata.labels`: The `release: kube-prometheus-stack` label is important. It's often used by the Prometheus Operator to discover which `PodMonitors` it should pay attention to. Your environment might require a different label.
```yaml
apiVersion: monitoring.coreos.com/v1
kind: PodMonitor 
metadata:
  annotations:
    cnpg.io/operatorVersion: 1.27.0
  labels:
    cnpg.io/cluster: postgres
    release: kube-prometheus-stack # I need this label to allow Prometheus scrape metrics.
  name: postgres
spec:
  namespaceSelector: {}
  podMetricsEndpoints:
  - bearerTokenSecret:
      key: ""
      name: ""
    port: metrics
  selector:
    matchLabels:
      cnpg.io/cluster: postgres
      cnpg.io/podRole: instance
```

## Step 3: Verifying the Migration

Once you've applied the manifest, CloudNative-PG will start provisioning the cluster. You can watch the progress with `kubectl get cluster postgres -w`.

After a few minutes, the cluster should be ready. The most important question is: was our data imported correctly?

Let's verify. First, find the name of your new pooler svc:
```sh
kubectl get svc -l cnpg.io/cluster=postgres,cnpg.io/podRole=pooler -o name
```

Then, start a temporal postgres into the pooler svc and use `psql` to inspect the database. The operator creates a secret for the `postgres` superuser. The default name is `postgres-superuser`.

```sh
# Note: The secret name might be different based on your cluster name.
# It follows the pattern <cluster-name>-superuser.
PGPASSWORD=$(kubectl get secret postgres-superuser --template={{.data.password}} | base64 -d)

# Now connect to the database
kubectl run psql-client --rm -it --image=postgres --command -- psql "postgresql://postgres:${PGPASSWORD}$@pooler-postgres.test:5432/test" -c "\\dt"
```

This command lists the tables in the `test` database. If you see the tables from your original database, congratulations! The import was successful.


## Important Considerations

Here are a couple of things to keep in mind:

-   **PodMonitor Labels**: For the `PodMonitor` to be discovered by Prometheus, it needs the correct labels. In many standard `kube-prometheus-stack` installations, `release: kube-prometheus-stack` is the required label, but your setup might be different. Always check your Prometheus configuration.
-   **External Secrets Management**: When referencing secrets for external clusters, CloudNative-PG's documentation only can be specific about the expected keys (`username`, `password`). You can't use other keys.

This guide covers the initial data import, which is the most critical step. For a full production cutover, you would also need to plan for application downtime, update your application deployments to point to the new database service (`pooler-postgres-rw`), and decommission the old Bitnami deployment.

## Conclusion

The landscape of cloud-native tooling is always evolving, and the changes to Bitnami's catalog are a reminder of the importance of relying on community-driven, open-source projects. CloudNative-PG proves to be a powerful and mature solution for running PostgreSQL on Kubernetes.

With its declarative APIs, built-in high availability, and seamless integration with the Kubernetes ecosystem, it offers a robust alternative for platform engineers who value flexibility and control. While this migration requires careful planning, the result is a modern, scalable, and maintainable database infrastructure that is truly cloud-native.

## Resources

- [CloudNative-PG Official Documentation](https://cloudnative-pg.io/docs/)
- [Original Blog Post Motivation: Bitnami Charts GitHub Issue](https://github.com/bitnami/charts/issues/35164)

## About the Author

I'm a Platform Engineer Architect specializing in cloud-native technologies and engineering leadership. I focus on building efficient, collaborative engineering processes and documentation. I'm a Golden Kubestronaut with a passion for Cloud Native technologies.

[Connect with me on LinkedIn](https://www.linkedin.com/in/ramiroalvfer/) or [contact me](/contact) for more information.
