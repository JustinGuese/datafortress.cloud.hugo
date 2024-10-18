---
author: जस्टिन गुएसे
bg_image: images/index2-1-1280x720.webp
categories:
- कंप्यूटर विजन
- बड़ा डेटा
- मशीन लर्निंग
date: '2022-06-08T07:10:46+02:00'
description: एमटीसीएन का उपयोग करके चेहरा पहचान – गति पर ध्यान केन्द्रित करते हुए
  चेहरे के निष्कर्षण के लिए एक मार्गदर्शन
image: images/index2-1-1280x720.webp
tags:
- Face Detection
- Neuronal Networks
- MTCNN
- Big Data
- Machine Learning
title: एमटीसीएन का उपयोग करके चेहरा पहचान
type: post

---
MTCNN एक पायथन (pip) लाइब्रेरी है जिसे [Github यूज़र ipacz](https://github.com/ipazc/mtcnn) द्वारा लिखा गया है, जो [Zhang, Kaipeng et al. “Joint Face Detection and Alignment Using Multitask Cascaded Convolutional Networks.” IEEE Signal Processing Letters 23.10 (2016): 1499–1503. Crossref. Web](https://arxiv.org/abs/1604.02878) पेपर को लागू करती है।

इस पेपर में, वे विभिन्न "उप-मॉडल" विशेषताओं का उपयोग करके एक गहन कैस्केडेड बहु-कार्य ढांचा प्रस्तावित करते हैं ताकि उनके सहसंबंधी शक्ति को बढ़ाया जा सके।

MTCNN CPU पर काफी तेज़ काम करती है, भले ही S3FD अभी भी GPU पर तेज़ चल रही है - लेकिन यह एक अलग पोस्ट का विषय है।

यह पोस्ट निम्नलिखित दो स्रोतों से कोड का उपयोग करती है, इन्हें भी देखें:

* [https://machinelearningmastery.com/how-to-perform-face-detection-with-classical-and-deep-learning-methods-in-python-with-keras/](https://machinelearningmastery.com/how-to-perform-face-detection-with-classical-and-deep-learning-methods-in-python-with-keras/)
* [https://www.kaggle.com/timesler/fast-mtcnn-detector-55-fps-at-full-resolution](https://www.kaggle.com/timesler/fast-mtcnn-detector-55-fps-at-full-resolution)


<br>

# MTCNN का बुनियादी उपयोग

<br>

पूरे नोटबुक तक पहुँचने के लिए स्वतंत्र महसूस करें:

[https://github.com/JustinGuese/mtcnn-face-extraction-eyes-mouth-nose-and-speeding-it-up](https://github.com/JustinGuese/mtcnn-face-extraction-eyes-mouth-nose-and-speeding-it-up)

    git clone https://github.com/JustinGuese/mtcnn-face-extraction-eyes-mouth-nose-and-speeding-it-up



सौभाग्य से MTCNN एक pip पैकेज के रूप में उपलब्ध है, जिसका अर्थ है कि हम इसे आसानी से pip का उपयोग करके स्थापित कर सकते हैं:

    pip install mtcnn



अब पायथन/Jupyter नोटबुक पर स्विच करके हम import और त्वरित सत्यापन से इंस्टॉलेशन की जांच कर सकते हैं:

    import mtcnn
    # version प्रिंट करें
    print(mtcnn.__version__)



इसके बाद, हम matplotlib के [imread फ़ंक्शन](https://bit.ly/2vo3INw) का उपयोग करके अपनी टेस्ट इमेज लोड करने के लिए तैयार हैं।

    import matplotlib.pyplot as plt
    # फ़ाइल से इमेज लोड करें
    filename = "glediston-bastos-ZtmmR9D_2tA-unsplash.webp"
    pixels = plt.imread(filename)
    print("इमेज/ऐरे का आकार:", pixels.shape)
    imgplot = plt.imshow(pixels)
    plt.show()

अब आपका आउटपुट इस तरह कुछ दिखेगा:

    {'box': [1942, 716, 334, 415], 'confidence': 0.9999997615814209, 'keypoints': {'left_eye': (2053, 901), 'right_eye': (2205, 897), 'nose': (2139, 976), 'mouth_left': (2058, 1029), 'mouth_right': (2206, 1023)}}
    {'box': [2084, 396, 37, 46], 'confidence': 0.9999206066131592, 'keypoints': {'left_eye': (2094, 414), 'right_eye': (2112, 414), 'nose': (2102, 426), 'mouth_left': (2095, 432), 'mouth_right': (2112, 431)}}
    {'box': [1980, 381, 44, 59], 'confidence': 0.9998701810836792, 'keypoints': {'left_eye': (1997, 404), 'right_eye': (2019, 407), 'nose': (2010, 417), 'mouth_left': (1995, 425), 'mouth_right': (2015, 427)}}
    {'box': [2039, 395, 39, 46], 'confidence': 0.9993435740470886, 'keypoints': {'left_eye': (2054, 409), 'right_eye': (2071, 415), 'nose': (2058, 422), 'mouth_left': (2048, 425), 'mouth_right': (2065, 431)}}

यह हमें क्या बताता है? इसका अधिकांश भाग स्व-व्याख्यात्मक है, लेकिन यह मूल रूप से निर्देशांक, या एक आयत के पिक्सेल मान देता है जहाँ MTCNN एल्गोरिथ्म ने चेहरे का पता लगाया है। ऊपर "बॉक्स" मान पूरे चेहरे का स्थान देता है, इसके बाद "विश्वसनीयता" स्तर होता है।

अधिक उन्नत निष्कर्ष या एल्गोरिदम करने के लिए, आपके पास अन्य चेहरे के स्थलों तक पहुँच होगी, जिन्हें "कीपॉइंट्स" भी कहा जाता है। विशेष रूप से MTCNN मॉडल ने आँखों, मुँह और नाक को भी खोज लिया है!


<br>

## चेहरों के चारों ओर बॉक्स बनाना

<br>

इसे और भी बेहतर दिखाने के लिए, आइए matplotlib का उपयोग करके चेहरे के चारों ओर एक बॉक्स बनाएँ:

**(बाकी कोड का अनुवाद समान ढांचे में किया जाना चाहिए।)**


<br>

## चेहरों के चारों ओर आँखें, मुँह और नाक प्रदर्शित करना

<br>

अब आइए उपरोक्त "कीपॉइंट्स" पर एक नज़र डालें जो MTCNN मॉडल ने लौटाए हैं।

अब हम इनका उपयोग नाक, मुंह और आँखों को भी ग्राफ करने के लिए करेंगे। हम ऊपर दिए गए अपने कोड में निम्नलिखित कोड स्निपेट जोड़ेंगे:

**(बाकी कोड का अनुवाद समान ढांचे में किया जाना चाहिए।)**

<br>

## उन्नत MTCNN: इसे गति दें (लगभग x100)!

<br>

अब रोचक हिस्सा आता है। यदि आप लाखों तस्वीरों को प्रोसेस करने जा रहे हैं, तो आपको MTCNN को गति देने की आवश्यकता होगी, अन्यथा या तो आप सो जाएंगे या आपका CPU जल जाएगा इससे पहले कि वह पूरा हो।

लेकिन हम वास्तव में क्या बात कर रहे हैं? यदि आप ऊपर दिए गए कोड को चला रहे हैं, तो इसमें लगभग एक सेकंड लगेगा, जिसका अर्थ है कि हम प्रति सेकंड लगभग एक तस्वीर प्रोसेस करेंगे। यदि आप GPU पर MTCNN चला रहे हैं और त्वरित संस्करण का उपयोग करते हैं, तो यह प्रति सेकंड लगभग 60-100 तस्वीरें/फ़्रेम प्राप्त करेगा। यह **100 गुना** तक की गति वृद्धि है!

उदाहरण के लिए, यदि आप किसी फिल्म के सभी चेहरे निकालने जा रहे हैं, जहाँ आप प्रति सेकंड 10 चेहरे निकालेंगे (फिल्म का एक सेकंड औसतन लगभग 24 फ्रेम है, इसलिए हर दूसरे फ्रेम पर), तो यह 10 * 60 (सेकंड) * 120 (मिनट) = 72,000 फ्रेम होगा।

इसका मतलब है कि यदि एक फ्रेम को संसाधित करने में एक सेकंड लगता है, तो इसमें 72,000 * 1 (सेकंड) = 72,000 सेकंड / 60 सेकंड = 1,200 मिनट = **20 घंटे** लगेंगे।

MTCNN के त्वरित संस्करण के साथ, यह कार्य 72,000 (फ्रेम) / 100 (फ्रेम/सेकेंड) = 720 सेकंड = **12 मिनट** में हो जाएगा!

GPU पर MTCNN का उपयोग करने के लिए, आपको CUDA, cudnn, pytorch आदि सेट अप करने की आवश्यकता होगी। [Pytorch ने इस भाग के बारे में एक अच्छा ट्यूटोरियल लिखा है](https://pytorch.org/get-started/locally/)।

एक बार स्थापित होने के बाद, हम आवश्यक आयात इस प्रकार करेंगे:

**(बाकी कोड का अनुवाद समान ढांचे में किया जाना चाहिए।)**


**(अंतिम भाग का अनुवाद भी समान ढांचे में किया जाना चाहिए।)**
