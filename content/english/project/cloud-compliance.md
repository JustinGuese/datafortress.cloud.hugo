---
title: Cloud Compliance
date: '2018-09-24T14:48:03.000+06:00'
description: This is meta description
bg_image: "/images/activity-board-game-connection-desk-613508-300x200.jpg"
image: "/images/activity-board-game-connection-desk-613508-300x200.jpg"
live_demo: ''
case_study: ''
category: Cloud
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
Whilst working at my former company, we decided to implement some processes in the Cloud.  
One important factor, especially for a company as huge as the Porsche Holding, has been to pay attention to established data privacy and protection laws, like the [European DSGVO](https://www.dsb.gv.at/gesetze-in-osterreich) and company restrictions made by the Porsche Holding itself.

Many companies already experienced huge breaches, which stemmed from not sufficient knowledge of the topic.

## THE CHALLENGE

The company already had an excellent data strategy, but wanted to further categorize and change processes to handle future DSGVO processes even better.

## THE STRATEGY

DSGVO, HIPAA, and other compliance laws surprised some companies in recent years. But instead of being scared companies should see it as a good way to finally categorize data, and see which data is really needed.

#### Data Catalogue

The first step for a company trying to handle DSGVO or other data laws should be to build up a catalog of its data, categorized into four different segments:

1. **Very personal data**  
   (Biomedical data, relationships to other people, DNA-data, medical records, sexual interests, racial information, …)
2. **Personal data**  
   (Name, Adress, IP, serial numbers of their products, …) – basically everything that can be used to pinpoint that data to a specific person
3. **Isolated “personal” data  
   **Data that is stored at a different location, but could be used in combination with another dataset to identify a person. E.g. if one database contains the medical record of a person together with a patient ID, and another database the ID and the real name, a data breach of both databases could still cause access to the medical records and the full name of that person. Two-way encryption can fall into this category as well, as the data can be encrypted if the key is accessed.
4. **Public data  
   **Data that leaves no way to identify that person or does not affect a person at all. Think about how it would affect your company if this data is lost. If nothing changes and no one is affected, it is basically “public data”. But be cautious, even though you might think it should have no effect, it does not mean that it is harmless. E.g. if a person is visible on pictures in the background it still violates data protection laws!

#### Data goal/pipeline

The next step is to basically change all the data such that it is category 4 (Public Data) if possible. Of course, some data can not be reduced to this form, but there are several tools on hand to avoid saving clear names or addresses in your database.

At first, think about if you really need the clear version, meaning e.g. the full name, to handle your data processing. Next, if you really need that name or an ID, could you replace the name with an ID? Or could you probably separate personal data and business analytic data into different databases?

Let us take a look at an example:

Let us say a database contains all your sales including names, addresses, and phone numbers of your customers. Your standard process is to take this data and analyze it in a Business Intelligence (BI) tool to derivate your conversion rates, sales, sales per customer and so on.

To calculate sales numbers a specific ID is oftentimes not needed (except e.g. sales per customer). For example, if you just want to summarize sales and losses, you would just need transactions with their monetary value without any customer’s names, addresses and so on. Meaning if only this is your analytical concern, you could create a second database that only contains this necessary information and is only accessed by the BI tool.

If you still need an ID for the customer, to calculate “best customers” for example, you could replace Names with ids. E.g. “Shop X1” will be “ID1”. Then you could save the ID and Name combination into another, safer database that is only accessed by you or limited personal.

Another way would be to encrypt data. One could, for example, encrypt all the names, and only decrypt them if one really needs the name of the business (with the encryption-keys never leaving your company).

Another method, if you just need an ID and no real name at all, is to “hash” the data, which is basically one-way encryption. If you “insert” a full name into the algorithm, it always delivers a unique ID that can never (simplified) be decrypted back to the full name. That way you will be left with a personal ID without a way to derive the full name of your customer.

Still, this has been only a brief overview. To fully discover the possiblites, one has to take a look at the data, the environment and the individual situation.

**Do you want to know more about this process? Are you in the middle of it? Shoot me a message or comment below.**