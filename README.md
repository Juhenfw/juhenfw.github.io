<div align="right">
  🇺🇸 <strong>English</strong> | <a href="README.id.md">🇮🇩 Bahasa Indonesia</a>
</div>

# 🧠 Neural Network Portfolio

> **"Bridging academic knowledge with real-world innovation."**

A **Sci-Fi / Cyberpunk** themed interactive portfolio website that simulates a "Digital Cortex" interface. Built to showcase profile, research, and technical projects using a connected data node visual style.

🌐 **Live Demo:** [juhenfw.github.io](https://juhenfw.github.io)

![Portfolio Preview](preview_web.gif)

---

## ✨ Key Features

* **Interactive Neural Network:** Dynamic, magnetic particle background using **Vanilla Canvas API** that responds to mouse movement and creates laser-like synapses — no external library needed.
* **Modular Architecture:** Refactored into pure **ES6 Modules** for clean separation of concerns (UI, Rendering, State Management).
* **High-Performance Rendering:** Implements the **Intersection Observer API** for scroll-triggered animations, ensuring zero lag and maximum battery efficiency. Animation automatically pauses when the tab is inactive.
* **Accessibility (WCAG AA):** Full keyboard navigation, ARIA roles on all dialogs and tabs, screen-reader labels on icons and form inputs, and focus management on modal open/close.
* **Single-Page Dashboard:** Immersive dashboard interface (desktop) that feels like a native app or terminal.
* **Centralized Data Management:** All content (Profile, Experience, Skills) is managed via a single JSON file (`mind.json`).
* **Glassmorphism UI:** Modern design with blur effects, neon glowing borders, and futuristic typography.
* **SEO & Social Ready:** Fully equipped with Open Graph meta tags for professional link previews on LinkedIn, Twitter, and messaging apps.

---

## 🛠️ Technology Stack

Built with pure **Vanilla Web Technologies** for maximum performance, proving that no heavy frameworks are required for a high-fidelity web experience.

* **HTML5:** Semantic Structure & Open Graph SEO.
* **CSS3:** Flexbox, Grid, CSS Variables, Native Crosshair Cursor, Keyframe Animations.
* **JavaScript (ES6+):** ES6 Modules (`import/export`), Intersection Observer API, Fetch API for JSON.
* **Vanilla Canvas API:** Custom WebGL-free particle mesh background — replaces the previous P5.js dependency (~800KB saved), with `prefers-reduced-motion` support and tab-visibility pause.
* **Font Awesome:** Vector Icons.
* **Google Fonts:** 'Space Grotesk' & 'JetBrains Mono'.

---

## 📂 Project Structure

The project is structured using Software Engineering best practices for vanilla web development:

```plaintext
juhenfw.github.io/
│
├── index.html          # Main Dashboard & Meta Tags
├── style.css           # Global Styles & Variables (Cyberpunk Theme)
├── robots.txt          # Crawler instructions
├── sitemap.xml         # URL index for search engines
│
├── assets/             # Image Assets (Profile, Logo, Documents)
│
├── data/
│   └── mind.json       # 🧠 THE BRAIN (Single source of truth for content)
│
├── js/                 # ES6 Module System
│   ├── main.js         # Entry point & bootstrapper
│   ├── ui.js           # Window/panel/tab control & focus management
│   ├── renderer.js     # HTML template generators for nodes & archive table
│   ├── observer.js     # Intersection Observer for scroll animations
│   └── sketch.js       # Vanilla Canvas particle background
│
└── blog/               # Separate Blog System
    ├── template-blog.html  # Master template for new articles
    ├── blog-style.css      # Specialized CSS for reading mode
    └── article-01.html     # Example article
```

---

## 🚀 Installation & Usage

Follow these steps to run the website on your local machine:

### 1. Clone the Repository
```bash
git clone [https://github.com/juhenfw/juhenfw.github.io.git](https://github.com/juhenfw/juhenfw.github.io.git)
cd juhenfw.github.io
```

### 2. Run Local Server
Since this website uses ES6 Modules (`type="module"`) and fetches an external JSON file (`mind.json`), you **cannot** simply double-click `index.html`. You need a local server to avoid CORS errors.

* **Using VS Code (Recommended):**
    1.  Install the **"Live Server"** extension.
    2.  Right-click `index.html`.
    3.  Select **"Open with Live Server"**.

* **Using Python:**
    ```bash
    # Run this command in the project folder
    python -m http.server 8000
    ```
    Then open `http://localhost:8000` in your browser.

---

## ⚙️ Customization Guide

### Step 1: Identity & Branding
Replace the default images in the `assets/images/` folder:
* `profile/profile.jpg`: Your profile picture (Recommended ratio 1:1, max 400px).
* `logo/logo.png`: Your site favicon and Open Graph preview image.

### Step 2: Content Management (The Mind)
Open **`data/mind.json`**. This is the single source of truth for your data. You don't need to touch the HTML or JS to update your experience or skills.

**Example Data Structure:**
```json
{
  "profile": {
    "name": "Your Name",
    "role": "Your Job Title",
    "tagline": "Your short bio..."
  },
  "nodes": [
    {
      "id": "exp-company-a",
      "type": "experience",  // Options: experience, research, project, skill, blog
      "title": "Software Engineer",
      "priority": 9          // System sorting weight
    }
  ]
}
```

### Step 3: Writing a New Blog Post
1.  Go to the `blog/` folder.
2.  Duplicate the `template.html` file.
3.  Rename it (e.g., `my-new-project.html`).
4.  Edit the HTML content. The template supports terminal-style code blocks, responsive data tables, and video embeds.
5.  Register the new article in `data/mind.json` with `"type": "blog"`.

---

## 🎨 Color Palette (CSS Variables)

You can easily change the color theme by editing `:root` variables in `style.css`:

```css
:root {
    --color-accent: #00ffc8;      /* Main Neon Cyan */
    --color-research: #00d2ff;    /* Research nodes */
    --color-project: #ffd200;     /* Project nodes */
    --color-blog: #d500f9;        /* Blog nodes */
    --bg-color: #080B10;          /* Deep Dark Background */
}
```

---

## 🤝 Contribution

Contributions are welcome! If you find a bug or want to add a feature:
1.  Fork this repository.
2.  Create a feature branch (`git checkout -b feature-name`).
3.  Commit your changes.
4.  Push to the branch.
5.  Create a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. Feel free to use, modify, and redistribute for personal or commercial projects. Attribution is appreciated but not required.

---

<p align="center">
  Built with 💻 and ☕ by <strong>Juhen Fashikha Wildan</strong>
</p>