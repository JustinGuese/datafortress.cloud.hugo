---
author: Justin Guese
bg_image: /images/annotation-2020-04-06-190049-1024x964.webp
categories:
- Augmented Reality
date: 2022-02-24 11:10:07+06:00
description: Dies ist die Meta-Beschreibung
image: /images/annotation-2020-04-06-190049-1024x964.webp
tags:
- 3D
- Websites
- Augmented Reality
title: "Integration von 3D-Modellen in Websites und Quick View f\xFCr Android- und\
  \ iOS-Ger\xE4te"
type: post
---

# Integration eines 3D-Modells in eine Website mit Quick View für Android und iOS

**Versuchen Sie es:** Drehen Sie das 3D-Objekt unten, oder betrachten Sie es in AR mit Ihrem Telefon oder sogar VR, wenn eine VR-Brille an Ihren Computer angeschlossen ist.

<p><strong>Testen Sie es aus: </strong>Drehen Sie das 3D-Objekt unten, oder betrachten Sie es in AR mit Ihrem Telefon oder sogar VR, wenn eine VR-Brille an Ihren Computer angeschlossen ist.</p><div class=\wpb_wrapper\> <script type=\module\ src=\https://unpkg.com/@google/model-viewer/dist/model-viewer.js\></script><script nomodule src=\https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js\></script><script src=\https://unpkg.com/@webcomponents/webcomponentsjs@2.1.3/webcomponents-loader.js\></script><script src=\https://unpkg.com/schnittpunkt-beobachter@0.5.1/Schnittstellen-Beobachter.js\></script><script src=\https://unpkg.com/resize-observer-polyfill@1.5.1/dist/ResizeObserver.js\></script><model-viewer src=\/files/3dmodels/RocketShip_1393.gltf\ ios-src=\/files/3dmodels/RocketShip_1393.usdz\ ar auto-rotate camera-controls shadow-intensity=\1\ alt=\Ein 3D-Modell einer Rakete\ background-color=\#70BCD1\></model-viewer></div></div></div>

Augmented Reality ist jetzt einfacher geworden, aufgrund der Veröffentlichung einer Funktion namens ar webview (Quick View in iOS).

Mit nur wenigen Zeilen Code ist es möglich, 3D-Objekte in Ihre Webseiten zu integrieren, bereit zur Interaktion auf der Website, Mobilgerät mit AR-Unterstützung (d. h. Sie können die Objekte in Ihrem Raum platzieren) und sogar Virtual Reality-Unterstützung. Wenn Sie diese Website auf einem Computer laden, an dem ein VR-Headset angeschlossen ist, Es sollte eine Option angezeigt werden, mit der Sie das Objekt in VR betrachten können..  
Es unterstützt sogar Magic Leap!



Um die notwendigen Skripte zu laden, laden Sie einfach den folgenden Code in Ihren Bereich der Website:

    <script type=\module\
              src=\https://unpkg.com/@google/model-viewer/dist/model-viewer.js\>
          </script>

          <!-- Lädt <model-viewer> für alte Browser wie IE11: -->
          <script nomodule
              src=\https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js\>
          </script>

          <!-- Die folgenden Bibliotheken und Polyfills werden empfohlen, um die Browserunterstützung zu maximieren -->
          <!-- HINWEIS: Sie müssen die Pfade für Ihr Projekt entsprechend anpassen -->

          <!-- 🚨 ERFORDERLICH: Web Components Polyfill zur Unterstützung von Edge und Firefox < 63 -->
          <script src=\https://unpkg.com/@webcomponents/webcomponentsjs@2.1.3/webcomponents-loader.js\></script>

          <!-- 💁 OPTIONAL: Intersection Observer Polyfill für bessere Leistung in Safari und IE11 -->
          <script src=\https://unpkg.com/schnittpunkt-beobachter@0.5.1/Schnittstellen-Beobachter.js\></script>

          <!-- 💁 OPTIONAL: Resize Observer Polyfill verbessert das Größenänderungsverhalten in Nicht-Chrome-Browsern -->
          <script src=\https://unpkg.com/resize-observer-polyfill@1.5.1/dist/ResizeObserver.js\></script>

          <!-- 💁 OPTIONAL: Fullscreen-Polyfill wird für experimentelle AR-Funktionen in Canary benötigt -->
          <!--<script src=\https://unpkg.com/fullscreen-polyfill@1.0.2/Dist/Vollbildschirm.Polyfill.js\></script>-->

          <!-- 💁 OPTIONAL: Prisma einbeziehen.js für Magic Leap Unterstützung -->
          <!--<script src=\https://unpkg.com/@magicleap/prismatic@0.18.2/prismatisch.min.js\></script>-->

[**Rohansicht**](https://gist.github.com/JustinGuese/6c2bd61252ac9947ce686928bc2bcb6e/raw/20ea3fc0de030ed04f09d44db0d0d11ae8b69781/3D%20Content%20with%20Webview)[**3D Content with Webview**](https://gist.github.com/JustinGuese/6c2bd61252ac9947ce686928bc2bcb6e#file-3d-content-with-webview) gehostet mit ❤ von [**GitHub**](https://github.com/)

Danach, Sie müssen lediglich das Modell mit folgendem Schnipsel laden und das Modell in das Ihre ändern.

Zu Demonstrationszwecken [\Rocket Ship\ von Google Poly](https://poly.Google.com/view/42PQqEaxb-P) ist enthalten.

Der Code wurde von[ ](https://github) übernommen und geändert..com/Kristina-Simakova/ar-webview)[https://github.com/Kristina-Simakova/ar-webview](https://github.com/Kristina-Simakova/ar-webview \https://github.com/Kristina-Simakova/ar-webview\)

    <model-viewer src=\assets/RocketShip_1393.gltf\
                  ios-src=\assets/RocketShip_1393.usdz\
                  ar
                  Automatisches Drehen
                  Kamera-Steuerungen
                  schatten-intensität=\1\
                  alt=\Ein 3D-Modell einer Rakete\ background-color=\#70BCD1\>

    </model-viewer>

[**Rohansicht**](https://gist.github.com/JustinGuese/6b119644e4d1a640dd054c5b0a18b62c/raw/448cab85deae1d24978a65a6955573d90f5b8122/3D%20Content%20with%20Webview%20-%20modelload)[**3D Content with Webview - modelload**](https://gist.github.com/JustinGuese/6b119644e4d1a640dd054c5b0a18b62c#file-3d-content-with-webview-modelload) gehostet mit ❤ von [**GitHub**](https://github.com/)


</br>
[Arbeiten Sie an einem ähnlichen Projekt? Sind Sie an etwas Ähnlichem interessiert? [Kontaktieren Sie uns](/Kontakt) jetzt für eine kostenlose 15-minütige Beratung.](/Kontakt/)
