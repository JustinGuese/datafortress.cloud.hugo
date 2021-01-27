+++
author = "Justin Guese"
bg_image = "/images/download.png"
categories = ["algorithmic trading", "finance"]
date = 2021-01-26T23:00:00Z
description = "Der typische maschinelle Lernalgorithmus kann nur mit den Daten arbeiten, die er erhalten hat. Er kann (in der Regel) keine neuen Merkmale oder Interpretationen wie \"Wenn das Volumen steigt und die 3. Ableitung des Preises steigt, wird der Preis höchstwahrscheinlich steigen\" erstellen, sondern kann stattdessen nur auf die Daten \"schauen\", die er erhalten hat. Das wären Berechnungen wie \"wenn der Preis über 100 USD liegt und das Volumen über 2000, wird der Preis höchstwahrscheinlich steigen\".  "
image = "/images/download.png"
tags = ["algorithmic trading", "finance", "stocks", "investing", "ai investing"]
title = "Anreichern von Aktiendaten für Ihr algorithmisches Python-Handelsmodell"
type = "post"

+++
# Ihre ersten Schritte beim Aufbau eines Handelsalgorithmus

Nehmen wir an, Sie planen, Ihr eigenes algorithmisches Handelsmodell zu erstellen.

Sie werden höchstwahrscheinlich nur Preisdaten (Close) für Ihr Modell und Ihren Algorithmus verwenden, aber bald werden Sie feststellen, dass Ihr Modell nicht gut performt.

Bald werden Sie typische OHLCV-Daten verwenden, die sich auf Open, High, Low, Close, Volume beziehen, was schon besser ist, aber das Modell scheint nicht gut genug zu funktionieren.

Was können Sie tun?

Ein praktisches Colab-Notebook zum Mitverfolgen: 

