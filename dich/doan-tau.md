# Quy ước dịch — Đoàn Tàu Cầu Sinh: Bàn Tay Vàng Của Tôi Là Bình Tà Hắc Hoa

Nguyên tác: 列車求生：我的金手指是瓶邪黑花 · Tác giả: Biến Tích Thiên Nhai (遍跡天涯).
Tác giả đã ủy quyền cho chủ repo dịch. Bản gốc do chủ repo dán vào chat; không tự lấy từ web.

## File

- Chương 69–117: `truyen/Đoàn Tàu Cầu Sinh_ Bàn Tay Vàng Của Tôi Là Bình Tà Hắc Hoa.html` (bản gốc của chủ repo, không sửa).
- Chương 118 trở đi: `truyen/doan-tau-dot-2.html`.
- Thêm chương: viết JSON `[{ "n", "title", "lines": [...] }]` ra file tạm, rồi
  `node scripts/add-chapters.js "truyen/Đoàn Tàu Cầu Sinh_ Bàn Tay Vàng Của Tôi Là Bình Tà Hắc Hoa.html" truyen/doan-tau-dot-2.html <file.json>`
  → `node scripts/build.js` (kiểm tra) → commit → push. GitHub Actions tự deploy sau ~1 phút.

## Định dạng dòng

- Mỗi đoạn văn là một phần tử của `lines`. Bỏ các dòng quảng cáo của trang nguồn (溫馨提示…).
- Bảng hệ thống `【…】`: gộp các dòng của một bảng vào một phần tử, xuống dòng bằng `<br>`.
- Tin nhắn chat trong app/kênh: `【…】` hoặc `Tên: 【…】`. Ngắt cảnh: `……`.
- Chú thích: `{{từ (原文): giải thích}}` cho món ăn, tiếng lóng, điển cố, nhân vật Đạo Mộ Bút Ký.
- Tiêu đề chương viết hoa chữ cái đầu mỗi từ: "Phó Bản Cấp D".

## Xưng hô

- Lời kể: Vân Tịch là **nàng**; các nam là **hắn** (Hắc Hạt Tử, Trương Khởi Linh) / **y** (Giải Vũ Thần, Ngô Tà).
- Thoại: các nam gọi Vân Tịch là **cô**, tự xưng **ta**, gọi nhau "huynh"/tên; Vân Tịch gọi họ là **huynh**, tự xưng **ta**.
- Hắc Hạt Tử đôi khi tự xưng "Hạt Tử ta"; gọi Vân Tịch là "tiểu cường giả" (小強者).

## Tên riêng / thuật ngữ

