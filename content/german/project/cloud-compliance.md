---
title: Cloud Compliance
date: '2018-09-24T14:48:03.000+06:00'
description: This is meta description
bg_image: "/images/activity-board-game-connection-desk-613508-300x200.webp"
image: "/images/activity-board-game-connection-desk-613508-300x200.webp"
live_demo: ''
case_study: ''
category: Cloud
overview:
- label: Client
  data: Während meiner Arbeit bei der Porsche Holding
- label: Category
  data: Cloud
- label: Expertise
  data: Cloud Law
- label: Date
  data: 2019

---
Während unserer Arbeit in meiner früheren Firma haben wir beschlossen, einige Prozesse in der Cloud zu implementieren.  
Ein wichtiger Faktor, insbesondere für ein so großes Unternehmen wie die Porsche Holding, war die Beachtung der etablierten Datenschutzgesetze, wie z.B. des [europäischen DSGVO] (https://www.dsb.gv.at/gesetze-in-osterreich) und der von der Porsche Holding selbst erlassenen Unternehmenseinschränkungen.

In vielen Unternehmen gab es bereits massive Verstöße, die aus mangelnder Kenntnis des Themas resultierten.

## DIE HERAUSFORDERUNG

Das Unternehmen verfügte bereits über eine ausgezeichnete Datenstrategie, wollte aber die Prozesse weiter kategorisieren und ändern, um zukünftige DSGVO-Prozesse noch besser handhaben zu können.

## DIE STRATEGIE

DSGVO, HIPAA und andere Compliance-Gesetze haben in den letzten Jahren einige Unternehmen überrascht. Anstatt jedoch Angst zu haben, sollten Unternehmen dies als eine gute Möglichkeit sehen, Daten endlich zu kategorisieren und zu sehen, welche Daten wirklich benötigt werden.

##### Daten-Katalog

Der erste Schritt für ein Unternehmen, das versucht, mit dem DSGVO oder anderen Datengesetzen umzugehen, sollte darin bestehen, einen Katalog seiner Daten zu erstellen, der in vier verschiedene Segmente unterteilt ist:

1. **sehr personenbezogene Daten**  
   (Biomedizinische Daten, Beziehungen zu anderen Menschen, DNA-Daten, medizinische Aufzeichnungen, sexuelle Interessen, rassistische Informationen, ...)
2. **Persönliche Daten**  
   (Name, Adresse, IP, Seriennummern ihrer Produkte, ...) - im Grunde alles, was verwendet werden kann, um diese Daten einer bestimmten Person zuzuordnen
3. **isolierte "persönliche" Daten  
   **Daten, die an einem anderen Ort gespeichert sind, aber in Kombination mit einem anderen Datensatz zur Identifizierung einer Person verwendet werden könnten. Wenn z.B. eine Datenbank die Krankenakte einer Person zusammen mit einer Patienten-ID und eine andere Datenbank die ID und den wirklichen Namen enthält, könnte ein Datenbruch in beiden Datenbanken immer noch Zugriff auf die Krankenakte und den vollständigen Namen dieser Person verursachen. Auch die Zweiwege-Verschlüsselung kann in diese Kategorie fallen, da die Daten verschlüsselt werden können, wenn auf den Schlüssel zugegriffen wird.
4. **öffentliche Daten  
   **Daten, die keine Möglichkeit lassen, diese Person zu identifizieren, oder die eine Person überhaupt nicht betreffen. Denken Sie darüber nach, wie es sich auf Ihr Unternehmen auswirken würde, wenn diese Daten verloren gingen. Wenn sich nichts ändert und niemand betroffen ist, handelt es sich im Grunde um "öffentliche Daten". Aber seien Sie vorsichtig, auch wenn Sie denken könnten, dass sie keine Auswirkungen haben sollten, bedeutet das nicht, dass sie harmlos sind. Wenn z.B. eine Person auf Bildern im Hintergrund zu sehen ist, verstößt sie dennoch gegen die Datenschutzgesetze!

##### Datenziel/Pipeline

Der nächste Schritt besteht darin, grundsätzlich alle Daten so zu ändern, dass sie nach Möglichkeit der Kategorie 4 (Öffentliche Daten) angehören. Natürlich lassen sich einige Daten nicht auf diese Form reduzieren, aber es gibt verschiedene Werkzeuge, um das Speichern von eindeutigen Namen oder Adressen in Ihrer Datenbank zu vermeiden.

Überlegen Sie sich zunächst, ob Sie die klare Version, d.h. z.B. den vollständigen Namen, wirklich benötigen, um Ihre Datenverarbeitung abzuwickeln. Könnten Sie dann, wenn Sie diesen Namen oder eine ID wirklich brauchen, den Namen durch eine ID ersetzen? Oder könnten Sie wahrscheinlich persönliche Daten und geschäftsanalytische Daten in verschiedene Datenbanken trennen?

Werfen wir einen Blick auf ein Beispiel:

Nehmen wir an, eine Datenbank enthält alle Ihre Verkäufe einschließlich der Namen, Adressen und Telefonnummern Ihrer Kunden. Ihr Standardprozess besteht darin, diese Daten in einem Business Intelligence (BI)-Tool zu analysieren, um Ihre Konversionsraten, Umsätze, Umsätze pro Kunde usw. abzuleiten.

Für die Berechnung von Umsatzzahlen ist eine bestimmte ID oft nicht erforderlich (außer z.B. Umsatz pro Kunde). Wenn Sie z.B. nur Umsätze und Verluste zusammenfassen möchten, benötigen Sie nur Transaktionen mit ihrem Geldwert ohne Namen, Adressen usw. des Kunden. D.h. wenn nur dies Ihr analytisches Anliegen ist, könnten Sie eine zweite Datenbank anlegen, die nur diese notwendigen Informationen enthält und auf die nur das BI-Werkzeug zugreift.

Wenn Sie dennoch eine ID für den Kunden benötigen, um z.B. "beste Kunden" zu berechnen, könnten Sie Namen durch IDs ersetzen. So wird z.B. "Geschäft X1" zu "ID1". Dann könnten Sie die ID- und Namenskombination in einer anderen, sichereren Datenbank speichern, auf die nur Sie oder eine eingeschränkte Person Zugriff hat.

Eine andere Möglichkeit wäre, Daten zu verschlüsseln. Man könnte z.B. alle Namen verschlüsseln und nur dann entschlüsseln, wenn man den Namen des Unternehmens wirklich braucht (wobei die Verschlüsselungsschlüssel niemals Ihre Firma verlassen dürfen).

Eine andere Methode, wenn man nur eine ID und überhaupt keinen wirklichen Namen braucht, ist das "Hashing" der Daten, was im Grunde eine Einweg-Verschlüsselung ist. Wenn Sie einen vollständigen Namen in den Algorithmus "einfügen", liefert dieser immer eine eindeutige ID, die niemals (vereinfacht) auf den vollständigen Namen zurück entschlüsselt werden kann. Auf diese Weise erhalten Sie eine persönliche ID ohne die Möglichkeit, den vollständigen Namen Ihres Kunden abzuleiten.

Dies war jedoch nur ein kurzer Überblick. Um die Möglichkeiten vollständig zu entdecken, muss man sich die Daten, das Umfeld und die individuelle Situation anschauen.





[Sie haben eine ähnliche Idee oder wir haben Ihr Interesse geweckt? Kontaktieren Sie uns jetzt für eine gratis 15-minütige Beratung!](https://www.datafortress.cloud/de/contact/)
