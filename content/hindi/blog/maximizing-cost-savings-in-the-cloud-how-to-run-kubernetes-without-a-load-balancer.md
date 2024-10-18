---
author: जस्टिन गुएसे
bg_image: images/blog/kubernetes.jpg
categories:
- निजी क्लाउड
date: '2023-01-18T07:10:46+02:00'
description: अपने Kubernetes क्लस्टर के लिए लागत बचत युक्तियाँ खोजें, एक लोड बैलेंसर
  के उपयोग से लेकर इन्हें पूरी तरह से समाप्त करने तक।
image: images/blog/kubernetes.jpg
tags:
- private cloud
- comparison
title: 'क्लाउड में लागत बचत को अधिकतम करना: लोड बैलेंसर के बिना Kubernetes कैसे चलाएँ'
type: post

---
क्लाउड में Kubernetes चलाने से जुड़ी सबसे महत्वपूर्ण लागतों में से एक प्रत्येक सेवा के लिए लोड बैलैंसर का उपयोग है। कीमतें प्रति लोड बैलैंसर प्रति माह लगभग 15 डॉलर से शुरू होती हैं, इसलिए लागतें जल्दी ही बढ़ जाती हैं, खासकर यदि आपके पास बड़ी संख्या में पॉड हैं। क्या होगा अगर हम आपको बताएँ कि उच्च उपलब्धता और स्वचालित फेलओवर के लाभ प्राप्त करते हुए, लोड बैलैंसर के बिना Kubernetes कैसे चलाया जा सकता है? इस लेख में, हम देखेंगे कि बिना लोड बैलैंसर के Kubernetes चलाने से आपको क्लाउड में पैसे कैसे बचाए जा सकते हैं।

## संस्करण 1: Nginx Ingress के साथ Cert Manager एकल लोड बैलैंसर का उपयोग करता है।

