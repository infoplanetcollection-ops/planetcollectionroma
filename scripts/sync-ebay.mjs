import { readFile, writeFile } from 'node:fs/promises';

const appId = process.env.EBAY_APP_ID?.trim();
const certId = process.env.EBAY_CERT_ID?.trim();
const seller = 'planetcollection2001';

if (!appId || !certId) {
  throw new Error('Missing EBAY_APP_ID or EBAY_CERT_ID');
}

const basicAuth = Buffer.from(`${appId}:${certId}`).toString('base64');
const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
  method: 'POST',
  headers: {
    Authorization: `Basic ${basicAuth}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope'
});

if (!tokenResponse.ok) {
  throw new Error(`eBay token request failed: ${tokenResponse.status} ${await tokenResponse.text()}`);
}

const { access_token: accessToken } = await tokenResponse.json();
const queries = ['costume', 'cosplay', 'maschera', 'parrucca', 'trucco', 'halloween', 'carnevale', 'vintage', 'vestito', 'travestimento'];
const itemsById = new Map();

for (const q of queries) {
  const params = new URLSearchParams({
    q,
    filter: `sellers:{${seller}}`,
    fieldgroups: 'EXTENDED',
    limit: '200'
  });
  const itemsResponse = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_IT'
    }
  });

  if (itemsResponse.status === 204) continue;
  if (!itemsResponse.ok) {
    throw new Error(`eBay item request failed (${q}): ${itemsResponse.status} ${await itemsResponse.text()}`);
  }

  const data = await itemsResponse.json();
  for (const item of data.itemSummaries || []) {
    const key = item.itemId || item.itemWebUrl;
    if (key && !itemsById.has(key)) itemsById.set(key, item);
  }
}

// Classifications from the previous sync are reused for items that neither the
// title nor the eBay categories can classify, so detail lookups (one extra API
// call per item) only run for brand-new unclassified listings.
let previousProducts = [];
try {
  previousProducts = JSON.parse(await readFile('ebay-products.json', 'utf8'));
} catch {
  // First sync ever: no previous classification cache available.
}
const cachedCategoryByItemKey = new Map();
for (const product of Array.isArray(previousProducts) ? previousProducts : []) {
  const key = itemKeyFromUrl(product.ebayUrl);
  if (key && product.category) cachedCategoryByItemKey.set(key, product.category);
}

const stats = { title: 0, ebayCategory: 0, cache: 0, description: 0, fallback: 0 };
const products = [];
const unclassified = [];

for (const item of itemsById.values()) {
  const product = {
    category: null,
    name: item.title,
    image: item.image?.imageUrl || item.thumbnailImages?.[0]?.imageUrl,
    ebayUrl: item.itemWebUrl,
    description: 'Inserzione disponibile nel negozio eBay Planet Collection Roma.'
  };
  if (!product.image || !product.ebayUrl) continue;

  const byTitle = classifyText(item.title);
  const byEbayCategory = byTitle ? null : classifyText((item.categories || []).map((category) => category.categoryName).join(' '));
  if (byTitle) {
    product.category = byTitle;
    stats.title += 1;
    products.push(product);
  } else if (byEbayCategory) {
    product.category = byEbayCategory;
    stats.ebayCategory += 1;
    products.push(product);
  } else {
    unclassified.push({ item, product });
  }
}

// Safety valve: never exceed this many detail lookups in a single run.
const MAX_DETAIL_LOOKUPS = 60;
let detailLookups = 0;

for (const { item, product } of unclassified) {
  const cached = cachedCategoryByItemKey.get(itemKeyFromUrl(item.itemWebUrl));
  if (cached) {
    product.category = cached;
    stats.cache += 1;
  } else if (detailLookups < MAX_DETAIL_LOOKUPS) {
    detailLookups += 1;
    product.category = await classifyByDescription(item);
    stats[product.category ? 'description' : 'fallback'] += 1;
  } else {
    stats.fallback += 1;
  }
  product.category = product.category || 'collezionismo';
  products.push(product);
}

await writeFile('ebay-products.json', `${JSON.stringify(products, null, 2)}\n`);
console.log(`Saved ${products.length} eBay products (${stats.title} by title, ${stats.ebayCategory} by eBay category, ${stats.cache} from cache, ${stats.description} by description, ${stats.fallback} fallback).`);

function itemKeyFromUrl(url = '') {
  return url.match(/\/itm\/(\d+)/)?.[1] || url;
}

async function classifyByDescription(item) {
  if (!item.itemId) return null;
  try {
    const detailResponse = await fetch(`https://api.ebay.com/buy/browse/v1/item/${encodeURIComponent(item.itemId)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_IT'
      }
    });
    if (!detailResponse.ok) return null;
    const detail = await detailResponse.json();
    // shortDescription is seller-written and safest; the full HTML description
    // is stripped of tags and used only as a last resort (it may contain shop
    // boilerplate mentioning unrelated product types).
    const shortText = `${item.title || ''} ${detail.shortDescription || ''}`;
    const fullText = `${shortText} ${(detail.description || '').replace(/<[^>]*>/g, ' ')}`;
    return classifyText(shortText) || classifyText(fullText);
  } catch {
    return null;
  }
}

// Product-type keywords win over the generic "carnevale halloween" prefix that
// the seller adds to almost every title for SEO. A costume that merely includes
// a mask ("... CON MASCHERA") stays a costume, not a mask.
function classifyText(text = '') {
  const value = text.toLowerCase();
  if (/parrucca|wig/.test(value)) return 'parrucche';
  if (/trucco|make.?up|fondotinta|rossetto|cipria|mascara|eyeliner|truccabimbi/.test(value)) return 'trucco';
  if (/maschera|mask|veneziana/.test(value) && !/vestito|costume|tuta|abito|travestimento/.test(value)) return 'maschere';
  if (/cosplay|zoro|harry potter|anime|manga|one piece|naruto/.test(value)) return 'cosplay';
  if (/halloween|scheletro|strega|fantasma|vampiro|zucca|teschio|zombie|horror|skeleton|witch|pumpkin|morticia|pipistrello/.test(value)) return 'halloween';
  if (/costume|vestito|abito|camicia|carnevale|travestimento|tuta|mantello|clown|pirata|principessa/.test(value)) return 'costumi';
  if (/vintage|retro|anni ?['’]?(50|60|70|80|90)|\bsip\b|antico/.test(value)) return 'vintage';
  return null;
}
