---
author: "Justin Guese"
bg_image: "/images/jupyter.png"
categories: ["tutorial"]
date: 2022-01-24T23:00:00Z
description: "Wenn Anaconda (conda) und Jupyter Notebook (Jupyter Lab) richtig eingerichtet sind, können sie zum perfekten Team werden, mit dem Sie problemlos zwischen Deep Learning Conda-Umgebungen wechseln können. Manche Programme erfordern Tensorflow 1.15, andere Tensorflow 2.0? Kein Problem! Wechseln Sie einfach die Umgebungen und Tensorflow-Versionen mit einem einfachen Klick."
image: "/images/jupyter.png"
tags: ["deep learning", "tutorial", "anaconda", "jupyter notebook"]
title: "So richten Sie Anaconda und Jupyter Notebook richtig ein"
type: "post"
---

Wenn Anaconda (conda) und Jupyter Notebook (Jupyter Lab) richtig eingerichtet sind, können sie zum perfekten Team werden, mit dem Sie problemlos zwischen Deep Learning Conda-Umgebungen wechseln können.

Manche Programme erfordern Tensorflow 1.15, andere Tensorflow 2.0? Kein Problem! Wechseln Sie einfach die Umgebungen und Tensorflow-Versionen mit einem einfachen Klick.

Und haben Sie schon einmal Jupyter Notebook Extensions in jeder einzelnen Conda-Umgebung installiert? Machen Sie sich keine Sorgen mehr, wir werden die Extensions einmal installieren und sie in jeder Umgebung verfügbar haben!

1. Installieren Sie Anaconda oder Miniconda
2. Installieren Sie Jupyter Notebook / Lab in der Basisumgebung (base)
3. Installieren Sie eine neue Umgebung
4. Aktivieren Sie die Umgebung für Jupyter Notebook

# Wie installiere ich Anaconda oder Miniconda?

Anaconda ist ein schönes Paket, das bereits viele Python-Pakete enthält und einen einfachen Einstieg in die Welt von Python ermöglicht. Zusätzlich erlaubt es das Erstellen von Umgebungen in Python, die verschiedene Versionen Ihrer Python-Pakete enthalten können. Wenn zum Beispiel ein Programm nur mit Python 2.7 oder älteren Versionen von Matplotlib läuft, können Sie einen eigenen Arbeitsbereich für dieses Programm erstellen und mit einem Mausklick zurück zu Python 3 wechseln. Außerdem wird das Umschalten zwischen Tensorflow 2.0 und Tensorflow 1.15 ebenfalls einfach, was es Ihnen schließlich ermöglicht, problemlos zwischen den Versionen zu wechseln (was ansonsten ziemlich Kopfzerbrechen bereiten kann).

Miniconda ist eine minimalistische Version von Anaconda und kann nützlich sein, wenn Sie zum Beispiel auf einem Server arbeiten, wo der Speicherplatz begrenzt ist.

