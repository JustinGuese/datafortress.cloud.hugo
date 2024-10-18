---
author: 贾斯汀·格斯
categories:
- 大数据
- 教程
date: '2020-08-18T10:07:21+06:00'
description: 放弃Ubuntu转而使用Arch Linux构建深度学习工作站
image: images/blog/deeplearningarch.png
tags:
- big data
- tutorial
- arch linux
- deep learning
- reinforcement learning
- tensorflow
- machine learning
title: 如何 - 从Ubuntu迁移到Arch Linux构建深度学习工作站

---
# 为什么应该放弃 Ubuntu？

许多人可能都在使用 Ubuntu 作为他们的工作站，对于经验不足的用户来说，这很好。但我使用 Ubuntu 和 TensorFlow/CUDA 时遇到一个问题，那就是处理各种 CUDA、cuDNN、TensorFlow 的不同驱动程序和版本非常麻烦。我不确定你是否也这样，但一旦我建立了一个工作的 TensorFlow 1.15 或 2.0 环境，我通常就不再碰它了，因为害怕搞乱这个神圣的配置。

在使用不同的程序时，能够像在 Google Colab 中那样，通过一条命令在两种最常用的 TensorFlow 版本（1.15 和 2.0）之间切换，将会非常方便，但是安装不同的 TensorFlow 版本通常还会再次弄乱我的系统。

此外，Arch 一直都在我的待办事项列表中，因为它是最“基础”的 Linux 发行版，这意味着与像 Ubuntu 这样的“更高层抽象”相比，你更接近硬件。用他们自己的话说，Ubuntu 的目标是“开箱即用，尽可能地让新用户简化安装过程”，而 Arch Linux 的座右铭是“自定义一切”。
由于更接近硬件，与 Ubuntu（以及 Windows）相比，Arch 的速度要快得多，代价是需要更多地使用终端。

在过去的几周里，我使用 Arch 时，内存使用量通常比 Ubuntu 少一半，安装机器学习软件包轻松无比。我可以让 TensorFlow 1.15 和 2.0 协同工作，并通过 Anaconda 环境在它们之间切换。此外，该系统工作非常稳定，因为我使用的是 Linux 的 LTS（长期支持）内核，而且通常 Arch 中的 AUR（用户创建的软件包）更新比 Debian（Ubuntu）软件包提前一个月。

总而言之，我强烈建议你搭建一个 Arch Linux 深度学习工作站，因为它：
1. 速度更快，例如软件包安装速度超快，深度学习性能超强，……
2. 更稳定
3. 更容易在 TensorFlow 版本之间切换
与 Ubuntu 相比。


我将把安装指南分成两部分：第一部分是“如何安装 Arch Linux”，第二部分是“如何在 Arch Linux 上安装深度学习工作站软件包”。

