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
