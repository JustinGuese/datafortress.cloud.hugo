---
title: 'Der Effizienzgewinn, der mit dem Modell wächst: Energie pro Token in einer Top-1-Spiking-MoE'
bg_image: 'images/blog/energy-scaling.png'
date: 2026-07-26T09:10:00+02:00
author: 'Justin Guese'
description: 'Top-1-Routing macht FFN-Kosten konstant in der Expertenzahl, daher sinkt die Energie pro Token, wenn Sie Experten hinzufügen. Gemessen auf H100 - 5,1x weniger bei 1B Parametern, plus wo FLOPs aufhören, Joule vorherzusagen.'
image: 'images/blog/energy-scaling.png'
categories:
  - Machine Learning
tags:
  [
    'mixture of experts',
    'energy efficiency',
    'inference optimization',
    'neuromorphic computing',
    'cuda kernels',
  ]
type: post
---

# Der Effizienzgewinn, der mit dem Modell wächst: Energie pro Token in einer Top-1-Spiking-MoE

**TL;DR**

- Top-1-Routing führt **einen** Experten pro Token aus, unabhängig von der Pool-Größe, daher sind die Feed-Forward-Kosten **konstant in der Expertenzahl**, während die Kosten eines parametergesteuerten dichten Modells linear wachsen. Das Hinzufügen von Experten _senkt_ die Energie pro Token.
- Gemessen auf einem H100 über drei Modellskalen: **1,46× → 3,07× → 5,08×** weniger Energie pro Token bei 8 / 32 / 64 Experten bei 1B Parametern, gegenüber sowohl einem dichten Baseline als auch einem parametergesteuerten Transformer.
- Bei 8 Experten gibt es **überhaupt keinen Energiegewinn**. Das Regime ist wichtig, und dieser Beitrag führt damit an.
- Der Gewinn ist nicht kostenlos - er erfordert einen gruppiert-GEMM-Kernel. Ohne ihn ist das spärliche Modell _langsamer_ als dicht bei jeder Expertenzahl.
- Oberhalb von ~128 Experten **divergieren** der FLOP-Proxy und gemessene Joule. FLOPs hören auf, ein Proxy zu sein, und werden stattdessen eine Geschichte.

Code, Kernels und das vollständige Experimentprotokoll: **[github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)**.

Dies ist die Fortsetzung zu [einem Beitrag darüber, wie sich der _Qualitäts_-Anspruch in diesem gleichen Projekt unter einem längeren Trainingsbudget umkehrte](./budget-dependent-benchmarking-sparse-moe). Die Kurzversion: Die gelernten Ansprüche bewegten sich, die formbestimmten nicht. Dieser Beitrag befasst sich mit den formbestimmten.

---

## 1. Warum der Gewinn mit der Expertenzahl wächst

Die Arithmetik ist einfach genug, um in einem Absatz zu formulieren, was der Hauptgrund ist, ihr zu vertrauen.

