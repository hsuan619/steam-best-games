# Game Discovery Hub

Welcome to the **Game Discovery Hub**! This is a modern, React-based web application built with **Vite** and styled with **Tailwind CSS v4**. It features a stunning interface to browse game recommendations, dynamic community blog posts from Threads, and detailed game overviews.

## 🚀 Live Demo
[Check out the live website on GitHub Pages!](https://hsuan619.github.io/steam-best-games/)

---

## 💻 Running the Project Locally

To run this project on your own computer, follow these step-by-step instructions.

### Prerequisites
Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended). Download from [Node.js Official Website](https://nodejs.org/).
- **Git** (to clone the repository). Download from [Git Official Website](https://git-scm.com/).

### Installation Steps

1. **Clone the repository:**
   Open your terminal (PowerShell, Command Prompt, or MacOS Terminal) and run:
   ```bash
   git clone [https://github.com/hsuan619/seo_game.git](https://github.com/hsuan619/steam-best-games.git)
   cd steam-best-games
   ```

2. **Install dependencies:**
   Run the following command to download all required packages:
   ```bash
   npm install
   ```

3. **Start the development server:**
   Once the installation is complete, start the app:
   ```bash
   npm run dev
   ```

4. **View the app:**
   Open your browser and navigate to `http://localhost:5173` (or the URL provided in your terminal). You should now see the Game Discovery Hub running locally!

---

## 🛠 Features Included
*   **Dynamic Routing:** Seamlessly navigate between `Home`, `Browse`, `Blog`, and `Game Detail` using React Router.
*   **Interactive UI:** High-quality modern aesthetics featuring glassmorphism, dynamic scrolling `Trending` cards, and immersive video modals.
*   **Real Data Integration:** Community game recommendations scraped directly from Threads and backed by accurate Official Steam data (tags, images, descriptions).
*   **Responsive Design:** Fully responsive tailwind classes ensuring a fluid experience across desktop, tablet, and mobile devices.

## 📦 Deployment
This project is configured to be seamlessly deployed to GitHub Pages. To push a new updated version:
```bash
npm run deploy
```
*(This command automatically builds the project into the `dist` folder and serves it on the `gh-pages` branch).*
