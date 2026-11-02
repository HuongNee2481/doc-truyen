# Quy ước dịch — Phó Bản Cầu Sinh: Mỹ Nhân Một Lòng Cẩu Mạng

Nguyên tác: 求生副本：美人她一心苟命 · Tác giả: Dĩ Hiểu (已晓).
Tác giả đã ủy quyền cho chủ repo dịch. Bản gốc do chủ repo dán vào chat; không tự lấy từ web.

## File

- Chương 1–448: `truyen/Phó Bản Cầu Sinh_ Mỹ Nhân Một Lòng Cẩu Mạng.html` (bản gốc của chủ repo, không sửa).
- Chương 449 trở đi: `truyen/pho-ban-dot-2.html`.
- Thêm chương: viết JSON `[{ "n", "title", "lines": [...] }]` ra file tạm, rồi
  `node scripts/add-chapters.js "truyen/Phó Bản Cầu Sinh_ Mỹ Nhân Một Lòng Cẩu Mạng.html" truyen/pho-ban-dot-2.html <file.json>`
  → `node scripts/build.js` (kiểm tra) → commit → push. GitHub Actions tự deploy sau ~1–2 phút.
- Tra cứu bản dịch cũ (file 5,5MB, đừng đọc cả file): lấy mảng bằng
  `s.match(/const CHAPTERS\s*=\s*(\[[\s\S]*?\]);\s*\n/)` rồi `JSON.parse`, lọc theo `n` hoặc regex trên `lines`.
  Chữ trong file có thể ở dạng tổ hợp (NFD) — `normalize('NFC')` trước khi so khớp tên có dấu.

## Tiêu đề chương

- Kiểu `Tên phó bản (n)`, viết hoa **chỉ chữ đầu**: "Đông giá cầu sinh (21)", "Thiên ngoại thứ tự (3)".
  Mục lục gom nhóm theo phần tên trước `(n)` — giữ nguyên tên nhóm, đánh số tiếp.
- Chương cuối một phó bản: `Tên phó bản (hoàn)` (bản cũ có lẫn "Hoàn"/"hết" — từ nay dùng "(hoàn)" chữ thường).
- Giữa các phó bản là `Hiện thực (n)` (thế giới thật) hoặc `Tinh hệ (n)` (từ ch.388, thời ở tinh hệ/tầng nhà ở);
  số đếm của mỗi nhóm nối tiếp lần trước, VD Tinh hệ (5) → … → Tinh hệ (6).
- Nhóm hiện tại: **Đông giá cầu sinh** — ch.448 là (21), nên ch.449 = "Đông giá cầu sinh (22)".
- Đã có: Hải dương cầu sinh, Hiện thực (đến 59), Cầu sinh trên quốc lộ, Cầu sinh trên mây, Đào thoát zombie,
  Cầu sinh lưu đày, Cầu sinh rừng mưa, Cầu sinh quỷ dị, Vĩnh dạ, Nữ tôn, Chuyến tàu điểm cuối,
  Cầu sinh hàng không, Tinh hệ (đến 8), Kính tự do, Thiên ngoại thứ tự, Đông giá cầu sinh.

## Định dạng dòng

- Mỗi đoạn văn là một phần tử của `lines`. Bỏ các dòng quảng cáo của trang nguồn (溫馨提示…).
- Ngoặc kép thẳng `"…"` cho lời thoại. Gạch nối dài giữ dạng `——`, ba chấm giữ dạng `……` (như bản gốc).
- Ngắt cảnh: một dòng chỉ có `……`.
- Bảng/thông báo hệ thống: `【…】`; một bảng nhiều dòng gộp vào một phần tử, xuống dòng bằng `<br>`.
  Đánh số trong bảng kiểu `1, …` hoặc `1. …` theo bản gốc.
  Tiếng "叮" của hệ thống: dùng **"Tít!"** (bản cũ có Đinh!/Ting!, các chương gần đây thống nhất "Tít!").
- Kênh người chơi (chat): `【Tên ID: nội dung】`, ẩn danh là `【???-Ẩn danh: …】` (cách dùng ở các chương gần đây).
  Bản cũ (đến ~ch.230) dùng `（Tên: …）` và `(…)` cho bình luận livestream — chỉ dùng lại nếu bản gốc dùng khung （）.
