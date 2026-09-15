const storeUrl = 'https://www.ebay.it/str/planetcollectionroma';
const categories = [
  { key: 'tutti', label: 'Tutto' },
  { key: 'preferiti', label: 'Preferiti' },
  { key: 'costumi', label: 'Costumi' },
  { key: 'halloween', label: 'Halloween' },
  { key: 'maschere', label: 'Maschere' },
  { key: 'parrucche', label: 'Parrucche' },
  { key: 'trucco', label: 'Trucco' },
  { key: 'cosplay', label: 'Cosplay' },
  { key: 'collezionismo', label: 'Collezionismo' },
  { key: 'vintage', label: 'Vintage' }
];

const products = [
  { category: 'collezionismo', name: 'Kinder Sorpresa Fosforescenti Fantasmini 1996', image: 'https://i.ebayimg.com/images/g/UUgAAeSwRkZqNEwL/s-l300.webp', ebayUrl: 'https://www.ebay.it/itm/158010081442', description: 'Inserzione eBay disponibile nel tuo store.' },
  { category: 'collezionismo', name: 'Kinder Brioss Mostri di Bravura 1998/99', image: 'https://i.ebayimg.com/images/g/h7QAAOSwe95gXyV6/s-l300.webp', ebayUrl: 'https://www.ebay.it/itm/164784614139', description: 'Inserzione eBay disponibile nel tuo store.' },
  { category: 'halloween', name: 'Scheletro decorativo Halloween 165 cm', image: 'https://i.ebayimg.com/images/g/3woAAeSw7hJo1TDi/s-l300.webp', ebayUrl: 'https://www.ebay.it/itm/167796946127', description: 'Inserzione eBay disponibile nel tuo store.' },
  { category: 'vintage', name: 'Telefono fisso vintage Sirio SIP', image: 'https://i.ebayimg.com/images/g/PdwAAeSwqUtp3l3L/s-l300.webp', ebayUrl: 'https://www.ebay.it/itm/158052365722', description: 'Inserzione eBay disponibile nel tuo store.' },
  { category: 'costumi', name: 'Camicia uomo anni 70 / 80 Dance', image: 'https://i.ebayimg.com/images/g/v2UAAeSwYHhqo~Gz/s-l300.webp', ebayUrl: 'https://www.ebay.it/itm/168680917442', description: 'Costume per Carnevale, Halloween e feste a tema.' },
  { category: 'collezionismo', name: 'Kinder Sorpresa Paperino e amici Safari', image: 'https://i.ebayimg.com/images/g/lQoAAeSwdDpqGxHW/s-l300.webp', ebayUrl: 'https://www.ebay.it/itm/168416058908', description: 'Inserzione eBay disponibile nel tuo store.' },
  { category: 'halloween', name: 'Copricapo egizio Faraone Aida', image: 'https://i.ebayimg.com/images/g/kAcAAeSwChBpW~fH/s-l300.webp', ebayUrl: 'https://www.ebay.it/itm/168681146760', description: 'Accessorio per Carnevale e Halloween.' },
  { category: 'cosplay', name: 'Tunica Harry Potter', image: 'https://i.ebayimg.com/images/g/FBQAAeSwinxozEFT/s-l300.webp', ebayUrl: 'https://www.ebay.it/itm/167800420100', description: 'Costume a tema per il tuo prossimo cosplay.' },
  { category: 'collezionismo', name: 'Kinder Ciottolosi di Ciottolandia 1997', image: 'https://i.ebayimg.com/images/g/XJAAAOSwM7dl8ymh/s-l300.webp', ebayUrl: 'https://www.ebay.it/itm/154392109205', description: 'Inserzione eBay disponibile nel tuo store.' },
  { category: 'halloween', name: 'Corvo da spalla Malefica', image: 'https://i.ebayimg.com/images/g/eksAAeSwJs5qpCRO/s-l300.webp', ebayUrl: 'https://www.ebay.it/itm/168681118966', description: 'Accessorio scenico per Carnevale e Halloween.' },
  { category: 'collezionismo', name: 'Galeone di Topolino sealed', image: 'https://i.ebayimg.com/images/g/kkoAAeSwGYJp-h2l/s-l300.webp', ebayUrl: 'https://www.ebay.it/itm/168355224371', description: 'Gadget da collezione disponibile su eBay.' },
  { category: 'cosplay', name: 'Cosplay One Piece Roronoa Zoro', image: 'https://i.ebayimg.com/images/g/TBcAAeSwPspp0Uwh/s-l300.webp', ebayUrl: 'https://www.ebay.it/itm/158026569226', description: 'Vestito completo o parrucca per cosplay.' },
  ...Array.from({ length: 16 }, (_, index) => ({
    category: 'costumi',
    name: `Costume ${index + 1}`,
    image: `assets/costumi/costume_${String(index + 1).padStart(2, '0')}.${index === 14 || index === 15 ? 'jpg' : 'png'}`,
    description: 'Look scenico per feste, eventi e occasioni speciali.'
  })),
  ...Array.from({ length: 19 }, (_, index) => ({
    category: 'maschere',
    name: `Maschera ${index + 1}`,
    image: `assets/maschere/mask_${String(index + 1).padStart(2, '0')}.jpg`,
    description: 'Dettaglio originale per un look forte e memorabile.'
  })),
  ...['s-l1600.webp', 's-l1600 (1).webp', 's-l500.webp', 's-l500 (1).webp', 's-l500 (2).webp', 's-l500 (3).webp', 's-l500 (4).webp', 's-l500 (5).webp'].map((fileName, index) => ({
    category: 'parrucche',
    name: `Parrucca ${index + 1}`,
    image: `assets/parrucche/${fileName}`,
    description: 'Colore e carattere per completare il tuo personaggio.'
  })),
  ...['s-l1200-3.webp', 's-l1200-8.webp', 's-l1200-9.webp', 's-l1200-10.webp', 's-l1200-11.webp', 's-l1200-12.webp', 's-l1200-13.webp', 's-l1200-14.webp'].map((fileName, index) => ({
    category: 'trucco',
    name: `Trucco ${index + 1}`,
    image: `assets/trucco/${fileName}`,
    description: 'Prodotti e idee per make-up scenico e creativo.'
  })),
  { category: 'cosplay', name: 'Cosplay Zoro', image: 'assets/zoro.png', description: 'Un look iconico per gli appassionati di cosplay.' }
];

