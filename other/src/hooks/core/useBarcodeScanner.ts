import { useEffect, useCallback, useRef } from "react";

interface UseBarcodeScannerOptions {
  /** Whether the scanner is enabled */
  enabled: boolean;
  /** Callback when a barcode is scanned */
  onScan: (barcode: string) => void;
  /** Minimum barcode length to accept (default: 6) */
  minLength?: number;
  /** Maximum time (ms) between keystrokes to consider it a scanner (default: 50) */
  scanThreshold?: number;
}

/**
 * Global barcode scanner hook that listens for keyboard input
 * and distinguishes between scanner (fast) and human typing (slow).
 *
 * Usage:
 * ```tsx
 * useBarcodeScanner({
 *   enabled: true,
 *   onScan: (barcode) => handleBarcodeSubmit(barcode),
 * });
 * ```
 */
export function useBarcodeScanner({
  enabled,
  onScan,
  minLength = 6,
  scanThreshold = 50,
}: UseBarcodeScannerOptions) {
  const bufferRef = useRef<string[]>([]);
  const lastTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onScanRef = useRef(onScan);

  // Keep callback ref up to date
  onScanRef.current = onScan;

  const processBuffer = useCallback(() => {
    const raw = bufferRef.current.join("");
    if (raw.length < minLength) return;

    // Debug: log what was captured
    console.log("[BarcodeScanner] Raw buffer:", raw);

    // Some scanners send ASCII code digits instead of actual characters
    // e.g. '8' (ASCII 56) → sends '5' then '6'
    // Detect this: if buffer is all digits with even length, try ASCII decode
    let code = raw;
    if (/^\d+$/.test(raw) && raw.length % 2 === 0 && raw.length >= minLength * 2) {
      const decoded = raw
        .match(/.{2}/g)!
        .map((pair) => String.fromCharCode(parseInt(pair, 10)))
        .join("");
      // Only use decoded if it looks like a real barcode (contains non-digit or is shorter)
      if (/[a-zA-Z]/.test(decoded) || decoded.length < raw.length) {
        console.log("[BarcodeScanner] ASCII decoded:", decoded);
        code = decoded;
      }
    }

    if (code.length >= minLength) {
      console.log("[BarcodeScanner] Final code:", code);
      onScanRef.current(code);
    }
    bufferRef.current = [];
  }, [minLength]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if target is an input/textarea/contentEditable (user is typing)
      const target = e.target as HTMLElement;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable;

      // If user is typing in an input, let it through normally — don't intercept
      if (isTyping) {
        // Reset buffer since user is typing manually
        bufferRef.current = [];
        if (timerRef.current) clearTimeout(timerRef.current);
        return;
      }

      const now = Date.now();
      const timeDiff = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // If too slow, it's human typing — reset buffer
      if (timeDiff > scanThreshold && bufferRef.current.length > 0) {
        bufferRef.current = [];
      }

      if (e.key === "Enter") {
        e.preventDefault();
        processBuffer();
        return;
      }

      // Extract the actual character from the key event
      // Use e.code (physical key) as primary source — more reliable across scanners
      // because some scanners send keyCode strings in e.key instead of actual characters
      let char = "";
      if (e.key.length === 1 && e.key !== " ") {
        // Normal keyboard: e.key is the actual character (e.g., "8", "a")
        char = e.key;
      } else if (e.code) {
        // Fallback: parse from physical key code
        if (e.code.startsWith("Digit")) {
          char = e.code.slice(5); // "Digit8" → "8"
        } else if (e.code.startsWith("Numpad")) {
          char = e.code.slice(6); // "Numpad8" → "8"
        } else if (e.code.startsWith("Key") && e.key.length === 1) {
          char = e.key.toLowerCase(); // "KeyA" → "a"
        }
      }

      // Only collect alphanumeric characters from scanner
      if (char.length === 1 && /^[a-zA-Z0-9]$/.test(char)) {
        console.log("[BarcodeScanner] key:", e.key, "code:", e.code, "→ char:", char);
        e.preventDefault();
        bufferRef.current.push(char);
      }

      // Safety timeout: flush buffer if no Enter received after 100ms
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        bufferRef.current = [];
      }, 100);
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled, scanThreshold, processBuffer]);
}