| Gốc | Dịch |
|---|---|
| 沈雲汐 / 汐汐 | Thẩm Vân Tịch / Tịch Tịch |
| 解雨臣 / 花兒爺 | Giải Vũ Thần / Hoa gia |
| 吳邪 | Ngô Tà |
| 張起靈 / 小哥 / 啞巴 | Trương Khởi Linh / Tiểu Ca / Á Ba |
| 黑瞎子 / 瞎子 / 黑眼鏡 / 瞎瞎 | Hắc Hạt Tử / Hạt Tử / Hắc Nhãn Kính / Hạt Hạt |
| 神秘強者 | Kẻ Mạnh Thần Bí (biệt danh của Vân Tịch) |
| 老司機求生 | Lão Tài Xế Cầu Sinh |
| 統統 | Thống Thống (AI đoàn tàu) |
| 列車長 / 列車幣 / 積分 | trưởng tàu / xu tàu / điểm |
| 站台預報器 | loa dự báo sân ga |
| 隱秘站台 / 神秘車票 / 車票碎片 | sân ga ẩn / Vé Xe Thần Bí / mảnh vé xe |
| 醫療艙, 醫療車廂 | khoang y tế |
| 工坊車廂 / 衛浴車廂 / 餐車 | toa xưởng / toa tắm rửa (nhà vệ sinh) / toa ăn |
| 擴容模塊 | mô-đun mở rộng |
| 感應區 / 操作台 / 光屏 | vùng cảm ứng / bàn thao tác / màn hình sáng |
| 空間背包 | ba lô không gian |
| 灰霧晶核 / 炎晶 / 冰晶 / 雷晶 | Hôi Vụ Tinh Hạch / Viêm Tinh / Băng Tinh / Lôi Tinh |
| 灰霧長刀 | trường đao Hôi Vụ |
| 黑匣子 | hộp đen |
| 時之砂 | Cát Thời Gian |
| 生命感知 / 治癒術 | cảm tri sinh mệnh / trị liệu thuật |
| 能量手槍 / 能量強弩 / 狙擊槍 | súng lục năng lượng / nỏ năng lượng / súng bắn tỉa |
| 恆溫外套 / 防護服 | áo khoác giữ nhiệt / đồ bảo hộ |
| 單片眼鏡 | kính một mắt |
| 火蜥王 / 炎獄熔窟 | Hỏa Tích Vương / Viêm Ngục Dung Quật |
| 寒霜站 | Trạm Hàn Sương |
| 時隙站 / 時之鐘樓 | Trạm Thời Khích / Thời Chi Chung Lâu |
| 小三爺 | Tiểu Tam gia (Ngô Tà) |
| 熔岩核心 | lõi dung nham |
| 雪橇車 | xe trượt tuyết |
| 木箱 / 青銅箱 / 精鐵箱 / 白銀箱 | rương gỗ / rương đồng xanh / rương tinh thiết / rương bạc |
| 能源結晶 / 高級能量結晶 | kết tinh năng lượng / tinh thể năng lượng cao cấp |
| 輔助系統 / 末日庇護所 | hệ thống phụ trợ / nơi trú ẩn tận thế |
| 製作台 / 模塊 / 圖紙 | bàn chế tạo / mô-đun / bản vẽ |
| 便攜庇護所 / 移動庇護所 | nơi trú ẩn di động |
| 雪狐 / 冰甲熊 / 雪豹 | cáo tuyết / gấu giáp băng / báo tuyết |
| 野怪 / 精英怪 | quái hoang / quái tinh anh |
| 火蜥斷尾替身 | thế thân Đuôi Đứt Hỏa Tích |
| 霍玲 | Hoắc Linh |
| 末日安全堡壘系統 / 堡壘 | Hệ thống Pháo đài An toàn Tận thế / pháo đài |
| 寒潮 / 獸潮 | đợt rét / thú triều |
| 白熊首領 / 首領 | gấu trắng đầu lĩnh / đầu lĩnh |
| 編製 | biên chế |
| 全息面板 | bảng toàn ký |
| 冰封站 | Trạm Băng Phong |
| 保溫核心 / 醫療核心 | lõi giữ nhiệt / lõi y tế |
| 熔岩穿山甲 / 雪狼 | tê tê dung nham / sói tuyết |
| 自動熔爐 / 防禦塔 | lò luyện tự động / tháp phòng ngự |
| 虛空共鳴聖鏈 | Thánh Liên Cộng Hưởng Hư Không |
| 周洋 | Chu Dương |
| 車冢站 / 荒原斗場 | Trạm Xa Trủng / Đấu Trường Hoang Nguyên |
| 列車長身份卡 / 列車員 | Thẻ Thân Phận Trưởng Tàu / nhân viên tàu |
| 大型競技場 / 基地塔 | Đại Đấu Trường / tháp căn cứ |
| 灰霧長刀・覺醒 / 灰霧斬 | Trường đao Hôi Vụ · Thức Tỉnh / Hôi Vụ Trảm |
| 回能劑 / 緊急修復液 | thuốc hồi năng / dung dịch sửa chữa khẩn cấp |
| 端水 | bưng bát nước cho bằng (không thiên vị) |
| 鏡城站 / 鏡花水月 | Trạm Kính Thành / Kính Hoa Thủy Nguyệt |
| 隨身擂台 / 斗者體魄 | lôi đài tùy thân / Thể Phách Đấu Giả |
| 荒野之牙 / 蝶影戰術護甲 | Nanh Hoang Dã / giáp chiến thuật Điệp Ảnh |
| 守鍾人單片眼鏡 | kính một mắt Thủ Chung Nhân |
| 萬能存錢罐 | heo đất vạn năng |
| 平安站 / 白樺站 / 冰原站 | Trạm Bình An / Trạm Bạch Hoa / Trạm Băng Nguyên |
| 世界頻道 / 交易行 / 玩家面板 | kênh thế giới / sàn giao dịch / bảng người chơi |
| 新手禮包 / 基礎生存車廂 | gói quà tân thủ / toa sinh tồn cơ bản |
| 黑爺 / 小花 | Hắc gia / Tiểu Hoa |
| 空間膠囊 / 虛空水晶 | Không Gian Giao Nang / Hư Không Thủy Tinh |
| 車廂守衛戰 / 模塊升級卡 | Trận Chiến Bảo Vệ Toa Tàu / Thẻ Nâng Cấp Mô-đun |
| 冰系異能 / 能量感知 | dị năng hệ băng / cảm tri năng lượng |
| 冰狼 / 頭狼 / 蟲母 | băng lang / sói đầu đàn / trùng mẫu |
| 灰噬 / 燃彈槍 / 黑金匕首 | Hôi Phệ / súng đạn cháy / dao găm Hắc Kim |
| 灰霧稻 | lúa Hôi Vụ |
| 喪屍 / 晶核 / 異能者 | tang thi / tinh hạch / dị năng giả |
| 品質: 稀有 / 精良 / 史詩 / 珍稀 | Hiếm / Tinh lương / Sử thi / Trân hiếm |
| 優良 | Ưu Lương |

## Đã dịch

118–169 (ch.169: đoàn tàu tới Trạm Kính Thành, vào cửa ải đặc biệt cấp C Kính Hoa Thủy Nguyệt, sáu tầng; Ngô Tà đã thân mật với Vân Tịch, mọi người chờ lên cấp 6 để thêm mô-đun phòng ngủ). 143–166 do subagent dịch. Bản gốc người dùng đưa (file RAR) chỉ đến 166.
Chương cũ (dịch bằng subagent) nằm trong `truyen/doan-tau-dot-0.html`. Đủ 1–117. Với người chơi khác, Vân Tịch xưng "tôi", gọi "anh/cô".