const catalog = document.querySelector('#catalog');
const filters = document.querySelector('#filters');
const search = document.querySelector('#search');
const storageKey = 'planet-saved';

function readSavedProducts() {
  try {
    const raw = localStorage.getItem(storageKey);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (error) {
    return new Set();
  }
}

function writeSavedProducts(saved) {
  try {
    localStorage.setItem(storageKey, JSON.stringify([...saved]));
  } catch (error) {
    // Ignore storage errors gracefully in restricted browsing contexts.
  }
}

const saved = readSavedProducts();
let activeCategory = 'tutti';

function categoryLabel(key) {
  return categories.find((category) => category.key === key)?.label || key;
}

function renderFilters() {
  filters.innerHTML = categories.map((category) => `<button class="filter ${category.key === activeCategory ? 'active' : ''}" data-category="${category.key}">${category.label}</button>`).join('');
  filters.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
    activeCategory = button.dataset.category;
    renderFilters();
    renderProducts();
  }));
}

function renderProducts() {
  const query = search.value.trim().toLowerCase();
  const visible = products.filter((product) => {
    const productKey = `${product.category}-${product.name}`;
    const matchesSaved = activeCategory === 'preferiti' ? saved.has(productKey) : true;
    const matchesCategory = activeCategory === 'tutti' || activeCategory === 'preferiti' ? true : product.category === activeCategory;
    const haystack = `${product.name} ${product.description} ${categoryLabel(product.category)}`.toLowerCase();
    return matchesSaved && matchesCategory && haystack.includes(query);
  });

  if (!visible.length) {
    const emptyMessage = activeCategory === 'preferiti'
      ? 'Nessun prodotto preferito ancora. Salva un articolo con il cuore per trovarlo qui.'
      : 'Nessun prodotto trovato. Prova con un altro termine.';
    catalog.innerHTML = `<div class="empty">${emptyMessage}</div>`;
    return;
  }

  catalog.innerHTML = visible.map((product, index) => {
    const productKey = `${product.category}-${product.name}`;
    const isSaved = saved.has(productKey);
    return `<article class="product" style="animation-delay:${Math.min(index, 12) * 35}ms">
      <div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.closest('.product').remove()" /><button class="heart ${isSaved ? 'saved' : ''}" data-save="${productKey}" aria-label="${isSaved ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}">${isSaved ? '♥' : '♡'}</button></div>
      <div class="product-body"><div class="category">${categoryLabel(product.category)}</div><h2>${product.name}</h2><p>${product.description}</p><a class="ebay-button" href="${product.ebayUrl || storeUrl}" target="_blank" rel="noopener">Vedi su <b>eBay</b> <span aria-hidden="true">↗</span></a></div>
    </article>`;
  }).join('');

  catalog.querySelectorAll('[data-save]').forEach((button) => button.addEventListener('click', () => {
    const key = button.dataset.save;
    saved.has(key) ? saved.delete(key) : saved.add(key);
    writeSavedProducts(saved);
    renderProducts();
  }));
}

search.addEventListener('input', renderProducts);
renderFilters();
renderProducts();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'));
}
