---
author: 贾斯汀·格斯
bg_image: /images/serverless-investing-bot-facebook-prophet-machine-learning.png
categories:
- 算法交易
- aws
- 无服务器
- 机器学习
date: '2022-05-23T22:00:00+00:00'
description: 如何使用 Facebook Prophet 机器学习模型在 AWS Lambda (无服务器) 部署自动交易机器人
image: /images/serverless-investing-bot-facebook-prophet-machine-learning-1.png
tags:
- cloud-computing
- machine-learning
- algorithmic-trading
- stock
- aws
- aws-lambda
- serverless
- facebook-prophet
title: 如何使用 Facebook Prophet 机器学习模型在 AWS Lambda (无服务器) 部署自动化交易机器人
type: post

---
我将这篇文章分为“为什么我要这样做”和“技术实现方法”。如果您想跳过“为什么”部分，可以直接跳到技术部分。


**1. 可靠性：** 该算法将独立于其他系统、更新等执行。

**2. 性能效率：** 我可以在单个（小型）系统上运行多个算法，彼此独立。

**3. 成本节省：** AWS每月允许[320万计算秒](https://aws.amazon.com/lambda/?did=ft_card&trk=ft_card)，基本上让我所有算法都能免费运行。

我一直在寻找一种方法，以确保我的投资机器人能够可靠地执行，因为执行失败可能会造成巨额损失，如果交易方向错误，交易未能及时取消。此外，我还想避免让我的电脑一直运行，并确保多个算法能够同时运行，而不影响或延迟彼此的执行。

此外，让投资算法在不担心操作系统更新、硬件故障和断电等问题的情况下运行是很好的想法，这是无服务器技术的通用优势。

我现在可以运行算法的多种变体来测试算法的修改，并确保它一定会运行。另一个好处是？AWS 提供大约 100 万次免费 Lambda 调用，让我可以在免费套餐中运行整个架构。

## 投资算法

我将在网站 [www.datafortress.cloud](http://www.datafortress.cloud) 的另一篇文章中更深入地解释该算法，但我通常的投资算法设置包括：

1. 使用 [Backtrader](https://www.backtrader.com/)，一个用 Python 编写的开源回测框架，来测试算法
2. 将成功的算法转换为包含 `run()` 方法的单个 Python 文件，该方法返回已执行的投资
3. 将 Python 文件传输到 AWS Lambda，并在其中调用 `run()` 函数与 AWS Lambda 的 `lambda_handler` 函数

在这个示例算法中，我会根据当前价格是否高于或低于由 [Facebook 的 Prophet 模型](https://facebook.github.io/prophet/)预测的趋势线来做出投资决策。我参考了 [Sean Kelley](http://seangtkelley.me/blog/2018/08/15/algo-trading-pt2) 的想法，他撰写了 Backtrader 设置，说明如何将 Prophet 与 Backtrader 配合使用。

此设置中的股票宇宙是通过从 SPY500 指数中选择过去 X 个时间步长中回报最高的 20 只股票来计算的。

数据来源是雅虎财经，使用 [免费的 yfinance 库](https://pypi.org/project/yfinance/)，我的算法经纪人选择的是 [Alpaca.markets](https://alpaca.markets/)。

在我的设置中，算法将每天下午 3 点执行一次，或在交易时间内每 15 分钟执行一次。

### 将 Facebook Prophet 部署到 AWS Lambda 的问题

AWS Lambda 预先安装了一些 Python 库，但正如许多人所知，默认情况下，这些库相当有限（对于 Lambda 的承诺来说这是合理的）。但是，Lambda 允许安装私有包，对于较小的包来说非常容易（请参阅 [官方文档](https://docs.aws.amazon.com/lambda/latest/dg/python-package.html)），但如果处理超过 250 MB 的包，则会变得更加复杂。不幸的是，Facebook 的 Prophet 模型超过了这个限制，但幸运的是，[Alexandr Matsenov 通过减小包大小解决了这个问题](https://towardsdatascience.com/how-to-get-fbprophet-work-on-aws-lambda-c3a33a081aaf)，[Marc Metz 处理了编译问题，使其在 AWS Lambda 上运行](https://github.com/marcmetz/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda)。

可以通过使用层将非默认库添加到 AWS Lambda，这些层包含所有所需的包。如果导入层，则可以在 Python 函数中像在本地设置中一样简单地导入包。

## 如何实现（技术）

最后，让我解释如何实现这一点。以下是针对不耐烦人士的 TLDR，或者以下更详细的版本。

**TLDR;**

1. 您需要一个 Lambda 层，将我的层 ([下载](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip)) 包含 Prophet、yfinance 等上传到 S3 存储桶（私有访问）
2. 选择 AWS Lambda，创建一个函数，添加一个层并粘贴您的 S3 对象 URL
3. 将您的 lambda_function.py 粘贴到 Lambda 编辑器中 ([或者使用我的](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py))
4. 设置您的环境变量（可选）
5. 通过点击“测试”手动运行它，或者转到 CloudWatch -> 规则 -> 创建规则并设置“计划执行”以在指定的时间间隔运行它


**详细说明：**

### 1. 为 AWS Lambda 创建自定义层

您可以使用包含 Facebook Prophet、NumPy、pandas、[alpaca-trading-API](https://github.com/alpacahq/alpaca-trade-api-python)、yfinance ([GitHub](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda)) 的我的 Lambda 层，或者使用 [Marc](https://medium.com/@marc.a.metz/docker-run-rm-it-v-pwd-var-task-lambci-lambda-build-python3-7-bash-c7d53f3b7eb2) 的说明进行编译。


**使用我的 Lambda 层**

1. 下载我的 [GitHub 存储库](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip) 中包含所有包的 zip 文件 ([链接](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip))。
2. 由于您只能将层直接上传到 Lambda，直到大小为 50 MB，因此我们首先需要将文件上传到 AWS S3。
3. 创建一个存储桶并将下载的 zip 文件放入其中。访问可以保持私有，不需要公开！复制文件的 URL（例如 [https://BUCKETNAME.s3.REGION.amazonaws.com/python.zip](https://BUCKETNAME.s3.REGION.amazonaws.com/python.zip "https://BUCKETNAME.s3.REGION.amazonaws.com/python.zip"))。
4. 登录 AWS 并转到 Lambda -> 层 ([欧洲中部链接](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/layers))。
5. 点击“创建层”，为其赋予匹配的名称，选择“从 Amazon S3 上传文件”，并将步骤 3 的代码复制到其中。作为运行时选择 Python 3.7。点击创建。

**编译您自己的 Lambda 层**

请按照 [Marc 的说明](https://medium.com/@marc.a.metz/docker-run-rm-it-v-pwd-var-task-lambci-lambda-build-python3-7-bash-c7d53f3b7eb2) 进行操作。

### 2. 设置 AWS Lambda 函数

1. 打开 Lambda 函数仪表板 ([欧洲中部链接](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/functions)) 并点击“创建函数”
2. 保持“从零开始创建”复选框不变，并赋予其合适的名称。
3. 在“运行时”中，选择 Python 3.7，其余保持不变，并点击“创建函数”。
4. 在“设计器”选项卡的概述中，您将看到 Lambda 函数的图形表示。点击其下的“层”框，然后点击“添加层”。如果正确设置了层，您将能够在接下来的对话框中选择它。最后点击“添加”。
5. 在“设计器”选项卡中，选择您的 Lambda 函数。如果您向下滚动，您将在名为“lambda_function.py”的文件中看到默认的 Python 代码片段。如果您以与我的代码 ([链接](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py)) 相同的结构组织代码，则可以使用 `run()` 函数执行您的函数。如果调用 Lambda 函数，它将执行 `lambda_handler(event, context)` 函数，从中可以例如调用 `run()` 函数。当然，您可以重命名所有文件和函数，但是为了该项目的简单性，我保持原样。
6. 随意粘贴我的函数 ([链接](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py)) 并进行测试。
7. 点击“测试”应该会导致成功执行，否则，它将在对话框中显示错误。

### 3. 在 AWS Lambda 中使用环境变量

您永远不应该在代码中以明文形式留下您的用户名和密码，这就是为什么您应该始终使用环境变量！幸运的是，Lambda 也使用它们，并且可以轻松地使用 python 的 os 包调用它们。例如，在我的脚本中，我使用 `os.environ['ALPACAUSER']` 调用用户变量。环境变量可以在主要 Lambda 函数屏幕中设置，在代码编辑器下方滚动。

### 4. 定期触发 AWS Lambda 函数

无服务器和 AWS Lambda 的概念建立在函数在触发事件发生时执行的想法之上。在我的设置中，我希望函数例如每 15 分钟在交易时间执行一次，星期一至星期五。幸运的是，AWS 提供了一种触发事件的方法，无需运行服务器，使用 CloudWatch 服务。

1. 转到 CloudWatch ([欧洲中部链接](https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1))。
2. 在左侧面板中，选择“事件”和“规则”。
3. 点击“创建规则”，并选择“计划”而不是“事件模式”。这里您可以使用简单的“固定速率”对话框，或者创建 cron 表达式。我使用 [https://crontab.guru/](https://crontab.guru/)（免费的）来创建 cron 表达式。对于以上提到的用例，我的 cron 表达式为“0/15 13-21 ? * MON-FRI *”。
4. 在右侧面板中，选择“添加目标”并选择您的 Lambda 函数。它将自动添加到 Lambda。
5. 最后点击“配置详细信息”，为其命名，然后点击“创建规则”。


### 5. (可选) 日志分析、错误搜索

如果您已到达此步骤，您应该完成了！但是，如果您想检查一切是否正常工作，可以使用 CloudWatch 查看 Lambda 函数的输出。转到 CloudWatch -> 日志 -> 日志组 ([欧洲中部链接](https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1#logsV2:log-groups)) 并选择您的 Lambda 函数。在此概述中，您应该能够看到函数的输出。

如果您喜欢这篇文章，请留下评论或访问我的博客 [www.datafortress.cloud](http://www.datafortress.cloud) 来激励我 😊。
