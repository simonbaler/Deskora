# 🌿 Deskora — Find a Space You'll Love

> **A thoughtfully curated boutique workspace discovery experience for focused days, creative sessions, and productive work.**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Render Ready](https://img.shields.io/badge/Render-Deploy_Ready-46E3B7.svg?logo=render&logoColor=white)](https://render.com)

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [UI / UX Design Philosophy](#-ui--ux-design-philosophy)
3. [Colour Palette & Dual Theme System](#-colour-palette--dual-theme-system)
4. [Animations & Motion Design](#-animations--motion-design)
5. [Cinematic Audio System (Web Audio API)](#-cinematic-audio-system-web-audio-api)
6. [Voice Companion & Speech Synthesis](#-voice-companion--speech-synthesis)
7. [Curated Workspaces Dataset](#-curated-workspaces-dataset)
8. [Technology Stack](#-technology-stack)
9. [Project Architecture](#-project-architecture)
10. [Render Deployment Guide](#-render-deployment-guide)
11. [Local Development](#-local-development)
12. [Accessibility & Performance](#-accessibility--performance)
13. [License](#-license)

---

## 🌟 Overview

**Deskora** is an editorial-grade boutique web application crafted to help knowledge workers, creatives, and independent founders discover serene, productive workspaces. Designed with an emphasis on emotional warmth, acoustic tranquility, and sensory polish, Deskora merges modern frontend engineering with bespoke interactive craftsmanship:

- 🏛️ **Editorial Design**: Warm romantic typography paired with disciplined, modern geometry.
- 🌓 **True Dual-Theme Engine**: Hand-calibrated Light and Dark palettes with zero inverted slop.
- 🔊 **Procedural Cinematic Audio**: Built entirely on the Web Audio API without bulky audio assets.
- 🎙️ **Warm & Natural Voice Companion**: Native browser speech synthesis tuned for clarity, charm, and Indian English cultural familiarity (with correct Rupee pronunciations).
- ⚡ **Zero-Lag React 19 Architecture**: Built on Vite with client-side state caching, smooth spring physics, and mobile-first responsive viewports.

---

## 🎨 UI / UX Design Philosophy

Deskora rejects generic "AI slop" interfaces (monotonous purple gradients, uniform pill cards, and cookie-cutter dashboard widgets) in favor of a cohesive, bespoke visual and sensory experience:

### 1. Viewport Presence & Visual Hierarchy
- **Above-the-Fold Impact**: The hero section establishes an immediate sense of quiet focus through organic radial blooms, floating decorative badges, an animated interactive logo, and the **Voice Welcome Orb**.
- **Editorial Typography Pairing**:
  - **Headings**: *Playfair Display* serif font, infusing literary warmth, romance, and hospitality.
  - **Interface & Body**: *Plus Jakarta Sans*, a geometric neo-grotesque typeface offering crisp legibility at all device pixel densities.

### 2. Zero-Pill Discipline & Tailored Card Surfaces
- **Structural Identity**: Cards feature subtle, tactile borders (`border-subtle`), generous internal padding, and structured rectangular contours with softened radiuses (`rounded-2xl` and `rounded-3xl`), avoiding repetitive pill-heavy layouts.
- **Micro-Interactions**:
  - Interactive cards elevate smoothly on hover with a compound shadow lift (`deskora-shadow-md` → `deskora-shadow-elevated`).
  - Workspaces feature dual imagery states: crisp loaded views with subtle zoom transforms (`scale-105`) on cursor interaction.
  - Interactive magnetic buttons adapt to cursor proximity on desktop environments.

### 3. Custom Fluid Cursor
- **Dual-Ring Desktop Cursor**: A central active dot paired with a delayed, softly trailing halo follower (`mix-blend-mode: exclusion` / smooth transform lerp).
- Automatically scales and shifts hue when hovering over clickable cards, sound toggles, and voice triggers.
- Fully disabled on touch/mobile devices (`pointer: coarse`) to conserve battery and avoid UI interference.

---

## 🎨 Colour Palette & Dual Theme System

Deskora features a **genuine, hand-crafted dual-theme system**. Dark mode is an intentional dark-luxe experience rather than a crude CSS color inversion.

### Light Theme — *Morning Atelier*
Designed around natural sunlight, warm linen, and soft floral accents:
- **Base Canvas (`--bg-primary`)**: `#FFFCFA` *(Soft warm eggshell white)*
- **Secondary Canvas (`--bg-secondary`)**: `#FFF8F6` *(Gentle blush morning tint)*
- **Surfaces & Cards (`--surface-primary`)**: `#FFFFFF` *(Pristine warm white)*
- **Elevated Surfaces (`--surface-elevated`)**: `#FFFFFF` *(Elevated floating cards)*
- **Primary Typography (`--text-primary`)**: `#252126` *(Deep warm charcoal)*
- **Secondary Typography (`--text-secondary`)**: `#6F6870` *(Soft graphite stone)*
- **Muted Typography (`--text-muted`)**: `#9C949B` *(Subtle warm slate)*
- **Borders & Dividers (`--border-subtle`)**: `#F0E8EA` *(Delicate blush contour)*

### Dark Theme — *Obsidian Velvet*
Designed to evoke late-night focused studios with controlled candlelit accents:
- **Base Canvas (`--bg-primary`)**: `#0D0B0F` *(Deep obsidian dusk)*
- **Secondary Canvas (`--bg-secondary`)**: `#131017` *(Rich espresso charcoal)*
- **Surfaces & Cards (`--surface-primary`)**: `#151218` *(Dark velvet surface)*
- **Elevated Surfaces (`--surface-elevated`)**: `#1C1820` *(Elevated dark slate)*
- **Primary Typography (`--text-primary`)**: `#FAF5F7` *(Warm alabaster white)*
- **Secondary Typography (`--text-secondary`)**: `#B5ADB7` *(Gentle warm lavender-gray)*
- **Muted Typography (`--text-muted`)**: `#827A84` *(Muted graphite dust)*
- **Borders & Dividers (`--border-subtle`)**: `#28212D` *(Subtle plum-tinted dark border)*

### Shared Accent Palette
Both themes celebrate Deskora's signature romantic spectrum:
- 🌸 **Rose**: `#F4A6B5` / `#EFA7B5`
- 🍑 **Coral**: `#F39A8C`
- 🍈 **Peach**: `#F8C7A4` / `#F7C3A3`
- 🪻 **Lavender**: `#C9B9E9` / `#B79FE4`
- 🌷 **Blush**: `#F6D8DF`

### Instant Theme Persistence & Anti-FOUC
A pre-hydration inline script in `index.html` inspects `localStorage` (`deskora_theme`) and matches system color schemes before React mounts, completely eliminating flashes of unstyled content (FOUC).

---

## 🎬 Animations & Motion Design

All animations are orchestrated using **Motion** (`motion/react`) with calibrated cubic-bezier easing and spring physics:

### 1. Launch Sequence (`AppLoader`)
- A 1.2s to 1.45s cinematic launch orchestration.
- Pulsing concentric rings with gradient stroke offsets.
- Dynamic numerical count-up (`0%` → `100%`) reflecting real asset initialization.
- Graceful dissolve transition into the hero canvas (`AnimatePresence mode="wait"`).

### 2. The Voice Welcome Orb
- **Breathing Aura**: Continuous, gentle radial pulse (`scale: [1, 1.06, 1]`) in synchronized 3.5s cycles.
- **Waveform Activity**: 4 interactive audio visualizer bars that bounce dynamically when the voice engine is actively speaking.
- **Hover Responsiveness**: Shimmering gradient shift with a subtle lift on pointer hover.

### 3. Animated Theme Toggle
- Fluid morph between Sun and Moon iconography with a 360-degree rotation and smooth scale dampening (`type: 'spring', damping: 15`).
- Global page color transitions smoothly via CSS variables in `0.25s cubic-bezier(0.16, 1, 0.3, 1)`.

### 4. Interactive Card & Modal Springs
- **Heart Favorite Button**: Spring scale snap (`scale: 1.35` → `1.0`) with an expanding burst aura when saving spaces.
- **Modals (Quick Preview, Voice Settings, How It Works)**:
  - Backdrop blur with smooth fade-in (`opacity: 0` → `1`).
  - Spring-driven dialog scale-up (`scale: 0.94` → `1.0`) with exit transitions.
- **Accessibility Safeguard**: `prefers-reduced-motion` is strictly respected across all styles and motion hooks, reducing motion to instantaneous transitions.

---

## 🔊 Cinematic Audio System (Web Audio API)

Deskora features a **100% synthesized procedural sound engine** built with the HTML5 Web Audio API. 

> **Important Audio Ethics**:
> - Audio is **OFF by default** (persisted in `localStorage: deskora_sound_enabled`).
> - Never autoplays audio unprompted.
> - Zero MP3 or WAV network payload overhead.
> - High-fidelity acoustic tone generator with low-pass filters and exponential decay gain envelopes.

### Procedural Sound Palette

| Sound Event | Synthesis Character | Harmonic Composition |
| :--- | :--- | :--- |
| `APP_OPEN` | Soft cinematic warm startup chord | Dual sine wave (A3 220Hz + E4 329.6Hz) with smooth 0.7s decay |
| `LOADER_COMPLETE` | Warm confirmation chime | Ascending two-tone bell (523.25Hz → 659.25Hz) |
| `BUTTON_PRESS` | Soft tactile click | High-pass filtered sine pop (380Hz, 35ms duration) |
| `BUTTON_HOVER` | Ultra-subtle tick | Micro-frequency transient (620Hz, 15ms duration) at 2% volume |
| `FAVORITE` | Harmonic rising bell chime | Triple arpeggio chord (E5 659Hz → G#5 830Hz → B5 987Hz) |
| `FAVORITE_REMOVE` | Soft descending release | Dual tone descent (520Hz → 390Hz) with 0.18s decay |
| `FILTER_SELECT` | Subtle UI click | Snappy filtered frequency blip (440Hz → 554Hz) |
| `SEARCH` | Focused keystroke sound | Gentle muted pulse (480Hz, 25ms duration) |
| `MODAL_OPEN` | Cinematic soft transition | Low-resonance warm sweep (260Hz → 440Hz) |
| `MODAL_CLOSE` | Soft reverse transition | Reverse filtered descent (440Hz → 260Hz) |
| `ASSISTANT_OPEN` | Digital warm greeting | Dual pleasant bell tone (587Hz → 880Hz) |
| `VOICE_ACTIVATE` | Ethereal frequency chime | Triple rising chime with gentle resonance |
| `VOICE_COMPLETE` | Gentle landing tone | Soft grounding resolution chord |
| `THEME_CHANGE` | Velvet harmonic shift | Warm dual-resonance acoustic shift (330Hz → 493Hz) |

### Intelligent Voice Ducking
When the voice companion or speech synthesis is actively vocalizing, micro UI hover and button click sounds are automatically suppressed to ensure the vocal track remains crisp, transparent, and pleasant.

---

## 🎙️ Voice Companion & Speech Synthesis

The Deskora Voice experience is powered by the browser-native `window.speechSynthesis` API, completely free of external third-party API dependencies or keys.

### 1. Voice Personality
- **Tone**: Warm, youthful, friendly, gentle, slightly playful, and polished.
- **Cadence**: Relaxed, natural delivery calibrated at **0.94x speech rate** and **1.12x pitch modulation**.
- **No Robotic Monotone**: Avoids sterile browser defaults through punctuation pauses and conversational phrasing.

### 2. Multi-Criteria Voice Scoring Algorithm
The voice engine scans all available system voices (`speechSynthesis.getVoices()`) and scores them through weighted heuristics:
1. **Language Affinity**: Prefers English (`en`, `en-US`, `en-IN`, `en-GB`).
2. **Indian Audience Familiarity**: Highly scores clear Indian English voices without unnatural accents.
3. **Gender & Tone Descriptors**: Detects natural-sounding, youthful voice labels (`natural`, `samantha`, `serena`, `karen`, `moira`, `veena`, `neerja`, `rishi`).
4. **Local Engine Priority**: Balances cloud and local voices for zero-latency playback.

### 3. Rupee Currency Translation
Raw currency strings like `₹499/day` are automatically sanitized into conversational English before synthesis:
- `₹499/day` → *"four hundred and ninety-nine rupees per day"*
- `₹699` → *"six hundred and ninety-nine rupees"*

### 4. Interactive Voice Controls & Auditioning
- **Voice Welcome Orb**: Positioned in the hero; clicking it greets the user and introduces Deskora.
- **Voice Settings Modal**: Allows users to switch speed presets (**Gentle** `0.88x`, **Natural** `0.94x`, **Fast** `1.05x`), select an alternate system voice, or click **"Preview voice"** to audition the voice profile instantly.
- **Voice Assistant Modal**: Conversational Q&A modal with suggested prompts for pricing, locations, and quiet study spaces.

---

## 🛋️ Curated Workspaces Dataset

Deskora features a curated collection of **5 distinctive workspaces** situated across prominent creative and tech corridors in Hyderabad, India:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DESKORA WORKSPACES                             │
├─────────────────┬────────────────────────┬──────────────┬────────┬──────────┤
│ Name            │ Location               │ Rate         │ Rating │ Vibe     │
├─────────────────┼────────────────────────┼──────────────┼────────┼──────────┤
│ The Sunlit      │ Jubilee Hills,         │ ₹499 / day   │ 4.9 ★  │ Warm &   │
│ Atelier         │ Hyderabad              │              │        │ Inspiring│
├─────────────────┼────────────────────────┼──────────────┼────────┼──────────┤
│ Maison          │ Banjara Hills,         │ ₹599 / day   │ 4.8 ★  │ Greenery │
│ Botanica        │ Hyderabad              │              │        │ & Light  │
├─────────────────┼────────────────────────┼──────────────┼────────┼──────────┤
│ Velvet Study    │ Madhapur,              │ ₹449 / day   │ 4.7 ★  │ Deep     │
│ House           │ Hyderabad              │              │        │ Quiet    │
├─────────────────┼────────────────────────┼──────────────┼────────┼──────────┤
│ The Glasshouse  │ Gachibowli,            │ ₹699 / day   │ 4.9 ★  │ Modern   │
│ Collective      │ Hyderabad              │              │        │ Collab   │
├─────────────────┼────────────────────────┼──────────────┼────────┼──────────┤
│ Kissa Corner    │ Hitech City,           │ ₹549 / day   │ 4.8 ★  │ Boutique │
│ Studio          │ Hyderabad              │              │        │ Focus    │
└─────────────────┴────────────────────────┴──────────────┴────────┴──────────┘
```

---

## 💻 Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Latest React version with hooks, concurrent rendering, and fast mounting |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) | Strict type-safety, clean component interfaces, and zero compilation warnings |
| **Bundler** | [Vite 6](https://vitejs.dev/) | Ultra-fast Hot Module Replacement (HMR) and optimized Rollup production builds |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Next-generation CSS engine with custom `@variant dark`, CSS variables, and zero runtime overhead |
| **Motion** | [Motion](https://motion.dev/) (`motion/react`) | Spring physics, exit transitions, and responsive layout animations |
| **Iconography** | [Lucide React](https://lucide.dev/) | Feather-light, accessible SVG icons |
| **Audio** | HTML5 Web Audio API | Zero-dependency, client-side synthesized sound design |
| **Speech** | Web Speech API | Client-side text-to-speech with heuristic voice matching |

---

## 📁 Project Architecture

```
deskora/
├── index.html                  # HTML entry point with anti-FOUC theme script & metadata
├── render.yaml                 # Render Infrastructure-as-Code Blueprint
├── package.json                # Project dependencies and deployment scripts
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite configuration with Tailwind CSS plugin
├── LICENSE                     # Apache 2.0 Open Source License
├── README.md                   # Complete application documentation
│
└── src/
    ├── main.tsx                # Application mounting entry point
    ├── App.tsx                 # Root application coordinator & state orchestration
    ├── index.css               # Design tokens, CSS variables, and global keyframes
    ├── types.ts                # TypeScript domain models, themes, and sound types
    │
    ├── context/                # React Context Providers
    │   ├── FavoritesContext.tsx # Saved workspaces state with localStorage persistence
    │   ├── ThemeContext.tsx     # Light/Dark mode state management & HTML class toggling
    │   └── ToastContext.tsx     # Non-blocking notification toasts
    │
    ├── data/
    │   └── workspaces.ts       # Curated 5-workspace dataset
    │
    ├── lib/                    # Core engines & utilities
    │   ├── sound.ts            # Web Audio API synthesizer & sound palette
    │   ├── voiceController.ts  # Web Speech API engine & scoring algorithm
    │   └── voiceCoordination.ts# Audio/Voice concurrency & ducking coordinator
    │
    └── components/
        ├── assistant/          # FAQ chatbot & conversational assistant
        ├── cursor/             # Custom trailing dot-and-ring desktop cursor
        ├── landing/            # Hero, Header, Footer, How It Works modal
        ├── layout/             # AppShell and responsive MobileBottomBar
        ├── loading/            # AppLoader cinematic launch sequence & skeletons
        ├── search/             # Search bar, Filter chips, and Empty states
        ├── sound/              # SoundToggle button with state indicator
        ├── theme/              # Animated Sun/Moon ThemeToggle button
        ├── ui/                 # MagneticButton, AnimatedLogo, ErrorBoundary, Button
        ├── voice/              # VoiceWelcomeOrb, VoiceAssistantModal, VoiceSettingsModal
        └── workspace/          # WorkspaceCard, Grid, QuickPreview modal, Rating
```

---

## 🚀 Render Deployment Guide

Deskora is fully primed for zero-configuration deployment to [Render](https://render.com).

### Option 1: One-Click Render Blueprint (Recommended)

1. Push your repository to **GitHub** or **GitLab**.
2. Log in to your [Render Dashboard](https://dashboard.render.com).
3. Click **New +** → **Blueprint**.
4. Connect your Deskora repository.
5. Render will automatically detect `render.yaml` and configure:
   - **Service Type**: Static Site
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **SPA Routing Rewrite**: `/*` → `/index.html`
   - **HTTP Security Headers**: `X-Frame-Options`, `X-Content-Type-Options`, Cache-Control
6. Click **Apply** to deploy!

### Option 2: Manual Static Site Setup on Render

1. On the Render Dashboard, click **New +** → **Static Site**.
2. Connect your Git repository.
3. Configure the following build settings:
   - **Name**: `deskora`
   - **Branch**: `main` (or your active default branch)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. In the **Redirects / Rewrites** tab:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
5. Click **Create Static Site**. Render will build and deploy your site to an `https://deskora.onrender.com` URL with free automated SSL.

---

## 🛠️ Local Development

### Prerequisites
- Node.js (version 18.0.0 or later)
- npm, yarn, or pnpm

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/deskora.git
   cd deskora
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   The app will run locally at `http://localhost:3000`.

4. **Verify TypeScript & Production Build:**
   ```bash
   npm run lint
   npm run build
   ```

5. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

---

## ♿ Accessibility & Performance

- **WCAG 2.1 AA Compliance**: All text colors across both light and dark themes meet or exceed the standard 4.5:1 contrast ratio against their respective surface backgrounds.
- **Touch-First Ergonomics**: All interactive elements (sound toggle, theme switch, filter chips, navigation tabs, voice controls) provide a minimum hit target of **44x44px** on mobile viewports.
- **ARIA & Keyboard Navigation**: Modals feature `aria-modal="true"`, focus management, `Escape` key listeners, and accessible `aria-label` / `aria-pressed` states on toggles.
- **Reduced Motion Support**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- **Zero Asset Bloat**: Audio and typography are generated procedurally or streamed through optimized font subsets, ensuring exceptional Google Lighthouse performance scores.

---

## 📄 License

This project is licensed under the **Apache License 2.0**.  
See the [LICENSE](./LICENSE) file for full license terms and conditions.

```
Copyright 2026 Deskora Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

---

<p align="center">
  Crafted with care, quiet focus, and warm hospitality for <strong>Deskora</strong>.
</p>
