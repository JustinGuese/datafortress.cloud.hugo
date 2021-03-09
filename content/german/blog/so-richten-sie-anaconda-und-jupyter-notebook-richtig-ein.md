+++
author = "Justin Guese"
bg_image = "/images/jupyter.png"
categories = ["tutorial"]
date = 2021-01-24T23:00:00Z
description = "Wenn Anaconda (conda) und Jupyter Notebook (Jupyter Lab) richtig eingerichtet sind, kann die Kombination aus beiden ein perfektes Team werden, in dem man leicht zwischen den Deep Learning conda Umgebungen wechseln kann."
image = "/images/jupyter.png"
tags = ["installation", "conda environment", "python", "jupyter lab", "juypter notebook"]
title = "So richten Sie Anaconda und Jupyter Notebook richtig ein"
type = "post"

+++
Wenn Anaconda (conda) und Jupyter Notebook (Jupyter Lab) richtig eingerichtet sind, kann die Kombination aus beiden ein perfektes Team werden, in dem man leicht zwischen den Deep Learning conda Umgebungen wechseln kann.

Einige Programme benötigen Tensorflow 1.15, andere Tensorflow 2.0? Kein Problem! Wechseln Sie Umgebungen und Tensorflow-Versionen mit einem einfachen Klick.

Haben Sie auch jemals Jupyter Notebook Erweiterungen in jeder conda Umgebung installiert? Machen Sie sich keine Sorgen mehr, wir werden die Erweiterungen einmal installieren und sie in jeder Umgebung verfügbar haben!

# Wie werden wir das erreichen?

1. Anaconda oder Miniconda installieren
2. Installieren Sie Jupyter Notebook / Lab in der Basisumgebung
3. Installieren Sie eine neue Umgebung
4. Aktivieren Sie die Umgebung für Jupyter Notebook

# Wie installiert man Anaconda oder Miniconda?

Anaconda ist ein schönes Paket, das bereits viele Python-Pakete enthält und einen einfachen Einstieg in die Welt von Python ermöglicht. Zusätzlich erlaubt es das Erstellen von Umgebungen in Python, die verschiedene Versionen Ihrer Python-Pakete enthalten. Wenn z.B. ein Programm nur mit Python 2.7 oder älteren Versionen von Matplotlib läuft, können Sie einen eigenen Workspace für dieses Programm erstellen und mit einem Klick auf Python 3 zurückschalten. Darüber hinaus wird auch der Wechsel zwischen Tensorflow 2.0 und Tensorflow 1.15 einfach, was Ihnen endlich erlaubt, einfach zwischen den Versionen zu wechseln (was sonst ziemliche Kopfschmerzen bereiten kann).

Miniconda ist eine Barebone-Version von Anaconda und kann nützlich sein, wenn Sie z.B. auf einem Server arbeiten, wo der Speicherplatz begrenzt ist.

