# Đọc truyện

Web đọc truyện cá nhân, chạy trên GitHub Pages. Không cần máy chủ, không cần Apps Script.

## Thêm / cập nhật truyện

1. Vào thư mục **`truyen/`** trên GitHub → **Add file → Upload files**.
2. Kéo thả file `.html` truyện (bản đầy đủ hoặc chỉ một đợt chương mới đều được) → **Commit changes**.
3. Chờ 1–2 phút (theo dõi ở tab **Actions**) → web tự cập nhật.

Cách gộp:
- Truyện nhận diện theo **tên truyện** (thẻ `<h1>`). Nhiều file cùng tên truyện được gộp lại.
- Chương trùng số → lấy theo file commit sau. Chương mới → thêm. Chương cũ không có trong file mới → giữ.
- Tên, tác giả, thể loại, trạng thái, giới thiệu → lấy theo file commit sau cùng.
- Tải lên file **cùng tên file** sẽ ghi đè file cũ, chương nào chỉ có ở file cũ sẽ mất. Muốn giữ thì đặt tên file khác (VD `ten-truyen-dot-2.html`).
- Xoá truyện: xoá các file của truyện đó trong `truyen/`.

File HTML cần có: `const CHAPTERS = [{ n, title, lines }]`, `<h1>`, `.eyebrow` (thể loại · trạng thái), `.byline` (Nguyên tác: … · Tác giả: …), `.blurb`.

## Cấu trúc

| Đường dẫn | Vai trò |
|---|---|
| `truyen/` | File HTML truyện (nguồn dữ liệu) |
| `site/` | Giao diện: `index.html`, `style.css`, `app.js` |
| `scripts/build.js` | Tách truyện thành dữ liệu JSON, xuất web ra `_site/` |
| `.github/workflows/deploy.yml` | Tự build + đăng web mỗi lần commit |
| `config.json` | Tên web |

## Chạy thử trên máy

```bash
node scripts/build.js
```

```bash
node scripts/serve.js
```

Mở http://localhost:5179