对于一般性的“[如何安装 Arch Linux”，请访问这篇文章](//www.datafortress.cloud/blog/howto-install-arch-linux-the-easy-way/)。

如果 Arch 现在对你来说过于复杂，你可以尝试 [Manjaro](//manjaro.org/)，它是一个易于使用的 Arch 版本，尽管我无法保证所有软件包都能以相同的方式工作，因为它们略有不同。不过，总体来说，它们应该以相同的方式工作。

我想创建一个可直接安装的镜像 (iso 或 img)，如果足够多的人感兴趣，请在下方评论或给我发送消息！


## 在全新的 Arch Linux 安装上安装深度学习 (TensorFlow、CUDA、cuDNN、Anaconda) 环境
一旦你[完成了 Arch 的安装 (呼!) ](//www.datafortress.cloud/blog/howto-install-arch-linux-the-easy-way/)，让我们首先更改一些设置，使我们的系统运行得更稳定。

### 1. 切换到最快的镜像

软件从所谓的“镜像”服务器下载，这些服务器包含所有 Arch 库。如果没有自动完成，可能会发生你的服务器还未优化的情况。因此，我们将安装一个名为“reflector”的小型工具来查找和保存最快的服务器。

使用以下命令安装 reflector：

> sudo pacman -S reflector

查找并下载最佳服务器：

> reflector --verbose -l 20 -n 20 --sort rate --save /etc/pacman.d/mirrorlist

检查输出是否合理，例如，服务器域名是否靠近你的位置。如果不是，你可以添加国家标签来获得更精确的结果，例如对于德国和奥地利：

> reflector -c “AT,DE” --verbose -l 20 -n 20 --sort rate --save /etc/pacman.d/mirrorlist

更新你的安装：

> sudo pacman -Syyu


### 2. 更改桌面环境

如果你使用的是 Manjaro 或选择你熟悉的“GNOME”桌面环境，你可能值得考虑更改它，因为 GNOME 据悉比 Chrome 占用更多的内存，而我们确实需要深度学习配置中有足够的内存。

如果你喜欢 GNOME，可以跳过此步骤。否则，我推荐 Xfce 桌面环境，因为它结合了轻量级和功能齐全的优点。

下载 Xfce：

> sudo pacman -S xfce4 xfce4-goodies lxdm

Lxdm 是一个显示管理器，允许你使用多个桌面。

注销当前会话，然后按 Alt + F2（或如果不起作用，则按 Alt + F3）打开一个终端。首先禁用 GNOME，然后“激活”Xfce：

禁用并卸载 GNOME：

> sudo systemctl disable gdm
> sudo pacman -R gnome gnome-extras


激活 Xfce：

> sudo systemctl enable lxdm
> sudo systemctl start lxdm

如果新的 Xfce 桌面并未打开，请登录并探索，如果不行，请尝试重新启动 (sudo reboot)。如果这也不起作用，请继续尝试，并在之后给我发消息或留言。


### 3. 安装 LTS（长期支持）Linux 内核以提高稳定性

Arch 以非常接近当前 Linux 内核而闻名，如果你总是想要最新的软件包和 Linux 功能，这很好，但是如果你正在构建深度学习工作站，这可能不是一个好主意。

因此，我切换到了 LTS 内核，这些内核实际上获得了更多支持，并且比 Linux 内核的较新版本更稳定。

幸运的是，在 Arch 中切换内核非常容易。首先我们将下载内核，然后告诉我们的引导管理器选择哪个内核。

首先下载 LTS 内核：

> sudo pacman -S linux-lts linux-lts-headers

查看当前内核版本：

> ls -lsha /boot

一个内核应该命名为 vmlinuz-linux.img 和 initramfs-linux.img（你的当前版本），LTS 内核命名相同，并在其后加上 -lts。

如果你看到两个内核，现在你可以继续删除旧的内核：

> sudo pacman -R linux


现在更高级的部分是，你需要告诉你的引导加载程序选择哪个内核。问题是你要使用哪个引导加载程序，但在大多数情况下是 Grub。如果你遵循了我的 Arch 安装教程，你的引导加载程序是 systemd-boot。

我的建议是尝试 Grub 指令，如果不行，请继续尝试其他引导加载程序。


#### 更改 Grub 引导加载程序以使用 LTS Linux 内核

> grub-mkconfig -o /boot/grub/grub.cfg


如果出现错误，继续使用下一个引导加载程序。否则，重新启动 (sudo reboot)。


#### 更改 syslinux 引导加载程序以使用 LTS Linux 内核

编辑配置文件：

> sudo nano /boot/syslinux/syslinux.cfg

只需将 vmlinuz-linux.img 和 initramfs-linux.img 添加为 vmlinuz-linux-lts.img 和 initramfs-linux-lts.img。


#### 更改 systemd-boot 引导加载程序以使用 LTS Linux 内核

如果你来自我的 Arch 安装指南，这就是你的引导加载程序。

编辑配置文件：

> sudo nano /boot/loader/entries/arch.conf

只需将 vmlinuz-linux.img 和 initramfs-linux.img 添加为 vmlinuz-linux-lts.img 和 initramfs-linux-lts.img。


### 4. 安装 yay，一种便捷的 AUR 软件包安装方式

你应该优先使用超快的 pacman 安装大多数软件包，但是 Arch 的一个惊人之处在于用户创建了数百万个自定义软件包，安装起来非常容易。你基本上可以在该资源库中找到任何你能想到的程序。

安装 git SVC：

```
sudo pacman -S git
mkdir ~/tmp
git clone https://aur.archlinux.org/yay-git.git ~/tmp/yay
cd ~/tmp/yay
makepkg -si
```

现在，你可以浏览 https://aur.archlinux.org/packages/ 中的所有优秀的 AUR 软件包，或者直接输入：

> yay -S [软件包名称]

来安装它。


### 5. 最后，在同一个设备上运行 TensorFlow 1.15 和 2.0 的真正的 CUDA、cuDNN 和 Anaconda 安装

使用一条简单的命令安装 Nvidia 驱动程序、CUDA 和 cuDNN：

> sudo pacman -S nvidia nvidia-utils cuda cudnn

这需要一些时间，所以喝杯咖啡或继续下一步。

下载 Anaconda，我喜欢 Miniconda：

> wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh ~/
> cd ~/
> chmod +x ./Miniconda*.sh
> ./Miniconda*.sh

保持所有默认设置。

> source ./bash_profile

重新启动你的系统：

> sudo reboot

安装 TensorFlow

现在是时候选择用于 CPU 或 GPU 的 TensorFlow 了。我将继续使用 GPU 选项，但如果你想运行 CPU 版本，只需从软件包名称中删除“-gpu”即可。

##### 为 TensorFlow 2.0 创建 Anaconda 环境

```
conda create --name tf2.0
conda activate tf2.0
conda install pip
conda install tensorflow-gpu pandas numpy
```

大功告成！现在使用以下命令检查结果：

```
python
from tensorflow.python.client import device_lib
device_lib.list_local_devices()
```

如果结果显示类似这样的设备名称，那么你已经完成了！

2018-05-01 05:25:25.929575: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1356] Found device 0 with properties:
name: GeForce GTX 3080 10GB major: …

##### 为 TensorFlow 1.15 创建 Anaconda 环境

```
conda deactivate
conda create --name tf1.15
conda activate tf1.15
conda install pip python==3.7
conda install tensorflow-gpu==1.15
```

再次检查一切是否正常运行，你的 GPU 是否被识别：

```
python
from tensorflow.python.client import device_lib
device_lib.list_local_devices()
```


### 6. 在一个设备上切换 TensorFlow 1.15 和 TensorFlow 2.0!

在我看来，这简直是梦想成真，只需使用以下命令选择 1.15 版本：
> conda activate tf1.15

并使用以下命令选择 TensorFlow 2.0 版本：
> conda activate tf2.0
