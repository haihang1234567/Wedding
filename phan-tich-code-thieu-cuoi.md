# 📋 Phân Tích Code — Thiệp Cưới Online (Thế Tuấn & Hương Quỳnh)

> Đây là thiệp cưới tĩnh (static web) không cần backend, gồm 3 file chính: `index.html`, `styles.css`, `script.js` và thư mục `assets/` chứa ảnh, âm thanh.

---

## 🗂️ Cấu Trúc Dự Án

```
hehe/
├── index.html        # Cấu trúc toàn bộ giao diện
├── styles.css        # Toàn bộ định kiểu, responsive
├── script.js         # Logic tương tác, đếm ngược, gallery, form
├── readme.md         # Hướng dẫn deploy
└── assets/
    ├── g1.jpg … g16.jpg   # Ảnh album cưới (16 ảnh)
    ├── 1.png, 2.png        # QR chuyển khoản (cô dâu, chú rể)
    ├── audio.mp3           # Nhạc nền
    ├── audio-6.png         # Icon nút nhạc
    ├── heart.png           # Icon trái tim (lịch, bắn tim)
    ├── biubiu.png          # Ảnh nút bắn tim
    └── message.png         # Icon mục lời chúc
```

---

## 🏗️ HTML — `index.html`

Trang được viết bằng HTML thuần, ngôn ngữ `vi`. Chia làm các phần lớn theo thứ tự từ trên xuống dưới:

### 1. `<head>` — Khai báo meta & tài nguyên

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Thư Mời Tiệc Cưới Thế Tuấn & Hương Quỳnh</title>
```

- Import 3 Google Fonts: **Cormorant Garamond** (serif sang trọng), **Great Vibes** (chữ thảo viết tên), **Inter** (UI body text).
- Link `styles.css` ở cuối head.

---

### 2. `<audio>` — Nhạc nền

```html
<audio id="bgMusic" loop preload="none">
  <source src="assets/audio.mp3" type="audio/mpeg" />
</audio>
```

- `loop`: lặp vô tận.
- `preload="none"`: không tải trước, tiết kiệm băng thông khi mở trang.
- Được điều khiển bởi nút `#musicToggle` và hàm `playMusic()` trong JS.

---

### 3. `.music-toggle` — Nút điều khiển nhạc

```html
<button class="music-toggle" id="musicToggle">
  <span class="music-disc"></span>
  <img src="assets/audio-6.png" alt="Music" />
</button>
```

- Fixed ở góc trên phải màn hình.
- `.music-disc`: vòng tròn vinyl giả, quay khi nhạc đang phát (CSS animation `spin`).

---

### 4. `.side-ribbon` — Dải chữ dọc bên trái

```html
<div class="side-ribbon">
  <span>Nhà</span><span>Có</span><span>Hỷ</span>
</div>
```

- Fixed dọc theo chiều cao màn hình, ẩn trên màn hình < 1100px.
- Chữ xoay 90° bằng `writing-mode: vertical-rl`.

---

### 5. `<header class="hero">` — Màn hình chào (Hero)

```html
<header class="hero section">
  <div class="hero-backdrop"></div>
  <div class="hero-content reveal">
    <h1>
      <span class="script">Thế Tuấn</span>
      <span class="amp">&amp;</span>
      <span class="script">Hương Quỳnh</span>
    </h1>
  </div>
  <a href="#invitation" class="primary-btn" onclick="playMusic(); ...">Mở thiệp cưới</a>
</header>
```

- `.hero-backdrop`: ảnh nền `g12.jpg`, overlay tối nhẹ.
- `.script`: chữ thảo dùng font Great Vibes.
- `.amp`: ký tự `&` to, in nghiêng, dùng font Cormorant Garamond.
- Nút "Mở thiệp cưới" kích hoạt nhạc và cuộn xuống section `#invitation`.

---

### 6. `#invitation` — Lời mời

Gồm 3 khối con:

| Khối | Nội dung |
|------|----------|
| `.section-head` | Tiêu đề "Trân trọng kính mời" |
| `.formal-invite.card` | Tên đầy đủ cô dâu chú rể, lời giới thiệu |
| `.family-grid` | Thông tin 2 gia đình (Nhà Trai / Nhà Gái) dạng 2 cột `<article class="card">` |

---

### 7. `.split-section` — Ảnh + Lời dẫn

```html
<section class="section split-section">
  <div class="split-photo reveal"><img src="assets/g11.jpg" /></div>
  <div class="split-copy reveal">
    <blockquote>...</blockquote>
  </div>
</section>
```

