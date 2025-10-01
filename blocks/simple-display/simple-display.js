// AEM Block for Simple Display
// This will be loaded by AEM Edge Delivery Services

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

// Function to reverse a string
function reverseString(str) {
  return str.split('').reverse().join('');
}

// Load data from Google Sheet
async function loadSheetData() {
  try {
    // Get the current page URL to determine the sheet URL
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split('/').slice(0, 3).join('/');
    
    // Try to get the sheet URL from the page metadata or use a default
    let sheetUrl = '';
    
    // Look for sheet URL in meta tags or try to construct it
    const metaSheet = document.querySelector('meta[name="sheet-url"]');
    if (metaSheet) {
      sheetUrl = metaSheet.getAttribute('content');
    } else {
      // Use the fstab.yaml URL as fallback
      sheetUrl = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0';
    }
    
    // Convert Google Sheet URL to CSV format
    const csvUrl = sheetUrl.replace('/edit#gid=', '/export?format=csv&gid=');
    
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch sheet data');
    }
    
    const csvText = await response.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length >= 2) {
      const string1 = lines[0].trim();
      const string2 = lines[1].trim();
      const reversedString2 = reverseString(string2);
      
      // Update the display
      const topContent = document.getElementById('topContent');
      const bottomContent = document.getElementById('bottomContent');
      
      if (topContent) {
        topContent.textContent = string1;
      }
      
      if (bottomContent) {
        bottomContent.textContent = reversedString2;
      }
    } else {
      throw new Error('Sheet must have at least 2 rows');
    }
    
  } catch (error) {
    console.error('Error loading sheet data:', error);
    const topContent = document.getElementById('topContent');
    const bottomContent = document.getElementById('bottomContent');
    
    if (topContent) {
      topContent.textContent = 'Error loading data';
    }
    if (bottomContent) {
      bottomContent.textContent = 'Error loading data';
    }
  }
}
