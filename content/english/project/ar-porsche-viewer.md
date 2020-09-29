---
title: Porsche AR Viewer
date: '2018-09-24T14:48:03.000+06:00'
description: This is meta description
bg_image: "/images/discovar-ar-viewer-300x151.webp"
image: "/images/discovar-ar-viewer-300x151.webp"
live_demo: ''
case_study: ''
category: Augmented Reality
overview:
- label: Client
  data: Whilst working at Porsche Holding
- label: Category
  data: Augmented Reality
- label: Expertise
  data: Mobile App
- label: Date
  data: 22 nov, 2019

---
The Porsche AR Viewer has been an Augmented Reality app I built during my time at Porsche Austria.  
The requirement emerged when a solution was needed to enrich advertisements and catch the attention of younger potential customers.

> Experts claim that by 2025 the AR/VR industry will be worth over $25 Billion and steadily rising.

[Source](https://medium.com/predict/the-future-of-augmented-reality-90143b98f7a3)

The app can be downloaded via:

– [Appstore](https://apps.apple.com/at/app/porsche-ar-viewer/id1339643671)  
– [Playstore](https://play.google.com/store/apps/details?id=at.digitalsolutions.porschearviewer)

[General product page: ](http://www.discovar.at/)[http://www.discovar.at](http://www.discovar.at "http://www.discovar.at")

### THE CHALLENGE

At first, we analysed the market but soon discovered that there has been no real app that fulfils our requirements.  
Therefore, I programmed the first draft of our app using the Unity game development engine in combination with Vuforia, which is currently one of the best Augmented reality libraries in use for AR/VR content.

### THE STRATEGY

The app worked great, but we revised our decisions because of the enterprise pricing model of Vuforia being too high, and therefore we would not have left enough money for advertising and further improvements.  
After some research, I discovered an alternative library, namely Wikitude. Their library offered the functionalities we wanted for a way smaller price.  
Furthermore I left out the Unity gaming engine and decided to program a native app for iOS and Android, because scaling and performance greatly improved that way.

This has been a good example of when it pays off to consider other possibilities and even consider the not-market leader for some projects, even if that results in a change of direction and a restart – because only the best products will truly be great.

#### Final Improvements

After the first published version I did not rest, but evaluated on how to further improve the app.  
One pain point has been, that additional content had to be programmed into the app itself, which resulted in a huge delay, because the Apple iOS store needs to revaluate each app after submission, causing in a long timespan until the new content will be online. This can be a problem, if the client has not so much time to wait. The same goes for last minute changes in the app, which was simply not possible with the Apple reviewing process.

Therefore I have been searching for other solutions, and found a way to generate new content in the Wikitude Studio Web editor, upload changes into an AWS S3 bucket, and the app pulling the new content from the S3 bucket. Therefore the app itself needed only be submitted once to the appstores, and every change has been instantly pulled from an S3 bucket. A nice side-effect has been, that the appsize greatly reduced as well, because content was dynamically pulled from the bucket if a trigger was scanned, instead of saving every content in the app itself.



</br>
[Are you working on a similar project? Are you interested in something similar? [contact us](/contact) now for a free 15-minute consultation.](/contact/)