- Phản ứng câm kiểu `Tên: ……`, `Tên: ……?` giữ nguyên.
- Chú thích: `{{原文: giải thích}}` hoặc `{{Từ dịch (原文): giải thích}}`, đặt ngay sau từ/câu cần chú thích
  — cho meme mạng, thành ngữ, điển cố, chơi chữ. Chữ Hán chỉ được nằm trong `{{…}}`.

## Xưng hô

- Lời kể: Khương Trường Ninh là **cô**; nam chính diện/trung tính là **anh** (Kelles, Salman), nam phụ/đối thủ
  là **anh ta** (Arent, người hồ tộc), phản diện/khinh thường là **hắn**; nữ lớn tuổi là **bà** (Hỷ, Đinh);
  sinh vật/năng lượng/Ô Thánh Hồn là **nó**.
- Thoại giữa người chơi/người lạ: **tôi – anh/cô/cậu**; KTN giả giọng bán hàng: "Thân ơi… nha!".
- Nhà Hỷ: Hỷ tự xưng **ta**/**mẹ**, gọi con **con**; Kelles – Salman: **anh – em**; con gọi Hỷ là **mẹ**.
- Kelles với KTN: **tôi – em**, gọi "thư chủ"; KTN gọi Hỷ là **mẹ** (阿母); Arent với KTN: **cha – con**, với Kelles: **tôi – cậu**.
- Nhóm sói tuần tra gọi Kelles là **thủ lĩnh**/**anh**; Salman là **phó thủ**.
- KTN nói với Ô Thánh Hồn: **chị Ô – em**.
- Lời độc thoại châm biếm của KTN giữ giọng mạng, câu ngắn ("Khoan đã?", "Không phải?", "Vậy thì không sao.").

## Tên riêng / thuật ngữ

Cột dịch là tên đang dùng trong bản dịch (chuẩn). Cột gốc được suy ngược từ bản dịch, **chưa đối chiếu** với
nguyên văn (`?` = chưa biết) — gặp chữ Hán thật trong bản gốc thì sửa lại cột này cho đúng.

| Gốc | Dịch |
|---|---|
| 姜长宁 / 宁宁 | Khương Trường Ninh / Ninh Ninh |
| 偽裝者系統 | Hệ thống Kẻ Ngụy Trang (gọi KTN là **ký chủ**) |
| 形態 / 模板 | dạng (sinh vật) — bản cũ gọi "mẫu" |
| ? | Thạch (sứa, tên thật Khương Minh), Cá Con (tên thật Khương Ngạo Thiên) — hai "con" cộng sinh |
| 圣魂伞 / 伞剑 | Ô Thánh Hồn (cây ô linh hồn, "chị Ô", gọi là **nó**) / ô kiếm |
| ? | quỷ khí (vũ khí biến hình); tiền âm phủ |
| 邪神 / 邪神幼崽(模板) / 正神 | Tà Thần / (dạng) ấu tể Tà Thần / chính thần |
| 邪种 / 污染 / 污染源 | tà chủng / ô nhiễm / nguồn ô nhiễm |
| ? | chuỗi hạt thủy tinh trắng (chỉnh nhiệt độ); viên bi mắt mèo (do thám) |
| 遮天道印 | Già Thiên Đạo Ấn (đạo cụ truyền thuyết, giả thân phận chủng tộc) |
| ? | Trọng Vân Thiên Dực Thú, Chuột con / Thần Bếp Chuột Con, Ấu tể Tà Thần, Cáo Trắng Bắc Cực, Giảo Giảo Đoàn, Ẩn Nguyệt Bức, U Hỏa Quang Huỳnh, Chuột Hamster Vàng (các dạng) |
| ? | ID: "Mẹ không cho tôi chơi với đồ ngốc nên tuyệt giao với cậu" (đang dùng ở phó bản thường), "Chỉ cần đặt tên đủ dài kiểu gì cũng có đứa ngốc đọc theo", Tường Thụy (tên cửa hàng, "hậu duệ thần ma") |
| 金幣 / 積分 | kim tệ / điểm tích lũy |
| 副本 / 普通副本 / 秩序副本 / 聯合副本 | phó bản / phó bản thường / phó bản thứ tự / phó bản liên hợp |
| 玩家頻道 | kênh người chơi |
| 秩序玩家 | người chơi thứ tự |
| 冷卻 | thời gian hồi |
| 空間 / 儲物空間 | không gian / không gian chứa đồ |
| 後台 / 賣家後台 | hậu đài người bán (cửa hàng, có giám định) |
| 飽腹海藻 | rong biển no bụng |
| 絨絨木 | Nhung Mộc (chồi non dùng lọc mùi) |
| 求生指南 | Chỉ nam cầu sinh |

