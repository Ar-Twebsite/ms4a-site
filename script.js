// --- 100M Founder Portfolio Logic ---

// 1. Centralized Data Store (Populated from Info in HTML for SEO)
const projects = [];

function loadProjectsFromDOM() {
    const articles = document.querySelectorAll('#project-data article');
    articles.forEach(article => {
        const id = article.dataset.id;
        const title = article.dataset.title;
        const category = article.dataset.category;
        const image = article.dataset.image;
        const ctaText = article.dataset.ctaText;
        const ctaLink = article.dataset.ctaLink;
        const ctaText2 = article.dataset.ctaText2; // Secondary CTA
        const ctaLink2 = article.dataset.ctaLink2; // Secondary CTA Link
        const type = article.dataset.type; // 'calendly' or 'gallery' or undefined
        const imagesRaw = article.dataset.images;

        let images = [];
        if (imagesRaw) {
            try {
                images = JSON.parse(imagesRaw);
            } catch (e) {
                console.error("Error parsing images for " + id, e);
            }
        }

        // The description is the innerHTML of the .description div
        const descEl = article.querySelector('.description');
        const description = descEl ? descEl.innerHTML : "";

        projects.push({
            id,
            title,
            category,
            image,
            description,
            ctaText,
            ctaLink,
            ctaText2,
            ctaLink2,
            type,
            images
        });
    });
}

// Load data immediately
loadProjectsFromDOM();

// Special Map for Gameboy Titles (Short & Contextual)
const shortTitles = {
    "laptop": "My Story",
    "quest": "AR-T App",
    "globe": "Schoolhouse",
    "f1": "Monza VIP",
    "robot": "SuperNAO",
    "house": "Real Estate AI",
    "camera": "Portfolio",
    "books": "Magazine",
    "bin": "Failures",
    "calendar": "Contact",
    "clapperboard": "Ciak Europa",
    "cv": "My Resume"
};


// 2. Global State
let currentGridIndex = 0; // For Mobile Grid (0 to projects.length - 1)
const gridColumns = 3; // 4x3 Grid approx

// 3. DOM Elements
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalCta = document.getElementById('modal-cta');
const modalCtaSecondary = document.getElementById('modal-cta-secondary');
const modalClose = document.getElementById('modal-close');

// Lightbox DOM
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxPrev = document.getElementById('lightbox-prev');

let currentGalleryImages = [];
let currentGalleryIndex = 0;

// Mobile DOM
const osGrid = document.getElementById('os-grid');
const osStatus = document.getElementById('os-status-line');
const osTime = document.getElementById('os-time');

// Intro DOM
const introOverlay = document.getElementById('intro-overlay');
const introHint = document.getElementById('intro-hint');

// 8. Desktop Scaling Engine
const sceneScaler = document.getElementById('scene-scaler');
// sceneInner is just a container now, no zoom logic.

function resizeScene() {
    if (window.innerWidth <= 768) return;
    if (!sceneScaler) return;

    const baseWidth = 1920;
    const baseHeight = 1080;
    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight;

    const scaleX = availableWidth / baseWidth;
    const scaleY = availableHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    sceneScaler.style.transform = `scale(${scale})`;
}


// 4. Modal Logic (Simpler - No Zoom)

function openModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    // Populate Modal
    modalTitle.textContent = project.title;
    modalBody.innerHTML = project.description;

    // Handle CTA Button Visibility
    if (project.ctaText && modalCta) {
        modalCta.style.display = 'inline-block';
        modalCta.textContent = project.ctaText;

        // Handle Gallery Logic
        if (project.type === 'gallery') {
            modalCta.href = "#";
            modalCta.onclick = (e) => {
                e.preventDefault();
                openLightbox(project.title, project.images);
            };
        } else {
            modalCta.href = project.ctaLink;
            modalCta.onclick = null; // Reset click handler
        }
    } else if (modalCta) {
        modalCta.style.display = 'none';
    }

    // Handle Secondary CTA Button (for projects with second CTA)
    if (project.ctaText2 && modalCtaSecondary) {
        modalCtaSecondary.textContent = project.ctaText2;
        modalCtaSecondary.href = project.ctaLink2;
        modalCtaSecondary.style.display = 'inline-block';
        modalCtaSecondary.onclick = null; // Reset click handler
    } else if (modalCtaSecondary) {
        modalCtaSecondary.style.display = 'none';
    }

    // Show Modal (Instant)
    modalOverlay.classList.remove('hidden');
}

