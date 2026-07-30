window.NO5_CURRENCY = window.NO5_CURRENCY || 'AED';
const NO5_CURRENCY = window.NO5_CURRENCY;

function renderPrice(price) {
  if (!price) {
    return '';
  }

  return `${price} <span class="currency">${NO5_CURRENCY}</span>`;
}

async function loadCSVData(path, label) {
  try {
    const response = await fetch(path);
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error(`Error loading ${label} data:`, error);
    return [];
  }
}

// Fetch and parse CSV data
async function loadMenuData() {
  return loadCSVData('/assets/data/no5_bakery.csv', 'menu');
}

// Fetch and parse Breakfast CSV data
async function loadBreakfastData() {
  return loadCSVData('/assets/data/no5_breakfast.csv', 'breakfast');
}

// Fetch and parse Coffee CSV data
async function loadCoffeeData() {
  return loadCSVData('/assets/data/no5_coffee.csv', 'coffee');
}

// Fetch and parse Tea CSV data
async function loadTeaData() {
  return loadCSVData('/assets/data/no5_tea.csv', 'tea');
}

// Fetch and parse Cold Drinks CSV data
async function loadColdDrinksData() {
  return loadCSVData('/assets/data/no5_cold_drinks.csv', 'cold drinks');
}

// Fetch and parse Bowls CSV data
async function loadBowlsData() {
  return loadCSVData('/assets/data/no5_bowls.csv', 'bowls');
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
    'Almond Croissant': 'croissant_almond.jpg',
    'Croissant': 'croissant.jpg',
    'Brownie': 'brownie.jpg',
    'Cardamom Bun': 'cardamom_bun.jpg',
    'Cinnamon roll': 'cinnamon_roll.jpg',
    'Chocolate Babka': 'chocolate_babka.jpg',
    'Crème Caramel': 'creme_caramel.jpg',
    'Açai Bowl': 'acai_bowl.jpg',
    'Coconut Cake': 'coconut_cake.jpg',
    'Cheescake with Berry Sauce': 'cheescake_with_berry_sauce.jpg',
    'Pain Au Chocolat': 'pain_au_chocolat.jpg',
    'Peanut Butter Tarte': 'peanut_butter_tarte.jpg',
    'Sea Salt Nutella Cookie': 'sea_salt_nutella_cookie.jpg',
    'Rangeena': 'rangeena.jpg',
    'White Chocolate Saffron': 'white_chocolate_saffron.jpg',
    'Tiramisu': 'tiramisu.jpg',
    'Vanilla Bun': 'vanilla_bun.jpg',
    'Yogurt Bowl': 'yogurt_bowl.jpg',
    'Avocado Toast': 'avocado_toast.jpg',
    'Crumpet Benedict': 'crumpet_benedict.jpg',
    'Popns Muffin': 'popns_muffin.jpg',
    'Chilli Scramble': 'chilli_scramble.jpg',
    'Turkish Eggs': 'turkish_eggs.jpg',
    'Popns Breakfast Plate': 'popns_breakfast_plate.jpg',
    'Berry Smoothie': 'berry_smoothie.jpg',
    'Açai Smoothie': 'acai_smoothie.jpg',
    'Mango Passion': 'mango_passion.jpg',
    'Orange Juice': 'orange_juice.jpg',
    'Watermelon Juice': 'watermelon_juice.jpg',
    'Pineapple Juice': 'pineapple_juice.jpg'
  };

  if (imageMap[title]) {
    return imageMap[title];
  }

  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_') + '.jpg';
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
        <p class="menu-item-price">${renderPrice(item.price)}</p>
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
    <div class="menu_item price"><p>${renderPrice(item.price)}</p></div>
  `;

  return div;
}

// Create tea menu item element from data row
function createTeaMenuItemElement(item) {
  const div = document.createElement('div');
  div.className = 'menu-item tea';

  div.innerHTML = `
    <div class="tea-item">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
    <div class="menu_item price"><p>${renderPrice(item.price)}</p></div>
  `;

  return div;
}

// Create cold drinks menu item element from data row
function createColdDrinksMenuItemElement(item) {
  const div = document.createElement('div');
  div.className = 'menu-item cold-drinks';

  div.innerHTML = `
    <div class="cold-drinks-item">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
    <div class="menu_item price"><p>${renderPrice(item.price)}</p></div>
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

