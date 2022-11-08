---
title: Jim Harris Real Time Stock Analytics
date: '2022-09-24T14:48:03.000+06:00'
description: "Australian Stock Market Prediction Within 5 seconds.
Stock market tick data storage and stock price prediction."
bg_image: "/images/project/jim-harris.jpeg"
image: "/images/project/jim-harris.jpeg"
live_demo: ''
case_study: ''
category: Data
overview:
- label: Client
  data: Jim Harris Corp
- label: Branch
  data: Finance
- label: Location
  data: Brisbane, Australia
- label: Category
  data: Data Engineering, Kubernetes, Tradingbot
- label: Date
  data: 2020-2022

---

## Summary

Australian Stock Market Prediction Within 5 seconds.
Stock market tick data storage and stock price prediction.

## Keywords

AWS, ETL Pipelines, Tensorflow, Elasticsearch, NoSQL, Apache Kafka, Apache Flink, Python, Message Queues, Microservices (Lambda), Docker, Dask

## Description

The goal was to process livestreams of tick stock market data in milliseconds and give decisions regarding trading strategies. In the further course, an automated trading bot was developed, which makes buying decisions based on machine learning. 

In detail, ~120 tick data/seconds were processed, which were sent to Apache Kafka (meanwhile Flink) and then processed by autoscaling microservices (AWS Lambda). The model itself was hosted using OpenFAAS in a Docker Swarm cluster and performed purchase decisions via custom APIs to ASX.

[Are you working on a similar project? Are you interested in something similar? contact us now for a free 15-minute consultation.](/contact/)
