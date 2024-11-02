---
date: "2024-08-14"
draft: false
title: "Atruvia / Sparkasse / Volksbank – Data Warehouse"
logo: "images/client-logo/sparkasse.png"
---


> Ersetzen von Hadoop durch ein Data Warehouse auf Basis von Trino, aufgebaut mit einer autoskalierenden Microservice-Architektur zur Verarbeitung von Finanzdaten von Millionen deutscher Kunden.

{{< image title="Atruvia / Sparkasse / Volksbank – Data Warehouse" w="50%" o="webp q100" p="center" c="img-fluid shadow rounded-1" src="images/client-logo/sparkasse.png" alt="alter-text" >}}

## Fallstudie: Revolutionierung des Datenmanagements für Atruvia mit Open-Source-Lösungen

{{< youtube iS2nGaXtnCc >}}

## Kunde: Atruvia (IT-Dienstleister für Volksbank und Sparkasse)

### Projektübersicht:

Atruvia, das IT-Rückgrat von Volksbank und Sparkasse, sah sich mit steigenden Kosten und Einschränkungen ihrer Hadoop-basierten Datenmanagement-Infrastruktur konfrontiert. In der Erkenntnis, dass eine kostengünstigere und fortschrittlichere Lösung erforderlich war, strebte Atruvia den Aufbau eines modernen Data Warehouses an, das auf modernsten Technologien basiert. Ziel war es, eine BaFin-konforme Microservice-Architektur zu schaffen, die es den Analytik-Teams ermöglicht, riesige Datensätze mühelos zu verarbeiten, ausschließlich mit Open-Source-Tools und ohne öffentliche Cloud-Komponenten.

### Zielsetzung:

Ersetzung der teuren Hadoop-Infrastruktur durch eine skalierbare, effiziente und kostengünstige Data-Warehouse-Lösung auf Basis von Trino und S3-Autoscaling-Clustern, um die Einhaltung der BaFin-Vorschriften zu gewährleisten und die Datenleistung für Endbenutzer zu optimieren.

### Lösungsdesignprozess:

#### Anforderungsanalyse:

- Durchführung eingehender Gespräche mit den IT- und Analytik-Teams von Atruvia, um deren spezifische Bedürfnisse, Herausforderungen und regulatorische Anforderungen zu verstehen.
- Identifizierung kritischer Aspekte wie Kostenreduktion, Skalierbarkeit, Datenleistung und Benutzerfreundlichkeit für die Analytik-Teams.

#### Technologieauswahl:

- Bewertung verschiedener Open-Source-Technologien zur Ersetzung von Hadoop, mit Fokus auf Trino für seine leistungsstarken SQL-Abfragefähigkeiten und S3-Autoscaling-Cluster für effiziente Datenspeicherung.
- Sicherstellung, dass alle ausgewählten Technologien BaFin-konform sind und nahtlos in die bestehende Infrastruktur von Atruvia integriert werden können.

#### Architekturdesign:

- Entwurf einer Microservice-Architektur unter Verwendung von OpenShift zur Bereitstellung der gesamten Data-Warehouse- und Analytik-Umgebung.
- Implementierung von S3-Autoscaling-Clustern als primäre Speicherlösung, um traditionelle Datenbanken zu ersetzen und die Skalierbarkeit für große Datensätze zu gewährleisten.
- Entwicklung eines BaFin-konformen Rahmens zur Verwaltung der Datensicherheit und der Einhaltung von Vorschriften.

#### Benutzerfreundliche Tools und Umgebungen:

- Erstellung vorkonfigurierter Jupyter-Notebook-Umgebungen, um den Analytik-Teams zu ermöglichen, große Datensätze hochzuladen, zu analysieren und zu visualisieren, ohne umfangreiche technische Kenntnisse zu benötigen.
- Integration interaktiver Dashboards zur Bereitstellung von Echtzeiteinblicken und zur Optimierung der Datenanalyseprozesse.

### Implementierung:

#### Infrastrukturaufbau:

- Bereitstellung von Trino und S3-Autoscaling-Clustern innerhalb der OpenShift-Umgebung, um hohe Verfügbarkeit und Skalierbarkeit sicherzustellen.
- Konfiguration der Microservice-Architektur zur effizienten Handhabung von Datenaufnahme, -verarbeitung und -abfrage.

#### Datenmigration:

- Durchführung einer nahtlosen Migration der Daten von der Hadoop-Infrastruktur zum neuen Data Warehouse auf Basis von Trino und S3.
- Sicherstellung der Datenintegrität und Einhaltung der Vorschriften während des gesamten Migrationsprozesses.

#### Benutzerschulung und Unterstützung:

- Bereitstellung umfassender Schulungssitzungen für die Analytik-Teams, um sie mit den neuen Tools und Arbeitsabläufen vertraut zu machen.
- Etablierung eines Unterstützungsrahmens, um Benutzer beim Übergang zur neuen Umgebung zu unterstützen und deren Vorteile zu maximieren.

### Ergebnisse:

- Kostenreduktion: Erfolgreiche Reduzierung der Datenmanagementkosten durch Ersetzung der teuren Hadoop-Infrastruktur durch eine effizientere Open-Source-Lösung.
- Skalierbarkeit und Leistung: Erzielung signifikanter Verbesserungen in der Datenskalierbarkeit und -leistung, die eine nahtlose Handhabung großer Datensätze ermöglichen.
- Einhaltung der Vorschriften: Sicherstellung der vollständigen Einhaltung der BaFin-Vorschriften, Bereitstellung einer sicheren und zuverlässigen Datenmanagement-Umgebung.
- Benutzerermächtigung: Ermächtigung der Analytik-Teams mit benutzerfreundlichen Tools, Eliminierung der Notwendigkeit für PySpark und komplexe Konfigurationen, und Ermöglichung der Fokussierung auf die Gewinnung von Erkenntnissen aus den Daten.

### Fazit:

Das Projekt führte zu einer transformativen Datenmanagementlösung für Atruvia, die Open-Source-Technologien nutzt, um ein skalierbares, kostengünstiges und BaFin-konformes Data Warehouse bereitzustellen. Durch die Ersetzung von Hadoop durch Trino und S3-Autoscaling-Cluster und die Bereitstellung benutzerfreundlicher Analytik-Tools verbesserte Atruvia seine Datenfähigkeiten erheblich, gewährleistete optimale Leistung und ermöglichte seinen Analytik-Teams, sich auf die Gewinnung von Erkenntnissen aus den Daten zu konzentrieren.

Möchten Sie Ihre Dateninfrastruktur modernisieren? Kontaktieren Sie uns noch heute, um zu erfahren, wie wir Ihnen helfen können, eine skalierbare, kostengünstige und konforme Datenmanagementlösung zu entwickeln, die auf Ihre Bedürfnisse zugeschnitten ist!