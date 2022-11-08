---
title: "AIStockpricePrediction"
date: 2022-07-12T17:02:17+02:00
draft: false
image: "/images/products/aistockprice.png"
---
# AIStockpricePrediction

https://aistockpriceprediction.com/

AIStockpricePrediction.com ist mein "Frontend" zur Visualisierung meiner privaten Handelsideen und Algorithmen. Ein Kubernetes-Job läuft täglich, der alle SPY500-Aktien durch meine Microservice-Architektur (FastAPI, TensorFlow, LSTMs, Sklearn) "jagt" und dann die Ergebnisse im Markdown-Format speichert. GoHugo (Generator für statische Websites) wandelt sie dann in HTML um, und der Kubernetes-Job lädt sie dann auf GitHub hoch, wo sie von GitHub Actions auf die GitHub Pages übertragen werden.