[https://colab.research.google.com/drive/1ywqti1TuTDY_Z11ry0x4ITclCwxnXAeI?usp=sharing](https://colab.research.google.com/drive/1ywqti1TuTDY_Z11ry0x4ITclCwxnXAeI?usp=sharing "https://colab.research.google.com/drive/1ywqti1TuTDY_Z11ry0x4ITclCwxnXAeI?usp=sharing")

Gist:

[https://gist.github.com/JustinGuese/019e0e71100abe6555f78c32fd0b10a9](https://colab.research.google.com/drive/1ywqti1TuTDY_Z11ry0x4ITclCwxnXAeI?usp=sharing "https://colab.research.google.com/drive/1ywqti1TuTDY_Z11ry0x4ITclCwxnXAeI?usp=sharing")

# Wie mag ein Machine Learning Trading Bot?

Der typische maschinelle Lernalgorithmus kann nur mit den Daten arbeiten, die er erhalten hat. Er kann (in der Regel) keine neuen Merkmale oder Interpretationen wie "Wenn das Volumen steigt und die 3. Ableitung des Preises steigt, wird der Preis höchstwahrscheinlich steigen" erstellen, sondern kann stattdessen nur auf die Daten "schauen", die er erhalten hat. Das wären dann Berechnungen wie "wenn der Preis über 100 USD liegt und das Volumen über 2000, wird der Preis höchstwahrscheinlich steigen".

Neulinge im Bereich des maschinellen Lernens versuchen nun, dieses Problem zu lösen, indem sie jahrzehntelang trainieren oder immer mehr GPUs einsetzen, aber ein weitaus effizienterer Weg wäre es, den Algorithmus mit zusätzlichen Daten zu füttern, so dass er mehr Ressourcen für seine Berechnungen nutzen kann.

Dies kann erreicht werden durch:

1. Mehr Daten erhalten (eine größere Zeitspanne)
2. Hinzufügen von statistischen Metriken
3. Hinzufügen Ihrer eigenen Signale und Interpretationen

# Hands-on: Anreicherung Ihrer Daten

## Erste Schritte - Beschaffung Ihrer Daten

Lassen Sie uns zunächst einige grundlegende OHLCV-Daten erfassen. Ich mag das yfinance ([https://pypi.org/project/yfinance/](https://pypi.org/project/yfinance/ "https://pypi.org/project/yfinance/")) Modul wegen seiner Einfachheit. Es ist nicht vergleichbar mit Live-Streams von Daten, aber auf der anderen Seite ist es kostenlos und großartig zum Experimentieren!

    pip install yfinance pandas numpy matplotlib ta

    import yfinance as yf
    import matplotlib.pyplot as plt
    import pandas as pd

Holen Sie sich einige Bestandsdaten, Intervall und Periode beziehen sich auf die Timerbereiche.

interval akzeptiert Werte wie 1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo

Periode akzeptiert Werte wie 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max

Nicht alle Kombinationen funktionieren, z.B. 1m (1 Minute) Intervalle funktionieren nur mit 7d max, 1h (1 Stunde) mit 3 Monaten max (muss als 90d geschrieben werden). Aber lassen Sie uns zuerst mit täglichen Daten arbeiten

    df = yf.download("MSFT",period="5y",interval="1d")
    df.head()

![](/images/screenshot-from-2021-01-27-14-46-45.png)

Kurzer Exkurs: Was zum Geier ist Open, High, Low, Close, Adj Close und Volume? Wo ist der Preis?!

Es gibt keinen "einen Preis" an der Börse! Sie können sich die OHLCV-Daten als "Buckets" oder "Bins" in der Zeit vorstellen, die alle Trades zusammenfassen, die in diesem Fenster stattgefunden haben. Das typische "Linien"-Diagramm, das Sie kennen, bezieht sich normalerweise auf den "Close"-Kurs dieser Aktie im Zeitbereich X, d.h. den Wert, den die Aktie am Ende des Zeitbereichs hatte.

Wenn wir uns Tagesdaten ansehen, bezieht sich "Open" auf den durchschnittlichen (!) Aktienkurs bei Markteröffnung, während "Close" sich auf den durchschnittlichen (!) Kurs bezieht, den die Aktie bei Marktschluss hatte. Bei stündlichen Daten bezieht sich "Open" auf den Beginn der jeweiligen Stunde, z. B. 11 Uhr, und "Close" auf den Schluss der Stunde, also 11:59:59 Uhr.

Ebenso ist "High" der höchste Handel/Kurs, der in diesem Zeitrahmen aufgezeichnet wurde, und "Low" der niedrigste. Das Volumen bezieht sich auf die Anzahl der Assets oder Aktien, die in diesem Zeitbereich gehandelt wurden.

Das heißt, wenn z.B. "Low" und "Close" einer Spalte nahe beieinander liegen, sehen wir höchstwahrscheinlich einen Abwärtstrend, da der Close das aktuelle Low ist. Auch wenn das Volumen hoch ist, gibt es viele Trades, wenn also z.B. das Volumen höher ist als üblich, scheint etwas im Markt zu passieren. Aber wie auch immer, gehen Sie dazu auf [https://www.investopedia.com/,](https://www.investopedia.com/, "https://www.investopedia.com/,") wir werden jetzt mit der Codierung fortfahren!

### Was ist "Adj Close"?

Dies ist wichtig, da die meisten ML-Algorithmen durch "normale" Schlussdaten furchtbar verwirrt sind. Wenn es eine Aufspaltung der Aktie gibt, sehen die Daten so aus, als ob der Preis einen irrsinnigen Rückgang hat.

Der Grund ist, einfach gesagt, dass wenn eine Aktie zu teuer wird, das Unternehmen beschließt, die Aktie in zwei Teile zu "teilen". Bedeutet das, dass sich meine Investition halbiert? Natürlich nicht, Sie erhalten einfach die doppelte Menge an Aktien, die Sie halten, so dass Sie auf dem Papier immer noch den gleichen Wert der Aktie halten.

Interessanterweise führt ein Split in der Regel zu steigenden Kursen (dumme Menschen!), und wenn Ihr maschineller Lernalgorithmus einen enormen Kursverfall sieht, wird er höchstwahrscheinlich die Aktie auf Teufel komm raus verkaufen.

Aus diesem Grund sollten Sie immer "bereinigte" Werte verwenden, die man sich als "bereinigte" Kursdaten vorstellen kann, bei denen Splits, Dividenden und alle anderen Ereignisse, die den wahren Wert der Daten nicht beeinflussen, berücksichtigt werden. Versuchen Sie daher, für Ihre Algorithmen immer bereinigte Daten zu verwenden!

Im Fall von yfinance ist dies einfach zu bewerkstelligen, da wir einfach "Adj Close" anstelle von "Close" verwenden können.

### Plotten der Daten

Wenn wir uns die Daten ansehen, können wir bereits eine schöne, bekannte Kurve erkennen

    plt.plot(df["Adj Close"])

## Schritt 2: Anreichern Ihrer Daten mit statistischen Daten

Wie bereits erwähnt, müssen wir weitere Informationen aus unseren Daten erzeugen, damit der Algorithmus sie verwenden kann, da er dies nicht alleine tun kann.

Ich verwende gerne die Bibliothek ta ([https://github.com/bukosabino/ta](https://github.com/bukosabino/ta "https://github.com/bukosabino/ta")), da sie wiederum super einfach zu bedienen ist und über 100 statistische Berechnungen enthält.

Installieren und importieren Sie sie mit

    pip install ta
    from ta import add_all_ta_features
    from ta.utils import dropna

Wenn Sie nun schon wissen, welche Werte Sie verwenden wollen, können Sie nur diese auswählen, ooooder wir schlagen einfach alle 100+ auf unsere Daten ein:

    df = dropna(df) # clean nans if present
    df = add_all_ta_features(df,open="Open", high="High", low="Low", close="Adj Close", volume="Volume")

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

Nun, das sollte für den Moment reichen!

Außerdem ist immer noch eine Menge Nans drin, da einige Werte nur berechnet werden, wenn genug Zeit vergangen ist. Meiner Erfahrung nach funktioniert das Auffüllen mit Nullen ganz gut, auch wenn es dafür fortgeschrittenere Techniken gibt.

    df = df.fillna(0)

## Schritt 3: Erstellen Sie Ihre eigenen Signale

Jetzt ist es an der Zeit, Ihre verrückten Handelsideen in Zahlen zu übersetzen!

Beginnen wir mit dem klassischen Moving Average Cross. Die Idee ist wie folgt: Wenn ein kurzer gleitender Durchschnitt einen langsameren gleitenden Durchschnitt kreuzt, deutet dies entweder auf einen Kursanstieg oder einen Kursrückgang hin, je nach Richtung des Kreuzes.

Auch hier können Sie bei investopedia Details nachlesen: [https://www.investopedia.com/articles/active-trading/052014/how-use-moving-average-buy-stocks.asp](https://www.investopedia.com/articles/active-trading/052014/how-use-moving-average-buy-stocks.asp "https://www.investopedia.com/articles/active-trading/052014/how-use-moving-average-buy-stocks.asp")

Unser Ziel ist es, zunächst die SMAs zu berechnen und dann die Kreuzungen als 1 und -1 zu formulieren, und 0, um keine Kreuzung zu signalisieren.

### Erstellen einfacher gleitender Durchschnitte

    # creating simple moving averages
    averages = [1,2,5,10,15,20,25,50,100]
    for average in averages:
      df['SMA_%d'%average] = df["Adj Close"].rolling(window=average).mean()
    
    # visualize only SMAs 
    filter_col = [col for col in df if col.startswith('SMA')]
    df[filter_col].tail()

Und Visualisierung:

    # results in bigger figures
    plt.rcParams["figure.figsize"] = (20,20)
    for filter in filter_col:
      plt.plot(df[filter],label=filter)
    plt.legend()

![](/images/download.png)

### Erzeugen eines Crossover-Signals

Lassen Sie uns eine kleine Hilfsfunktion verwenden

    def createCross(data,fastSMA,slowSMA):
      fast = 'SMA_%d'%fastSMA
      slow = 'SMA_%d'%slowSMA
      crossname = "cross_%d_%d"%(fastSMA,slowSMA)
      previous_fast = data[fast].shift(1)
      previous_slow = data[slow].shift(1)
      neg = ((data[fast] < data[slow]) & (previous_fast >= previous_slow))
      pos = ((data[fast] > data[slow]) & (previous_fast <= previous_slow))
      data[crossname] = 0
      data.loc[neg,crossname] = -1
      data.loc[pos,crossname] = 1
      return data

Und nun können Sie entweder eigene Werte einfügen oder unserem Beispiel folgen und einfach die Querprodukte nehmen:

    for fast in averages:
      for slow in averages:
        if fast != slow and slow > fast:
          df = createCross(df,fast,slow)

Dadurch wurde ein perfektes Klassifizierungssignal erzeugt, das ein Aufwärtskreuz mit 1 und ein Abwärtskreuz mit -1 signalisiert, wobei 0 ein neutraler Wert (kein Kreuz) ist.

Dies ist nur ein Beispiel dafür, welche weiteren Signale Sie geben können.

### Erstellen einer Spalte für die prozentuale Veränderung

Um ein weiteres Beispiel hinzuzufügen: Wenn Sie versuchen, die prozentuale Veränderung vorherzusagen, benötigen Sie eine Spalte, die die prozentuale Veränderung zum vorherigen Zeitbereich anzeigt. Dies lässt sich glücklicherweise leicht mit Pandas erledigen.

    df["pct_change"] = df["Adj Close"].pct_change()
    
    Date
    2021-01-21    0.013363
    2021-01-22   -0.004463
    2021-01-25    0.000538
    2021-01-26    0.009754
    2021-01-27   -0.010484
    Name: pct_change, dtype: float64

Was für ein perfektes Signal für ein regressives Modell!

# Zusammenfassung

Bevor wir unsere Erweiterungen hinzugefügt haben, enthielt der Datenrahmen nur 5 Spalten, nicht viel für ein maschinelles Lernmodell!

Am Ende, nach dem Hinzufügen von statistischen Werten und unseren eigenen Signalen, haben wir bereits 135 Features und Spalten unseres Datenrahmens erreicht!

So viel besser für Ihr Modell!

Was sind Ihre Gedanken zu diesem Prozess? Habe ich etwas übersehen? Möchten Sie mehr Artikel von Justin lesen? Schauen Sie auf meiner Website vorbei und lesen Sie mehr!