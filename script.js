/* =========================
   1. KONFIGURASI
========================= */

const SECRET_PASSWORD = "050525";

const SECRET_TEXT = `Bubbyy, there's something I don't say enough.

You make ordinary days feel special.
I hope you always remember how loved,
appreciated, and precious you are to me.

No matter how big this universe is,
you will always have a special place in mine. ♡`;

const MEMORIES = [
  {
    src: "assets/foto/pic8.JPG",
    title: "Our Beginning",
    description: "One of my favorite days",
    caption: "Our beginning — one memory I want to keep forever. ♡"
  },
  {
    src: "assets/foto/pic2.JPG",
    title: "Your Smile",
    description: "My favorite view",
    caption: "Ini cakep banget, gila sih byy"
  },
  {
    src: "assets/foto/pic3.JPG",
    title: "Little Moments",
    description: "Simple, but special",
    caption: "Setiap momen kecil terasa berharga ketika bersamamu."
  },
  {
    src: "assets/foto/pic4.JPG",
    title: "To More Years",
    description: "More memories to come",
    caption: "Emang cakep, yuk sepedaan lagi sayang! ✦"
  },
  {
    src: "assets/foto/pic5.JPG",
    title: "Sweet Memory",
    description: "A moment with you",
    caption: "Satu lagi kenangan manis yang ingin kusimpan. ♡"
  },
  {
    src: "assets/foto/pic6.JPG",
    title: "Just Us",
    description: "My favorite company",
    caption: "Asalkan sama kamu, hal sederhana pun terasa istimewa."
  },
  {
    src: "assets/foto/pic7.JPG",
    title: "Our Little World",
    description: "A place of our own",
    caption: "Dunia kecil yang selalu ingin aku kunjungi lagi."
  },
  {
    src: "assets/foto/pic9.JPG",
    title: "Happy Days",
    description: "Smiles worth keeping",
    caption: "Semoga kita selalu punya alasan untuk tertawa bersama."
  },
  {
    src: "assets/foto/pic10.JPG",
    title: "My Favorite Person",
    description: "Always you",
    caption: "Di antara banyak hal baik, aku senang menemukan kamu."
  },
  {
    src: "assets/foto/pic11.JPG",
    title: "Unforgettable",
    description: "A day to remember",
    caption: "Ada momen yang sederhana, tapi selalu ingin diulang."
  },
  {
    src: "assets/foto/pic12.JPG",
    title: "Together",
    description: "Side by side",
    caption: "Semoga langkah kita masih panjang dan searah. ♡"
  },
  {
    src: "assets/foto/pic13.JPG",
    title: "My Happy Place",
    description: "Where I feel at home",
    caption: "Terima kasih sudah menjadi bagian indah dalam hidupku."
  },
  {
    src: "assets/foto/pic1.JPG",
    title: "To Be Continued",
    description: "Our story goes on",
    caption: "Ini bukan akhir cerita kita. Masih banyak kenangan menunggu. ✦"
  }
];

/* =========================
   2. NAVIGASI
========================= */

function goTo(id) {
  const section = document.getElementById(id);

  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

function enterUniverse() {
  const music = document.getElementById("birthdayMusic");

  if (music) {
    music.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: "playVideo",
        args: []
      }),
      "*"
    );
  }

  goTo("universe");
}

/* =========================
   3. ANIMASI BINTANG
========================= */

const canvas = document.getElementById("stars");
const ctx = canvas ? canvas.getContext("2d") : null;

let stars = [];
let canvasWidth = 0;
let canvasHeight = 0;
let animationFrame;

function resizeStars() {
  if (!canvas || !ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;
  canvas.style.width = canvasWidth + "px";
  canvas.style.height = canvasHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.min(
    Math.floor(canvasWidth * canvasHeight / 4200),
    240
  );

  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    r: Math.random() * 1.4 + 0.2,
    alpha: Math.random() * 0.7 + 0.2,
    speed: Math.random() * 0.006 + 0.002,
    phase: Math.random() * Math.PI * 2
  }));
}

function drawStars(time = 0) {
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  stars.forEach(star => {
    const twinkle =
      0.45 + Math.sin(time * star.speed + star.phase) * 0.35;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle =
      `rgba(255,245,255,${star.alpha * twinkle})`;
    ctx.fill();
  });

  animationFrame = requestAnimationFrame(drawStars);
}

resizeStars();
drawStars();

window.addEventListener("resize", resizeStars);

/* =========================
   4. EFEK SCROLL
========================= */

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

