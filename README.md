# @365/ui

Giao diện chung cho Kho, Nhân sự, CRM (Next) và Đặt hàng (Laravel). Chỉ có CSS, dùng Tailwind v4.

Cài: `"@365/ui": "github:manhcuong365group/365-ui#v0.1.0"`

```css
@import "tailwindcss";
@import "@365/ui/theme.css";
@theme { --color-primary: var(--color-red-800); /* màu riêng app */ }
```

Màu: dùng bảng màu Tailwind, đặt tên theo công dụng (primary, nav, danger…), không tự chế mã màu.
Đổi gì ở đây → tăng version + tag, rồi nâng từng app bằng PR riêng.

## Component React (Kho, Nhân sự, CRM)
`next.config`: `transpilePackages: ["@365/ui"]`. Dùng: `import { SystemSwitcher } from "@365/ui"`.

## Thanh tab dưới (điện thoại, v0.4.0)
`@import "@365/ui/tabbar.css";` rồi render `<nav class="app-tabbar">` với các `<a class="app-tabbar__item">` (icon + `<span>` nhãn, `aria-current="page"` cho tab đang mở). Chỉ hiện < 768px. Nút nổi dùng `bottom: calc(var(--tabbar-h) + 1rem)`.

## Điện thoại (v0.5.0)

`@import "@365/ui/mobile.css";` sau `tabbar.css`. Lớp: `.m-chip`, `.m-card`, `.m-stats`, `.m-ring`, `.m-largetitle`, `.m-rows`, `.app-tabbar__fab`. Bảng `table[data-cards]` có `td[data-m="title|status|actions"]` thành thẻ bo góc, `.app-dialog` thành tấm trượt từ dưới (< 640px). Xem `demo.html`.

## Thanh trên, tiêu đề trang, thẻ số liệu, tab lọc (v0.6.0)

`@import "@365/ui/components.css";` sau `theme.css`/`tokens.css`. Lớp: `.ui-topbar*` (Góp ý nằm trên thanh trên ở cả 5 hệ thống; dưới 768px Góp ý + Tin nhắn vào menu Tài khoản bằng `.ui-topbar__menu-only`), `.ui-page-title*` (chữ thường, KHÔNG Title Case), `.ui-stat-grid` + `.ui-stat` (`--ok|--warn|--danger`), `.ui-filter-tabs` (+ `__count`, tab chọn = `.is-active` hoặc `aria-current="page"`). Mẫu HTML ở đầu `components.css`; xem thử `components-demo.html`. Logic tìm kiếm/chuông/quyền do mỗi app tự làm.

## Nút kiểu iPhone trên điện thoại (v0.7.0)
`@import "@365/ui/buttons.css";` sau theme.css. Chỉ màn < 768px, trong `.app-content` / `.app-dialog` / `[data-ui-buttons]`: nút cao 44px, bo 12px, nút chỉ có icon rộng 44px, chạm thì lún nhẹ, chữ nút ≥ 15px; ô nhập chữ 16px (iPhone không tự phóng to), cao 44px. Thanh trên, thanh tab, chip, tab không đổi. Bỏ qua 1 nút: `data-ui-plain`. Máy tính không đổi.

## Mẫu chung đợt A (v0.10.0)
`@import "@365/ui/patterns.css";` sau theme.css/tokens.css (+ components.css cho `.ui-stat`, mobile.css cho `.m-chip`). Xem `patterns-demo.html`; mẫu HTML ở đầu mỗi khối trong `patterns.css`. Chữ phụ dùng `--color-fg-muted` (AA), không dùng `--color-fg-subtle` cho chữ.
- Đầu trang: `.ui-page-head` + `__crumbs` `__main` `__title` `__sub` `__actions` (thứ tự cố định breadcrumb → tiêu đề → nút; nút chính đặt cuối; mobile tối đa 2 nút, chính đứng trước). `.ui-btn`, `--primary`.
- KPI: `.ui-kpi-grid` (5 cột ≥1024, 3 cột ≥640, 1 cột mobile) + `.ui-stat` + `.ui-stat--secondary` (ẩn < 640px) + `.ui-stat__spark` (sparkline SVG).
- Trống/tải/lỗi: `.ui-state` (`--error`, `__icon __title __text __actions`), `.ui-skeleton-list` + `.ui-skeleton` (`--short`, `--block`).
- Chip lọc: `.ui-chips` + `.ui-chip` (`aria-pressed="true"` hoặc `.is-active`) + `.ui-chip__count` (`--warn`, `--danger`).
- Thẻ danh sách: `.ui-list-cards` > `.ui-list-card` > `__link __title __status __meta` (tối đa 4 dòng). Bảng → thẻ < 768px: `table.ui-table-cards` + `td[data-label]`, `data-m="title|status|hide|actions"`.
- Thanh dưới: `.ui-bottomnav` + `__item` `__badge` (tối đa 5 mục, safe-area), `body.ui-has-bottomnav`.
- Vùng bấm 44px (< 768px): `.ui-touch-scope` (khung), `.ui-touch` (lẻ), `.ui-touch-link`; bỏ qua `data-ui-plain`.

## v0.11.0 — base.css + bộ component theo namethatui

