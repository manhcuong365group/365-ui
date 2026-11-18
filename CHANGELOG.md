# Changelog

## 0.12.0 — touch.css: vùng chạm >= 44px dùng chung
- `touch.css` mới (+ export `@365/ui/touch.css`): trong `@media (pointer: coarse)` nút, tab, select, input, nút icon, summary, menuitem, mục sidebar, link dạng nút, nhãn checkbox/radio cao/rộng >= 44px; ô tick vẽ lại hộp 44px (ô thấy được 20px); lối thoát `data-ui-plain`. Gộp từ Kho + Nhân sự + CRM. Chuột không đổi.
- `patterns.css`: ô tick của `.ui-touch-scope` (24px + lề 10px) chỉ còn áp khi `pointer: fine` để không đụng touch.css. Không đổi/đổi tên class.
- Không phá vỡ: app phải thêm `@import "@365/ui/touch.css";` rồi xoá khối pointer:coarse riêng.

## 0.11.0 — base.css + bộ component theo namethatui
- `base.css` mới (@layer base) + export. `components.css` thêm: tabs, dialog/drawer/sheet/scrim/confirm, badge, status-dot, empty-state (mở rộng `ui-state`), spinner/progress, toast, alert/callout/banner, breadcrumbs, pagination, switch/check, form-field, toggle-group, popover/menu/tooltip, accordion, avatar-group, steps, timeline, data-table, combobox, lightbox, divider.
- React: Tabs, Dialog, Drawer, ConfirmDialog/ConfirmProvider/useConfirm, Lightbox, Badge, StatusDot, EmptyState, Skeleton, Spinner, Alert, Callout, Toaster/toast, Breadcrumbs, Pagination, Steps, Timeline, Accordion, Switch, ToggleGroup, Tooltip. peerDependency thêm `react-dom`.
- Không đổi/đổi tên class cũ. Demo: `components-demo.html`.

## 0.10.0 — mẫu chung đợt A
Thêm `patterns.css` (+ `patterns-demo.html`): `ui-page-head`, `ui-kpi-grid`/`ui-stat--secondary`/`ui-stat__spark`, `ui-state`/`ui-skeleton`, `ui-chip`, `ui-list-card`/`ui-table-cards`, `ui-bottomnav`, `ui-touch*`, `ui-btn`. Không đổi class cũ.