एक लागत-कटौती रणनीति पूरे क्लस्टर के लिए एक लोड बैलैंसर का उपयोग करना है, न कि प्रत्येक सेवा के लिए। यह एक [Nginx Ingress](https://kubernetes.github.io/ingress-nginx/) को नियोजित करके पूरा किया जा सकता है, जो क्लस्टर के लिए सभी बाहरी ट्रैफ़िक के लिए प्रवेश का एकल बिंदु के रूप में कार्य करता है। प्रत्येक सेवा के लिए एक लोड बैलैंसर बनाने के बजाय, Nginx Ingress डोमेन नाम के आधार पर ट्रैफ़िक को उपयुक्त पॉड्स में वितरित करता है।
सबसे अच्छी बात यह है कि यदि आप [cert-manager.io/docs/installation/helm/](https://cert-manager.io/docs/installation/helm/) इंस्टॉल करते हैं, तो आपको मुफ्त LetsEncrypt SSL प्रमाणपत्र मिलेंगे!

Helm का उपयोग करके अपने क्लस्टर में Nginx Ingress को तैनात करने का सबसे सरल तरीका है:

```
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

इसके बाद, अपनी सेवाओं के लिए https और SSL को सुनिश्चित करने के लिए, आपको निम्न कमांड के साथ Cert Manager को तैनात करने की आवश्यकता है:

```
helm install \
        cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --set installCRDs=true
```

फिर, आपको LetsEncrypt को बताने के लिए एक "ClusterIssuer" बनाने की आवश्यकता है कि आप कौन हैं। अपनी ईमेल के अनुकूलित सामग्री के साथ एक फ़ाइल "clusterissuer.yaml" बनाएँ:

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
#अपनी ईमेल आईडी बदलें
    email: EMAIL
    privateKeySecretRef:
       name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx # public या nginx (संस्करण के आधार पर)
```

इसके बाद, इसे अपने क्लस्टर पर लागू करने के लिए 'kubectl apply -f clusterissuer.yaml' का उपयोग करें और आपका काम पूरा हो गया!

### Ingress स्थापित करना

अब आपको उस सेवा का नाम चुनना होगा जिसे आप प्रचारित करना चाहते हैं। इसे 'kubectl get service' टाइप करके प्राप्त किया जा सकता है।

मान लीजिए कि आपकी सेवा डिफ़ॉल्ट नेमस्पेस में "nginx" कहलाती है। अपने डोमेन "test.datafortress.cloud" को इसके साथ रूट करने के लिए, testdf-ingress.yaml फ़ाइल इस प्रकार बनाएँ:

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-nginx-test
  namespace: default
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
#अपना डोमेन बदलें
    - test.datafortress.cloud
    secretName: tls-secret
  rules:
#अपना डोमेन बदलें
  - host: test.datafortress.cloud
    http:
      paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: nginx
              port:
                number: 80
```

इसे 'kubectl apply -f testdf-ingress.yaml' के साथ लागू करें, और अपने डोमेन का उपयोग अपने नोड के लोड बैलेंसर को इंगित करें। आपको जल्द ही इसे अपने क्लस्टर में काम करते हुए देखना चाहिए, और आपकी सेवा आपके द्वारा दिए गए डोमेन में दिखाई देनी चाहिए।
डिबगिंग के लिए nginx पॉड या प्रमाणपत्रों की जाँच करें।
समस्या आ रही है? [हमसे संपर्क करें](/contact) और हम आपकी सहायता करेंगे!

हालांकि यह समाधान आपको अपने क्लाउड बिल पर पैसे बचा सकता है, यह ध्यान रखना महत्वपूर्ण है कि बिना लोड बैलैंसर के अपने ही मुद्दे हैं। उदाहरण के लिए, यदि कोई नोड विफल हो जाता है, तो ट्रैफ़िक स्वचालित रूप से किसी स्वस्थ सर्वर पर नहीं भेजा जाएगा, जिससे सेवा में व्यवधान आ जाएगा। कई मामलों में लोड बैलैंसर अभी भी सबसे अच्छा विकल्प है, क्योंकि यह स्वचालित फेलओवर प्रदान करता है और सुनिश्चित करता है कि आपकी सेवाएँ आपके ग्राहकों के लिए उपलब्ध हैं। लागत बचत बनाम संभावित जोखिमों को तौलना और अपनी आवश्यकताओं के लिए सबसे अच्छा समाधान चुनना आपकी ज़िम्मेदारी है।

## संस्करण 2: बिना लोड बैलेंसर्स के और भी अधिक पैसे बचाएँ!

यदि आप अपने क्लाउड बिल पर और भी अधिक पैसे बचाना चाहते हैं, तो एक ऐसा समाधान है जो बिल्कुल भी लोड बैलैंसर का उपयोग नहीं करता है! Nginx Ingress के बजाय, यह समाधान सर्वर के नोडपोर्ट 80 और 443 का उपयोग करता है ताकि ट्रैफ़िक को उपयुक्त पॉड्स में निर्देशित किया जा सके। इससे लोड बैलेंसर्स की आवश्यकता समाप्त हो जाती है, जिससे आपकी क्लाउड लागतें कम हो जाती हैं। आइए इस समाधान के विवरण में जाएँ।

इसे प्राप्त करने के लिए, हम अपने वर्तमान nginx ingress को NodePorts का उपयोग करने और Load Balancers का उपयोग न करने के लिए अपग्रेड करेंगे:

```
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx
    --namespace ingress-nginx \
    --create-namespace \
    --set controller.service.type=NodePort \
    --set controller.service.ports.http=80 \
    --set service.annotations."metallb.universe.tf/address-pool"=singlenode \
    --set controller.service.ports.https=443
```

आपकी ingress-nginx सेवा जल्द ही Nodeport पर स्विच हो जानी चाहिए, और लोड बैलैंसर गायब हो जाना चाहिए।

जबकि लोड बैलेंसर्स क्लस्टर स्थिरता प्रदान करते हैं, वे एक-नोड Kubernetes वितरण वाले लोगों के लिए पैसे बचाने का एक वैध तरीका भी हैं। लोड बैलैंसर को हटाकर और केवल नोड पोर्ट 80 और 443 पर निर्भर रहकर, आप अपने मासिक खर्चों को काफी कम कर सकते हैं। हालांकि, यह याद रखना महत्वपूर्ण है कि लोड बैलैंसर न होने का मतलब है कि किसी विफल नोड की स्थिति में ट्रैफ़िक स्वचालित रूप से किसी स्वस्थ सर्वर पर नहीं भेजा जाएगा। स्थिरता और लागत बचत के बीच यह व्यापार-वार यदि आप एक-नोड Kubernetes वितरण चला रहे हैं, तो विचार करने लायक है।

## निष्कर्ष: क्या यह सार्थक है?

संक्षेप में, अपने Kubernetes क्लस्टर में लागत कम करने के कई तरीके हैं, जिनमें केवल एक लोड बैलैंसर का उपयोग करना, nginx ingress के साथ या बिना लोड बैलैंसर के और नोडपोर्ट पर निर्भर रहना शामिल है। जबकि स्थिरता और ट्रैफ़िक रूटिंग के मामले में लोड बैलैंसर के कई फायदे हैं, ऐसे विकल्प हैं जो आपको पैसे बचाने में मदद कर सकते हैं। यदि आप अभी भी अपने Kubernetes क्लस्टर में पैसे बचाने के सर्वोत्तम तरीके के बारे में अनिश्चित हैं, तो [DataFortress.cloud के लागत प्रभावी साझा Kubernetes क्लस्टरों का लाभ उठाएँ, या अपने क्लस्टर की लागतों को प्रबंधित करने में हमारी मदद लें](/contact)।
