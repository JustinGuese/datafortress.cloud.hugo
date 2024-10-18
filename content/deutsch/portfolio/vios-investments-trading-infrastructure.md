---
date: "2024-08-14"
draft: false
title: "Vios Investments – Handelsinfrastruktur"
logo: "images/client-logo/vios.png"
---


> Erstellung und Bereitstellung eines LSTM-Modells, das das optimale Sharpe-Verhältnis eines gegebenen Aktienuniversums vorhersagt


{{< image title="Vios Investments – Handelsinfrastruktur" w="50%" o="webp q100" p="center" c="img-fluid shadow rounded-1" src="images/client-logo/vios.png" alt="alter-text" >}}

## Anwendungsfall: Vorhersage der optimalen Sharpe-maximierten Aktienauswahl für Vios Investing

**Kunde**: Vios Investing (Taiwan)

### Überblick:

Vios Investing, ein führendes Investmentunternehmen in Taiwan, wollte seine Aktienauswahlstrategie verbessern, indem es die optimale Sharpe-maximierte Auswahl von Aktien, die an der Taiwan Stock Exchange (TWSE) notiert sind, vorhersagt. Durch den Einsatz fortschrittlicher statistischer Techniken und Deep-Learning-Modelle sollte das Ziel erreicht werden, die Anlageerträge zu verbessern und eine überlegene risikoadjustierte Performance zu erzielen.

### Zielsetzung:

Entwicklung eines Vorhersagemodells unter Verwendung von LSTM (Long Short-Term Memory)-Netzwerken zur Prognose zukünftiger Aktiengewichte, die das Sharpe-Verhältnis maximieren und somit die Anlageentscheidungen verbessern. Die Lösung musste robust, skalierbar und in die bestehende Infrastruktur von Vios Investing integrierbar sein.

### Lösungsdesignprozess:

#### Anforderungsanalyse:

- Zusammenarbeit mit den Finanzanalysten und dem IT-Team von Vios Investing, um deren spezifische Anforderungen und Ziele zu verstehen.
- Identifizierung wichtiger Leistungskennzahlen, einschließlich des Sharpe-Verhältnisses, und der Einschränkungen des TWSE-Marktes.

#### Datenvorbereitung:

- Sammlung historischer Aktienkurse von der TWSE, mit Fokus auf Kursbewegungen, Handelsvolumen und anderen relevanten Finanzindikatoren.
- Anwendung statistischer Verbesserungen und Rauschunterdrückungstechniken zur Bereinigung und Vorverarbeitung der Daten, um qualitativ hochwertige Eingaben für das Modell zu gewährleisten.

#### Modellentwicklung:

- Entwicklung eines LSTM-Modells zur Vorhersage zukünftiger Aktiengewichte mit dem Ziel, das Sharpe-Verhältnis zu maximieren.
- Implementierung des Modells unter Verwendung von Python und Deep-Learning-Bibliotheken, um Robustheit und Genauigkeit sicherzustellen.

#### Backtesting und Validierung:

- Durchführung umfangreicher Backtests mit historischen Daten zur Validierung der Modellleistung.
- Bewertung der Fähigkeit des Modells, überlegene risikoadjustierte Renditen zu erzielen, mit besonderem Fokus auf die Erzielung eines hohen Alphas gegenüber dem TWSE-Index.

### Bereitstellung:

#### Infrastruktur-Setup:

- Einrichtung eines Kubernetes-Clusters mit GPU-Unterstützung, um die notwendige Rechenleistung für das LSTM-Modell bereitzustellen.
- Bereitstellung des Docker-Images, das das Vorhersagemodell enthält, im Kubernetes-Cluster, um eine nahtlose Integration in die bestehende Infrastruktur von Vios Investing zu gewährleisten.

#### Modelltraining und -optimierung:

- Training des LSTM-Modells mit vorverarbeiteten historischen Daten und Feinabstimmung der Hyperparameter zur Optimierung der Leistung.
- Einbeziehung von Feedback aus ersten Testläufen zur Verfeinerung des Modells und Verbesserung der Vorhersagegenauigkeit.

#### Backtesting-Ergebnisse:

- Durchführung umfangreicher Backtests mit Demodaten zur Simulation realer Handelsszenarien.
- Erzielung eines Alphas von 22 Punkten pro Jahr gegenüber dem TWSE-Index, was auf eine vielversprechende Verbesserung der Anlageperformance hinweist.

#### Laufende Tests:

- Bereitstellung des bereitgestellten Modells für Vios Investing zur weiteren Prüfung und Validierung mit Live-Daten.
- Einrichtung einer Feedback-Schleife zur kontinuierlichen Überwachung der Modellleistung und zur Vornahme notwendiger Anpassungen.

### Ergebnisse und Auswirkungen:

- **Alpha-Generierung**: Die Backtesting-Ergebnisse zeigten ein beeindruckendes Alpha von 22 Punkten pro Jahr gegenüber dem TWSE-Index, was das Potenzial des Modells zur signifikanten Verbesserung der Anlageerträge unterstreicht.
- **Sharpe-Verhältnis-Optimierung**: Erfolgreiche Entwicklung eines Vorhersagemodells, das Aktiengewichte optimiert, um das Sharpe-Verhältnis zu maximieren und überlegene risikoadjustierte Renditen zu erzielen.
- **Skalierbare Bereitstellung**: Bereitstellung des Modells unter Verwendung von Docker und Kubernetes, um Skalierbarkeit, Zuverlässigkeit und effiziente Nutzung der Rechenressourcen sicherzustellen.
- **Echtzeitvorhersagen**: Ermöglichung von Vios Investing, Echtzeitdaten für laufende Vorhersagen zu nutzen, um ihre Handelsstrategien und Entscheidungsprozesse zu verbessern.

### Fazit:

Das Projekt führte zu einem hochwirksamen Vorhersagemodell für Vios Investing, das fortschrittliche statistische Techniken und Deep Learning nutzt, um die Aktienauswahl an der TWSE zu optimieren. Durch die Erzielung eines signifikanten Alphas gegenüber dem Index verspricht die Lösung, die Anlageperformance des Unternehmens zu verbessern. Die skalierbare Bereitstellung auf Kubernetes mit GPU-Unterstützung stellt sicher, dass Vios Investing weiterhin modernste Technologie für überlegene Anlageergebnisse nutzen kann.

**Planen Sie den Einsatz von maschinellem Lernen zur Vorhersage von Zeitreihenmodellen?** Kontaktieren Sie uns jetzt für eine kostenlose Beratung.