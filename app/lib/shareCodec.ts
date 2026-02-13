import { Device } from "../hooks/useCalculator";

export interface ShareableState {
  elecCost: number | string;
  difficulty: number | string;
  blockReward: number | string;
  device1: Device;
  device2: Device;
  margin: number | string;
}

const SEPARATOR = "~";

/**
 * Encode state to a compact URL-safe base64 string.
 * Format: elecCost~difficulty~blockReward~device1Name~device1Eff~device2Name~device2Eff~margin
 */
export function encodeShareState(state: ShareableState): string {
  const parts = [
    String(state.elecCost),
    String(state.difficulty),
    String(state.blockReward),
    state.device1.name,
    String(state.device1.efficiency),
    state.device2.name,
    String(state.device2.efficiency),
    String(state.margin),
  ];

  const raw = parts.join(SEPARATOR);
  const b64 = btoa(unescape(encodeURIComponent(raw)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decode a compact base64 string back to calculator state.
 * Returns null if the string is invalid.
 */
export function decodeShareState(encoded: string): ShareableState | null {
  try {
    let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4 !== 0) b64 += "=";

    const raw = decodeURIComponent(escape(atob(b64)));
    const parts = raw.split(SEPARATOR);

    if (parts.length !== 8) return null;

    const [elecCost, difficulty, blockReward, d1Name, d1Eff, d2Name, d2Eff, margin] = parts;

    const nums = [elecCost, difficulty, blockReward, d1Eff, d2Eff, margin];
    if (nums.some((n) => isNaN(Number(n)))) return null;

    return {
      elecCost: Number(elecCost),
      difficulty: Number(difficulty),
      blockReward: Number(blockReward),
      device1: { name: d1Name, efficiency: Number(d1Eff) },
      device2: { name: d2Name, efficiency: Number(d2Eff) },
      margin: Number(margin),
    };
  } catch {
    return null;
  }
}

const J_TO_KWH = 3.6e6;

function calculateFloorPrice(
  efficiency: number,
  elecCost: number,
  difficulty: number,
  blockReward: number,
  margin: number,
): number {
  if (blockReward === 0) return 0;
  const difficultyRaw = difficulty * 10 ** 12;
  const hashesPerBlock = difficultyRaw * 2 ** 32;
  const energyJoules = hashesPerBlock * (efficiency / 10 ** 12);
  const energyKwh = energyJoules / J_TO_KWH;
  const costPerBlock = energyKwh * elecCost;
  const pricePerBtc = costPerBlock / blockReward;
  return pricePerBtc * (1 + margin / 100);
}

function formatPrice(price: number): string {
  return price >= 1000
    ? `$${Math.round(price).toLocaleString("en-US")}`
    : `$${price.toFixed(2)}`;
}

/**
 * Format a decoded state into a human-readable summary for OG description.
 * Shows calculated prices per device with emoji icons.
 */
export function formatShareDescription(state: ShareableState): string {
  const elec = Number(state.elecCost);
  const diff = Number(state.difficulty);
  const reward = Number(state.blockReward);
  const m = Number(state.margin);

  const price1 = calculateFloorPrice(state.device1.efficiency, elec, diff, reward, m);
  const price2 = calculateFloorPrice(state.device2.efficiency, elec, diff, reward, m);

  const marginText = m > 0 ? `  📈 +${m}%` : "";
  const lines = [
    `${state.device1.name} → ${formatPrice(price1)}`,
    `${state.device2.name} → ${formatPrice(price2)}`,
    `⚡ $${elec}/kWh  ⛏️ ${diff}T  Reward: ${reward} BTC${marginText}`,
  ];
  return lines.join("\n");
}
