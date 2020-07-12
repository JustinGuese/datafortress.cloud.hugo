---
title: Digital Twin
date: '2018-09-24T14:48:03.000+06:00'
description: This is meta description
bg_image: "/images/porsche-bigdata-digital-twin-768x387.png"
image: "/images/porsche-bigdata-digital-twin-768x387.png"
live_demo: ''
case_study: ''
category: Big Data
overview:
- label: Client
  data: Whilst working at Porsche Holding
- label: Category
  data: Big Data
- label: Expertise
  data: Stream Data processing in NoSQL
- label: Date
  data: 2016-2019

---
> “A digital twin is a digital replica of a living or non-living physical entity.”

[Source](https://en.wikipedia.org/wiki/Digital_twin)

A digital twin in marketing is a user that is similar to a user that has already been on your website.  
This is done because you are already knowing what products or pages the user viewed and can offer a similar using the same experience.  
But how is this done?

### THE CHALLENGE

Porsche needed another way to reduce marketing cost and increase targeting.

### THE STRATEGY

#### Big Data aspects of a digital twin

First, we saved all the web events of our websites in a No-SQL database called Elasticsearch. Elasticsearch is a great application for text-based search and quick queries on huge databases using Lucene.

#### Graph search in Elasticsearch

Simplified, we used a graph search that is integrated into Elasticsearch ([Link](https://www.elastic.co/de/what-is/elasticsearch-graph)) to find users that are similar to the current user. Via REST-API calls with the matching Lucene queries, similar products from digital twins were extracted, and presented as recommendations to the current user.

#### Challenges using Elasticsearch for Digital Twins

A huge challenge in this scenario has been speed. Users usually leave a website if it loads longer than 250ms. This expands drastically, with 11% of the users leaving after one second loading time, and around 90% with more than four seconds of loading time ([Source](https://think.storage.googleapis.com/docs/mobile-page-speed-new-industry-benchmarks.pdf)). Therefore we had to optimize the Elasticsearch cluster and partly simplify our queries to achieve a loading time of around 200ms. How? Leave a message below or contact me to find out more.

Did you ever use Elasticsearch for Digital Twins? Do you want to find out how you can build digital twins and matching recommendations for your customers? Leave a message in the comments below or message me directly.
