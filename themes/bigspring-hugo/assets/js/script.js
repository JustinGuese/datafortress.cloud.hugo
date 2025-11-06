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
    // Initialize Particles.js for header/global (if present)
    function shouldEnableParticles(){
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
      if (window.innerWidth < 768) return false; // tablet and up
      return true;
    }
    function initParticles(){
      if (typeof particlesJS === "undefined") return;
      if (!document.getElementById("particles-js")) return;
      if (!shouldEnableParticles()) return;
      if (window.__particlesInit) return; // avoid double init
      particlesJS("particles-js", {
      particles: {
        number: {
          value: 50,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#0AA8A7",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: { value: 0.35 },
        size: {
          value: 3,
          random: true,
          anim: { enable: false },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#0AA8A7",
          opacity: 0.28,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.7,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "window",
        events: {
          onhover: { enable: false },
          onclick: { enable: false },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 0.5,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
      });
      window.__particlesInit = true;
    }

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

  // Make content visible immediately on load
  makeContentVisible();
  
  // Initialize animations when DOM and GSAP are ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      makeContentVisible();
      
      // Wait for GSAP to load
      var checkGSAP = setInterval(function() {
        if (typeof gsap !== "undefined") {
          clearInterval(checkGSAP);
          setTimeout(function(){
            if (window.requestIdleCallback) {
              requestIdleCallback(initAnimations, { timeout: 700 });
            } else {
              setTimeout(initAnimations, 150);
            }
            if (window.requestIdleCallback) {
              requestIdleCallback(initParticles, { timeout: 1200 });
            } else {
              setTimeout(initParticles, 400);
            }
          }, 100);
        }
      }, 100);
      
      // Fallback: If GSAP doesn't load within 3 seconds, use Intersection Observer
      setTimeout(function() {
        clearInterval(checkGSAP);
        if (typeof gsap === "undefined") {
          initAnimations();
        }
        if (window.requestIdleCallback) {
          requestIdleCallback(initParticles, { timeout: 1200 });
        } else {
          setTimeout(initParticles, 400);
        }
        // Fallback trigger: ensure particles appear if idle callback didn't fire
        setTimeout(function(){
          if (!window.__particlesInit) initParticles();
        }, 2000);
      }, 3000);
    });
  } else {
    // DOM already loaded
    makeContentVisible();
    
    var checkGSAP = setInterval(function() {
      if (typeof gsap !== "undefined") {
        clearInterval(checkGSAP);
        setTimeout(function(){
          initAnimations();
          if (window.requestIdleCallback) {
            requestIdleCallback(initParticles, { timeout: 1200 });
          } else {
            setTimeout(initParticles, 400);
          }
        }, 100);
      }
    }, 100);
    
    setTimeout(function() {
      clearInterval(checkGSAP);
      initAnimations();
      if (window.requestIdleCallback) {
        requestIdleCallback(initParticles, { timeout: 1200 });
      } else {
        setTimeout(initParticles, 400);
      }
      // Fallback trigger: ensure particles appear if idle callback didn't fire
      setTimeout(function(){
        if (!window.__particlesInit) initParticles();
      }, 2000);
    }, 3000);
  }
})();
