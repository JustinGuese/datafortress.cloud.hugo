---
title: "Myopiagraph"
date: 2022-07-12T17:02:17+02:00
draft: false
image: "/images/products/myopiagraph.png"
---
# Myopiagraph

https://myopiagraph.com/

A software which is used in 50 ophthalmic practices in Bavaria to visualize myopia in children. It is a medical software, and therefore complies with EU and German regulations for "medical software". 
User authentication works using AWS Cognito, which is terminated in Kubernetes Ingress using oauth2-proxy (Go), and then forwarded to the FastAPI (Python) backend, which in this case also provides the frontend. Certificates are automatically ordered and managed by LetsEncrypt using the Cert-Manager. Backups are done via Velero Backup to Storj.
