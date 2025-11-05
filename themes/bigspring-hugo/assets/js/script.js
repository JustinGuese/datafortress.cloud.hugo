// main script
(function () {
  "use strict";

  // gallery slider
  new Swiper(".gallery-slider", {
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
  new Swiper(".single-slider", {
    loop: true,
    autoplay: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  // brandCarousel init
  new Swiper(".brand-carousel", {
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
  new Swiper(".testimonial-carousel", {
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
    // Initialize Particles.js
    if (typeof particlesJS !== "undefined" && document.getElementById("particles-js")) {
      particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
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
        opacity: {
          value: 0.3,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#0AA8A7",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
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
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
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
    }

    // Initialize GSAP ScrollTrigger
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

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

      // Banner entrance animation
      const banner = document.querySelector(".banner");
      if (banner) {
        const h1 = banner.querySelector("h1");
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
          setTimeout(initAnimations, 100);
        }
      }, 100);
      
      // Fallback: If GSAP doesn't load within 3 seconds, use Intersection Observer
      setTimeout(function() {
        clearInterval(checkGSAP);
        if (typeof gsap === "undefined") {
          initAnimations();
        }
      }, 3000);
    });
  } else {
    // DOM already loaded
    makeContentVisible();
    
    var checkGSAP = setInterval(function() {
      if (typeof gsap !== "undefined") {
        clearInterval(checkGSAP);
        setTimeout(initAnimations, 100);
      }
    }, 100);
    
    setTimeout(function() {
      clearInterval(checkGSAP);
      initAnimations();
    }, 3000);
  }
})();
