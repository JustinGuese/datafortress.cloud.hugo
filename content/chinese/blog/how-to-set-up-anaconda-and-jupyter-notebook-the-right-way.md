---
author: 贾斯汀·古斯
bg_image: /images/jupyter.png
categories:
- 教程
date: '2022-01-24T23:00:00+00:00'
description: '如果 Anaconda (conda) 和 Jupyter Notebook (Jupyter Lab) 设置正确，它们可以组成完美的团队，让你轻松地在深度学习
  conda 环境之间切换。某些程序需要 TensorFlow 1.15，另一些需要 TensorFlow 2.0？没问题！只需点击一下即可切换环境和 TensorFlow
  版本。

  '
image: /images/jupyter.png
tags:
- deep learning
- tutorial
- anaconda
- jupyter notebook
title: 如何正确设置 Anaconda 和 Jupyter Notebook
type: post

---
如果正确地设置了 Anaconda (conda) 和 Jupyter Notebook (Jupyter Lab)，它们可以完美地协同工作，方便地在深度学习 conda 环境之间切换。

有些程序需要 TensorFlow 1.15，另一些需要 TensorFlow 2.0？没问题！只需点击一下即可切换环境和 TensorFlow 版本。

您是否曾经在每个 conda 环境中安装 Jupyter Notebook 扩展？现在不用担心了，我们将安装一次扩展，并在每个环境中使用它们！


1. 安装 Anaconda 或 Miniconda
2. 在基础环境中安装 Jupyter Notebook/Lab
3. 安装新的环境
4. 激活 Jupyter Notebook 的环境

# 如何安装 Anaconda 或 Miniconda？

Anaconda 包含许多 Python 包，并提供一个易于上手的 Python 环境。此外，它允许创建包含不同 Python 包版本的 Python 环境。例如，如果某个程序仅在 Python 2.7 或更早版本的 Matplotlib 下运行，您可以为此程序创建一个专属工作空间，并通过点击按钮切换回 Python 3。同样，在 TensorFlow 2.0 和 TensorFlow 1.15 之间切换也变得容易，最终能够轻松地切换版本（否则这可能会很麻烦）。

Miniconda 是 Anaconda 的精简版，如果您在磁盘空间有限的服务器上工作，它会很有用。

要安装 Anaconda 或 Miniconda，请访问其网站 ([https://www.anaconda.com/products/individual#Downloads](https://www.anaconda.com/products/individual#Downloads "https://www.anaconda.com/products/individual#Downloads"))，或者如果您使用的是 Linux，请复制以下命令。

第一个链接会抓取网站以获取最新版本，并将其写入 LATEST_ANACONDA 变量中。

```
cd ~/Downloads
LATEST_ANACONDA=$(wget -O - https://www.anaconda.com/distribution/ 2>/dev/null | sed -ne 's@.*\(https:\/\/repo\.anaconda\.com\/archive\/Anaconda3-.*-Linux-x86_64\.sh\)\">64-Bit (x86) Installer.*@\1@p')
wget $LATEST_ANACONDA
chmod +x Anaconda3*.sh # 使其可执行
./Anaconda3*.sh # 执行安装程序
```

按照对话框操作，并接受默认选项。

### 检查和切换 conda 环境

如果 conda 安装正确（可能需要注销并重新登录，或重新启动），则在终端中输入 `conda` 后应该可以看到输出。

要列出当前已安装的环境，请键入 `conda env list`

当前它应该只显示已安装的“base”环境。

在环境之间切换就像输入 `conda activate [名称]` 一样简单，使用 `conda deactivate` 完成后将其停用（并返回到基础环境）。

默认情况下，基础环境处于激活状态。

# 在基础环境中安装 Jupyter Notebook/Lab

可以使用 conda 轻松安装 Jupyter Notebook。我们的计划是仅在基础环境中安装它，然后只需在子环境之间切换即可避免在每个环境中设置 Jupyter Lab。


## 安装 Jupyter Notebook（默认）

```
conda install -c conda-forge notebook
conda install -c conda-forge nb_conda_kernels
```

## 安装 Jupyter Lab

```
conda install -c conda-forge jupyterlab
conda install -c conda-forge nb_conda_kernels
```

## 安装 Jupyter Notebook 扩展

我非常喜欢 Jupyter Notebook 扩展，它们支持许多自动完成、附加信息以及一般使您的生活更容易的功能。以下安装命令包含一个良好的默认设置：

```
conda install -c conda-forge jupyter_contrib_nbextensions
```

有关其他扩展的好概述：[https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231](https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231 "https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231")


### （可选）安装 pip 包管理器

我认为将 pip 包管理器添加到基础（和每个子）环境是一个好主意，因为并非所有包都支持 conda install。此外，如果每个子环境中都没有安装 pip，该包可能会只安装在“基础” conda 环境中，从而导致在您的子环境中找不到该包的错误。

```
conda install pip
```

# 在 conda 和 Jupyter Notebook 中创建环境

假设您想在 Jupyter Notebook 中安装 TensorFlow 2.0 和 TensorFlow 1.15。

在此示例中，首先，同意是否要使用 TensorFlow 的 GPU 或 CPU 版本。要使用 GPU 版本，请在 TensorFlow 后添加“-gpu”，否则，将其保持不变。

要创建新的 conda 环境，我们可以运行：

`conda create --name tf-2.0`

如果您已计划安装一些包，只需将它们添加到末尾，例如：

```
conda create -n tf-2.0 tensorflow-gpu pip ipykernel
```

建议安装 `pip` 用于包安装，`ipykernel` 将用于使用 Jupyter Notebook 切换环境

要安装使用 TensorFlow 1.15 的环境，请使用以下命令：

```
conda create -n tf-1.15 tensorflow-gpu==1.15 pip ipykernel
```

如果成功，执行以下命令时应该可以看到三个环境：

```
conda env list
```

1. base
2. tf-2.0
3. tf-1.15

# 启动 Jupyter Notebook 并检查环境和扩展

```
jupyter notebook
```

在基础环境中运行 Jupyter Notebook 应该允许您看到包含“扩展”以及“conda”/“环境”的选项卡。转到扩展并激活您喜欢的扩展，如果准备就绪，请使用“新建”按钮创建新的笔记本。在这里，您应该能够在您的基础环境、tf-2.0 和 tf-1.15 环境之间进行选择。

注意：您始终需要在基础环境中运行 jupyter notebook。运行 `conda deactivate` 以离开当前环境并返回基础环境。

如果您需要安装其他软件包，请使用 `conda activate [名称]` 激活环境，运行类似于 `conda install X` 或 `pip install X` 的命令，并使用 `conda deactivate` 离开环境。

请告诉我这是否对您有效，这对我帮助很大，我希望我早点知道！
