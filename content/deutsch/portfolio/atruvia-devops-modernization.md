---
title: 'Atruvia: DevOps-Modernisierung, Spring Boot Microservices & Finanzamt-Integration'
date: '2024-03-15'
draft: false
logo: 'images/client-logo/atruvia.png'
image: 'images/client-logo/atruvia.png'
description: 'Mehrjährige DevOps-Beauftragung bei Atruvia - Jenkins-zu-GitLab-CI-Migration, Java Spring Boot Microservices auf OpenShift und die sichere Finanzamt-Integrationsschicht für Deutschlands größtes genossenschaftliches Bankennetzwerk.'
categories: ['Banking IT', 'DevOps', 'OpenShift', 'Spring Boot']
---

## Die Beauftragung

Atruvia ist das IT-Rückgrat des deutschen genossenschaftlichen Bankennetzwerks - **über 120 Volksbanken und Raiffeisenbanken**, die Millionen von Privat- und Firmenkunden betreuen. Das Plattform-Team betreibt die Kernbanken-Infrastruktur, die jeden Tag die Prüfungen von BaFin, BSI und Regulierungsbehörden bestehen muss.

Ich war in den Bereichen DevOps und Platform Engineering in drei ineinandergreifenden Arbeitssträngen eingebunden: CI/CD-Modernisierung, Microservice-Refactoring auf OpenShift und die sichere Kommunikationsschicht zwischen dem Kernbanksystem und dem deutschen Finanzamt.

---

## 1. Jenkins → GitLab CI Migration

Die CI-Landschaft von Atruvia bestand aus einer gewachsenen, komplexen Jenkins-Umgebung - hunderte von Pipelines, dutzende Shared Libraries, Plugin-Wildwuchs und das Muster von „Credentials-mounted-on-the-master“, das in einer regulierten Umgebung schlecht altert.

Die Migration zu GitLab CI war ein Programm über mehrere Quartale:

- **Pipeline-as-Code im selben Repo wie der Quellcode.** Jeder Build, jeder Test und jedes Deployment-Gate ist im selben Merge Request (MR) überprüfbar, mit dem die Codeänderung geliefert wird. Auditoren lieben das. Reviewer lieben es noch mehr.
- **Signierte Artefakte + Provenienz im SLSA-Stil.** Jedes Artefakt, das ein Produktionscluster erreicht, trägt einen verifizierbaren Build-Pfad. Deployment-Gates können alles ablehnen, was nicht aus der kanonischen Pipeline stammt.
- **Promotion-Gates als Code.** Die Beförderung von Stage → Pre-Prod → Prod ist explizites YAML mit Genehmigungsregeln, die an Identitätsprovider-Gruppen gebunden sind. Keine Archäologie mehr nach dem Motto „Wer hat den Knopf gedrückt“.
- **Vault-gesteuerte Credentials.** Secrets für Build und Deployment werden pro Job über HashiCorp Vault mit kurzlebigen Token abgerufen. Das Abfließen von Anmeldedaten in Build-Logs wird zu einer architektonischen Unmöglichkeit, nicht nur zu einer gehofften Richtlinie.

Die Migration erfolgte ohne „Freeze-Periode“ - alte Jenkins-Pipelines liefen weiter, während die entsprechenden GitLab-Pipelines parallel validiert und dann ein Produktbereich nach dem anderen umgestellt wurde.

---

## 2. Java Spring Boot Microservices auf OpenShift

Ein großer Teil des Bankanwendungs-Stacks wurde von monolithischen Java-Diensten in diskrete **Spring Boot Microservices** umgewandelt, die auf **OpenShift** laufen. Highlights:

- **Saubere Service-Grenzen.** Domain-Driven Decomposition, kein „Wir-teilen-den-Monolithen-entlang-von-Paketnamen“-Theater. Dienste besitzen ihre Daten und stellen schmale, versionierte APIs bereit.
- **Produktionstaugliche Observability.** Jeder Dienst wird mit Micrometer-Metriken, verteiltem Tracing (OpenTelemetry) und strukturiertem Audit-Logging ausgeliefert, das die BaFin-Anforderungen an die Nachverfolgbarkeit erfüllt.
- **Helm + Kustomize Deploys.** Templatisierte Manifeste mit Umgebungs-Overlays, bereitgestellt über die oben genannten GitLab CI-Pipelines. ArgoCD überwacht die kanonischen Umgebungs-Branches.
- **Eingebaute Resilienz.** Circuit Breaker, Retry-Budgets und Bulkheading auf Framework-Ebene. Health- und Readiness-Probes, die eine tatsächliche Aussagekraft haben. Graceful Shutdown für sichere Rolling Deploys.

