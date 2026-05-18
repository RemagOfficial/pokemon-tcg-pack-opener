/**
 * Achievement definitions.
 * Each achievement has a `filter` that selects the relevant subset of that
 * set's cards. The user completes it when they own all of them.
 *
 * `tcgdexId`   â€” matches the setId field on card objects from tcgdex.js
 * `fallbackTotals` â€” card counts used as denominators when the set hasn't been
 *                    fetched yet (so progress shows 0 / N instead of 0 / 0).
 */

export const ACHIEVEMENT_SETS = [
  {
    id: 'base',
    tcgdexId: 'base1',
    name: 'Base Set',
    year: '1999',
    achievements: [
      {
        id: 'base-common',
        title: 'Common Ground',
        description: 'Collect all Common cards',
        icon: 'â—‹',
        rarity: 'Common',
        fallbackTotal: 38,
        filter: (cards) => cards.filter((c) => c.rarity === 'Common'),
      },
      {
        id: 'base-uncommon',
        title: 'Uncommon Find',
        description: 'Collect all Uncommon cards',
        icon: 'â—‡',
        rarity: 'Uncommon',
        fallbackTotal: 32,
        filter: (cards) => cards.filter((c) => c.rarity === 'Uncommon'),
      },
      {
        id: 'base-rare',
        title: 'Rare Treasure',
        description: 'Collect all Rare cards',
        icon: 'â˜…',
        rarity: 'Rare',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.rarity === 'Rare' && !c.holo),
      },
      {
        id: 'base-holo',
        title: 'Holo Hunter',
        description: 'Collect all Rare Holo cards',
        icon: 'âœ¦',
        rarity: 'Rare Holo',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.holo === true),
      },
      {
        id: 'base-full',
        title: 'Master Trainer',
        description: 'Collect every card in the Base Set',
        icon: 'â—†',
        rarity: null,
        fallbackTotal: 102,
        filter: (cards) => cards,
      },
    ],
  },
  {
    id: 'jungle',
    tcgdexId: 'base2',
    name: 'Jungle',
    year: '1999',
    achievements: [
      {
        id: 'jungle-common',
        title: 'Into the Wild',
        description: 'Collect all Common cards',
        icon: 'â—‹',
        rarity: 'Common',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.rarity === 'Common'),
      },
      {
        id: 'jungle-uncommon',
        title: 'Safari Find',
        description: 'Collect all Uncommon cards',
        icon: 'â—‡',
        rarity: 'Uncommon',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.rarity === 'Uncommon'),
      },
      {
        id: 'jungle-rare',
        title: 'Jungle Prowler',
        description: 'Collect all Rare cards',
        icon: 'â˜…',
        rarity: 'Rare',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.rarity === 'Rare' && !c.holo),
      },
      {
        id: 'jungle-holo',
        title: 'Holo Explorer',
        description: 'Collect all Rare Holo cards',
        icon: 'âœ¦',
        rarity: 'Rare Holo',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.holo === true),
      },
      {
        id: 'jungle-full',
        title: 'Jungle Master',
        description: 'Collect every card in the Jungle set',
        icon: 'â—†',
        rarity: null,
        fallbackTotal: 64,
        filter: (cards) => cards,
      },
    ],
  },
  {
    id: 'fossil',
    tcgdexId: 'base3',
    name: 'Fossil',
    year: '1999',
    achievements: [
      {
        id: 'fossil-common',
        title: 'Stone Age',
        description: 'Collect all Common cards',
        icon: 'â—‹',
        rarity: 'Common',
        fallbackTotal: 14,
        filter: (cards) => cards.filter((c) => c.rarity === 'Common'),
      },
      {
        id: 'fossil-uncommon',
        title: 'Ancient Find',
        description: 'Collect all Uncommon cards',
        icon: 'â—‡',
        rarity: 'Uncommon',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.rarity === 'Uncommon'),
      },
      {
        id: 'fossil-rare',
        title: 'Prehistoric Rare',
        description: 'Collect all Rare cards',
        icon: 'â˜…',
        rarity: 'Rare',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.rarity === 'Rare' && !c.holo),
      },
      {
        id: 'fossil-holo',
        title: 'Fossil Holo',
        description: 'Collect all Rare Holo cards',
        icon: 'âœ¦',
        rarity: 'Rare Holo',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.holo === true),
      },
      {
        id: 'fossil-full',
        title: 'Fossil Master',
        description: 'Collect every card in the Fossil set',
        icon: 'â—†',
        rarity: null,
        fallbackTotal: 62,
        filter: (cards) => cards,
      },
    ],
  },
  {
    id: 'base-set-2',
    tcgdexId: 'base4',
    name: 'Base Set 2',
    year: '2000',
    achievements: [
      {
        id: 'base4-common',
        title: "Collector's Commons",
        description: 'Collect all Common cards',
        icon: 'â—‹',
        rarity: 'Common',
        fallbackTotal: 40,
        filter: (cards) => cards.filter((c) => c.rarity === 'Common'),
      },
      {
        id: 'base4-uncommon',
        title: "Collector's Uncommons",
        description: 'Collect all Uncommon cards',
        icon: 'â—‡',
        rarity: 'Uncommon',
        fallbackTotal: 34,
        filter: (cards) => cards.filter((c) => c.rarity === 'Uncommon'),
      },
      {
        id: 'base4-rare',
        title: "Collector's Rares",
        description: 'Collect all Rare cards',
        icon: 'â˜…',
        rarity: 'Rare',
        fallbackTotal: 28,
        filter: (cards) => cards.filter((c) => c.rarity === 'Rare' && !c.holo),
      },
      {
        id: 'base4-holo',
        title: "Collector's Holos",
        description: 'Collect all Rare Holo cards',
        icon: 'âœ¦',
        rarity: 'Rare Holo',
        fallbackTotal: 28,
        filter: (cards) => cards.filter((c) => c.holo === true),
      },
      {
        id: 'base4-full',
        title: 'Base Set 2 Master',
        description: 'Collect every card in Base Set 2',
        icon: 'â—†',
        rarity: null,
        fallbackTotal: 130,
        filter: (cards) => cards,
      },
    ],
  },
  {
    id: 'rocket',
    tcgdexId: 'base5',
    name: 'Team Rocket',
    year: '2000',
    achievements: [
      {
        id: 'rocket-common',
        title: 'Rocket Recruit',
        description: 'Collect all Common cards',
        icon: 'â—‹',
        rarity: 'Common',
        fallbackTotal: 27,
        filter: (cards) => cards.filter((c) => c.rarity === 'Common'),
      },
      {
        id: 'rocket-uncommon',
        title: 'Rocket Grunt',
        description: 'Collect all Uncommon cards',
        icon: 'â—‡',
        rarity: 'Uncommon',
        fallbackTotal: 24,
        filter: (cards) => cards.filter((c) => c.rarity === 'Uncommon'),
      },
      {
        id: 'rocket-rare',
        title: 'Rocket Admin',
        description: 'Collect all Rare cards',
        icon: 'â˜…',
        rarity: 'Rare',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.rarity === 'Rare' && !c.holo),
      },
      {
        id: 'rocket-holo',
        title: 'Rocket Boss',
        description: 'Collect all Rare Holo cards',
        icon: 'âœ¦',
        rarity: 'Rare Holo',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.holo === true),
      },
      {
        id: 'rocket-full',
        title: 'Rocket Master',
        description: 'Collect every card in the Team Rocket set',
        icon: 'â—†',
        rarity: null,
        fallbackTotal: 83,
        filter: (cards) => cards,
      },
    ],
  },
  // â”€â”€â”€ Gym Series â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'gym-heroes',
    tcgdexId: 'gym1',
    name: 'Gym Heroes',
    year: '2000',
    achievements: [
      { id: 'gym1-common',   title: 'Gym Rookie',    description: 'Collect all Common cards',    icon: 'â—‹', rarity: 'Common',    fallbackTotal: 44,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'gym1-uncommon', title: 'Badge Seeker',  description: 'Collect all Uncommon cards',  icon: 'â—‡', rarity: 'Uncommon',  fallbackTotal: 54,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'gym1-holo',     title: 'Gym Leader',    description: 'Collect all Rare Holo cards', icon: 'âœ¦', rarity: 'Rare Holo', fallbackTotal: 34,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'gym1-full',     title: 'Gym Champion',  description: 'Collect every card in the Gym Heroes set', icon: 'â—†', rarity: null, fallbackTotal: 132, filter: (c) => c },
    ],
  },
  {
    id: 'gym-challenge',
    tcgdexId: 'gym2',
    name: 'Gym Challenge',
    year: '2000',
    achievements: [
      { id: 'gym2-common',   title: 'Challenger',      description: 'Collect all Common cards',    icon: 'â—‹', rarity: 'Common',    fallbackTotal: 73,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'gym2-uncommon', title: 'Rival\'s Path',   description: 'Collect all Uncommon cards',  icon: 'â—‡', rarity: 'Uncommon',  fallbackTotal: 29,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'gym2-rare',     title: 'Badge Master',    description: 'Collect all Rare cards',      icon: 'â˜…', rarity: 'Rare',      fallbackTotal: 10,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'gym2-holo',     title: 'Elite Trainer',   description: 'Collect all Rare Holo cards', icon: 'âœ¦', rarity: 'Rare Holo', fallbackTotal: 20,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'gym2-full',     title: 'Gym Master',      description: 'Collect every card in Gym Challenge', icon: 'â—†', rarity: null, fallbackTotal: 132, filter: (c) => c },
    ],
  },
  // â”€â”€â”€ Neo Series â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'neo-genesis',
    tcgdexId: 'neo1',
    name: 'Neo Genesis',
    year: '2000',
    achievements: [
      { id: 'neo1-common',   title: 'New World',      description: 'Collect all Common cards',    icon: 'â—‹', rarity: 'Common',    fallbackTotal: 57,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'neo1-uncommon', title: 'Johto Journey',  description: 'Collect all Uncommon cards',  icon: 'â—‡', rarity: 'Uncommon',  fallbackTotal: 29,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'neo1-rare',     title: 'Neo Rare',       description: 'Collect all Rare cards',      icon: 'â˜…', rarity: 'Rare',      fallbackTotal: 9,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'neo1-holo',     title: 'Neo Holo',       description: 'Collect all Rare Holo cards', icon: 'âœ¦', rarity: 'Rare Holo', fallbackTotal: 16,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'neo1-full',     title: 'Neo Genesis Master', description: 'Collect every card in Neo Genesis', icon: 'â—†', rarity: null, fallbackTotal: 111, filter: (c) => c },
    ],
  },
  {
    id: 'neo-discovery',
    tcgdexId: 'neo2',
    name: 'Neo Discovery',
    year: '2001',
    achievements: [
      { id: 'neo2-common',   title: 'Expedition',     description: 'Collect all Common cards',    icon: 'â—‹', rarity: 'Common',    fallbackTotal: 21,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'neo2-uncommon', title: 'Discovery',      description: 'Collect all Uncommon cards',  icon: 'â—‡', rarity: 'Uncommon',  fallbackTotal: 15,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'neo2-rare',     title: 'Unown Seeker',   description: 'Collect all Rare cards',      icon: 'â˜…', rarity: 'Rare',      fallbackTotal: 29,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'neo2-holo',     title: 'Neo Holo Finds', description: 'Collect all Rare Holo cards', icon: 'âœ¦', rarity: 'Rare Holo', fallbackTotal: 10,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'neo2-full',     title: 'Neo Discovery Master', description: 'Collect every card in Neo Discovery', icon: 'â—†', rarity: null, fallbackTotal: 75, filter: (c) => c },
    ],
  },
  {
    id: 'neo-revelation',
    tcgdexId: 'neo3',
    name: 'Neo Revelation',
    year: '2001',
    achievements: [
      { id: 'neo3-common',   title: 'Revealed',       description: 'Collect all Common cards',    icon: 'â—‹', rarity: 'Common',    fallbackTotal: 20,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'neo3-uncommon', title: 'Ancient Power',  description: 'Collect all Uncommon cards',  icon: 'â—‡', rarity: 'Uncommon',  fallbackTotal: 15,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'neo3-rare',     title: 'Revelation',     description: 'Collect all Rare cards',      icon: 'â˜…', rarity: 'Rare',      fallbackTotal: 21,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'neo3-holo',     title: 'Revelation Holo', description: 'Collect all Rare Holo cards', icon: 'âœ¦', rarity: 'Rare Holo', fallbackTotal: 8,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'neo3-full',     title: 'Neo Revelation Master', description: 'Collect every card including the Shining PokÃ©mon', icon: 'â—†', rarity: null, fallbackTotal: 66, filter: (c) => c },
    ],
  },
  {
    id: 'neo-destiny',
    tcgdexId: 'neo4',
    name: 'Neo Destiny',
    year: '2002',
    achievements: [
      { id: 'neo4-common',   title: 'Dark Days',      description: 'Collect all Common cards',    icon: 'â—‹', rarity: 'Common',    fallbackTotal: 24,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'neo4-uncommon', title: 'Shadow Path',    description: 'Collect all Uncommon cards',  icon: 'â—‡', rarity: 'Uncommon',  fallbackTotal: 32,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'neo4-rare',     title: 'Dark Rare',      description: 'Collect all Rare cards',      icon: 'â˜…', rarity: 'Rare',      fallbackTotal: 21,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'neo4-holo',     title: 'Dark Holo',      description: 'Collect all Rare Holo cards', icon: 'âœ¦', rarity: 'Rare Holo', fallbackTotal: 28,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'neo4-full',     title: 'Neo Destiny Master', description: 'Collect every card including all Shining PokÃ©mon', icon: 'â—†', rarity: null, fallbackTotal: 113, filter: (c) => c },
    ],
  },
  // â”€â”€â”€ Legendary Collection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'legendary-collection',
    tcgdexId: 'lc',
    name: 'Legendary Collection',
    year: '2002',
    achievements: [
      { id: 'lc-common',   title: 'Legendary Common',   description: 'Collect all Common cards',    icon: 'â—‹', rarity: 'Common',    fallbackTotal: 50,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'lc-uncommon', title: 'Legendary Uncommon', description: 'Collect all Uncommon cards',  icon: 'â—‡', rarity: 'Uncommon',  fallbackTotal: 22,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'lc-rare',     title: 'Legendary Rare',     description: 'Collect all Rare cards',      icon: 'â˜…', rarity: 'Rare',      fallbackTotal: 22,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'lc-holo',     title: 'Legendary Holo',     description: 'Collect all Rare Holo cards', icon: 'âœ¦', rarity: 'Rare Holo', fallbackTotal: 16,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'lc-full',     title: 'Legendary Master',   description: 'Collect every card in the Legendary Collection', icon: 'â—†', rarity: null, fallbackTotal: 110, filter: (c) => c },
    ],
  },
  // â”€â”€â”€ e-Card Series â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'expedition',
    tcgdexId: 'ecard1',
    name: 'Expedition Base Set',
    year: '2002',
    achievements: [
      { id: 'ecard1-common',   title: 'Expedition Common',   description: 'Collect all Common cards',    icon: 'â—‹', rarity: 'Common',    fallbackTotal: 46,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ecard1-uncommon', title: 'Expedition Uncommon', description: 'Collect all Uncommon cards',  icon: 'â—‡', rarity: 'Uncommon',  fallbackTotal: 45,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ecard1-rare',     title: 'Expedition Rare',     description: 'Collect all Rare cards',      icon: 'â˜…', rarity: 'Rare',      fallbackTotal: 57,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ecard1-holo',     title: 'Expedition Holo',     description: 'Collect all Rare Holo cards', icon: 'âœ¦', rarity: 'Rare Holo', fallbackTotal: 17,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ecard1-full',     title: 'Expedition Master',   description: 'Collect every card in the Expedition Base Set', icon: 'â—†', rarity: null, fallbackTotal: 165, filter: (c) => c },
    ],
  },
  {
    id: 'aquapolis',
    tcgdexId: 'ecard2',
    name: 'Aquapolis',
    year: '2003',
    achievements: [
      { id: 'ecard2-common',   title: 'Deep Waters',    description: 'Collect all Common cards',    icon: 'â—‹', rarity: 'Common',    fallbackTotal: 49,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ecard2-uncommon', title: 'Ocean Find',     description: 'Collect all Uncommon cards',  icon: 'â—‡', rarity: 'Uncommon',  fallbackTotal: 57,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ecard2-rare',     title: 'Sea Treasure',   description: 'Collect all Rare cards',      icon: 'â˜…', rarity: 'Rare',      fallbackTotal: 47,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ecard2-holo',     title: 'Aqua Holo',      description: 'Collect all Rare Holo H-cards', icon: 'âœ¦', rarity: 'Rare Holo', fallbackTotal: 32, filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ecard2-full',     title: 'Aquapolis Master', description: 'Collect every card in Aquapolis', icon: 'â—†', rarity: null, fallbackTotal: 185, filter: (c) => c },
    ],
  },
  {
    id: 'skyridge',
    tcgdexId: 'ecard3',
    name: 'Skyridge',
    year: '2003',
    achievements: [
      { id: 'ecard3-common',   title: 'Skybound',       description: 'Collect all Common cards',    icon: 'â—‹', rarity: 'Common',    fallbackTotal: 73,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ecard3-uncommon', title: 'High Altitude',  description: 'Collect all Uncommon cards',  icon: 'â—‡', rarity: 'Uncommon',  fallbackTotal: 37,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ecard3-rare',     title: 'Sky Rare',       description: 'Collect all Rare cards',      icon: 'â˜…', rarity: 'Rare',      fallbackTotal: 40,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ecard3-holo',     title: 'Crystal Skies',  description: 'Collect all Rare Holo H-cards', icon: 'âœ¦', rarity: 'Rare Holo', fallbackTotal: 32, filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ecard3-full',     title: 'Skyridge Master', description: 'Collect every card in Skyridge', icon: 'â—†', rarity: null, fallbackTotal: 182, filter: (c) => c },
    ],
  },
];