if (revealObserver) {
  document.querySelectorAll(".reveal").forEach(element => {
    revealObserver.observe(element);
  });
}

function observeReveal(element) {
  if (revealObserver && element) {
    revealObserver.observe(element);
  }
}

/* =========================
   5. INFINITE PHOTO CAROUSEL
========================= */

const memorySlider = document.getElementById("memorySlider");
const memoryTrack = document.getElementById("memoryTrack");
const prevButton = document.getElementById("memoryPrev");
const nextButton = document.getElementById("memoryNext");

let visiblePhotos = getVisiblePhotos();
let carouselIndex = visiblePhotos;
let isCarouselMoving = false;
let touchStartX = 0;
let touchStartY = 0;
let resizeTimeout;

function getVisiblePhotos() {
  return window.matchMedia("(max-width: 720px)").matches ? 2 : 4;
}

function buildMemoryCarousel() {
  if (!memoryTrack) return;

  visiblePhotos = Math.min(getVisiblePhotos(), MEMORIES.length);
  carouselIndex = visiblePhotos;
  isCarouselMoving = false;

  memoryTrack.innerHTML = "";

  const before = MEMORIES.slice(-visiblePhotos);
  const after = MEMORIES.slice(0, visiblePhotos);

  const allPhotos = [
    ...before.map((memory, i) => ({
      ...memory,
      originalIndex: MEMORIES.length - visiblePhotos + i
    })),
    ...MEMORIES.map((memory, i) => ({
      ...memory,
      originalIndex: i
    })),
    ...after.map((memory, i) => ({
      ...memory,
      originalIndex: i
    }))
  ];

  allPhotos.forEach(memory => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "memory-card";
    card.setAttribute("aria-label", `Buka foto ${memory.title}`);

    const img = document.createElement("img");
    img.alt = memory.title;
    img.loading = "eager";
    img.decoding = "async";

    // Tangani error sebelum memasang alamat gambar.
    img.addEventListener("error", () => {
      console.error("Foto gagal dimuat:", memory.src);
      img.alt = `Foto tidak ditemukan: ${memory.src}`;
      card.classList.add("photo-error");
    });

    img.src = memory.src;

    const title = document.createElement("h3");
    title.textContent = memory.title;

    const description = document.createElement("p");
    description.textContent = memory.description;

    const caption = document.createElement("p");
    caption.className = "memory-caption";
    caption.textContent = memory.caption;

    card.append(img, title, description, caption);

    card.addEventListener("click", () => {
      openPhoto(memory.originalIndex);
    });

    memoryTrack.appendChild(card);
  });

  updateCarouselPosition(false);
}

function updateCarouselPosition(animate = true) {
  if (!memoryTrack) return;

  const cards = memoryTrack.querySelectorAll(".memory-card");

  if (!cards.length) return;

  const firstCard = cards[0];
  const gap = parseFloat(
    getComputedStyle(memoryTrack).columnGap ||
    getComputedStyle(memoryTrack).gap
  ) || 0;

  const cardWidth = firstCard.getBoundingClientRect().width;
  const offset = carouselIndex * (cardWidth + gap);

  memoryTrack.style.transition = animate
    ? "transform 0.45s ease"
    : "none";

  memoryTrack.style.transform = `translateX(-${offset}px)`;
}

function moveMemory(direction) {
  if (!memoryTrack || isCarouselMoving) return;

  isCarouselMoving = true;
  carouselIndex += direction;
  updateCarouselPosition(true);
}

if (prevButton) {
  prevButton.addEventListener("click", () => moveMemory(-1));
}

if (nextButton) {
  nextButton.addEventListener("click", () => moveMemory(1));
}

if (memoryTrack) {
  memoryTrack.addEventListener("transitionend", event => {
    if (event.propertyName !== "transform") return;

    const firstRealPhoto = visiblePhotos;
    const afterLastRealPhoto = visiblePhotos + MEMORIES.length;

    if (carouselIndex >= afterLastRealPhoto) {
      carouselIndex = firstRealPhoto;
      updateCarouselPosition(false);
    } else if (carouselIndex < firstRealPhoto) {
      carouselIndex = afterLastRealPhoto - 1;
      updateCarouselPosition(false);
    }

    isCarouselMoving = false;
  });
}

