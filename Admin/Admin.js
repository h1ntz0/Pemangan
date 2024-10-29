document.addEventListener('DOMContentLoaded', () => {
  const profileIcon = document.getElementById('profileIcon');
  const profileBox = document.createElement('div');
  const orders = [
    { id: 1, item: 'Ruangan 403', date: '2024-10-20', timeStart: '08:00', timeEnd: '10:00', status: 'Di Acc' },
    { id: 2, item: 'Aula atas', date: '2024-10-18', timeStart: '11:00', timeEnd: '13:00', status: 'Di Acc' },
    { id: 3, item: 'Ruangan Teater', date: '2024-10-15', timeStart: '14:00', timeEnd: '16:00', status: 'Belum Di Acc' },
    { id: 4, item: 'Sekret EC', date: '2024-11-06', timeStart: '15:00', timeEnd: '18:00', status: 'Di Acc' }
  ];

  profileBox.classList.add('profile-box');
  profileBox.innerHTML = `
      <p><strong>Nama Admin:</strong> John Doe</p>
      <p><strong>Posisi:</strong> Administrator</p>
      <p><strong>Email:</strong> admin@example.com</p>
  `;
  document.body.appendChild(profileBox);
  profileBox.style.display = 'none';

  profileIcon.addEventListener('click', () => {
    profileBox.style.display = profileBox.style.display === 'none' ? 'block' : 'none';
    profileBox.classList.toggle('visible');
  });

  const orderList = document.getElementById('orderList');
  orders.forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
          <td>${order.id}</td>
          <td>${order.item}</td>
          <td>
              <label>
                  <input type="checkbox" ${order.status === 'Di Acc' ? 'checked' : ''} 
                  data-order-id="${order.id}">
                  Di Acc
              </label>
          </td>
          <td>${order.date}</td>
          <td>${order.timeStart} - ${order.timeEnd}</td>
      `;
    orderList.appendChild(row);
  });

  orderList.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
      const orderId = event.target.getAttribute('data-order-id');
      const order = orders.find(o => o.id == orderId);
      order.status = event.target.checked ? 'Di Acc' : 'Belum Di Acc';
      alert(`Status order ${order.item} diubah menjadi ${order.status}`);
    }
  });

  // Fungsi untuk animasi teks
  function typingEffect(element, text, delay) {
    let index = 0;
    function type() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, delay);
      } else {
        setTimeout(() => {
          element.textContent = "";
          index = 0;
          type();
        }, 2000);
      }
    }
    type();
  }

  const welcomeElement = document.getElementById('welcomeText');
  typingEffect(welcomeElement, "Welcome Admin Pemangan", 100);
});

document.getElementById('backHomeBtn').addEventListener('click', () => {
  window.open('../index.html', '_blank');
});

document.querySelector('.btn-report').addEventListener('click', function () {
  window.open('../index.html', '_blank');
});