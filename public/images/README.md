# Hướng dẫn Thay thế Hình ảnh & Video Thực tế (Media Asset Guide)

Tất cả các component trên trang chủ (`/`) và trang phân tích sâu (`/work/[slug]`) đều đã được tích hợp **Architectural UI Fallback** tự động. Khi bạn chép file ảnh `.webp` hoặc video `.mp4` thật vào đúng đường dẫn dưới đây, giao diện sẽ tự động hiển thị file media của bạn mà không cần sửa code:

## 1. Ảnh Chân dung Cá nhân (`public/images/profile/`)
- `public/images/profile/portrait-cutout.webp` — Ảnh chân dung tách nền hoặc đóng khung (tỷ lệ 1:1 hoặc 4:5) hiển thị trong vòng tròn kỹ thuật ở Hero Section.

## 2. Ảnh & Video Phòng Lab Thực thi (`public/images/lab/`)
- `public/images/lab/kv-admissions-16x9.webp` (16:9 Key Visual)
- `public/images/lab/b2b-hook-reel.mp4` (Video dọc 9:16, 5–15s, muted)
- `public/images/lab/o2o-event-stage.webp` (16:9 Ảnh sự kiện O2O)
- `public/images/lab/d2c-ugc-winner.mp4` (Video dọc 9:16 UGC)
- `public/images/lab/pr-thought-leadership.webp` (16:9 Tuyến bài PR)
- `public/images/lab/cro-landing-wireframe.webp` (16:9 Giao diện CRO)

## 3. Ảnh Bìa & Tư liệu 4 Case Study Trọng điểm (`public/images/projects/[slug]/`)
- `public/images/projects/university-admissions-imc-2025/cover.webp`
- `public/images/projects/b2b-industrial-tech-lead-engine/cover.webp`
- `public/images/projects/flagship-o2o-brand-ambassador-series/cover.webp`
- `public/images/projects/omnichannel-d2c-ecommerce-cro-growth/cover.webp`

## 4. File CV Tải 1 Chạm (`public/cv.pdf`)
- Thay thế file `public/cv.pdf` hiện tại bằng bản CV PDF chính thức của bạn để nút **Tải CV** trên thanh Navbar, Command Palette (`⌘K`) và Footer tải trực tiếp.
