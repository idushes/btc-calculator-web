import { useCallback, useState, useEffect } from "react";
import { ShareableState, encodeShareState, decodeShareState } from "../lib/shareCodec";

export type { ShareableState };

const SHARE_PARAM = "s";

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
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

function generateShareUrl(state: ShareableState): string {
  const encoded = encodeShareState(state);
  return `${window.location.origin}${window.location.pathname}?${SHARE_PARAM}=${encoded}`;
}

/**
 * Hook for sharing calculator state via URL.
 */
export const useShareState = () => {
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle");
  const [sharedState, setSharedState] = useState<ShareableState | null>(null);

  // On mount, check URL query param for shared state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get(SHARE_PARAM);
    if (encoded) {
      const state = decodeShareState(encoded);
      if (state) {
        setSharedState(state);
        // Clean the query param from URL without reload
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