- Layout 2 cột (ảnh trái, chữ phải), xếp thành 1 cột trên mobile.

---

### 8. `.calendar-section` — Lịch tháng 5/2026

- Hiển thị lịch thủ công bằng `<span>` cho 31 ngày.
- Ngày **22/05** (Lễ Nạp Tài) và **28/05** (Lễ Thành Hôn) có class `.has-heart` + icon `heart.png` ở góc.
- `.soft-heart` và `.gold-heart`: màu sắc tim khác nhau qua CSS `filter`.

---

### 9. `.countdown-section` — Đếm ngược

```html
<div class="countdown" id="countdown">
  <div class="time-box"><strong id="days">0</strong><span>ngày</span></div>
  <div class="time-box"><strong id="hours">0</strong><span>giờ</span></div>
  <div class="time-box"><strong id="minutes">0</strong><span>phút</span></div>
  <div class="time-box"><strong id="seconds">0</strong><span>giây</span></div>
</div>
```

- Dữ liệu được cập nhật mỗi giây bởi hàm `updateCountdown()` trong JS.
- Mốc đếm về ngày **22/05/2026 08:00 GMT+7**.

---

### 10. `.gallery-section` — Album ảnh cưới

```html
<div class="gallery-slider reveal">
  <div class="slider-viewer">
    <button class="slider-nav prev">‹</button>
    <div class="slider-image">
      <img src="assets/g3.jpg" />
      <button class="slider-zoom">⤢</button>
    </div>
    <button class="slider-nav next">›</button>
  </div>
  <div class="slider-thumbs">
    <button class="thumb active" data-src="assets/g1.jpg" data-full="assets/g1.jpg">...</button>
    <!-- 15 thumbnails -->
  </div>
</div>
```

- Slider 16 ảnh, điều hướng bằng nút Prev/Next hoặc click thumbnail.
- Nút `⤢` (zoom) mở lightbox fullscreen.
- `data-src`: ảnh hiển thị trong slider. `data-full`: ảnh độ phân giải cao cho lightbox.

---

### 11. `#rsvpForm` — Xác nhận tham dự

Form 4 trường:

| Trường | Loại | Mô tả |
|--------|------|-------|
| `name` | text | Họ và tên |
| `attendance` | select | Có / Không tham dự |
| `guests` | select | Số người (1–10) |
| `side` | select | Nhà trai / Nhà gái |
| `note` | textarea | Lời nhắn thêm |

- Submit lưu vào `localStorage`, hiển thị lại 3 entry gần nhất.

---

### 12. `.gift-section` — Mừng cưới / QR chuyển khoản

Hai thẻ `<article class="gift-card">`:

| | Chú rể | Cô dâu |
|-|--------|--------|
| Ngân hàng | TMCP Bảo Việt | Vietcombank |
| STK | 0461009085007 | 1035438470 |
| QR | `assets/2.png` | `assets/1.png` |

- Nút "Sao chép STK" dùng `navigator.clipboard.writeText()`.

---

### 13. `.wishes-section` — Gửi lời chúc

Chia 2 cột:

- **Trái** (`#wishForm`): form nhập tên + lời chúc, submit lưu localStorage.
- **Phải** (`#wishList`): danh sách lời chúc đã gửi, hiển thị mới nhất lên đầu.
- Seed 2 lời chúc mẫu nếu localStorage trống.

---

### 14. `<footer>` — Chân trang

```html
<footer class="footer section">
  <div class="footer-inner reveal">
    <p class="script small-script">Thế Tuấn - Hương Quỳnh</p>
    <p>Hẹn gặp bạn tại lễ cưới của chúng mình.</p>
  </div>
</footer>
```

- Background tối với overlay gradient.

---

### 15. Các phần tử floating (Fixed)

| Element | ID | Chức năng |
|---------|----|-----------|
| Nút bắn tim | `#heartLauncher` | Bắn 12 trái tim bay lên |
| Lightbox | `#lightbox` | Xem ảnh fullscreen |
| Toast | `#toast` | Thông báo nổi ngắn |

---

## 🎨 CSS — `styles.css`

### Biến CSS (`:root`)

