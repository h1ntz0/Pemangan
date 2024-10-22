document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.getElementById('navbar');
    const navLinksAnchors = document.querySelectorAll('.nav-links a');

    // Toggle burger menu
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Reset navbar and menu styles when resizing
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 700) {
            navLinks.style.display = 'flex';
            navLinks.classList.remove('active');
        } else {
            navLinks.style.display = 'none';
            burgerMenu.classList.remove('active');
        }
    });

    // Smooth scrolling with navbar height offset
    navLinksAnchors.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                window.scrollTo({
                    top: targetSection.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add room options dynamically
    const rooms = [
        "Ruang 22 - Gedung Baru",
        "Ruang 23 - Gedung Baru",
        "Ruang 24 - Gedung Baru",
        "Ruang 25 - Gedung Baru",
        "Ruang 15 - Gedung Lama",
        "Ruang 16 - Gedung Lama",
        "Ruang 401 - Lantai 4",
        "Ruang 403 - Lantai 4",
        "Ruang 1 - Teater",
        "Ruang Guru - Gedung Lama",
        "Ruang 2 - Serbaguna"
    ];

    const roomSelect = document.getElementById('selected-room');

    // Populate the select dropdown with room options
    rooms.forEach(room => {
        let option = document.createElement('option');
        option.value = room;
        option.textContent = room;
        roomSelect.appendChild(option);
    });

    // Fungsi untuk menyaring ruangan
    function filterRooms() {
        const searchInput = document.getElementById('search-room').value.toLowerCase();
        const options = document.querySelectorAll('#selected-room option');

        options.forEach(option => {
            const roomName = option.textContent.toLowerCase();
            option.style.display = roomName.includes(searchInput) ? 'block' : 'none';
        });
    }

    // Menambahkan event listener pada input pencarian
    document.getElementById('search-room').addEventListener('input', filterRooms);
});

