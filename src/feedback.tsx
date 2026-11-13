"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

/* Badge / StatusDot / EmptyState / Skeleton / Spinner / Alert / Callout / Toaster.
 * Tra cứu: namethatui.com/web/{badge-chip-pill, status-dot, empty-state, skeleton-spinner, alert-callout-banner, toast}. */

export type Tone = "neutral" | "ok" | "warn" | "danger" | "info" | "accent" | "primary";
const ICON = { ok: CheckCircle2, warn: AlertTriangle, danger: XCircle, info: Info } as const;

/** Nhãn trạng thái / số đếm (không bấm được). Số đếm > 99 hiển thị "99+". */
export function Badge({ tone = "neutral", count, children, className = "" }: { tone?: Tone; count?: number; children?: ReactNode; className?: string }) {
  if (count !== undefined) return <span className={`ui-badge ui-badge--count ${className}`.trim()}>{count > 99 ? "99+" : count}</span>;
  return <span className={`ui-badge${tone === "neutral" ? "" : ` ui-badge--${tone}`} ${className}`.trim()}>{children}</span>;
}

/** Chấm trạng thái; `label` bắt buộc để không chỉ truyền đạt bằng màu. */
export function StatusDot({ tone = "neutral", label, pulse, hideLabel }: { tone?: Exclude<Tone, "accent" | "primary">; label: string; pulse?: boolean; hideLabel?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className={`ui-dot${tone === "neutral" ? "" : ` ui-dot--${tone}`}${pulse ? " ui-dot--pulse" : ""}`} />
      <span className={hideLabel ? "sr-only" : undefined}>{label}</span>
    </span>
  );
}

/** Trạng thái trống (mở rộng .ui-state). Truyền `headingLevel` cho đúng thứ bậc tiêu đề. */
export function EmptyState({ icon, title, description, action, error, compact }: { icon?: ReactNode; title: string; description?: ReactNode; action?: ReactNode; error?: boolean; compact?: boolean }) {
  const id = useId();
  return (
    <section aria-labelledby={id} role={error ? "alert" : undefined} className={`ui-state${error ? " ui-state--error" : ""}${compact ? " ui-state--compact" : ""}`}>
      {icon ? <span className="ui-state__icon" aria-hidden="true">{icon}</span> : null}
      <h3 id={id} className="ui-state__title">{title}</h3>
      {description ? <p className="ui-state__text">{description}</p> : null}
      {action ? <div className="ui-state__actions">{action}</div> : null}
    </section>
  );
}

/** Khối chờ tải. variant: line (mặc định) | short | block | circle. Bọc nhóm bằng aria-busy ở vùng cha. */
export function Skeleton({ variant = "line", className = "" }: { variant?: "line" | "short" | "block" | "circle"; className?: string }) {
  const v = variant === "line" ? "" : ` ui-skeleton--${variant}`;
  return <div aria-hidden="true" className={`ui-skeleton${v} ${className}`.trim()} />;
}

/** Vòng quay chờ không rõ thời gian. */
export function Spinner({ size = "md", label = "Đang tải" }: { size?: "sm" | "md" | "lg"; label?: string }) {
  return (
    <span role="status" className="inline-flex">
      <span aria-hidden="true" className={`ui-spinner${size === "md" ? "" : ` ui-spinner--${size}`}`} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export type AlertProps = { tone?: "ok" | "warn" | "danger" | "info"; title?: ReactNode; children?: ReactNode; onClose?: () => void; className?: string };

/** Thông báo nằm trong luồng nội dung. danger/warn dùng role="alert", còn lại role="status". */
export function Alert({ tone = "info", title, children, onClose, className = "" }: AlertProps) {
  const Icon = ICON[tone];
  return (
    <div role={tone === "danger" || tone === "warn" ? "alert" : "status"} className={`ui-alert ui-alert--${tone} ${className}`.trim()}>
      <Icon className="ui-alert__icon" aria-hidden="true" />
      <div className="ui-alert__body">
        {title ? <p className="ui-alert__title">{title}</p> : null}
        {children ? <div className="ui-alert__text">{children}</div> : null}
      </div>
      {onClose ? <button type="button" className="ui-alert__close" aria-label="Đóng thông báo" onClick={onClose}><X aria-hidden="true" /></button> : null}
    </div>
  );
}

/** Ghi chú tĩnh đi kèm nội dung (không đóng được, không có role live). */
export function Callout({ tone = "info", title, children }: Omit<AlertProps, "onClose" | "className">) {
  return (
    <aside className={`ui-alert ui-callout ui-alert--${tone}`}>
      {title ? <p className="ui-alert__title">{title}</p> : null}
      <div className="ui-alert__text">{children}</div>
    </aside>
  );
}

/* ---- Toast: gọi toast.success("…") ở bất kỳ đâu; đặt <Toaster /> 1 lần trong layout. ---- */
type ToastItem = { id: number; tone: "ok" | "warn" | "danger" | "info"; title: string; text?: string; ms: number };
let items: ToastItem[] = [];
let seq = 0;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
function push(tone: ToastItem["tone"], title: string, text?: string, ms = tone === "danger" ? 8000 : 4000) {
  items = [...items.slice(-3), { id: ++seq, tone, title, text, ms }];
  emit();
}
function dismiss(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}
export const toast = {
  success: (title: string, text?: string) => push("ok", title, text),
  warning: (title: string, text?: string) => push("warn", title, text),
  error: (title: string, text?: string) => push("danger", title, text),
  info: (title: string, text?: string) => push("info", title, text),
  dismiss,
};

function ToastView({ t }: { t: ToastItem }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const h = window.setTimeout(() => dismiss(t.id), t.ms);
    return () => window.clearTimeout(h);
  }, [paused, t.id, t.ms]);
  const Icon = ICON[t.tone];
  return (
    <div
      role="status"
      className={`ui-toast ui-toast--${t.tone}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Icon className="ui-toast__icon" aria-hidden="true" />
      <div className="ui-toast__body">
        <div className="ui-toast__title">{t.title}</div>
        {t.text ? <div className="ui-toast__text">{t.text}</div> : null}
      </div>
      <button type="button" className="ui-toast__close" aria-label="Đóng thông báo" onClick={() => dismiss(t.id)}><X aria-hidden="true" /></button>
    </div>
  );
}

export function Toaster() {
  const [list, setList] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const sync = () => setList(items);
    subs.add(sync);
    sync();
    return () => void subs.delete(sync);
  }, []);
  if (!mounted) return null;
  return createPortal(
    <div className="ui-toaster" aria-live="polite" aria-atomic="false">
      {list.map((t) => <ToastView key={t.id} t={t} />)}
    </div>,
    document.body,
  );
}
