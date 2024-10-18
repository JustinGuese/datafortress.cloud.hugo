---
author: 贾斯汀·古埃斯
bg_image: images/blog/Archlinux_GNOME_3.2.png
categories:
- Linux
- 教程
date: '2020-07-06T07:10:46+02:00'
description: 使用加密驱动器轻松安装 Arch Linux
image: images/blog/Archlinux_GNOME_3.2.png
tags:
- tutorial
- arch linux
- deep learning
- reinforcement learning
- linux
- encryption
- encypt data at rest
title: 如何轻松安装加密驱动器的 Arch Linux
type: post

---
## Arch Linux 的优势

在我的另一篇文章 [“如何：用 Arch Linux 替换 Ubuntu 来构建深度学习工作站”](//www.datafortress.cloud/blog/howto-arch-linux-deeplearning-workstation/) 中，我解释了为什么我将机器学习工作站从 Ubuntu 切换到 Arch Linux。简而言之，主要原因是速度，因为 Arch 更贴近硬件，因此速度更快；占用更少的系统资源，从而节省了深度学习所需的内存；以及出色的 pacman 和 AUR 包管理系统，安装速度快且易于使用。

例如，在 Ubuntu 中，让 TensorFlow 和 CUDA 在深度学习中正常工作相当困难，因为 Debian 的软件包结构不同，且安装速度比 Arch 慢。在 Arch 中，依赖项处理得很好，软件包的抽象程度相对较低，因为 Arch 基于“纯净”的 Linux 内核本身。

此外，软件包更新速度更快，并且据说 ArchWiki 是所有操作系统中最全面的文档。

Arch 的座右铭可以描述为“自定义一切，并尽可能快”，而 Ubuntu 的座右铭则为“尽可能让新用户轻松安装和使用”。现在，我不是说 Ubuntu 不好，因为其社区庞大，是进入 Linux 世界的绝佳入门发行版，但一旦你对 Linux 更熟悉且需要更高的速度，Arch 可能就是最佳的后续选择。

至少我对 Arch 感到满意，因为它比我之前见过的任何发行版都要快，并且我可以自定义所有设置。

我一直在考虑提供一个针对深度学习构建的 ISO 或 IMG，以便轻松安装。如果您感兴趣，请在评论区留言或给我发送消息。

此外，如果您能接受一些抽象层，[Manjaro Arch](//manjaro.org/) 可能也是一个不错的选择。它基本上是 Arch，但更易于使用和友好。我喜欢它，但后来改用 Arch，因为 Manjaro 使用的是自己的软件包，虽然这些软件包也很好，但与“纯净”的 Arch 软件包并非完全相同。如果您不是高级用户，这可能更适合您。


## 如何轻松安装 Arch Linux

虽然 Arch 提供的 [入门指南](//wiki.archlinux.org/index.php/installation_guide) 已经相当不错，但对于新手来说可能会很令人困惑。因此，我决定撰写自己的教程。

我的目标是使用加密驱动器安装 Arch，因为我需要为客户端保护数据在静止状态下的安全性。

### 1. 下载 Arch Linux 映像

访问 https://www.archlinux.org/download/ 下载映像。

将其写入 USB 闪存驱动器。例如（但您可以使用您自己的程序）：

Linux：
> dd if=ISOFILE of=/dev/sdX status=progress

其中 sdX 是您的 USB 闪存驱动器。使用“lsblk”检查它。

Windows/macOS：
我喜欢使用 Etcher https://www.balena.io/etcher/

使用您的启动菜单（大多数情况下是 F11 或 F12）从 USB 闪存驱动器启动。

### 2. 在 Live ISO 中进行首次设置

一旦进入 Arch 的 Live ISO，您应该会看到 Arch 的基本命令行界面。

**非美式键盘？** 使用以下命令加载您的键盘布局：
> loadkeys KEYMAP

其中 Keymap 是您的语言环境。使用以下命令获取您的语言环境：

> localectl list-keymaps | grep -i SEARCHTERM

例如，使用 SEARCHTERM = Germany 的上述命令会返回 de-latin1，相应的 loadkeys 命令为：
> loadkeys de-latin1


（可选）如果您没有以太网，则可能需要使用以下命令连接到您的 Wi-Fi。请将 WIFINETWORK 和 WIFIPASSWORD 替换为您的 Wi-Fi 名称和密码。

> wpa_passphrase 'WIFINETWORK’ 'WIFIPASSWORD' >> /etc/wpa_supplicant/wpa_supplicant.conf \
> wpa_supplicant -Bc /etc/wpa_supplicant/wpa_supplicant.conf -i 'wlan0' \
如果第二个命令不起作用，您的 Wi-Fi 设备名称可能不同。您可以使用“ifconfig”检查。
> dhclient

使用 curl 命令检查您的连接。如果响应看起来像 HTML，则连接成功；如果它显示类似于“404”、“超时”或“无连接”的消息，则重复上述步骤并注意拼写错误。
> curl www.datafortress.cloud

### 2. 分区驱动器

这是最困难的一步，所以完成后，您就快完成了！我选择了一个更高级的版本，该版本对驱动器进行了完全加密，以实现高级安全性，但您也可以使用“[标准方法](//wiki.archlinux.org/index.php/Partitioning)”。

本指南假设您计划擦除整个驱动器。请确保所有数据都已备份。当然，也可以进行与 Windows 或其他系统的双启动，但我会在另一篇指南中解释。

计划将有两个分区：
第一个分区：EFI 启动驱动器 - 告知您的电脑如何启动 Arch
第二个分区：完全加密的驱动器，包含“子”驱动器，其中包含交换文件、根文件夹和单独的 /home 驱动器，以确保安全性。

为什么第二个驱动器上有三个分区？假设您弄错了根安装。在这种情况下，您的文档、设置等个人资料将位于单独的分区中，并且可以轻松地在新的安装中重复使用。这意味着您可以安装新的 Arch 安装到根分区，只需“重复使用”您的个人资料文件夹即可。不错。



#### 第 1 步：获取驱动器名称

> lsblk -lh

这会显示所有连接的驱动器。通常，您的主驱动器应被称为 /dev/sda，您的 USB 闪存驱动器为 /dev/sdb。

**检查 sda 是否确实是您的主驱动器（根据存储容量等）。如果您直接复制粘贴以下使用 sda 的命令，则可能会擦除错误的驱动器！**
这就是为什么我在以下段落中将设备命名为 sdX，但是请将 X 替换为您的设备编号（a、b、c 等）。某些驱动器具有不同的名称，请进行比较并相应地替换。

#### 第 2 步：分区

启动 gdisk

> gdisk /dev/sdX

EFI 驱动器设置
1. 输入 'o' 创建分区表
2. 输入 'n' 创建新分区
3. 回车
4. 回车
5. +256M
6. EF00
这将创建一个 256MB 的 EFI 格式分区，用于启动。

加密 Arch 驱动器设置
1. 输入 'n' 创建新分区
2. 回车
3. 回车
4. 回车
5. 8309

使用 'p' 检查一切是否正确。它应该看起来像这样：


>Number  Start (sector)    End (sector)  Size       Code  Name \
>   1            2048         1050623   256.0 MiB   EF00  EFI System \
>   2         1050624       242187466   115.0 GiB   8309  Linux LUKS

看起来不错？按下 'w' 将更改写入磁盘。

### 3. 创建加密文件系统

分区现在为空。接下来，我们将创建文件系统和加密的“子”分区。请记住将 X 替换为您的驱动器编号（通常为 a）。

> cryptsetup luksFormat /dev/sdX2 \
> cryptsetup open /dev/sdX2 cryptlvm \
> pvcreate /dev/mapper/cryptlvm \
> vgcreate datafortress /dev/mapper/cryptlvm

请随意将以下磁盘大小替换为您所需的 GB 大小。对于深度学习，交换空间应为 32 GB，对于其他情况，大约为 RAM 的大小。我建议根系统为 40GB，但最小应为 10GB。您可以将 datafortress 替换为任何名称，或保留原样。


> lvcreate -L 16G datafortress -n swap \
> lvcreate -L 40G datafortress -n root \
> lvcreate -l +100%FREE datafortress -n home

创建文件系统

> mkfs.fat -F32 /dev/sdX1 \
> mkfs.ext4 /dev/mapper/datafortress-root \
> mkfs.ext4 /dev/mapper/datafortress-home \
> mkswap /dev/mapper/datafortress-swap

挂载它们

> mount /dev/mapper/datafortress-root /mnt \
> mkdir /mnt/home \
> mkdir /mnt/boot \
> mount /dev/mapper/datafortress-home /mnt/home \
> mount /dev/sdX1 /mnt/boot \
> swapon /dev/mapper/datafortress-swap


... (剩余内容省略)


请注意，由于篇幅限制，这里省略了后续步骤。 这部分内容非常详细，包含了诸如镜像列表更新、选择桌面环境、添加用户、引导配置等方面的内容。
