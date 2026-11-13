"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/* Dialog / Drawer / Sheet / ConfirmDialog / Lightbox.
 * Tra cứu: https://namethatui.com/web/dialog-drawer-sheet → Modal Dialog; https://namethatui.com/web/scrim → Scrim; https://namethatui.com/web/lightbox → Lightbox.
 * ARIA APG dialog: role="dialog" aria-modal, giữ Tab trong hộp, Esc đóng, khoá cuộn nền, trả focus về nút đã mở. */

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Giữ focus trong `ref`, Esc gọi onClose, khoá cuộn nền, trả focus khi đóng. */
function useModal(ref: React.RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const node = ref.current;
    document.body.classList.add("ui-scroll-lock");
    const first = node?.querySelector<HTMLElement>("[data-autofocus]") ?? node?.querySelector<HTMLElement>(FOCUSABLE) ?? node;
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const a = items[0];
      const z = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === a || document.activeElement === node)) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.classList.remove("ui-scroll-lock");
      prev?.focus?.();
    };
  }, [open, ref]);
}

function Portal({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  return ok ? createPortal(children, document.body) : null;
}

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  /** drawer = ngăn kéo phải/trái, sheet = tấm kéo từ dưới */
  variant?: "dialog" | "drawer" | "drawer-left" | "sheet";
  className?: string;
  /** Bấm nền để đóng (mặc định bật) */
  dismissOnScrim?: boolean;
  /** role="alertdialog" cho hộp xác nhận */
  alert?: boolean;
};

export function Dialog({ open, onClose, title, children, footer, size = "md", variant = "dialog", className = "", dismissOnScrim = true, alert }: DialogProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useModal(ref, open, onClose);
  if (!open) return null;
  const v = variant === "drawer" ? " ui-drawer" : variant === "drawer-left" ? " ui-drawer ui-drawer--left" : variant === "sheet" ? " ui-drawer ui-drawer--bottom" : "";
  return (
    <Portal>
      <div
        className="ui-scrim"
        onMouseDown={(e) => {
          if (dismissOnScrim && e.target === e.currentTarget) onClose();
        }}
      >
        <div ref={ref} role={alert ? "alertdialog" : "dialog"} aria-modal="true" aria-labelledby={titleId} tabIndex={-1} data-size={size} className={`ui-dialog${v} ${className}`.trim()}>
          <header className="ui-dialog__header">
            <h2 id={titleId} className="ui-dialog__title">{title}</h2>
            <button type="button" className="ui-dialog__close" aria-label="Đóng" onClick={onClose}><X aria-hidden="true" /></button>
          </header>
          <div className="ui-dialog__body">{children}</div>
          {footer ? <footer className="ui-dialog__footer">{footer}</footer> : null}
        </div>
      </div>
    </Portal>
  );
}

/** Ngăn kéo cạnh phải (side="left" cho trái, "bottom" cho sheet). */
export function Drawer({ side = "right", ...p }: Omit<DialogProps, "variant"> & { side?: "right" | "left" | "bottom" }) {
  return <Dialog {...p} variant={side === "left" ? "drawer-left" : side === "bottom" ? "sheet" : "drawer"} />;
}

export type ConfirmOptions = { title: ReactNode; message?: ReactNode; confirmText?: string; cancelText?: string; danger?: boolean };

/** Hộp xác nhận kiểu controlled. Nút huỷ được focus trước để tránh bấm nhầm Enter. */
export function ConfirmDialog({ open, onConfirm, onCancel, title, message, confirmText = "Xác nhận", cancelText = "Huỷ", danger }: ConfirmOptions & { open: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={title}
      alert
      size="sm"
      className={`ui-dialog--confirm${danger ? " ui-dialog--danger" : ""}`}
      footer={
        <>
          <button type="button" data-autofocus className="ui-btn" onClick={onCancel}>{cancelText}</button>
          <button type="button" className={`ui-btn ${danger ? "ui-btn--danger" : "ui-btn--primary"}`} onClick={onConfirm}>{confirmText}</button>
        </>
      }
    >
      {message}
    </Dialog>
  );
}

type Ask = (o: ConfirmOptions) => Promise<boolean>;
const ConfirmCtx = createContext<Ask | null>(null);

/** Bọc app 1 lần, rồi `const confirm = useConfirm(); if (await confirm({ title: "Xoá?", danger: true })) …` thay cho window.confirm. */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ o: ConfirmOptions; done: (v: boolean) => void } | null>(null);
  const ask = useCallback<Ask>((o) => new Promise<boolean>((resolve) => setState({ o, done: resolve })), []);
  const finish = (v: boolean) => {
    state?.done(v);
    setState(null);
  };
  return (
    <ConfirmCtx.Provider value={ask}>
      {children}
      <ConfirmDialog open={!!state} {...(state?.o ?? { title: "" })} onConfirm={() => finish(true)} onCancel={() => finish(false)} />
    </ConfirmCtx.Provider>
  );
}

export function useConfirm(): Ask {
  const ask = useContext(ConfirmCtx);
  if (!ask) throw new Error("useConfirm cần <ConfirmProvider> bọc ngoài");
  return ask;
}

/** Xem ảnh phóng to. Đóng bằng Esc, bấm nền hoặc nút X; focus trả về ảnh nhỏ. */
export function Lightbox({ open, onClose, src, alt = "", caption }: { open: boolean; onClose: () => void; src: string; alt?: string; caption?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useModal(ref, open, onClose);
  if (!open) return null;
  return (
    <Portal>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={alt || "Xem ảnh"}
        aria-describedby={caption ? titleId : undefined}
        tabIndex={-1}
        className="ui-lightbox"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <button type="button" data-autofocus className="ui-lightbox__btn" aria-label="Đóng" onClick={onClose}><X aria-hidden="true" /></button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ui-lightbox__img" src={src} alt={alt} />
        {caption ? <p id={titleId} className="ui-lightbox__caption">{caption}</p> : null}
      </div>
    </Portal>
  );
}
