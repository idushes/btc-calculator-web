import { useCallback, useState, useEffect } from "react";
import { Device } from "./useCalculator";

export interface ShareableState {
  elecCost: number | string;
  difficulty: number | string;
  blockReward: number | string;
  device1: Device;
  device2: Device;
  margin: number | string;
}

const SHARE_PREFIX = "s=";
const SEPARATOR = "~";

/**
 * Encode state to a compact URL-safe base64 string.
 * Format: elecCost~difficulty~blockReward~device1Name~device1Eff~device2Name~device2Eff~margin
 */
function encodeShareState(state: ShareableState): string {
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
  // btoa → URL-safe base64 (replace +/= with -_ and trim =)
  const b64 = btoa(unescape(encodeURIComponent(raw)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decode a compact base64 string back to calculator state.
 * Returns null if the string is invalid.
 */
function decodeShareState(encoded: string): ShareableState | null {
  try {
    // Restore standard base64
    let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    // Restore padding
    while (b64.length % 4 !== 0) b64 += "=";

    const raw = decodeURIComponent(escape(atob(b64)));
    const parts = raw.split(SEPARATOR);

    if (parts.length !== 8) return null;

    const [elecCost, difficulty, blockReward, d1Name, d1Eff, d2Name, d2Eff, margin] = parts;

    // Validate numeric fields
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

function generateShareUrl(state: ShareableState): string {
  const encoded = encodeShareState(state);
  return `${window.location.origin}${window.location.pathname}#${SHARE_PREFIX}${encoded}`;
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  }
}

/**
 * Hook for sharing calculator state via URL.
 * Returns share function, status, and parsed state from URL hash (if any).
 */
export const useShareState = () => {
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle");
  const [sharedState, setSharedState] = useState<ShareableState | null>(null);

  // On mount, check URL hash for shared state
  useEffect(() => {
    const hash = window.location.hash.slice(1); // remove #
    if (hash.startsWith(SHARE_PREFIX)) {
      const encoded = hash.slice(SHARE_PREFIX.length);
      const state = decodeShareState(encoded);
      if (state) {
        setSharedState(state);
        // Clean the hash from URL without reload
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

  const shareCurrentState = useCallback(async (state: ShareableState) => {
    const url = generateShareUrl(state);
    const ok = await copyToClipboard(url);
    setShareStatus(ok ? "copied" : "error");
    setTimeout(() => setShareStatus("idle"), 2000);
    return ok;
  }, []);

  return {
    shareCurrentState,
    shareStatus,
    sharedState,
  };
};
