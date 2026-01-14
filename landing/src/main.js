import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initI18n, t } from './i18n/translations.js';
import { initLanguageSelector } from './i18n/language-selector.js';
import { initDarkMode } from './dark-mode.js';

gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize i18n first
  initI18n();
  initLanguageSelector();
  initDarkMode();

  // Then initialize other components
  initAnimations();
  initMobileMenu();
  initVideoLazyLoad();
  initSmoothScroll();
  logConsoleMessage();
});

// Initialize mobile menu
function initMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    const srSpan = mobileMenuButton.querySelector('.sr-only');

    // Update sr-only text based on menu state
    const updateMenuButtonLabel = () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (srSpan) {
        srSpan.textContent = isOpen ? t('nav.closeMobileMenu') : t('nav.openMobileMenu');
      }
    };

    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      updateMenuButtonLabel();
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        updateMenuButtonLabel();
      });
    });

    // Listen for language changes to update button label
    window.addEventListener('languageChanged', () => {
      updateMenuButtonLabel();
    });

    // Initialize label
    updateMenuButtonLabel();
  }
}

// Initialize video lazy loading and viewport-based autoplay
function initVideoLazyLoad() {
  const video = document.getElementById('demo-video');

  if (!video) return;

  let isVideoLoaded = false;

  // Create Intersection Observer to detect when video enters/exits viewport
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Load video source when it's about to enter viewport (if not already loaded)
        if (entry.isIntersecting && !isVideoLoaded) {
          const source = video.querySelector('source[data-src]');
          if (source) {
            source.src = source.dataset.src;
            source.removeAttribute('data-src');
            video.load();
            isVideoLoaded = true;
          }
        }

        // Play video when in viewport, pause when out
        if (entry.isIntersecting) {
          video.play().catch(err => {
            // Handle autoplay restrictions
            console.log('Video autoplay failed:', err);
          });
        } else {
          video.pause();
        }
      });
    },
    {
      // Start loading/playing when 20% of the video is visible
      threshold: 0.2,
      // Start observing slightly before the video enters the viewport
      rootMargin: '50px'
    }
  );

  videoObserver.observe(video);
}

// Initialize all animations
function initAnimations() {
  // Hero animations using .from() instead of .set() + .to()
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('#hero-badge', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    delay: 0.2
  })
  .from('#hero-title', {
    opacity: 0,
    y: 20,
    duration: 0.8
  }, '-=0.4')
  .from('#hero-description', {
    opacity: 0,
    y: 20,
    duration: 0.8
  }, '-=0.6')
  .from('#hero-buttons', {
    opacity: 0,
    y: 20,
    duration: 0.8
  }, '-=0.6')
  .from('#hero-stats', {
    opacity: 0,
    y: 20,
    duration: 0.8
  }, '-=0.6');

  // Scroll reveal animations
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

  scrollRevealElements.forEach((element, index) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse',
        },
        delay: index % 3 * 0.1, // Stagger effect for groups
      }
    );
  });

  // Demo section typing animation
  initTypingAnimation();
}

// Initialize typing animation for demo section
function initTypingAnimation() {
  const demoBefore = document.getElementById('demo-before');
  const demoAfter = document.getElementById('demo-after');

  if (!demoBefore || !demoAfter) return;

  // Store original content
  const beforeText = demoBefore.textContent;
  const afterHTML = demoAfter.innerHTML;

  // Clear content immediately to avoid flash
  demoBefore.textContent = '';
  demoAfter.innerHTML = '';

  // Function to type text character by character
  function typeText(element, text, delay = 0, speed = 100) {
    return new Promise((resolve) => {
      setTimeout(() => {
        element.textContent = '';
        element.classList.add('typing-cursor');
        let i = 0;

        const typeInterval = setInterval(() => {
          if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
          } else {
            clearInterval(typeInterval);
            element.classList.remove('typing-cursor');
            resolve();
          }
        }, speed);
      }, delay);
    });
  }

  // Function to type HTML content with ruby elements
  function typeHTML(element, html, delay = 0) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        element.innerHTML = '';
        element.classList.add('typing-cursor');

        // Create a temporary container to parse HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Process each child node
        for (const node of temp.childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            // Type text nodes character by character
            const text = node.textContent;
            for (let i = 0; i < text.length; i++) {
              element.insertAdjacentText('beforeend', text.charAt(i));
              await new Promise(r => setTimeout(r, 80));
            }
          } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'RUBY') {
            // For ruby elements: insert kanji first, then animate rt
            const rubyClone = node.cloneNode(true);
            const rt = rubyClone.querySelector('rt');

            if (rt) {
              // Hide rt initially
              rt.style.opacity = '0';
              rt.style.transform = 'translateY(10px)';
            }

            // Insert the ruby element (with hidden rt)
            element.appendChild(rubyClone);
            await new Promise(r => setTimeout(r, 100));

            // Animate the rt appearing
            if (rt) {
              await gsap.to(rt, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'back.out(1.7)'
              });
            }
          }
        }

        element.classList.remove('typing-cursor');
        resolve();
      }, delay);
    });
  }

  // Trigger animation when section enters viewport
  ScrollTrigger.create({
    trigger: '#demo',
    start: 'top 70%',
    once: true,
    onEnter: async () => {
      // Type the "before" text first
      await typeText(demoBefore, beforeText, 0, 80);

      // Then show the "after" with furigana
      await typeHTML(demoAfter, afterHTML, 300);
    },
  });
}

// Initialize smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = 64; // Height of fixed nav
        const targetPosition = targetElement.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

// Console message
function logConsoleMessage() {
  console.log(
    '%cKakitai 書きたい',
    'color: #0073aa; font-size: 20px; font-weight: bold;'
  );
  console.log(
    '%cMake Japanese text readable with automatic furigana',
    'color: #666; font-size: 14px;'
  );
  console.log(
    '%c🔗 https://github.com/firestar300/wp-kakitai',
    'color: #0073aa; font-size: 12px;'
  );
}