Um Anaconda oder Miniconda zu installieren, besuchen Sie deren Website ([https://www.anaconda.com/products/individual#Downloads](https://www.anaconda.com/products/individual#Downloads)), oder wenn Sie Linux verwenden, kopieren Sie einfach die folgenden Befehle.

Der erste Link durchsucht die Website nach der neuesten Version und schreibt sie in die Variable LATEST_ANACONDA.

    cd ~/Downloads
    LATEST_ANACONDA=$(wget -O - https://www.anaconda.com/distribution/ 2>/dev/null | sed -ne 's@.*\(https:\/\/repo\.anaconda\.com\/archive\/Anaconda3-.*-Linux-x86_64\.sh\)\">64-Bit (x86) Installer.*@\1@p')
    wget $LATEST_ANACONDA
    chmod +x Anaconda3*.sh # ausführbar machen
    ./Anaconda3*.sh # Installer ausführen

Folgen Sie dem Dialog und stimmen Sie einfach den Standardeinstellungen zu.

### Überprüfen und Wechseln der Conda-Umgebungen

Wenn Conda korrekt installiert ist (möglicherweise ist ein Ab- und Anmelden oder ein Neustart erforderlich), sollten Sie die Ausgabe sehen können, wenn Sie `conda` in Ihr Terminal eingeben.

Um die aktuell installierten Umgebungen aufzulisten, geben Sie einfach `conda env list` ein.

Es sollte derzeit nur die installierte „base“-Umgebung angezeigt werden.

Das Wechseln zwischen Umgebungen funktioniert so einfach wie das Tippen von `conda activate [NAME]` und, wenn Sie fertig sind, das Deaktivieren (und Zurückkehren zur Basisumgebung) mit `conda deactivate`.

Die Basisumgebung ist standardmäßig aktiviert.

# Installieren Sie Jupyter Notebook / Lab in der Basisumgebung

Jupyter Notebook kann einfach mit Conda installiert werden. Unser Plan ist es, es nur in der Basisumgebung zu installieren und dann einfach zwischen den Unterumgebungen zu wechseln, um das Einrichten von Jupyter Lab in jeder Umgebung zu vermeiden.

## Installation von Jupyter Notebook (Standard)

    conda install -c conda-forge notebook
    conda install -c conda-forge nb_conda_kernels

## Installation von Jupyter Lab

    conda install -c conda-forge jupyterlab
    conda install -c conda-forge nb_conda_kernels

## Installation von Jupyter Notebook Extensions

Ich mag Jupyter Notebook Extensions sehr, die viel Autovervollständigung, zusätzliche Informationen und im Allgemeinen Dinge unterstützen, die das Leben erleichtern. Eine gute Standardeinstellung ist mit dem folgenden Installationsbefehl enthalten:

    conda install -c conda-forge jupyter_contrib_nbextensions

Eine gute Übersicht über andere Extensions: [https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231](https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231)

### (Optional) Installieren des pip Paket-Managers

Meiner Meinung nach ist es eine gute Idee, den pip Paket-Manager zur Basis- (und jeder Unter-) Umgebung hinzuzufügen, da nicht alle Pakete durch `conda install` unterstützt werden. Wenn pip nicht in jeder Unterumgebung installiert ist, könnte das Paket stattdessen einfach in der „base“ Conda-Umgebung installiert werden, was zu einem Fehler führt, bei dem das Paket in Ihrer Unterumgebung nicht gefunden wird.

    conda install pip

# Erstellen von Umgebungen in Conda und Jupyter Notebook

Nehmen wir an, Sie möchten sowohl Tensorflow 2.0 als auch Tensorflow 1.15 in Jupyter Notebook installieren.

Entscheiden Sie für dieses Beispiel zuerst, ob Sie die GPU- oder CPU-Version von Tensorflow verwenden möchten. Für die GPU-Version fügen Sie „-gpu“ zu TensorFlow hinzu, ansonsten lassen Sie es einfach so.

Um eine neue Conda-Umgebung zu erstellen, können wir Folgendes ausführen:

`conda create --name tf-2.0`

Wenn Sie bereits planen, einige Pakete mitzuinstallieren, fügen Sie diese einfach am Ende hinzu, wie:

    conda create -n tf-2.0 tensorflow-gpu pip ipykernel

Ich empfehle die Installation von `pip` für die Paketinstallation, und `ipykernel` wird benötigt, um die Umgebungen in Jupyter Notebook zu wechseln.

Um eine Umgebung mit TensorFlow 1.15 zu installieren, verwenden Sie Folgendes:

    conda create -n tf-1.15 tensorflow-gpu==1.15 pip ipykernel

Wenn dies erfolgreich war, sollten Sie drei Umgebungen sehen, wenn Sie den folgenden Befehl ausführen:

    conda env list

1. base
2. tf-2.0
3. tf-1.15

# Jupyter Notebook starten und Umgebungen sowie Extensions prüfen

    jupyter notebook

Wenn Sie Jupyter Notebook in der Basisumgebung ausführen, sollten Sie einen Tab mit der Aufschrift „Extensions“ sowie „conda“/„environments“ sehen können. Gehen Sie zu Extensions und aktivieren Sie die Erweiterungen, die Ihnen gefallen. Wenn Sie bereit sind, erstellen Sie ein neues Notebook mit der Schaltfläche „New“. Hier sollten Sie zwischen Ihrer base, tf-2.0 und tf-1.15 Umgebung wählen können.

Achtung: Sie müssen Jupyter Notebook immer in der Basisumgebung ausführen. Führen Sie `conda deactivate` aus, um Ihre aktuelle Umgebung zu verlassen und zur Basisumgebung zurückzukehren.

Wenn Sie weitere Pakete installieren müssen, aktivieren Sie eine Umgebung mit `conda activate [NAME]`, führen Sie Ihre Befehle wie `conda install X` oder `pip install X` aus und verlassen Sie die Umgebung mit `conda deactivate`.

Lassen Sie mich wissen, ob das bei Ihnen funktioniert hat; mir hat es sehr geholfen und ich wünschte, ich hätte früher davon gewusst!
