// Weighted grading rolls (1-10) with rarity-aware curves.
// Goals:
// - High grades are always possible but progressively rarer.
// - Low-rarity cards are less likely to receive very low grades.

const LOW_RARITY_WEIGHTS = [0.25, 0.5, 0.9, 1.4, 2.2, 3.0, 3.2, 2.4, 1.0, 0.25];
const MID_RARITY_WEIGHTS = [0.5, 0.9, 1.3, 1.8, 2.2, 2.5, 2.2, 1.6, 0.8, 0.2];
const HIGH_RARITY_WEIGHTS = [0.9, 1.2, 1.5, 1.9, 2.2, 2.1, 1.7, 1.2, 0.6, 0.15];

const HIGH_RARITIES = new Set(['Rare ex', 'Rare LV.X', 'Rare Shiny', 'Secret Rare']);

function pickWeighted(weights) {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i += 1) {
    r -= weights[i];
    if (r <= 0) return i + 1;
  }
  return 10;
}

function getGradeWeights(card) {
  if (HIGH_RARITIES.has(card?.rarity) || card?.holo === true) return HIGH_RARITY_WEIGHTS;
  if (card?.rarity === 'Rare') return MID_RARITY_WEIGHTS;
  return LOW_RARITY_WEIGHTS;
}

export function rollGrade(card) {
  return pickWeighted(getGradeWeights(card));
}

export function getGradeMultiplier(grade) {
  const g = Number(grade) || 0;
  if (g <= 5) return 1;
  if (g === 6) return 1.08;
  if (g === 7) return 1.18;
  if (g === 8) return 1.32;
  if (g === 9) return 1.5;
  return 1.75; // grade 10
}
