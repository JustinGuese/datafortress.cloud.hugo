---
title: "Open Source: Pandas to_sql"
date: 2022-07-12T17:02:17+02:00
draft: false
image: "/images/products/pandas.png"
---
# Open Source: Pandas to_sql

https://github.com/pandas-dev/pandas/pull/48331  

Pandas ist eine der meistgenutzten Data-Science-Bibliotheken in Python, und ich arbeite schon seit einiger Zeit mit anderen an der Funktion "to_sql". Derzeit ist diese Funktion nur in der Lage, einen Pandas-Datenrahmen in eine SQL-Datenbank zu schreiben, wenn die Einträge darin neu sind. Wenn es bereits einen Eintrag in der Datenbank gibt, wird ein Fehler ausgegeben. Die neue Funktionalität erlaubt ein Upsert und bietet verschiedene Optionen (on duplicate -> error / replace / keep database).
Die Tests für Pandas sind sehr streng, und der Code muss auf ARM, AMD, etc. funktionieren, so dass sich die PR ewig hinzieht.
