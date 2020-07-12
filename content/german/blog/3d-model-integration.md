---
title: How to integrate 3D models into websites and Quick View for Android and iOS
  devices
bg_image: "/images/annotation-2020-04-06-190049-1024x964.png"
date: 2018-09-24T11:10:07.000+06:00
description: This is meta description
author: Justin Guese
image: "/images/annotation-2020-04-06-190049-1024x964.png"
categories:
- Augmented Reality
tags:
- 3D
- Websites
- Augmented Reality
type: post

---
**Try it out:** Rotate the 3D object below, or look at it in AR using your phone or even VR if a VR-glass is connected to your computer.

<p><strong>Try it out: </strong>Rotate the 3D object below, or look at it in AR using your phone or even VR if a VR-glass is connected to your computer.</p><div class="wpb_wrapper">  <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.js"></script><script nomodule src="https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js"></script><script src="https://unpkg.com/@webcomponents/webcomponentsjs@2.1.3/webcomponents-loader.js"></script><script src="https://unpkg.com/intersection-observer@0.5.1/intersection-observer.js"></script><script src="https://unpkg.com/resize-observer-polyfill@1.5.1/dist/ResizeObserver.js"></script><model-viewer src="/files/3dmodels/RocketShip_1393.gltf" ios-src="/files/3dmodels/RocketShip_1393.usdz" ar auto-rotate camera-controls shadow-intensity="1" alt="A 3D model of a rocket" background-color="#70BCD1"></model-viewer></div></div></div>

Augmented Reality became easier now, due to the release of a feature called ar webview (Quick View in iOS).

With just some lines of code it is possible to integrate 3D Objects into your websites, ready to interact in the website, mobile device with AR support (meaning you are able to place the objects into your room) and even Virtual Reality support. If you load this website on a computer with a VR-headset attached to it, it should show you an option to view this object in VR.  
It even supports Magic Leap!

To load the necessary scripts just load the following Code into your section of the website:

    <script type="module"
              src="https://unpkg.com/@google/model-viewer/dist/model-viewer.js">
          </script>
        
          <!-- Loads <model-viewer> for old browsers like IE11: -->
          <script nomodule
              src="https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js">
          </script>
        
          <!-- The following libraries and polyfills are recommended to maximize browser support -->
          <!-- NOTE: you must adjust the paths as appropriate for your project -->
              
          <!-- 🚨 REQUIRED: Web Components polyfill to support Edge and Firefox < 63 -->
          <script src="https://unpkg.com/@webcomponents/webcomponentsjs@2.1.3/webcomponents-loader.js"></script>
        
          <!-- 💁 OPTIONAL: Intersection Observer polyfill for better performance in Safari and IE11 -->
          <script src="https://unpkg.com/intersection-observer@0.5.1/intersection-observer.js"></script>
        
          <!-- 💁 OPTIONAL: Resize Observer polyfill improves resize behavior in non-Chrome browsers -->
          <script src="https://unpkg.com/resize-observer-polyfill@1.5.1/dist/ResizeObserver.js"></script>
        
          <!-- 💁 OPTIONAL: Fullscreen polyfill is required for experimental AR features in Canary -->
          <!--<script src="https://unpkg.com/fullscreen-polyfill@1.0.2/dist/fullscreen.polyfill.js"></script>-->
        
          <!-- 💁 OPTIONAL: Include prismatic.js for Magic Leap support -->
          <!--<script src="https://unpkg.com/@magicleap/prismatic@0.18.2/prismatic.min.js"></script>-->

[**view raw**](https://gist.github.com/JustinGuese/6c2bd61252ac9947ce686928bc2bcb6e/raw/20ea3fc0de030ed04f09d44db0d0d11ae8b69781/3D%20Content%20with%20Webview)[**3D Content with Webview**](https://gist.github.com/JustinGuese/6c2bd61252ac9947ce686928bc2bcb6e#file-3d-content-with-webview) hosted with ❤ by [**GitHub**](https://github.com/)

After that, all you have to do is load the model with the following snippet and change the model to yours.

For demonstration purposes [“Rocket Ship” by Google Poly](https://poly.google.com/view/42PQqEaxb-P) is included.

Code was taken and altered from[ ](https://github.com/Kristina-Simakova/ar-webview)[https://github.com/Kristina-Simakova/ar-webview](https://github.com/Kristina-Simakova/ar-webview "https://github.com/Kristina-Simakova/ar-webview")

    <model-viewer src="assets/RocketShip_1393.gltf" 
                  ios-src="assets/RocketShip_1393.usdz"
                  ar
                  auto-rotate 
                  camera-controls 
                  shadow-intensity="1" 
                  alt="A 3D model of a rocket" background-color="#70BCD1">
    
    </model-viewer>

[**view raw**](https://gist.github.com/JustinGuese/6b119644e4d1a640dd054c5b0a18b62c/raw/448cab85deae1d24978a65a6955573d90f5b8122/3D%20Content%20with%20Webview%20-%20modelload)[**3D Content with Webview - modelload**](https://gist.github.com/JustinGuese/6b119644e4d1a640dd054c5b0a18b62c#file-3d-content-with-webview-modelload) hosted with ❤ by [**GitHub**](https://github.com/)