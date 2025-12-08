function generateSeatLayout(rows = 5, cols = 10) {
  const layout = [];

  for (let r = 0; r < rows; r++) {
    const rowLetter = String.fromCharCode(65 + r); // 65 → 'A', 66 → 'B', ...

    for (let c = 1; c <= cols; c++) {
      layout.push({
        seatNumber: `${rowLetter}${c}`, // e.g., 'A1'
        row: r + 1,
        column: c,
      });
    }
  }

  return layout;
}

module.exports = generateSeatLayout;
