---
title: OttoAI Machine Learning (NLP) SAAS
date: '2022-09-24T14:48:03.000+06:00'
description: "Creation of a software that collects information about potential contacts via various sources, generates a personalized message using NLP, and then automatically writes to contacts via LinkedIn."
bg_image: "/images/project/ottoai.jpg"
image: "/images/project/ottoai.jpg"
live_demo: ''
case_study: ''
category: Cloud
overview:
- label: Client
  data: Otto.ai
- label: Branch
  data: IT
- label: Location
  data: New York, USA
- label: Category
  data: Cloud, AI
- label: Expertise
  data: AWS, Microservices, Terraform
- label: Date
  data: 2022-2022

---

## Summary

Creation of a software that collects information about potential contacts via various sources, generates a personalized message using NLP, and then automatically writes to contacts via LinkedIn.


## Keywords

AWS, Docker, Python, NLP Machine Learning, Webscraper, Autoscaling, Terraform, AWS CloudFormation, CI/CD Pipelines

## Description

The goal of the project is to create a cloud architecture and software that collects information about potential customers and writes to them with a very personalized message on LinkedIn.

For this purpose, first a web scraper was set up, which searches LinkedIn, Twitter and Google for information about the potential contact, and interprets this information using NLP machine learning and creates a "file" per customer. 

A personalized cover letter is then generated using another NLP model, and another Selenium Python bot is used to send the message to the customer via LinkedIn.

Since the software and models have to handle thousands of requests within a few Seconds, it was necessary to develop an autoscaling and fast architecture using Docker and AWS ECS, which at the same time does not incur too many costs due to GPU instances on AWS. The final architecture is a mix of Docker microservices and Spot instances that host the GPU Docker images on demand.

[Are you working on a similar project? Are you interested in something similar? contact us now for a free 15-minute consultation.](/contact/)
