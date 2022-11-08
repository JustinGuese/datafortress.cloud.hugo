---
title: "Myopiagraph"
date: 2022-07-12T17:02:17+02:00
draft: false
image: "/images/products/myopiagraph.png"
---
# Myopiagraph

https://myopiagraph.com/

Eine Software, die in 50 Augenarztpraxen in Bayern zur Visualisierung von Myopie bei Kindern eingesetzt wird. Es handelt sich um eine medizinische Software, die daher den EU- und deutschen Vorschriften für "medizinische Software" entspricht. 
Die Benutzerauthentifizierung funktioniert mit AWS Cognito, das in Kubernetes Ingress mit oauth2-proxy (Go) terminiert und dann an das FastAPI (Python) Backend weitergeleitet wird, das in diesem Fall auch das Frontend bereitstellt. Die Zertifikate werden automatisch von LetsEncrypt mit dem Cert-Manager bestellt und verwaltet. Backups werden über Velero Backup auf Storj durchgeführt.
