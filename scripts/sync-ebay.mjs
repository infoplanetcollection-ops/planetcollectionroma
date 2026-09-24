import { writeFile } from 'node:fs/promises';

const appId = process.env.EBAY_APP_ID;
const certId = process.env.EBAY_CERT_ID;
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
const params = new URLSearchParams({
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

if (!itemsResponse.ok) {
  throw new Error(`eBay item request failed: ${itemsResponse.status} ${await itemsResponse.text()}`);
}

const data = await itemsResponse.json();
const products = (data.itemSummaries || []).map((item) => ({
  category: categoryFor(item.title),
  name: item.title,
  image: item.image?.imageUrl || item.thumbnailImages?.[0]?.imageUrl,
  ebayUrl: item.itemWebUrl,
  description: 'Inserzione disponibile nel negozio eBay Planet Collection Roma.'
})).filter((item) => item.image && item.ebayUrl);

await writeFile('ebay-products.json', `${JSON.stringify(products, null, 2)}\n`);
console.log(`Saved ${products.length} eBay products.`);

function categoryFor(title = '') {
  const value = title.toLowerCase();
  if (/cosplay|zoro|harry potter|anime/.test(value)) return 'cosplay';
  if (/maschera|mask/.test(value)) return 'maschere';
  if (/parrucca|wig/.test(value)) return 'parrucche';
  if (/trucco|make.?up|fondotinta|rossetto/.test(value)) return 'trucco';
  if (/halloween|scheletro|strega|fantasma|vampiro/.test(value)) return 'halloween';
  if (/vintage|retro|anni 70|anni 80|sip/.test(value)) return 'vintage';
  if (/costume|vestito|abito|camicia/.test(value)) return 'costumi';
  return 'collezionismo';
}