/**
 * Number of free packs awarded when an achievement is completed in economy mode.
 * Scales with difficulty (rarity tier â†’ harder to collect).
 */
export function getAchievementReward(ach) {
  if (ach.rarity === null)       return 15; // full set
  if (ach.rarity === 'Rare Holo') return 10;
  if (ach.rarity === 'Rare')      return 7;
  if (ach.rarity === 'Uncommon')  return 5;
  return 3; // Common
}

/**
 * Compute progress for every achievement in every set.
 * Returns a Map<achievementId, { total, owned, complete }>.
 *
 * allCards should be the combined cards from all loaded sets (each card has a
 * `setId` field). For sets not yet loaded, fallbackTotal values are used so
 * the UI still shows a meaningful denominator.
 */
export function computeProgress(allCards, collection) {
  const ownedIds = new Set(collection.map((c) => c.id));
  const result = new Map();

  for (const set of ACHIEVEMENT_SETS) {
    // Pre-filter to only this set's cards
    const setCards = allCards.filter((c) => c.setId === set.tcgdexId);

    for (const ach of set.achievements) {
      const relevant = ach.filter(setCards);
      // If the set isn't loaded yet, fall back to the known card count
      const total = relevant.length > 0 ? relevant.length : (ach.fallbackTotal ?? 0);
      const owned = relevant.filter((c) => ownedIds.has(c.id)).length;
      result.set(ach.id, { total, owned, complete: owned >= total && total > 0 });
    }
  }
  return result;
}
