---
title: Wie man 3D-Modelle in Websites und Schnellansichten für Android und iOS integriert
bg_image: "/images/annotation-2020-04-06-190049-1024x964.webp"
date: 2018-09-24T11:10:07.000+06:00
description: This is meta description
author: Justin Guese
image: "/images/annotation-2020-04-06-190049-1024x964.webp"
categories:
- Augmented Reality
tags:
- 3D
- Websites
- Augmented Reality
type: post

---
**Probieren Sie es aus:** Drehen Sie das 3D-Objekt unten, oder betrachten Sie es in AR mit Ihrem Telefon oder sogar in VR, wenn ein VR-Glas an Ihren Computer angeschlossen ist.

<p><strong>Probieren Sie es aus: </strong>Drehen Sie das 3D-Objekt unten, oder betrachten Sie es in AR mit Ihrem Telefon oder sogar in VR, wenn ein VR-Glas an Ihren Computer angeschlossen ist.
</p><div class="wpb_wrapper">  <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.js"></script><script nomodule src="https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js"></script><script src="https://unpkg.com/@webcomponents/webcomponentsjs@2.1.3/webcomponents-loader.js"></script><script src="https://unpkg.com/intersection-observer@0.5.1/intersection-observer.js"></script><script src="https://unpkg.com/resize-observer-polyfill@1.5.1/dist/ResizeObserver.js"></script><model-viewer src="/files/3dmodels/RocketShip_1393.gltf" ios-src="/files/3dmodels/RocketShip_1393.usdz" ar auto-rotate camera-controls shadow-intensity="1" alt="A 3D model of a rocket" background-color="#70BCD1"></model-viewer></div></div></div>

Augmented Reality wurde durch die Veröffentlichung einer Funktion namens ar webview (Quick View in iOS) nun einfacher.

Mit nur wenigen Zeilen Code ist es möglich, 3D-Objekte in Ihre Websites zu integrieren, die bereit sind, auf der Website zu interagieren, mobile Geräte mit AR-Unterstützung (d.h. Sie können die Objekte in Ihrem Raum platzieren) und sogar Unterstützung für Virtual Reality. Wenn Sie diese Website auf einen Computer laden, an den ein VR-Headset angeschlossen ist, sollte er Ihnen eine Möglichkeit zeigen, dieses Objekt in VR zu betrachten.  
Sie unterstützt sogar Magic Leap!

Um die notwendigen Skripte zu laden, laden Sie einfach den folgenden Code in Ihren Bereich der Website:

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

Danach brauchen Sie nur noch das Modell mit dem folgenden Snippet zu laden und das Modell in Ihres zu ändern.

Zu Demonstrationszwecken ist ["Rocket Ship" von Google Poly] (https://poly.google.com/view/42PQqEaxb-P) enthalten.

Der Code wurde übernommen und geändert von[ ](https://github.com/Kristina-Simakova/ar-webview)[https://github.com/Kristina-Simakova/ar-webview](https://github.com/Kristina-Simakova/ar-webview "https://github.com/Kristina-Simakova/ar-webview")

    <model-viewer src="assets/RocketShip_1393.gltf"
                  ios-src="assets/RocketShip_1393.usdz"
                  ar
                  auto-rotate
                  camera-controls
                  shadow-intensity="1"
                  alt="A 3D model of a rocket" background-color="#70BCD1">

    </model-viewer>

[**view raw**](https://gist.github.com/JustinGuese/6b119644e4d1a640dd054c5b0a18b62c/raw/448cab85deae1d24978a65a6955573d90f5b8122/3D%20Content%20with%20Webview%20-%20modelload)[**3D Content with Webview - modelload**](https://gist.github.com/JustinGuese/6b119644e4d1a640dd054c5b0a18b62c#file-3d-content-with-webview-modelload) hosted with ❤ by [**GitHub**](https://github.com/)


[Sie haben eine ähnliche Idee oder wir haben Ihr Interesse geweckt? Kontaktieren Sie uns jetzt für eine gratis 15-minütige Beratung!](https://www.datafortress.cloud/de/contact/)
