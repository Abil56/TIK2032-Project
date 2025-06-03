// Performance Monitoring
let lastFrame = performance.now();
let fps = 0;
const updateFPS = () => {
  const now = performance.now();
  fps = Math.round(1000 / (now - lastFrame));
  lastFrame = now;
  requestAnimationFrame(updateFPS);
};
updateFPS();

// Loader
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader");
  const percent = document.querySelector(".load-percent");
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    percent.textContent = `${progress}%`;
    if (progress >= 100) {
      clearInterval(interval);
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 500);
    }
  }, 150);
});

// Particle System
const canvas = document.getElementById("particle-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = [];
  const particleCount = 50;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
    }
    update(mouse) {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      if (mouse.x && mouse.y) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.speedX += dx / dist;
          this.speedY += dy / dist;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = document.body.classList.contains("neon-theme")
        ? "#ff00ff"
        : "#5c95ff";
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  const mouse = { x: null, y: null };
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update(mouse);
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// About Text Animation
const textSpans = document.querySelectorAll(".about-text .text-span");
textSpans.forEach((span, index) => {
  span.style.animationDelay = `${index * 0.2}s`;
});

const aboutPhoto = document.querySelector(".about-photo img");
if (aboutPhoto) {
  aboutPhoto.addEventListener("mouseenter", () => {
    textSpans.forEach((span) => {
      span.classList.add("pulse");
      setTimeout(() => span.classList.remove("pulse"), 500);
    });
  });
}

// Scroll Reveal
const revealElements = document.querySelectorAll(".scroll-reveal");
const revealOnScroll = () => {
  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      el.classList.add("visible");
    }
  });
};
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// Theme Toggle
const themeBtn = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themes = ["dark", "light", "neon", "hacker"];
let currentTheme = localStorage.getItem("theme") || "dark";

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    currentTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
    document.body.className = `${currentTheme}-theme`;
    themeIcon.textContent =
      currentTheme === "light"
        ? "☀️"
        : currentTheme === "neon"
        ? "⭐"
        : currentTheme === "hacker"
        ? "💾"
        : "🌙";
    localStorage.setItem("theme", currentTheme);
  });
  if (currentTheme !== "dark") {
    document.body.className = `${currentTheme}-theme`;
    themeIcon.textContent =
      currentTheme === "light" ? "☀️" : currentTheme === "neon" ? "⭐" : "💾";
  }
}

// Custom Cursor
const cursor = document.createElement("div");
cursor.classList.add("custom-cursor");
document.body.appendChild(cursor);

document.addEventListener("mousemove", (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

document.querySelectorAll("a, button, .gallery-item").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
});

// Gallery Lightbox
const galleryImages = document.querySelectorAll(".gallery-item img");
const lightbox = document.createElement("div");
lightbox.classList.add("lightbox");
document.body.appendChild(lightbox);

let currentImageIndex = 0;
galleryImages.forEach((img, index) => {
  img.addEventListener("click", () => {
    currentImageIndex = index;
    openLightbox(
      img.dataset.src,
      img.alt,
      galleryImages[index].parentElement.querySelector(".caption").textContent
    );
  });
});

