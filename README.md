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