Ein [Mixture-of-Experts](https://arxiv.org/abs/2101.03961)-Layer mit Top-1-Routing sendet jeden Token an genau einen Experten mit verborgener Breite `d_hidden`. Die Feed-Forward-Kosten pro Token sind daher **unabhängig von `n_experts`** - 64 Experten kosten das gleiche pro Token wie 8. Ein parametergesteuert abgestimmtes dichtes Modell muss diese Parameter irgendwo ausgeben, daher ist seine Feed-Forward-Breite `d_ff = n_experts · d_hidden`, und seine Kosten pro Token wachsen **linear** in der gleichen Variablen.

Das Verhältnis zwischen ihnen wächst daher linear in der Expertenzahl. Jeder Experte, den Sie hinzufügen, macht die Baseline teurer und lässt das spärliche Modell, wo es war.

Das ist keine gelernte Eigenschaft. Es ist eine Folge der Tensorformen, weshalb sie unter Zufallsgewichten hält, Budgetdurchsuchungen übersteht und sich nicht darum kümmert, welche Korpora Sie trainieren.

![Der zerrissene Kompromiss: Qualität gegen aktive Berechnung](paper/figures/fig2_broken_tradeoff.png)

## 2. Das Regime, in dem es nicht funktioniert (Exp 17)

Es lohnt sich, dies vor den guten Zahlen zu sagen, weil es sie begrenzt.

Bei **8 Experten und 25M Parametern gibt es keinen Energiegewinn.** Die Messung (Exp 17) ergab:

- Der immer aktive Sequenzmischer dominiert den Durchgang. Feed-Forward ist nur ~16% der Berechnung des spärlichen Modells, daher senkt das Schneiden um 8× nur ~halb der Gesamt-FLOPs.
- **GPU-Leistung ist architektur-flach** - ~52–57 W über alle getesteten Varianten. Auf dieser Hardware reduziert sich „Energie pro Token" auf Latenz pro Token. Es gibt keinen Leistungsabfall zum Ernten.
- Mit einer naiven Pro-Experten-Python-Dispatch-Schleife war das spärliche Modell _langsamer_ als dicht. Der FLOP-Gewinn wurde durch den Kernel-Launch-Overhead verbraucht.

Die Schlussfolgerung zu diesem Zeitpunkt war, dass die Energieachse tot war. Allerdings benannte es seine eigene Fluchtroute: Ein Energiegewinn ist nur bei viel größeren Expertenzahlen denkbar, wo Feed-Forward den _dichten_ Durchgang wieder dominiert, und nur mit einem echten spärlichen Kernel.

Beide Bedingungen stellten sich als erfüllbar heraus.

## 3. Wo es sich wendet (Exp 22)

Unter Beibehaltung von `d_model`, `d_hidden` und Tiefe konstant und Durchsuchung der Expertenzahl, mit untätiger subtrahierter Leistungsintegration über eine anhaltende Inferenzschleife:

| Experten | Parameter | Gruppiert MoE ktok/s | Dicht ktok/s | **Energie× vs dicht** | vs Transformer          |
| -------- | --------- | -------------------- | ------------ | --------------------- | ----------------------- |
| 8        | 27,3M     | 101,5                | 82,3         | **1,31×**             | 1,16× (≈ Unentschieden) |
| 32       | 77,8M     | 78,4                 | 33,8         | **2,50×**             | 1,03×                   |
| 64       | 144,9M    | 71,9                 | 18,1         | **3,99×**             | 0,97×                   |

Der Anteil der Feed-Forward des dichten Modells steigt 61% → 86% → 92% seines Durchgangs, während der Anteil des spärlichen Modells bei ~0,022 GFLOP/Token konstant bleibt. Der parametergesteuert abgestimmte Transformer gewinnt **nichts** aus der Durchsuchung (≈1,0× dicht durchgehend), weil er keine Sparsität ausnutzen kann - daher öffnet sich die Lücke gegen die dominierende Architektur von einem Unentschieden bei 8 Experten zu ~4× bei 64.

Die Leistung blieb durchgehend flach (~54–57 W gruppiert gegen ~57–60 W dicht), was bestätigt, dass dies ein Durchsatz-Gewinn und kein Leistungs-Gewinn ist. Dieser Unterschied ist wichtig und ich werde später darauf zurückkommen.

## 4. Der Kernel trägt Gewicht (Exp 13, Exp 24)

Weniger FLOPs bedeuten nicht automatisch weniger Energie. Etwas muss eines ins andere umwandeln.

Die naive Implementierung versendet Experten in einer Python-Schleife - eine Iteration und ein Kernel-Launch pro Experte. Dieser Overhead ist fest pro Experte, daher wächst er genau so schnell wie der Gewinn. **Die Loop-Dispatch ist langsamer als dicht bei jeder getesteten Expertenzahl** (0,72–0,78× relative Latenz). Isoliert gemessen war die „effiziente" Architektur eine Regression.

Der Fix ist ein sortiertes, dropless gruppiertes GEMM: Sortieren Sie Token nach ihrem zugeordneten Experten in zusammenhängende Segmente, erstellen Sie kumulative Offsets, und geben Sie zwei gruppierte Matmuls über alle Segmente in jeweils einem Launch aus. Ein tokenloser Experte wird zu einem Nullbreiten-Segment - 0 FLOPs, kein Padding, daher wird bedingte Ausführung beibehalten statt gefälscht.

**Inferenz (Exp 13):**

| Experten | Loop tok/s | Gruppiert tok/s | Speedup   | max abs Δ Logits |
| -------- | ---------- | --------------- | --------- | ---------------- |
| 8        | 60.061     | 88.963          | **1,48×** | 0,00e+00         |
| 16       | 41.049     | 86.245          | **2,10×** | 0,00e+00         |
| 32       | 24.774     | 81.594          | **3,29×** | 0,00e+00         |

Der gruppierte Durchsatz bleibt grob konstant (89k → 86k → 82k), während die Loop kollabiert (60k → 41k → 25k). Ausgaben sind **bit-identisch** - Null-Logit-Differenz, Null-Argmax-Umdrehungen. Der Speedup ist reiner Overhead-Abbau, keine Annäherung.

**Training (Exp 24):** Der gleiche Kernel wurde mit einem expliziten Rückwärts autograd-fähig gemacht, was **1,26× / 1,61× / 2,59× / 4,51×** schnellere Trainingsschritte bei 8 / 16 / 32 / 64 Experten gibt, mit `w_in`- und `w_out`-Gradienten **bit-identisch** zur Loop und Δverlust = 0. Das entfernte das „nur Inferenz"-Sternchen aus der ganzen Geschichte.

Wenn Sie einen Engineeringpunkt aus diesem Beitrag mitnehmen: **Eine effiziente Architektur ohne ihren Kernel ist eine langsamere Architektur.** Die FLOP-Zahl ist ein Schuldschein; der Kernel ist, ob er sich lohnt.

## 5. Es skaliert (Exp 27)

Neun Punkte auf einem H100 - drei Modellskalen × drei Expertenzahlen - Benchmarking vier formabgestimmter Varianten jeweils. Zufallsgewichte, nur Inferenz, daher ist die Messung formbestimmt und braucht kein Training. Netto-mJ/Token, spärlich / dicht / Transformer, mit dem MoE-vs-dicht-Verhältnis in Fettdruck:

| Skala | 8 Experten                       | 32 Experten                      | 64 Experten                       |
| ----- | -------------------------------- | -------------------------------- | --------------------------------- |
| 25M   | 0,46 / 0,77 / 0,75 (**1,67×**)   | 0,49 / 1,98 / 1,99 (**4,08×**)   | 0,51 / 3,65 / 3,56 (**7,13×**)    |
| 350M  | 2,73 / 4,26 / 3,84 (**1,56×**)   | 2,92 / 10,31 / 9,40 (**3,53×**)  | 3,11 / 17,80 / 16,64 (**5,72×**)  |
| 1B    | 9,12 / 13,35 / 11,65 (**1,46×**) | 9,52 / 29,25 / 28,17 (**3,07×**) | 10,32 / 52,38 / 50,56 (**5,08×**) |

Lesen Sie die 1B-Reihe über: spärliche Energie geht 9,1 → 9,5 → 10,3, wenn Experten um 8× skalieren - im Wesentlichen flach, wie die Arithmetik in §1 vorhersagt. Dicht geht 13 → 29 → 52.

![Energie pro Token über Modellskala und Expertenzahl](paper/figures/fig1_energy_scaling.png)

Zwei ehrliche Beobachtungen, die mit der Zahl reisen. Erstens, der gruppierte Kernel **wird sauber auf Hopper (sm_90) portiert**, da er auf Blackwell (sm_120) entwickelt wurde - er ist kein Artefakt einer Architektur. Zweitens, **das Verhältnis erweicht mit Modellskala** bei fester Expertenzahl (7,1× → 5,7× → 5,1× bei 64 Experten), weil der immer aktive Sequenzmischer einen größeren absoluten Anteil nimmt, während `d_model` wächst. Der Hebel ist Expertenzahl, nicht Modellgröße. Zu sagen „5× bei 1B" ohne diesen Vorbehalt wäre ein Überverkauf durch Auslassung.

## 6. Wo FLOPs aufhören, Joule vorherzusagen (Exp 48, Exp 50)

Dies ist der Abschnitt, der einen Systemleser vertrauen machen sollte.

Es gibt zwei verschiedene Möglichkeiten, „Experten hinzuzufügen", und sie verhalten sich in entgegengesetzten Richtungen.

**Feste `d_hidden` (Kapazitätsskalierung)** ist §3 und §5: Mehr Experten bedeuten eine größere dichte Baseline, daher wächst der Energiegewinn.

**Festes Gesamtbudget (Granularität)** hält `n_experts · d_hidden` konstant und macht jeden Experten kleiner. Der FLOP-Proxy liebt dies - Genauigkeit pro Einheit der aktiven Berechnung steigt monoton **23,4× → 35,0× → 46,3× → 53,0×** bei 32 / 64 / 128 / 256 Experten (Exp 50, mit einem behobenen Reinigung-Churn-Störfaktor).

Die gemessene Energie stimmt nicht überein. Hier sind der FLOP-Proxy und das Wattmeter nebeneinander, beide vom gleichen Bildschirm (Exp 48 - seine Proxy-Zahlen laufen etwas höher als die Churn-behobenen Exp 50-Zahlen oben, aber der Trend ist das, worauf es ankommt):

| Experten | Genauigkeit/aktive-Berechnung (FLOP-Proxy) | Gemessen mJ/Token | vs dichte Energie |
| -------- | ------------------------------------------ | ----------------- | ----------------- |
| 64       | 34,8×                                      | 0,803             | **2,21×** weniger |
| 128      | 50,9×                                      | 0,807             | **2,19×** weniger |
| 256      | 60,2×                                      | 0,954             | **1,83×** weniger |

**mJ/Token steigt, während der FLOP-Proxy klettert.** Pro-Gruppe Launch-Overhead auf vielen winzigen Experten (Breite 256 → 64) frisst den Gewinn. Unter einer energiebewussten Entscheidungsregel - eine Änderung wird nur akzeptiert, wenn sich die Qualität verbessert _und_ der Energievorteil hält - 64 und 128 bestehen, und **256 wird abgelehnt**: Es gibt echte Joule aus, um eine Proxy-Zahl zu kaufen.

Also **~128 Experten ist der realisierte süße Punkt**, und „FLOPs sind nicht Joule" bekommt eine tatsächliche Koordinate statt eines Vorbehalts. Die Lücke ist gruppiert-Kernel-Overhead statt etwas Grundlegendem - ein Kachel-bewusster Kernel könnte das Knie hinausschieben - aber bis dahin geschrieben, ist der ehrliche Anspruch Kernel-bedingt.

![Granularität: FLOP-Proxy und gemessene Energie divergieren oberhalb von ~128 Experten](paper/figures/fig6_granularity_law.png)

## 7. Was das Spiking tatsächlich kauft (Exp 51, Exp 60)

Das Modell verwendet binäre [Spiking](https://open-neuromorphic.org/)-Aktivierungen - Neuronen mit undichtem Integrate-and-Fire, die 0 oder 1 ausgeben statt eines Floats. Die offensichtliche Rezensenten-Frage ist, ob das Genauigkeit kostet. Zwei Kontrollen beantworten es end-to-end.

Ersetzen Sie das binäre verborgene Spike durch ein gestuftes SiLU bei gleichen FLOPs (Exp 51): 57,10 vs 57,44 Perplexität - der **Spike ist 0,6% besser**, Grammatik unentschieden. Dann entfernen Sie die _gesamte_ Spiking-Apparatur einschließlich des Entry-Gates (Exp 60): **56,5 vs 57,10** Perplexität, BLiMP **0,691 vs 0,691** - exakt gleichauf.

Die vollständige Abrechnung ist also: **Spiking kostet etwa 1% Qualität insgesamt und ist Grammatik-neutral.** Der Wert ist, dass binäre Aktivierungen den Experten multiplikationsfrei machen und echte Null-FLOP-bedingte Ausführung geben - ein unerreichter oder nicht gezündeter Experte führt nichts aus. Das ist ein Hardware-Kompatibilitäts-Argument für Event-driven-Silizium, kein Genauigkeits-Argument, und es vor einem Rezensenten zu formulieren kostet nichts.

## 8. Ehrlicher Umfang

Lesen Sie dies, bevor Sie eine Zahl darüber zitieren.

**Das Energiebench ist nur Inferenz und Zufallsgewicht.** Es misst die Form der Berechnung, keine trainierte Bereitstellung. Das macht es konservativ und reproduzierbar, aber es ist kein Serving-Benchmark auf einer echten Arbeitslast.

**Auf Leistungs-flachen GPUs ist „Energie pro Token" wirklich aktive-FLOPs über den Durchsatz.** Gemessene Leistung variierte ~52–60 W über alle getesteten Architekturen, daher ist der Gewinn latenzgesteuert. Der verteidigbare Rahmen ist **Serving-Kosten und Tokens-pro-Dollar**, nicht reine Joule. Echtes Event-driven-Energiebuchhaltung braucht neuromorphe Hardware - [SpiNNaker2](https://spinncloud.com/) oder [Loihi 2](https://www.intel.com/content/www/us/en/research/neuromorphic-computing.html) - was dieses Projekt nicht gemessen hat. Das ist das einzeln größte offene Element.

**Batched Serving erodiert Pro-Token-Sparsität (Exp 65).** Die Union von Experten, die über einen Batch berührt werden, ist das, das ein Server tatsächlich zahlt, und es kollabiert schnell: **96,9% Union-Sparsität bei Batch 1, 39,7% bei Batch 32, 14,1% bei Batch 64.** Bei 64 gleichzeitigen Dekodierungsschritten werden 86% des Pools berührt. Dies ist die gleiche Einschränkung, die kontextuelle Sparsitäts-Tricks aus Production-Serving-Stacks herausgehalten hat (vgl. [Dejavu](https://arxiv.org/abs/2310.17157)), und es ist, warum der Pro-Token-Gewinn als Kante und Single-Stream-Dekodierungs-Eigenschaft am besten gelesen wird.

Ein Versuch, es zu beheben, scheiterte an seinem eigenen Kill-Gate (Exp 66): Ein Gruppen-Übereinstimmungs-Routing-Ziel sollte das Routing eines Batch in weniger Expertengruppen konzentrieren und erzeugte Batch-32 Union-Sparsität von **0,371** gegen eine unmodifizierte Baseline von **0,397** - die gesamte Kurve überlagert. Der auxiliary-Term war einfach vom Last-Balancing-Verlust überwältigt. Berichtet statt verborgen, für [die Gründe in der Begleitpost](./budget-dependent-benchmarking-sparse-moe).

**Alles hier ist 2,5M–145M Parameter** für die trainierten Ergebnisse, mit der Energiekurve bis zu 1B Dimensionen konkretisiert. Es ist kein Frontier-Skala-Anspruch.

## 9. Was hält

Auf das reduziert, was jeden Vorbehalt oben übersteht:

- Top-1-Routing macht Feed-Forward-Kosten **konstant in Expertenzahl**; die dichte Baseline wächst linear. Dies ist Arithmetik, keine Feststellung.
- Gemessen auf einem H100, das ergibt **3,07× bei 32 Experten und 5,08× bei 64 Experten** weniger Energie pro Token bei 1B Parametern, gegen sowohl ein dichtes Modell als auch einen parametergesteuerten Transformer.
- **Der gruppiert-GEMM-Kernel ist das, das es real macht** - bit-exakt, und wert 3,29× Inferenz und 4,51× Training bei hohen Expertenzahlen. Ohne ihn existiert nichts davon.
- **Oberhalb von ~128 Experten bei festem Budget divergieren gemessene Energie und der FLOP-Proxy.** Vertrauen Sie den Joules.
- **Spiking kostet ~1% Qualität** und kauft neuromorphe Kompatibilität, nicht Genauigkeit.

---

## Häufig gestellte Fragen

**F: Spart Mixture-of-Experts tatsächlich Energie bei Inferenz?**
Es hängt vollständig von Expertenzahl und Kernel ab. Bei 8 Experten, gemessen hier, gab es keinen Gewinn - der immer aktive Mixer dominierte und der Dispatch-Overhead aß den Gewinn. Bei 32–64 Experten mit einem gruppiert-GEMM-Kernel waren es 3–5× weniger Energie pro Token bei 1B Parametern.

**F: Warum wächst der Gewinn, wenn Sie Experten hinzufügen?**
Top-1-Routing führt einen Experten pro Token aus, unabhängig von der Pool-Größe, daher sind spärliche Kosten flach in Expertenzahl. Ein parametergesteuert abgestimmtes dichtes Modell vergrößert die Feed-Forward-Breite linear mit dem gleichen Parameter-Budget. Das Verhältnis wächst daher linear.

**F: Ist weniger FLOPs das gleiche wie weniger Energie?**
Nicht oberhalb von ~128 Experten bei festem Budget. Gemessen mJ/Token stieg von 0,807 auf 0,954, wenn von 128 auf 256 Experten gegangen wurde, während die FLOP-basierte Metrik weiter verbessert wurde - Pro-Gruppe Launch-Overhead auf vielen winzigen Experten. Messen Sie Joule.

**F: Hält das unter Batched Serving?**
Teilweise. Pro-Token Union-Sparsität fällt von 96,9% bei Batch 1 auf 39,7% bei Batch 32. Der Pro-Token-Energiegewinn ist am stärksten für Single-Stream- und Edge-Dekodierung; Batched Serving erholt nur einen Teil davon.

**F: Was tragen Spiking-Aktivierungen bei?**
Ungefähr 1% Qualitätskosten, Grammatik-neutral. Der Nutzen ist multiplikationsfreie Experten und echte Null-FLOP-bedingte Ausführung, was für Event-driven-Neuromorphe-Hardware von Bedeutung ist, nicht für Genauigkeit auf einer GPU.

---

## Reproduzieren Sie es

Verwaltet mit [uv](https://docs.astral.sh/uv/) auf [PyTorch](https://pytorch.org/):

```bash
git clone https://github.com/JustinGuese/SpikingBrain2.0-s2moe
uv sync

# Live CUDA Leistung + Latenz, Zufallsgewichte (formbestimmt)
uv run python bench_energy.py --n-experts 64 --d-model 512 --d-hidden 512 \
    --n-layers 4 --batch 16 --seq 256

# Kernel-Äquivalenz + Speedup, Inferenz und Training
uv run python bench_dispatch.py
uv run python bench_train_dispatch.py
```

- **Code, Kernels, vollständiges Protokoll:** [github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)
- **Interaktive Energie-Demo:** [huggingface.co/spaces/guestros/s2-moe-demo](https://huggingface.co/spaces/guestros/s2-moe-demo)
- **Trainierte Checkpoints:** [huggingface.co/guestros/s2-moe-checkpoints](https://huggingface.co/guestros/s2-moe-checkpoints)
- **Archiviert (CC BY 4.0):** [doi.org/10.5281/zenodo.20846758](https://doi.org/10.5281/zenodo.20846758)

Verwandte Lektüre: [Switch Transformer](https://arxiv.org/abs/2101.03961) auf Top-1-Routing im Maßstab, [DeepSeekMoE](https://arxiv.org/abs/2401.06066) auf gemeinsame Experten-Topologie, [Gated Linear Attention](https://arxiv.org/abs/2312.06635) auf den Linear-Rezidiv-Mixer, und [Open Neuromorphic](https://open-neuromorphic.org/) für die Event-driven-Hardware-Seite.

Wenn eine Zahl hier sich mit `EXPERIMENTS.md` nicht einigt, das Protokoll gewinnt - reichen Sie ein Problem ein.
