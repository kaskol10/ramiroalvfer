---
id: "aws-credentials-monitoring"
title: "Monitoring AWS Credential Age with Terraform, Go, Lambda, and Slack"
description: "Learn how to build a practical solution for monitoring AWS credential age using Terraform, Go, AWS Lambda, and Slack notifications to enhance your cloud security posture."
date: "2019-01-22"
categories:
  - cloud
  - security
  - automation
tags:
  - aws
  - terraform
  - golang
  - lambda
  - security
  - devops
  - platform-engineering
cover: "covers/aws_monitoring_1.webp"
---

> This article was originally published on [Medium - Empathy.co](https://medium.com/empathyco/how-to-monitor-the-age-of-your-aws-credentials-using-terraform-go-aws-lambda-and-slack-a9cc0ad322a)

![AWS Credentials Monitoring Architecture](/images/posts/aws_monitoring_3.webp)

As a Platform Engineer Architect and AWS certified professional, I've implemented numerous security automation solutions. One crucial aspect of cloud security is managing AWS credential lifecycles. In this post, I'll share a practical solution for monitoring AWS credential age using modern cloud-native technologies.

## The Challenge

Managing AWS credentials at scale presents several challenges:
- Tracking credential age across multiple users
- Ensuring timely rotation of access keys
- Maintaining security compliance
- Automating monitoring and notifications

## Solution Architecture

We'll build a serverless notification system that:
1. Monitors IAM user credentials
2. Checks credential age every 10 minutes
3. Sends notifications to Slack when credentials reach certain age thresholds

### Components Overview

- **AWS Lambda** (Go runtime) - For serverless execution
- **Terraform** - Infrastructure as Code
- **AWS CloudWatch** - For scheduled triggers
- **Slack** - For notifications

## Implementation

### Go Lambda Function

```go
package main

import (
    "context"
    "fmt"
    "github.com/aws/aws-lambda-go/lambda"
    "github.com/aws/aws-sdk-go-v2/service/iam"
    "time"
)

type Response struct {
    Message string `json:"message"`
    Ok      bool   `json:"ok"`
}

func HandleRequest(ctx context.Context) (Response, error) {
    // Initialize AWS clients
    iamClient := iam.New(iam.Options{})
    
    // List all users
    users, err := iamClient.ListUsers(ctx, &iam.ListUsersInput{})
    if err != nil {
        return Response{}, err
    }

    // Check access keys for each user
    for _, user := range users.Users {
        keys, err := iamClient.ListAccessKeys(ctx, &iam.ListAccessKeysInput{
            UserName: user.UserName,
        })
        if err != nil {
            continue
        }

        // Check age of each key
        for _, key := range keys.AccessKeyMetadata {
            age := time.Since(*key.CreateDate)
            if age > 90*24*time.Hour {
                // Send Slack notification for old keys
                notifySlack(user.UserName, key.AccessKeyId, age)
            }
        }
    }

    return Response{
        Message: "Successfully checked credentials",
        Ok:      true,
    }, nil
}

func main() {
    lambda.Start(HandleRequest)
}
```

### Terraform Infrastructure

![WildTerraform](/images/posts/aws_monitoring_2.bin)

```hcl
resource "aws_lambda_function" "credential_monitor" {
  filename         = "credential_monitor.zip"
  function_name    = "aws-credential-monitor"
  role             = aws_iam_role.lambda_role.arn
  handler          = "main"
  source_code_hash = filebase64sha256("credential_monitor.zip")
  runtime          = "provided.al2"

  environment {
    variables = {
      SLACK_WEBHOOK_URL = var.slack_webhook_url
    }
  }
}

resource "aws_cloudwatch_event_rule" "check_credentials" {
  name                = "check-credentials"
  description         = "Trigger credential check every 10 minutes"
  schedule_expression = "rate(10 minutes)"
}

resource "aws_cloudwatch_event_target" "check_credentials_target" {
  rule      = aws_cloudwatch_event_rule.check_credentials.name
  target_id = "CheckCredentials"
  arn       = aws_lambda_function.credential_monitor.arn
}
```

![Terraform live and modules](/images/posts/aws_monitoring_3.webp)

## Monitoring Setup

The solution uses CloudWatch Events (EventBridge) to trigger the Lambda function every 10 minutes. When credentials exceeding the age threshold are found, a notification is sent to Slack via a webhook.

### Slack Notification Example

```go
func notifySlack(username string, keyID string, age time.Duration) error {
    message := fmt.Sprintf(":warning: AWS access key `%s` for user `%s` is %d days old",
        *keyID, *username, int(age.Hours()/24))
    
    // Send to Slack webhook
    // Implementation details...
    return nil
}
```
![Slack messages](/images/posts/aws_monitoring_6.webp)

## Best Practices and Lessons Learned

1. **Infrastructure as Code**
   - Always use Terraform or similar IaC tools for repeatability
   - Store state in S3 with proper locking mechanisms
   - Version control your infrastructure code

2. **Security Considerations**
   - Follow the principle of least privilege for Lambda IAM roles
   - Encrypt sensitive values (like Slack webhooks) using AWS Secrets Manager
   - Implement proper error handling and logging

3. **Monitoring and Alerting**
   - Set up CloudWatch alarms for Lambda errors
   - Monitor Lambda execution times and memory usage
   - Implement proper error reporting

## Conclusion

This solution has been running in production environments, helping teams maintain better security practices through automation. The complete code is available on my [GitHub repository](https://github.com/EmpathyBroker/aws-credentials-monitoring).

![Demogorgon user specs](/images/posts/aws_monitoring_5.webp)

![AWS Vault workflow](/images/posts/aws_monitoring_7.webp)

### Next Steps

Consider extending this solution with:
- Multi-account support
- Custom notification thresholds
- Integration with ticketing systems
- Support for other notification channels

Want to discuss platform engineering or cloud security? Connect with me on [LinkedIn](https://www.linkedin.com/in/ramiroalvfer/) or [GitHub](https://github.com/kaskol10) or [Contact me](/contact).

## Attribution

This post was originally published on [Medium - Empathy.co](https://medium.com/empathyco/how-to-monitor-the-age-of-your-aws-credentials-using-terraform-go-aws-lambda-and-slack-a9cc0ad322a) on January 22, 2019. It has been updated and adapted for this blog with additional insights and current best practices. 