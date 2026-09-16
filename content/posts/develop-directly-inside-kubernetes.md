---
id: "develop-software-direclty-inside-kubernetes"
title: "Stop Localhost: Develop Software Directly Inside Kubernetes"
description: "Tired of local development headaches? Discover how to develop your applications directly in a production-like Kubernetes environment."
date: "2025-10-16"
categories:
  - engineering
  - kubernetes
  - develop
  - devex
tags:
  - kubernetes
  - develop
  - devex
cover: "covers/devspace.jpg"
---

### The Local Development Dilemma

In the era of microservices and cloud-native architectures, the traditional "it works on my machine" development model is fundamentally broken. Engineers often spend hours, if not days, wrestling with a local setup that poorly mimics a production environment. From networking issues and database access to the sheer demand for powerful hardware, the friction of local development slows down innovation and frustrates talent.

If you're an engineering leader or a platform engineer, this story is likely familiar. The dream of a seamless development workflow is often bogged down by the complexities of replicating a cloud environment on a laptop. But what if there was a better way? What if you could develop directly inside your Kubernetes cluster, with all the benefits of a production-like environment, without sacrificing the speed and convenience of local tooling?

This is where **[DevSpace](https://www.devspace.sh/docs/getting-started/introduction)** comes in. As a CNCF Sandbox project, [DevSpace](https://www.devspace.sh/docs/getting-started/introduction) is a powerful open-source tool designed to bridge the gap between local development and Kubernetes. Its mantra is simple: "The fastest developer tool for Kubernetes." In this article, we'll explore how [DevSpace](https://www.devspace.sh/docs/getting-started/introduction) lives up to that promise and how it can revolutionize your team's development experience.

### What Do You Need to Get Started?

Adopting DevSpace is surprisingly straightforward. Here are the essentials:

- **Kubernetes Cluster Access**: You need access to a Kubernetes cluster where you can deploy your applications.
- **DevSpace CLI**: The command-line interface, available for Windows, Linux, and macOS, is the primary way you'll interact with DevSpace.
- **Image Registry Access**: You'll need access to a container image registry to store your application images.

### Core Features of DevSpace

DevSpace is more than just a deployment tool; it's a comprehensive development environment that streamlines the entire inner loop of the development process. Let's look at its key features.

#### 1. Streamlined and Automated Workflows

DevSpace automates the repetitive tasks of building and deploying applications. With a declarative `devspace.yaml` file, you can define your entire development workflow, from building container images to deploying them with `kubectl`, Helm, or Kustomize. This GitOps-friendly approach ensures that your development environment is version-controlled and easily reproducible.

You can even define cross-repository dependencies, making it easier to work with complex microservices architectures.

#### 2. A Faster Feedback Loop with Hot Reloading

One of the most powerful features of DevSpace is its ability to provide a near-instant feedback loop. As you write code on your local machine, DevSpace updates your application running in the container in real-time. This is achieved through two key mechanisms:

- **Two-Way File Synchronization**: DevSpace syncs file changes between your local machine and the running container. This means you can use your favorite IDE and tools, and your changes are immediately reflected in the cloud.
- **Hot Reloading**: For applications that support it (like Node.js with `nodemon` or Python with `--reload`), changes are automatically picked up without a container restart. For changes that require a full rebuild, such as updating dependencies, DevSpace offers an auto-reloading mechanism that rebuilds and redeploys your application.

This combination of file synchronization and hot reloading dramatically reduces the time you spend waiting for builds and deployments, allowing you to stay in the flow.

#### 3. Rich User Interface

For those who prefer a more visual approach, DevSpace offers a rich user interface that makes it easy to interact with your workloads, inspect logs, and manage your development environment.

#### 4. Cross-Environment Consistency

DevSpace helps you achieve consistency between your development and production environments. By using a declarative configuration, you can define different profiles for different environments, ensuring that your application behaves as expected, no matter where it's deployed.

### Practical Examples with DevSpace

Let's dive into some practical examples of how you can use DevSpace to improve your development workflow.

#### Using a Helm Chart for Deployment

If your organization uses Helm to manage deployments, you can easily integrate it with DevSpace. Here's an example of how to use a Helm chart from a remote repository:

```yaml
deployments:
  - name: my-app
    helm:
      chart:
        name: component-chart
        repo: https://charts.devspace.sh
      values:
        app:
          name: my-app
          image: "my-app-image"
```

You can also use local Helm charts or override values with a `values.yaml` file, giving you full control over your deployments.

#### Implementing Hot Reloading

Here’s how you can configure file synchronization and auto-reloading in your `devspace.yaml`:

```yaml
dev:
  sync:
    - imageSelector: my-app-image
      localSubPath: ./src
      containerPath: /app/src
      excludePaths:
        - node_modules/
  autoReload:
    paths:
      - ./package.json
    deployments:
      - my-app
```

In this example, any changes to the `src` directory will be immediately synced to the container. If `package.json` is modified, DevSpace will automatically trigger a redeployment.

#### Remote Debugging with Your Favorite IDE

DevSpace makes it easy to debug your application running in Kubernetes. By forwarding a port from your container to your local machine, you can attach a debugger from your IDE, just as you would with a local application.

Here's an example of a `launch.json` configuration for remote debugging in Visual Studio Code:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Remote Attach",
            "type": "debugpy",
            "request": "attach",
            "connect": {
                "host": "localhost",
                "port": 5678
            },
            "pathMappings": [
                {
                    "localRoot": "${workspaceFolder}/src",
                    "remoteRoot": "/app/src"
                }
            ]
        }
    ]
}
```

This setup allows you to set breakpoints and step through your code as it runs inside the container, giving you a powerful tool for troubleshooting.

#### Building Images Without Local Docker

For organizations that want to standardize their build process or avoid the overhead of running Docker on developer machines, DevSpace can be integrated with tools like Kaniko to build container images directly within the Kubernetes cluster.

This approach offers several advantages:

- **No Local Docker Required**: Free up local resources and avoid inconsistencies between local and CI/CD build environments.
- **Improved Security**: Builds are executed in a controlled and isolated cloud environment.
- **Consistent Builds**: Ensure that your images are built in the same environment where they will run.

### The Business Case for In-Cluster Development

For engineering leaders, the benefits of adopting a tool like DevSpace extend beyond developer convenience. The impact on the business can be significant:

- **Increased Developer Productivity**: By reducing the friction of local development, engineers can spend more time writing code and less time wrestling with their environment.
- **Faster Onboarding**: New developers can get up and running in minutes, not days. With a single command (`devspace dev`), they can have a fully functional development environment without needing to install a complex toolchain on their local machine.
- **Improved Environment Consistency**: By developing in a production-like environment, you can reduce the number of "it works on my machine" bugs and ensure a smoother path to production.
- **Enhanced Security**: Centralizing development in a controlled cloud environment can improve your security posture by reducing the attack surface of local machines.

### Conclusion

The shift to cloud-native development requires a new approach to the developer experience. Tools like DevSpace are leading the way, offering a more efficient, consistent, and enjoyable way to build software for Kubernetes. By moving development into the cluster, you can empower your team to innovate faster, reduce operational overhead, and ultimately, deliver more value to your customers.

If you're ready to leave the frustrations of local development behind, it's time to give DevSpace a try.

## Resources

- https://www.devspace.sh/docs/getting-started/introduction

## About the Author

I'm a Platform Engineer Architect specializing in cloud-native technologies and engineering leadership. I focus on building efficient, collaborative engineering processes and documentation.

[Connect with me on LinkedIn](https://www.linkedin.com/in/ramiroalvfer/) or [contact me](/contact) for more information.