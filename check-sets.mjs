import TCGdex from '@tcgdex/sdk';
const sdk = new TCGdex('en');

// Find Uncommon/Common boundaries for each uncertain set
const queries = [
  // gym2: find Rare/Uncommon (around 20-35) and Uncommon/Common (around 60-90)
  ...([20,21,22,28,29,30,31,60,65,70,75,80,85,90,95,100,132].map(n => ({s:'gym2',n}))),
  // neo1: find Uncommon/Common boundary (around 55-80)  
  ...([25,26,50,55,65,70,75,80,111].map(n => ({s:'neo1',n}))),
  // neo2: find Rare/Uncommon (around 26-40) and Uncommon/Common (around 45-55)
  ...([26,27,30,40,45,46,47,48,49,50,55,60,75].map(n => ({s:'neo2',n}))),
  // neo3: find Rare/Uncommon (around 25-40)
  ...([25,26,30,35,36,37,38,39,40,41,42,43,44,45,50,55,60,64,65,66].map(n => ({s:'neo3',n}))),
  // neo4: find Rare/Uncommon boundary
  ...([50,54,55,56,57,58,60].map(n => ({s:'neo4',n}))),
  // lc: find Rare/Uncommon boundary (29=R, 50=U - probe 30-45)
  ...([28,29,30,35,40,45,50].map(n => ({s:'lc',n}))),
  // ecard1: find all boundaries
  ...([1,17,18,30,40,50,55,60,65,70,75,80,90,95,100,110,115,120,130,140,150,165].map(n => ({s:'ecard1',n}))),
  // ecard2: find Rare/Uncommon boundary for numeric cards  
  ...([1,10,17,18,19,20,25,30,40,47,48,49,50,60,70,80,90,100,110,120,130,140,150].map(n => ({s:'ecard2',n}))),
  // ecard3: find all boundaries
  ...([1,10,17,18,19,20,30,40,47,48,49,50,60,70,80,100,110,120,130,140,150].map(n => ({s:'ecard3',n}))),
];

const results = {};
for (const {s, n} of queries) {
  const card = await sdk.card.get(s + '-' + n).catch(() => null);
  if (!results[s]) results[s] = [];
  results[s].push(n + ':' + (card ? card.rarity.replace('Rare Holo','RH').replace('Uncommon','U').replace('Common','C') : '?'));
}

for (const [s, r] of Object.entries(results)) {
  console.log(s + ': ' + r.join(' '));
}


// neo1 - find holo boundary
for (const id of ['neo1']) {
  const results = [];
  for (let n = 1; n <= 30; n++) {
    const card = await sdk.card.get(id + '-' + n).catch(() => null);
    if (card) results.push(n + ':' + card.rarity.replace('Rare Holo','RH').replace('Uncommon','U').replace('Common','C').replace('Rare','R'));
  }
  console.log(id + ' 1-30: ' + results.join(' '));
}

// neo3 - find shining cards
for (const id of ['neo3']) {
  const results = [];
  for (let n = 60; n <= 66; n++) {
    const card = await sdk.card.get(id + '-' + n).catch(() => null);
    if (card) results.push(n + ':' + card.rarity + '(' + card.name + ')');
  }
  console.log(id + ' 60-66: ' + results.join(' | '));
}

// neo4 - check end cards (shining?)
for (const id of ['neo4']) {
  const results = [];
  for (let n = 105; n <= 113; n++) {
    const card = await sdk.card.get(id + '-' + n).catch(() => null);
    if (card) results.push(n + ':' + card.rarity + '(' + card.name + ')');
  }
  console.log(id + ' 105-113: ' + results.join(' | '));
}

// lc - spot check
for (const id of ['lc']) {
  const spots = [1,16,17,28,29,50,51,75,76,110];
  const results = [];
  for (const n of spots) {
    const card = await sdk.card.get(id + '-' + n).catch(() => null);
    if (card) results.push(n + ':' + card.rarity.replace('Rare Holo','RH').replace('Uncommon','U').replace('Common','C').replace('Rare','R'));
  }
  console.log(id + ': ' + results.join(' | '));
}


