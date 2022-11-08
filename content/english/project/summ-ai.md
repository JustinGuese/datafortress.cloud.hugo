---
title: SUMM AI serverless AWS architecture 
date: '2022-09-24T14:48:03.000+06:00'
description: "AI startup that simplifies language using Transformer MLP models"
bg_image: "/images/project/summai.png"
image: "/images/project/summai.png"
live_demo: ''
case_study: ''
category: Cloud
overview:
- label: Client
  data: Otto.ai
- label: Branch
  data: startup
- label: Location
  data: Munich, Germany
- label: Category
  data: Cloud, AI
- label: Expertise
  data: AWS, Microservices, Terraform
- label: Date
  data: 2022-2022

---

## Summary

AI startup that simplifies language using Transformer MLP models
https://summ-ai.com/ 
Transformation of an existing MariaDB, Django and ML architecture into a serverless AWS architecture.

## Keywords

AWS, ETL Pipelines, Tensorflow, SQL, Django, Docker, AWS ECS, AWS Security, AWS API Gateway

## Description

The goal was to convert the existing Python/MariaDB/ML architecture into a serverless format and transfer it autoscaling and securely to AWS. 
The existing architecture has not been secure, and did not scale. The individual components were isolated, packaged into Docker images, and deployed into private VPC's using AWS ECS and API Gateway to ensure maximum security of the "secret" models. The architecture was written in Terraform and is deployed using a Github Actions CI/CD pipeline. The architecture complies with the AWS "well-architected" specification.

[Are you working on a similar project? Are you interested in something similar? contact us now for a free 15-minute consultation.](/contact/)