function openLightbox(src, alt, caption) {
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <span class="lightbox-close" aria-label="Close lightbox">×</span>
      <img src="${src}" alt="${alt}" class="lightbox-img" />
      <span class="lightbox-caption">${caption}</span>
      <span class="lightbox-prev" aria-label="Previous image">←</span>
      <span class="lightbox-next" aria-label="Next image">→</span>
      <button class="lightbox-zoom" aria-label="Toggle zoom">🔍</button>
      <button class="lightbox-play" aria-label="Start slideshow">▶</button>
    </div>
  `;
  lightbox.style.display = "flex";
  document.body.style.overflow = "hidden";

  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");
  const zoomBtn = lightbox.querySelector(".lightbox-zoom");
  const playBtn = lightbox.querySelector(".lightbox-play");
  let isZoomed = false;
  let slideshowInterval = null;

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => {
    currentImageIndex =
      (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
  });
  nextBtn.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightbox();
  });
  zoomBtn.addEventListener("click", () => {
    isZoomed = !isZoomed;
    const img = lightbox.querySelector(".lightbox-img");
    img.style.transform = isZoomed ? "scale(2)" : "scale(1)";
  });
  playBtn.addEventListener("click", () => {
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      slideshowInterval = null;
      playBtn.textContent = "▶";
    } else {
      slideshowInterval = setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightbox();
      }, 3000);
      playBtn.textContent = "⏸";
    }
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", handleLightboxKeys);
}

function updateLightbox() {
  const img = galleryImages[currentImageIndex];
  const caption = img.parentElement.querySelector(".caption").textContent;
  lightbox.querySelector(".lightbox-img").src = img.dataset.src;
  lightbox.querySelector(".lightbox-img").alt = img.alt;
  lightbox.querySelector(".lightbox-caption").textContent = caption;
}

function closeLightbox() {
  lightbox.style.display = "none";
  document.body.style.overflow = "";
  document.removeEventListener("keydown", handleLightboxKeys);
}

function handleLightboxKeys(e) {
  if (e.key === "ArrowLeft") {
    currentImageIndex =
      (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
  } else if (e.key === "ArrowRight") {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightbox();
  } else if (e.key === "Escape") {
    closeLightbox();
  }
}

// Gallery Filter
const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    document.querySelectorAll(".gallery-item").forEach((item) => {
      item.style.animation = "none";
      if (filter === "all" || item.dataset.category === filter) {
        item.style.display = "";
        setTimeout(() => {
          item.style.animation = "fadeInSection 0.5s ease";
        }, 10);
      } else {
        item.style.display = "none";
      }
    });
  });
});

// Lazy Loading
const lazyImages = document.querySelectorAll(".lazy");
const lazyLoad = () => {
  lazyImages.forEach((img) => {
    if (img.getBoundingClientRect().top < window.innerHeight * 1.2) {
      img.src = img.dataset.src;
      img.classList.remove("lazy");
    }
  });
};
window.addEventListener("scroll", lazyLoad);
lazyLoad();

// Blog Search
const searchInput = document.getElementById("blog-search");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll(".blog-preview").forEach((post) => {
      const title = post.querySelector("h3").textContent.toLowerCase();
      const desc = post
        .querySelector(".preview-text")
        .textContent.toLowerCase();
      post.style.display =
        title.includes(query) || desc.includes(query) ? "" : "none";
    });
  });
}

// Blog Read More
document.querySelectorAll(".read-more").forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.parentElement;
    text.classList.toggle("expanded");
    btn.textContent = text.classList.contains("expanded")
      ? "Read Less"
      : "Read More";
  });
});

// Blog Meta
document.querySelectorAll(".blog-preview").forEach((post) => {
  const text = post.querySelector(".preview-text").textContent;
  const words = text.split(/\s+/).length;
  const readTime = Math.ceil(words / 200);
  post.querySelector(".word-count").textContent = `${words} words`;
  post.querySelector(".read-time").textContent = `${readTime} min read`;
});

// Blog Comments
document.querySelectorAll(".comment-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const comments = btn.nextElementSibling;
    comments.style.display =
      comments.style.display === "none" ? "block" : "none";
  });
});

document.querySelectorAll(".comment-form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const textarea = form.querySelector("textarea");
    const comment = textarea.value.trim();
    if (comment) {
      const list = form.nextElementSibling;
      const id = `${
        form.closest(".blog-preview").querySelector("h3").textContent
      }-${Date.now()}`;
      localStorage.setItem(id, comment);
      const p = document.createElement("p");
      p.textContent = comment;
      list.appendChild(p);
      textarea.value = "";
      form
        .closest(".comment-section")
        .querySelector(
          ".comment-toggle"
        ).textContent = `Comments (${list.children.length})`;
    }
  });
});

// Load Comments
document.querySelectorAll(".blog-preview").forEach((post) => {
  const title = post.querySelector("h3").textContent;
  const list = post.querySelector(".comment-list");
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(title)) {
      const p = document.createElement("p");
      p.textContent = localStorage.getItem(key);
      list.appendChild(p);
    }
  }
  post.querySelector(
    ".comment-toggle"
  ).textContent = `Comments (${list.children.length})`;
});

// Scroll Progress
const scrollProgress = document.querySelector(".scroll-progress");
if (scrollProgress) {
  window.addEventListener("scroll", () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / total) * 100;
    scrollProgress.style.width = `${progress}%`;
  });
}

// Scroll Top
const scrollTopBtn = document.querySelector(".scroll-top");
window.addEventListener("scroll", () => {
  scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Contact Copy
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    navigator.clipboard.writeText(btn.dataset.copy).then(() => {
      btn.textContent = "✔";
      setTimeout(() => (btn.textContent = "📋"), 2000);
    });
  });
});

// Contact Form
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  const inputs = contactForm.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const count = input.value.length;
      const max = input.maxLength;
      input.nextElementSibling.textContent = `${count}/${max}`;
    });
  });

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = contactForm.querySelector("#name").value;
    const email = contactForm.querySelector("#email").value;
    const message = contactForm.querySelector("#message").value;
    if (name && email.includes("@") && message) {
      contactForm.innerHTML = '<p class="success">Message sent! (Mock)</p>';
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  });
}

// Form Prompt
const prompt = document.querySelector(".form-prompt");
if (prompt) {
  const messages = [
    "Let's chat about tech!",
    "Share art ideas!",
    "Talk about games!",
  ];
  let index = 0;
  setInterval(() => {
    prompt.textContent = messages[index];
    index = (index + 1) % messages.length;
  }, 4000);
}

// Performance Dashboard
const perfToggle = document.querySelector(".perf-toggle");
const perfDashboard = document.querySelector(".perf-dashboard");
if (perfToggle) {
  perfToggle.addEventListener("click", () => {
    perfDashboard.style.display =
      perfDashboard.style.display === "none" ? "block" : "none";
    if (perfDashboard.style.display === "block") {
      setInterval(() => {
        perfDashboard.innerHTML = `
          FPS: ${fps}<br />
          Load Time: ${(performance.now() / 1000).toFixed(2)}s<br />
          Memory: ${
            (performance.memory?.usedJSHeapSize / 1024 / 1024).toFixed(2) ||
            "N/A"
          } MB
        `;
      }, 1000);
    }
  });
}

// Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "t") themeBtn.click();
  if (e.key.toLowerCase() === "s" && document.getElementById("blog-search")) {
    document.getElementById("blog-search").focus();
  }
  if (e.key.toLowerCase() === "h") window.location.href = "index.html";
});

// Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .catch((err) => console.error("Service Worker failed:", err));
}
