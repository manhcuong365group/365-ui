"use client";

import { Children, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, ChevronRight as Sep } from "lucide-react";

/* Tabs / Breadcrumbs / Pagination / Steps / Timeline / Accordion.
 * Tra cứu: namethatui.com/web/{tabs, breadcrumbs, pagination, steps, timeline, accordion}. */

export type TabItem = { id: string; label: ReactNode; content: ReactNode; disabled?: boolean };

/** Tabs theo ARIA APG: roving tabindex, ←/→/Home/End, panel ẩn (không huỷ) để giữ state. */
export function Tabs({ items, value, defaultValue, onChange, label }: { items: TabItem[]; value?: string; defaultValue?: string; onChange?: (id: string) => void; label: string }) {
  const uid = useId();
  const [inner, setInner] = useState(defaultValue ?? items.find((i) => !i.disabled)?.id ?? "");
  const cur = value ?? inner;
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const set = (id: string) => {
    setInner(id);
    onChange?.(id);
  };
  const enabled = items.filter((i) => !i.disabled);
  const onKey = (e: KeyboardEvent) => {
    const i = enabled.findIndex((x) => x.id === cur);
    let n = -1;
    if (e.key === "ArrowRight") n = (i + 1) % enabled.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + enabled.length) % enabled.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = enabled.length - 1;
    if (n < 0) return;
    e.preventDefault();
    set(enabled[n].id);
    refs.current[enabled[n].id]?.focus();
  };
  return (
    <div>
      <div role="tablist" aria-label={label} className="ui-tabs" onKeyDown={onKey}>
        {items.map((t) => (
          <button
            key={t.id}
            ref={(el) => void (refs.current[t.id] = el)}
            type="button"
            role="tab"
            id={`${uid}-t-${t.id}`}
            aria-selected={cur === t.id}
            aria-controls={`${uid}-p-${t.id}`}
            tabIndex={cur === t.id ? 0 : -1}
            disabled={t.disabled}
            className="ui-tab"
            onClick={() => set(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {items.map((t) => (
        <div key={t.id} role="tabpanel" id={`${uid}-p-${t.id}`} aria-labelledby={`${uid}-t-${t.id}`} hidden={cur !== t.id} tabIndex={0} className="ui-tabpanel">
          {t.content}
        </div>
      ))}
    </div>
  );
}

export type Crumb = { label: ReactNode; href?: string };

/** Đường dẫn phân cấp. Mục cuối là trang hiện tại (aria-current). Link tuỳ biến qua `renderLink` (vd next/link). */
export function Breadcrumbs({ items, renderLink }: { items: Crumb[]; renderLink?: (c: Crumb) => ReactNode }) {
  return (
    <nav aria-label="Breadcrumb" className="ui-breadcrumbs">
      <ol>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i}>
              {last || !c.href ? <span aria-current={last ? "page" : undefined}>{c.label}</span> : renderLink ? renderLink(c) : <a href={c.href}>{c.label}</a>}
              {last ? null : <Sep className="ui-breadcrumbs__sep" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Danh sách số trang có "…" (luôn giữ trang đầu, cuối, và quanh trang hiện tại). */
export function pageList(page: number, total: number): (number | "…")[] {
  const set = new Set([1, total, page - 1, page, page + 1].filter((n) => n >= 1 && n <= total));
  const arr = [...set].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  arr.forEach((n, i) => {
    if (i > 0 && n - arr[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

/** Phân trang nút bấm (onChange) hoặc link (hrefFor). */
export function Pagination({ page, pageCount, onChange, hrefFor }: { page: number; pageCount: number; onChange?: (p: number) => void; hrefFor?: (p: number) => string }) {
  if (pageCount <= 1) return null;
  const go = (p: number, content: ReactNode, aria: string, cur = false, extra = "") => {
    const dis = p < 1 || p > pageCount;
    const common = { "aria-label": aria, "aria-current": cur ? ("page" as const) : undefined, className: extra || undefined };
    return hrefFor && !dis ? (
      <a href={hrefFor(p)} {...common}>{content}</a>
    ) : (
      <button type="button" disabled={dis} onClick={() => onChange?.(p)} {...common}>{content}</button>
    );
  };
  return (
    <nav aria-label="Phân trang">
      <ul className="ui-pagination">
        <li>{go(page - 1, <ChevronLeft aria-hidden="true" width={16} height={16} />, "Trang trước")}</li>
        {pageList(page, pageCount).map((n, i) =>
          n === "…" ? (
            <li key={`e${i}`}><span className="ui-pagination__ellipsis" aria-hidden="true">…</span><span className="sr-only">Thêm trang</span></li>
          ) : (
            <li key={n}>{go(n, n, n === page ? `Trang ${n}` : `Đến trang ${n}`, n === page, Math.abs(n - page) > 1 ? "ui-pagination__far" : "")}</li>
          ),
        )}
        <li>{go(page + 1, <ChevronRight aria-hidden="true" width={16} height={16} />, "Trang sau")}</li>
      </ul>
    </nav>
  );
}

/** Các bước; `current` là chỉ số bắt đầu từ 0. Đã qua = is-done, bước hiện tại aria-current="step". */
export function Steps({ steps, current, label = "Tiến trình" }: { steps: ReactNode[]; current: number; label?: string }) {
  return (
    <ol className="ui-steps" aria-label={label}>
      {steps.map((s, i) => (
        <li key={i} className={`ui-steps__item${i < current ? " is-done" : i === current ? " is-current" : ""}`} aria-current={i === current ? "step" : undefined}>
          <span className="ui-steps__label">{s}</span>
        </li>
      ))}
    </ol>
  );
}

export type TimelineEntry = { time: string; datetime?: string; title: ReactNode; text?: ReactNode; tone?: "ok" | "warn" | "danger" | "muted" };

/** Dòng thời gian; truyền `items` đã sắp xếp đúng thứ tự muốn đọc (không đảo bằng CSS). */
export function Timeline({ items }: { items: TimelineEntry[] }) {
  return (
    <ol className="ui-timeline">
      {items.map((e, i) => (
        <li key={i} className={`ui-timeline__item${e.tone ? ` ui-timeline__item--${e.tone}` : ""}`}>
          <time className="ui-timeline__time" dateTime={e.datetime}>{e.time}</time>
          <span className="ui-timeline__title">{e.title}</span>
          {e.text ? <p className="ui-timeline__text">{e.text}</p> : null}
        </li>
      ))}
    </ol>
  );
}

/** Accordion bằng <details>/<summary> gốc. `exclusive` = chỉ mở một mục (thuộc tính name). */
export function Accordion({ items, exclusive }: { items: { title: ReactNode; content: ReactNode; open?: boolean }[]; exclusive?: boolean }) {
  const name = useId();
  return (
    <div className="ui-accordion">
      {Children.toArray(
        items.map((it, i) => (
          <details key={i} className="ui-accordion__item" name={exclusive ? name : undefined} open={it.open}>
            <summary>{it.title}</summary>
            <div className="ui-accordion__panel">{it.content}</div>
          </details>
        )),
      )}
    </div>
  );
}