### Phó bản Vĩnh Hằng Đông Giá (A, 50 người chơi, sinh tồn 120 ngày) — từ ch.428

| Gốc | Dịch |
|---|---|
| 凛冬求生 (tên chương) / ? | "Đông giá cầu sinh" (tiêu đề) / Vĩnh Hằng Đông Giá (tên phó bản); Đông Giá ("trở về vòng tay Đông Giá" = chết) |
| ? | Mưa Phùn Lất Phất (người chơi điều phối), Tôi Yêu Kiếm Kim Tệ (người chơi), người chơi hải cẩu, người chơi nam sói (cảm giác tồn tại yếu) |
| 狼族 / 雪狼 | tộc Sói / sói tuyết, sói khổng lồ |
| 狐族 / 天狐族 / 白狐 | hồ tộc, tộc Cáo / Thiên Hồ tộc / cáo trắng, hồ ly trắng |
| 魂族 | hồn tộc (kẻ thù tập kích) |
| 獸神 | Thú Thần |
| 雌性 / 雄性 | con cái / con đực (giống cái/giống đực) |
| 幼崽 / 雌崽 / 雄崽 | ấu tể / ấu tể cái / ấu tể đực |
| 獸夫 / 第一獸夫 | thú phu / thú phu thứ nhất (đầu tiên) |
| 雌主 | thư chủ |
| 婚契 / 印記 | hôn khế / dấu ấn |
| 種植空間 / 糧種 | không gian trồng trọt / giống lương thực |
| 伴生空间 / 本命空间 | không gian bạn sinh / không gian bản mệnh (của con đực, hai từ gốc khác nhau — dịch theo gốc) |
| 覺醒 / 覺醒儀式 | thức tỉnh / nghi thức thức tỉnh |
| 亞成年 / 成年 | á thành niên / thành niên |
| 流浪獸 | thú lang thang, thú tộc lang thang |
| 救濟營 | trại cứu tế |
| 口糧 | khẩu phần |
| 獸市 | chợ thú |
| 巡邏隊 / 狩獵隊 | đội tuần tra / đội săn bắt |
| 首領 / 副手 | thủ lĩnh / phó thủ |
| 部族 / 族地 | bộ tộc / tộc địa |
| 冰屋 | nhà băng |
| 脂瓶 | bình mỡ (ch.440 viết "chai mỡ" — từ nay dùng "bình mỡ") |
| 一級…五級戰士 / 戰紋 | chiến sĩ cấp một…cấp năm / chiến văn |
| 異能 | dị năng (cấp bốn); cấp năm câu thông nguyên tố |
| 識海 | thức hải |
| 凯勒斯 | Kelles (thủ lĩnh đội tuần tra, sói, anh cả, thú phu thứ nhất của KTN) |
| 萨尔曼 | Salman (phó thủ, em ruột Kelles, thú phu thứ hai) |
| Smurphy | Smurphy (sói trẻ nhất đội tuần tra) |
| 亚伦特 | Arent (hồ ly trắng bốn đuôi, chiến sĩ cấp bốn, "cha" của Thừa) |
| 万兽城 / 兽城 / 城主 | Vạn Thú Thành / Thú Thành / thành chủ |
| 凛冬纪 | Đông Giá Kỷ |
| 兽集 / 集市 | chợ thú / chợ |
| 雌母 | mẹ (con trai gọi Hỷ) |
| 妻夫 | vợ chồng ("đôi vợ chồng nhỏ") |
| 侧室 / 贱兽 / 野雄性 | thiếp thất / đồ tiện thú / con đực ngoài |
| 斯墨菲 | Smurphy (sói trẻ cấp hai, muốn làm thú phu) |
| 空间风暴 / 黑色旋涡 | bão không gian / vòng xoáy đen |
| 权柄 / 邪神分支 / 眷属 | quyền bính / phân chi Tà Thần / quyến thuộc |
| 幽灵系 / 亡灵玩家 | hệ u linh / người chơi vong linh (gọi là **nó**) |
| 治愈药剂 | thuốc chữa trị |
| 2.0版本自用款邪种 | tà chủng tự dùng phiên bản 2.0 (của KTN) |
| 祂 | **Ngài** (đại từ cho Tà Thần/cổ thần); lời nội tâm của Ngài để trong `{…}` (một ngoặc nhọn) |
| 净华天御凰 | Tịnh Hoa Thiên Ngự Hoàng (dạng phượng hoàng lửa trắng, điều khiển năng lượng trời đất) |
| 混乱阵营 / 守序阵营 / 混乱秩序阵营 | phe Hỗn Loạn / phe Trật Tự / phe Hỗn Loạn Trật Tự; 守序者 = kẻ thủ tự |
| 神格 / 美之权柄 / 魅之权柄 / 爱之权柄 / 诸天权柄 | thần cách / Quyền bính Cái Đẹp / Quyền bính Mị Hoặc / Quyền bính Tình Yêu / quyền bính chư thiên |
| 古族 / 古神 / 母系 / 繁衍权柄 | Cổ tộc / cổ thần / mẫu hệ / quyền bính sinh sôi |
| 深渊 / 时空长河 / 复眼 | vực sâu / dòng sông thời không / mắt kép (Tà Thần nhện) |
| 果冻 / 小鱼 / 灵兽空间 | Thạch / Cá Con / không gian linh thú |
| 二级庇护所 / 云朵沙发 / 白晶手串 | nơi trú ẩn cấp hai / ghế sofa mây / chuỗi hạt thủy tinh trắng |
| 海兽人 / 领空兽人 | thú nhân biển / thú nhân bầu trời |
| 喜 / 玎 / 承 | Hỷ (mẹ Kelles–Salman) / Đinh (bà ngoại, người đứng đầu) / Thừa (tên Hỷ đặt cho KTN) |
| 族长 | tộc trưởng (nữ, "bà") |
| 阿爹 / 阿母 | cha / mẹ (Arent tự xưng "cha" với KTN, gọi Kelles là "cậu") |
| 籼稻 / 粳稻 | lúa hạt dài / lúa hạt tròn (KTN chọn gạo hạt tròn làm giống lương thực) |

