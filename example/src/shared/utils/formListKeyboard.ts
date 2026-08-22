import type { KeyboardEvent } from "react";
import type { MessageInstance } from "antd/es/message/interface";

/**
 * Mode "add": when user presses Enter inside a Form.List row input
 *  - if focused row is the last row -> call onAdd(defaults), then auto-focus
 *    the same field of the newly created row.
 *  - if not last row -> just move focus to the same field of the next row.
 *
 * Mode "select": pressing Enter on a row input is treated as a hint that the
 *  user wants to add a new line via the Select picker above. We block submit
 *  and show a guidance message.
 */
export type FormListEnterMode =
  | { type: "add"; onAdd: (defaults?: any) => void; defaults?: any }
  | { type: "select"; message: string };

interface MakeHandlerOptions {
  /** Antd message instance, required for mode "select". */
  messageApi?: MessageInstance;
}

/**
 * Returns an onKeyDown handler that should be attached to a wrapper element
 * surrounding the Form.List rows (e.g. the <table> or wrapping <div>).
 *
 * It uses event delegation, so a single handler covers all inputs inside.
 */
export function makeFormListEnterHandler(
  mode: FormListEnterMode,
  { messageApi }: MakeHandlerOptions = {},
) {
  return (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    const tag = target.tagName.toLowerCase();
    // Skip multiline inputs and buttons (their Enter behavior is intentional).
    if (tag === "textarea" || tag === "button") return;

    // Skip when an Antd Select dropdown is open (Enter is needed to confirm option).
    const ariaExpanded = target.getAttribute("aria-expanded");
    if (ariaExpanded === "true") return;

    // Only act for inputs that look like Form.Item children inside a Form.List.
    // Antd assigns ids of pattern: <formName>_<...nested>_<index>_<field>
    const id = (target as HTMLInputElement).id || "";
    const match = id.match(/^(.+_)(\d+)(_[^_]+)$/);
    if (!match) return;

    const [, prefix, idxStr, suffix] = match;
    const currentIdx = parseInt(idxStr, 10);

    // Find sibling indexes by scanning ids that share the same prefix/suffix.
    const siblingNodes = document.querySelectorAll<HTMLElement>(
      `[id^="${cssEscape(prefix)}"][id$="${cssEscape(suffix)}"]`,
    );
    const indexes: number[] = [];
    siblingNodes.forEach((node) => {
      const m = node.id.match(/^(.+_)(\d+)(_[^_]+)$/);
      if (!m) return;
      if (m[1] === prefix && m[3] === suffix) {
        const i = parseInt(m[2], 10);
        if (!Number.isNaN(i)) indexes.push(i);
      }
    });
    const maxIdx = indexes.length ? Math.max(...indexes) : currentIdx;

    e.preventDefault();
    e.stopPropagation();

    if (mode.type === "select") {
      messageApi?.warning(mode.message);
      return;
    }

    // mode === "add"
    if (currentIdx < maxIdx) {
      // Just hop to the next existing row, same field
      focusFieldById(`${prefix}${currentIdx + 1}${suffix}`);
      return;
    }

    // Last row: append new row then focus same field in the new row.
    mode.onAdd(mode.defaults);
    requestAnimationFrame(() => {
      focusFieldById(`${prefix}${currentIdx + 1}${suffix}`);
    });
  };
}

function focusFieldById(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (typeof (el as HTMLInputElement).focus === "function") {
    (el as HTMLInputElement).focus();
    if (typeof (el as HTMLInputElement).select === "function") {
      try {
        (el as HTMLInputElement).select();
      } catch {
        /* noop */
      }
    }
  }
}

// Minimal CSS.escape fallback for older browsers / safer attribute selectors.
function cssEscape(value: string) {
  if (typeof (window as any).CSS?.escape === "function") {
    return (window as any).CSS.escape(value);
  }
  return value.replace(/(["\\#.:>+~*^$|?()[\]{}/])/g, "\\$1");
}
