// AEM Block for Simple Display
// This will be loaded by AEM Edge Delivery Services

// Function to reverse a string
function reverseString(str) {
  return str.split('').reverse().join('');
}

export default function decorate(block) {
  // Get the block data from the table
  const blockData = block.querySelector('table');
  if (!blockData) return;

  // Extract data from the table - just get the first two rows from column A
  const rows = Array.from(blockData.querySelectorAll('tr'));
  let string1 = '';
  let string2 = '';

  // Get the first two rows of data
  if (rows.length >= 2) {
    const row1 = rows[0];
    const row2 = rows[1];
    const cell1 = row1.querySelector('td');
    const cell2 = row2.querySelector('td');

    if (cell1) string1 = cell1.textContent.trim();
    if (cell2) string2 = cell2.textContent.trim();
  }

  // Generate the HTML content
  const html = `
    <div class="simple-display">
      <div class="top-section">
        <div class="top-content" id="topContent">${string1}</div>
      </div>
      <div class="bottom-section">
        <div class="bottom-content" id="bottomContent">${reverseString(string2)}</div>
      </div>
    </div>
  `;

  // Replace the block content with our HTML
  block.innerHTML = html;
}
