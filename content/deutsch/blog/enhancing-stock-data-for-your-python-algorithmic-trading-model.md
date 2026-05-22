---
author: "Justin Guese"
bg_image: "/images/download.png"
categories: ["finance", "algorithmic trading"]
date: 2022-01-26T23:00:00Z
description: "Der typische Machine Learning Algorithmus kann nur mit den Daten arbeiten, die er erhalten hat. Er kann (normalerweise) keine neuen Features oder Interpretationen erstellen, wie „Wenn das Volumen steigt und die 3. Ableitung des Preises steigt, wird der Preis höchstwahrscheinlich steigen“, sondern kann nur die Daten „betrachten“, die er bekommen hat. Dies wären Berechnungen wie „wenn der Preis über 100 USD liegt und das Volumen über 2000, wird der Preis höchstwahrscheinlich steigen“."
image: "/images/download.png"
tags: ["ai investing", "investing", "stocks", "finance", "algorithmic trading"]
title: "Verbesserung von Aktiendaten für Ihr Python-Modell für algorithmischen Handel"
type: "post"
---

Nehmen wir an, Sie planen, Ihr eigenes Modell für den algorithmischen Handel zu bauen.

Höchstwahrscheinlich werden Sie nur Preisdaten (Close) für Ihr Modell und Ihren Algorithmus verwenden, aber Sie werden bald feststellen, dass Ihr Modell nicht gut abschneidet.

Bald werden Sie typische OHLCV-Daten verwenden, was sich auf Open, High, Low, Close, Volume bezieht, was bereits besser ist, aber das Modell scheint immer noch nicht ganz gut genug zu funktionieren.

Was können Sie tun?

