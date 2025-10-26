import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  initMobileMenu();
  initSmoothScroll();
  initNavbar();
  initScreenshotSlider();
  logConsoleMessage();
});

// Initialize mobile menu
function initMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
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

  // Demo section interactive animation
  const demoAfter = document.getElementById('demo-after');
  if (demoAfter) {
    ScrollTrigger.create({
      trigger: '#demo',
      start: 'top center',
      onEnter: () => {
        // Animate each ruby element
        const rubyElements = demoAfter.querySelectorAll('ruby');
        gsap.fromTo(
          rubyElements,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.7)',
          }
        );
      },
    });
  }
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

// Initialize navbar background on scroll
function initNavbar() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      nav.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
      nav.style.background = 'rgba(255, 255, 255, 0.8)';
    }
  });
}

// Initialize screenshot slider
function initScreenshotSlider() {
  const slides = document.querySelector('.screenshot-slides');
  const dots = document.querySelectorAll('.screenshot-dot');
  const prevButton = document.querySelector('.screenshot-prev');
  const nextButton = document.querySelector('.screenshot-next');

  if (!slides || !dots.length) return;

  let currentIndex = 0;
  const totalSlides = dots.length;
  let autoplayInterval;

  // Go to specific slide
  function goToSlide(index) {
    currentIndex = index;
    const offset = -index * 100;
    slides.style.transform = `translateX(${offset}%)`;

    // Update dots
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.remove('bg-gray-300', 'hover:bg-gray-400');
        dot.classList.add('bg-primary-600');
      } else {
        dot.classList.remove('bg-primary-600');
        dot.classList.add('bg-gray-300', 'hover:bg-gray-400');
      }
    });
  }

  // Next slide
  function nextSlide() {
    const next = (currentIndex + 1) % totalSlides;
    goToSlide(next);
  }

  // Previous slide
  function prevSlide() {
    const prev = (currentIndex - 1 + totalSlides) % totalSlides;
    goToSlide(prev);
  }

  // Start autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
  }

  // Stop autoplay
  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Event listeners
  prevButton?.addEventListener('click', () => {
    prevSlide();
    stopAutoplay();
    startAutoplay(); // Restart autoplay
  });

  nextButton?.addEventListener('click', () => {
    nextSlide();
    stopAutoplay();
    startAutoplay(); // Restart autoplay
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      goToSlide(index);
      stopAutoplay();
      startAutoplay(); // Restart autoplay
    });
  });

  // Pause on hover
  const sliderContainer = document.querySelector('.screenshot-slider');
  sliderContainer?.addEventListener('mouseenter', stopAutoplay);
  sliderContainer?.addEventListener('mouseleave', startAutoplay);

  // Start autoplay
  startAutoplay();
}

// Console message
function logConsoleMessage() {
  console.log(
    '%cWP Kakitai 書きたい',
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