```css
:root {
  --bg: #f7f2ec;           /* Nền tổng thể (kem nhạt) */
  --surface: rgba(255,255,255,0.86);  /* Bề mặt card */
  --text: #2f2620;         /* Màu chữ chính (nâu đậm) */
  --muted: #7a6f68;        /* Chữ phụ, muted */
  --accent: #b99272;       /* Vàng đồng */
  --accent-dark: #8a664a;  /* Nâu đậm hơn */
  --line: rgba(123,91,62,0.14);  /* Viền nhẹ */
  --shadow: 0 24px 60px rgba(50,35,22,0.12); /* Bóng card */
  --radius-lg: 34px;       /* Bo góc lớn */
  --radius-md: 22px;
  --radius-sm: 14px;
  --max-width: 1160px;
}
```

Palette màu xuyên suốt là **hồng pastel + nâu vàng đồng** — tone cưới nhẹ nhàng, sang trọng.

---

### Nền trang (`body`)

```css
body {
  background:
    radial-gradient(circle at top left, rgba(255,210,225,0.35), transparent 30%),
    radial-gradient(circle at top right, rgba(255,225,235,0.28), transparent 22%),
    linear-gradient(180deg, #ffe7f0 0%, #f7d7e2 100%);
}

body::before {
  /* Lưới ô vuông mờ phủ toàn trang */
  background-image: linear-gradient(...) linear-gradient(90deg, ...);
  background-size: 40px 40px;
  opacity: 0.25;
}
```

Nền là gradient hồng với hai vùng sáng radial ở 2 góc trên, cộng thêm lưới ô mờ làm texture.

---

### Class `.section`

```css
.section {
  width: calc(100% - 2rem);
  max-width: 1380px;
  margin: 0 auto;
}
```

Container căn giữa, giới hạn tối đa 1380px, luôn có padding hai bên.

---

### `.hero`

```css
.hero {
  min-height: calc(100vh - 2rem);
  border-radius: 38px;
  display: grid;
  place-items: center;
}
.hero-backdrop {
  background: url("assets/g12.jpg") center/contain no-repeat;
  transform: scale(1.04); /* Hiệu ứng zoom nhẹ */
}
.hero::after {
  /* Viền kính trắng mờ bên trong */
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 30px;
}
```

Hero chiếm toàn viewport, bo góc lớn 38px, có viền kính mờ kiểu glassmorphism.

---

### `.card` và Surface Components

```css
.card, .gift-card, .wish-form-shell, .rsvp-shell, .calendar-wrap {
  background: var(--surface);      /* Trắng mờ */
  border: 1px solid var(--line);   /* Viền nhẹ */
  box-shadow: var(--shadow);       /* Đổ bóng */
  backdrop-filter: blur(12px);     /* Blur nền phía sau */
  border-radius: var(--radius-lg);
  padding: 1.6rem;
}
```

Tất cả card dùng chung hiệu ứng **glassmorphism**: nền trắng mờ + blur + viền nhạt.

---

### `.primary-btn` & `.outline-btn`

```css
.primary-btn {
  background: linear-gradient(135deg, #c7a88b, #ad7a56);
  color: white;
  box-shadow: 0 16px 34px rgba(145,106,78,0.28);
  border-radius: 999px;
}
.outline-btn {
  border: 1px solid rgba(124,88,62,0.18);
  color: var(--accent-dark);
  background: rgba(255,255,255,0.68);
}
```

Hai kiểu button: filled gradient nâu vàng và outline trong suốt.

---

### `.music-toggle` — Nút nhạc

```css
.music-toggle {
  position: fixed; top: 2.8rem; right: 1.35rem;
  width: 72px; height: 72px; border-radius: 50%;
  background: rgba(17,17,17,0.56);
  backdrop-filter: blur(14px);
}
.music-toggle .music-disc { /* Đĩa vinyl ảo */ }
.music-toggle.playing .music-disc {
  animation: spin 6s linear infinite; /* Quay khi nhạc phát */
}
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
```

---

### `.reveal` — Hiệu ứng xuất hiện khi cuộn

