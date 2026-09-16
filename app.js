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

const fallbackProducts = [
  { category: 'halloween', name: 'Scheletro decorativo Halloween 165 cm', image: 'https://i.ebayimg.com/images/g/3woAAeSw7hJo1TDi/s-l300.webp', ebayUrl: 'https://www.ebay.it/itm/167796946127', description: 'Decorazione scenica perfetta per Halloween e feste a tema.' },
  { category: 'maschere', name: 'Maschera da Carnevale diabolica', image: 'assets/maschere/mask_01.jpg', ebayUrl: 'https://www.ebay.it/str/planetcollectionroma', description: 'Maschera da Carnevale e feste in maschera.' },
  { category: 'halloween', name: 'Copricapo egizio Faraone Aida', image: 'https://i.ebayimg.com/images/g/kAcAAeSwChBpW~fH/s-l300.webp', ebayUrl: 'https://www.ebay.it/itm/168681146760', description: 'Accessorio per Carnevale e Halloween.' },
  { category: 'costumi', name: 'Costume da Carnevale da regina', image: 'assets/costumi/costume_01.png', ebayUrl: 'https://www.ebay.it/str/planetcollectionroma', description: 'Look completo per Carnevale e serate a tema.' },
  { category: 'halloween', name: 'Corvo da spalla Malefica', image: 'https://i.ebayimg.com/images/g/eksAAeSwJs5qpCRO/s-l300.webp', ebayUrl: 'https://www.ebay.it/itm/168681118966', description: 'Accessorio scenico per Halloween e spettacoli.' },
  { category: 'parrucche', name: 'Parrucca da Carnevale nera', image: 'assets/parrucche/s-l1600.webp', ebayUrl: 'https://www.ebay.it/str/planetcollectionroma', description: 'Parrucca perfetta per trasformare il look da Carnevale.' },
  { category: 'trucco', name: 'Trucco Halloween effetto scheletro', image: 'assets/trucco/s-l1200-3.webp', ebayUrl: 'https://www.ebay.it/str/planetcollectionroma', description: 'Prodotto e idea make-up per Halloween.' },
  { category: 'costumi', name: 'Costume da Carnevale storico', image: 'assets/costumi/costume_02.png', ebayUrl: 'https://www.ebay.it/str/planetcollectionroma', description: 'Abito elegante e scenografico per il Carnevale.' }
];

function matchesCollectionKeywords(product) {
  const haystack = `${product.name || ''} ${product.description || ''} ${(product.keywords || []).join(' ')}`.toLowerCase();
  return /(carnevale|halloween)/i.test(haystack);
}

function normalizeProducts(feed) {
  const rank = { halloween: 0, costumi: 1, maschere: 2, parrucche: 3, trucco: 4 };
  return feed
    .filter(matchesCollectionKeywords)
    .sort((a, b) => {
      const aRank = rank[a.category] ?? 99;
      const bRank = rank[b.category] ?? 99;
      return aRank - bRank || (a.name || '').localeCompare(b.name || '');
    });
}

async function loadProducts() {
  try {
    const response = await fetch('catalog.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Catalog feed not available');
    }

    const data = await response.json();
    const feed = Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : [];
    if (feed.length) return normalizeProducts(feed);
    return normalizeProducts(fallbackProducts);
  } catch (error) {
    return normalizeProducts(fallbackProducts);
  }
}

let products = [];
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

async function initCatalog() {
  products = await loadProducts();
  renderFilters();
  renderProducts();
}

renderFilters();
initCatalog();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'));
}
