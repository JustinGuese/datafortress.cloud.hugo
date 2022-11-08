---
title: Buchinger Wilhelmi private Cloud
date: '2022-09-24T14:48:03.000+06:00'
description: "Building a secure and DSGVO compliant private cloud including data warehouse and data-driven analytics / models"
bg_image: "/images/project/buchinger-wilhelmi.webp"
image: "/images/project/buchinger-wilhelmi.webp"
live_demo: ''
case_study: ''
category: Cloud
overview:
- label: Client
  data: Buchinger Wilhelmi
- label: Branch
  data: Healthcare
- label: Location
  data: Überlingen, Germany
- label: Expertise
  data: Kubernetes, Data Engineering, Hybrid Cloud
- label: Date
  data: 2020-

---

## Summary

Building a secure and DSGVO compliant private cloud including data warehouse and data-driven analytics / models

## Keywords

Kubernetes, K3s, Terraform, Linux, AWS, ETL Pipelines, OpenStack, Docker Swarm, HL7, Tensorflow, Elasticsearch, SQL, NoSQL, Prefect, Dask, CI/CD Pipelines, Machine Learning, Tensorflow, ArgoCD, Github Actions, Keycloak, Microservices, FastAPI

## Description

The goal of the project is to build a data landscape from existing and future data, which can then be used to better understand business processes and make automatic data-driven recommendations and decisions using machine learning. 

A particular challenge was the handling of sensitive patient data, which is why the requirements of the German Data Protection Regulation (DSGVO) and the Baden-Würtemberg Hospital IT Act had to be met.
Therefore, the first phase of the project consisted of planning and close coordination with several law firms to work out and plan the specifications of the hospital laws.

The initial architecture was serverless built on AWS, but was then redesigned to Kubernetes due to legal decisions regarding medical data. High data security was a requirement, as highly sensitive medical data is used and analyzed, which requires ISO certification and managing HL7 data. 
I then deployed a BareMetal Kubernetes cluster on Hetzner Cloud with K3s, Terraform and MicroOS, which autoscales horizontally, load balances and automatically creates certificates (https://github.com/kube-hetzner/terraform-hcloud-kube-hetzner). The cluster and deployment are continuously monitored and errors are automatically fixed. In addition to the security aspects, it further allows us to save 90% in costs compared to AWS EKS.

In the area of analytics, we created a dashboard for NoSQL and SQL data, as well as ETL pipelines to create a data warehouse. 

In Machine Learning, one goal was to run highly scalable models in the cloud to make decisions and classify customers and app users in Milliseconds. 

In order to improve the customer journey, a "profile" was created for each custom, followed by manual analysis, classification using data science, and twin-customer analysis.  

[Are you working on a similar project? Are you interested in something similar? contact us now for a free 15-minute consultation.](/contact/)
