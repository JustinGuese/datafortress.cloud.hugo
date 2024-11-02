---
date: "2024-08-14"
draft: false
title: "BMW / HPE: Weltweite Backup-Lösung für VMs"
logo: "images/client-logo/bmw.png"
---


> Lösungsarchitektur für das weltweite Backup-System von VM-basierten Systemen, einschließlich der Planung von Netzwerk-Routing-Beschränkungen in AWS/Google Cloud/Azure.

{{< image title="BMW / HPE: Weltweite Backup-Lösung für VMs" w="50%" o="webp q100" p="center" c="img-fluid shadow rounded-1" src="images/client-logo/bmw.png" alt="alter-text" >}}

## Fallstudie: Gestaltung einer globalen Backup-Lösung für BMWs virtuelle Maschinen und Dateifreigabetools

**Kunde**: BMW / HPE

{{< youtube OEPQSiFrDR8 >}}

### Projektübersicht:

BMW benötigte eine robuste und skalierbare Backup-Lösung für ihre umfangreichen und weltweit verteilten virtuellen Maschinen (VM) und Dateifreigabetools. Die Hauptaufgabe bestand darin, eine Backup-Lösung zu finden, die das enorme Datenvolumen von Hunderten von Petabytes bewältigen kann, während die Datenzuverlässigkeit, effiziente Deduplizierung und die Überwindung von Bandbreitenbeschränkungen sichergestellt werden.

### Ziel:

Forschung, Vergleich und Implementierung einer umfassenden Backup-Strategie, die sowohl Cloud-Speicheranbieter als auch lokale HPE-Deduplizierungsserver nutzt, um Kosteneffizienz und hohe Zuverlässigkeit zu gewährleisten.

### Lösungsdesign-Prozess:

#### Anforderungserhebung:

- Detaillierte Gespräche mit dem IT-Team von BMW geführt, um die spezifischen Bedürfnisse und Einschränkungen in Bezug auf die Datensicherung zu verstehen.
- Kritische Parameter wie Datenvolumen, Bandbreitenbeschränkungen, Schreibgeschwindigkeiten der Festplatten und die Bedeutung der Daten-Deduplizierung identifiziert.

#### Forschung und Analyse:

- Umfangreiche Recherchen zu verschiedenen Cloud-Speicheranbietern durchgeführt, um deren Bandbreitenlimits, Schreibgeschwindigkeiten der Festplatten und Skalierbarkeit zu bewerten.
- Die Kostenimplikationen der Nutzung verschiedener Cloud-Anbieter für solch große Datenvolumen analysiert.
- Die Deduplizierungstechnologie von HPE untersucht und deren Potenzial zur Integration mit sowohl Cloud- als auch lokalen Speicherlösungen bewertet.

#### Vergleich der Cloud-Anbieter:

Vergleich führender Cloud-Speicheranbieter (z.B. AWS, Google Cloud, Microsoft Azure) mit Fokus auf:
- Bandbreitenlimits
- Schreibgeschwindigkeiten der Festplatten
- Kosten pro Petabyte Speicher
- Datenredundanz und Zuverlässigkeitsmerkmale  
Die Machbarkeit dieser Anbieter zur effektiven Bewältigung der Backup-Bedürfnisse von BMW bewertet.

#### Entwicklung einer hybriden Backup-Lösung:

- Eine hybride Backup-Strategie entwickelt, die mehrere Cloud-Anbieter kombiniert, um Multi-Zuverlässigkeit zu gewährleisten und Single Points of Failure zu vermeiden.
- HPE-Deduplizierungsserver integriert, um das zu sichernde Datenvolumen erheblich zu reduzieren und so die Bandbreitenbeschränkungen zu adressieren.
- Sicherstellung, dass die kritischsten Daten in deduplizierter Form gesichert werden, um die Kosteneffizienz und den Datenschutz weiter zu verbessern.

### Implementierung:

#### Integration:

- Die hybride Backup-Lösung mit nahtloser Integration zwischen lokalen HPE-Deduplizierungsservern und ausgewählten Cloud-Speicheranbietern implementiert.
- Einen systematischen Backup-Zeitplan entwickelt, um die Bandbreitennutzung zu optimieren und potenzielle Engpässe zu vermeiden.

#### Testen und Validierung:

- Strenge Tests durchgeführt, um die Datenintegrität, Backup-Geschwindigkeiten und die Effizienz der Deduplizierungsprozesse sicherzustellen.
- Die Zuverlässigkeit der Lösung durch mehrere Failover-Tests und Datenwiederherstellungsübungen validiert.

#### Optimierung:

- Die Backup-Prozesse kontinuierlich überwacht, um Ineffizienzen zu identifizieren und zu beheben.
- Das Gleichgewicht zwischen lokalen und Cloud-Speichern feinabgestimmt, um Kosteneinsparungen zu maximieren, ohne die Datensicherheit und Zugänglichkeit zu beeinträchtigen.

### Ergebnisse:

- **Kosteneffizienz**: Nachgewiesen, dass ein selbst gehostetes, dedupliziertes Backup-Setup erheblich kostengünstiger sein kann als die ausschließliche Nutzung von Cloud-Speicheranbietern, insbesondere bei großen Datenvolumen.
- **Datenzuverlässigkeit**: Hohe Datenzuverlässigkeit durch eine Kombination aus Multi-Cloud-Redundanz und der robusten Deduplizierungstechnologie von HPE erreicht.
- **Bandbreitenmanagement**: Erfolgreich die Bandbreitenbeschränkungen durch den Einsatz von HPE-Servern zur Reduzierung des zu übertragenden Datenvolumens in die Cloud gemindert.
- **Skalierbarkeit**: Sicherstellung, dass die Lösung mit den wachsenden Datenanforderungen von BMW skalieren kann, und eine nachhaltige langfristige Backup-Strategie bereitgestellt.

### Fazit:

Das Projekt führte zu einer hocheffizienten, skalierbaren und kosteneffizienten Backup-Lösung für BMWs weltweite VM-Systeme und Dateifreigabetools. Durch die Nutzung eines hybriden Ansatzes mit sowohl Cloud-Speicher als auch lokalen HPE-Deduplizierungsservern haben wir nicht nur die Erwartungen des Kunden erfüllt, sondern übertroffen, indem wir Datenzuverlässigkeit und erhebliche Kosteneinsparungen gewährleisteten.

Erleben Sie unvergleichliche Datenzuverlässigkeit und Kosteneinsparungen mit unseren hybriden Backup-Lösungen—kontaktieren Sie uns jetzt, um Ihre Datenmanagementstrategie zu transformieren!