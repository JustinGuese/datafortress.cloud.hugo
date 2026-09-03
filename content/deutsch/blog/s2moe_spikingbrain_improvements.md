---
title: 'Gleiche Antwort, 1/32 der Arbeit: Ein sparsames Mixture-of-Experts FFN zu SpikingBrain (ein 5B gehirninspiriertes Modell) hinzufügen'
bg_image: 'images/blog/s2moe-vs-dense.png'
date: 2026-07-30T09:10:00+02:00
author: 'Justin Guese'
description: 'Ich habe die Feed-Forward-Schicht von SpikingBrain 2.0 als Top-1 sparsames Mixture-of-Experts neu aufgebaut. Gleiche Qualität bei 1/32 der FFN-Berechnung, 2,71x weniger Block-FLOPs bei ihrer 5B-Form - und das eine Ergebnis, das ein zweiter Zufallssamen löschte.'
image: 'images/blog/s2moe-vs-dense.png'
categories:
  - Machine Learning

tags:
  [
    'mixture of experts',
    'model efficiency',
    'spikingbrain',
    'cuda kernels',
    'open source',
  ]
type: post
---

## Die einfache Version in 60 Sekunden

Stellen Sie sich eine Reparaturwerkstatt mit 32 Spezialisten vor.

Heutige KI-Modelle funktionieren wie ein Laden, in dem **jeder Auftrag gleichzeitig an alle 32 Personen weitergegeben wird.** Jeder bearbeitet alles. Das funktioniert. Es ist auch ungeheuer verschwenderisch.