// Initialize breakfast menu
async function initializeBreakfastMenu() {
  const breakfastData = await loadBreakfastData();
  const breakfastContainer = document.getElementById('no5-breakfast-menu-items');

  // Clear existing items
  breakfastContainer.innerHTML = '';

  // Add breakfast items
  breakfastData.forEach(item => {
    const breakfastItemElement = createMenuItemElement(item);
    breakfastContainer.appendChild(breakfastItemElement);
  });
}

// Initialize bowls menu
async function initializeBowlsMenu() {
  const bowlsData = await loadBowlsData();
  const bowlsContainer = document.getElementById('no5-bowls-menu-items');

  // Clear existing items
  bowlsContainer.innerHTML = '';

  // Add bowl items
  bowlsData.forEach(item => {
    const bowlsItemElement = createMenuItemElement(item);
    bowlsContainer.appendChild(bowlsItemElement);
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

// Initialize tea menu
async function initializeTeaMenu() {
  const teaData = await loadTeaData();
  const teaContainer = document.getElementById('no5-tea-menu-items');

  // Clear existing items
  teaContainer.innerHTML = '';

  // Add tea items
  teaData.forEach(item => {
    const teaItemElement = createTeaMenuItemElement(item);
    teaContainer.appendChild(teaItemElement);
  });
}

// Initialize cold drinks menu
async function initializeColdDrinksMenu() {
  const coldDrinksData = await loadColdDrinksData();
  const coldDrinksContainer = document.getElementById('no5-cold-drinks-items');

  // Clear existing items
  coldDrinksContainer.innerHTML = '';

  // Add cold drinks items
  coldDrinksData.forEach(item => {
    const coldDrinksItemElement = createColdDrinksMenuItemElement(item);
    coldDrinksContainer.appendChild(coldDrinksItemElement);
  });
}

// Set copyright year dynamically
function setCurrentYear() {
  const yearElement = document.getElementById('no5-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

function initializeStickyMenu() {
  const menuLinks = Array.from(document.querySelectorAll('.no5-sticky-menu-link'));
  const sectionAnchors = menuLinks
    .map(link => document.getElementById(link.dataset.sectionTarget))
    .filter(Boolean);

  if (!menuLinks.length || !sectionAnchors.length) {
    return;
  }

  const setActiveSection = sectionId => {
    menuLinks.forEach(link => {
      const isActive = link.dataset.sectionTarget === sectionId;
      link.classList.toggle('is-active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  menuLinks.forEach(link => {
    link.addEventListener('click', event => {
      const section = document.getElementById(link.dataset.sectionTarget);

      if (!section) {
        return;
      }

      event.preventDefault();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${section.id}`);
      setActiveSection(section.id);
    });
  });

  const updateActiveFromScroll = () => {
    const focusLine = window.scrollY + window.innerHeight * 0.35;
    let activeSection = sectionAnchors[0];

    sectionAnchors.forEach(section => {
      if (section.offsetTop <= focusLine) {
        activeSection = section;
      }
    });

    setActiveSection(activeSection.id);
  };

  window.addEventListener('scroll', updateActiveFromScroll, { passive: true });
  window.addEventListener('resize', updateActiveFromScroll);
  updateActiveFromScroll();
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  setCurrentYear();
  initializeStickyMenu();
  initializeCoffeeMenu();
  initializeTeaMenu();
  initializeColdDrinksMenu();
  initializeBreakfastMenu();
  initializeBakeryMenu();
  initializeBowlsMenu();
});
