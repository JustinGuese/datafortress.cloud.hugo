// main script
(function () {
  "use strict";

  // gallery slider
  if (document.querySelector(".gallery-slider")) new Swiper(".gallery-slider", {
    slidesPerView: 1,
    loop: true,
    autoHeight: true,
    spaceBetween: 0,
    speed: 1500,
    autoplay: {
      delay: 5000,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  // video play button
  var videoPlay = document.querySelectorAll(".video-loader-btn");
  videoPlay.forEach(function (video) {
    video.addEventListener("click", function () {
      var thumbnail = this.parentNode.children;
      var thumbWidth = thumbnail[1].width;
      var video =
        '<div class="ratio ratio-16x9 mx-auto bg-dark rounded-2 overflow-hidden" style="max-width:' +
        thumbWidth +
        'px"><iframe src="' +
        this.getAttribute("data-src") +
        "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" +
        '" allowscriptaccess="always" allow="autoplay" allowfullscreen></iframe></div>';
      this.parentNode.innerHTML = video;
    });
  });

  // counterUp
  document.addEventListener("DOMContentLoaded", function () {
    // You can change this class to specify which elements are going to behave as counters.
    var elements = document.querySelectorAll(".counter");

    elements.forEach(function (item) {
      // Add new attributes to the elements with the '.counter' HTML class
      item.counterAlreadyFired = false;
      item.counterSpeed = item.getAttribute("data-counter-time") / 45;
      item.counterTarget = +item.innerText;
      item.counterCount = 0;
      item.counterStep = item.counterTarget / item.counterSpeed;

      item.updateCounter = function () {
        item.counterCount = item.counterCount + item.counterStep;
        item.innerText = Math.ceil(item.counterCount);

        if (item.counterCount < item.counterTarget) {
          setTimeout(item.updateCounter, item.counterSpeed);
        } else {
          item.innerText = item.counterTarget;
        }
      };
    });

    // Function to determine if an element is visible in the web page
    var isElementVisible = function isElementVisible(el) {
      var scroll = window.scrollY || window.pageYOffset;
      var boundsTop = el.getBoundingClientRect().top + scroll;
      var viewport = {
        top: scroll,
        bottom: scroll + window.innerHeight,
      };
      var bounds = {
        top: boundsTop,
        bottom: boundsTop + el.clientHeight,
      };
      return (
        (bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom) ||
        (bounds.top <= viewport.bottom && bounds.top >= viewport.top)
      );
    };

    // Funciton that will get fired uppon scrolling
    var handleScroll = function handleScroll() {
      elements.forEach(function (item, id) {
        if (true === item.counterAlreadyFired) return;
        if (!isElementVisible(item)) return;
        item.updateCounter();
        item.counterAlreadyFired = true;
      });
    };

    // Fire the function on scroll
    window.addEventListener("scroll", handleScroll);
  });

  //slider
  if (document.querySelector(".single-slider")) new Swiper(".single-slider", {
    loop: true,
    autoplay: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  // brandCarousel init
  if (document.querySelector(".brand-carousel")) new Swiper(".brand-carousel", {
    spaceBetween: 0,
    speed: 1000,
    loop: true,
    autoplay: {
      delay: 3000,
    },
    breakpoints: {
      0: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
      640: {
        slidesPerView: 3,
        spaceBetween: 0,
      },
      767: {
        slidesPerView: 4,
        spaceBetween: 0,
      },
      991: {
        slidesPerView: 6,
        spaceBetween: 0,
      },
    },
  });

  // testimonial-carousel init
  if (document.querySelector(".testimonial-carousel")) new Swiper(".testimonial-carousel", {
    spaceBetween: 70,
    speed: 600,
    loop: true,
    autoplay: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 30,
      },
      991: {
        slidesPerView: 2,
        spaceBetween: 70,
      },
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  // ============================================
  // PARTICLES: define globally so we can call anytime
  // ============================================
  function shouldEnableParticles(){
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return true;
  }

  function initParticles(){
    if (!shouldEnableParticles()) return;
    if (typeof particlesJS === "undefined") {
      var checkParticles = setInterval(function() {
        if (typeof particlesJS !== "undefined") {
          clearInterval(checkParticles);
          setTimeout(initParticles, 100);
        }
      }, 100);
      setTimeout(function() { clearInterval(checkParticles); }, 5000);
      return;
    }

    var heroContainer = document.getElementById("particles-hero");
    if (heroContainer && !heroContainer.dataset.initialized) {
      try {
        particlesJS("particles-hero", {
          particles: {
            number: { value: 85, density: { enable: true, value_area: 800 } },
            color: { value: "#9FE7F5" },
            shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
            opacity: { value: 0.8 },
            size: { value: 3.5, random: true, anim: { enable: false } },
            line_linked: { enable: true, distance: 140, color: "#8BE1F0", opacity: 0.6, width: 1 },
            move: { enable: true, speed: 0.7, direction: "none", random: true, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } }
          },
          interactivity: { detect_on: "window", events: { onhover: { enable: false }, onclick: { enable: false }, resize: true }, modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } } },
          retina_detect: true,
        });
        setTimeout(function(){
          if (!heroContainer.querySelector('canvas')) {
            console.warn('particles-hero canvas missing, retrying');
            heroContainer.removeAttribute('data-initialized');
            setTimeout(initParticles, 200);
          }
        }, 200);
        heroContainer.dataset.initialized = "true";
        console.log("Particles initialized in particles-hero");
      } catch (e) { console.error("Error initializing particles-hero:", e); }
    }

    var globalContainer = document.getElementById("particles-js");
    if (globalContainer && !globalContainer.dataset.initialized) {
      try {
        particlesJS("particles-js", {
          particles: {
            number: { value: 85, density: { enable: true, value_area: 800 } },
            color: { value: "#9FE7F5" },
            shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
            opacity: { value: 0.8 },
            size: { value: 3.5, random: true, anim: { enable: false } },
            line_linked: { enable: true, distance: 140, color: "#8BE1F0", opacity: 0.6, width: 1 },
            move: { enable: true, speed: 0.7, direction: "none", random: true, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } }
          },
          interactivity: { detect_on: "window", events: { onhover: { enable: false }, onclick: { enable: false }, resize: true }, modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } } },
          retina_detect: true,
        });
        setTimeout(function(){
          if (!globalContainer.querySelector('canvas')) {
            console.warn('particles-js canvas missing, retrying');
            globalContainer.removeAttribute('data-initialized');
            setTimeout(initParticles, 200);
          }
        }, 200);
        globalContainer.dataset.initialized = "true";
        console.log("Particles initialized in particles-js");
      } catch (e) { console.error("Error initializing particles-js:", e); }
    }
  }

  // ============================================
  // FUTURISTIC ANIMATIONS
  // ============================================

  // Wait for GSAP and ScrollTrigger to be available
  function initAnimations() {
    // Setup interactive hover headlines (split into spans) regardless of GSAP availability
    (function setupHoverHeadlines() {
      const nodes = document.querySelectorAll('.hover-headline');
      nodes.forEach((el) => {
        if (el.querySelector('.char')) return; // already processed
        // If element has holographic gradient text, remove it to avoid transparent spans
        if (el.classList.contains('holographic')) {
          el.classList.remove('holographic');
          el.style.webkitTextFillColor = '';
          el.style.background = '';
          el.style.color = 'var(--color-white)';
        }

        const text = el.textContent || '';
        const frag = document.createDocumentFragment();

        // Split into words, keep spaces so we can re-insert them explicitly
        const parts = text.split(/(\s+)/);
        parts.forEach((part) => {
          if (part.trim() === '') {
            // whitespace part → render as a dedicated space element
            const space = document.createElement('span');
            space.className = 'space';
            space.textContent = '\u00A0';
            frag.appendChild(space);
            return;
          }

          // word part → wrap letters in a .word container to avoid mid-word wraps
          const word = document.createElement('span');
          word.className = 'word';
          for (let i = 0; i < part.length; i++) {
            const ch = document.createElement('span');
            ch.className = 'char';
            ch.textContent = part[i];
            word.appendChild(ch);
          }
          frag.appendChild(word);
        });

        el.textContent = '';
        el.appendChild(frag);
        el.classList.add('with-shadow');
      });
    })();
    // Particles functions are defined globally above

    // Initialize GSAP ScrollTrigger
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      // Query shared elements early for reuse below
      const banner = document.querySelector(".banner");

      // Fade in up animations
      gsap.utils.toArray(".fade-in-up").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse",
            onEnter: () => element.classList.add("visible"),
          },
        });
      });

      // Fade in left animations
      gsap.utils.toArray(".fade-in-left").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          x: -50,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse",
            onEnter: () => element.classList.add("visible"),
          },
        });
      });

      // Fade in right animations
      gsap.utils.toArray(".fade-in-right").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          x: 50,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse",
            onEnter: () => element.classList.add("visible"),
          },
        });
      });

      // Scale in animations
      gsap.utils.toArray(".scale-in").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          scale: 0.8,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse",
            onEnter: () => element.classList.add("visible"),
          },
        });
      });

      // Section title underline animation
      gsap.utils.toArray(".section-title").forEach((element) => {
        gsap.to(element, {
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            onEnter: () => element.classList.add("visible"),
          },
        });
      });

      // Parallax effect for sections
      gsap.utils.toArray(".parallax-section").forEach((element) => {
        gsap.to(element, {
          yPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Magnetic effect for buttons and links
      const magneticElements = document.querySelectorAll(".magnetic");
      magneticElements.forEach((element) => {
        element.addEventListener("mousemove", function (e) {
          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(element, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.5,
            ease: "power2.out",
          });
        });

        element.addEventListener("mouseleave", function () {
          gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        });
      });

      // Animate cards on scroll
      gsap.utils.toArray(".card-3d").forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          rotationY: -15,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // ============================================
      // HOMEPAGE ENHANCEMENTS: PARALLAX + TILT 3D
      // ============================================
      // Layered parallax on banner elements for subtle depth
      if (banner) {
        const bannerH1 = banner.querySelector("h1");
        const bannerP = banner.querySelector("p");
        const bannerBtn = banner.querySelector(".btn");
        const bannerImg = banner.querySelector(".floating, img, picture");

        if (bannerH1) {
          gsap.to(bannerH1, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: banner,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
        if (bannerP) {
          gsap.to(bannerP, {
            yPercent: -5,
            ease: "none",
            scrollTrigger: {
              trigger: banner,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
        if (bannerBtn) {
          gsap.to(bannerBtn, {
            yPercent: -3,
            ease: "none",
            scrollTrigger: {
              trigger: banner,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
        if (bannerImg) {
          gsap.to(bannerImg, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: banner,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      }

      // Subtle parallax on feature cards
      gsap.utils.toArray(".feature-card").forEach((el) => {
        gsap.to(el, {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Cursor-based 3D tilt for interactive elements
      // Explicitly target feature cards and other card-3d elements
      const tiltElements = document.querySelectorAll('.feature-card, .card-3d, .tilt');
      tiltElements.forEach((el) => {
        const maxTilt = 8; // degrees - slightly more pronounced for feature cards
        const damp = 0.12; // smoothing duration - faster response

        // Use a single event listener per element
        el.addEventListener('mousemove', function (e) {
          const rect = el.getBoundingClientRect();
          const relX = e.clientX - rect.left;
          const relY = e.clientY - rect.top;
          const px = (relX / rect.width) * 2 - 1;   // -1 .. 1
          const py = (relY / rect.height) * 2 - 1;  // -1 .. 1
          const rotateY = px * maxTilt;
          const rotateX = -py * maxTilt;

          // Use immediate render to avoid conflicts with scroll animations
          gsap.to(el, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000,
            transformOrigin: 'center center',
            duration: damp,
            ease: 'power2.out',
            overwrite: true // Ensure we overwrite any conflicting transforms
          });
        });

        el.addEventListener('mouseleave', function () {
          gsap.to(el, {
            rotateX: 0,
            rotateY: 0,
            transformPerspective: 1000,
            duration: 0.6,
            ease: 'power3.out',
            overwrite: true
          });
        });
      });

      // Banner entrance animation
      if (banner) {
        // Ensure homepage h1 has hover-headline class
        const h1 = banner.querySelector('h1');
        if (h1 && !h1.classList.contains('hover-headline')) {
          h1.classList.add('hover-headline', 'lg');
        }
        const p = banner.querySelector("p");
        const btn = banner.querySelector(".btn");
        
        if (h1) {
          gsap.from(h1, {
            opacity: 0,
            y: -50,
            duration: 1,
            ease: "power3.out",
          });
        }
        if (p) {
          gsap.from(p, {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.2,
            ease: "power3.out",
          });
        }
        if (btn) {
          gsap.from(btn, {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            delay: 0.4,
            ease: "back.out(1.7)",
          });
        }
      }
      
      // Check for elements already in viewport and animate them immediately
      const checkViewport = function() {
        document.querySelectorAll(".fade-in-up, .fade-in-left, .fade-in-right, .scale-in").forEach((element) => {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 1.2 && rect.bottom > -100;
          if (isVisible && !element.classList.contains("visible")) {
            element.classList.add("visible");
            // If GSAP is available, animate it
            if (typeof gsap !== "undefined") {
              gsap.to(element, {
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                duration: 0.8,
                ease: "power2.out"
              });
            }
          }
        });
      };
      checkViewport();

      // ============================================
      // CONTACT PAGE EFFECTS
      // ============================================
      const contactHero = document.querySelector('.contact-hero');
      if (contactHero) {
        // Subtle parallax on contact hero content
        const contactContainer = contactHero.querySelector('.container');
        if (contactContainer) {
          gsap.to(contactContainer, {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: contactHero,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          });
        }

        // 3D tilt on the contact form card following cursor
        const formCard = contactHero.querySelector('.contact-form-card');
        if (formCard) {
          const maxTilt = 6; // degrees
          const damp = 0.15; // smoothing

          formCard.addEventListener('mousemove', function (e) {
            const rect = formCard.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;
            const px = (relX / rect.width) * 2 - 1;   // -1 .. 1
            const py = (relY / rect.height) * 2 - 1;  // -1 .. 1
            const rotateY = px * maxTilt;
            const rotateX = -py * maxTilt;

            gsap.to(formCard, {
              rotateX: rotateX,
              rotateY: rotateY,
              transformPerspective: 800,
              transformOrigin: 'center',
              duration: damp,
              ease: 'power2.out'
            });
          });

          formCard.addEventListener('mouseleave', function () {
            gsap.to(formCard, {
              rotateX: 0,
              rotateY: 0,
              transformPerspective: 800,
              duration: 0.6,
              ease: 'power3.out'
            });
          });
        }
      }
    } else {
      // Fallback: Use Intersection Observer for scroll animations if GSAP is not available
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      };

      const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      }, observerOptions);

      // Observe all animation elements
      document.querySelectorAll(".fade-in-up, .fade-in-left, .fade-in-right, .scale-in").forEach((element) => {
        observer.observe(element);
      });
      
      // Check viewport immediately
      const checkViewportFallback = function() {
        document.querySelectorAll(".fade-in-up, .fade-in-left, .fade-in-right, .scale-in").forEach((element) => {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 1.2 && rect.bottom > -100;
          if (isVisible) {
            element.classList.add("visible");
          }
        });
      };
      checkViewportFallback();
      
      // Fallback: If elements are still not visible after 2 seconds, make them visible
      setTimeout(function() {
        document.querySelectorAll(".fade-in-up, .fade-in-left, .fade-in-right, .scale-in").forEach((element) => {
          if (!element.classList.contains("visible")) {
            element.classList.add("no-animation");
          }
        });
      }, 2000);
    }
  }
  
  // Make all content visible immediately (fallback)
  function makeContentVisible() {
    // Make all sections visible
    const sections = document.querySelectorAll("section");
    sections.forEach(function(section) {
      section.style.opacity = "1";
      section.style.visibility = "visible";
    });
    
    // Make banner elements visible immediately
    const banner = document.querySelector(".banner");
    if (banner) {
      const bannerElements = banner.querySelectorAll(".fade-in-up, .fade-in-left, .fade-in-right, .scale-in, h1, p, .btn, .floating");
      bannerElements.forEach(function(el) {
        el.style.opacity = "1";
        el.style.visibility = "visible";
        el.style.transform = "translateY(0) translateX(0) scale(1)";
        el.classList.add("visible");
      });
    }
    
    // Make navigation visible
    const nav = document.querySelector(".navigation");
    if (nav) {
      nav.style.opacity = "1";
      nav.style.visibility = "visible";
    }
    
    // Make main visible
    const main = document.querySelector("main");
    if (main) {
      main.style.opacity = "1";
      main.style.visibility = "visible";
    }
    
    // Make all elements with animation classes visible (fallback for scroll animations)
    const animatedElements = document.querySelectorAll(".fade-in-up, .fade-in-left, .fade-in-right, .scale-in");
    animatedElements.forEach(function(el) {
      // Only make visible if it's a child element, not a section itself
      if (!el.tagName || el.tagName.toLowerCase() !== 'section') {
        el.style.opacity = "1";
        el.style.visibility = "visible";
        el.classList.add("visible");
      }
    });
  }

  // Remove nested scrollbars from content containers
  function removeNestedScrollbars() {
    // Find all elements that might have overflow-y set
    var selectors = [
      '.content',
      '.container',
      '.row',
      '[class*="col-"]',
      'section .content',
      '.product-page .content',
      '.portfolio .content'
    ];
    
    selectors.forEach(function(selector) {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function(el) {
        // Skip swiper elements and modals
        if (el.closest('.swiper') || el.closest('.modal') || el.closest('.dropdown-menu')) {
          return;
        }
        // Remove inline overflow-y styles
        if (el.style.overflowY === 'auto' || el.style.overflowY === 'scroll') {
          el.style.overflowY = 'visible';
        }
        // Remove max-height that could cause scrolling
        var maxHeight = window.getComputedStyle(el).maxHeight;
        if (maxHeight && maxHeight !== 'none' && maxHeight !== '0px') {
          el.style.maxHeight = 'none';
        }
      });
    });
  }
  
  // Lazy-load Three.js and render an interactive 3D object in #contact-3d
  function initContact3D() {
    var container = document.getElementById('contact-3d');
    if (!container) {
      console.log('Contact 3D: container not found');
      return;
    }
    if (container.dataset.initialized) {
      console.log('Contact 3D: already initialized');
      return;
    }

    // Ensure container has dimensions
    var checkDimensions = function() {
      var width = container.clientWidth || container.offsetWidth;
      var height = container.clientHeight || container.offsetHeight;
      if (width === 0 || height === 0) {
        console.log('Contact 3D: container has no dimensions, retrying...', width, height);
        setTimeout(checkDimensions, 100);
        return;
      }
      startScene();
    };

    function startScene() {
      try {
        console.log('Contact 3D: Starting scene...');
        var width = container.clientWidth || container.offsetWidth || 800;
        var height = container.clientHeight || container.offsetHeight || 600;
        
        if (width === 0 || height === 0) {
          console.error('Contact 3D: Container has zero dimensions');
          return;
        }

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
        camera.position.z = 8;

        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.display = 'block';
        container.appendChild(renderer.domElement);

        // Enhanced lighting for better visibility
        var ambient = new THREE.AmbientLight(0x66e0ff, 0.8);
        scene.add(ambient);
        var dir1 = new THREE.DirectionalLight(0x00d1ff, 1.2);
        dir1.position.set(3, 4, 5);
        scene.add(dir1);
        var dir2 = new THREE.DirectionalLight(0x9FE7F5, 0.6);
        dir2.position.set(-3, -2, 3);
        scene.add(dir2);

        // Multiple layers for depth: outer wireframe, inner wireframe, and points
        var outerGeo = new THREE.IcosahedronGeometry(2.5, 1);
        var outerWire = new THREE.MeshBasicMaterial({ 
          color: 0x00d1ff, 
          wireframe: true, 
          transparent: true, 
          opacity: 0.8 
        });
        var outerMesh = new THREE.Mesh(outerGeo, outerWire);
        scene.add(outerMesh);

        var innerGeo = new THREE.IcosahedronGeometry(1.8, 1);
        var innerWire = new THREE.MeshBasicMaterial({ 
          color: 0x9FE7F5, 
          wireframe: true, 
          transparent: true, 
          opacity: 0.7 
        });
        var innerMesh = new THREE.Mesh(innerGeo, innerWire);
        scene.add(innerMesh);

        // Points cloud - larger and brighter
        var pointsGeo = new THREE.IcosahedronGeometry(2.0, 2);
        var pointsMat = new THREE.PointsMaterial({ 
          color: 0x9FE7F5, 
          size: 0.08, 
          transparent: true, 
          opacity: 1.0 
        });
        var points = new THREE.Points(pointsGeo, pointsMat);
        scene.add(points);

        // Store references for animation
        var meshes = [outerMesh, innerMesh, points];
        var baseRotation = { x: 0, y: 0 };

        // Drag to rotate
        var isDown = false, lastX = 0, lastY = 0;
        function onDown(e){ 
          e.preventDefault();
          isDown = true; 
          lastX = (e.touches? e.touches[0].clientX: e.clientX); 
          lastY = (e.touches? e.touches[0].clientY: e.clientY); 
        }
        function onUp(){ isDown = false; }
        function onMove(e){
          if(!isDown) return;
          e.preventDefault();
          var x = (e.touches? e.touches[0].clientX: e.clientX);
          var y = (e.touches? e.touches[0].clientY: e.clientY);
          baseRotation.y += (x - lastX) * 0.005;
          baseRotation.x += (y - lastY) * 0.005;
          lastX = x; lastY = y;
        }
        renderer.domElement.style.pointerEvents = 'auto';
        renderer.domElement.style.cursor = 'grab';
        renderer.domElement.addEventListener('mousedown', onDown);
        renderer.domElement.addEventListener('mouseup', onUp);
        renderer.domElement.addEventListener('mouseleave', onUp);
        renderer.domElement.addEventListener('mousemove', onMove);
        renderer.domElement.addEventListener('touchstart', onDown, {passive:false});
        renderer.domElement.addEventListener('touchend', onUp, {passive:false});
        renderer.domElement.addEventListener('touchmove', onMove, {passive:false});

        // Animate with smooth rotation
        function animate(){
          requestAnimationFrame(animate);
          
          // Auto-rotate
          baseRotation.y += 0.002;
          baseRotation.x += 0.001;
          
          // Apply rotation to all meshes
          meshes.forEach(function(m) {
            m.rotation.y = baseRotation.y;
            m.rotation.x = baseRotation.x;
          });
          
          renderer.render(scene, camera);
        }
        animate();

        // Resize handling
        function onResize(){
          var w = container.clientWidth || container.offsetWidth || width;
          var h = container.clientHeight || container.offsetHeight || height;
          if (w > 0 && h > 0) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
          }
        }
        window.addEventListener('resize', onResize);

        container.dataset.initialized = 'true';
        console.log('Contact 3D: Scene initialized successfully');
      } catch (e) {
        console.error('Contact 3D init failed:', e);
        console.error('Stack:', e.stack);
      }
    }

    // Load THREE if needed
    if (typeof THREE === 'undefined') {
      console.log('Contact 3D: Loading Three.js...');
      var script = document.createElement('script');
      // Use jsDelivr CDN which is more reliable
      script.src = 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.min.js';
      script.crossOrigin = 'anonymous';
      script.onload = function() {
        console.log('Contact 3D: Three.js loaded successfully');
        setTimeout(checkDimensions, 100);
      };
      script.onerror = function() {
        console.error('Contact 3D: Failed to load Three.js from jsDelivr, trying unpkg...');
        // Fallback to unpkg
        var fallbackScript = document.createElement('script');
        fallbackScript.src = 'https://unpkg.com/three@0.152.0/build/three.min.js';
        fallbackScript.crossOrigin = 'anonymous';
        fallbackScript.onload = function() {
          console.log('Contact 3D: Three.js loaded from unpkg');
          setTimeout(checkDimensions, 100);
        };
        fallbackScript.onerror = function() {
          console.error('Contact 3D: All CDN sources failed. Three.js not available.');
        };
        document.head.appendChild(fallbackScript);
      };
      document.head.appendChild(script);
    } else {
      console.log('Contact 3D: Three.js already available');
      setTimeout(checkDimensions, 100);
    }
  }

  // Make content visible immediately on load
  makeContentVisible();
  removeNestedScrollbars();
  initContact3D();
  
  // Safe caller that waits until initParticles is defined
  function callInitParticles() {
    if (typeof initParticles === "function") {
      initParticles();
      return;
    }
    setTimeout(callInitParticles, 100);
  }
  
  // Initialize particles early (doesn't depend on GSAP)
  // Try immediately, then with delays to catch deferred script loading
  callInitParticles();
  setTimeout(callInitParticles, 500);
  setTimeout(callInitParticles, 1500);
  setTimeout(callInitParticles, 3000);
  
  // Initialize animations when DOM and GSAP are ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      makeContentVisible();
      removeNestedScrollbars();
      
      // Try particles again on DOM ready
      callInitParticles();
      initContact3D();
      
      // Wait for GSAP to load
      var checkGSAP = setInterval(function() {
        if (typeof gsap !== "undefined") {
          clearInterval(checkGSAP);
          setTimeout(function(){
            if (window.requestIdleCallback) {
              requestIdleCallback(function() {
                initAnimations();
                removeNestedScrollbars();
              }, { timeout: 700 });
            } else {
              setTimeout(function() {
                initAnimations();
                removeNestedScrollbars();
              }, 150);
            }
            // Try particles again after GSAP loads
            callInitParticles();
            initContact3D();
          }, 100);
        }
      }, 100);
      
      // Fallback: If GSAP doesn't load within 3 seconds, use Intersection Observer
      setTimeout(function() {
        clearInterval(checkGSAP);
        if (typeof gsap === "undefined") {
          initAnimations();
        }
        removeNestedScrollbars();
        // Final attempt for particles
        callInitParticles();
        initContact3D();
      }, 3000);
    });
  } else {
    // DOM already loaded
    makeContentVisible();
    removeNestedScrollbars();
    initContact3D();
    
    var checkGSAP = setInterval(function() {
      if (typeof gsap !== "undefined") {
        clearInterval(checkGSAP);
        setTimeout(function(){
          initAnimations();
          removeNestedScrollbars();
          // Try particles again
          callInitParticles();
          initContact3D();
        }, 100);
      }
    }, 100);
    
    setTimeout(function() {
      clearInterval(checkGSAP);
      initAnimations();
      removeNestedScrollbars();
      // Final attempt for particles
      callInitParticles();
      initContact3D();
    }, 3000);
  }
})();
