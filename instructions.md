PROJECT: The "100M Founder" Portfolio
Goal: Build a high-performance, narrative-driven portfolio website that signals "top-tier engineering talent."
Tech Stack: Pure HTML5, CSS3 (Modern features), Vanilla JavaScript (ES6+). No heavy frameworks.
1. THE VIBE & AESTHETIC
Concept: "The 2 AM Deep Work State."
The site should feel like entering the quiet, hyper-organized mental space of a builder. It is not just a room; it is a command center.
Color Palette (Tokyo Night / Deep Space):
Background: #0f172a (Slate 900) or #1a1b26 (Deep Navy) - Not pitch black.
Accent Glows: #38bdf8 (Cyan) and #818cf8 (Indigo).
Text: #e2e8f0 (Slate 200) for body, #f8fafc (Slate 50) for headers.
UI Elements: Glassmorphism (semi-transparent dark panels with blur).
Typography:
Headers: Press Start 2P or VT323 (Retro, Coding feel).
Body: Inter or Space Grotesk (Clean, readable, high-trust).
Atmosphere:
Shadows should be soft and diffuse (box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5)).
Animations must be "buttery smooth" (cubic-bezier easing).
2. ARCHITECTURE (CRITICAL)
The website must render two completely different interfaces based on viewport width. Use CSS Media Queries (max-width: 768px) to toggle visibility.
A. DESKTOP VIEW (>768px): "The Command Center"
A static, isometric scene. The user explores the room with their mouse.
Layout: Full-screen relative container.
Interactions: Hovering items creates a "lift" and "glow" effect. Clicking opens a Modal.
Ambient Animation:
The Robot should gently bob up and down (floating).
The Laptop screen should have a "typing" effect or blinking cursor.
The Globe should slowly rotate.
B. MOBILE VIEW (<768px): "The FounderOS" (Gameboy Style)
DO NOT simply shrink the room.
Concept: The user's phone turns into a handheld device browsing an inventory.
Layout:
Header: Pixel status bar (Battery, Time, WiFi).
Viewport (Center): A large card displaying ONE object at a time.
Controls (Bottom): A retro control pad.
[<] [>] arrows to cycle through projects.
[SELECT] button to view details.
Transition: Sliding animations when switching between items.
3. ASSET MAPPING & LOGIC
Data Structure (JavaScript)
Store all content in a const projects array so text is easy to edit later.
Structure: { id, title, category, description, imageSrc, ctaLink, ctaText }
Desktop Positioning (Base Reference)
Note to AI: Use clamp() or % for responsive positioning on different laptop sizes.
Object	Asset Name	Desktop Position (Approx)	Context / Interaction
Desk	desk.png	Bottom Center (x:50%, y:80%)	Base layer (Z-index 1)
Laptop	laptop.png	Center Desk (x:50%, y:62%)	Project: "I like building stuff"
Robot	NAO.png	Right of Laptop (x:60%, y:58%)	Project: AI & Robotics
Globe	globe.png	Left Desk (x:40%, y:60%)	Experience: SAT Bootcamp / Global
Camera	camera.png	Right Shelf (x:77%, y:52%)	Project: Photography API
Books	books.png	Right Shelf (x:75%, y:60%)	Info: Publications / Writing
VR Headset	quest3.png	Left Shelf (x:24%, y:28%)	Project: XR Experiments
Calendar	calendar.png	Left Shelf (x:32%, y:30%)	Action: Book a Call (Calendly)
F1 Car	f1_car.png	High Shelf (x:70%, y:26%)	Passion: F1 Data Analysis
House	cyan_house.png	High Shelf (x:82%, y:26%)	Project: AI Real Estate
Trash Bin	trash_bin.png	Floor (x:48%, y:82%)	Story: Failed Ideas (Humility)
4. UI COMPONENTS
The Modal (Overlay)
Used for displaying project details on both Desktop and Mobile.
Style: Dark Glassmorphism (backdrop-filter: blur(10px)).
Border: Thin 1px border with a subtle gradient (Cyan to Transparent).
Content:
Pixel Art Title.
Clean paragraph text.
"Shiny" CTA Button: A button that looks clickable (slight 3D bevel or glow).
The Mobile Controls
Styled to look like physical buttons (Gameboy/NES vibes).
Add active states in CSS (button goes down when pressed).
5. ANIMATION GUIDELINES
Idle: animation: float 6s ease-in-out infinite; (for floating items).
Hover: transform: translateY(-5px) scale(1.05); filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.6));
Modal Open: animation: modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); (A slight bounce effect).
6. DELIVERABLES
index.html: Semantic structure containing both #desktop-scene and #mobile-os containers.
style.css: All styling, animations, media queries, and responsive logic.
script.js: Logic for the Mobile Carousel (Next/Prev), Data Injection, and Modal handling.