const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle");
const main = document.querySelector("main");
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");
let currentIndex = 1;
let slideTimer = null;

// Floating label handlers
inputs.forEach((inp) => {
  inp.addEventListener("focus", () => {
    inp.classList.add("active");
  });
  inp.addEventListener("blur", () => {
    if (inp.value.trim() !== "") return;
    inp.classList.remove("active");
  });
  // Check initial state
  if (inp.value.trim() !== "") {
    inp.classList.add("active");
  }
});

// Toggle sign-in / sign-up mode
toggle_btn.forEach((btn) => {
  btn.addEventListener("click", () => {
    main.classList.toggle("sign-up-mode");
  });
});

// Carousel slider logic
function moveSlider(index) {
  let currentImage = document.querySelector(`.img-${index}`);
  images.forEach((img) => img.classList.remove("show"));
  if (currentImage) currentImage.classList.add("show");

  const textSlider = document.querySelector(".text-group");
  if (textSlider) {
    textSlider.style.transform = `translateY(${-(index - 1) * 3}rem)`;
  }

  bullets.forEach((bull) => bull.classList.remove("active"));
  if (bullets[index - 1]) bullets[index - 1].classList.add("active");
}

function startAutoSlide() {
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(() => {
    currentIndex++;
    if (currentIndex > images.length) {
      currentIndex = 1;
    }
    moveSlider(currentIndex);
  }, 3500);
}

bullets.forEach((bullet) => {
  bullet.addEventListener("click", function () {
    currentIndex = parseInt(this.dataset.value, 10);
    moveSlider(currentIndex);
    startAutoSlide();
  });
});

startAutoSlide();

// Demo Pills Quick Fill
const demoPills = document.querySelectorAll(".demo-pill");
demoPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    const nis = pill.dataset.nis;
    const pass = pill.dataset.pass;
    const nisInput = document.getElementById("loginNis");
    const passInput = document.getElementById("loginPassword");
    if (nisInput && passInput) {
      nisInput.value = nis;
      passInput.value = pass;
      nisInput.classList.add("active");
      passInput.classList.add("active");
      showToast(`Akun diisi: ${nis}`, "info");
    }
  });
});

// Form Submissions with StorageService Integration
const signInForm = document.getElementById("signInForm");
const signUpForm = document.getElementById("signUpForm");

if (signInForm) {
  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nis = document.getElementById("loginNis").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const users = window.StorageService ? window.StorageService.getUsers() : [];
    const matchedUser = users.find(
      (u) => (u.nis === nis || u.name.toLowerCase() === nis.toLowerCase()) && u.password === password
    );

    if (matchedUser) {
      window.StorageService.setCurrentUser(matchedUser);
      showToast(`Selamat datang kembali, ${matchedUser.name}!`, "success");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 900);
    } else {
      showToast("NIS / Username atau Kata Sandi salah!", "error");
    }
  });
}

if (signUpForm) {
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nis = document.getElementById("regNis").value.trim();
    const name = document.getElementById("regName").value.trim();
    const userClass = document.getElementById("regClass").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    const users = window.StorageService ? window.StorageService.getUsers() : [];
    const exists = users.some((u) => u.nis === nis);

    if (exists) {
      showToast("Nomor Induk (NIS/NIP) ini sudah terdaftar!", "error");
      return;
    }

    const newUser = {
      nis: nis,
      name: name,
      class: userClass,
      role: "siswa",
      password: password,
    };

    window.StorageService.addUser(newUser);
    window.StorageService.setCurrentUser(newUser);
    showToast("Akun berhasil dibuat! Mengalihkan...", "success");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1000);
  });
}

function showToast(message, type = "info") {
  const toast = document.getElementById("loginToast");
  if (!toast) return;
  toast.textContent = message;
  toast.style.borderLeftColor =
    type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#2563eb";
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3500);
}