Praktisches Colab Notebook zum Mitmachen: [https://colab.research.google.com/drive/1ywqti1TuTDY_Z11ry0x4ITclCwxnXAeI?usp=sharing](https://colab.research.google.com/drive/1ywqti1TuTDY_Z11ry0x4ITclCwxnXAeI?usp=sharing)

Gist:

[https://gist.github.com/JustinGuese/019e0e71100abe6555f78c32fd0b10a9](https://gist.github.com/JustinGuese/019e0e71100abe6555f78c32fd0b10a9)

## Was mag ein Machine Learning Trading-Bot?

Der typische Machine Learning Algorithmus kann nur mit den Daten arbeiten, die er erhalten hat. Er kann (normalerweise) keine neuen Features oder Interpretationen erstellen, wie „Wenn das Volumen steigt und die 3. Ableitung des Preises steigt, wird der Preis höchstwahrscheinlich steigen“, sondern kann nur die Daten „betrachten“, die er bekommen hat. Dies wären Berechnungen wie „wenn der Preis über 100 USD liegt und das Volumen über 2000, wird der Preis höchstwahrscheinlich steigen“.

Einsteiger in das Thema Machine Learning versuchen nun oft, dieses Problem zu lösen, indem sie jahrzehntelang trainieren oder immer mehr GPUs verwenden, aber ein viel effizienterer Weg wäre es, den Algorithmus mit zusätzlichen Daten zu füttern, sodass er mehr Ressourcen nutzen kann, um seine Berechnungen abzuleiten.

Dies kann erreicht werden durch:

1. Einholen von mehr Daten (ein größerer Zeitraum)
2. Hinzufügen statistischer Kennzahlen
3. Hinzufügen eigener Signale und Interpretationen

# Hands-on: Verbesserung Ihrer Daten

## Erste Schritte – Daten abrufen

Lassen Sie uns zuerst einige grundlegende OHLCV-Daten besorgen. Ich mag das yfinance-Modul ([https://pypi.org/project/yfinance/](https://pypi.org/project/yfinance/)) wegen seiner Einfachheit. Es ist nicht vergleichbar mit Live-Datenströmen, aber auf der anderen Seite ist es kostenlos und großartig für Experimente!

    pip install yfinance pandas numpy matplotlib ta

Importieren Sie dieses Modul sowie Pandas, Numpy und Matplotlib:

    import yfinance as yf
    import matplotlib.pyplot as plt
    import pandas as pd

Holen Sie sich einige Aktiendaten; Intervall und Periode beziehen sich auf die Zeitbereiche.

Intervall akzeptiert Werte wie 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo.

Periode akzeptiert Werte wie 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max.

Nicht alle Kombinationen funktionieren, z.B. funktionieren 1m (1 Minute) Intervalle nur mit maximal 7 Tagen, 1h (1 Stunde) mit maximal 3 Monaten (muss als 90d geschrieben werden). Aber arbeiten wir erst einmal mit täglichen Daten.

    df = yf.download("MSFT", period="5y", interval="1d")
    df.head()

![](/images/screenshot-from-2021-01-27-14-46-45.png)

Kurzer Exkurs: Was zum Teufel sind Open, High, Low, Close, Adj Close und Volume? Wo ist der Preis?!

Es gibt keinen „einen Preis“ an der Börse! Sie können sich OHLCV-Daten als „Eimer“ oder „Behälter“ in der Zeit vorstellen, die alle Trades zusammenfassen, die in diesem Zeitfenster stattgefunden haben. Das typische „Linienchart“, das Sie kennen, bezieht sich normalerweise auf den „Close“-Preis dieser Aktie im Zeitbereich X, also den Wert, den die Aktie zum Ende des Zeitbereichs hatte.

Wenn wir uns tägliche Daten ansehen, bezieht sich „Open“ auf den durchschnittlichen (!) Aktienkurs bei Markteröffnung, während sich „Close“ auf den durchschnittlichen (!) Preis bezieht, den die Aktie zum Marktschluss hatte. Wenn wir uns stündliche Daten ansehen, bezieht sich „Open“ auf den Beginn dieser Stunde, z.B. 11 Uhr, und „Close“ auf das Ende dieser Stunde, also 11:59:59 Uhr.

Ebenso ist „High“ der höchste in diesem Zeitraum verzeichnete Trade/Preis und „Low“ der niedrigste. Das Volumen bezieht sich auf die Anzahl der in diesem Zeitraum gehandelten Vermögenswerte oder Aktien.

Das bedeutet, wenn z.B. „Low“ und „Close“ einer Spalte nahe beieinander liegen, sehen wir höchstwahrscheinlich einen Abwärtstrend, da der Schlusskurs das aktuelle Tief ist. Auch wenn das Volumen hoch ist, finden viele Trades statt. Wenn also z.B. das Volumen höher als üblich ist, scheint etwas im Markt vorzugehen. Aber wie auch immer, besuchen Sie [https://www.investopedia.com/](https://www.investopedia.com/) für Details dazu, wir programmieren jetzt weiter!

### Was ist „Adj Close“?

Dies ist wichtig, da die meisten ML-Algorithmen durch „normale“ Schlusskursdaten schrecklich verwirrt werden. Wenn es einen Split in der Aktie gibt, sehen die Daten so aus, als ob der Preis einen wahnsinnigen Einbruch hat.

Der Grund ist, einfach gesagt, dass eine Firma beschließt, die Aktie in zwei Teile zu „teilen“, wenn sie zu teuer wird. Bedeutet das, dass sich meine Investition halbiert? Natürlich nicht, Sie erhalten einfach die doppelte Anzahl an Aktien, die Sie halten, sodass Sie auf dem Papier immer noch denselben Wert dieser Aktie halten.

Interessanterweise verursacht ein Split normalerweise steigende Preise (dumme Menschen!), und wenn Ihr Machine Learning Algorithmus einen riesigen Preiseinbruch sieht, wird er höchstwahrscheinlich diese Aktie massiv verkaufen.

Aus diesem Grund sollten Sie immer „bereinigte“ (adjusted) Werte verwenden, die man sich als „gesäuberte“ Preisdaten vorstellen kann, wobei Splits, Dividenden und alle anderen Ereignisse berücksichtigt werden, die den wahren Wert der Daten nicht beeinflussen. Versuchen Sie daher, immer adjusted Daten für Ihre Algorithmen zu verwenden!

Im Fall von yfinance ist das einfach zu bewerkstelligen, da wir einfach „Adj Close“ anstelle von „Close“ verwenden können.

### Plotten der Daten

Wenn wir uns die Daten ansehen, können wir bereits eine schöne, wohlbekannte Kurve sehen:

    plt.plot(df["Adj Close"])

## Schritt zwei: Verbesserung Ihrer Daten mit statistischen Daten

Wie oben erwähnt, müssen wir mehr Informationen aus unseren Daten erstellen, damit der Algorithmus sie nutzen kann, da er dies nicht von alleine tun kann.

Ich benutze gerne die Bibliothek ta ([https://github.com/bukosabino/ta](https://github.com/bukosabino/ta)), da sie wiederum super einfach zu bedienen ist und über 100 statistische Berechnungen enthält.

Installieren und importieren Sie sie mit:

    pip install ta
    from ta import add_all_ta_features
    from ta.utils import dropna

Wenn Sie bereits wissen, welche Werte Sie verwenden möchten, können Sie nur diese auswählen, oooder wir hauen einfach alle 100+ auf unsere Daten drauf:

    df = dropna(df) # NaNs entfernen, falls vorhanden
    df = add_all_ta_features(df, open="Open", high="High", low="Low", close="Adj Close", volume="Volume")

Was haben wir also getan?

    df.columns
    Index(['Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume', 'volume_adi',
           'volume_obv', 'volume_cmf', 'volume_fi', 'volume_mfi', 'volume_em',
           'volume_sma_em', 'volume_vpt', 'volume_nvi', 'volume_vwap',
           'volatility_atr', 'volatility_bbm', 'volatility_bbh', 'volatility_bbl',
           'volatility_bbw', 'volatility_bbp', 'volatility_bbhi',
           'volatility_bbli', 'volatility_kcc', 'volatility_kch', 'volatility_kcl',
           'volatility_kcw', 'volatility_kcp', 'volatility_kchi',
           'volatility_kcli', 'volatility_dcl', 'volatility_dch', 'volatility_dcm',
           'volatility_dcw', 'volatility_dcp', 'volatility_ui', 'trend_macd',
           'trend_macd_signal', 'trend_macd_diff', 'trend_sma_fast',
           'trend_sma_slow', 'trend_ema_fast', 'trend_ema_slow', 'trend_adx',
           'trend_adx_pos', 'trend_adx_neg', 'trend_vortex_ind_pos',
           'trend_vortex_ind_neg', 'trend_vortex_ind_diff', 'trend_trix',
           'trend_mass_index', 'trend_cci', 'trend_dpo', 'trend_kst',
           'trend_kst_sig', 'trend_kst_diff', 'trend_ichimoku_conv',
           'trend_ichimoku_base', 'trend_ichimoku_a', 'trend_ichimoku_b',
           'trend_visual_ichimoku_a', 'trend_visual_ichimoku_b', 'trend_aroon_up',
           'trend_aroon_down', 'trend_aroon_ind', 'trend_psar_up',
           'trend_psar_down', 'trend_psar_up_indicator',
           'trend_psar_down_indicator', 'trend_stc', 'momentum_rsi',
           'momentum_stoch_rsi', 'momentum_stoch_rsi_k', 'momentum_stoch_rsi_d',
           'momentum_tsi', 'momentum_uo', 'momentum_stoch',
           'momentum_stoch_signal', 'momentum_wr', 'momentum_ao', 'momentum_kama',
           'momentum_roc', 'momentum_ppo', 'momentum_ppo_signal',
           'momentum_ppo_hist', 'others_dr', 'others_dlr', 'others_cr'],
          dtype='object')

Nun, das sollte fürs Erste reichen!

Außerdem sind da noch viele NaNs drin, da manche Werte erst berechnet werden können, wenn genug Zeit vergangen ist. Meiner Erfahrung nach funktioniert das Auffüllen mit Nullen recht gut, auch wenn es dafür fortgeschrittenere Techniken gibt.

    df = df.fillna(0)

## Schritt drei: Eigene Signale erstellen

Jetzt ist es an der Zeit, Ihre verrückten Handelsideen in Zahlen zu übersetzen!

Lassen Sie uns mit dem klassischen Moving Average Cross beginnen. Die Idee ist folgende: Wenn ein kurzer gleitender Durchschnitt einen langsameren gleitenden Durchschnitt kreuzt, deutet dies entweder auf einen Preisanstieg oder -fall hin, je nach Richtung der Kreuzung.

Schauen Sie sich auch hier Investopedia für Details an: [https://www.investopedia.com/articles/active-trading/052014/how-use-moving-average-buy-stocks.asp](https://www.investopedia.com/articles/active-trading/052014/how-use-moving-average-buy-stocks.asp)

Unser Ziel ist es, zuerst die SMAs zu berechnen und dann Kreuzungen als 1 und -1 zu formulieren, sowie 0, um keine Kreuzung zu signalisieren.

### Simple Moving Averages erstellen

    # Erstellung einfacher gleitender Durchschnitte
    averages = [1, 2, 5, 10, 15, 20, 25, 50, 100]
    for average in averages:
      df['SMA_%d' % average] = df["Adj Close"].rolling(window=average).mean()
    
    # Nur SMAs visualisieren
    filter_col = [col for col in df if col.startswith('SMA')]
    df[filter_col].tail()

Und etwas Visualisierung:

    # Führt zu größeren Abbildungen
    plt.rcParams["figure.figsize"] = (20, 20)
    for filter in filter_col:
      plt.plot(df[filter], label=filter)
    plt.legend()

![SMA python trading](/images/download.png "Bild vom Autor")

### Ein Crossover-Signal erstellen

Benutzen wir eine kleine Hilfsfunktion:

    def createCross(data, fastSMA, slowSMA):
      fast = 'SMA_%d' % fastSMA
      slow = 'SMA_%d' % slowSMA
      crossname = "cross_%d_%d" % (fastSMA, slowSMA)
      previous_fast = data[fast].shift(1)
      previous_slow = data[slow].shift(1)
      neg = ((data[fast] < data[slow]) & (previous_fast >= previous_slow))
      pos = ((data[fast] > data[slow]) & (previous_fast <= previous_slow))
      data[crossname] = 0
      data.loc[neg, crossname] = -1
      data.loc[pos, crossname] = 1
      return data

Und nun könnten Sie entweder benutzerdefinierte Werte einsetzen oder unserem Beispiel folgen und einfach die Kreuzprodukte nehmen:

    for fast in averages:
      for slow in averages:
        if fast != slow and slow > fast:
          df = createCross(df, fast, slow)

Dies erzeugte ein perfektes Klassifizierungssignal, das eine Aufwärtskreuzung mit 1 und eine Abwärtskreuzung mit -1 signalisiert, wobei 0 neutral ist (keine Kreuzung).

Dies ist nur ein Beispiel dafür, welche weiteren Signale Sie bereitstellen können.

### Eine Spalte für die prozentuale Änderung erstellen

Um ein weiteres Beispiel hinzuzufügen: Wenn Sie versuchen, die prozentuale Änderung vorherzusagen, benötigen Sie eine Spalte, die die prozentuale Änderung zum vorherigen Zeitraum zeigt. Dies kann glücklicherweise einfach mit Pandas erledigt werden.

    df["pct_change"] = df["Adj Close"].pct_change()
    
    Date
    2021-01-21    0.013363
    2021-01-22   -0.004463
    2021-01-25    0.000538
    2021-01-26    0.009754
    2021-01-27   -0.010484
    Name: pct_change, dtype: float64

Was für ein perfektes Signal für ein Regressionsmodell!

# Zusammenfassung

Bevor wir unsere Verbesserungen hinzugefügt haben, enthielt der Dataframe nur 5 Spalten, nicht viel für ein Machine Learning Modell!

Am Ende, nach dem Hinzufügen statistischer Werte und unserer eigenen Signale, haben wir bereits 135 Features und Spalten in unserem Dataframe erreicht!

Viel besser für Ihr Modell!

Was sind Ihre Gedanken zu diesem Prozess? Habe ich etwas übersehen? Kommentieren Sie unten!
Möchten Sie mehr Artikel von Justin lesen? Besuchen Sie meine Website für mehr!