---

## 3. Finanzamt-Integrationsschicht

Deutsche Banken haben nicht triviale Meldepflichten gegenüber dem Finanzamt - Zinsmeldung, Kapitalertragssteuer-Meldung, FATCA/CRS-Austausch und eine lange Liste strukturierter Einreichungen zu festen Terminen.

Ich habe die sichere Integrationsschicht entwickelt, die die Kernbanksysteme und die Endpunkte des Finanzamts verbindet:

- **Pipeline-gesteuerte Einreichungen** mit idempotenten Wiederholungsversuchen, Dead-Letter-Queues für fehlerhafte Batches und End-to-End-Korrelations-IDs für die Audit-Wiedergabe.
- **Credentials und Signierschlüssel**, die über HashiCorp Vault verwaltet werden, wobei die Rotation in die Plattform integriert ist.
- **Reconciliation-Tooling**, das das Gesendete mit dem Bestätigten vergleicht und Abweichungen aufzeigt, bevor es ein Regulator tut.

Jedes Artefakt in diesem Pfad ist End-to-End prüfbar: der Quellcode, der Build, das Deployment, die Credential-Ausstellung, die Einreichung selbst und die Bestätigung.

---

## Das zugrunde liegende Architekturmuster

All dies basiert auf einem Defense-in-Depth-Muster, das jede Ebene als unabhängig betrachtet:

- **Istio Service Mesh** mit geografischer Sperrung und strikter Service-zu-Service-Autorisierung an Egress-Gateways. Rechenzentrumübergreifender Datenverkehr ist ein bewusster, autorisierter Akt - niemals ein Unfall.
- **HashiCorp Vault** als „Single Source of Truth“ für Secrets, mit Workload-Identity-gebundener Ausstellung.
- **Workload Identity** auf der Anwendungsebene, sodass selbst eine Fehlkonfiguration des Routings keinen Zugriff ohne eine gültige Identität im SPIFFE-Stil gewährt.

Ein Fehler in einer einzelnen Ebene gefährdet nicht das System. Das ist die Eigenschaft, nach der ein Regulator sucht, und es ist die Eigenschaft, die das Team auch in Woche 50 des Jahres tatsächlich aufrechterhalten kann.

---

## Warum es wichtig ist

DevOps-Modernisierung im regulierten Bankwesen geht nicht darum, Trends hinterherzulaufen. Es geht darum, die Plattform _langweilig_ zu machen - schnell zu bespielen, schwer falsch zu konfigurieren, trivial zu prüfen. Die Technologiewahl (GitLab, OpenShift, Spring Boot, Istio, Vault) ist die Grundvoraussetzung. Die Disziplin ist der entscheidende Faktor.

Diese Beauftragung ist die Art von Arbeit, für die ich gerufen werde: risikoreich, reguliert, mehrjährig und so konstruiert, dass sie in den Hintergrund tritt, damit sich das Geschäft bewegen kann.

---

## Verwandte Themen

- **Service:** [Cloud-Infrastruktur & DevOps (BaFin-konformes Kubernetes/OpenShift)](/de/services/cloud-infrastructure-devops/)
- **Service:** [Data Engineering & Analytics](/de/services/data-engineering-analytics/)
- **Fallstudie:** [Atruvia / Volksbank - Data Warehouse Modernisierung](/de/portfolio/atruvia--volksbank-data-warehouse/)
- **Über uns:** [Justin Güse - Enterprise Infrastructure Architect](/de/about/)

**Prüfen Sie uns für eine Zusammenarbeit?** [Buchen Sie eine kostenlose 1-stündige Architektur-Review](/de/contact/) - in 60 Minuten finde ich über 100.000 € an Compliance-Risiken, Cloud-Verschwendung oder Skalierungspotenzial, oder ich sage es Ihnen offen und wir gehen getrennte Wege.