function closeModal() {
    // Hide Modal
    modalOverlay.classList.add('hidden');

    // Clear content delayed slightly for fade out
    setTimeout(() => {
        modalBody.innerHTML = '';
    }, 300);
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    // Close if clicking overlay (outside modal content)
    if (e.target === modalOverlay) closeModal();
});

// Close on Escape Key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
        closeModal();
    }
});

// Lightbox Logic
function openLightbox(title, images) {
    if (!images || images.length === 0) return;
    currentGalleryImages = images;
    currentGalleryIndex = 0;
    updateLightboxImage();
    lightboxOverlay.classList.remove('hidden');
}

function updateLightboxImage() {
    lightboxImg.src = currentGalleryImages[currentGalleryIndex];
    lightboxCaption.textContent = `${currentGalleryIndex + 1} / ${currentGalleryImages.length}`;
}

function closeLightbox() {
    lightboxOverlay.classList.add('hidden');
}

lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryImages.length;
    updateLightboxImage();
});

lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    updateLightboxImage();
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
});


// 5. Desktop Interaction
document.querySelectorAll('.object-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', () => {
        const projectId = wrapper.dataset.project;
        openModal(projectId);
    });
});

// 6. Mobile Interaction ("FounderOS") - GRID VARIANT
let isGridInitialized = false;

function initGrid() {
    if (!osGrid || isGridInitialized) return;
    osGrid.innerHTML = ''; // Clear once

    projects.forEach((proj, index) => {
        const iconDiv = document.createElement('div');
        iconDiv.className = `app-icon ${index === currentGridIndex ? 'active' : ''}`;
        iconDiv.dataset.index = index;

        // Use image or placeholder
        const img = document.createElement('img');
        img.src = proj.image;
        img.alt = proj.title;

        // Truncate title for icon label using Map
        const titleSpan = document.createElement('span');
        const shortName = shortTitles[proj.id] || proj.title.split(' ')[0]; // Fallback
        titleSpan.textContent = shortName;

        iconDiv.appendChild(img);
        iconDiv.appendChild(titleSpan);

        // Click to select/open
        iconDiv.addEventListener('click', () => {
            currentGridIndex = index;
            updateGridHighlight();
            openModal(proj.id);
        });

        osGrid.appendChild(iconDiv);
    });
    isGridInitialized = true;
    updateGridHighlight();
}

function updateGridHighlight() {
    if (!osGrid) return;

    // Update Active Class
    const icons = osGrid.children;
    for (let i = 0; i < icons.length; i++) {
        if (i === currentGridIndex) {
            icons[i].classList.add('active');
        } else {
            icons[i].classList.remove('active');
        }
    }

    // Update Status Line
    const currentProj = projects[currentGridIndex];
    if (currentProj && osStatus) {
        osStatus.textContent = `> ${currentProj.title}`;
    }
}

