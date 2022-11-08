---
title: "AIStockpricePrediction"
date: 2022-07-12T17:02:17+02:00
draft: false
image: "/images/products/aistockprice.png"
---
# AIStockpricePrediction

https://aistockpriceprediction.com/

AIStockpricePrediction.com is my "front end" to visualize my private trading ideas and algorithms. A Kubernetes job runs daily, which "chases" all SPY500 stocks through my microservice architecture (FastAPI, TensorFlow, LSTMs, Sklearn), and then saves the results in Markdown format. GoHugo (static website generator) then converts them to HTML, and the Kubernetes job then uploads them to GitHub, where they are transferred to the GitHub Pages by GitHub Actions.
