---
title: 'Atruvia: DevOps Modernization, Spring Boot Microservices & Finanzamt Integration'
date: '2024-03-15'
draft: false
logo: 'images/client-logo/atruvia.png'
image: 'images/client-logo/atruvia.png'
description: "Multi-year DevOps engagement at Atruvia - Jenkins-to-GitLab CI migration, Java Spring Boot microservices on OpenShift, and the secure Finanzamt integration layer powering Germany's largest cooperative banking network."
categories: ['Banking IT', 'DevOps', 'OpenShift', 'Spring Boot']
---

## The Engagement

Atruvia is the IT backbone for Germany's cooperative banking network - **120+ Volksbanken and Raiffeisenbanken** serving millions of retail and corporate customers. Their platform team runs core banking infrastructure that has to clear BaFin, BSI, and regulator review every single day.

I was embedded on the DevOps and platform engineering side across three interlocking workstreams: CI/CD modernization, microservice refactoring on OpenShift, and the secure communication layer between core banking and the German Finanzamt (federal tax authority).

---

## 1. Jenkins → GitLab CI Migration

Atruvia's CI footprint was a mature, complex Jenkins estate - hundreds of pipelines, dozens of shared libraries, plugin sprawl, and the kind of credentials-mounted-on-the-master pattern that ages badly in a regulated environment.

The migration to GitLab CI was a multi-quarter program:

- **Pipeline-as-code in the same repo as the source.** Every build, every test, every deploy gate is reviewable in the same MR that ships the code change. Auditors love this. Reviewers love it more.
- **Signed artifacts + SLSA-style provenance.** Every artifact that hits a production cluster carries a verifiable build trail. Deploy gates can refuse anything that didn't come from the canonical pipeline.
- **Promotion gates as code.** Stage → pre-prod → prod promotion is explicit YAML with approval rules tied to identity provider groups. No more "who clicked the button" archaeology.
- **Vault-driven credentials.** Build- and deploy-time secrets are pulled from HashiCorp Vault per-job with short-lived tokens. Credential leakage in build logs becomes an architectural impossibility, not a hopeful policy.

The migration shipped without a freeze period - old Jenkins pipelines continued to run while the equivalent GitLab pipelines were validated in parallel, then cut over one product area at a time.

---

## 2. Java Spring Boot Microservices on OpenShift

A large portion of the banking application stack was refactored from monolithic Java services into discrete **Spring Boot microservices** running on **OpenShift**. Highlights:

- **Proper service boundaries.** Domain-driven decomposition, not "split-the-monolith-along-package-names" theatre. Services own their data and expose narrow, versioned APIs.
- **Production-grade observability.** Every service ships with Micrometer metrics, distributed tracing (OpenTelemetry), and structured audit logging that satisfies BaFin trail requirements.
- **Helm + Kustomize deploys.** Templated manifests with environment overlays, deployed via the GitLab CI pipelines above. ArgoCD watches the canonical environment branches.
- **Resilience built in, not bolted on.** Circuit breakers, retry budgets, and bulkheading at the framework level. Health and readiness probes that mean something. Graceful shutdown for safe rolling deploys.

---

## 3. Finanzamt Integration Layer

German banks have non-trivial reporting obligations to the Finanzamt (federal tax authority) - interest reporting, capital-gains reporting, FATCA/CRS exchange, and a long list of structured submissions on fixed schedules.

I engineered the secure integration layer that bridges core banking systems and the Finanzamt endpoints:

- **Pipeline-driven submissions** with idempotent retries, dead-letter queues for malformed batches, and end-to-end correlation IDs for audit replay.
- **Credentials and signing keys** managed through HashiCorp Vault with rotation built into the platform.
- **Reconciliation tooling** that compares what was sent against what was acknowledged, and surfaces drift before a regulator does.

Every artifact in this path is auditable end-to-end: the source code, the build, the deploy, the credential issuance, the submission itself, and the acknowledgement.

---

## The Architectural Pattern Underneath

All of this sits on a defense-in-depth pattern that treats every layer as independent:

- **Istio Service Mesh** with geographic locking and strict service-to-service authorization on egress gateways. Cross-datacenter traffic is a deliberate, authorized act - never an accident.
- **HashiCorp Vault** as the single source of truth for secrets, with workload-identity-bound issuance.
- **Workload identity** at the application layer, so even a misconfigured route doesn't grant access without a valid SPIFFE-style identity.

A failure in any one layer doesn't compromise the system. That's the property a regulator is looking for, and it's the property the team can actually maintain at week 50 of the year.

---

## Why It Matters

DevOps modernization in regulated banking isn't about chasing trends. It's about making the platform _boring_ - fast to ship from, hard to misconfigure, trivial to audit. The technology choices (GitLab, OpenShift, Spring Boot, Istio, Vault) are the table stakes. The discipline is the differentiator.

This engagement is the kind of work I get called for: high-stakes, regulated, multi-year, and engineered to disappear into the background so the business can move.

---

## Related

- **Service:** [Cloud Infrastructure & DevOps (BaFin-compliant Kubernetes/OpenShift)](/services/cloud-infrastructure-devops/)
- **Service:** [Data Engineering & Analytics](/services/data-engineering-analytics/)
- **Case study:** [Atruvia / Volksbank - Data Warehouse Modernization](/portfolio/atruvia--volksbank-data-warehouse/)
- **About:** [Justin Güse - Enterprise Infrastructure Architect](/about/)

**Reviewing us for an engagement?** [Book a free 1-hour architecture review](/contact/) - in 60 minutes I'll find €100K+ in compliance risk, cloud waste, or scaling headroom, or I tell you so and walk away.
