const TARGET_DATE = new Date("2026-05-22T08:00:00+07:00");
const revealItems = document.querySelectorAll(".reveal");
const toast = document.getElementById("toast");
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");
const heartLauncher = document.getElementById("heartLauncher");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => observer.observe(item));

function updateCountdown() {
  const now = new Date();
  const diff = TARGET_DATE.getTime() - now.getTime();
  const safeDiff = Math.max(diff, 0);

  const day = Math.floor(safeDiff / (1000 * 60 * 60 * 24));
  const hour = Math.floor((safeDiff / (1000 * 60 * 60)) % 24);
  const minute = Math.floor((safeDiff / (1000 * 60)) % 60);
  const second = Math.floor((safeDiff / 1000) % 60);

  document.getElementById("days").textContent = String(day);
  document.getElementById("hours").textContent = String(hour).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minute).padStart(2, "0");
  document.getElementById("seconds").textContent = String(second).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

function playMusic() {
  if (!musicReady) return;
  bgMusic.play().then(() => {
    musicToggle.classList.add("playing");
  }).catch(() => {
    // Silent fail
  });
}

let musicReady = true;
bgMusic.addEventListener("error", () => {
  musicReady = false;
});

musicToggle.addEventListener("click", async () => {
  if (!musicReady) {
    showToast("Chưa có file assets/music.mp3 để phát nhạc.");
    return;
  }

  if (bgMusic.paused) {
    try {
      await bgMusic.play();
      musicToggle.classList.add("playing");
    } catch (error) {
      showToast("Trình duyệt đang chặn phát nhạc tự động.");
    }
  } else {
    bgMusic.pause();
    musicToggle.classList.remove("playing");
  }
});

const RSVP_KEY = "wedding_demo_rsvp";
const WISH_KEY = "wedding_demo_wishes";
const rsvpForm = document.getElementById("rsvpForm");
const wishForm = document.getElementById("wishForm");
const rsvpSaved = document.getElementById("rsvpSaved");
const wishList = document.getElementById("wishList");

function readStorage(key, fallback = []) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "null");
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function renderRsvps() {
  const data = readStorage(RSVP_KEY);
  if (!data.length) {
    rsvpSaved.innerHTML = "";
    return;
  }

  rsvpSaved.innerHTML = `
    <div class="section-head left compact">
      <h2 style="font-size:1.8rem">Danh sách xác nhận gần đây</h2>
    </div>
    ${data
      .slice(0, 3)
      .map(
        (item) => `
      <div class="saved-item">
        <strong>${item.name}</strong>
        <div>${item.attendance} · ${item.guests} người · ${item.side}</div>
        ${item.note ? `<p>${item.note}</p>` : ""}
      </div>`
      )
      .join("")}
  `;
}

function seedWishes() {
  const existing = readStorage(WISH_KEY);
  if (existing.length) return;
  writeStorage(WISH_KEY, [
    {
      name: "Minh Anh",
      message: "Chúc hai bạn trăm năm hạnh phúc, luôn yêu thương nhau như những ngày đầu.",
    },
    {
      name: "Gia đình thân hữu",
      message: "Chúc mừng ngày vui của hai con. Mong mọi điều bình an và viên mãn sẽ luôn đồng hành.",
    },
  ]);
}

function renderWishes() {
  const data = readStorage(WISH_KEY);
  wishList.innerHTML = data
    .slice()
    .reverse()
    .map(
      (item) => `
      <article class="wish">
        <strong>${item.name}</strong>
        <p>${item.message}</p>
      </article>
    `
    )
    .join("");
}

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(rsvpForm);
  const payload = Object.fromEntries(formData.entries());
  const current = readStorage(RSVP_KEY);
  current.unshift(payload);
  writeStorage(RSVP_KEY, current.slice(0, 10));
  renderRsvps();
  rsvpForm.reset();
  showToast("Đã lưu xác nhận tham dự trên trình duyệt.");
});

wishForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(wishForm);
  const payload = {
    name: formData.get("wishName"),
    message: formData.get("wishMessage"),
  };
  const current = readStorage(WISH_KEY);
  current.push(payload);
  writeStorage(WISH_KEY, current);
  renderWishes();
  wishForm.reset();
  showToast("Đã gửi lời chúc vào bản demo.");
});

seedWishes();
renderWishes();
renderRsvps();

const slider = document.querySelector(".gallery-slider");
if (slider) {
  const sliderMainImg = slider.querySelector(".slider-image img");
  const thumbButtons = Array.from(slider.querySelectorAll(".slider-thumbs .thumb"));
  const prevButton = slider.querySelector(".slider-nav.prev");
  const nextButton = slider.querySelector(".slider-nav.next");
  const zoomButton = slider.querySelector(".slider-zoom");

  const slides = thumbButtons.map((button) => ({
    src: button.dataset.src,
    full: button.dataset.full,
    alt: button.querySelector("img").alt || "Ảnh",
  }));

  let currentSlideIndex = 0;

  function setActiveSlide(index) {
    const count = slides.length;
    currentSlideIndex = (index % count + count) % count;
    const slide = slides[currentSlideIndex];
    sliderMainImg.src = slide.src;
    sliderMainImg.dataset.full = slide.full;
    sliderMainImg.alt = slide.alt;
    lightboxImage.src = slide.full;
    lightboxImage.alt = slide.alt;
    thumbButtons.forEach((button, idx) => {
      button.classList.toggle("active", idx === currentSlideIndex);
    });
  }

  thumbButtons.forEach((button, index) => {
    button.addEventListener("click", () => setActiveSlide(index));
  });

  prevButton?.addEventListener("click", () => setActiveSlide(currentSlideIndex - 1));
  nextButton?.addEventListener("click", () => setActiveSlide(currentSlideIndex + 1));

  const openCurrentImage = () => {
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
  };

  sliderMainImg.addEventListener("click", openCurrentImage);
  zoomButton?.addEventListener("click", openCurrentImage);

  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  lightboxPrev?.addEventListener("click", () => setActiveSlide(currentSlideIndex - 1));
  lightboxNext?.addEventListener("click", () => setActiveSlide(currentSlideIndex + 1));

  setActiveSlide(0);
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy || "";
    try {
      await navigator.clipboard.writeText(value);
      showToast("Đã sao chép số tài khoản.");
    } catch (error) {
      showToast("Không thể sao chép tự động trên trình duyệt này.");
    }
  });
});

function shootHearts(count = 10) {
  const launcherRect = heartLauncher.getBoundingClientRect();
  for (let index = 0; index < count; index += 1) {
    const heart = document.createElement("img");
    heart.src = "assets/heart.png";
    heart.alt = "";
    heart.className = "floating-heart";
    heart.style.left = `${launcherRect.left + launcherRect.width / 2 - 12}px`;
    heart.style.top = `${launcherRect.top + 8}px`;
    heart.style.setProperty("--x-drift", `${(Math.random() - 0.5) * 140}px`);
    heart.style.animationDelay = `${index * 70}ms`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1900 + index * 70);
  }
}

heartLauncher.addEventListener("click", () => shootHearts(12));
