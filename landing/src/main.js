import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mobile menu toggle
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

// Hero animations
// Set initial state
gsap.set(['#hero-badge', '#hero-title', '#hero-description', '#hero-buttons', '#hero-stats'], {
  opacity: 0,
  y: 20,
});

gsap.timeline({ defaults: { ease: 'power3.out' } })
  .to('#hero-badge', { opacity: 1, y: 0, duration: 0.6, delay: 0.2 })
  .to('#hero-title', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
  .to('#hero-description', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
  .to('#hero-buttons', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
  .to('#hero-stats', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');

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

// Smooth scroll for anchor links
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

// Navbar background on scroll
const nav = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    nav.style.background = 'rgba(255, 255, 255, 0.95)';
  } else {
    nav.style.background = 'rgba(255, 255, 255, 0.8)';
  }

  lastScroll = currentScroll;
});

// Add parallax effect to hero section
if (window.innerWidth > 768) {
  gsap.to('#hero-title', {
    y: '20%',
    opacity: 0.8,
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: '500px',
      scrub: 1,
    },
  });
}

// Console message
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