```css
.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

Phần tử ẩn ban đầu, trượt lên và fade in khi vào viewport (kết hợp với IntersectionObserver trong JS).

---

### `.countdown` — Đếm ngược

```css
.countdown {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}
.time-box strong {
  font-size: clamp(2.5rem, 5vw, 4rem); /* Responsive font size */
  color: var(--accent-dark);
}
```

---

### `.gallery-slider`

```css
.slider-viewer {
  display: grid;
  grid-template-columns: min-content 1fr min-content;
}
.slider-image {
  aspect-ratio: 16 / 10;
  border-radius: 32px;
}
.slider-thumbs {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
}
```

Slider dùng CSS Grid: nút Prev + ảnh chính + nút Next. Thumbnails xếp 6 cột.

---

### `.lightbox`

```css
.lightbox {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.82);
  display: none; /* Ẩn mặc định */
  place-items: center;
  grid-template-columns: min-content 1fr min-content;
}
.lightbox.active { display: grid; } /* Hiện khi active */
```

---

### `.floating-heart` — Tim bay

```css
@keyframes floatUp {
  0%   { transform: translateY(0) scale(0.8); opacity: 0; }
  15%  { opacity: 1; }
  100% { transform: translateY(-180px) translateX(var(--x-drift)) scale(1.6) rotate(20deg); opacity: 0; }
}
```

Tim bay lên cao 180px, lệch ngang ngẫu nhiên (--x-drift), phóng to rồi mờ dần.

---

### `.toast` — Thông báo nổi

```css
.toast {
  position: fixed; bottom: 1.5rem; left: 50%;
  transform: translate(-50%, 130%); /* Ẩn xuống dưới */
  transition: transform 0.3s ease;
}
.toast.show {
  transform: translate(-50%, 0); /* Trượt lên */
}
```

---

### Responsive Breakpoints

| Breakpoint | Thay đổi chính |
|------------|---------------|
| `≤ 1100px` | Ẩn `.side-ribbon`, gallery về 3 cột |
| `≤ 860px` | Tất cả grid 2 cột → 1 cột; thumbnails 6 → 3 cột |
| `≤ 560px` | Hero layout đặc biệt (tên đẩy sang góc phải); ẩn text nút bắn tim |

---

## ⚙️ JavaScript — `script.js`

### Biến toàn cục

```js
const TARGET_DATE = new Date("2026-05-22T08:00:00+07:00"); // Ngày đếm ngược
const toast = document.getElementById("toast");
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");
const heartLauncher = document.getElementById("heartLauncher");
const lightbox = document.getElementById("lightbox");
```

---

### `showToast(message)` — Hiển thị thông báo ngắn

```js
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}
```

- Gắn text, thêm class `.show` → CSS trượt lên.
- Tự ẩn sau 2200ms. Dùng `_timer` trên function để cancel nếu gọi liên tiếp.

---

### IntersectionObserver — Hiệu ứng cuộn `.reveal`

```js
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Chỉ trigger 1 lần
      }
    });
  },
  { threshold: 0.12 } // Khi 12% phần tử vào viewport
);
revealItems.forEach((item) => observer.observe(item));
```

Quan sát tất cả `.reveal`, thêm class `visible` khi vào viewport, sau đó dừng quan sát (tiết kiệm tài nguyên).

---

### `updateCountdown()` — Đếm ngược

```js
function updateCountdown() {
  const diff = TARGET_DATE.getTime() - Date.now();
  const safeDiff = Math.max(diff, 0); // Không âm

  const day    = Math.floor(safeDiff / 86400000);
  const hour   = Math.floor((safeDiff / 3600000) % 24);
  const minute = Math.floor((safeDiff / 60000) % 60);
  const second = Math.floor((safeDiff / 1000) % 60);

  document.getElementById("days").textContent = day;
  document.getElementById("hours").textContent = String(hour).padStart(2, "0");
  // ...
}
updateCountdown();
setInterval(updateCountdown, 1000); // Chạy mỗi giây
```

---

### `playMusic()` & music toggle

```js
function playMusic() {
  if (!musicReady) return;
  bgMusic.play().then(() => musicToggle.classList.add("playing"));
}

musicToggle.addEventListener("click", async () => {
  if (bgMusic.paused) {
    await bgMusic.play();
    musicToggle.classList.add("playing");
  } else {
    bgMusic.pause();
    musicToggle.classList.remove("playing");
  }
});
```

- `musicReady`: flag kiểm tra file audio có load được không (lắng nghe event `error`).
- Khi phát: thêm class `playing` → CSS làm đĩa vinyl quay.

---

### LocalStorage — RSVP & Lời chúc

```js
const RSVP_KEY = "wedding_demo_rsvp";
const WISH_KEY = "wedding_demo_wishes";

function readStorage(key, fallback = []) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "null");
    return Array.isArray(parsed) ? parsed : fallback;
  } catch { return fallback; }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
