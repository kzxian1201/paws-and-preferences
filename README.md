# 🐾 Paws & Preferences

**Paws & Preferences** is a mobile-first Single Page Application (SPA) that reimagines the cat adoption discovery experience. Built with a "Tinder-style" swipe interface, it emphasizes native-like gesture interactions, strict data consistency, and robust handling of real-world API edge cases.

---

## 💡 Project Background & Engineering Challenges

### The Challenge: Handling Non-Deterministic APIs
The core objective was to build an engaging discovery interface using the `cataas.com` API. However, a critical technical hurdle emerged during development: the API returns non-deterministic image URLs.

This meant that the same URL could resolve to different images on subsequent requests. In a standard implementation, this would lead to a severe UX failure where **a user could "Like" one cat, but end up saving or sharing a completely different image.**

### The Solution: Defensive Architecture
To ensure a production-ready user experience, the application was engineered with several deliberate architectural decisions to bridge the gap between a chaotic API and a reliable UI.

#### 🔒 Data Consistency via Blob Handling
Instead of relying on unstable external URLs, the application intercepts the image data stream:
* **Binary Fetching:** Images are fetched as binary `Blob` data immediately upon load.
* **Stable References:** These blobs are converted into stable `objectURL`s using `URL.createObjectURL()`.
* **Result:** This guarantees 100% consistency. The image stored in the React state is exactly the same binary data the user views, likes, downloads, and shares.

#### 📤 Native Sharing Integration
To solve the sharing discrepancy, the app bypasses standard URL sharing:
* Implemented the **Web Share API** (`navigator.share()`).
* Dynamically constructs `File` objects from the cached blobs.
* Enables direct image sharing to native apps (WhatsApp, Telegram) rather than sharing unreliable links.

---

## 🚀 Key Features

* **Gesture-Based Navigation:** Smooth, physics-based card swiping (integrated with `react-tinder-card`) running at ~60fps.
* **Mobile-First Design:** Touch-optimized with `touch-action: pan-y` handling to prevent scroll interference on mobile devices.
* **Smart Preloading:** Images are pre-fetched and cached in memory to eliminate loading spinners during interaction.
* **Keyboard Accessibility:** Full desktop support allowing users to swipe using `ArrowLeft` and `ArrowRight` keys.
* **Download & Save:** Users can download their adopted kittens locally with zero data mismatch.

---

## 🛠️ Tech Stack

### Frontend Core
* **React 19**
* **Vite**

### Styling & UI
* **Tailwind CSS** (Utility-first architecture)
* **PostCSS**
* **CSS Modules** (for specific animation scoping)

### Key Libraries
* `react-tinder-card`: Physics-based swipe gestures.
* `react-icons`: Scalable vector iconography.

---

## 🧠 Engineering Insights

**Why this project matters:**
Most demo projects operate under ideal API conditions. This project focuses on defensive frontend engineering—handling what happens when APIs behave unpredictably.

It demonstrates a deep understanding of browser-level capabilities (Blob, File API, Web Share API) and prioritizes **user trust** by ensuring every action (swipe, save, share) reflects the user's actual intent.

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/paws-and-preferences.git](https://github.com/YOUR_USERNAME/paws-and-preferences.git)
   cd paws-and-preferences

2. **Install dependencies** 
   ```bash
   npm install

3. **Run development server**
   ```bash
   npm run dev

4. **Build for production**
   ```bash
   npm run build

---

## 📂 Project Structure
    src/
    ├── assets/          # Static assets
    ├── App.jsx          # Core logic (state, swipe handlers, sharing logic)
    ├── App.css          # Global styles & animations
    ├── index.css        # Tailwind directives
    └── main.jsx         # React entry point

---

## 🔮 Future Improvements
* **Offline-First:**  Implementing Service Workers for PWA capabilities.
* **Smart Recommendations:** Using image metadata to learn user preferences (color, breed).
* **Persistence:** Persistence: Storing `adopted` cats via IndexedDB or local storage.
* **Performance Telemetry:** Monitoring FPS and interaction latency.
 


