---
author: 贾斯汀·格斯
bg_image: images/index2-1-1280x720.webp
categories:
- 计算机视觉
- 大数据
- 机器学习
date: '2022-06-08T07:10:46+02:00'
description: 使用 MTCNN 进行人脸检测——人脸提取的快速指南
image: images/index2-1-1280x720.webp
tags:
- Face Detection
- Neuronal Networks
- MTCNN
- Big Data
- Machine Learning
title: 使用 MTCNN 进行人脸检测
type: post

---
MTCNN 是一种由 [Github 用户 ipacz](https://github.com/ipazc/mtcnn) 编写的 Python (pip) 库，它实现了论文 [Zhang, Kaipeng 等人，“使用多任务级联卷积网络的联合人脸检测和对齐”。IEEE 信号处理快讯 23.10 (2016): 1499–1503。Crossref. Web](https://arxiv.org/abs/1604.02878)。

本文中，他们提出了一种深度级联多任务框架，利用不同“子模型”的特征来增强它们的相关性。

尽管 S3FD 在 GPU 上运行仍然更快，但 MTCNN 在 CPU 上运行速度相当快——但这将是另一个主题。

本文使用了以下两个来源的代码，请查看它们，它们也很有趣：

* [https://machinelearningmastery.com/how-to-perform-face-detection-with-classical-and-deep-learning-methods-in-python-with-keras/](https://machinelearningmastery.com/how-to-perform-face-detection-with-classical-and-deep-learning-methods-in-python-with-keras/)
* [https://www.kaggle.com/timesler/fast-mtcnn-detector-55-fps-at-full-resolution](https://www.kaggle.com/timesler/fast-mtcnn-detector-55-fps-at-full-resolution)

<br>

# MTCNN 基本用法

<br>

您可以访问以下链接获取完整的笔记本：

[https://github.com/JustinGuese/mtcnn-face-extraction-eyes-mouth-nose-and-speeding-it-up](https://github.com/JustinGuese/mtcnn-face-extraction-eyes-mouth-nose-and-speeding-it-up)

```
git clone https://github.com/JustinGuese/mtcnn-face-extraction-eyes-mouth-nose-and-speeding-it-up
```

幸运的是，MTCNN 可作为 pip 包使用，这意味着我们可以轻松地使用以下命令安装它：

```
pip install mtcnn
```

现在，切换到 Python/Jupyter Notebook，我们可以通过导入并进行快速验证来检查安装：

```python
import mtcnn
# 打印版本
print(mtcnn.__version__)
```

之后，我们就可以使用 matplotlib 的 [imread 函数](https://bit.ly/2vo3INw) 加载测试图像。

```python
import matplotlib.pyplot as plt
# 从文件中加载图像
filename = "glediston-bastos-ZtmmR9D_2tA-unsplash.webp"
pixels = plt.imread(filename)
print("图像/数组形状：", pixels.shape)
imgplot = plt.imshow(pixels)
plt.show()
```

现在您的输出将如下所示：

```
{'box': [1942, 716, 334, 415], 'confidence': 0.9999997615814209, 'keypoints': {'左眼': (2053, 901), '右眼': (2205, 897), '鼻子': (2139, 976), '嘴巴左': (2058, 1029), '嘴巴右': (2206, 1023)}}
{'box': [2084, 396, 37, 46], 'confidence': 0.9999206066131592, 'keypoints': {'左眼': (2094, 414), '右眼': (2112, 414), '鼻子': (2102, 426), '嘴巴左': (2095, 432), '嘴巴右': (2112, 431)}}
{'box': [1980, 381, 44, 59], 'confidence': 0.9998701810836792, 'keypoints': {'左眼': (1997, 404), '右眼': (2019, 407), '鼻子': (2010, 417), '嘴巴左': (1995, 425), '嘴巴右': (2015, 427)}}
{'box': [2039, 395, 39, 46], 'confidence': 0.9993435740470886, 'keypoints': {'左眼': (2054, 409), '右眼': (2071, 415), '鼻子': (2058, 422), '嘴巴左': (2048, 425), '嘴巴右': (2065, 431)}}
```

这告诉我们很多，大部分是显而易见的，但它基本上返回坐标，或 MTCNN 算法检测到人脸的矩形的像素值。“box”值以上返回整个人脸的位置，后跟“置信度”级别。

如果您想进行更高级的提取或算法，您还可以访问其他面部标志，称为“关键点”。特别是，MTCNN 模型还定位了眼睛、嘴巴和鼻子！

<br>

## 在人脸上绘制方框

<br>

为了更好地演示这一点，让我们使用 matplotlib 在人脸上绘制一个方框：

```python
# 描绘带有检测对象的图像
def draw_facebox(filename, result_list):
    # 加载图像
    data = plt.imread(filename)
    # 绘制图像
    plt.imshow(data)
    # 获取绘制方框的上下文
    ax = plt.gca()
    # 绘制每个方框
    for result in result_list:
    # 获取坐标
        x, y, width, height = result['box']
    # 创建形状
        rect = plt.Rectangle((x, y), width, height, fill=False, color='green')
    # 绘制方框
        ax.add_patch(rect)
    # 显示绘图
    plt.show()

    # filename = 'test1.webp' # filename 定义在上面，否则取消注释
    # 加载图像
    # pixels = plt.imread(filename) # 定义在上面，否则取消注释
    # detector 定义在上面，否则取消注释
    #detector = mtcnn.MTCNN()
    # 检测图像中的人脸
    faces = detector.detect_faces(pixels)
    # 在原始图像上显示人脸
    draw_facebox(filename, faces)
```

![](/images/index-1-150x150.webp)

<br>

## 显示人脸上眼睛、嘴巴和鼻子周围

<br>

现在让我们看看 MTCNN 模型返回的上述“关键点”。

我们将使用这些来绘制鼻子、嘴巴和眼睛。我们将向上面的代码添加以下代码片段：

```python
# 绘制点
for key, value in result['keypoints'].items():
    # 创建并绘制点
    dot = plt.Circle(value, radius=20, color='orange')
    ax.add_patch(dot)
```

完整的代码如下：


```python
# 描绘带有检测对象的图像
def draw_facebox(filename, result_list):
    # 加载图像
    data = plt.imread(filename)
    # 绘制图像
    plt.imshow(data)
    # 获取绘制方框的上下文
    ax = plt.gca()
    # 绘制每个方框
    for result in result_list:
    # 获取坐标
        x, y, width, height = result['box']
    # 创建形状
        rect = plt.Rectangle((x, y), width, height, fill=False, color='orange')
    # 绘制方框
        ax.add_patch(rect)
    # 绘制点
        for key, value in result['keypoints'].items():
        # 创建并绘制点
            dot = plt.Circle(value, radius=20, color='red')
            ax.add_patch(dot)
    # 显示绘图
    plt.show()

    # filename = 'test1.webp' # filename 定义在上面，否则取消注释
    # 加载图像
    # pixels = plt.imread(filename) # 定义在上面，否则取消注释
    # detector 定义在上面，否则取消注释
    #detector = mtcnn.MTCNN()
    # 检测图像中的人脸
    faces = detector.detect_faces(pixels)
    # 在原始图像上显示人脸
    draw_facebox(filename, faces)
```

![](/images/index2-150x150.webp)

<br>

## 高级 MTCNN：加速（~x100）！

<br>

现在让我们进入有趣的部分。如果您要处理数百万张图片，则需要加速 MTCNN，否则，您要么会睡着，要么您的 CPU 会在完成之前烧坏。

我们到底在谈论什么？如果您正在运行上面的代码，它将花费大约一秒钟，这意味着我们将每秒处理大约一张图片。如果您在 GPU 上运行 MTCNN 并使用加速版本，它将达到每秒 60-100 张图片/帧的速度。这是一个高达 **100 倍** 的提升！

例如，如果您要从电影中提取所有面部，其中您每秒提取 10 个面部（电影的每一秒平均大约有 24 帧，所以每隔一帧），它将是 10 * 60（秒）* 120（分钟）= 72,000 帧。

这意味着如果处理一帧需要一秒钟，它将花费 72,000 * 1（秒）= 72,000 秒 / 60 秒 = 1,200 分钟 = **20 小时**

使用加速版 MTCNN，这项任务将需要 72,000（帧）/ 100（帧/秒）= 720 秒 = **12 分钟**！

要在 GPU 上使用 MTCNN，您需要设置 CUDA、cuDNN、PyTorch 等。[PyTorch 编写了一个关于该部分的良好教程](https://pytorch.org/get-started/locally/)。

安装完成后，我们将执行必要的导入，如下所示：

```python
from facenet_pytorch import MTCNN
from PIL import Image
import torch
from imutils.video import FileVideoStream
import cv2
import time
import glob
from tqdm.notebook import tqdm

device = 'cuda' if torch.cuda.is_available() else 'cpu'

filenames = ["glediston-bastos-ZtmmR9D_2tA-unsplash.webp","glediston-bastos-ZtmmR9D_2tA-unsplash.webp"]

# ... (其他代码)
```

您如何在代码中定义设备？如果您不想或无法设置 CUDA，您也可以在 CPU 上运行所有内容。

接下来，我们将定义提取器：

```python
# 定义我们的提取器
fast_mtcnn = FastMTCNN(
stride=4,
resize=0.5,
margin=14,
factor=0.6,
keep_all=True,
device=device
)
```

在此片段中，我们传递了一些参数，例如，我们只使用图像大小的一半，这是加速的主要影响因素之一。

最后，让我们运行人脸提取脚本：

```python
# ... (其他代码)
```

(图片输出省略)


上述图像显示了在 NVIDIA Tesla P100 上运行代码的输出，因此，根据源材料、GPU 和处理器，您可能会体验到更好的或更差的性能。

<br>

[您正在进行类似的项目？您对类似的东西感兴趣？[现在联系我们](/contact) 进行免费的 15 分钟咨询。](/contact/)
