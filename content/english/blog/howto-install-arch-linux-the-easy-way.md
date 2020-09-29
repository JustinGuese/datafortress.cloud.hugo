---
title: How To - Installing Arch Linux the easy way with encrypted drives
bg_image: "/images/blog/Archlinux_GNOME_3.2.png"
date: 2020-09-29T07:10:46+02:00
author: Justin Guese
description: Installing Arch Linux the easy way with encrypted drives
image: "/images/blog/Archlinux_GNOME_3.2.png"
categories:
- linux
- tutorial
tags:
- tutorial
- arch linux
- deep learning
- reinforcement learning
- linux
- encryption
- encypt data at rest
type: post

---
# Installing Arch Linux the easy way with encrypted drives for Deep Learning

## The benefits of Arch Linux

In my other post, [“How To: Ditching Ubuntu in favor of Arch Linux for a Deep Learning Workstation”](//www.datafortress.cloud/blog/howto-arch-linux-deeplearning-workstation/), I have been explaining why I switched from Ubuntu to Arch Linux for my Machine Learning workstation. Summarized it is mostly because of speed, because Arch is way closer to the hardware and therefore way faster, less bloatware and therefore less RAM usage which I need to machine learning, and the amazing pacman and AUR packages which are fast and easy to install.

In Ubuntu, for example, it is quite hard to get TensorFlow and CUDA working for Deep Learning, as the Debian package structure is different and the installation slower compared to Arch. In Arch, dependencies are handled nicely, and packages are not that abstracted as Arch is basically the “pure” Linux kernel itself.

Additionally packages are coming out way faster, and the ArchWiki is said to be the most extensive documentation there is for an operating system. 

The motto of Arch can be described as “Customize everything, and be as fast as possible”, whilst Ubuntu’s motto would be “Make the installation and usage as easy as possible for new users”. Now, I am not saying that Ubuntu is bad, because the community is huge, and it is the perfect Distro to start your journey into the world of Linux, but once you are more used to Linux and need more speed, Arch might be the best next step.

I am at least happy with Arch, as it is way faster than everything I have seen before, and I can customize everything. 

I have been thinking about providing an iso or img for my Deep Learning build for an easy install. If you are interested please comment or send me a message. 

Additionally, if you are fine with a slight abstraction layer [Manjaro Arch](//https://manjaro.org/) might be a good choice for you. It is basically Arch, but made easy and user-friendly. I loved it, but moved to Arch as Manjaro uses their own packages, which are still good, but not the same as the “pure” Arch packages. If you are not a power-user this might be the choice for you. 

## How to Install Arch Linux the easy way

Whilst the [introductory guide](//https://wiki.archlinux.org/index.php/installation_guide) provided by arch is quite good already, it can be confusing for newcomers. That is why I have decided to write my own tutorial. 

My goal has been to install Arch with encrypted drives, as I need to secure the data at rest for my clients. 

### 1. Downloading the Arch Linux Image

Head over to https://www.archlinux.org/download/ and download the image. 

Write it to an USB stick. E.g. (but you can use your own program) for:

Linux:
> dd if=ISOFILE of=/dev/sdX status=progress
 
Where the sdX is your usb stick. Check it with “lsblk”

Windows / Mac:
I liked to use Etcher https://www.balena.io/etcher/

Boot into the USB stick using your Boot menu (F11, F12 in most cases)

### 2. First setup in Live ISO

Once you are in the Live ISO of Arch, you should see the basic command line of Arch. 

**Not an US keyboard**? Load your keys with:
> loadkeys KEYMAP 

Where Keymap is your locale. Get your locale with

> localectl list-keymaps | grep -i SEARCHTERM

E.g. using the above command with SEARCHTERM = Germany returns de-latin1, for which the loadkeys command is:
> loadkeys de-latin1


(Optional) If you do not have ethernet you might have to connect to your wifi with the following commands. Replace WIFINETWORK and WIFIPASSWORD with your wifi name and password.

> wpa_passphrase 'WIFINETWORK’ 'WIFIPASSWORD' >> /etc/wpa_supplicant/wpa_supplicant.conf \
> wpa_supplicant -Bc /etc/wpa_supplicant/wpa_supplicant.conf -i 'wlan0' \
If the second command does not work your wifi device name might be different. You can check it with “ifconfig”
> dhclient

Check your connection with curling a website. If the response looks like HTML you are connected, if it says something along the lines of “404”, “timed out” or “no connection” repeat the above steps and watch for typos. 
> curl www.datafortress.cloud

### 2. Partitioning the drives

This is the most difficult step, so once you are done with it you are almost done! I chose the more advanced version where the drive is completely encrypted for advanced security, but feel free to use the “[standard method](//https://wiki.archlinux.org/index.php/Partitioning)” instead. 

This guide will assume you are planning to wipe your whole drive. So be sure that all data is backed up. Of course, a dual-boot with windows or so is possible as well, but I will explain that in another guide.

The plan is to have two partitions:
First partition: EFI boot drive - which tells your PC how to boot into Arch
Second partition: Completely encrypted drive with “sub”-drives containing the swap file, the root folder and a separate /home drive for security. 
Why three partitions on the second drive? Let’s say you mess up your root installation. In that case your home folder with your documents, settings and so on will be on a separate partition and can easily be reused in a new install. Meaning you could install a fresh new Arch install in the root partition, and just “reuse” your home folder. Nice. 

#### Step 1: Get the name of your Drive

> lbslk -lh

 This shows you all connected drives. Usually your main drive should be called /dev/sda and your USB stick /dev/sdb. 

**Check if sda is really your main drive according to the GB storage capacity and everything. If you simply copy and paste the following commands with sda you might wipe the wrong drive!!**
That is why I will name the device sdX in the following paragraphs, but replace the X with your device number (a,b,c, …). Some drives are having different names, just compare and replace accordingly. 

#### Step 2: Partition

Start gdisk

> gdisk /dev/sdX

Boot EFI Drive Setup
1. Type ‘o’ to create a partition table
2. Type ‘n’ for a new partition
3. Enter
4. Enter
5. +256M
6. EF00
This will create a 256 mb partition with the EFI format that we need for booting

Encrypted Arch Drive setup
1. Type ‘n’ to create a new partition
2. Enter
3. Enter
4. Enter
5. 8309

Check if everything looks right with pressing ‘p’. It should look like this:

>Number  Start (sector)    End (sector)  Size       Code  Name \
>   1            2048         1050623   256.0 MiB   EF00  EFI System \
>   2         1050624       242187466   115.0 GiB   8309  Linux LUKS

Looks good? Press ‘w’ to write changes to disk. 

### 3. Create the encrypted filesystems

The partitions are empty right now. Next we will create the filesystems and encrypted “sub”-partitions. Remember to replace the X with your drive number (usually a).

> cryptsetup luksFormat /dev/sdX2 \
> cryptsetup open /dev/sdX2 cryptlvm \
> pvcreate /dev/mapper/cryptlvm \
> vgcreate datafortress /dev/mapper/cryptlvm

Feel free to replace the following disk sizes in front of the “G” for Gigabyte with your desired size. For Deep Learning Swap should be 32 Gb, for other cases around the size of your RAM. I recommend the root system to be 40Gb, but the minimum should be 10Gb. 
You can replace datafortress with anything, or leave it as is to be the cool kid in town. 

> lvcreate -L 16G datafortress -n swap \
> lvcreate -L 40G datafortress -n root \
> lvcreate -l +100%FREE datafortress -n home

Create filesystems

> mkfs.vat -F32 /dev/sdX1 \
> mkfs.ext4 /dev/mapper/datafortress-root \
> mkfs.ext4 /dev/mapper/datafortress-home \
> mkswap /dev/mapper/datafortress-swap

Mount them

> mount /dev/mapper/datafortress-root /mnt \
> mkdir /mnt/home \
> mkdir /mnt/boot \
> mount /dev/mapper/datafortress-home /mnt/home \
> mount /dev/sdX1 /mnt/boot \
> swapon /dev/mapper/datafortress-swap

### 4. Install base Linux

Before installing it is recommended to update your mirrorlist such that packages are downloaded from the closest mirrors. [Head over to my other article and search for “reflector” for an instruction on how to do that](//www.datafortress.cloud/blog/howto-arch-linux-deeplearning-workstation/). 

> pacstrap /mnt base base-devel linux linux-firmware nano

### 5. Install Fstab 

Fstab is basically an instruction how to mount your drives. Just copy paste it for now.

> genfstab -U /mnt >> /mnt/etc/fstab

### 6. Last polishing touches 

We are going to chroot into our mount, which is basically like running sudo in our system.

> arch-chroot /mnt \
> ln -s /usr/share/zoneinfo/REGION/CITY /etc/localtime 

Where Region is your region (just use tab to see the options if you types the /usr/…./zoneinfo/, like Europe, and CITY your city, like Vienna.

> hwclock --systohc

Set your hostname. The funny part when installing Arch is you get to do things Ubuntu and others do for you. Set the hostname for your device, e.g. if you are going to ssh into your device later you do not have to type an IP, but can use this name instead. E.g. “ssh user@hunneybunney” could be way nicer to remember than 192.168.0.231.

> echo NAME > /etc/hostname

Next we are setting our locale, basically the system language. Open the file in nano and search for your language code. Use the UTF-8 version if possible. Searching with nano is possible using Strg + W. [Nano tutorial](//https://www.howtogeek.com/howto/42980/the-beginners-guide-to-nano-the-linux-command-line-text-editor/). 
E.g. I wanted to have German and English (US), that is why I uncommented en_US.UTF-8 UTF-8  and de_DE.UTF-8 UTF-8  
> nano /etc/locale.gen

Generate locales
> locale-gen

(Optional) Now if you are using a non-US Keyboard add your keymap:

> echo KEYMAP > /etc/vconsole.conf

Use the Keymap from the beginning, like de-latin1

Next install some software. If you already know pacman packages you want to install, do it now. I recommend just using the minimum first and then continue installation of packages if everything works fine. 

**Minimum**
> pacman -Syu \
> pacman -S wpa_supplicant dhclient lvm2 dialog

**Installing a desktop environment**
Feel free to install a desktop environment already, which allows you to have a GUI of everything. 

Install a display manager 
> pacman -S lightdm

Now the benefits of Arch are choosing your own Desktop environment. For the looks choose Gnome, but it will be RAM hungry, for efficiency choose Xfce. 

**Only install ONE of the following**

To install GNOME:

> pacman -S gnome gnome-extra

To install Cinnamon:

> pacman -S cinnamon nemo-fileroller

To install XFCE:

> pacman -S xfce4 xfce4-goodies

To install KDE:

>pacman -S plasma

To install MATE:

> pacman -S mate mate-extra

### 7. Adding users

I recommend using different passwords for the root and default user. 

> useradd -m -G wheel ‘USERNAME’ \
> passwd ‘USERNAME’

Create a password for the root user

> passwd 

You will login with your default user. If you need to do administrative stuff you can switch users with “su - root” 

### 8. Boot configuration

Now there are a lot of boot managers, but I liked the systemd-boot loader the most. [Feel free to choose another one](//https://wiki.archlinux.org/index.php/Category:Boot_loaders). 

> nano /etc/mkinitcpio.conf 

Search for the HOOKS line and edit it accordingly. Order matters!

> HOOKS=(base udev autodetect keyboard keymap consolefont modconf block encrypt lvm2 filesystems resume fsck)

Close and Save the file (Strg + X, y)

> mkinitcpio -p linux \
> bootctl install 

Edit your boot entries

You will need the partition id of the encrypted drive. Usually this will be /dev/sda2, but can be different. It will not be the first 256mb drive, as this is the boot partition. 

Check for the name and note it down, most likely it is /dev/sda2

> lsblk -lh

Then look for the UUID string in the output of following command at the device id /dev/sdX2

> blkid 

You can try the same command with a filter as well:

> blkid | grep UUID=

Example UUID: 727cac18-044b-4504-87f1-a5aefa774bda


> nano /boot/loader/entries/arch.conf
Add the following:

>title	ArchLinux \
>linux	/vmlinuz-linux \
>initrd	/initramfs-linux.img \
>options cryptdevice=UUID=<YOUR-PARTITION-UUID>:lvm:allow-discards resume=/dev/mapper/datafortress-swap root=/dev/mapper/datafortress-root rw quiet

Remember to replace datafortress with the id you chose if you changed it. Otherwise leave as is.

### 9. Locking up

DONE! Now reboot, remove the USB stick and hope everything worked.

> exit \
> umount -R /mnt \
> reboot

**[I recommend setting up LTS kernels, as they are more stable, and update the mirrorlist. Check my guide on “creating an Arch Linux Deep Learning station” for more information on how to do that](//www.datafortress.cloud/blog/howto-arch-linux-deeplearning-workstation/).**

