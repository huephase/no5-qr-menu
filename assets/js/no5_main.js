// Fetch and parse CSV data
async function loadMenuData() {
  try {
    const response = await fetch('/assets/data/no5_bakery.csv');
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading menu data:', error);
    return [];
  }
}

// Fetch and parse Coffee CSV data
async function loadCoffeeData() {
  try {
    const response = await fetch('/assets/data/no5_coffee.csv');
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading coffee data:', error);
    return [];
  }
}

// Fetch and parse Matcha CSV data
async function loadMatchaData() {
  try {
    const response = await fetch('/assets/data/no5_matcha.csv');
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading matcha data:', error);
    return [];
  }
}

// Parse CSV text into array of objects
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }

  return data;
}

// Parse a single CSV line handling quoted values
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

// Generate image filename from title
function getImageFilename(title) {
  // Map of special cases
  const imageMap = {
    'Almond Croissant': 'Croissant_Almond.jpg',
    'Croissant': 'Croissant.jpg',
    'Brownie': 'Brownie.jpg',
    'Cardamom Bun': 'Cardamon_Bun.jpg',
    'cinnamon roll': 'cinnamon_roll.jpg',
    'Chocolate Babka': 'Chocolate_Babka.jpg',
    'Crème Caramel': 'Crème_Caramel.jpg',
    'Açai Bowl': 'Açai_Bowl.jpg',
    'Coconut Cake': 'Coconut_Cake.jpg',
    'Cheescake with Berry Sauce': 'Cheescake_with_Berry_Sauce.jpg',
    'Pain Au Chocolat': 'Pain_Au_Chocolat.jpg',
    'Peanut Butter Tarte': 'Peanut_Butter_Tarte.jpg',
    'Sea Salt Nutella Cookie': 'Sea_Salt_Nutella_Cookie.jpg',
    'Rangeena': 'Rangeena.jpg',
    'White Chocolate Saffron': 'White_Chocolate_Saffron.jpg',
    'Tiramisu': 'Tiramisu.jpg',
    'Vanilla Bun': 'Vanilla_Bun.jpg',
    'Greek Yogurt Bowl': 'Greek_Yogurt_Bowl.jpg'
  };

  return imageMap[title] || title.replace(/\s+/g, '_') + '.jpg';
}

// Create bakery menu item element from data row
function createMenuItemElement(item) {
  const div = document.createElement('div');
  div.className = 'menu-item';

  const imageFilename = getImageFilename(item.title);

  div.innerHTML = `
    <img src="assets/img/menu-items/${imageFilename}" alt="${item.title}" class="menu-item-image"/>
    <div class="details">
      <div class="title">
        <h3>${item.title}</h3>
      </div>
      <div class="description">
        <p>${item.description}</p>
      </div>
      <div class="details-list">
        <dl class="calories">
          <dt>Calories</dt>
          <dd>${item.calories} kcal</dd>
        </dl>
        <dl class="allergens">
          <dt>Allergens</dt>
          <dd>${item.allergens}</dd>
        </dl>
      </div>
    </div>
  `;

  return div;
}

// Create coffee menu item element from data row
function createCoffeeMenuItemElement(item) {
  const div = document.createElement('div');
  div.className = 'menu-item coffee';

  div.innerHTML = `
    <div class="coffee-item">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
    <div class="menu_item price"><p>${item.price} <span class="currency">${item.currency}</span></p></div>
  `;

  return div;
}

// Create matcha menu item element from data row
function createMatchaMenuItemElement(item) {
  const div = document.createElement('div');
  div.className = 'menu-item matcha';

  div.innerHTML = `
    <div class="matcha-item">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
    <div class="menu_item price"><p>${item.price} <span class="currency">${item.currency}</span></p></div>
  `;

  return div;
}

// Initialize bakery menu
async function initializeBakeryMenu() {
  const menuData = await loadMenuData();
  const menuContainer = document.getElementById('no5-bakery-menu-items');

  // Clear existing items
  menuContainer.innerHTML = '';

  // Add menu items
  menuData.forEach(item => {
    const menuItemElement = createMenuItemElement(item);
    menuContainer.appendChild(menuItemElement);
  });
}

// Initialize coffee menu
async function initializeCoffeeMenu() {
  const coffeeData = await loadCoffeeData();
  const coffeeContainer = document.getElementById('no5-coffee-menu-items');

  // Clear existing items
  coffeeContainer.innerHTML = '';

  // Add coffee items
  coffeeData.forEach(item => {
    const coffeeItemElement = createCoffeeMenuItemElement(item);
    coffeeContainer.appendChild(coffeeItemElement);
  });
}

// Initialize matcha menu
async function initializeMatchaMenu() {
  const matchaData = await loadMatchaData();
  const matchaContainer = document.getElementById('no5-matcha-menu-items');

  // Clear existing items
  matchaContainer.innerHTML = '';

  // Add matcha items
  matchaData.forEach(item => {
    const matchaItemElement = createMatchaMenuItemElement(item);
    matchaContainer.appendChild(matchaItemElement);
  });
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeCoffeeMenu();
  initializeMatchaMenu();
  initializeBakeryMenu();
});