Um Anaconda oder Miniconda zu installieren, gehen Sie auf deren Website ([https://www.anaconda.com/products/individual#Downloads](https://www.anaconda.com/products/individual#Downloads "https://www.anaconda.com/products/individual#Downloads")), oder wenn Sie Linux benutzen, kopieren Sie einfach die folgenden Befehle.

Der erste Link durchsucht die Website nach der neuesten Version und schreibt sie in die Variable LATEST_ANACONDA.

    cd ~/Downloads
    LATEST_ANACONDA=$(wget -O - https://www.anaconda.com/distribution/ 2>/dev/null | sed -ne 's@.*\(https:\/\/repo\.anaconda\.com\/archive\/Anaconda3-.*-Linux-x86_64\.sh\)\">64-Bit (x86) Installer.*@\1@p')
    wget $LATEST_ANACONDA
    chmod +x Anaconda3*.sh # make it executable
    ./Anaconda3*.sh # execute the installer

Folgen Sie dem Dialog und stimmen Sie einfach den Voreinstellungen zu.

### Prüfen und Umschalten der conda-Umgebungen

Wenn conda korrekt installiert ist (eventuell ist ein Logout und Login oder ein Neustart erforderlich), sollten Sie die Ausgabe sehen können, wenn Sie conda in Ihr Terminal eingeben.

Um die aktuell installierten Umgebungen aufzulisten, geben Sie einfach conda env list ein

Es sollte derzeit nur die installierte "Basis"-Umgebung angezeigt werden.

Das Umschalten zwischen den Umgebungen funktioniert so einfach wie die Eingabe von conda activate \[NAME\] und wenn Sie damit fertig sind, deaktivieren Sie es (und gehen zurück zur Basisumgebung) mit conda deactivate.

Die Basisumgebung ist standardmäßig aktiviert.

# Jupyter Notebook / Lab in der Basisumgebung installieren

Jupyter Notebook kann einfach mit conda installiert werden. Unser Plan ist es, es nur in der Basisumgebung zu installieren und dann nur zwischen den Subumgebungen zu wechseln, um die Einrichtung von Jupyter Lab in jeder Umgebung zu vermeiden.

## Installation von Jupyter Notebook (Standard)

    conda install -c conda-forge notebook
    conda install -c conda-forge nb_conda_kernels

## Jupyter Lab installieren

    conda installieren -c conda-forge jupyterlab
    conda install -c conda-forge nb_conda_kernels

## Jupyter-Notebook-Erweiterungen installieren

Ich mag die Jupyter-Notebook-Erweiterungen sehr, da sie eine Menge Autovervollständigung, zusätzliche Informationen und generell Dinge, die das Leben leichter machen, unterstützen. Eine gute Voreinstellung ist in dem folgenden Installationsbefehl enthalten:

    conda install -c conda-forge jupyter_contrib_nbextensions

Eine gute Übersicht über andere Erweiterungen: [https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231](https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231 "https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231")

### (Optional) Installation des Paketmanagers pip

Meiner Meinung nach ist es eine gute Idee, den pip-Paketmanager zur Basis- (und jeder Unter-) Umgebung hinzuzufügen, da nicht alle Pakete von conda install unterstützt werden. Wenn pip nicht in jeder Sub-Umgebung installiert ist, kann es außerdem sein, dass das Paket nur in der "Basis"-conda-Umgebung installiert wird, was zu einem Fehler führt, wenn das Paket in Ihrer Sub-Umgebung nicht gefunden wird.

    conda install pip

# Erstellen von Umgebungen in conda und Jupyter Notebook

Sagen wir, Sie wollen sowohl Tensorflow 2.0 als auch Tensorflow 1.15 in Jupyter Notebook installieren.

Für dieses Beispiel vereinbaren Sie zuerst, ob Sie die GPU oder CPU Version von Tensorflow verwenden wollen. Für die Verwendung der GPU-Version fügen Sie "-gpu" zu TensorFlow hinzu, und ansonsten lassen Sie es einfach so wie es ist.

Um eine neue conda Umgebung zu erstellen, können wir ausführen

    conda create --name tf-2.0

Wenn Sie bereits vorhaben, einige Pakete mit zu installieren, fügen Sie diese einfach an das Ende an, wie:

    conda create -n tf-2.0 tensorflow-gpu pip ipykernel

Ich empfehle die Installation von pip für die Paketinstallation, und ipykernel wird benötigt, um Umgebungen mit Jupyter Notebook zu wechseln

Um eine Umgebung mit TensorFlow 1.15 zu installieren, verwenden Sie folgendes:

    conda create -n tf-1.15 tensorflow-gpu==1.15 pip ipykernel

Wenn dies erfolgreich durchgeführt wurde, sollten Sie in der Lage sein, drei Umgebungen zu sehen, wenn Sie den folgenden Befehl ausführen:

    conda env list

1. base
2. tf-2.0
3. tf-1.15

# Starten Sie Jupyter Notebook und überprüfen Sie die Umgebungen und Erweiterungen

    jupyter notebook

Wenn Sie Jupyter Notebook in der Basisumgebung starten, sollten Sie eine Registerkarte mit "Erweiterungen" sowie "conda"/"Umgebungen" sehen können. Gehen Sie zu "Extensions" und aktivieren Sie die Erweiterungen, die Ihnen gefallen, und wenn Sie bereit sind, erstellen Sie ein neues Notebook mit der Schaltfläche "new". Hier sollten Sie zwischen Ihrer Basis-, tf-2.0- und tf-1.15-Umgebung wählen können.

Achtung! Sie müssen das jupyter notebook immer in der Basis-Umgebung ausführen. Führen Sie conda deactivate aus, um Ihre aktuelle Umgebung zu verlassen und zur Basis-Umgebung zurückzukehren.

Wenn Sie weitere Pakete installieren müssen, aktivieren Sie eine Umgebung mit conda activate \[NAME\], führen Sie Ihre Befehle wie conda install X oder pip install X aus, und verlassen Sie die Umgebung mit conda deactivate.

Lassen Sie mich wissen, ob dies für Sie funktioniert hat, es hat mir sehr geholfen und ich wünschte, ich hätte das früher gewusst!