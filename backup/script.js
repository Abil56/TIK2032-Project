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
    progress += 5;
    percent.textContent = `${progress}%`;
    if (progress >= 100) {
      clearInterval(interval);
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 700);
    }
  }, 100);
});

// Typing Effect
const typingElement = document.querySelector(".typing-effect");
if (typingElement) {
  const text = typingElement.dataset.text;
  let index = 0;
  const type = () => {
    if (index < text.length) {
      typingElement.textContent = text.slice(0, ++index);
      setTimeout(type, 100);
    }
  };
  type();
}

// Particle System
const canvas = document.getElementById("particle-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = [];
  const particleCount = Math.min(window.innerWidth / 10, 100);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 1.5 - 0.75;
      this.speedY = Math.random() * 1.5 - 0.75;
      this.opacity = Math.random() * 0.5 + 0.3;
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
        if (dist < 150) {
          this.speedX += (dx / dist) * 0.5;
          this.speedY += (dy / dist) * 0.5;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${
        document.body.classList.contains("neon-theme")
          ? "255, 0, 255"
          : "59, 130, 246"
      }, ${this.opacity})`;
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

// Scroll Reveal
const revealElements = document.querySelectorAll(".scroll-reveal");
const revealOnScroll = () => {
  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      el.classList.add("visible");
    }
  });
};
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// Scroll Progress (for Blog Pages)
const scrollProgress = document.querySelector(".scroll-progress");
if (scrollProgress) {
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / docHeight;
    scrollProgress.style.transform = `scaleX(${progress})`;
  });
}

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

// Scroll Top
const scrollTopBtn = document.querySelector(".scroll-top");
window.addEventListener("scroll", () => {
  scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
});
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Newsletter Form
const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector("#newsletter-email").value;
    if (email.includes("@")) {
      newsletterForm.innerHTML =
        '<p class="success">Subscribed! Thank you!</p>';
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  });
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

// Gallery Filter
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");
if (filterButtons.length) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      galleryItems.forEach((item) => {
        item.style.display =
          filter === "all" || item.dataset.category === filter
            ? "block"
            : "none";
      });
    });
  });
}

// Blog Search
const searchInput = document.querySelector("#blog-search");
const blogPosts = document.querySelectorAll(".blog-preview");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    blogPosts.forEach((post) => {
      const title = post.querySelector("h3").textContent.toLowerCase();
      const text = post
        .querySelector(".preview-text")
        .textContent.toLowerCase();
      post.style.display =
        title.includes(query) || text.includes(query) ? "block" : "none";
    });
  });
}

// Blog Comments
const commentToggles = document.querySelectorAll(".comment-toggle");
if (commentToggles.length) {
  commentToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const commentsSection = toggle.nextElementSibling;
      commentsSection.style.display =
        commentsSection.style.display === "none" ? "block" : "none";
    });
  });

  const commentForms = document.querySelectorAll(".comment-form");
  commentForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const textarea = form.querySelector("textarea");
      const comment = textarea.value.trim();
      if (comment) {
        const commentList = form.nextElementSibling;
        const commentDiv = document.createElement("div");
        commentDiv.textContent = comment;
        commentList.appendChild(commentDiv);
        textarea.value = "";
        const toggle = form
          .closest(".comment-section")
          .querySelector(".comment-toggle");
        toggle.textContent = `Comments (${commentList.children.length})`;
      }
    });
  });
}

// Contact Form Validation
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  const emailInput = contactForm.querySelector("#email");
  emailInput.addEventListener("input", () => {
    const error = emailInput.nextElementSibling;
    error.textContent = emailInput.validity.valid
      ? ""
      : "Please enter a valid email";
  });

  const inputs = contactForm.querySelectorAll(
    "input[maxlength], textarea[maxlength]"
  );
  inputs.forEach((input) => {
    const count = input.nextElementSibling;
    input.addEventListener("input", () => {
      count.textContent = `${input.value.length}/${input.maxLength}`;
    });
  });

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (contactForm.checkValidity()) {
      contactForm.innerHTML = '<p class="success">Message sent! Thank you!</p>';
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  });
}

// Copy Buttons
const copyButtons = document.querySelectorAll(".copy-btn");
if (copyButtons.length) {
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      navigator.clipboard.write(btn.dataset.copy).then(() => {
        btn.innerHTML =
          '<svg class="icon"><use xlink:href="#check"></use></svg>';
        setTimeout(() => {
          btn.innerHTML =
            '<svg class="icon"><use xlink:href="#copy"></use></svg>';
        }, 2000);
      });
    });
  });
}

// Lazy Loading Images
const lazyImages = document.querySelectorAll("img.lazy");
if (lazyImages.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  });
  lazyImages.forEach((img) => observer.observe(img));
}

// Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .catch((err) => console.error("Service Worker failed:", err));
}
