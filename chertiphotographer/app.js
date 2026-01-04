// Initialize Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, button, .gallery-item');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth follower lerp
function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor Hover States
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
    });
    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
    });
});

// Animations
// Reveal Text on Load
const revealTexts = document.querySelectorAll('.reveal-text');
gsap.from(revealTexts, {
    y: 100,
    opacity: 0,
    duration: 1.5,
    stagger: 0.2,
    ease: "power4.out",
    delay: 0.5
});

// Hero Image Parallax (handled by data-scroll-speed in HTML, but let's add a scale effect)
gsap.to('.hero-img', {
    scale: 1.1,
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// Gallery Items Reveal
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    gsap.from(item, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: item,
            start: "top 80%",
        }
    });
});

// Manifesto Text Color Change
const manifestoText = document.querySelector('.manifesto-text');
const redText = document.querySelector('.manifesto .text-red');

gsap.to(redText, {
    color: '#fff',
    scrollTrigger: {
        trigger: '.manifesto',
        start: 'top center',
        end: 'bottom center',
        scrub: true,
        toggleActions: "play reverse play reverse"
    }
});