`@import "@365/ui/base.css";` (nền chuẩn trong `@layer base`: box-sizing, font, heading, link, table, ô nhập 44px, `:focus-visible`, `::selection`, reduced-motion, `[hidden]`, `.sr-only`) rồi `@import "@365/ui/components.css"; @import "@365/ui/patterns.css";`.
React: `import { Tabs, Dialog, useConfirm, toast, … } from "@365/ui"` (cần react, react-dom, lucide-react). Bọc app 1 lần bằng `<ConfirmProvider>` và đặt `<Toaster />` ở layout.
Blade (Đặt hàng): `x-ui.*` dùng đúng class `ui-*` bên dưới (chưa làm — đợt 2). Demo + trạng thái: `components-demo.html`.

| namethatui | Class `ui-*` | React | Blade `x-ui.*` | Tra cứu |
|---|---|---|---|---|
| Tabs | `ui-tabs` `ui-tab` `ui-tabpanel` | `Tabs` | `tabs` | https://namethatui.com/web/tabs → Tabs |
| Modal Dialog | `ui-dialog` `ui-dialog__*` | `Dialog` | `dialog` | https://namethatui.com/web/dialog-drawer-sheet → Modal Dialog vs Drawer vs Sheet |
| Drawer / Sheet | `ui-drawer` (`--left`, `--bottom`) | `Drawer` | `drawer` | (cùng mục trên) |
| Scrim | `ui-scrim` `ui-scroll-lock` | trong `Dialog` | `dialog` | https://namethatui.com/web/scrim → Scrim |
| Confirm (dialog con) | `ui-dialog--confirm` `ui-btn--danger` | `ConfirmDialog`, `useConfirm` | `confirm-dialog` | (Modal Dialog, role=alertdialog) |
| Badge / Chip / Pill | `ui-badge` (+`--ok/warn/danger/info/accent/primary/count`), `ui-chip` | `Badge` | `badge` | https://namethatui.com/web/badge-chip-pill → Badge, Chip, Pill |
| Status Dot | `ui-dot` (+`--pulse`) | `StatusDot` | `status-dot` | https://namethatui.com/web/status-dot → Status Dot |
| Empty State | `ui-state` (+`--compact`, `--error`) | `EmptyState` | `empty-state` | https://namethatui.com/web/empty-state → Empty State |
| Skeleton / Spinner | `ui-skeleton`, `ui-spinner` | `Skeleton`, `Spinner` | `skeleton`, `spinner` | https://namethatui.com/web/skeleton-spinner → Skeleton vs Spinner |
| Progress | `ui-progress` | (CSS) | `progress` | https://namethatui.com/web/progress-indicators → Progress (bar/ring) |
| Toast | `ui-toaster` `ui-toast` | `Toaster`, `toast` | `toast` | https://namethatui.com/web/toast → Toast (Snackbar) |
| Inline Alert | `ui-alert` (+`--ok/warn/danger/info`) | `Alert` | `alert` | https://namethatui.com/web/alert-callout-banner → Alert |
| Callout | `ui-alert ui-callout` | `Callout` | `callout` | (cùng mục) → Callout |
| Banner | `ui-alert ui-banner` | (CSS) | `banner` | (cùng mục) → Banner |
| Breadcrumbs | `ui-breadcrumbs` | `Breadcrumbs` | `breadcrumbs` | https://namethatui.com/web/breadcrumbs → Breadcrumbs |
| Pagination | `ui-pagination` | `Pagination`, `pageList` | `pagination` | https://namethatui.com/web/pagination → Pagination |
| Switch / Checkbox / Radio | `ui-switch`, `ui-check` | `Switch` | `switch` | https://namethatui.com/web/switch-checkbox-radio → Switch, Checkbox, Radio |
| Form Field | `ui-field` `ui-field__*` | (CSS) | `field` | https://namethatui.com/web/form-field → Form Field |
| Toggle Group | `ui-toggle-group` | `ToggleGroup` | `toggle-group` | https://namethatui.com/web/toggle-group → Toggle Group |
| Popover / Dropdown / Tooltip | `ui-popover`, `ui-menu`, `ui-tooltip` | `Tooltip` (menu: CSS) | `tooltip` | https://namethatui.com/web/popover-dropdown-tooltip → Popover, Dropdown Menu, Tooltip |
| Accordion | `ui-accordion` | `Accordion` | `accordion` | https://namethatui.com/web/accordion → Accordion |
| Avatar Group | `ui-avatar`, `ui-avatar-group` | (CSS) | `avatar-group` | https://namethatui.com/web/avatar-group → Avatar Group |
| Steps | `ui-steps` | `Steps` | `steps` | https://namethatui.com/web/steps → Steps |
| Timeline | `ui-timeline` | `Timeline` | `timeline` | https://namethatui.com/web/timeline → Timeline |
| Data Table | `ui-table-wrap` `ui-table` `ui-table__sort` | (CSS) | `table` | https://namethatui.com/web/data-table → Data Table |
| Combobox | `ui-combobox` | (CSS) | `combobox` | https://namethatui.com/web/combobox → Combobox |
| Lightbox | `ui-lightbox` | `Lightbox` | `lightbox` | https://namethatui.com/web/lightbox → Lightbox |
| Divider | `ui-divider` | (CSS) | `divider` | https://namethatui.com/web/divider → Divider / Separator / Rule |
| Focus Ring | `:focus-visible` trong `base.css` | — | — | https://namethatui.com/web/focus-ring-web → Focus Ring |

Ghi chú: Combobox, Data Table, Avatar Group, Form Field, Divider, Progress mới có CSS (React để đợt sau). Dialog/Drawer/Lightbox/Toaster dùng `react-dom` (portal).
