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

// Fetch and parse Coffee CSV data
async function loadCoffeeData() {
  return loadCSVData('/assets/data/no5_coffee.csv', 'coffee');
}

// Fetch and parse Matcha CSV data
async function loadMatchaData() {
  return loadCSVData('/assets/data/no5_matcha.csv', 'matcha');
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
    'Almond Croissant': 'Croissant_Almond.jpg',
    'Croissant': 'Croissant.jpg',
    'Brownie': 'Brownie.jpg',
    'Cardamom Bun': 'Cardamon_Bun.jpg',
    'Cinnamon roll': 'Cinnamon_roll.jpg',
    'cinnamon roll': 'Cinnamon_roll.jpg',
    'Chocolate Babka': 'Chocolate_Babka.jpg',
    'Crème Caramel': 'Creme_Caramel.jpg',
    'Açai Bowl': 'Acai_Bowl.jpg',
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

// Create matcha menu item element from data row
function createMatchaMenuItemElement(item) {
  const div = document.createElement('div');
  div.className = 'menu-item matcha';

  div.innerHTML = `
    <div class="matcha-item">
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
  initializeMatchaMenu();
  initializeBakeryMenu();
  initializeBowlsMenu();
});