## Đã dịch

1–448 (bản gốc của chủ repo).
449–452 (đợt 2): KTN nuốt cục năng lượng Tà Thần, biết thế giới là bãi săn của Tà Thần, "thức tỉnh" giả không gian trồng trọt (gạo hạt tròn) để nuốt ô nhiễm trong thú nhân; Kelles phát hiện giống lương thực của thư chủ cao cấp hơn.
453–458: người chơi bị hồn tộc truy sát; KTN hóa hình á thành niên, gieo tà chủng 2.0 cho nhà Hỷ; đi chợ thú, gặp thú nhân đột phá cấp bảy hóa phân chi Tà Thần.
459–464: KTN hóa Tịnh Hoa Thiên Ngự Hoàng rồi dạng Tà Thần, nuốt thể ô nhiễm, nhận Quyền bính Cái Đẹp; Tà Thần nhện để ý cô; từ biệt Kelles; dưới biển gặp phân thân cổ thần bạch tuộc nhận cô là đồng tộc mẫu hệ.

Bản gốc: chủ repo đưa file TXT cả truyện (mã GBK, chuyển bằng `iconv -f GB18030 -t UTF-8`); dòng tiêu đề chương dính vào cuối dòng trước và cuối mỗi chương thường mất 1–2 chữ — tự bù cho tròn câu. Bản tới ch.474 (473 = Đông giá cầu sinh hoàn, 474 = Tinh hệ (9)).
