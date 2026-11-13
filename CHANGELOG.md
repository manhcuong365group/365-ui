# Changelog

## 0.11.0 — base.css + bộ component theo namethatui
- `base.css` mới (@layer base) + export. `components.css` thêm: tabs, dialog/drawer/sheet/scrim/confirm, badge, status-dot, empty-state (mở rộng `ui-state`), spinner/progress, toast, alert/callout/banner, breadcrumbs, pagination, switch/check, form-field, toggle-group, popover/menu/tooltip, accordion, avatar-group, steps, timeline, data-table, combobox, lightbox, divider.
- React: Tabs, Dialog, Drawer, ConfirmDialog/ConfirmProvider/useConfirm, Lightbox, Badge, StatusDot, EmptyState, Skeleton, Spinner, Alert, Callout, Toaster/toast, Breadcrumbs, Pagination, Steps, Timeline, Accordion, Switch, ToggleGroup, Tooltip. peerDependency thêm `react-dom`.
- Không đổi/đổi tên class cũ. Demo: `components-demo.html`.

## 0.10.0 — mẫu chung đợt A
Thêm `patterns.css` (+ `patterns-demo.html`): `ui-page-head`, `ui-kpi-grid`/`ui-stat--secondary`/`ui-stat__spark`, `ui-state`/`ui-skeleton`, `ui-chip`, `ui-list-card`/`ui-table-cards`, `ui-bottomnav`, `ui-touch*`, `ui-btn`. Không đổi class cũ.