```

Wrapper an toàn cho `localStorage`, tránh crash nếu parse lỗi.

**RSVP submit:**
```js
rsvpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(rsvpForm).entries());
  const current = readStorage(RSVP_KEY);
  current.unshift(payload);          // Thêm vào đầu
  writeStorage(RSVP_KEY, current.slice(0, 10)); // Giữ tối đa 10
  renderRsvps();
  rsvpForm.reset();
  showToast("Đã lưu xác nhận tham dự trên trình duyệt.");
});
```

**Seed lời chúc mẫu:**
```js
function seedWishes() {
  const existing = readStorage(WISH_KEY);
  if (existing.length) return; // Không seed nếu đã có dữ liệu
  writeStorage(WISH_KEY, [{ name: "Minh Anh", message: "..." }, ...]);
}
```

---

### Gallery Slider

```js
const slides = thumbButtons.map((btn) => ({
  src: btn.dataset.src,
  full: btn.dataset.full,
  alt: btn.querySelector("img").alt,
}));

let currentSlideIndex = 0;

function setActiveSlide(index) {
  currentSlideIndex = (index % count + count) % count; // Vòng lặp hai chiều
  sliderMainImg.src = slides[currentSlideIndex].src;
  thumbButtons.forEach((btn, i) =>
    btn.classList.toggle("active", i === currentSlideIndex)
  );
}

prevButton.addEventListener("click", () => setActiveSlide(currentSlideIndex - 1));
nextButton.addEventListener("click", () => setActiveSlide(currentSlideIndex + 1));
thumbButtons.forEach((btn, i) => btn.addEventListener("click", () => setActiveSlide(i)));
```

Công thức `(index % count + count) % count` đảm bảo vòng lặp không bị âm.

---

### Lightbox

```js
const openCurrentImage = () => {
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
};

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
}

// Đóng khi click vào nền, nhấn Escape
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
```

---

### Copy số tài khoản

```js
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    await navigator.clipboard.writeText(btn.dataset.copy);
    showToast("Đã sao chép số tài khoản.");
  });
});
```

---

### `shootHearts(count)` — Bắn tim

```js
function shootHearts(count = 10) {
  const rect = heartLauncher.getBoundingClientRect();
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("img");
    heart.src = "assets/heart.png";
    heart.className = "floating-heart";
    heart.style.left = `${rect.left + rect.width / 2 - 12}px`;
    heart.style.top  = `${rect.top + 8}px`;
    heart.style.setProperty("--x-drift", `${(Math.random() - 0.5) * 140}px`);
    heart.style.animationDelay = `${i * 70}ms`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1900 + i * 70); // Dọn DOM sau khi animation xong
  }
}
heartLauncher.addEventListener("click", () => shootHearts(12));
```

- Tạo 12 `<img>` tim, gắn vào `body` tại vị trí nút.
- Mỗi tim có độ lệch ngang ngẫu nhiên (`--x-drift`) và delay tăng dần 70ms.
- Xóa khỏi DOM sau khi animation hoàn tất để tránh rác bộ nhớ.

---

## 📊 Tóm Tắt Kiến Trúc

```
index.html (cấu trúc giao diện)
   │
   ├── styles.css (toàn bộ style, responsive, animation)
   │     ├── CSS Variables (palette màu & kích thước)
   │     ├── Layout (Grid-based, .section container)
   │     ├── Components (.card, .btn, .slider, .lightbox...)
   │     └── Breakpoints (1100px / 860px / 560px)
   │
   └── script.js (toàn bộ tương tác)
         ├── IntersectionObserver → .reveal animation
         ├── updateCountdown() → setInterval 1s
         ├── Music toggle (play/pause + spinning disc)
         ├── LocalStorage (RSVP + Wishes CRUD)
         ├── Gallery Slider (setActiveSlide)
         ├── Lightbox (open/close, keyboard support)
         ├── Copy to clipboard (STK ngân hàng)
         └── shootHearts() → DOM animation
```

---

## 💡 Điểm Đáng Chú Ý

- **Không cần backend**: mọi dữ liệu (RSVP, lời chúc) lưu `localStorage` — phù hợp demo, cần thay bằng API/Formspree/Google Sheets nếu dùng thật.
- **Accessibility**: dùng `aria-label`, `aria-hidden`, semantic HTML (`<article>`, `<header>`, `<footer>`, `<blockquote>`).
- **Performance**: ảnh không lazy-load (có thể thêm `loading="lazy"`); nhạc dùng `preload="none`.
- **Responsive tốt**: 3 breakpoint, grid tự collapse về 1 cột trên mobile.
- **UX nhỏ mà hay**: toast tự ẩn, vòng lặp slider hai chiều, tim dọn DOM sau animation.
