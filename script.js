/* ══════════════════════════════════════════════════════════════
   SNEHA CHOUDHARY — 8-SECOND COVER TIMER & ANIMATION ENGINE
   ══════════════════════════════════════════════════════════════ */

let autoTimer = null;
let isOpening = false;

function startAutoSequence() {
  // Wait 8 seconds on the cover page so visitors can comfortably read everything
  autoTimer = setTimeout(() => {
    startPageTurn();
  }, 8000); 
}

function startPageTurn() {
  if (isOpening) return;
  isOpening = true;
  if (autoTimer) clearTimeout(autoTimer);

  const coverStage = document.getElementById("bookCoverStage");
  const flipOverlay = document.getElementById("pageFlipOverlay");
  const mainPortfolio = document.getElementById("mainPortfolio");

  // Fade out cover
  coverStage.classList.add("fade-out");

  // Show 3D flip animation
  setTimeout(() => {
    coverStage.style.display = "none";
    flipOverlay.classList.add("active");
    spawnPetals();
  }, 350);

  // Smoothly unveil main website
  setTimeout(() => {
    flipOverlay.classList.remove("active");
    mainPortfolio.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 2500);
}

function reopenCover() {
  isOpening = false;
  const coverStage = document.getElementById("bookCoverStage");
  const mainPortfolio = document.getElementById("mainPortfolio");
  
  mainPortfolio.classList.add("hidden");
  coverStage.style.display = "flex";
  setTimeout(() => {
    coverStage.classList.remove("fade-out");
  }, 50);
  startAutoSequence();
}

function spawnPetals() {
  const container = document.getElementById("petalsContainer");
  if (!container) return;
  container.innerHTML = "";

  for (let i = 0; i < 18; i++) {
    const petal = document.createElement("div");
    petal.className = "floating-petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${2 + Math.random() * 2}s`;
    petal.style.animationDelay = `${Math.random() * 0.6}s`;
    container.appendChild(petal);
  }
}

// ── Interactive Cursor Sparkle Particle Trail (Yellow & Light Blue) ──
const canvas = document.getElementById("cursorCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const particleColors = ["#FFF3B0", "#FEF08A", "#BAE6FD", "#E0F2FE", "#FFCAD4", "#FFFFFF"];

class CursorSpark {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1;
    this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
    this.speedX = (Math.random() - 0.5) * 1.5;
    this.speedY = (Math.random() - 0.5) * 1.5 - 0.3;
    this.alpha = 1;
    this.decay = Math.random() * 0.025 + 0.02;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 5;
    ctx.shadowColor = this.color;

    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const radius = i % 2 === 0 ? this.size : this.size / 2.4;
      const angle = (i * Math.PI) / 4;
      const sx = this.x + Math.cos(angle) * radius;
      const sy = this.y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= this.decay;
  }
}

window.addEventListener("mousemove", (e) => {
  if (Math.random() > 0.25) {
    particles.push(new CursorSpark(e.clientX, e.clientY));
  }
});

window.addEventListener("touchmove", (e) => {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    particles.push(new CursorSpark(touch.clientX, touch.clientY));
  }
}, { passive: true });

function animateCursorTrail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }
  requestAnimationFrame(animateCursorTrail);
}
animateCursorTrail();

// ── Roaming Butterflies ──
class RoamingButterfly {
  constructor(container, index) {
    this.container = container;
    this.x = Math.random() * (window.innerWidth - 60) + 30;
    this.y = Math.random() * (window.innerHeight - 60) + 30;
    this.targetX = Math.random() * (window.innerWidth - 60) + 30;
    this.targetY = Math.random() * (window.innerHeight - 60) + 30;
    this.speed = 0.8 + Math.random() * 0.6;
    this.scale = 0.65 + Math.random() * 0.3;
    this.time = Math.random() * 100;
    
    this.element = document.createElement("div");
    this.element.className = "fairy-butterfly";
    this.element.innerHTML = `
      <div class="butterfly-wing-l" style="background: linear-gradient(135deg, #FFCAD4, #BAE6FD);"></div>
      <div class="butterfly-wing-r" style="background: linear-gradient(135deg, #BAE6FD, #FFCAD4);"></div>
    `;
    this.container.appendChild(this.element);
  }

  update() {
    this.time += 0.02;
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 40) {
      this.targetX = Math.random() * (window.innerWidth - 60) + 30;
      this.targetY = Math.random() * (window.innerHeight - 60) + 30;
    }

    const angle = Math.atan2(dy, dx);
    this.x += Math.cos(angle) * this.speed + Math.sin(this.time * 2) * 1;
    this.y += Math.sin(angle) * this.speed + Math.cos(this.time * 1.5) * 1;

    const rot = (angle * 180) / Math.PI + 90;
    this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) rotate(${rot}deg) scale(${this.scale})`;
  }
}

function initButterflies() {
  const garden = document.getElementById("butterflyGarden");
  if (!garden) return;
  const butterflies = [];
  for (let i = 0; i < 4; i++) {
    butterflies.push(new RoamingButterfly(garden, i));
  }

  function loop() {
    butterflies.forEach(b => b.update());
    requestAnimationFrame(loop);
  }
  loop();
}

// ── Floating Bubbles ──
function initBubbles() {
  const haven = document.getElementById("bubbleHaven");
  if (!haven) return;

  function spawnBubble() {
    const bubble = document.createElement("div");
    bubble.className = "fairy-bubble";
    const size = 16 + Math.random() * 24;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    const left = Math.random() > 0.5 ? Math.random() * 25 : 75 + Math.random() * 20;
    bubble.style.left = `${left}%`;
    bubble.style.animationDuration = `${10 + Math.random() * 8}s`;
    haven.appendChild(bubble);

    setTimeout(() => {
      if (bubble.parentNode) bubble.remove();
    }, 18000);
  }

  setInterval(spawnBubble, 2400);
  for (let i = 0; i < 3; i++) setTimeout(spawnBubble, i * 700);
}

window.addEventListener("DOMContentLoaded", () => {
  startAutoSequence();
  initButterflies();
  initBubbles();
});
