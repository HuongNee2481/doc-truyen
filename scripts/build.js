// Đọc mọi file truyen/*.html → tạo web tĩnh trong _site/ (giao diện + dữ liệu JSON).
// Chạy: node scripts/build.js   (GitHub Actions tự chạy mỗi khi có commit)
//
// File HTML truyện cần có: `const CHAPTERS = [{ n, title, lines: [...] }, ...];`, <h1> (tên truyện),
// .eyebrow (thể loại · trạng thái), .byline (Nguyên tác: … · Tác giả: …), .blurb (giới thiệu).
// Nhiều file cùng tên truyện được gộp: chương trùng số lấy theo file commit sau, chương cũ vẫn giữ.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'truyen');
const SITE = path.join(ROOT, 'site');
const OUT = path.join(ROOT, '_site');
const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8'));
const STATUS_DONE = 'Hoàn thành';

const fold = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
const slugify = s => fold(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function parseStoryHtml(html) {
  const m = html.match(/const CHAPTERS\s*=\s*(\[[\s\S]*?\]);\s*\n/);
  if (!m) throw new Error('không tìm thấy dữ liệu CHAPTERS');
  const chapters = JSON.parse(m[1]);
  const text = re => {
    const x = html.match(re);
    if (!x) return '';
    return x[1].replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'").replace(/&amp;/g, '&')
      .split('\n').map(s => s.trim()).filter(Boolean).join('\n');
  };
  const title = (text(/<h1[^>]*>([\s\S]*?)<\/h1>/) || text(/<title>([\s\S]*?)<\/title>/)).replace(/\n/g, ' ');
  if (!title) throw new Error('không tìm thấy tên truyện (thẻ <h1> hoặc <title>)');
  const isStatus = s => /^(đang ra|hoàn thành|full|tạm dừng)$/i.test(s);
  const tags = text(/class="eyebrow"[^>]*>([\s\S]*?)<\/div>/).split('·').map(s => s.trim()).filter(Boolean);
  const byline = text(/class="byline"[^>]*>([\s\S]*?)<\/p>/);
  const field = label => ((byline.match(new RegExp(label + ':\\s*([^·]+)')) || [])[1] || '').trim();
  const status = tags.find(isStatus) || 'Đang ra';
  return {
    title,
    author: field('Tác giả'),
    original: field('Nguyên tác'),
    genres: tags.filter(t => !isStatus(t)),
    status: /^(hoàn thành|full)$/i.test(status) ? STATUS_DONE : status.charAt(0).toUpperCase() + status.slice(1),
    description: text(/class="blurb"[^>]*>([\s\S]*?)<\/div>/),
    chapters: chapters.map(c => ({
      n: Number(c.n),
      title: String(c.title || ''),
      content: (c.lines || []).map(l => String(l).trim()).join('\n'),
    })),
  };
}

/** Thời điểm commit gần nhất của file (trên GitHub); chạy ngoài git thì dùng ngày sửa file. */
function fileTime(file) {
  try {
    const t = execFileSync('git', ['log', '-1', '--format=%ct', '--', file], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (t) return Number(t) * 1000;
  } catch (e) { /* không phải repo git */ }
  return fs.statSync(file).mtimeMs;
}

// ---------- đọc & gộp truyện ----------
const files = fs.existsSync(SRC)
  ? fs.readdirSync(SRC).filter(f => /\.html?$/i.test(f)).map(f => path.join(SRC, f))
  : [];
const sources = files.map(f => ({ file: f, time: fileTime(f) })).sort((a, b) => a.time - b.time);

const stories = new Map();
for (const { file, time } of sources) {
  let d;
  try {
    d = parseStoryHtml(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error('✘ ' + path.basename(file) + ': ' + e.message);
    process.exitCode = 1;
    continue;
  }
  const id = slugify(d.title);
  const s = stories.get(id) || { id, chapters: new Map(), updated: 0 };
  // thông tin truyện lấy theo file mới nhất (danh sách đã sắp theo thời gian tăng dần)
  Object.assign(s, { title: d.title, author: d.author, original: d.original, genres: d.genres, status: d.status, description: d.description });
  let added = 0, changed = 0;
  for (const c of d.chapters) {
    const prev = s.chapters.get(c.n);
    if (prev && prev.title === c.title && prev.content === c.content) continue;
    prev ? changed++ : added++;
    s.chapters.set(c.n, { title: c.title, content: c.content, date: time });
    s.updated = Math.max(s.updated, time);
  }
  stories.set(id, s);
  console.log(`✔ ${path.basename(file)} → ${d.title}: thêm ${added}, sửa ${changed}`);
}

// ---------- ghi web ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(SITE, OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
const index = path.join(OUT, 'index.html');
fs.writeFileSync(index, fs.readFileSync(index, 'utf8')
  .replace(/\{\{SITE_NAME\}\}/g, config.siteName).replace(/\{\{SITE_DESC\}\}/g, config.siteDesc));

const categories = new Map();
const list = [...stories.values()].map(s => {
  const cats = s.genres.map(g => {
    const slug = slugify(g);
    const c = categories.get(slug) || { slug, name: g, count: 0 };
    c.count++;
    categories.set(slug, c);
    return slug;
  });
  const chapters = [...s.chapters.entries()].sort((a, b) => a[0] - b[0]);
  const dir = path.join(OUT, 'data', s.id);
  fs.mkdirSync(dir, { recursive: true });
  for (const [n, c] of chapters) {
    fs.writeFileSync(path.join(dir, n + '.json'),
      JSON.stringify({ n, title: c.title, date: new Date(c.date).toISOString(), content: c.content }));
  }
  return {
    id: s.id, title: s.title, author: s.author, original: s.original, categories: cats,
    status: s.status, description: s.description, updated: new Date(s.updated).toISOString(),
    chapters: chapters.map(([n, c]) => [n, c.title]),
  };
});

fs.writeFileSync(path.join(OUT, 'data', 'library.json'), JSON.stringify({
  siteName: config.siteName,
  categories: [...categories.values()],
  stories: list,
}));
console.log(`Đã tạo _site/ với ${list.length} truyện, ${list.reduce((t, s) => t + s.chapters.length, 0)} chương.`);