// Swipe pada HP.
if (memorySlider) {
  memorySlider.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
  }, { passive: true });

  memorySlider.addEventListener("touchend", event => {
    const deltaX = event.changedTouches[0].screenX - touchStartX;
    const deltaY = event.changedTouches[0].screenY - touchStartY;

    if (
      Math.abs(deltaX) > 45 &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      moveMemory(deltaX < 0 ? 1 : -1);
    }
  }, { passive: true });
}

// Sesuaikan jumlah kartu ketika ukuran layar berubah.
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    const newVisiblePhotos = getVisiblePhotos();

    if (newVisiblePhotos !== visiblePhotos) {
      buildMemoryCarousel();
    } else {
      updateCarouselPosition(false);
    }
  }, 150);
});

buildMemoryCarousel();

/* =========================
   6. MODAL FOTO
========================= */

let currentPhoto = 0;

function openPhoto(index) {
  if (!MEMORIES.length) return;

  currentPhoto =
    ((index % MEMORIES.length) + MEMORIES.length) % MEMORIES.length;

  renderPhoto();

  const modal = document.getElementById("photoModal");

  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
}

function renderPhoto() {
  const memory = MEMORIES[currentPhoto];

  if (!memory) return;

  const image = document.getElementById("modalImage");
  const caption = document.getElementById("modalCaption");

  if (image) {
    image.onerror = () => {
      console.error("Foto modal gagal dimuat:", memory.src);
      image.alt = `Foto tidak ditemukan: ${memory.src}`;
    };

    image.src = memory.src;
    image.alt = memory.title;
  }

  // Caption modal selalu diambil dari objek foto yang sama.
  if (caption) {
    caption.textContent = memory.caption;
  }
}

function changePhoto(direction) {
  currentPhoto =
    (currentPhoto + direction + MEMORIES.length) % MEMORIES.length;

  renderPhoto();
}

/* =========================
   7. PESAN RAHASIA
========================= */

const secretForm = document.getElementById("secretForm");

if (secretForm) {
  secretForm.addEventListener("submit", event => {
    event.preventDefault();

    const input = document.getElementById("secretPassword");
    const message = document.getElementById("secretMessage");

    if (!input || !message) return;

    if (
      input.value.trim().toLowerCase() ===
      SECRET_PASSWORD.toLowerCase()
    ) {
      message.textContent = SECRET_TEXT;
      message.style.display = "block";
      input.value = "";
    } else {
      message.textContent =
        "Hmm, sepertinya belum tepat. Coba ingat kata yang spesial buat kalian. ♡";
      message.style.display = "block";
    }
  });
}

/* =========================
   8. KEJUTAN & KONFETI
========================= */

function revealSurprise() {
  const message = document.getElementById("surpriseMessage");

  if (!message) return;

  message.style.display = "block";

  message.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  createConfetti();
}

function createConfetti() {
  const symbols = ["♡", "✦", "✧", "⋆"];
  const colors = ["#ffb9d5", "#d5c3ff", "#fff4d8"];

  for (let i = 0; i < 32; i++) {
    const particle = document.createElement("span");

    particle.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    particle.style.position = "fixed";
    particle.style.left = Math.random() * 100 + "vw";
    particle.style.top = "-25px";
    particle.style.zIndex = "200";
    particle.style.pointerEvents = "none";
    particle.style.fontSize = (12 + Math.random() * 18) + "px";
    particle.style.color =
      colors[Math.floor(Math.random() * colors.length)];

    document.body.appendChild(particle);

    const drift = (Math.random() - 0.5) * 200;
    const duration = 1800 + Math.random() * 1800;

    const animation = particle.animate([
      {
        transform: "translate(0, 0) rotate(0deg)",
        opacity: 1
      },
      {
        transform: `translate(${drift}px, 105vh) rotate(500deg)`,
        opacity: 0
      }
    ], {
      duration,
      easing: "ease-in",
      fill: "forwards"
    });

    animation.onfinish = () => particle.remove();
  }
}

/* =========================
   9. TUTUP MODAL & KEYBOARD
========================= */

function closeModal(id) {
  const modal = document.getElementById(id);

  if (modal) {
    modal.classList.remove("show");
  }

  if (!document.querySelector(".modal.show")) {
    document.body.style.overflow = "";
  }
}

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closeModal(modal.id);
    }
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal.show").forEach(modal => {
      closeModal(modal.id);
    });
  }

  const photoModal = document.getElementById("photoModal");

  if (photoModal && photoModal.classList.contains("show")) {
    if (event.key === "ArrowRight") changePhoto(1);
    if (event.key === "ArrowLeft") changePhoto(-1);
  }
});