// Navigation Logic
function moveSelection(direction) {
    const total = projects.length;
    let newIndex = currentGridIndex;

    // Grid Math: 3 columns
    if (direction === 'up') newIndex -= gridColumns;
    if (direction === 'down') newIndex += gridColumns;
    if (direction === 'left') newIndex -= 1;
    if (direction === 'right') newIndex += 1;

    // Bounds Checks (Clamp)
    if (newIndex < 0) newIndex = 0; // Clamp top
    if (newIndex >= total) newIndex = total - 1; // Clamp bottom

    if (newIndex !== currentGridIndex) {
        currentGridIndex = newIndex;
        updateGridHighlight();

        // Auto-scroll to ensure visible
        const activeEl = osGrid.children[currentGridIndex];
        if (activeEl) {
            activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }
}


// Controls
const btnUp = document.getElementById('d-up');
const btnDown = document.getElementById('d-down');
const btnLeft = document.getElementById('d-left');
const btnRight = document.getElementById('d-right');
const btnSelect = document.getElementById('btn-select');

if (btnUp) btnUp.addEventListener('click', () => moveSelection('up'));
if (btnDown) btnDown.addEventListener('click', () => moveSelection('down'));
if (btnLeft) btnLeft.addEventListener('click', () => moveSelection('left'));
if (btnRight) btnRight.addEventListener('click', () => moveSelection('right'));

if (btnSelect) {
    btnSelect.addEventListener('click', () => {
        const project = projects[currentGridIndex];
        openModal(project.id);
    });
}

// Clock Logic
function updateTime() {
    if (!osTime) return;
    const now = new Date();
    osTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateTime, 1000);
updateTime();

// 7. Intro & Init
function initIntro() {
    // Determine context (Desktop or Mobile)
    const isMobile = window.innerWidth < 768;

    // Set Hint Text
    if (introHint) {
        introHint.textContent = isMobile
            ? "You can use the D-PAD TO NAVIGATE"
            : "Hover on the objects to explore my projects"; // Contextual hint

        // Intro message override
        const introP = document.querySelector('#intro-text p');
        if (introP) introP.textContent = "Welcome to my digital workspace";

        setTimeout(() => {
            introHint.classList.remove('hidden'); // Show hint after 1.5s
        }, 1000);
    }

    // Dismiss Overlay after a few seconds
    setTimeout(() => {
        if (introOverlay) {
            introOverlay.classList.add('hidden-overlay');
        }
    }, 3200); // 3.2 seconds intro
}


// 9. Projected Shadows
function initShadows() {
    const wrappers = document.querySelectorAll('.object-wrapper');
    wrappers.forEach(wrapper => {
        const img = wrapper.querySelector('img.object');
        if (!img) return;

        // Create shadow clone
        const shadow = img.cloneNode(true);
        shadow.className = 'projected-shadow';
        shadow.id = ''; // Remove ID to avoid duplicates
        shadow.alt = ''; // Decorative

        // Insert as first child (behind object)
        wrapper.insertBefore(shadow, wrapper.firstChild);
    });
}


// 10. Window Celestial Logic (Minecraft Cycle: 10m Day, 7m Night)
const CYCLE_CONFIG = {
    dayDuration: 600, // 10 minutes (seconds)
    nightDuration: 420, // 7 minutes (seconds)
    totalDuration: 1020 // 17 minutes total
};

function updateWindowCelestialState() {
    const windowContainer = document.getElementById('window-container');
    if (!windowContainer) return;

    // Use current time to stay synced across reloads
    const totalSeconds = Math.floor(Date.now() / 1000);
    const secondsInCycle = totalSeconds % CYCLE_CONFIG.totalDuration;

    let isDay = secondsInCycle < CYCLE_CONFIG.dayDuration;
    let progress; // 0 to 1 for the current phase

    if (isDay) {
        windowContainer.classList.add('day-mode');
        windowContainer.classList.remove('night-mode');
        progress = secondsInCycle / CYCLE_CONFIG.dayDuration;
    } else {
        windowContainer.classList.add('night-mode');
        windowContainer.classList.remove('day-mode');
        progress = (secondsInCycle - CYCLE_CONFIG.dayDuration) / CYCLE_CONFIG.nightDuration;
    }

    // Update orbit position via CSS variable (0 = start, 1 = end)
    windowContainer.style.setProperty('--celestial-progress', progress.toFixed(3));
}

// Update frequently for smooth movement
setInterval(updateWindowCelestialState, 1000); // Once per second for logic

window.addEventListener('resize', resizeScene);
window.addEventListener('load', () => {
    resizeScene();
    initGrid();
    initShadows();
    initIntro();
    updateWindowCelestialState();
});
