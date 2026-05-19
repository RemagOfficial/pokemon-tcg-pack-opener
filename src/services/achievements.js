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
        icon: '○',
        rarity: 'Common',
        fallbackTotal: 38,
        filter: (cards) => cards.filter((c) => c.rarity === 'Common'),
      },
      {
        id: 'base-uncommon',
        title: 'Uncommon Find',
        description: 'Collect all Uncommon cards',
        icon: '◇',
        rarity: 'Uncommon',
        fallbackTotal: 32,
        filter: (cards) => cards.filter((c) => c.rarity === 'Uncommon'),
      },
      {
        id: 'base-rare',
        title: 'Rare Treasure',
        description: 'Collect all Rare cards',
        icon: '★',
        rarity: 'Rare',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.rarity === 'Rare' && !c.holo),
      },
      {
        id: 'base-holo',
        title: 'Holo Hunter',
        description: 'Collect all Rare Holo cards',
        icon: '✦',
        rarity: 'Rare Holo',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.holo === true),
      },
      {
        id: 'base-full',
        title: 'Master Trainer',
        description: 'Collect every card in the Base Set',
        icon: '◆',
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
        icon: '○',
        rarity: 'Common',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.rarity === 'Common'),
      },
      {
        id: 'jungle-uncommon',
        title: 'Safari Find',
        description: 'Collect all Uncommon cards',
        icon: '◇',
        rarity: 'Uncommon',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.rarity === 'Uncommon'),
      },
      {
        id: 'jungle-rare',
        title: 'Jungle Prowler',
        description: 'Collect all Rare cards',
        icon: '★',
        rarity: 'Rare',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.rarity === 'Rare' && !c.holo),
      },
      {
        id: 'jungle-holo',
        title: 'Holo Explorer',
        description: 'Collect all Rare Holo cards',
        icon: '✦',
        rarity: 'Rare Holo',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.holo === true),
      },
      {
        id: 'jungle-full',
        title: 'Jungle Master',
        description: 'Collect every card in the Jungle set',
        icon: '◆',
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
        icon: '○',
        rarity: 'Common',
        fallbackTotal: 14,
        filter: (cards) => cards.filter((c) => c.rarity === 'Common'),
      },
      {
        id: 'fossil-uncommon',
        title: 'Ancient Find',
        description: 'Collect all Uncommon cards',
        icon: '◇',
        rarity: 'Uncommon',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.rarity === 'Uncommon'),
      },
      {
        id: 'fossil-rare',
        title: 'Prehistoric Rare',
        description: 'Collect all Rare cards',
        icon: '★',
        rarity: 'Rare',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.rarity === 'Rare' && !c.holo),
      },
      {
        id: 'fossil-holo',
        title: 'Fossil Holo',
        description: 'Collect all Rare Holo cards',
        icon: '✦',
        rarity: 'Rare Holo',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.holo === true),
      },
      {
        id: 'fossil-full',
        title: 'Fossil Master',
        description: 'Collect every card in the Fossil set',
        icon: '◆',
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
        icon: '○',
        rarity: 'Common',
        fallbackTotal: 40,
        filter: (cards) => cards.filter((c) => c.rarity === 'Common'),
      },
      {
        id: 'base4-uncommon',
        title: "Collector's Uncommons",
        description: 'Collect all Uncommon cards',
        icon: '◇',
        rarity: 'Uncommon',
        fallbackTotal: 34,
        filter: (cards) => cards.filter((c) => c.rarity === 'Uncommon'),
      },
      {
        id: 'base4-rare',
        title: "Collector's Rares",
        description: 'Collect all Rare cards',
        icon: '★',
        rarity: 'Rare',
        fallbackTotal: 28,
        filter: (cards) => cards.filter((c) => c.rarity === 'Rare' && !c.holo),
      },
      {
        id: 'base4-holo',
        title: "Collector's Holos",
        description: 'Collect all Rare Holo cards',
        icon: '✦',
        rarity: 'Rare Holo',
        fallbackTotal: 28,
        filter: (cards) => cards.filter((c) => c.holo === true),
      },
      {
        id: 'base4-full',
        title: 'Base Set 2 Master',
        description: 'Collect every card in Base Set 2',
        icon: '◆',
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
        icon: '○',
        rarity: 'Common',
        fallbackTotal: 27,
        filter: (cards) => cards.filter((c) => c.rarity === 'Common'),
      },
      {
        id: 'rocket-uncommon',
        title: 'Rocket Grunt',
        description: 'Collect all Uncommon cards',
        icon: '◇',
        rarity: 'Uncommon',
        fallbackTotal: 24,
        filter: (cards) => cards.filter((c) => c.rarity === 'Uncommon'),
      },
      {
        id: 'rocket-rare',
        title: 'Rocket Admin',
        description: 'Collect all Rare cards',
        icon: '★',
        rarity: 'Rare',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.rarity === 'Rare' && !c.holo),
      },
      {
        id: 'rocket-holo',
        title: 'Rocket Boss',
        description: 'Collect all Rare Holo cards',
        icon: '✦',
        rarity: 'Rare Holo',
        fallbackTotal: 16,
        filter: (cards) => cards.filter((c) => c.holo === true),
      },
      {
        id: 'rocket-full',
        title: 'Rocket Master',
        description: 'Collect every card in the Team Rocket set',
        icon: '◆',
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
      { id: 'gym1-common',   title: 'Gym Rookie',    description: 'Collect all Common cards',    icon: '○', rarity: 'Common',    fallbackTotal: 44,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'gym1-uncommon', title: 'Badge Seeker',  description: 'Collect all Uncommon cards',  icon: '◇', rarity: 'Uncommon',  fallbackTotal: 54,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'gym1-holo',     title: 'Gym Leader',    description: 'Collect all Rare Holo cards', icon: '✦', rarity: 'Rare Holo', fallbackTotal: 34,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'gym1-full',     title: 'Gym Champion',  description: 'Collect every card in the Gym Heroes set', icon: '◆', rarity: null, fallbackTotal: 132, filter: (c) => c },
    ],
  },
  {
    id: 'gym-challenge',
    tcgdexId: 'gym2',
    name: 'Gym Challenge',
    year: '2000',
    achievements: [
      { id: 'gym2-common',   title: 'Challenger',      description: 'Collect all Common cards',    icon: '○', rarity: 'Common',    fallbackTotal: 73,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'gym2-uncommon', title: 'Rival\'s Path',   description: 'Collect all Uncommon cards',  icon: '◇', rarity: 'Uncommon',  fallbackTotal: 29,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'gym2-rare',     title: 'Badge Master',    description: 'Collect all Rare cards',      icon: '★', rarity: 'Rare',      fallbackTotal: 10,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'gym2-holo',     title: 'Elite Trainer',   description: 'Collect all Rare Holo cards', icon: '✦', rarity: 'Rare Holo', fallbackTotal: 20,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'gym2-full',     title: 'Gym Master',      description: 'Collect every card in Gym Challenge', icon: '◆', rarity: null, fallbackTotal: 132, filter: (c) => c },
    ],
  },
  // â”€â”€â”€ Neo Series â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'neo-genesis',
    tcgdexId: 'neo1',
    name: 'Neo Genesis',
    year: '2000',
    achievements: [
      { id: 'neo1-common',   title: 'New World',      description: 'Collect all Common cards',    icon: '○', rarity: 'Common',    fallbackTotal: 57,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'neo1-uncommon', title: 'Johto Journey',  description: 'Collect all Uncommon cards',  icon: '◇', rarity: 'Uncommon',  fallbackTotal: 29,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'neo1-rare',     title: 'Neo Rare',       description: 'Collect all Rare cards',      icon: '★', rarity: 'Rare',      fallbackTotal: 9,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'neo1-holo',     title: 'Neo Holo',       description: 'Collect all Rare Holo cards', icon: '✦', rarity: 'Rare Holo', fallbackTotal: 16,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'neo1-full',     title: 'Neo Genesis Master', description: 'Collect every card in Neo Genesis', icon: '◆', rarity: null, fallbackTotal: 111, filter: (c) => c },
    ],
  },
  {
    id: 'neo-discovery',
    tcgdexId: 'neo2',
    name: 'Neo Discovery',
    year: '2001',
    achievements: [
      { id: 'neo2-common',   title: 'Expedition',     description: 'Collect all Common cards',    icon: '○', rarity: 'Common',    fallbackTotal: 21,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'neo2-uncommon', title: 'Discovery',      description: 'Collect all Uncommon cards',  icon: '◇', rarity: 'Uncommon',  fallbackTotal: 15,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'neo2-rare',     title: 'Unown Seeker',   description: 'Collect all Rare cards',      icon: '★', rarity: 'Rare',      fallbackTotal: 29,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'neo2-holo',     title: 'Neo Holo Finds', description: 'Collect all Rare Holo cards', icon: '✦', rarity: 'Rare Holo', fallbackTotal: 10,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'neo2-full',     title: 'Neo Discovery Master', description: 'Collect every card in Neo Discovery', icon: '◆', rarity: null, fallbackTotal: 75, filter: (c) => c },
    ],
  },
  {
    id: 'neo-revelation',
    tcgdexId: 'neo3',
    name: 'Neo Revelation',
    year: '2001',
    achievements: [
      { id: 'neo3-common',   title: 'Revealed',       description: 'Collect all Common cards',    icon: '○', rarity: 'Common',    fallbackTotal: 20,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'neo3-uncommon', title: 'Ancient Power',  description: 'Collect all Uncommon cards',  icon: '◇', rarity: 'Uncommon',  fallbackTotal: 15,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'neo3-rare',     title: 'Revelation',     description: 'Collect all Rare cards',      icon: '★', rarity: 'Rare',      fallbackTotal: 21,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'neo3-holo',     title: 'Revelation Holo', description: 'Collect all Rare Holo cards', icon: '✦', rarity: 'Rare Holo', fallbackTotal: 8,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'neo3-full',     title: 'Neo Revelation Master', description: 'Collect every card including the Shining Pokémon', icon: '◆', rarity: null, fallbackTotal: 66, filter: (c) => c },
    ],
  },
  {
    id: 'neo-destiny',
    tcgdexId: 'neo4',
    name: 'Neo Destiny',
    year: '2002',
    achievements: [
      { id: 'neo4-common',   title: 'Dark Days',      description: 'Collect all Common cards',    icon: '○', rarity: 'Common',    fallbackTotal: 24,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'neo4-uncommon', title: 'Shadow Path',    description: 'Collect all Uncommon cards',  icon: '◇', rarity: 'Uncommon',  fallbackTotal: 32,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'neo4-rare',     title: 'Dark Rare',      description: 'Collect all Rare cards',      icon: '★', rarity: 'Rare',      fallbackTotal: 21,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'neo4-holo',     title: 'Dark Holo',      description: 'Collect all Rare Holo cards', icon: '✦', rarity: 'Rare Holo', fallbackTotal: 28,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'neo4-full',     title: 'Neo Destiny Master', description: 'Collect every card including all Shining Pokémon', icon: '◆', rarity: null, fallbackTotal: 113, filter: (c) => c },
    ],
  },
  // â”€â”€â”€ Legendary Collection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'legendary-collection',
    tcgdexId: 'lc',
    name: 'Legendary Collection',
    year: '2002',
    achievements: [
      { id: 'lc-common',   title: 'Legendary Common',   description: 'Collect all Common cards',    icon: '○', rarity: 'Common',    fallbackTotal: 50,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'lc-uncommon', title: 'Legendary Uncommon', description: 'Collect all Uncommon cards',  icon: '◇', rarity: 'Uncommon',  fallbackTotal: 22,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'lc-rare',     title: 'Legendary Rare',     description: 'Collect all Rare cards',      icon: '★', rarity: 'Rare',      fallbackTotal: 22,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'lc-holo',     title: 'Legendary Holo',     description: 'Collect all Rare Holo cards', icon: '✦', rarity: 'Rare Holo', fallbackTotal: 16,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'lc-full',     title: 'Legendary Master',   description: 'Collect every card in the Legendary Collection', icon: '◆', rarity: null, fallbackTotal: 110, filter: (c) => c },
    ],
  },
  // â”€â”€â”€ e-Card Series â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'expedition',
    tcgdexId: 'ecard1',
    name: 'Expedition Base Set',
    year: '2002',
    achievements: [
      { id: 'ecard1-common',   title: 'Expedition Common',   description: 'Collect all Common cards',    icon: '○', rarity: 'Common',    fallbackTotal: 46,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ecard1-uncommon', title: 'Expedition Uncommon', description: 'Collect all Uncommon cards',  icon: '◇', rarity: 'Uncommon',  fallbackTotal: 45,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ecard1-rare',     title: 'Expedition Rare',     description: 'Collect all Rare cards',      icon: '★', rarity: 'Rare',      fallbackTotal: 57,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ecard1-holo',     title: 'Expedition Holo',     description: 'Collect all Rare Holo cards', icon: '✦', rarity: 'Rare Holo', fallbackTotal: 17,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ecard1-full',     title: 'Expedition Master',   description: 'Collect every card in the Expedition Base Set', icon: '◆', rarity: null, fallbackTotal: 165, filter: (c) => c },
    ],
  },
  {
    id: 'aquapolis',
    tcgdexId: 'ecard2',
    name: 'Aquapolis',
    year: '2003',
    achievements: [
      { id: 'ecard2-common',   title: 'Deep Waters',    description: 'Collect all Common cards',    icon: '○', rarity: 'Common',    fallbackTotal: 49,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ecard2-uncommon', title: 'Ocean Find',     description: 'Collect all Uncommon cards',  icon: '◇', rarity: 'Uncommon',  fallbackTotal: 57,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ecard2-rare',     title: 'Sea Treasure',   description: 'Collect all Rare cards',      icon: '★', rarity: 'Rare',      fallbackTotal: 47,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ecard2-holo',     title: 'Aqua Holo',      description: 'Collect all Rare Holo H-cards', icon: '✦', rarity: 'Rare Holo', fallbackTotal: 32, filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ecard2-full',     title: 'Aquapolis Master', description: 'Collect every card in Aquapolis', icon: '◆', rarity: null, fallbackTotal: 185, filter: (c) => c },
    ],
  },
  {
    id: 'skyridge',
    tcgdexId: 'ecard3',
    name: 'Skyridge',
    year: '2003',
    achievements: [
      { id: 'ecard3-common',   title: 'Skybound',       description: 'Collect all Common cards',    icon: '○', rarity: 'Common',    fallbackTotal: 73,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ecard3-uncommon', title: 'High Altitude',  description: 'Collect all Uncommon cards',  icon: '◇', rarity: 'Uncommon',  fallbackTotal: 37,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ecard3-rare',     title: 'Sky Rare',       description: 'Collect all Rare cards',      icon: '★', rarity: 'Rare',      fallbackTotal: 40,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ecard3-holo',     title: 'Crystal Skies',  description: 'Collect all Rare Holo H-cards', icon: '✦', rarity: 'Rare Holo', fallbackTotal: 32, filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ecard3-full',     title: 'Skyridge Master', description: 'Collect every card in Skyridge', icon: '◆', rarity: null, fallbackTotal: 182, filter: (c) => c },
    ],
  },
  {
    id: 'ex-ruby-sapphire',
    tcgdexId: 'ex1',
    name: 'EX Ruby & Sapphire',
    year: '2003',
    achievements: [
      { id: 'ex1-common',   title: 'Ruby Plains',    description: 'Collect all Common cards',                      icon: '○',  rarity: 'Common',    fallbackTotal: 40,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ex1-uncommon', title: 'Double Edge',    description: 'Collect all Uncommon cards',                    icon: '◇',  rarity: 'Uncommon',  fallbackTotal: 34,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ex1-rare',     title: 'Gemstone Find',  description: 'Collect all Rare cards',                        icon: '★',  rarity: 'Rare',      fallbackTotal: 13,  filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ex1-holo',     title: 'Holo Ruby',      description: 'Collect all Rare Holo cards',                   icon: '✦',  rarity: 'Rare Holo', fallbackTotal: 11,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ex1-ex',       title: 'EX Collector',   description: 'Collect all EX Pokemon cards',                           icon: '★',  rarity: 'Rare ex',      fallbackTotal: 11,  filter: (c) => c.filter((x) => x.rarity === 'Rare ex') },
      { id: 'ex1-complete', title: 'EX Master',       description: 'Own at least one print of every card in EX Ruby & Sapphire', icon: '◆',  rarity: null,           fallbackTotal: 109, anyVariant: true, filter: (c) => c.filter((x) => !x.reverseHolo) },
      { id: 'ex1-full',     title: 'True EX Master',  description: 'Own every card and every Reverse Holo in EX Ruby & Sapphire', icon: '◈',  rarity: 'all-variants', fallbackTotal: 207, filter: (c) => c },
    ],
  },
  {
    id: 'ex-sandstorm',
    tcgdexId: 'ex2',
    name: 'EX Sandstorm',
    year: '2003',
    achievements: [
      { id: 'ex2-common',   title: 'Desert Basics',   description: 'Collect all Common cards',                icon: '○', rarity: 'Common',       fallbackTotal: 47,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ex2-uncommon', title: 'Sandstorm Sweep', description: 'Collect all Uncommon cards',              icon: '◇', rarity: 'Uncommon',     fallbackTotal: 28,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ex2-rare',     title: 'Ancient Sands',   description: 'Collect all Rare cards',                  icon: '★', rarity: 'Rare',         fallbackTotal: 9,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ex2-holo',     title: 'Holo Desert',     description: 'Collect all Rare Holo cards',             icon: '✦', rarity: 'Rare Holo',    fallbackTotal: 8,   filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ex2-ex',       title: 'Oasis Hunters',   description: 'Collect all EX Pokemon cards',            icon: '★', rarity: 'Rare ex',      fallbackTotal: 8,   filter: (c) => c.filter((x) => x.rarity === 'Rare ex') },
      { id: 'ex2-complete', title: 'Sandstorm Master', description: 'Own at least one print of every card in EX Sandstorm', icon: '◆', rarity: null, fallbackTotal: 100, anyVariant: true, filter: (c) => c.filter((x) => !x.reverseHolo) },
      { id: 'ex2-full',     title: 'True Sandstorm Master', description: 'Own every card and every Reverse Holo in EX Sandstorm', icon: '◈', rarity: 'all-variants', fallbackTotal: 192, filter: (c) => c },
    ],
  },
  {
    id: 'ex-dragon',
    tcgdexId: 'ex3',
    name: 'EX Dragon',
    year: '2003',
    achievements: [
      { id: 'ex3-common',   title: 'Dragon Egg',      description: 'Collect all Common cards',                icon: '○', rarity: 'Common',       fallbackTotal: 44,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ex3-uncommon', title: 'Dragon Trainer',  description: 'Collect all Uncommon cards',              icon: '◇', rarity: 'Uncommon',     fallbackTotal: 28,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ex3-rare',     title: 'Dragon Rare',     description: 'Collect all Rare cards',                  icon: '★', rarity: 'Rare',         fallbackTotal: 7,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ex3-holo',     title: 'Holo Dragon',     description: 'Collect all Rare Holo cards',             icon: '✦', rarity: 'Rare Holo',    fallbackTotal: 8,   filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ex3-ex',       title: 'Dragon Lord',     description: 'Collect all EX Pokemon cards',            icon: '★', rarity: 'Rare ex',      fallbackTotal: 9,   filter: (c) => c.filter((x) => x.rarity === 'Rare ex') },
      { id: 'ex3-complete', title: 'Dragon Master',   description: 'Own at least one print of every card in EX Dragon', icon: '◆', rarity: null, fallbackTotal: 100, anyVariant: true, filter: (c) => c.filter((x) => !x.reverseHolo) },
      { id: 'ex3-full',     title: 'True Dragon Master', description: 'Own every card and every Reverse Holo in EX Dragon', icon: '◈', rarity: 'all-variants', fallbackTotal: 185, filter: (c) => c },
    ],
  },
  {
    id: 'ex-magma-aqua',
    tcgdexId: 'ex4',
    name: 'EX Team Magma vs Team Aqua',
    year: '2004',
    achievements: [
      { id: 'ex4-common',   title: 'Team Basics',     description: 'Collect all Common cards',                icon: '○', rarity: 'Common',       fallbackTotal: 48,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ex4-uncommon', title: 'Team Recruit',    description: 'Collect all Uncommon cards',              icon: '◇', rarity: 'Uncommon',     fallbackTotal: 26,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ex4-rare',     title: 'Team Tactician',  description: 'Collect all Rare cards',                  icon: '★', rarity: 'Rare',         fallbackTotal: 5,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ex4-holo',     title: 'Team Holo',       description: 'Collect all Rare Holo cards',             icon: '✦', rarity: 'Rare Holo',    fallbackTotal: 6,   filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ex4-ex',       title: 'Team Leaders',    description: 'Collect all EX Pokemon cards',            icon: '★', rarity: 'Rare ex',      fallbackTotal: 11,  filter: (c) => c.filter((x) => x.rarity === 'Rare ex') },
      { id: 'ex4-complete', title: 'Team Master',     description: 'Own at least one print of every card in EX Team Magma vs Team Aqua', icon: '◆', rarity: null, fallbackTotal: 97, anyVariant: true, filter: (c) => c.filter((x) => !x.reverseHolo) },
      { id: 'ex4-full',     title: 'True Team Master', description: 'Own every card and every Reverse Holo in EX Team Magma vs Team Aqua', icon: '◈', rarity: 'all-variants', fallbackTotal: 180, filter: (c) => c },
    ],
  },
  {
    id: 'ex-hidden-legends',
    tcgdexId: 'ex5',
    name: 'EX Hidden Legends',
    year: '2004',
    achievements: [
      { id: 'ex5-common',   title: 'Ancient Paths',   description: 'Collect all Common cards',                icon: '○', rarity: 'Common',       fallbackTotal: 46,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ex5-uncommon', title: 'Hidden Trails',   description: 'Collect all Uncommon cards',              icon: '◇', rarity: 'Uncommon',     fallbackTotal: 29,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ex5-rare',     title: 'Buried Treasure',  description: 'Collect all Rare cards',                  icon: '★', rarity: 'Rare',         fallbackTotal: 7,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ex5-holo',     title: 'Holo Legend',     description: 'Collect all Rare Holo cards',             icon: '✦', rarity: 'Rare Holo',    fallbackTotal: 9,   filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ex5-ex',       title: 'Legend Hunter',   description: 'Collect all EX Pokemon cards',            icon: '★', rarity: 'Rare ex',      fallbackTotal: 10,  filter: (c) => c.filter((x) => x.rarity === 'Rare ex') },
      { id: 'ex5-complete', title: 'Hidden Master',   description: 'Own at least one print of every card in EX Hidden Legends', icon: '◆', rarity: null, fallbackTotal: 102, anyVariant: true, filter: (c) => c.filter((x) => !x.reverseHolo) },
      { id: 'ex5-full',     title: 'True Hidden Master', description: 'Own every card and every Reverse Holo in EX Hidden Legends', icon: '◈', rarity: 'all-variants', fallbackTotal: 190, filter: (c) => c },
    ],
  },
  {
    id: 'ex-firered-leafgreen',
    tcgdexId: 'ex6',
    name: 'EX FireRed & LeafGreen',
    year: '2004',
    achievements: [
      { id: 'ex6-common',   title: 'Pallet Town',     description: 'Collect all Common cards',                icon: '○', rarity: 'Common',       fallbackTotal: 55,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ex6-uncommon', title: 'Kanto Journey',   description: 'Collect all Uncommon cards',              icon: '◇', rarity: 'Uncommon',     fallbackTotal: 30,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ex6-rare',     title: 'Gym Badge',       description: 'Collect all Rare cards',                  icon: '★', rarity: 'Rare',         fallbackTotal: 6,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ex6-holo',     title: 'Holo Kanto',      description: 'Collect all Rare Holo cards',             icon: '✦', rarity: 'Rare Holo',    fallbackTotal: 9,   filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ex6-ex',       title: 'Elite Four',      description: 'Collect all EX Pokemon cards',            icon: '★', rarity: 'Rare ex',      fallbackTotal: 12,  filter: (c) => c.filter((x) => x.rarity === 'Rare ex') },
      { id: 'ex6-complete', title: 'Kanto Master',    description: 'Own at least one print of every card in EX FireRed & LeafGreen', icon: '◆', rarity: null, fallbackTotal: 116, anyVariant: true, filter: (c) => c.filter((x) => !x.reverseHolo) },
      { id: 'ex6-full',     title: 'True Kanto Master', description: 'Own every card and every Reverse Holo in EX FireRed & LeafGreen', icon: '◈', rarity: 'all-variants', fallbackTotal: 216, filter: (c) => c },
    ],
  },
  {
    id: 'ex-rocket-returns',
    tcgdexId: 'ex7',
    name: 'EX Team Rocket Returns',
    year: '2004',
    achievements: [
      { id: 'ex7-common',   title: 'Rocket Grunts',      description: 'Collect all Common cards',                icon: '○', rarity: 'Common',       fallbackTotal: 51,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ex7-uncommon', title: 'Rocket Admin',        description: 'Collect all Uncommon cards',              icon: '◇', rarity: 'Uncommon',     fallbackTotal: 30,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ex7-rare',     title: 'Dark Plans',          description: 'Collect all Rare cards',                  icon: '★', rarity: 'Rare',         fallbackTotal: 6,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ex7-holo',     title: 'Holo Rocket',         description: 'Collect all Rare Holo cards',             icon: '✦', rarity: 'Rare Holo',    fallbackTotal: 7,   filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ex7-ex',       title: 'Dark EX Squad',       description: 'Collect all EX Pokemon cards',            icon: '★', rarity: 'Rare ex',      fallbackTotal: 15,  filter: (c) => c.filter((x) => x.rarity === 'Rare ex') },
      { id: 'ex7-complete', title: 'Rocket Returns Master',   description: 'Own at least one print of every card in EX Team Rocket Returns', icon: '◆', rarity: null, fallbackTotal: 111, anyVariant: true, filter: (c) => c.filter((x) => !x.reverseHolo) },
      { id: 'ex7-full',     title: 'True Rocket Returns Master', description: 'Own every card and every Reverse Holo in EX Team Rocket Returns', icon: '◈', rarity: 'all-variants', fallbackTotal: 205, filter: (c) => c },
    ],
  },
  {
    id: 'ex-deoxys',
    tcgdexId: 'ex8',
    name: 'EX Deoxys',
    year: '2005',
    achievements: [
      { id: 'ex8-common',   title: 'Space Debris',       description: 'Collect all Common cards',                icon: '○', rarity: 'Common',       fallbackTotal: 53,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ex8-uncommon', title: 'Meteor Strike',      description: 'Collect all Uncommon cards',              icon: '◇', rarity: 'Uncommon',     fallbackTotal: 30,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ex8-rare',     title: 'Orbital Rare',       description: 'Collect all Rare cards',                  icon: '★', rarity: 'Rare',         fallbackTotal: 6,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ex8-holo',     title: 'Holo Space',         description: 'Collect all Rare Holo cards',             icon: '✦', rarity: 'Rare Holo',    fallbackTotal: 6,   filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ex8-ex',       title: 'Forme Changer',      description: 'Collect all EX Pokemon cards',            icon: '★', rarity: 'Rare ex',      fallbackTotal: 12,  filter: (c) => c.filter((x) => x.rarity === 'Rare ex') },
      { id: 'ex8-complete', title: 'Deoxys Master',      description: 'Own at least one print of every card in EX Deoxys', icon: '◆', rarity: null, fallbackTotal: 108, anyVariant: true, filter: (c) => c.filter((x) => !x.reverseHolo) },
      { id: 'ex8-full',     title: 'True Deoxys Master', description: 'Own every card and every Reverse Holo in EX Deoxys', icon: '◈', rarity: 'all-variants', fallbackTotal: 203, filter: (c) => c },
    ],
  },
  {
    id: 'ex-emerald',
    tcgdexId: 'ex9',
    name: 'EX Emerald',
    year: '2005',
    achievements: [
      { id: 'ex9-common',   title: 'Frontier Basics',    description: 'Collect all Common cards',                icon: '○', rarity: 'Common',       fallbackTotal: 55,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ex9-uncommon', title: 'Battle Tent',        description: 'Collect all Uncommon cards',              icon: '◇', rarity: 'Uncommon',     fallbackTotal: 29,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ex9-rare',     title: 'Frontier Pass',      description: 'Collect all Rare cards',                  icon: '★', rarity: 'Rare',         fallbackTotal: 6,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ex9-holo',     title: 'Holo Emerald',       description: 'Collect all Rare Holo cards',             icon: '✦', rarity: 'Rare Holo',    fallbackTotal: 6,   filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ex9-ex',       title: 'Frontier Brain',     description: 'Collect all EX Pokemon cards',            icon: '★', rarity: 'Rare ex',      fallbackTotal: 10,  filter: (c) => c.filter((x) => x.rarity === 'Rare ex') },
      { id: 'ex9-complete', title: 'Emerald Master',     description: 'Own at least one print of every card in EX Emerald', icon: '◆', rarity: null, fallbackTotal: 107, anyVariant: true, filter: (c) => c.filter((x) => !x.reverseHolo) },
      { id: 'ex9-full',     title: 'True Emerald Master', description: 'Own every card and every Reverse Holo in EX Emerald', icon: '◈', rarity: 'all-variants', fallbackTotal: 202, filter: (c) => c },
    ],
  },
  {
    id: 'ex-unseen-forces',
    tcgdexId: 'ex10',
    name: 'EX Unseen Forces',
    year: '2005',
    achievements: [
      { id: 'ex10-common',   title: 'Johto Wilds',       description: 'Collect all Common cards',                icon: '○', rarity: 'Common',       fallbackTotal: 50,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ex10-uncommon', title: 'Hidden Power',      description: 'Collect all Uncommon cards',              icon: '◇', rarity: 'Uncommon',     fallbackTotal: 35,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ex10-rare',     title: 'Unseen Rare',       description: 'Collect all Rare cards',                  icon: '★', rarity: 'Rare',         fallbackTotal: 6,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ex10-holo',     title: 'Holo Forces',       description: 'Collect all Rare Holo cards',             icon: '✦', rarity: 'Rare Holo',    fallbackTotal: 7,   filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ex10-ex',       title: 'Johto Legends',     description: 'Collect all EX Pokemon cards',            icon: '★', rarity: 'Rare ex',      fallbackTotal: 17,  filter: (c) => c.filter((x) => x.rarity === 'Rare ex') },
      { id: 'ex10-complete', title: 'Unseen Forces Master',   description: 'Own at least one print of every card in EX Unseen Forces', icon: '◆', rarity: null, fallbackTotal: 117, anyVariant: true, filter: (c) => c.filter((x) => !x.reverseHolo) },
      { id: 'ex10-full',     title: 'True Unseen Forces Master', description: 'Own every card and every Reverse Holo in EX Unseen Forces', icon: '◈', rarity: 'all-variants', fallbackTotal: 215, filter: (c) => c },
    ],
  },
  {
    id: 'ex-delta-species',
    tcgdexId: 'ex11',
    name: 'EX Delta Species',
    year: '2005',
    achievements: [
      { id: 'ex11-common',   title: 'Delta Basics',      description: 'Collect all Common cards',                icon: '○', rarity: 'Common',       fallbackTotal: 56,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ex11-uncommon', title: 'Type Shift',        description: 'Collect all Uncommon cards',              icon: '◇', rarity: 'Uncommon',     fallbackTotal: 31,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ex11-rare',     title: 'Delta Rare',        description: 'Collect all Rare cards',                  icon: '★', rarity: 'Rare',         fallbackTotal: 7,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ex11-holo',     title: 'Holo Delta',        description: 'Collect all Rare Holo cards',             icon: '✦', rarity: 'Rare Holo',    fallbackTotal: 8,   filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ex11-ex',       title: 'Delta Evolution',   description: 'Collect all EX Pokemon cards',            icon: '★', rarity: 'Rare ex',      fallbackTotal: 11,  filter: (c) => c.filter((x) => x.rarity === 'Rare ex') },
      { id: 'ex11-complete', title: 'Delta Species Master',   description: 'Own at least one print of every card in EX Delta Species', icon: '◆', rarity: null, fallbackTotal: 114, anyVariant: true, filter: (c) => c.filter((x) => !x.reverseHolo) },
      { id: 'ex11-full',     title: 'True Delta Species Master', description: 'Own every card and every Reverse Holo in EX Delta Species', icon: '◈', rarity: 'all-variants', fallbackTotal: 216, filter: (c) => c },
    ],
  },
  {
    id: 'ex-legend-maker',
    tcgdexId: 'ex12',
    name: 'EX Legend Maker',
    year: '2006',
    achievements: [
      { id: 'ex12-common',   title: 'Ruin Ruins',           description: 'Collect all Common cards',                icon: '○', rarity: 'Common',       fallbackTotal: 45,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ex12-uncommon', title: 'Legend Seekers',       description: 'Collect all Uncommon cards',              icon: '◇', rarity: 'Uncommon',     fallbackTotal: 22,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ex12-rare',     title: 'Stone Tablets',        description: 'Collect all Rare cards',                  icon: '★', rarity: 'Rare',         fallbackTotal: 8,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ex12-holo',     title: 'Relic Holos',          description: 'Collect all Rare Holo cards',             icon: '✦', rarity: 'Rare Holo',    fallbackTotal: 10,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ex12-ex',       title: 'Legend Maker EX',      description: 'Collect all EX Pokemon cards',            icon: '★', rarity: 'Rare ex',      fallbackTotal: 7,   filter: (c) => c.filter((x) => x.rarity === 'Rare ex') },
      { id: 'ex12-complete', title: 'Legend Master',              description: 'Own at least one print of every card in EX Legend Maker', icon: '◆', rarity: null, fallbackTotal: 93,  anyVariant: true, filter: (c) => c.filter((x) => !x.reverseHolo) },
      { id: 'ex12-full',     title: 'True Legend Master',         description: 'Own every card and every Reverse Holo in EX Legend Maker', icon: '◈', rarity: 'all-variants', fallbackTotal: 93,  filter: (c) => c },
    ],
  },
  {
    id: 'ex-holon-phantoms',
    tcgdexId: 'ex13',
    name: 'EX Holon Phantoms',
    year: '2006',
    achievements: [
      { id: 'ex13-common',   title: 'Holon Basics',         description: 'Collect all Common cards',                icon: '○', rarity: 'Common',       fallbackTotal: 53,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ex13-uncommon', title: 'Delta Explorers',      description: 'Collect all Uncommon cards',              icon: '◇', rarity: 'Uncommon',     fallbackTotal: 34,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ex13-rare',     title: 'Phantom Rares',        description: 'Collect all Rare cards',                  icon: '★', rarity: 'Rare',         fallbackTotal: 8,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ex13-holo',     title: 'Holon Holos',          description: 'Collect all Rare Holo cards',             icon: '✦', rarity: 'Rare Holo',    fallbackTotal: 12,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ex13-ex',       title: 'Phantom EX',           description: 'Collect all EX Pokemon cards',            icon: '★', rarity: 'Rare ex',      fallbackTotal: 3,   filter: (c) => c.filter((x) => x.rarity === 'Rare ex') },
      { id: 'ex13-complete', title: 'Holon Phantom Master',       description: 'Own at least one print of every card in EX Holon Phantoms', icon: '◆', rarity: null, fallbackTotal: 111, anyVariant: true, filter: (c) => c.filter((x) => !x.reverseHolo) },
      { id: 'ex13-full',     title: 'True Holon Phantom Master',  description: 'Own every card and every Reverse Holo in EX Holon Phantoms', icon: '◈', rarity: 'all-variants', fallbackTotal: 111, filter: (c) => c },
    ],
  },
  {
    id: 'ex-crystal-guardians',
    tcgdexId: 'ex14',
    name: 'EX Crystal Guardians',
    year: '2006',
    achievements: [
      { id: 'ex14-common',   title: 'Crystal Shards',       description: 'Collect all Common cards',                icon: '○', rarity: 'Common',       fallbackTotal: 47,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ex14-uncommon', title: 'Guardians in Training', description: 'Collect all Uncommon cards',             icon: '◇', rarity: 'Uncommon',     fallbackTotal: 28,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ex14-rare',     title: 'Crystal Rares',        description: 'Collect all Rare cards',                  icon: '★', rarity: 'Rare',         fallbackTotal: 5,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ex14-holo',     title: 'Crystal Holos',        description: 'Collect all Rare Holo cards',             icon: '✦', rarity: 'Rare Holo',    fallbackTotal: 10,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ex14-ex',       title: 'Guardian EX',          description: 'Collect all EX Pokemon cards',            icon: '★', rarity: 'Rare ex',      fallbackTotal: 10,  filter: (c) => c.filter((x) => x.rarity === 'Rare ex') },
      { id: 'ex14-complete', title: 'Crystal Guardian Master',    description: 'Own at least one print of every card in EX Crystal Guardians', icon: '◆', rarity: null, fallbackTotal: 100, anyVariant: true, filter: (c) => c.filter((x) => !x.reverseHolo) },
      { id: 'ex14-full',     title: 'True Crystal Guardian Master', description: 'Own every card and every Reverse Holo in EX Crystal Guardians', icon: '◈', rarity: 'all-variants', fallbackTotal: 100, filter: (c) => c },
    ],
  },
  {
    id: 'ex-dragon-frontiers',
    tcgdexId: 'ex15',
    name: 'EX Dragon Frontiers',
    year: '2006',
    achievements: [
      { id: 'ex15-common',   title: 'Frontier Basics',      description: 'Collect all Common cards',                icon: '○', rarity: 'Common',       fallbackTotal: 52,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ex15-uncommon', title: 'Delta Dragons',        description: 'Collect all Uncommon cards',              icon: '◇', rarity: 'Uncommon',     fallbackTotal: 25,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ex15-rare',     title: 'Frontier Rares',       description: 'Collect all Rare cards',                  icon: '★', rarity: 'Rare',         fallbackTotal: 4,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ex15-holo',     title: 'Dragon Holos',         description: 'Collect all Rare Holo cards',             icon: '✦', rarity: 'Rare Holo',    fallbackTotal: 10,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ex15-ex',       title: 'Dragon Frontier EX',   description: 'Collect all EX Pokemon cards',            icon: '★', rarity: 'Rare ex',      fallbackTotal: 10,  filter: (c) => c.filter((x) => x.rarity === 'Rare ex') },
      { id: 'ex15-complete', title: 'Dragon Frontier Master',     description: 'Own at least one print of every card in EX Dragon Frontiers', icon: '◆', rarity: null, fallbackTotal: 101, anyVariant: true, filter: (c) => c.filter((x) => !x.reverseHolo) },
      { id: 'ex15-full',     title: 'True Dragon Frontier Master', description: 'Own every card and every Reverse Holo in EX Dragon Frontiers', icon: '◈', rarity: 'all-variants', fallbackTotal: 101, filter: (c) => c },
    ],
  },
  {
    id: 'ex-power-keepers',
    tcgdexId: 'ex16',
    name: 'EX Power Keepers',
    year: '2007',
    achievements: [
      { id: 'ex16-common',   title: 'Power Basics',         description: 'Collect all Common cards',                icon: '○', rarity: 'Common',       fallbackTotal: 62,  filter: (c) => c.filter((x) => x.rarity === 'Common') },
      { id: 'ex16-uncommon', title: 'Power Guards',         description: 'Collect all Uncommon cards',              icon: '◇', rarity: 'Uncommon',     fallbackTotal: 22,  filter: (c) => c.filter((x) => x.rarity === 'Uncommon') },
      { id: 'ex16-rare',     title: 'Power Rares',          description: 'Collect all Rare cards',                  icon: '★', rarity: 'Rare',         fallbackTotal: 5,   filter: (c) => c.filter((x) => x.rarity === 'Rare' && !x.holo) },
      { id: 'ex16-holo',     title: 'Power Holos',          description: 'Collect all Rare Holo cards',             icon: '✦', rarity: 'Rare Holo',    fallbackTotal: 11,  filter: (c) => c.filter((x) => x.holo === true) },
      { id: 'ex16-ex',       title: 'Power Keeper EX',      description: 'Collect all EX Pokemon cards',            icon: '★', rarity: 'Rare ex',      fallbackTotal: 8,   filter: (c) => c.filter((x) => x.rarity === 'Rare ex') },
      { id: 'ex16-complete', title: 'Power Keeper Master',        description: 'Own at least one print of every card in EX Power Keepers', icon: '◆', rarity: null, fallbackTotal: 108, anyVariant: true, filter: (c) => c.filter((x) => !x.reverseHolo) },
      { id: 'ex16-full',     title: 'True Power Keeper Master',   description: 'Own every card and every Reverse Holo in EX Power Keepers', icon: '◈', rarity: 'all-variants', fallbackTotal: 108, filter: (c) => c },
    ],
  },
];

/**
 * Number of free packs awarded when an achievement is completed in economy mode.
 * Scales with difficulty (rarity tier â†’ harder to collect).
 */
export function getAchievementReward(ach) {
  if (ach.rarity === 'all-variants') return 25; // every card + every reverse holo
  if (ach.rarity === null)           return 15; // full set (any variant)
  if (ach.rarity === 'Rare ex')      return 12; // EX Pokemon
  if (ach.rarity === 'Rare Holo')    return 10;
  if (ach.rarity === 'Rare')         return 7;
  if (ach.rarity === 'Uncommon')     return 5;
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
      // anyVariant: a card counts as owned if either the base or its _rh variant is owned
      const owned = ach.anyVariant
        ? relevant.filter((c) => ownedIds.has(c.id) || ownedIds.has(c.id + '_rh')).length
        : relevant.filter((c) => ownedIds.has(c.id)).length;
      result.set(ach.id, { total, owned, complete: owned >= total && total > 0 });
    }
  }
  return result;
}
