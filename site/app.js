(() => {
  'use strict';

  const app = document.getElementById('app');
  const catNav = document.getElementById('catNav');
  const state = { params: {}, reader: null };
  const STATUS_DONE = 'Hoàn thành';
  const PAGE_SIZE = 24;
  const SITE_NAME = document.title;

  /* ============ tiện ích ============ */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* bỏ qua */ } },
  };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clean = p => Object.fromEntries(Object.entries(p).filter(([, v]) => v !== '' && v != null).map(([k, v]) => [k, String(v)]));
  const link = p => { const q = new URLSearchParams(clean(p)).toString(); return q ? '?' + q : '?'; };
  const num = n => Number(n || 0).toLocaleString('vi-VN');
  const fold = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase();
  const hue = s => [...String(s)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);
  const paras = t => String(t || '').split(/\n+/).map(x => x.trim()).filter(Boolean).map(x => `<p>${esc(x)}</p>`).join('');
  /** "Tên chính: Phụ đề" → Tên chính: <em>Phụ đề</em> */
  function titleHtml(t) {
    const i = String(t).indexOf(':');
    return i < 0 ? esc(t) : `${esc(t.slice(0, i + 1))} <em>${esc(t.slice(i + 1).trim())}</em>`;
  }
  function ago(s) {
    const d = new Date(s);
    if (!s || isNaN(d)) return s || '';
    const m = Math.floor((Date.now() - d) / 60000);
    if (m < 60) return Math.max(m, 1) + ' phút trước';
    if (m < 1440) return Math.floor(m / 60) + ' giờ trước';
    if (m < 43200) return Math.floor(m / 1440) + ' ngày trước';
    return d.toLocaleDateString('vi-VN');
  }

  /* ============ dữ liệu (file JSON tĩnh do scripts/build.js tạo) ============ */
  let libP = null;
  function lib() {
    if (!libP) {
      libP = fetch('data/library.json', { cache: 'no-cache' })
        .then(r => { if (!r.ok) throw new Error('Không tải được thư viện truyện (' + r.status + ')'); return r.json(); })
        .then(d => {
          d.stories.forEach(s => {
            s.chapters = s.chapters.map(([n, title]) => ({ n, title }));
            s.chapterCount = s.chapters.length;
          });
          d.byId = new Map(d.stories.map(s => [s.id, s]));
          return d;
        });
      libP.catch(() => { libP = null; });
    }
    return libP;
  }
  async function getStory(id) {
    const s = (await lib()).byId.get(id);
    if (!s) throw new Error('Không tìm thấy truyện');
    return s;
  }
  const chapMemo = new Map();
  function getChapter(id, n) {
    const key = id + '/' + n;
    if (!chapMemo.has(key)) {
      const p = fetch(`data/${encodeURIComponent(id)}/${n}.json`)
        .then(r => { if (!r.ok) throw new Error('Không tìm thấy chương ' + n); return r.json(); });
      chapMemo.set(key, p);
      p.catch(() => chapMemo.delete(key));
    }
    return chapMemo.get(key);
  }
  const sorters = {
    updated: (a, b) => (b.updated > a.updated ? 1 : b.updated < a.updated ? -1 : 0),
    chapters: (a, b) => b.chapterCount - a.chapterCount,
    name: (a, b) => a.title.localeCompare(b.title, 'vi'),
  };

  /* ============ lịch sử đọc (theo từng truyện) ============ */
  const getHistory = () => store.get('readHistory', {});
  function saveHistory(id, patch) {
    const h = getHistory();
    h[id] = Object.assign({}, h[id], patch, { at: Date.now() });
    store.set('readHistory', h);
  }

  /* ============ thành phần ============ */
  function cover(s, size) {
    const i = s.title.indexOf(':');
    const main = i < 0 ? s.title : s.title.slice(0, i);
    const sub = i < 0 ? '' : s.title.slice(i + 1).trim();
    return `<div class="cover ${size || ''} cover-ph" style="--h:${hue(s.title)}" aria-hidden="true">
      <span class="ct">${esc(main)}${sub ? `<em>${esc(sub)}</em>` : ''}</span>
      <span class="ca">${esc((s.author || '').replace(/\s*\(.*\)$/, ''))}</span></div>`;
  }
  const statusBadge = s => s === STATUS_DONE ? '<span class="badge done">Hoàn thành</span>' : `<span class="badge">${esc(s)}</span>`;
  const card = s => `
    <a class="card" href="${link({ p: 'story', id: s.id })}">
      ${cover(s)}
      <div>
        <h3>${esc(s.title)}</h3>
        <div class="by">${esc(s.author || 'Đang cập nhật')}</div>
        <div class="meta">${num(s.chapterCount)} chương ${s.status === STATUS_DONE ? statusBadge(s.status) : ''}</div>
      </div>
    </a>`;
  const grid = items => `<div class="grid">${items.map(card).join('')}</div>`;
  const section = (title, body, more) => `
    <section class="section">
      <div class="section-head"><h2>${esc(title)}</h2>${more ? `<a class="link" href="${more}">Xem tất cả →</a>` : ''}</div>
      ${body}
    </section>`;
  const empty = msg => `<div class="empty">${esc(msg)}</div>`;

  async function renderNav() {
    let cats = [];
    try { cats = (await lib()).categories; } catch (e) { /* trang lỗi sẽ báo */ }
    const cur = state.params.p === 'list' ? (state.params.cat || '*') : '';
    const chip = (href, name, on) => `<a class="chip" href="${href}" ${on ? 'aria-current="page"' : ''}>${esc(name)}</a>`;
    catNav.innerHTML = chip(link({ p: 'list' }), 'Tất cả', cur === '*') +
      cats.map(c => chip(link({ p: 'list', cat: c.slug }), c.name, cur === c.slug)).join('');
  }

  function pager(page, pages, base) {
    if (pages <= 1) return '';
    const out = [];
    const a = (n, txt) => `<a href="${link(Object.assign({}, base, { page: n }))}">${txt}</a>`;
    if (page > 1) out.push(a(page - 1, '←'));
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - page) <= 2) out.push(i === page ? `<span class="cur">${i}</span>` : a(i, i));
      else if (out[out.length - 1] !== '<span>…</span>') out.push('<span>…</span>');
    }
    if (page < pages) out.push(a(page + 1, '→'));
    return `<nav class="pager" aria-label="Phân trang">${out.join('')}</nav>`;
  }

  /** Nội dung chương: 【…】 khung hệ thống, （…） khung chat, …… ngắt cảnh, {{…}} chú thích. Chỉ cho phép thẻ <br>. */
  function chapterHtml(text) {
    const notes = [];
    const html = String(text || '').split('\n').map(l => l.trim()).filter(Boolean).map(l => {
      const t = esc(l).replace(/&lt;br\s*\/?&gt;/gi, '<br>').replace(/\{\{(.+?)\}\}/g, (m, x) => {
        notes.push(x);
        return `<button type="button" class="fn" data-i="${notes.length - 1}" aria-expanded="false" aria-label="Chú thích ${notes.length}"><span>${notes.length}</span></button>`;
      });
      if (l.startsWith('【')) return `<p class="sys">${t}</p>`;
      if (l.startsWith('（')) return `<p class="chat">${t}</p>`;
      if (l === '……') return '<p class="beat">· · ·</p>';
      return `<p>${t}</p>`;
    }).join('');
    return { html, notes };
  }

  /** Mục lục: gộp các chương liên tiếp cùng "arc" (tên bỏ phần "(n)" ở cuối); nếu không gộp được thì để danh sách phẳng. */
  function tocHtml(s, current) {
    const item = c => `<li><a href="${link({ p: 'read', id: s.id, n: c.n })}" class="${c.n === current ? 'current' : ''}"><span class="n">Chương ${c.n}</span><span>${esc(c.title)}</span></a></li>`;
    const groups = [];
    s.chapters.forEach(c => {
      const arc = c.title.replace(/\s*\([^)]*\)$/, '');
      if (!groups.length || groups[groups.length - 1].arc !== arc) groups.push({ arc, items: [] });
      groups[groups.length - 1].items.push(c);
    });
    if (groups.length > s.chapters.length / 2) return `<div class="flat"><ol>${s.chapters.map(item).join('')}</ol></div>`;
    return groups.map(g => `
      <details ${g.items.some(c => c.n === current) ? 'open' : ''}>
        <summary>${esc(g.arc)}<span class="count">Ch. ${g.items[0].n}–${g.items[g.items.length - 1].n}</span></summary>
        <ol>${g.items.map(item).join('')}</ol>
      </details>`).join('');
  }

  /* ============ các trang ============ */
  async function viewHome() {
    const d = await lib();
    const latest = d.stories.slice().sort(sorters.updated);
    const hist = Object.values(getHistory()).filter(h => h.n != null && d.byId.has(h.id)).sort((a, b) => b.at - a.at).slice(0, 4);
    const top = latest[0];
    const feature = top ? `
      <a class="feature" href="${link({ p: 'story', id: top.id })}">
        ${cover(top, 'lg')}
        <div>
          <div class="eyebrow">Mới cập nhật · ${num(top.chapterCount)} chương</div>
          <h2>${titleHtml(top.title)}</h2>
          <p class="byline">${esc(top.author)}</p>
          <div class="blurb">${paras(top.description)}</div>
        </div>
      </a>` : '';
    return {
      title: SITE_NAME,
      html: `
      <div class="wrap">
        ${hist.length ? section('Đọc tiếp', `<div class="continue">${hist.map(h => `
          <a class="cont" href="${link({ p: 'read', id: h.id, n: h.n, resume: 1 })}">
            ${cover(h, 'sm')}
            <span style="flex:1;min-width:0"><span class="t">${esc(h.title)}</span>
              <span class="muted small">Chương ${h.n}${h.chapTitle ? ' · ' + esc(h.chapTitle) : ''}</span>
              ${h.total ? `<div class="progress"><i style="width:${Math.round(100 * h.index / h.total)}%"></i></div>` : ''}</span>
          </a>`).join('')}</div>`) : ''}
        ${feature}
        ${section('Tủ truyện', latest.length ? grid(latest.slice(0, 24)) : empty('Chưa có truyện nào — hãy thêm file vào thư mục truyen/.'), latest.length > 24 ? link({ p: 'list' }) : '')}
      </div>`,
    };
  }

  async function viewList(p) {
    const d = await lib();
    const opts = { cat: p.cat || '', q: p.q || '', status: p.status || '', sort: p.sort || 'updated' };
    let items = d.stories;
    let title = 'Tất cả truyện';
    if (opts.cat) {
      const cat = d.categories.find(c => c.slug === opts.cat);
      if (!cat) throw new Error('Không tìm thấy thể loại');
      title = cat.name;
      items = items.filter(s => s.categories.includes(cat.slug));
    }
    if (opts.q) {
      const q = fold(opts.q);
      title = `Kết quả tìm kiếm: "${opts.q}"`;
      items = items.filter(s => fold(s.title + ' ' + s.author).includes(q));
    }
    if (opts.status) items = items.filter(s => s.status === opts.status);
    items = items.slice().sort(sorters[opts.sort] || sorters.updated);
    const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const page = Math.min(Math.max(1, Number(p.page) || 1), pages);
    const opt = (v, t, cur) => `<option value="${esc(v)}" ${v === cur ? 'selected' : ''}>${t}</option>`;
    return {
      title: title + ' · ' + SITE_NAME,
      html: `
      <div class="wrap">
        <div class="page-head">
          <div class="eyebrow">${opts.q ? 'Tìm kiếm' : 'Thể loại'} · ${num(items.length)} truyện</div>
          <h1>${esc(title)}</h1>
        </div>
        <div class="filters">
          <select data-filter="status" aria-label="Trạng thái">
            ${opt('', 'Mọi trạng thái', opts.status)}${opt('Đang ra', 'Đang ra', opts.status)}${opt(STATUS_DONE, 'Hoàn thành', opts.status)}
          </select>
          <select data-filter="sort" aria-label="Sắp xếp">
            ${opt('updated', 'Mới cập nhật', opts.sort)}${opt('chapters', 'Nhiều chương', opts.sort)}${opt('name', 'Tên A–Z', opts.sort)}
          </select>
        </div>
        ${items.length ? grid(items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)) : empty('Không tìm thấy truyện phù hợp.')}
        ${pager(page, pages, Object.assign({ p: 'list' }, opts))}
      </div>`,
    };
  }

  async function viewStory(p) {
    const d = await lib();
    const s = await getStory(p.id);
    const h = getHistory()[s.id];
    const cats = s.categories.map(slug => d.categories.find(c => c.slug === slug)).filter(Boolean);
    const first = s.chapters[0];
    const last = s.chapters[s.chapters.length - 1];
    const read = (n, extra) => link(Object.assign({ p: 'read', id: s.id, n }, extra));
    const related = d.stories.filter(o => o.id !== s.id && o.categories.some(c => s.categories.includes(c))).slice(0, 6);
    return {
      title: s.title + ' · ' + SITE_NAME,
      html: `
      <div class="wrap">
        <nav class="crumbs"><a href="?">Trang chủ</a> /
          ${cats[0] ? `<a href="${link({ p: 'list', cat: cats[0].slug })}">${esc(cats[0].name)}</a> /` : ''}
          ${esc(s.title)}</nav>
        <header class="book">
          ${cover(s, 'lg')}
          <div>
            <div class="eyebrow">${cats.map(c => esc(c.name)).concat(esc(s.status)).join(' · ')}</div>
            <h1>${titleHtml(s.title)}</h1>
            <p class="byline">${[s.original && 'Nguyên tác: ' + esc(s.original), s.author && 'Tác giả: ' + esc(s.author)].filter(Boolean).join(' · ')}</p>
            <div class="stats"><span><b>${num(s.chapterCount)}</b> chương</span><span>Cập nhật ${esc(ago(s.updated))}</span></div>
            <div class="blurb">${paras(s.description)}</div>
            <div class="actions">
              ${h && h.n != null ? `<a class="btn primary" href="${read(h.n, { resume: 1 })}">Đọc tiếp · Chương ${h.n}</a>` : ''}
              ${first ? `<a class="btn ${h ? '' : 'primary'}" href="${read(first.n)}">Đọc từ đầu</a>` : '<span class="muted">Truyện chưa có chương nào.</span>'}
              ${last && last !== first ? `<a class="btn" href="${read(last.n)}">Chương mới nhất · ${last.n}</a>` : ''}
            </div>
          </div>
        </header>
        ${s.chapters.length ? `
        <section class="toc">
          <div class="toc-head"><h2>Mục lục</h2><input class="input" type="search" id="chapFilter" placeholder="Tìm chương…" aria-label="Tìm chương"></div>
          <div id="tocBody">${tocHtml(s, h && h.n)}</div>
        </section>` : ''}
        ${related.length ? `<div style="margin-top:3rem">${section('Cùng thể loại', grid(related))}</div>` : ''}
      </div>`,
    };
  }

  const fontSize = () => store.get('fontSize', 1.125);

  async function viewRead(p) {
    const s = await getStory(p.id);
    const n = Number(p.n);
    const i = s.chapters.findIndex(c => c.n === n);
    if (i < 0) throw new Error('Không tìm thấy chương ' + p.n);
    const c = await getChapter(s.id, n);
    const prev = i > 0 ? s.chapters[i - 1].n : null;
    const next = i < s.chapters.length - 1 ? s.chapters[i + 1].n : null;
    if (next != null) getChapter(s.id, next).catch(() => {}); // tải trước chương sau

    const prevPos = getHistory()[s.id];
    saveHistory(s.id, { id: s.id, title: s.title, author: s.author, n, chapTitle: c.title, index: i + 1, total: s.chapters.length, r: 0 });
    const body = chapterHtml(c.content);
    state.reader = { id: s.id, prev, next, notes: body.notes, resume: p.resume && prevPos && prevPos.n === n ? prevPos.r : 0 };

    const go = (to, txt) => to == null ? `<span class="btn disabled">${txt}</span>` : `<a class="btn" href="${link({ p: 'read', id: s.id, n: to })}">${txt}</a>`;
    return {
      title: `Chương ${n} · ${s.title}`,
      html: `
      <div class="r-top"><div class="inner">
        <a class="btn" href="${link({ p: 'story', id: s.id })}" aria-label="Về trang truyện">←</a>
        <span class="label">${esc(s.title)}</span>
        <button type="button" data-fs="-1" aria-label="Chữ nhỏ hơn">A−</button>
        <button type="button" data-fs="1" aria-label="Chữ to hơn">A+</button>
        <button type="button" data-theme-toggle aria-label="Đổi sáng/tối">◐</button>
      </div></div>
      <div class="narrow r-body" style="--size:${fontSize()}rem" id="rbody">
        <p class="ch-num">Chương ${n} · ${i + 1}/${s.chapters.length}</p>
        <h2 class="ch-title">${esc(c.title || 'Chương ' + n)}</h2>
        <div class="text">${body.html || '<p class="muted">Chương này chưa có nội dung.</p>'}</div>
        <div class="end-nav">${go(prev, '← Chương trước')}${go(next, 'Chương sau →')}</div>
      </div>
      <nav class="r-bottom" aria-label="Chuyển chương"><div class="inner">
        ${go(prev, '← Trước')}
        <select class="chap-select" aria-label="Chọn chương">${s.chapters.map(x =>
          `<option value="${x.n}" ${x.n === n ? 'selected' : ''}>Chương ${x.n}${x.title ? ' · ' + esc(x.title) : ''}</option>`).join('')}</select>
        ${go(next, 'Sau →')}
      </div></nav>`,
    };
  }

  /* ============ chú thích bật lên ============ */
  const fnpop = document.createElement('div');
  fnpop.className = 'fnpop';
  fnpop.hidden = true;
  fnpop.setAttribute('role', 'note');
  document.body.appendChild(fnpop);
  let fnBtn = null;
  function hideFn() {
    fnpop.hidden = true;
    if (fnBtn) fnBtn.setAttribute('aria-expanded', 'false');
    fnBtn = null;
  }
  function showFn(btn) {
    if (fnBtn === btn) return hideFn();
    hideFn();
    fnBtn = btn;
    btn.setAttribute('aria-expanded', 'true');
    fnpop.innerHTML = state.reader ? state.reader.notes[+btn.dataset.i] || '' : '';
    fnpop.hidden = false;
    const r = btn.getBoundingClientRect(), w = fnpop.offsetWidth, h = fnpop.offsetHeight;
    const vw = document.documentElement.clientWidth;
    const left = Math.min(Math.max(16, r.left + r.width / 2 - w / 2), vw - w - 16);
    let top = r.bottom + 8;
    if (top + h > window.innerHeight - 8 && r.top - h - 8 > 8) top = r.top - h - 8;
    fnpop.style.left = (left + window.scrollX) + 'px';
    fnpop.style.top = (top + window.scrollY) + 'px';
  }

  /* ============ điều hướng ============ */
  let token = 0;
  async function render() {
    const my = ++token;
    const p = Object.fromEntries(new URLSearchParams(location.search));
    state.params = p;
    state.reader = null;
    hideFn();
    renderNav();
    const reading = p.p === 'read' && p.id;
    document.body.classList.toggle('reading', !!reading);
    app.innerHTML = '<div class="loading"><div class="spinner" aria-label="Đang tải"></div></div>';
    window.scrollTo(0, 0);
    try {
      const view = p.p === 'list' ? await viewList(p)
        : p.p === 'story' && p.id ? await viewStory(p)
        : reading ? await viewRead(p)
        : await viewHome();
      if (my !== token) return;
      app.innerHTML = view.html;
      document.title = view.title;
      if (p.p === 'story') {
        const f = document.getElementById('chapFilter');
        if (f) f.addEventListener('input', () => {
          const q = fold(f.value.trim());
          document.querySelectorAll('#tocBody li').forEach(li => { li.hidden = q && !fold(li.textContent).includes(q); });
          if (q) document.querySelectorAll('#tocBody details').forEach(d => { d.open = true; });
        });
      }
      if (reading && state.reader.resume) {
        const r = state.reader.resume;
        const toPos = () => window.scrollTo(0, r * Math.max(0, document.documentElement.scrollHeight - window.innerHeight));
        toPos();
        setTimeout(toPos, 200);
      }
    } catch (err) {
      if (my !== token) return;
      document.body.classList.remove('reading');
      app.innerHTML = `<div class="error"><h2>Có lỗi xảy ra</h2><p class="muted">${esc(err && err.message || err)}</p><a class="btn" href="?">Về trang chủ</a></div>`;
    }
  }

  function navigate(params) {
    history.pushState(null, '', link(params));
    render();
  }
  window.addEventListener('popstate', render);

  // lưu vị trí đang đọc (tỉ lệ cuộn) để "Đọc tiếp" mở đúng chỗ
  let saveT = 0;
  window.addEventListener('scroll', () => {
    if (!state.reader) return;
    clearTimeout(saveT);
    const id = state.reader.id;
    saveT = setTimeout(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (state.reader && state.reader.id === id && max > 0) saveHistory(id, { r: +(window.scrollY / max).toFixed(4) });
    }, 400);
  }, { passive: true });
  window.addEventListener('resize', hideFn);

  document.addEventListener('click', e => {
    const fn = e.target.closest('.fn');
    if (fn) { e.preventDefault(); return showFn(fn); }
    if (!e.target.closest('.fnpop')) hideFn();

    const a = e.target.closest('a[href^="?"]');
    if (a && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      return navigate(Object.fromEntries(new URLSearchParams(a.getAttribute('href').slice(1))));
    }
    const fs = e.target.closest('[data-fs]');
    if (fs) {
      const size = Math.min(1.75, Math.max(.875, fontSize() + Number(fs.dataset.fs) * .0625));
      store.set('fontSize', size);
      document.getElementById('rbody').style.setProperty('--size', size + 'rem');
    }
    if (e.target.closest('[data-theme-toggle]')) toggleTheme();
  });

  document.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('[data-filter]')) navigate(Object.assign({}, state.params, { p: 'list', [t.dataset.filter]: t.value, page: '' }));
    else if (t.matches('.chap-select') && state.reader) navigate({ p: 'read', id: state.reader.id, n: t.value });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hideFn();
    const r = state.reader;
    if (!r || e.altKey || e.ctrlKey || e.metaKey || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    const n = e.key === 'ArrowLeft' ? r.prev : e.key === 'ArrowRight' ? r.next : null;
    if (n != null) navigate({ p: 'read', id: r.id, n });
  });

  document.getElementById('searchForm').addEventListener('submit', e => {
    e.preventDefault();
    const q = e.target.q.value.trim();
    if (q) navigate({ p: 'list', q });
  });

  /* ============ sáng/tối: mặc định theo hệ thống, bấm ◐ để chọn ============ */
  const root = document.documentElement;
  function toggleTheme() {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    store.set('siteTheme', root.dataset.theme);
  }
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);

  // logo: "Truyện Hay" → Truyện <em>Hay</em>
  const logo = document.getElementById('logo');
  const words = logo.textContent.trim().split(' ');
  if (words.length > 1) logo.innerHTML = esc(words.slice(0, -1).join(' ')) + ' <em>' + esc(words[words.length - 1]) + '</em>';

  render();
})();
