---
title: 'Mein Effizienzgewinn kehrte um, wenn ich länger trainierte: Eine Anmerkung zum Budget-abhängigen Benchmarking'
bg_image: 'images/blog/budget-reversal.png'
date: 2026-07-28T09:10:00+02:00
author: 'Justin Guese'
description: 'Eine spärliche MoE schlug eine dichte Baseline um 2,4% über 3 Seeds. 4x länger auf schwierigeren Daten trainieren, und das Vorzeichen kippt - was das über das Benchmarking effizienter Architekturen aussagt.'
image: 'images/blog/budget-reversal.png'
categories:
  - Machine Learning
tags:
  [
    'mixture of experts',
    'benchmarking',
    'reproducibility',
    'negative results',
    'language models',
  ]
type: post
---

# Mein Effizienzgewinn kehrte um, wenn ich länger trainierte: Eine Anmerkung zum Budget-abhängigen Benchmarking

**TL;DR**

- Ein Top-1-spärliches [Mixture-of-Experts](https://arxiv.org/abs/2101.03961)-Modell schlug eine parametergesteuerte dichte Baseline um **−2,4% ± 1,1% Validierungs-Perplexität, 3/3 Seeds, gepaarter _t_ ≈ 3,8 (p ≈ 0,03)**. Sauberes Ergebnis. Publikationsreif aussehend.
- Drei separate Kontrollen zerrissen es auseinander: eine **Learning-Rate-Schedule**-Änderung, eine **richtig abgestimmte Baseline**, und ein **4× längeres Trainingsbudget**.
- Bei 4× Budget auf hartem Web-Text **kehrte sich das Vorzeichen um**: Das dichte Modell gewann um **+2,4% ± 0,8%**, ebenfalls bei 3/3 Seeds.
- Die allgemeine Lektion: Effizienz-Vergleiche, die weit unter [Chinchilla-optimalen](https://arxiv.org/abs/2203.15556) Budgets laufen, glätten systematisch das Modell mit weniger aktiver Berechnung. Die meisten Arbeiten führen das längere Budget nie durch.
- Was überlebte, war die Achse, die _nicht_ umkehren _konnte_, weil sie nicht gelernt wird. Mehr am Ende, und in der [Begleitpost zur Energie-Skalierung](./sparse-moe-energy-scaling-per-token).

Alle Zahlen unten kommen aus einem öffentlichen Experiment-Protokoll: **[github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)** (`EXPERIMENTS.md`, 66 Einträge, neueste zuerst). Jeder Anspruch in diesem Beitrag zitiert eine Experiment-Nummer, die Sie gehen und lesen können.

---

## 1. Das Ergebnis, das fertig aussah

Die Architektur ist S²-MoE: ein spärliches spiking Mixture-of-Experts-Sprachmodell. Das relevante Detail für diesen Beitrag ist nur, dass es jeden Token an **einen** Experten aus `n` weiterleitet, daher führt es grob `1/n` der Feed-Forward-Berechnung pro Token im Vergleich zu einem dichten Modell mit der gleichen Parameterzahl aus.

Bei 25M Parametern auf [TinyStories](https://arxiv.org/abs/2305.07759), Byte-Pair-tokenisiert, 6000 Schritte, drei Seeds als isolierte Prozesse ausgeführt (**Exp 12**):

| Metrik (25M, 6000 Schritte, 3 Seeds)                      | S²-MoE                   | Dicht              |
| --------------------------------------------------------- | ------------------------ | ------------------ |
| Validierungs-Perplexität                                  | **5,63 ± 0,09**          | 5,77 ± 0,03        |
| Gepaarte Lücke (MoE − dicht)                              | **−2,4% ± 1,1%**         | -                  |
| Pro-Seed Lücke                                            | −1,2% / −2,6% / −3,3%    | 3/3 bevorzugen MoE |
| Genauigkeit pro aktiver Berechnung                        | **8,20× ± 0,10**         | 1×                 |
| Aktive FFN-Berechnung Fraktion                            | 0,125 (genau)            | 1,000              |
| [BLiMP](https://arxiv.org/abs/1912.00582) Grammatik-Delta | +0,003 ± 0,015 (neutral) | -                  |

Das ist auf den ersten Blick kein schwaches Ergebnis. Es ist gepaart (derselbe Seed legt Datenreihenfolge und Initialisierung für beide Arme fest), jeder Seed stimmt im Vorzeichen überein, die dichte Baseline hat nahezu keine Seed-Varianz, und die Grammatik-Sonde zeigt, dass die Sparsität keine Syntax kostet. Längeres Training machte den Effekt _größer_, nicht kleiner - normalerweise ein gutes Zeichen.

Die Versuchung an diesem Punkt ist, mit dem Messen aufzuhören.

## 2. Drei Wege, wie es auseinander kam

### 2.1 Der Schedule hat die Arbeit geleistet (Exp 15)

Jedes Ergebnis oben verwendete eine **flache Learning-Rate** - der Projektstandard, ursprünglich für den [gated linear attention](https://arxiv.org/abs/2312.06635) Mixer abgestimmt. Das ist eine vertretbare Wahl für eine einzelne Architektur und eine unvertretbare für einen Vergleich.

Wiederholt man das Experiment auf [FineWeb-Edu](https://huggingface.co/datasets/HuggingFaceFW/fineweb-edu) mit einem identischen modernen Schedule für jeden Arm - linearem Aufwärmen, gefolgt von Kosinus-Rückgang auf 10%, jedes Modell bei seiner eigenen abgestimmten Peak-LR:

| Modell (25M, FineWeb-Edu, 6000 Schritte) | Val Ppl   | BLiMP | Aktive FFN-Berechnung |
| ---------------------------------------- | --------- | ----- | --------------------- |
| GLA-dicht                                | **51,37** | 0,713 | 1,000                 |
| Transformer                              | **51,17** | 0,704 | 1,000                 |
| S²-MoE                                   | 56,90     | 0,694 | **0,125**             |

Die MoE ging von **8% besser** unter flacher LR zu **11% schlechter** unter Warmup+Kosinus. Der Mechanismus ist sichtbar in den Deltas: Das dichte Modell gewann **25%** aus korrektem Scheduling (68,5 → 51,4); die MoE gewann nur **9,5%** (62,9 → 56,9). Ein dichtes Modell aktualisiert jeden Parameter in jedem Schritt, daher kann es den Fine-tuning-Schwanz eines Kosinus-Rückgangs ausnutzen. Eine Top-1 MoE aktualisiert grob `1/n` ihres Experten-Pools pro Token, daher sieht jeder Experte einen Bruchteil der Daten und kassiert viel weniger von diesem Schwanz.

Das flach-LR-Protokoll war nicht neutral. Es handicapte den Arm, der am meisten von gutem Scheduling profitiert.

### 2.2 Eine Baseline, die Sie nicht abgestimmt haben, ist keine Baseline (Exp 15, Run #1)

Der erste Versuch, eine echte Softmax-Attention-Transformer-Kontrolle hinzuzufügen, gab ihr die GLA-abgestimmten Einstellungen: flache `lr=3e-3`, kein Warmup. Es trainierte nie - Validierungs-Perplexität **380**, gegen 68 für das dichte GLA-Modell.

Dieser Run erzeugte eine Schlagzeile von „S²-MoE ist 48× besser als ein Transformer."

Diese Zahl wird verworfen und als Lektion protokolliert, statt gelöscht zu werden. Sie maß eine unterbrochene Kontrolle, nicht ein gutes Modell. Eine kurze Diagnose bestätigte, dass ein richtig konfigurierter Transformer (`lr=6e-4`, Warmup, Kosinus) gut trainiert und bei 51,17 landet - das heißt, er _schlägt_ die MoE.

In diesen Fehlermodus tappt man leicht, und er ist teuer, im Nachhinein zu entdecken. Attention ist weit LR-empfindlicher als ein linearer Rezidiv-Mixer; die Wiederverwendung der Hyperparameter einer Architektur über einen Vergleich hinweg liefert genau das Ergebnis, das Sie sich erhofft haben. **Berichten Sie das Tuning-Budget und die finale LR für jeden Arm, einschließlich derjenigen, die Sie zu schlagen versuchen.**

### 2.3 Das Budget versteckte die Lücke (Exp 44 → Exp 47)

Die übertragbarste der drei. Dieselbe festgelegte Konfiguration - 32 Experten, immer aktiver gemeinsamer Core, Selbst-Destillation, Kosinus-Schedule, gruppiertes GEMM-Dispatch - wurde über das Trainingsbudget hinweg auf FineWeb-Edu durchsucht:

| Trainings-Schritte | MoE vs dicht                              | Urteil                   |
| ------------------ | ----------------------------------------- | ------------------------ |
| 6.000              | **−5,15% ± 0,11%** (3/3 Seeds, _t_ ≈ −81) | MoE gewinnt entscheidend |
| 12.000             | ≈ Parität                                 | -                        |
| 24.000             | **+2,4% ± 0,8%** (3/3 Seeds)              | Dicht gewinnt            |

Ein sauberer monotoner Übergang, bestätigt über drei Seeds am Endpunkt - kein Glückstreffer. Das 6k-Ergebnis hatte eine _t_-Statistik von −81. Im Nachhinein war es zudem eher eine Aussage über Untertraining als über Architektur.

![Budget-Übergang: Der MoE-Qualitätsvorteil kehrt sich um, wenn das Trainingsbudget wächst](paper/figures/fig3_budget_reversal.png)

## 3. Die Verallgemeinerung

Das ist der Teil, der es wert ist, in andere Projekte mitgenommen zu werden.

**Vergleiche, die weit unterhalb rechenoptimaler Budgets laufen, glätten systematisch das Modell mit weniger aktiver Berechnung pro Token.** Beide Arme sind untertrainiert; das dichte Modell hat mehr Kapazität, die es noch nicht eingelöst hat; das spärliche Modell ist näher an seiner eigenen Obergrenze, weil jeder Experte bereits seinen engen Daten-Ausschnitt gesehen hat. Die Lücke, die sie irgendwann trennen wird, hat sich noch nicht geöffnet. Wenn Sie dort messen, messen Sie die Übergangsregion, nicht die Asymptote.

Zwei Konsequenzen fielen aus der gleichen Durchsuchung heraus.

**Der Übergangspunkt ist eine Eigenschaft des Korpus, nicht der Architektur.** Führen Sie die identische 24k-Schritt-Konfiguration auf beiden Korpora aus (**Exp 47**):

| Korpus      | Unigramm-Entropie | MoE vs dicht bei 24k                  | BLiMP-Delta |
| ----------- | ----------------- | ------------------------------------- | ----------- |
| TinyStories | 8,39 Bits/Token   | **−2,6% ± 0,3%** (3/3, MoE gewinnt)   | +0,039      |
| FineWeb-Edu | 10,50 Bits/Token  | **+2,4% ± 0,8%** (3/3, dicht gewinnt) | −0,007      |

Das Vorzeichen kippt allein mit dem Korpus. Bei strukturiertem Text verengt sich der MoE-Gewinn mit dem Budget (−4,4% bei 6k → −2,6% bei 24k), überquert aber nie die Nulllinie. Bei vielfältigem Web-Text überquert er sie und bleibt jenseits davon. „Kostet Sparsität also Qualität?" hat somit keine budget- und korpusfreie Antwort - was bedeutet, dass jedes Paper, das einen einzelnen Punkt auf dieser Oberfläche berichtet, damit eine Koordinate berichtet hat, keine Schlussfolgerung.

**Und das ehrliche Limit dazu (Exp 53):** Das _Richtungs_-Gesetz hält, aber ein _quantitatives_ lässt sich aus diesen Durchsuchungen nicht ableiten. Es gibt nur zwei Korpus-Entropie-Punkte, und Schedule, Destillation und Budget sind kollineare Störfaktoren von vergleichbarer Größe - die Pro-Experte-Token-Zahl ordnet nicht einmal das Vorzeichen richtig. Eine Vorhersagekurve daran anzupassen würde eine nicht identifizierbare Oberfläche mit einem respektabel aussehenden R² erzeugen. Das Protokoll hält das ausdrücklich fest, und die Folgearbeit ist konkret spezifiziert (ein Protokoll einfrieren, ≥2 Korpora hinzufügen, ein `n × Korpus`-Gitter ausführen), statt approximiert zu werden.

### Eine Vier-Punkt-Checkliste

1. **Führen Sie mindestens zwei Budgets aus**, idealerweise 4× auseinander. Wenn Ihr Anspruch nur bei einem existiert, ist es ein Anspruch über dieses eine Budget.
2. **Führen Sie mindestens zwei Korpora unterschiedlicher Schwierigkeit aus.** Spielzeug-Korpora sind keine kleinen Versionen harter Korpora; sie ändern hier das Vorzeichen.
3. **Stimmen Sie jede Baseline separat ab und berichten Sie ihre LR.** Ein Schedule über mehrere Architekturen hinweg ist ein Daumen auf der Waage.
4. **Berichten Sie das gepaarte Pro-Seed-Vorzeichen, nicht nur den Mittelwert ± Std.** „3/3 Seeds stimmen überein" und „Mittelwert ist negativ" sind unterschiedliche Ansprüche, und der zweite ist schwächer, als er klingt.

## 4. Der Prozess, der es fing

Nichts davon war Glück. Die Praxis besteht darin, **ein numerisches Kill-Gate vor einer teuren Durchsuchung vorab festzulegen** und es dann zu respektieren, wenn es nicht erfüllt wird. Neun Ideen sind an ihrem eigenen Gate gestorben. Ein repräsentatives Beispiel:

| Idee                                                            | Warum es starb                                                                       | Exp |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --- |
| Mixer-Schreib-Gate                                              | Das Überspringen von Schreibvorgängen in den Rezidiv-Status sprengte Perplexität ~7× | 32  |
| [Mixture-of-Depths](https://arxiv.org/abs/2404.02258) Halt-Gate | −1,9% Qualität; realisiert ~16% Sparsität gegen ein 50%-Ziel                         | 42  |
| Neuromodulatorisches Routing                                    | Kein Qualitätsgewinn; Routing-Ebenen-Fixes weiterhin scheitern                       | 34  |
| Dendrische Experten                                             | Gate ließ sich 38% offen - wurde ein Sparsifizierer, +1,05% schlecht                 | 46  |
| Kritikalität Sollwert                                           | 73,03 gegen eine gepaarte 72,86 Baseline - Gate nicht erfüllt                        | 62  |
| Event-driven FFN                                                | Konsekutive-Token Kosinus 0,561 gegen ein 0,7 Balken                                 | 64  |
| Rang-1 Residuales Korrektion                                    | Inert: aktive Berechnung unverändert, Schwellenwert-Sweep bewegte nichts             | 66  |

Die vier Gating-Ideen teilen eine Form, und das ist das nützlichste Muster im gesamten Protokoll: **Jedes lernbare Gate, das der Optimierer schließen darf, schließt er.** Jede Idee wurde entworfen, um bedingte Kapazität hinzuzufügen; jede wurde als zweiter Sparsifizierer zusätzlich zum bereits bestehenden rekrutiert und kostete 1–2% Qualität.

Zwei Ideen waren nicht klein - sie waren die gepitchten Differenzierungsmerkmale des Projekts, und sie starben an _sauberen Kontrollen_, nicht an schlechten Zahlen:

- **Kontinuierliche Anpassung (Exp 60, 61).** Der Anspruch: spärliche Modelle vergessen weniger, weil Wachstum neue Domänen in frischen Experten isoliert. Exp 60 fügte eine Sleep-AUS-Kontrolle hinzu, die identisch zum Sleep-AN landete - der Mechanismus war also nicht die eigentliche Ursache. Exp 61 erzwang die Isolierung dann mit einem Routing-Lock: Tokens aus neuen Domänen treffen ausschließlich auf frische Experten (gemessener Herkunftsanteil **1,00**, keine Durchmischung). Die Retention bewegte sich trotzdem nicht - **116,7 vs. 117,3**. Das Vergessen lebt in der immer aktiven dichten Komponente, die Sparsität nicht schützen kann. Falsifiziert, nicht einfach unzureichend abgestimmt.
- **„Graduales Wachstum ist speziell" (Exp 59).** Ein einmaliger Bulk-[Upcycle](https://arxiv.org/abs/2212.05055) erzielte einen Wert von **73,37** und lag damit innerhalb der eigenen Zwei-Seed-Streuung des Gradual-Growth-Arms von 72,94–73,44. Das frühere „Graduales-Gewinne"-Ergebnis stammte aus einer durchgesickerten Kontrolle, die die ganze Zeit über still weitergewachsen war.

Das Kostenargument für diese Disziplin ist **Exp 64**. Die Event-driven-Idee war reizvoll und hätte Wochen zum Bauen gebraucht. Das Gate war eine einzige Messung: Sind aufeinanderfolgende Token-Aktivierungen korreliert genug, um die Neuberechnung zu überspringen? Mittlere Kosinus-Ähnlichkeit **0,561** gegenüber einem vorab vereinbarten Schwellenwert von 0,7 - und sie fiel mit zunehmender Tiefe. Gesamtkosten: ein Benchmark-Skript und null Trainingsdurchläufe.

Die gleiche Logik treibt auch die günstigen Screening-Durchläufe an: ein Seed bei halben Schritten beantwortet die Frage „Bewegt das überhaupt die Qualität?", und nur Überlebende verdienen sich drei Seeds bei voller Länge. Ein 0,30-Dollar-Sieb, das „Nein" sagt, ist mehr wert als eine Woche, die auf einen nicht validierten Hebel verwendet wurde.

## 5. Was tatsächlich überlebte

Ein Absatz, kein Argument.

Der Anspruch, der jede Schedule-Änderung, jedes Korpus und eine 4×-Budget-Durchsuchung überstand, war derjenige, der von vornherein nie gelernt wurde: **Die Genauigkeit pro Einheit aktiver Feed-Forward-Berechnung blieb über 6k, 12k und 24k Schritte auf beiden Korpora bei ~21×.** Das ist form-bestimmt - eine Folge davon, dass Top-1-Routing einen Experten unabhängig von der Pool-Größe ausführt -, daher gibt es keinen Mechanismus, durch den mehr Training es umkehren könnte. Genau deshalb überlebte es, während der Qualitätsanspruch es nicht tat. Eine Zahl, die sich mit dem Budget nicht bewegen kann, ist eine Zahl, die nie von Untertraining abhing.

Diese Achse ist das Thema des nächsten Beitrags: [wie Energie pro Token mit der Expertenzahl skaliert, wo die gemessene Kurve nicht mehr mit der FLOP-Zahl übereinstimmt, und was das Spiking tatsächlich bringt](./sparse-moe-energy-scaling-per-token).

---

## Häufig gestellte Fragen

**F: Warum schlug die MoE das dichte Modell im kleinen Maßstab, verlor aber im großen Maßstab?**
Beide Modelle waren untertrainiert. Das dichte Modell aktualisiert jeden Parameter in jedem Schritt und wird dabei stetig besser; die Top-1-MoE aktualisiert nur ~1/n ihres Experten-Pools pro Token, daher nähert sie sich ihrer Obergrenze früher. Bei niedrigem Budget hat das dichte Modell seine Kapazität noch nicht ausgeschöpft, daher schmeichelt der Vergleich dem spärlichen Modell. Siehe Exp 44 und 47.

**F: Bedeutet das, dass spärliche Modelle schlechter sind?**
Nein - es bedeutet, dass der Qualitätsvergleich budget- und korpusabhängig ist, der _Effizienz_-Vergleich hingegen nicht. Auf strukturiertem Text überlebte der spärliche Vorteil eine 4×-Steigerung des Budgets; auf vielfältigem Web-Text kehrte er sich überraschend um. Der Vorteil bei aktiver Berechnung hielt überall.

**F: Wie viele Trainingsbudgets sollte ich testen, bevor ich einen Effizienzgewinn behaupte?**
Mindestens zwei, idealerweise 4× auseinander, auf mindestens zwei Korpora unterschiedlicher Schwierigkeit. In diesem Projekt kippte das Vorzeichen zwischen 6k und 24k Schritten bei einem Korpus, beim anderen nicht.

**F: Was ist ein Kill-Gate?**
Ein numerischer Schwellenwert, der _vor_ der teuren Durchsuchung niedergeschrieben wird und festlegt, welches Ergebnis die Idee töten würde. Exp 64 beendete eine Multi-Wochen-Richtung mit einem einzigen Benchmark-Skript, weil das Gate im Voraus gesetzt war.

**F: Wo kann ich das rohe Experiment-Protokoll sehen?**
`EXPERIMENTS.md` im [GitHub-Repository](https://github.com/JustinGuese/SpikingBrain2.0-s2moe) - 66 Einträge, jeder mit Hypothese → Methode → Beobachtung → Ergebnis, einschließlich allem, was gescheitert ist.

---

## Reproduzieren Sie es

Das Projekt wird mit [uv](https://docs.astral.sh/uv/) auf [PyTorch](https://pytorch.org/) verwaltet:

```bash
git clone https://github.com/JustinGuese/SpikingBrain2.0-s2moe
uv sync
uv run python phase0.py    # regression gate, expects: PHASE 0: PASS

# Der Kopf-an-Kopf: MoE + eine parametergesteuerte dichte Kontrolle, gleiches Budget
uv run python train_lm.py --tokenizer bpe --scale 25m \
    --d-model 512 --d-hidden 512 --n-layers 4 --n-experts 32 \
    --d-shared 256 --distill --dispatch grouped --blimp --n-seeds 3
```

- **Code und volles Protokoll:** [github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)
- **Interaktive Demo:** [huggingface.co/spaces/guestros/s2-moe-demo](https://huggingface.co/spaces/guestros/s2-moe-demo)
- **Trainierte Checkpoints:** [huggingface.co/guestros/s2-moe-checkpoints](https://huggingface.co/guestros/s2-moe-checkpoints)
- **Archiviert (CC BY 4.0):** [doi.org/10.5281/zenodo.20846758](https://doi.org/10.5281/zenodo.20846758)

Korrekturen sind willkommen - bitte als Issues einreichen. Wenn eine Zahl hier nicht zum Protokoll passt, gewinnt das Protokoll.