Ich habe einen Teil eines KI-Modells mit 5 Milliarden Parametern ([SpikingBrain 2.0](https://github.com/BICLab/SpikingBrain2.0)) so umgebaut, dass eine Rezeptionistin jeden Auftrag zuerst liest und ihn **nur an den einen Spezialisten weitergibt, der ihn bearbeiten sollte.**

Gleicher Laden. Die gleichen 32 Spezialisten auf der Gehaltsrolle. Gleiche Qualität der Arbeiten am Ende.

**Ein zweiunddreißigstel der Arbeit.**

Das ist die ganze Idee. Der Rest dieses Beitrags ist das, was passierte, als ich es ordnungsgemäß gemessen habe - einschließlich des einen Ergebnisses, das ich wegwerfen musste.

## Was ist ein Mixture-of-Experts-Modell?

In einem normalen neuronalen Netzwerk durchlaufen alle Eingaben alle Parameter. Es ist eine einzige riesige Funktion, und alles wird jedes Mal ausgeführt.

Ein **Mixture-of-Experts (MoE)**-Modell teilt diese große Funktion in viele kleinere Funktionen auf - die "Experten" - und stellt einen **Router** davor. Der Router schaut sich jedes Wort an und wählt aus, welcher Experte es bearbeitet.

Mit **Top-1-Routing** führt genau ein Experte pro Wort aus. Nicht zwei, nicht eine Mischung. Einer.

Hier ist der wichtige Teil: **Die Kosten pro Wort ändern sich nicht, wenn Sie mehr Experten hinzufügen.** Vierundsechzig Experten kosten pro Wort das Gleiche wie acht, weil Sie immer noch nur einen von ihnen ausführen. Aber die Gesamtkapazität des Modells wächst jedes Mal, wenn Sie einen hinzufügen.

Das ist kein cleverer Trick, den jemand entdeckt hat. Das ist Arithmetik. Und genau deshalb ist sie vertrauenswürdig.

## Was ist SpikingBrain 2.0?

[SpikingBrain 2.0](https://github.com/BICLab/SpikingBrain2.0) ist eine quelloffene gehirninspirierte Modellfamilie des Institute of Automation, Chinese Academy of Sciences. Zwei 5B-Modelle, veröffentlicht mit Code und Gewichten.

Es ist wirklich interessante Arbeit. Es ersetzt die Standard-Attention durch ein Hybrid aus sparsamer Softmax-Attention und sparsamer linearer Attention, fügt ein Aktivierungscodierungs-Schema hinzu, das ereignisgesteuerte Hardware unterstützt, und versendet eine Konvertierungspipeline, die bestehende Transformer in diese Architektur umwandelt.

Ich habe ihren veröffentlichten Code gelesen, anstatt nur das Papier zu lesen, und habe die Öffnung gefunden, die ich brauchte: **Jeder Block ist `attention → dense feed-forward`.** Es gibt nirgends in der Veröffentlichung ein Expert-Routing in der Feed-Forward-Schicht.

Ein sparsames MoE Feed-Forward ist also keine konkurrierende Idee zu ihrer. Es ist ein **leerer Platz.**

## Was ich hinzugefügt habe

Vier Mechanismen, entnommen aus [meinem eigenen Research-Repository](https://github.com/JustinGuese/S2-MoE-llm) und in ihren Block portiert:

- **Ein Top-1-gerouteter Pool von Experten**, der die dichte Feed-Forward-Schicht ersetzt.
- **Ein immer aktiver gemeinsamer Kern** - ein kleiner Experte, den jedes Wort durchläuft, neben dem gerouteten.
- **Ein Grouped-GEMM-CUDA-Kernel**, weil es ohne diesen die ganze Sache langsamer macht (mehr dazu unten).
- **Ein Dense-zu-MoE-Upcycler**, damit der Expertpool aus ihren _bereits trainierten Gewichten_ aufgebaut werden kann, anstatt von Grund auf neu zu trainieren.

Alles sitzt hinter einem Config-Schlüssel, der in allen sechs ihrer versendeten Configs fehlt. **Ihre veröffentlichten Checkpoints laden und laufen Byte-für-Byte wie zuvor**, es sei denn, Sie schalten ihn absichtlich ein. Es gibt einen Test, der das bestätigt.

## Ergebnis: gleiche Qualität bei 1/32 der Feed-Forward-Berechnung

Hier ist die Kernmessung.

Bei **abgestimmter Parameteranzahl** - 77,8M für das sparsame Modell gegenüber 77,7M für ein dichtes Kontrollmodell, 0,2% auseinander - erreicht das sparsame Modell **die gleiche Validierungs-Perplexity** während es **1/32 der Feed-Forward-Berechnung** ausführt.

Das ist **32x die Genauigkeit pro Einheit der aktiven Berechnung.**

Gleiche Größe. Gleiche Qualität. Ein zweiunddreißigstel der Arbeit in dieser Schicht.

Dies ist die Sparse-MoE-Proposition, die genau wie angekündigt funktioniert: Kapazität skaliert mit dem Pool, aktive Berechnung bleibt flach.

## Was das in ihrer 5B-Skala wert ist

Berechnungsansprüche werden durch Tensor-Formen bestimmt, nicht durch Training - daher können sie direkt bei SpikingBrains echten 5B-Block-Dimensionen mit zufälligen Gewichten gemessen werden, in etwa zwanzig Minuten auf einer einzelnen RTX 4090.

Bei `hidden_size 2560`, `intermediate_size 9728`, bf16, parameterabgestimmt, Batch 8 × Sequenz 512:

| Feed-Forward              | MFLOP/token | mJ/token | Active watts | Tokens/sec  |
| ------------------------- | ----------- | -------- | ------------ | ----------- |
| Dense SwiGLU (their code) | 229.1       | 0.669    | 298.5        | **446,070** |
| Sparse MoE, 16 experts    | 89.1        | 0.419    | 138.9        | 331,697     |
| Sparse MoE, 32 experts    | 84.5        | 0.412    | 133.7        | 324,344     |
| Sparse MoE, 64 experts    | 82.3        | 0.414    | 123.7        | 299,053     |

**2,71x weniger FLOPs pro Block. 1,62x weniger Energie pro Token. Weniger als die Hälfte des Stromverbrauchs** - 134 W gegenüber 299 W.

## Warum 1/32 sich nicht in 32x Gesamt umwandelt

Schauen Sie sich diese Tabelle noch einmal an. Die Feed-Forward-Berechnung fiel um 32x, aber der ganze Block fiel nur um 2,71x. Wohin ging der Rest?

**Die Teile, die immer aktiv sind, schrumpfen nicht.** Attention läuft immer noch auf jedem Wort. Der Router läuft auf jedem Wort. Der gemeinsame Kern läuft auf jedem Wort.

Die Optimierung einer Komponente kann Sie nur um den Anteil dieser Komponente am Gesamt sparen. Sobald die Feed-Forward-Schicht nahezu kostenlos ist, werden alle anderen Teile zum Boden - und Sie haben die Obergrenze erreicht, was Feed-Forward-Sparsity tun kann.

Falls Sie eine Zahl aus diesem Beitrag für Ihre eigene Arbeit nehmen, nehmen Sie diese. Sie sagt Ihnen, wann Sie mit der Optimierung dieser Schicht aufhören und sich eine andere anschauen sollten.

## Der ehrliche Teil: das dichte Modell ist schneller

Lesen Sie die Spalte Tokens-pro-Sekunde richtig. **446.000 für dicht gegenüber 324.000 für sparsam.** Dicht gewinnt mit komfortablem Vorsprung.

Der Gewinn hier ist **FLOPs und Leistung, nicht Echtzeit-Durchsatz.**

Der Grund ist unspektakulär: eine breite dichte Matrixmultiplikation nutzt eine GPU besser als eine gruppierte Matrixmultiplikation plus ein Router plus ein gemeinsamer Kern. GPUs sind für große regelmäßige Rechenblöcke gebaut.

Auf stromkontrollierter oder ereignisgesteuerter Hardware kehrt sich dieser Kompromiss um und das sparsame Modell gewinnt. Auf einer durchsatzbeschränkten Rechenzentrum-GPU nicht. Jeder, der dies benchmark würde, würde das in zehn Minuten finden, daher gibt es keinen Sinn, so zu tun, als wäre es anders.

## Sparse Modelle sind langsamer ohne den richtigen CUDA-Kernel

Dies ist der Teil, den ich am meisten möchte, dass ein anderer Ingenieur mitnimmt.

Die offensichtliche Implementierung schleift über Experten in Python - eine Iteration, ein Kernel-Start jeweils. Dieser Overhead ist fest pro Experte, daher wächst er genau so schnell wie Ihre Einsparungen.

**Auf sich allein gemessen, war die naive Sparse-Schicht bei jedem Experten-Count langsamer als dicht.** Die FLOP-Einsparung existierte auf dem Papier und absolut nirgendwo sonst.

Die Lösung: Sortieren Sie Token nach ihrem zugewiesenen Experten in zusammenhängende Blöcke und geben Sie eine gruppierte Matrixmultiplikation über alle aus. Ich wickelte `torch._grouped_mm` in eine Autograd-Funktion mit einem expliziten Rückwärtsdurchgang, damit es auch beim Training funktioniert.

| Experts                | 8     | 16    | 32    | 64         |
| ---------------------- | ----- | ----- | ----- | ---------- |
| Forward vs Python loop | 2.27× | 4.60× | 8.29× | **12.75×** |
| Training step vs loop  | 1.85× | 3.99× | 6.34× | **9.95×**  |

Und es ist **bitgenau** - maximale absolute Differenz von Null gegenüber der Schleife, bei den Ausgaben und bei beiden Gewichtgradienten. Dies ist reine Overhead-Entfernung, keine Annäherung.

**Eine effiziente Architektur ohne ihren Kernel ist nur eine langsamere Architektur.** Die FLOP-Anzahl ist ein Versprechen; der Kernel ist, ob es bezahlt wird.

## Ein CUDA-Fehler, der Ihre GPU still aufhängt

Es lohnt sich zu wissen, wenn Sie jemals diesen op anfassen: **`torch._grouped_mm` verursacht einen Deadlock bei degenerierten Gruppeneinteilungen.**

Wenn die Experten-Belegung ungleichmäßig ist, erhalten Sie Null-Breiten-Segmente. Geben Sie diese dem Kernel und es hängt auf - GPU untätig, ein CPU-Kern spinnt, kein Fehler, kein Timeout. Es sieht genau wie ein langsamer Trainingsschritt aus, bis Sie bemerken, dass es schon sechs Stunden lang langsam ist.

Das Komprimieren der leeren Gruppen vor dem Aufruf ist mathematisch identisch und entfernt den Trigger vollständig.

## Überlebt die Sparsität batched serving?

Zwei verschiedene Behauptungen hier, die ständig vermischt werden, also lassen Sie uns sie trennen.

**FLOPs pro Token bleiben bei jeder Batch-Größe bei 1/32.** Jedes Wort durchläuft genau einen Experten, egal wie viele Wörter im Flug sind. Die obige Tabelle wurde bei Batch 8 gemessen - das sind bereits gepufferte Zahlen.

**Was bei der Batch-Größe zusammenbricht, ist die Experten-_Residenz_** - die Fähigkeit, nur die aktiven Experten im Speicher zu halten. Bei Batch 1 berühren Sie einen Experten von 32 und können den Rest überspringen. Bei Batch 64 deckt die _Vereinigung_ von Experten, die berührt wird, den größten Teil des Pools ab:

| Batch size     | 1     | 32    | 64    |
| -------------- | ----- | ----- | ----- |
| Union sparsity | 96.9% | 39.7% | 14.1% |

Die Experten-Offloading und ereignisgesteuerte Gewichtsgating sind also **Single-Stream-Angebote.** Die Berechnung und Energieabnahmen sind nicht - diese gelten unter Batching.

Diese Unterscheidung ist, warum "kontextuelle Sparsitäts"-Methoden ständig nicht in Production-Serving-Stacks erreichen, und warum es sich lohnt, präzise zu sein, welche der beiden Sie behaupten.

## Das Ergebnis, das ich löschte: ein Zufallssamen löschte einen 2,1%-Gewinn

Jetzt der unbequeme Teil.

Ich hatte auch einen **Qualitäts**-Gewinn. Das sparsame Modell schlug sein dichtes Kontrollmodell um 2,1% Perplexität - 58,99 gegenüber 60,27. Nette Zahl. Sie ist in die Ausarbeitung eingegangen.

Dann führte ich einen weiteren Seed aus, um Fehlerbalken zu erhalten.

Der Gewinn verschwand. Zweiter Seed: **58,52 gegenüber 58,54.** Ein toter Unentschieden.

Hier ist tatsächlich, was passierte. Der **dichte Baseline** bewegte sich zwischen Seeds um 2,9% (60,27 → 58,54). Mein Modell bewegte sich um 0,8% (58,99 → 58,52). Der erste Seed hatte nicht gezeigt, dass mein Modell gut abschneidet. Es hatte gezeigt, dass **der Baseline schlecht abschneidet.**

Über beide Seeds ist die Lücke −1,1% mit einer ±1,05 Prozentpunkt-Ausbreitung. Nicht zu unterscheiden von Parität.

**Die Lektion verallgemeinert sich: Ihr Baseline hat auch Varianz.** Ein Single-Seed-Vergleich misst nicht Ihre Methode - es misst das Glück beider Modelle. Ich hatte sogar die Regel vorher aufgeschrieben ("ein Seed, alles unter ein paar Prozent ist keine Schlussfolgerung") und 2,1% saß genau auf der Linie, was genau dort ist, wo solche Regeln aufhören, dekorativ zu sein.

Das Kernergebnis - Parität bei 1/32 der Berechnung - war niemals betroffen. Ein Bonus zu verlieren, entfernt nicht den Hauptgang. Aber die 2,1% ist weg und kommt nicht wieder.

## Was sonst nicht funktioniert hat

Zwei der vier Mechanismen zahlten sich nicht aus, und darüber zu berichten ist billiger, als dass es jemand anders entdeckt.

**Spiking-Aktivierungen kosten 2,8% Perplexität bei identischer Berechnung.** Binäre 0/1-Aktivierungen produzieren echte Aktivierungs-Sparsität - aber ein dichter GPU-Kernel kann diese nicht umsetzen. Auf dieser Hardware ist es also eine reine Qualitäts-Kosten. Ihr Wert ist die Kompatibilität mit ereignisgesteuerten neuromorphen Chips, was ein echter Grund ist, nur keine Genauigkeits- oder GPU-Effizienz-einer.

**Die Schlafphase ist träge neben einem gemeinsamen Kern.** Sie strukturiert den Expertpool während des Trainings um - mergt Duplikate, beschneidet, wächst erneut. Ergebnis: −0,28% Perplexität für 5,2% zusätzliche Trainingszeit. Die Logs erklären warum: über alle zehn Zyklen hinweg mergte sie nichts. **Der immer aktive gemeinsame Kern absorbiert genau die Redundanz, die Merging existiert, um zu entfernen.** Zwei Mechanismen machen die gleiche Arbeit, daher hat der zweite nichts mehr zu tun.

**Sogar der gemeinsame Kern ist ein Kompromiss, keine kostenlose Gewinn** - er kauft 2,5% Perplexität für 52% mehr aktive Feed-Forward-Berechnung. Es lohnt sich, wenn Sie Qualität optimieren, nicht wenn Sie Berechnung optimieren.

## Zwei Fehler in ihrer veröffentlichten Konfiguration

Wenn Sie ihren eigenen Installationsanleitung auf einer sauberen Maschine folgen, brechen zwei Dinge. Beide sind trivial, wenn Sie wissen, beide kosten eine Stunde, wenn Sie nicht:

**Ihr gebündeltes MoBA heftet immer noch `flash-attn==2.6.3` fest.** Die Installation deinstalliert lautlos `flash-attn==2.7.3`, das ihre Anleitung eine Zeile vorher verlangt, und schlägt dann fehl, 2.6.3 aus der Quelle zu bauen. Installation mit `--no-deps` behebt es und entspricht ihrer eigenen Anmerkung, dass die gebündelte Kopie für die neuere Schnittstelle angepasst wurde. Der Pin ist alte Metadaten.

**`import fla` benötigt einen C-Compiler und Python-Header vorhanden.** Triton kompiliert einen Launcher-Stub zur Import-Zeit. Auf einem minimalen CUDA-Image ohne `build-essential` und `python3-dev`, stirbt es einfach.

## Audit ihres Mechanismus statt meines

Das Interessanteste, das ich gebaut habe, ist nicht das MoE. Es ist eine Diagnose für **ihre** Architektur.

Ihre sparsame lineare Attention wählt 2 von 4 Zustandspartitionen pro Wort aus, trainiert auf ausgeglichene Nutzung durch einen Hilfsverlust. Dieser Verlust läuft nur während des Trainings. **Nichts garantiert, dass das Gleichgewicht in den veröffentlichten Gewichten überlebt** - und wie auch immer es fehlschlagen kann, zeigt sich nicht in Perplexität oder Benchmark-Scores:

- **Nutzungskollaps** - einige Partitionen nehmen die meisten Auswahlmöglichkeiten ein, daher ist der expandierte Zustand effektiv kleiner als konfiguriert und seine Speicherkosten kaufen weniger als angekündigt.
- **Eingabe-Unabhängigkeit** - Nutzung sieht global ausgeglichen aus, aber jedes Wort wählt das _gleiche_ Paar. Das Histogramm sieht perfekt aus, während das Routing keine Informationen trägt.

Es gibt eine Falle beim Messen dies. Das Laden des Modells mit `trust_remote_code=True` importiert den modellierenden Code **gebündelt im Checkpoint-Verzeichnis**, nicht die Kopie im Repository. Patchen Sie das Repository-Modul und Sie werden etwas messen, das das Modell niemals aufruft, und erhalten eine zuversichtlich aussehende Tabelle von Nichts.

Das Ergebnis über die vollständige trainierte Kontextbereich des Checkpoints:

| Context length   | 1,024  | 4,096  | 8,192  |
| ---------------- | ------ | ------ | ------ |
| Usage entropy    | 0.9868 | 0.9868 | 0.9863 |
| Most-common pair | 25.7%  | 26.2%  | 26.5%  |
| All 6 pairs used | yes    | yes    | yes    |

Entropie von 1,0 bedeutet perfekt ausgeglichen. Ein 16,7%-Anteil würde perfekt einheitlich über Paare bedeuten.

**Beide Fehlermodi sind abwesend, bei jeder Länge.** Mit einer 8x Kontexterhöhung bewegt sich die Entropie um 0,0005. Ihr Hilfsverlust hat seine Arbeit geleistet und die Eigenschaft hielt.

Das ist ein Null-Ergebnis, und ich melde es als eines. Es ist jetzt [eine offene Diskussion auf ihrem Repo](https://github.com/BICLab/SpikingBrain2.0/issues/4).

## Ehrlicher Umfang

Alles oben, begrenzt:

- **Nichts wurde bei 5B oder auf ihren Checkpoints trainiert.** Die Qualitätsarbeit ist bei ≤146M Parametern, von Grund auf. Die 5B-Zahlen sind Block-Level und Form-bestimmt.
- **Qualitätsergebnisse sind ein bis zwei Seeds.** Einer ist bereits zusammengebrochen. Richtungen sind Befunde; Größenordnungen sind provisorisch.
- **Der Qualitätsvorteil kehrt sich bei langen Trainingsbudgets um** - ein −5,15%-Vorteil bei einem festen Budget wurde +2,4% bei 4x dem Budget. [Ich habe das separat aufgeschrieben](/blog/s2moe_budget_dependent_benchmarking/). SpikingBrain trainiert weit über diesen Punkt hinaus.
- **Energie auf einer GPU ist wirklich FLOPs über Latenz.** Power variiert wenig über Architekturen, daher ist der verteidigbare Rahmen Serving-Kosten pro Token, nicht roh Joule. Die echte ereignisgesteuerte Energiebuchhaltung benötigt neuromorphe Silizium, die ich nicht gemessen habe.

## Was gilt

- **Parameterabgestimmte Parität bei 1/32 der aktiven Feed-Forward-Berechnung.** 32x Genauigkeit pro Einheit der aktiven Berechnung.
- **2,71x weniger Block-FLOPs und 1,62x weniger Energie pro Token** bei ihrer echten 5B-Block-Form, von zufälligen Gewichten.
- **Der Grouped-GEMM-Kernel ist das, was es real macht** - bitgenau, bis zu 12,75x schneller als die naive Schleife. Ohne ihn ist das Sparse-Modell langsamer als dicht.
- **Eine Obergrenze, die es zu wissen lohnt:** Feed-Forward-Sparsität kann Sie nur um den Feed-Forward-Anteil sparen. Danach sind die Teile, die immer aktiv sind, der Boden.
- **Eine validierte Diagnose** für SpikingBrains eigenes Partitions-Routing, das gesund zurück kam.

## FAQ

**Reduziert Mixture-of-Experts tatsächlich die Berechnung?**
Ja, und um einen vorhersagbaren Betrag. Top-1-Routing führt einen Experten pro Token aus, egal wie groß der Pool ist, daher ist die Feed-Forward-Berechnung `1/n_experts` einer parameterabgestimmten dichten Schicht. Bei 32 Experten wird dies bei 1/32 gemessen, was 2,71x weniger FLOPs für den ganzen Block wird, sobald die Teile, die immer aktiv sind, gezählt werden.

**Ist ein Sparse-MoE-Modell schneller als ein dichtes?**
Nicht unbedingt, und hier nicht - 324k Tokens/Sek. gegenüber 446k für dicht. Weniger FLOPs ist nicht das Gleiche wie niedrigere Latenz. Der Gewinn war in FLOPs und Stromverbrauch (134 W gegen 299 W), nicht Durchsatz.

**Überlebt MoE-Sparsität batched serving?**
Die Berechnung-Einsparung schon - jedes Token durchläuft immer noch einen Experten unabhängig von der Batch-Größe. Was nicht überlebt, ist Experten-_Residenz_: die Vereinigung von Experten, die über einen Batch berührt wird, geht von 96,9% sparsam bei Batch 1 zu 14,1% bei Batch 64, also Experten-Offloading ist eine Single-Stream-Technik.

**Verbessern Spiking-Aktivierungen die Genauigkeit?**
Nicht in dieser Messung. Sie kosten 2,8% Perplexität bei identischer Berechnung. Der Vorteil ist Kompatibilität mit ereignisgesteuerter neuromorpher Hardware, nicht Genauigkeit oder GPU-Effizienz.

**Wie viele Seeds braucht man, um einen Qualitätsverbesserung zu behaupten?**
Mehr als einen, und dieser Beitrag ist die warnende Geschichte. Ein 2,1%-Vorteil verschwand beim zweiten Seed, weil der _dichte Baseline_ einen schlechten Seed gezogen hatte. Single-Seed-Vergleiche messen Glück, nicht Methode.

**Können Sie ein bestehendes dichtes Modell in ein Mixture-of-Experts konvertieren?**
Ja - das ist, was der Upcycler macht. Er initialisiert jeden Experten aus Segmenten der trainierten dichten Feed-Forward-Gewichte anstatt von Grund auf. Es ist eine Gewichts-Initialisierungs-Brücke und benötigt weiterhin fortgesetztes Training, um die Qualität wiederherzustellen; es ist keine kostenlose Konvertierung.

## Reproduzieren Sie es

```bash
git clone https://github.com/JustinGuese/SpikingBrain2.0-s2moe
cd SpikingBrain2.0-s2moe

# Energy and FLOPs at SpikingBrain's real 5B block shape - random weights, no training
python spb2/s2moe/bench/bench_energy.py --n-experts 32 --param-match
python spb2/s2moe/bench/bench_active_flops.py --n-experts 32

# Kernel equivalence and speedup, forward and training
python spb2/s2moe/bench/bench_dispatch.py

# Audit the released checkpoint's partition routing
python run_model_forward/probe_sse_selection.py --model-path /path/to/SpikingBrain-2.0-base-8k
```

- **Der Fork, mit allem oben:** [github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)
- **Das ursprüngliche Research-Repository:** [github.com/JustinGuese/S2-MoE-llm](https://github.com/JustinGuese/S2-MoE-llm)
- **Upstream:** [BICLab/SpikingBrain2.0](https://github.com/BICLab/SpikingBrain2.0)
- **Offene Diskussion:** [BICLab/SpikingBrain2.0#4](https://github.com/BICLab/SpikingBrain2.0/issues/4)

Verwandte Lektüre hier: [warum der Energiegewinn mit der Experten-Anzahl wächst](/blog/s2moe_energy_scaling_sparse_moe/) und [wie sich die Qualitätsbehauptung unter einem längeren Trainingsbudget umkehrte](/blog/s2moe_budget_dependent_benchmarking/).

Hintergrund: [Switch Transformer](https://arxiv.org/abs/2101.03961) auf Top-1-Routing, [DeepSeekMoE](https://arxiv.org/abs/2401.06066) auf gemeinsamen Experten, [Drop-Upcycling](https://arxiv.org/abs/2502.19261) auf Dense-zu-MoE-Konvertierung.

Falls eine Zahl hier mit dem Experiment-Log im Repo nicht übereinstimmt, gewinnt das Log - öffnen Sie ein Issue.
