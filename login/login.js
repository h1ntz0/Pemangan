const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle");
const main = document.querySelector("main");
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");
let currentIndex = 1; // Untuk melacak slide yang sedang aktif

// Event listener untuk input fields
inputs.forEach((inp) => {
  inp.addEventListener("focus", () => {
    inp.classList.add("active");
  });
  inp.addEventListener("blur", () => {
    if (inp.value != "") return;
    inp.classList.remove("active");
  });
});

// Event listener untuk toggle sign-up mode
toggle_btn.forEach((btn) => {
  btn.addEventListener("click", () => {
    main.classList.toggle("sign-up-mode");
  });
});

// Fungsi untuk menggerakkan slider secara manual dan otomatis
function moveSlider(index) {
  // Ubah gambar
  let currentImage = document.querySelector(`.img-${index}`);
  images.forEach((img) => img.classList.remove("show"));
  currentImage.classList.add("show");

  // Geser teks
  const textSlider = document.querySelector(".text-group");
  textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;

  // Update bullets active state
  bullets.forEach((bull) => bull.classList.remove("active"));
  bullets[index - 1].classList.add("active");
}

// Fungsi untuk auto-slide setiap 3 detik
function autoSlide() {
  currentIndex++;
  if (currentIndex > images.length) {
    currentIndex = 1; // Kembali ke gambar pertama setelah gambar terakhir
  }
  moveSlider(currentIndex);
}

// Event listener untuk manual bullet click
bullets.forEach((bullet) => {
  bullet.addEventListener("click", function () {
    currentIndex = this.dataset.value; // Perbarui index berdasarkan bullet yang diklik
    moveSlider(currentIndex);
  });
});

// Mulai auto-slide dengan interval 3 detik
setInterval(autoSlide, 1500);
