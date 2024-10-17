+++
author = "Justin Guese"
bg_image = "/images/jupyter.png"
categories = ["tutorial"]
date = 2022-01-24T23:00:00Z
description = "If Anaconda (conda) and Jupyter Notebook (Jupyter Lab) are set up the right way the combination of them can become the perfect team, where you are able to easily switch between Deep Learning conda environments.  Some programs requiring Tensorflow 1.15, others Tensorflow 2.0? No problem! Just switch environments and Tensorflow versions with a simple click."
image = "/images/jupyter.png"
tags = ["deep learning", "tutorial", "anaconda", "jupyter notebook"]
title = "How to set up Anaconda and Jupyter Notebook the right way"
type = "post"

+++
If Anaconda (conda) and Jupyter Notebook (Jupyter Lab) are set up the right way the combination of them can become the perfect team, where you are able to easily switch between Deep Learning conda environments.

Some programs requiring Tensorflow 1.15, others Tensorflow 2.0? No problem! Just switch environments and Tensorflow versions with a simple click.

Also, did you ever install Jupyter Notebook extensions in each conda environment? Do not worry anymore, we are going to install the extensions once, and have them available in each environment!


1. Install Anaconda or Miniconda
2. Install Jupyter Notebook / Lab in the base environment
3. Install a new environment
4. Activate the environment for Jupyter Notebook

# How to install Anaconda or Miniconda?

Anaconda is a nice package containing a lot of Python packages already and allows for an easy start into the world of Python. Additionally, it allows creating environments in python, which contain different versions of your Python packages. E.g. if a program only runs with Python 2.7 or older versions of Matplotlib, you can create an own workspace for this program and switch back to Python 3 with a click of a button. Furthermore switching between Tensorflow 2.0 and Tensorflow 1.15 becomes easy as well, finally allowing you to switch between versions easily (which can be quite a headache otherwise).

Miniconda is a barebones version of Anaconda and can be nice if you are e.g. working on a server, where disk space is limited.

To install Anaconda or Miniconda head over to their website ([https://www.anaconda.com/products/individual#Downloads](https://www.anaconda.com/products/individual#Downloads "https://www.anaconda.com/products/individual#Downloads")), or if you are using Linux just copy the following commands.

The first link crawls the website for the newest version and writes it to the LATEST_ANACONDA variable.

    cd ~/Downloads
    LATEST_ANACONDA=$(wget -O - https://www.anaconda.com/distribution/ 2>/dev/null | sed -ne 's@.*\(https:\/\/repo\.anaconda\.com\/archive\/Anaconda3-.*-Linux-x86_64\.sh\)\">64-Bit (x86) Installer.*@\1@p')
    wget $LATEST_ANACONDA
    chmod +x Anaconda3*.sh # make it executable
    ./Anaconda3*.sh # execute the installer

Follow the dialogue, and just agree on the defaults.

### Checking and switching the conda environments

If conda is installed correctly (might need a logout and login, or restart), you should be able to see the output when typing `conda` into your terminal.

To list the currently installed environments just type `conda env list`

It should currently just show the "base" environment installed.

Switching between environments works as simply as typing `conda activate [NAME]` and if done with it deactivating it (and going back to the base environment) with `conda deactivate`.

The base environment is activated by default.

# Install Jupyter Notebook / Lab in the base environment

Jupyter Notebook can easily be installed using conda. Our plan is to only install it in the base environment, and then just switch between sub-environments to avoid setting up Jupyter Lab in each environment. 

## Installing Jupyter Notebook (default)

    conda install -c conda-forge notebook
    conda install -c conda-forge nb_conda_kernels

## Installing Jupyter Lab

    conda install -c conda-forge jupyterlab
    conda install -c conda-forge nb_conda_kernels

## Installing Jupyter Notebook extensions

I really like Jupyter Notebook extensions, which support a lot of autocompletion, additional information, and in general things that make your life easier. A good default setting is included with the following install command:

    conda install -c conda-forge jupyter_contrib_nbextensions

A good overview over other extensions: [https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231](https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231 "https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231")

### (Optional) Installing pip package manager

In my opinion it is a good idea to add the pip package manager to the base (and each sub-) environment, as not all packages are supported by conda install. Also, if pip is not installed in each sub-environment the package might just be installed in the "base" conda environment, causing an error where the package is not found in your sub-environment. 

    conda install pip

# Creating environments in conda and Jupyter Notebook

Let us say you want to install both Tensorflow 2.0 and Tensorflow 1.15 in Jupyter Notebook. 

For this example first, agree if you want to use the GPU or CPU version of Tensorflow. For using the GPU version add "-gpu" to TensorFlow, and otherwise, just leave it as is.

To create a new conda environment we can run 

`conda create --name tf-2.0`

If you already plan to install some packages with it just add them to the end, like:

    conda create -n tf-2.0 tensorflow-gpu pip ipykernel

I recommend installing `pip` for package installation, and `ipykernel` will be needed to switch environments using Jupyter Notebook

To install an environment using TensorFlow 1.15 use the following:

    conda create -n tf-1.15 tensorflow-gpu==1.15 pip ipykernel

If done successfully, you should be able to see three environments when executing the following command:

    conda env list

1. base
2. tf-2.0
3. tf-1.15

# Start Jupyter Notebook and check the environments and extensions

    jupyter notebook

Running Jupyter Notebook in the base environment should allow you to see a tab containing "Extensions", as well as "conda"/"environments". Head over to Extensions and activate whichever extensions you like, and if you are ready, create a new notebook using the "new" button. Here, you should be able to choose between your base, tf-2.0 and tf-1.15 environment. 

Attention: You always need to run jupyter notebook in the base environment. Run `conda deactivate` to leave your current environment and return to the base one. 

If you need to install further packages activate an environment using `conda activate [NAME]`, run your commands like `conda install X` or `pip install X`, and leave the environment using `conda deactivate`. 

Let me know if this worked for you, it helped me a lot and I wished I would have known about this earlier!