document.addEventListener('DOMContentLoaded', () => {
  const profileIcon = document.getElementById('profileIcon');
  const profileBox = document.createElement('div');
  const orders = [
    { id: 1, item: 'Ruangan 403', date: '2024-10-20', status: 'Di Acc', time: '08:00 - 10:00' },
    { id: 2, item: 'Aula atas', date: '2024-10-18', status: 'Di Acc', time: '11:00 - 13:00' },
    { id: 3, item: 'Ruangan Teater', date: '2024-10-15', status: 'Belum Di Acc', time: '14:00 - 16:00' },
    { id: 4, item: 'Sekret EC', date: '2024-11-96', status: 'Di Acc', time: '15:00 - 18:00' }
  ];

  profileBox.classList.add('profile-box');
  profileBox.innerHTML = `
        <p><strong>Nama:</strong> John Doe</p>
        <p><strong>Alamat:</strong> 1234 Jl. Sawah Besar</p>
        <p><strong>Email:</strong> jsjs@example.com</p>
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
        <td>${order.status}</td>
        <td>${order.date}</td>
        <td>${order.time}</td>
      `;
    orderList.appendChild(row);
  });
});

document.getElementById('backHomeBtn').addEventListener('click', () => {
  window.open('../index.html', '_blank');
});

document.querySelector('.btn-report').addEventListener('click', function() {
  window.open('../index.html', '_blank'); 
});