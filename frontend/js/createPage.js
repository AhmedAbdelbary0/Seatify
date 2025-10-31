const createBtn = document.querySelector('.primary-btn');
  const modal = document.getElementById('createEventModal');
  const cancelBtn = document.querySelector('.cancel-btn');
  const seatSlider = document.getElementById('seatLimit');
  const seatValue = document.getElementById('seatValue');

  // Open modal
  createBtn.addEventListener('click', () => {
    modal.classList.add('show');
  });

  // Close modal
  cancelBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Update seat limit number
  seatSlider.addEventListener('input', () => {
    seatValue.textContent = seatSlider.value;
  });