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
        if (window.innerWidth >= 768) {
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
            // decription: "Ruangan yang berada diselasar Gedung Baru tepat dibagian kiri.";

        "Ruang 23 - Gedung Baru",
            // decription: "Ruangan yang berada diselasar Gedung Baru tepat dibagian kiri disebelah R.22.";

        "Ruang 24 - Gedung Baru",
            // decription: "Ruangan yang berada diselasar Gedung Baru tepat dibagian kanan yang bersambung dengan R.25.";

        "Ruang 25 - Gedung Baru",
            // decription: "Ruangan yang berada diselasar Gedung Baru tepat dibagian kanan yang bersambung dengan R.24.";

        "Ruang 15 - Gedung Lama",
            // decription: "Ruangan yang berada di Gedung Lama, tepatnya didaerah belakang/taman.";

        "Ruang 16 - Gedung Lama",
            // decription: "Ruangan yang berada di Gedung Lama, tepatnya didaerah belakang/taman.";

        "Ruang 401 - Lantai 4",
            // decription: "Ruangan yang berada di Gedung Baru, tepatnya dilantai 4.";

        "Ruang 403 - Lantai 4",
            // decription: "Ruangan yang berada di Gedung Baru, tepatnya dilantai 4.";

        "Ruang 1 - Teater Gedung Lama",
            // decription: "Ruangan yang berada di Gedung Lama, tepatnya didekat pendopo.";

        "Ruang Guru - Gedung Lama",
            // decription: "Ruangan yang berada di Gedung Lama, tepatnya didekat pendopo.";

        "Ruang 2 - Serbaguna Gedung Lama",
            // decription: "Ruangan yang berada di Gedung Lama, tepatnya didekat pendopo kearah luar gerbang.";

        "Ruang 17 - Gedung Lama",
            // decription: "Ruangan yang berada di Gedung Lama, tepatnya didaerah belakang/taman.";

        "Ruang 18 - Gedung Lama",
            // decription: "Ruangan yang berada di Gedung Lama, tepatnya didaerah belakang/taman.";

        "Ruang 19 - Gedung Lama",
            // decription: "Ruangan yang berada di Gedung Lama, tepatnya didaerah belakang/taman.";

        "Ruang 20 - Gedung Lama",
            // decription: "Ruangan yang berada di Gedung Lama, tepatnya didaerah belakang/taman.";

        "Ruang 12 - Gedung Lama",
            // decription: "Ruangan yang berada di Gedung Lama, tepatnya didaerah belakang/taman.";

        "Ruang 13 - Gedung Lama",
            // decription: "Ruangan yang berada di Gedung Lama, tepatnya didaerah belakang/taman.";

        "Ruang 14 - Gedung Lama",
            // decription: "Ruangan yang berada di Gedung Lama, tepatnya didaerah belakang/taman.";

        "Ruang 407 - Lantai 4",
            // decription: "Ruangan yang berada di Gedung Baru, tepatnya dilantai 4.";

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


const form = document.getElementById('booking-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        window.location.href = './User/dashboard.html';
    });