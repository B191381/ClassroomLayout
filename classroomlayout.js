document.addEventListener("DOMContentLoaded", function () {
  const rowsContainer = document.getElementById("rows-container");
  const addRowBtn = document.getElementById("add-row");
  const generateLayoutBtn = document.getElementById("generate-layout");
  const layoutContainer = document.getElementById("layout-container");

  // Function to update row numbers dynamically
  function updateRowNumbers() {
    rowsContainer.querySelectorAll("tr").forEach((row, index) => {
      row.cells[0].textContent = `R${index + 1}`;
      row.querySelectorAll("input").forEach((input) => {
        input.dataset.row = index + 1;
      });
    });
  }

  // Function to add a new row
  addRowBtn.addEventListener("click", () => {
    const newRow = document.createElement("tr");
    const rowCount = rowsContainer.children.length + 1;

    newRow.innerHTML = `
      <td>R${rowCount}</td>
      <td><input type="number" value="6" class="seats-input" data-block="1" data-row="${rowCount}" min="0"></td>
      <td><input type="number" value="6" class="seats-input" data-block="2" data-row="${rowCount}" min="0"></td>
      <td><button class="remove-row">❌</button></td>
    `;

    rowsContainer.appendChild(newRow);
  });

  // Function to remove a row
  rowsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-row")) {
      event.target.closest("tr").remove();
      updateRowNumbers();
    }
  });

  // Function to generate the semi-circular layout
  generateLayoutBtn.addEventListener("click", () => {
    layoutContainer.innerHTML = ""; // Clear previous layout

    const totalRows = rowsContainer.querySelectorAll("tr").length;
    const centerX = layoutContainer.clientWidth / 2;
    const centerY = layoutContainer.clientHeight;
    const baseRadius = Math.min(layoutContainer.clientWidth, layoutContainer.clientHeight) / 3;
    //const rowSpacing = baseRadius / totalRows; 
    const rowSpacing = (layoutContainer.clientHeight / (totalRows + 2)); 


    rowsContainer.querySelectorAll("tr").forEach((row, rowIndex) => {
      const block1Seats = parseInt(row.querySelector('[data-block="1"]').value) || 0;
      const block2Seats = parseInt(row.querySelector('[data-block="2"]').value) || 0;
      const rowRadius = baseRadius + rowIndex * rowSpacing;

      const midAngle = Math.PI / 2;
      const blockGap = Math.PI / 10;
      let seatGap = Math.PI / (block1Seats + block2Seats + 4);

      const block1StartAngle = midAngle + blockGap / 2;
      const block2StartAngle = midAngle - blockGap / 2;

      for (let i = 0; i < block1Seats; i++) {
        const angle = block1StartAngle + i * seatGap;
        const x = centerX + rowRadius * Math.cos(angle);
        const y = centerY - rowRadius * Math.sin(angle);
        //createSeat(layoutContainer, x, y, `B1-${block1Seats - i}`);
        createSeat(layoutContainer, x, y, `${block1Seats - i}`, angle - midAngle);
      }

      for (let i = 0; i < block2Seats; i++) {
        const angle = block2StartAngle - i * seatGap;
        const x = centerX + rowRadius * Math.cos(angle);
        const y = centerY - rowRadius * Math.sin(angle);
        //createSeat(layoutContainer, x, y, `B2-${i + 1}`);
        createSeat(layoutContainer, x, y, `${i + 1}`, angle - midAngle);
      }
    });
  });

  function createSeat(container, x, y, label,rotationAngle) {
    const seat = document.createElement("div");
    seat.classList.add("seat");
    seat.textContent = label;
    seat.style.left = `${x}px`;
    seat.style.top = `${y}px`;
    seat.style.transform = `rotate(${rotationAngle * (-180 / Math.PI)}deg)`;
    //const rotationAngle = angle - Math.PI / 2;
    //seat.style.transform = `rotate(${rotationAngle * (-180 / Math.PI)}deg)`;
    container.appendChild(seat);
  }
});
