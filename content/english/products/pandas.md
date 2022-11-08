---
title: "Open Source: Pandas to_sql"
date: 2022-07-12T17:02:17+02:00
draft: false
image: "/images/products/pandas.png"
---
# Open Source: Pandas to_sql

https://github.com/pandas-dev/pandas/pull/48331  

Pandas is one of the most used data science libraries in Python, and I have been working with others on the "to_sql" function for some time. Currently this is only capable of writing a Pandas dataframe to a SQL database if entries of it are new. If there is already an entry in the database, an error is thrown. The new functionality will allow an upsert, and offers different options (on duplicate -> error / replace / keep database).
The tests for Pandas are very strict, and the code must work on ARM, AMD, etc., so the PR drags on forever.
