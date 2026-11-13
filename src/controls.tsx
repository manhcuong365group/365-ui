"use client";

import { cloneElement, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactElement, type ReactNode } from "react";

/* Switch / ToggleGroup / Tooltip. Tra cứu: namethatui.com/web/{switch-checkbox-radio, toggle-group, popover-dropdown-tooltip}. */

/** Công tắc bật/tắt có hiệu lực ngay. Luôn kèm nhãn (label hoặc aria-label). */
export function Switch({ checked, onChange, label, disabled, id }: { checked: boolean; onChange: (v: boolean) => void; label?: ReactNode; disabled?: boolean; id?: string }) {
  const uid = useId();
  const sid = id ?? uid;
  const btn = (
    <button type="button" role="switch" id={sid} aria-checked={checked} aria-labelledby={label ? `${sid}-l` : undefined} disabled={disabled} className="ui-switch" onClick={() => onChange(!checked)}>
      <span className="ui-switch__thumb" />
    </button>
  );
  if (!label) return btn;
  return (
    <div className="ui-switch-row">
      <span id={`${sid}-l`} onClick={() => !disabled && onChange(!checked)}>{label}</span>
      {btn}
    </div>
  );
}

export type ToggleOption<T extends string> = { value: T; label: ReactNode; disabled?: boolean };

/** Nhóm nút chọn một (segmented control): role=radiogroup, ←/→/↑/↓ đổi lựa chọn, roving tabindex. */
export function ToggleGroup<T extends string>({ options, value, onChange, label }: { options: ToggleOption<T>[]; value: T; onChange: (v: T) => void; label: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
  const onKey = (e: KeyboardEvent) => {
    const at = enabled.indexOf(options.findIndex((o) => o.value === value));
    let n = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = enabled[(at + 1) % enabled.length];
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = enabled[(at - 1 + enabled.length) % enabled.length];
    if (n < 0) return;
    e.preventDefault();
    onChange(options[n].value);
    refs.current[n]?.focus();
  };
  return (
    <div role="radiogroup" aria-label={label} className="ui-toggle-group" onKeyDown={onKey}>
      {options.map((o, i) => (
        <button
          key={o.value}
          ref={(el) => void (refs.current[i] = el)}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          tabIndex={o.value === value ? 0 : -1}
          disabled={o.disabled}
          className="ui-toggle-group__item"
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Chú thích ngắn khi hover/focus; nối với phần tử con bằng aria-describedby. Esc ẩn. Không đặt nội dung bấm được trong tooltip. */
export function Tooltip({ text, children }: { text: string; children: ReactElement<{ "aria-describedby"?: string }> }) {
  const id = useId();
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (!dismissed) return;
    const off = () => setDismissed(false);
    document.addEventListener("pointerover", off, { once: true });
    return () => document.removeEventListener("pointerover", off);
  }, [dismissed]);
  return (
    <span className="ui-tooltip-wrap" data-dismissed={dismissed || undefined} onKeyDown={(e) => e.key === "Escape" && setDismissed(true)} onBlur={() => setDismissed(false)}>
      {cloneElement(children, { "aria-describedby": id })}
      <span role="tooltip" id={id} className="ui-tooltip">{text}</span>
    </span>
  );
}
