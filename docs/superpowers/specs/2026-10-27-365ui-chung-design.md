# @365/ui v0.6.0 — thanh trên, tiêu đề trang, thẻ số liệu, hàng tab lọc

Owner duyệt hướng 27/10/2026: cách 1 = chỉ lớp CSS (dùng được cho Next và Laravel/Blade). Nút Góp ý nằm trên thanh trên ở cả 5 hệ thống. Nâng Nhân sự trước để thử mẫu.

## Phạm vi
Thêm 1 file `components.css` vào gói, tăng lên v0.6.0. Không thêm React, không mã màu cứng: mọi màu lấy từ token (`--color-primary`, `--color-surface`, `--color-border`, `--color-fg*`).

## Thành phần
1. `.ui-topbar` — cao 56px, dính trên. Thứ tự: logo + tên hệ thống, ô tìm kiếm (giãn), rồi Góp ý, Tin nhắn, Chuông (chấm số `.ui-topbar__badge`), Đổi hệ thống, Tài khoản. Nút `.ui-topbar__btn` = ô icon 36px; nhãn chữ `.ui-topbar__label` ẩn dưới 1024px. Dưới 768px: tìm kiếm thu thành icon, Góp ý + Tin nhắn vào menu Tài khoản (thanh dưới đã chiếm chỗ).
2. `.ui-page-title` — ô icon `.ui-page-title__icon` (nền `--color-primary-soft`) + tiêu đề chữ thường (chỉ viết hoa chữ đầu, KHÔNG Title Case) + mô tả phụ `.ui-page-title__sub` + vùng nút bên phải `.ui-page-title__actions`.
3. `.ui-stat` (+ `.ui-stat-grid`) — thẻ số liệu: nhãn nhỏ, số lớn, ghi chú; biến thể `--warn`, `--danger`, `--ok`. Lưới 4 cột ≥1024px, 2 cột ≥390px.
4. `.ui-filter-tabs` — hàng tab lọc có số đếm `.ui-filter-tabs__count`; tab đang chọn `[aria-current="page"]` hoặc `.is-active`; cuộn ngang khi hẹp.

## Triển khai (mỗi app 1 PR, 1 nhánh, 1 worktree)
Thứ tự: 365-ui v0.6.0 → Nhân sự → Kho/Cổng → CRM → Đặt hàng. Mỗi PR chỉ đổi HTML/class sang lớp chung, giữ nguyên logic. Kiểm ở 1366/1440/1920, 768/1024, 390, có ảnh bấm thử.

## Ngoài phạm vi
Đổi logic tìm kiếm/chuông/quyền của từng app; React component; đổi màu từng hệ thống.
