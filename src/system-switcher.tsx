"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Clock, LayoutGrid, Search, X } from "lucide-react";

const RECENT_KEY = "system-switcher-recent";

/** Một ô hệ thống; app tự tính href (SSO, đường dẫn nội bộ…). */
export type SwitcherSystem = { code: string; name: string; href: string; color: string };
type Item = SwitcherSystem;
function readRecent(): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Popover "Chuyển đổi hệ thống" dùng chung các app 365. `portalHref` = trang Cổng; `current` = mã hệ thống đang mở. */
export function SystemSwitcher({ systems, portalHref, current, className = "" }: { systems?: SwitcherSystem[]; portalHref: string; current?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  const items: Item[] = [
    { code: "portal", name: "Cổng quản lý nội bộ", href: portalHref, color: "#475569" },
    ...(systems ?? []),
  ];
  const needle = q.trim().toLowerCase();
  const shown = items.filter((i) => i.name.toLowerCase().includes(needle));
  const recentItems = recent.map((c) => items.find((i) => i.code === c)).filter((i): i is Item => !!i && i.code !== current);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle() {
    if (!open) {
      setQ("");
      setRecent(readRecent());
    }
    setOpen((v) => !v);
  }

  function visit(code: string) {
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify([code, ...readRecent().filter((c) => c !== code)].slice(0, 3)));
    } catch {
      /* localStorage không khả dụng: bỏ qua */
    }
  }

  const tile = (i: Item, compact: boolean) => {
    const active = i.code === current;
    return (
      <a
        key={i.code}
        href={i.href}
        data-testid={`system-switcher-item-${i.code}`}
        aria-current={active ? "true" : undefined}
        onClick={() => visit(i.code)}
        className={`relative flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-primary/50 hover:bg-surface-subtle ${
          active ? "border-primary/40 bg-primary-soft" : "border-border bg-surface"
        }`}
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base font-bold text-white"
          style={{ backgroundColor: i.color }}
          aria-hidden="true"
        >
          {i.code === "portal" ? <LayoutGrid size={20} /> : i.name.charAt(0).toUpperCase()}
        </span>
        <span className={`min-w-0 text-sm font-semibold text-fg ${compact ? "truncate" : "pr-4"}`}>{i.name}</span>
        {active && <Check size={16} className="absolute right-2 top-2 text-primary" aria-label="Đang dùng" />}
      </a>
    );
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        data-testid="system-switcher-trigger"
        aria-label="Hệ thống"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
        className="flex items-center gap-1.5 rounded-lg border border-border/80 px-2.5 py-1.5 text-xs font-semibold text-fg-muted transition-colors hover:bg-surface-subtle hover:text-primary"
      >
        <LayoutGrid size={14} aria-hidden="true" />
        <span className="hidden sm:inline">Hệ thống</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Chuyển đổi hệ thống"
          className="fixed left-3 right-3 top-16 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto rounded-2xl border border-border bg-surface p-4 shadow-dialog sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[560px] sm:max-w-[calc(100vw-1.5rem)] lg:w-[720px]"
        >
          <div className="flex flex-wrap items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-base font-bold text-fg">Chuyển đổi hệ thống</div>
              <div className="text-xs text-fg-muted">Chọn hệ thống bạn muốn truy cập</div>
            </div>
            <button type="button" aria-label="Đóng" onClick={() => setOpen(false)} className="order-2 rounded-lg p-1.5 text-fg-muted hover:bg-surface-subtle sm:order-3">
              <X size={18} />
            </button>
            <label className="relative order-3 w-full sm:order-2 sm:w-56">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-muted" aria-hidden="true" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm kiếm hệ thống…"
                aria-label="Tìm kiếm hệ thống"
                className="w-full rounded-lg border border-border bg-surface py-1.5 pl-8 pr-2 text-sm"
              />
            </label>
          </div>

          <div className="mb-2 mt-4 flex items-center gap-2 text-sm font-bold text-fg">
            Hệ thống của bạn
            <span className="rounded-full bg-primary-soft px-2 text-xs font-semibold text-primary">{shown.length}</span>
          </div>
          {shown.length ? (
            <div className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-2">{shown.map((i) => tile(i, false))}</div>
          ) : (
            <p className="py-3 text-sm text-fg-muted">Không tìm thấy hệ thống phù hợp.</p>
          )}

          {recentItems.length > 0 && !needle && (
            <>
              <div className="mb-2 mt-4 flex items-center gap-2 border-t border-border pt-3 text-sm font-bold text-fg">
                <Clock size={14} aria-hidden="true" />
                Truy cập gần đây
              </div>
              <div className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-3">{recentItems.map((i) => tile(i, true))}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
