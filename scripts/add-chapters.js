// Ghép chương đã dịch (file JSON) vào một file HTML truyện trong truyen/.
// Chạy: node scripts/add-chapters.js <file-mẫu.html> <file-đích.html> <chương.json> [chương2.json …]
//   - <file-mẫu.html>: file truyện gốc, lấy phần khung (tên, tác giả, thể loại, giới thiệu…).
//   - <file-đích.html>: file đợt mới, VD truyen/doan-tau-dot-2.html; nếu đã có thì giữ các chương cũ trong đó.
//   - <chương.json>: mảng [{ "n": 127, "title": "…", "lines": ["…", "…"] }]; chương trùng số sẽ thay bản cũ.
// Cảnh báo nếu còn sót chữ Hán ngoài phần chú thích {{…}}.
const fs = require('fs');

const [template, target, ...jsons] = process.argv.slice(2);
if (!template || !target || !jsons.length) {
  console.error('Cách dùng: node scripts/add-chapters.js <file-mẫu.html> <file-đích.html> <chương.json> […]');
  process.exit(1);
}
const RE = /const CHAPTERS\s*=\s*(\[[\s\S]*?\]);\s*\n/;
const read = f => {
  const s = fs.readFileSync(f, 'utf8');
  const m = s.match(RE);
  if (!m) throw new Error('Không thấy CHAPTERS trong ' + f);
  return { src: s, chapters: JSON.parse(m[1]) };
};

const shell = read(template);
const byN = new Map();
if (fs.existsSync(target)) read(target).chapters.forEach(c => byN.set(c.n, c));
jsons.flatMap(f => JSON.parse(fs.readFileSync(f, 'utf8'))).forEach(c => byN.set(Number(c.n), c));
const chapters = [...byN.values()].sort((a, b) => a.n - b.n);

let warn = 0;
for (const c of chapters) {
  for (const l of [c.title, ...c.lines]) {
    if (/[㐀-鿿]/.test(String(l).replace(/\{\{.*?\}\}/g, ''))) {
      console.warn(`⚠ Còn chữ Hán ở ch.${c.n}: ${String(l).slice(0, 70)}`);
      warn++;
    }
  }
}
fs.writeFileSync(target, shell.src.replace(RE, () => 'const CHAPTERS = ' + JSON.stringify(chapters) + ';\n'));
console.log(`Đã ghi ${target}: ${chapters.length} chương (${chapters[0].n}–${chapters[chapters.length - 1].n})${warn ? `, ${warn} cảnh báo` : ''}`);
