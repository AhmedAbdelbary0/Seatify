const createBtn = document.querySelector('.primary-btn');
const modal = document.getElementById('createEventModal');
const cancelBtn = document.querySelector('.cancel-btn');
const seatSlider = document.getElementById('seatLimit');
const seatValue = document.getElementById('seatValue');
const continueBtn = document.querySelector('.continue-btn');
const backBtn = document.querySelector('.back-btn');
const createModal = document.getElementById('createEventModal');
const seatsModal = document.getElementById('seatsLayoutModal');
const seatGrid = document.getElementById('seatGrid');
const rowsSlider = document.getElementById('rowsSlider');
const colsSlider = document.getElementById('colsSlider');
const rowsValue = document.getElementById('rowsValue');
const colsValue = document.getElementById('colsValue');
const userIcon = document.getElementById('userIcon');
const dropdownMenu = document.getElementById('dropdownMenu');

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

  function generateSeatGrid(rows, cols) {
    seatGrid.innerHTML = '';
    seatGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    for (let i = 0; i < rows * cols; i++) {
      const seat = document.createElement('div');
      seat.classList.add('seat');
      seatGrid.appendChild(seat);
    }
  }
  
  // Initialize
  generateSeatGrid(4, 4);
  
  // Open Seats Layout modal
  continueBtn.addEventListener('click', () => {
    createModal.classList.remove('show');
    seatsModal.classList.add('show');
  });
  
  // Back button
  backBtn.addEventListener('click', () => {
    seatsModal.classList.remove('show');
    createModal.classList.add('show');
  });
  
  // Sliders
  rowsSlider.addEventListener('input', () => {
    rowsValue.textContent = rowsSlider.value;
    generateSeatGrid(parseInt(rowsSlider.value), parseInt(colsSlider.value));
  });
  
  colsSlider.addEventListener('input', () => {
    colsValue.textContent = colsSlider.value;
    generateSeatGrid(parseInt(rowsSlider.value), parseInt(colsSlider.value));

  });

  userIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
  });
  
  // Close dropdown when clicking outside
  window.addEventListener('click', (e) => {
    if (!dropdownMenu.contains(e.target) && !userIcon.contains(e.target)) {
      dropdownMenu.classList.remove('show');
    }
  });