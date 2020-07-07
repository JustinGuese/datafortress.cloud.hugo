---
title: Cloud Big Data Analytics
date: '2018-09-24T14:48:03.000+06:00'
description: This is meta description
bg_image: "/images/porsche-cloud-bigdataanalytics-768x387.png"
image: "/images/porsche-cloud-bigdataanalytics-768x387.png"
live_demo: ''
case_study: ''
category: Big Data
overview:
- label: Client
  data: Baximco Ltd.
- label: Category
  data: Market Strategy
- label: Expertise
  data: Mobile App
- label: Date
  data: 22 nov, 2019

---
**Enterprises have an enormous amount of data in their hands. Usually, this data is stored in several systems, with different data formats, different security measures, and locations. Now, what is the best approach to unify this data, and make analytics that result in a bigger turnover?**

### THE CHALLENGE

Making use of the data at hand to increase sales, reduce costs, and optimize processes.

### THE STRATEGY

#### 1. Checking the security requirements, gathering data sources

One of the biggest tasks involved gathering the data sources and building a “map” of all of them. This exhausting necessity has to be performed before taking the first steps because if you are basing your decisions on something incomplete, a fix when it is too late to change things might be way more expensive than a thorough exploration phase.

#### 2. Decision: Read Replicas or Live databases?

Usually, it is always the best idea to use read replicas, which are copies of your data just for reading, for analytic purposes. Sometimes it can make more sense to use the production databases instead, which varies from case to case. Using read replicas involves paying for further instances, but avoids crashing a live database.

#### 3. Decision: On-Premise or Public Cloud?

A really tough question in recent years, that needs to be based on several questions. Key questions are:

* Does compliance allow the storage of my data in the cloud? If so, does it need to be encrypted?
* How large is the amount of data saved?
  * For really large amounts of data, it is usually cheaper to host it in the Public Cloud
* Do users in locations far away from my On-Premise datacenter need access to the data?
  * AWS, Azure, and Google all offer a worldwide network of servers, which can significantly boost the speed of access to the data. Public Clouds can therefore massively change the user experience in a good way.
* How do I regulate access to the data?

A rule of thumb is that less-significant data should be saved in the Public Cloud, whilst sensitive data should usually remain On-Premise. There are a lot of possibilities for in-between-decisions, like having a Hybrid Cloud or encrypting files in the Public Cloud and storing the keys On-Premise, feel free to contact me for further details.

#### 4. What analytical tools will I use?

From my experience, it is the best idea to find a few tools that satisfy almost all end users, even if that means sacrificing analytical power. In an enterprise, too many tools become tedious to manage. Usually, every user has a tool that he is used to, but if every user uses their own tool instead of using a centralized system, confusion is ensured and your Data Project might be at risk before it even started.  
I proposed Microsoft PowerBI for business users and AWS EMR and an on-premise Jupyterhub-Spark configuration for this. Why? Contact me to find out more.

#### 5. Onboarding & Documentation

I have seen way too many projects fail because of products being left alone after they are finished. The usage usually lasts for some months, but by then either support is missing, or no one knows anymore that it exists or how to use it. Therefore documentation and onboarding are some of the most crucial steps in building up a Big Data landscape. We used Microsoft Sharepoint or our own WordPress based Infosite for this.

**Do you want to know more about this process? Are you in the middle of it? Shoot me a message or comment below.**