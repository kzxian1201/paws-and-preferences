🐾 Paws & Preferences

Paws & Preferences is a mobile-first single-page application (SPA) that allows users to discover and “adopt” kittens through an intuitive Tinder-style swipe interface.

Inspired by gesture-driven mobile apps, the project emphasizes data consistency, native-like user experience, and real-world API edge case handling.

🌟 Project Overview (STAR Method)
Situation

The goal was to design an engaging cat discovery experience where users browse a stack of random kitten images.
However, the selected image API (cataas.com) returns non-deterministic image URLs, meaning the same URL may resolve to different images on each request.

This introduced a critical UX issue:

A user could like one cat, but end up sharing or downloading a different one.

Task

Build a robust, production-ready swipe application that:

Supports smooth gesture-based interactions

Ensures 100% consistency between viewed, liked, shared, and downloaded images

Mimics native mobile app behavior while remaining fully responsive

Provides a summary view to manage adopted cats

Action

The solution was engineered using React + Vite, with several deliberate architectural decisions:

🔒 Image Consistency via Blob Handling

Images are fetched as binary Blob data

Converted into stable object URLs using URL.createObjectURL()

Guarantees the image stored in state is exactly the image the user interacted with

📤 Native Sharing with Web Share API

Implemented navigator.share() with dynamically constructed File objects

Enables direct image sharing to native apps (WhatsApp, Telegram, etc.)

Completely avoids sharing unreliable API URLs

🤏 Gesture & Interaction Design

Integrated react-tinder-card with custom logic to:

Prevent ghost swipes

Handle mounting / unmounting race conditions

Added keyboard accessibility (ArrowLeft / ArrowRight) for desktop users

🎨 UI & Styling

Built with Tailwind CSS using a utility-first approach

Clean, modern layout with custom animations (animate-fade-in-up)

Zero layout shifts during swipe interactions

Result

The final application delivers a smooth, native-like experience with:

Zero image mismatches

Consistent user actions across view, share, and download

Fully responsive behavior across mobile and desktop

Production-ready deployment via GitHub Pages

🚀 Key Features

Gesture-Based Navigation
Smooth, physics-based card swiping at ~60fps

Mobile-First Design
Touch-optimized with touch-action: pan-y to prevent scroll interference

Smart Preloading
Images are pre-fetched and cached in memory to eliminate loading spinners

Native Sharing
Uses the device’s native share sheet with real image files

Keyboard Accessibility
Full desktop support via arrow key navigation

Download & Save
Users can download their adopted kittens locally

🛠️ Tech Stack
Frontend

React 19

Vite

Styling

Tailwind CSS

PostCSS

Key Libraries

react-tinder-card – physics-based swipe gestures

react-icons – scalable vector icons

Deployment

GitHub Pages

📦 Installation & Setup
Clone the repository
git clone https://github.com/YOUR_USERNAME/paws-and-preferences.git
cd paws-and-preferences

Install dependencies
npm install

Run development server
npm run dev

Build for production
npm run build

🚢 Deployment

This project is pre-configured for GitHub Pages deployment.

npm run deploy


The vite.config.js file includes the correct base path for repository-based hosting.

📂 Project Structure
src/
├── assets/          # Static assets
├── App.jsx          # Core logic (state, swipe handlers, sharing logic)
├── App.css          # Global styles & animations
├── index.css        # Tailwind directives
└── main.jsx         # React entry point

🧠 Why This Project Matters

Most demo projects work only under ideal API conditions.
This project focuses on what happens when APIs behave unpredictably.

Real-World Engineering Value

Demonstrates defensive frontend engineering against non-deterministic APIs

Shows understanding of browser-level capabilities (Blob, File, Web Share API)

Bridges the gap between prototype UX and production-ready behavior

Prioritizes user trust by ensuring actions always match user intent

Instead of masking problems with fallback data, this project addresses the root cause, making it highly representative of challenges faced in real production systems.

🔮 Future Improvements

Offline-first support using Service Workers

Image metadata tagging (color, breed, mood) for smarter recommendations

Persistent storage via IndexedDB or backend synchronization

User preference learning to adapt swipe ordering over time

Performance telemetry (FPS, interaction latency) for UX analytics

Accessibility enhancements (screen reader optimization, haptics, etc.)

🤝 Contributing

Contributions are welcome and appreciated.

Fork the project

Create your feature branch

git checkout -b feature/AmazingFeature


Commit your changes

git commit -m "Add some AmazingFeature"


Push to the branch

git push origin feature/AmazingFeature


Open a Pull Request