/* 三年级上册闯关练习 · 主程序（无依赖，file:// 可直接运行） */
(function () {
  'use strict';

  var BANKS = window.__BANKS || [];
  var STORE_KEY = 'g3-players-v1';
  var LEGACY_KEY = 'g3-progress-v1';
  var TEST = window.location.search.indexOf('test=1') !== -1;
  var GATE = window.location.search.indexOf('gate=1') !== -1;
  var app = document.getElementById('app');
  var fx = document.getElementById('fx');

  var COLORS = {
    blue: { main: '#3f7dfb', deep: '#255fd6', soft: '#eaf0ff' },
    coral: { main: '#f26b5e', deep: '#cf493d', soft: '#fff0ed' },
    green: { main: '#27a97a', deep: '#17835b', soft: '#e9f9f2' }
  };

  var store = loadStore();
  if (TEST && !GATE && !store.current) {
    store.current = '测试玩家';
    store.players['测试玩家'] = store.players['测试玩家'] || { progress: blankProgress(), created: Date.now() };
    saveStore();
  }
  var progress = store.current ? store.players[store.current].progress : blankProgress();
  var state = { screen: store.current ? 'home' : 'players', subjectId: null, levelId: null };
  var session = null;
  var ticker = null;
  var toastTimer = null;
  var audioCtx = null;

  /* ---------------- 玩家与进度存取 ---------------- */
  function blankProgress() {
    return { levels: {}, recent: {}, wrong: [], sound: true };
  }

  function normalizeProgress(p) {
    p = p && typeof p === 'object' ? p : blankProgress();
    p.levels = p.levels || {};
    p.recent = p.recent || {};
    p.wrong = p.wrong || [];
    if (p.sound === undefined) p.sound = true;
    return p;
  }

  function loadStore() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.players && typeof s.players === 'object') {
          Object.keys(s.players).forEach(function (n) {
            s.players[n].progress = normalizeProgress(s.players[n].progress);
          });
          return s;
        }
      }
      // 旧版单人进度自动归到“我”名下
      var legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        var lp = JSON.parse(legacy);
        return { current: '我', players: { '我': { progress: normalizeProgress(lp), created: Date.now() } } };
      }
    } catch (e) { /* 无痕模式等情况下静默 */ }
    return { current: '', players: {} };
  }

  function saveStore() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* ignore */ }
  }

  function saveProgress() {
    if (!store.current) return;
    store.players[store.current].progress = progress;
    saveStore();
  }

  function playerName() { return store.current || '玩家'; }

  function soundOn() { return progress.sound !== false; }

  /* ---------------- 数据查询 ---------------- */
  function bankById(id) {
    for (var i = 0; i < BANKS.length; i++) if (BANKS[i].id === id) return BANKS[i];
    return null;
  }

  function levelById(subject, id) {
    for (var i = 0; i < subject.levels.length; i++) if (subject.levels[i].id === id) return subject.levels[i];
    return null;
  }

  function levelIndex(subject, id) {
    for (var i = 0; i < subject.levels.length; i++) if (subject.levels[i].id === id) return i;
    return -1;
  }

  function locked() { return false; }

  function subjectStats(subject) {
    var done = 0, stars = 0;
    subject.levels.forEach(function (l) {
      var rec = progress.levels[l.id];
      if (rec) { done++; stars += rec.best || 0; }
    });
    return { done: done, stars: stars, count: subject.levels.length, max: subject.levels.length * 30 };
  }

  function overallStats() {
    var done = 0, stars = 0, count = 0, max = 0;
    BANKS.forEach(function (s) {
      var st = subjectStats(s);
      done += st.done; stars += st.stars; count += st.count; max += st.max;
    });
    return { done: done, stars: stars, count: count, max: max };
  }

  /* ---------------- 工具 ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // 题干关键词统一加下划线加粗，帮助孩子抓住答题方向
  var KW = ['最接近', '不正确', '说明什么', '相反', '相同', '大约', '至少', '最多', '最少', '分别', '主要', '为什么', '怎么样', '怎样', '哪一句', '哪个', '哪些', '什么时候', '在哪里', '多少', '是不是', '能不能', '应该', '一定', '可能', '正确', '错误', '谁'];
  KW.sort(function (a, b) { return b.length - a.length; });
  var KW_RE = new RegExp('(' + KW.join('|') + ')', 'g');

  function markKeywords(html) {
    return String(html == null ? '' : html).replace(KW_RE, '<u class="kw">$1</u>');
  }

  function pad2(n) { return n < 10 ? '0' + n : String(n); }

  function starHTML(n) {
    var out = '';
    for (var i = 0; i < 3; i++) out += '<span class="' + (i < n ? 'on' : 'off') + '">★</span>';
    return out;
  }

  function colorVars(subject) {
    var c = COLORS[subject.color] || COLORS.blue;
    return '--brand:' + c.main + ';--brand-deep:' + c.deep + ';--brand-soft:' + c.soft + ';';
  }

  // 填空判分：忽略空格、常见标点，全角数字转半角，英文不区分大小写
  function normalizeAnswer(s) {
    return String(s == null ? '' : s)
      .trim()
      .toLowerCase()
      .replace(/[\uFF10-\uFF19]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
      .replace(/[／]/g, '/')
      .replace(/[\s，,。.．、；;：:！!？?（）()【】\[\]“”"'‘’]/g, '');
  }

  function limitsOf(q) {
    var base = session.level;
    return { fast: q.fast || base.fast, ok: q.ok || base.ok };
  }

  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }

  function scrollTop() {
    try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
  }

  /* ---------------- 出题 ---------------- */
  function prepareQuestion(q) {
    if (!q || typeof q.q !== 'string') return null;
    var kind = q.kind || 'choice';
    if (kind === 'choice') {
      if (!Array.isArray(q.options) || q.options.length < 2) return null;
      if (!(q.answer >= 0 && q.answer < q.options.length)) return null;
    } else if (kind === 'judge') {
      if (typeof q.answer !== 'boolean') return null;
    } else {
      if (!Array.isArray(q.answers) || !q.answers.length) return null;
    }
    var answerKey = kind === 'fill'
      ? String(q.answers[0])
      : kind === 'judge'
        ? (q.answer ? '对' : '错')
        : String(q.options[q.answer]);
    return Object.assign({}, q, {
      kind: kind,
      key: q.q + '||' + answerKey,
      tip: q.tip || ''
    });
  }

  function generateQuestions(level, n, seen, typeFilter) {
    var out = [];
    var guard = 0;
    var maxTries = Math.max(400, n * 80);
    var roundFamilies = {};
    function passes(q) {
      return !typeFilter || (q.paperType || level.paperType) === typeFilter;
    }
    while (out.length < n && guard < maxTries) {
      guard++;
      var q = null;
      try { q = level.make(); } catch (e) { q = null; }
      var prepared = prepareQuestion(q);
      if (!prepared || !passes(prepared) || seen.has(prepared.key)) continue;
      if (prepared.family && roundFamilies[prepared.family]) continue;
      seen.add(prepared.key);
      if (prepared.family) roundFamilies[prepared.family] = 1;
      out.push(prepared);
    }
    // 极端情况下（题库池太小）允许放宽同一组去重，保证流程能走完
    var extraGuard = 0;
    while (out.length < n && extraGuard < 400) {
      extraGuard++;
      var q2 = null;
      try { q2 = level.make(); } catch (e2) { q2 = null; }
      var prepared2 = prepareQuestion(q2);
      if (prepared2 && passes(prepared2) && !seen.has(prepared2.key)) {
        seen.add(prepared2.key);
        out.push(prepared2);
      }
    }
    // 最后兜底：历史题几乎覆盖整个题库时，允许重复历史题，但同一组内仍不重复
    var roundKeys = {};
    out.forEach(function (x) { roundKeys[x.key] = 1; });
    var lastGuard = 0;
    while (out.length < n && lastGuard < 400) {
      lastGuard++;
      var q3 = null;
      try { q3 = level.make(); } catch (e3) { q3 = null; }
      var prepared3 = prepareQuestion(q3);
      if (prepared3 && passes(prepared3) && !roundKeys[prepared3.key]) {
        roundKeys[prepared3.key] = 1;
        out.push(prepared3);
      }
    }
    return out;
  }

  function recentLimit(subject) {
    return subject.id === 'math' ? 60 : 20;
  }

  function seedRecent(subject, level, seen) {
    var arr = progress.recent[level.id] || [];
    var start = Math.max(0, arr.length - recentLimit(subject));
    for (var i = start; i < arr.length; i++) seen.add(arr[i]);
  }

  function rememberQuestions(subject, level, questions) {
    var arr = progress.recent[level.id] || [];
    questions.forEach(function (q) {
      if (arr.indexOf(q.key) === -1) arr.push(q.key);
    });
    var limit = recentLimit(subject);
    if (arr.length > limit) arr = arr.slice(arr.length - limit);
    progress.recent[level.id] = arr;
    saveProgress();
  }

  /* ---------------- 渲染：首页 ---------------- */
  function renderHome() {
    var all = overallStats();
    var cards = BANKS.map(function (s) {
      var st = subjectStats(s);
      var pct = Math.round(st.done / st.count * 100);
      return '<button class="subject-card" data-act="subject" data-subject="' + s.id + '" style="' + colorVars(s) + '">' +
        '<span class="sc-emoji">' + s.emoji + '</span>' +
        '<span class="sc-body">' +
          '<strong>' + esc(s.name) + '</strong>' +
          '<small>' + esc(s.desc) + '</small>' +
          '<span class="sc-progress"><span class="bar"><i style="width:' + pct + '%"></i></span><em>' + st.done + '/' + st.count + ' 关</em></span>' +
        '</span>' +
        '<span class="sc-stars"><b>⭐ ' + st.stars + '</b><em>/ ' + st.max + '</em></span>' +
      '</button>';
    }).join('');

    app.innerHTML =
      '<div class="page home">' +
        '<header class="hero">' +
          '<div class="hero-top">' +
            '<span class="pill">三年级上册</span>' +
            '<button class="player-chip" data-act="players">👤 ' + esc(playerName()) + '</button>' +
            '<button class="icon-btn" data-act="sound" aria-label="声音开关">' + (soundOn() ? '🔊' : '🔇') + '</button>' +
          '</div>' +
          '<h1 class="hero-title">闯关练习</h1>' +
          '<p class="hero-sub">语文 · 数学 · 英语，一关一个知识点</p>' +
          '<div class="hero-stats">' +
            '<div class="stat"><b>' + all.done + '<span class="stat-sub">/' + all.count + '</span></b><span>已通关</span></div>' +
            '<div class="stat"><b>⭐ ' + all.stars + '</b><span>获得星星</span></div>' +
          '</div>' +
        '</header>' +
        '<main class="subject-grid">' + cards + '</main>' +
        '<div class="play-entry"><button class="btn ghost" data-act="playground">🎲 试玩入口 · 按题型自由练习</button></div>' +
        '<footer class="foot">' +
          '<p>双击 index.html 即可玩，<b>' + esc(playerName()) + '</b> 的进度自动保存在本机</p>' +
          '<button class="link-btn" data-act="players">切换玩家</button>' +
          '<button class="link-btn" data-act="reset">清空进度</button>' +
        '</footer>' +
      '</div>';
  }

  /* ---------------- 渲染：选择玩家 ---------------- */
  function renderPlayers() {
    var names = Object.keys(store.players);
    var list = names.map(function (n) {
      var p = store.players[n].progress;
      var done = 0, stars = 0;
      BANKS.forEach(function (b) {
        b.levels.forEach(function (l) {
          var r = p.levels[l.id];
          if (r) { done++; stars += r.best || 0; }
        });
      });
      return '<button class="player-row' + (n === store.current ? ' current' : '') + '" data-act="pick-player" data-name="' + esc(n) + '">' +
        '<span class="pr-avatar">' + esc(n.charAt(0)) + '</span>' +
        '<span class="pr-main"><strong>' + esc(n) + '</strong>' +
          '<small>' + done + ' 关 · ⭐ ' + stars + ' · 错题 ' + (p.wrong || []).length + '</small></span>' +
        '<span class="pr-go">' + (n === store.current ? '继续' : '进入') + '</span>' +
      '</button>';
    }).join('');

    app.innerHTML =
      '<div class="page players">' +
        '<header class="hero player-hero">' +
          '<span class="pill">三年级上册</span>' +
          '<h1 class="hero-title">谁来闯关？</h1>' +
          '<p class="hero-sub">输入名字后，星星、通关和错题都按名字分别保存</p>' +
        '</header>' +
        '<section class="panel player-panel">' +
          '<label class="player-label" for="player-name">输入名字</label>' +
          '<input id="player-name" class="player-input" maxlength="8" placeholder="例如：小明" autocomplete="off">' +
          '<button class="btn primary" data-act="enter-player">开始闯关</button>' +
          (names.length ? '<div class="player-list-title">本机玩家</div><div class="player-list">' + list + '</div>' : '') +
        '</section>' +
      '</div>';

    var input = document.getElementById('player-name');
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') enterPlayer(input.value);
      });
      if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) input.focus();
    }
    scrollTop();
  }

  function enterPlayer(name) {
    name = String(name == null ? '' : name).trim().slice(0, 8);
    if (!name) { toast('先输入或选一个名字'); return; }
    if (!store.players[name]) {
      store.players[name] = { progress: blankProgress(), created: Date.now() };
    }
    store.current = name;
    progress = normalizeProgress(store.players[name].progress);
    store.players[name].progress = progress;
    saveStore();
    session = null;
    state.subjectId = null;
    state.levelId = null;
    state.screen = 'home';
    render();
  }

  /* ---------------- 渲染：学科关卡 ---------------- */
  function renderSubject() {
    var subject = bankById(state.subjectId);
    if (!subject) return goHome();
    var st = subjectStats(subject);
    var nextIdx = -1;
    for (var ni = 0; ni < subject.levels.length; ni++) {
      if (!progress.levels[subject.levels[ni].id]) { nextIdx = ni; break; }
    }
    var items = subject.levels.map(function (l, i) {
      var rec = progress.levels[l.id];
      var best = rec ? (rec.best || 0) : 0;
      var cls = 'level-card map-node ' + (i % 2 === 0 ? 'left' : 'right') +
        (rec ? ' done' : '') + (i === nextIdx ? ' next' : '');
      return '<button class="' + cls + '" data-act="level" data-level="' + l.id + '">' +
        '<span class="map-connector"><i></i></span>' +
        '<span class="node-dot">' + (rec ? '✓' : pad2(i + 1)) + '</span>' +
        '<span class="node-card">' +
          '<span class="node-unit">' + esc(l.unit) + ' · 第 ' + (i + 1) + ' 关</span>' +
          '<strong>' + esc(l.emoji) + ' ' + esc(l.title) + '</strong>' +
          '<small>' + esc(l.goal) + '</small>' +
          '<span class="node-stars">' +
            (rec ? starHTML(best) + '<em>⭐ ' + best + '</em>' : '<em class="go">点击进入</em>') +
          '</span>' +
        '</span>' +
      '</button>';
    }).join('');
    var pct = st.count ? Math.round(st.done / st.count * 100) : 0;
    var allDone = st.done === st.count;

    app.innerHTML =
      '<div class="page subject" style="' + colorVars(subject) + '">' +
        '<header class="topbar">' +
          '<button class="back-btn" data-act="home">← 首页</button>' +
          '<button class="player-chip" data-act="players">👤 ' + esc(playerName()) + '</button>' +
          '<button class="icon-btn" data-act="sound" aria-label="声音开关">' + (soundOn() ? '🔊' : '🔇') + '</button>' +
        '</header>' +
        '<section class="subject-hero">' +
          '<span class="sh-emoji">' + subject.emoji + '</span>' +
          '<div class="sh-text"><h1>' + esc(subject.name) + '</h1><p>' + esc(subject.desc) + '</p></div>' +
          '<div class="sh-stats"><b>⭐ ' + st.stars + '</b><span>' + st.done + '/' + st.count + ' 关 · 满分 ' + st.max + ' 星</span></div>' +
        '</section>' +
        (allDone ? '<button class="reward-banner" data-act="reward">🏆 本科目已全部通关 · 点这里领取学科奖励</button>' : '') +
        '<section class="level-map">' +
          '<div class="map-spine"><i style="height:' + pct + '%"></i></div>' +
          items +
        '</section>' +
        '<p class="subject-foot">全部关卡已解锁，点任意关卡就能闯；走过的关卡会留下星星痕迹</p>' +
      '</div>';
  }

  /* ---------------- 渲染：学科通关奖励 ---------------- */
  function renderReward() {
    var subject = bankById(state.subjectId);
    if (!subject) return goHome();
    var st = subjectStats(subject);
    var rows = subject.levels.map(function (l) {
      var rec = progress.levels[l.id];
      return '<div class="reward-row">' +
        '<span class="rr-name">' + esc(l.emoji) + ' ' + esc(l.title) + '</span>' +
        '<span class="rr-stars">' + starHTML(rec ? (rec.best || 0) : 0) + '</span>' +
      '</div>';
    }).join('');

    app.innerHTML =
      '<div class="page reward" style="' + colorVars(subject) + '">' +
        '<div class="reward-inner">' +
          '<span class="reward-trophy">🏆</span>' +
          '<p class="settle-kicker">' + esc(playerName()) + ' · 学科通关</p>' +
          '<h1>' + subject.emoji + ' ' + esc(subject.name) + ' 全部通关！</h1>' +
          '<div class="reward-score"><b>' + st.stars + '</b><span>/ ' + st.max + ' 星</span></div>' +
          '<div class="reward-list">' + rows + '</div>' +
          '<div class="actions">' +
            '<button class="btn primary" data-act="subject" data-subject="' + subject.id + '">返回关卡地图</button>' +
            '<button class="btn ghost" data-act="home">回到首页</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    applause();
    confetti();
    scrollTop();
  }

  /* ---------------- 渲染：试玩入口 ---------------- */
  var TYPE_ORDER = ['口算', '竖式计算', '填空', '选择', '判断', '解决问题', '看拼音选字', '选择正确读音', '词语积累', '词语搭配', '古诗填空', '句子仿写', '标点符号', '课内阅读', '字母书写', '看图选词', '单项选择', '情景交际'];
  var typeCache = {};

  function levelTypes(level) {
    if (typeCache[level.id]) return typeCache[level.id];
    var seen = {};
    var list = [];
    for (var i = 0; i < 120; i++) {
      var q = null;
      try { q = level.make(); } catch (e) { q = null; }
      var t = q && (q.paperType || level.paperType);
      if (t && !seen[t]) { seen[t] = 1; list.push(t); }
    }
    list.sort(function (a, b) {
      var ia = TYPE_ORDER.indexOf(a);
      var ib = TYPE_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    typeCache[level.id] = list;
    return list;
  }

  function renderPlayground() {
    var sections = BANKS.map(function (subject) {
      var levels = subject.levels.map(function (l, i) {
        var chips = levelTypes(l).map(function (t) {
          return '<button class="pg-chip" data-act="play" data-level="' + l.id + '" data-type="' + esc(t) + '">' + esc(t) + '</button>';
        }).join('');
        return '<article class="pg-level">' +
          '<div class="pg-head">' +
            '<div class="pg-title">' +
              '<span class="pg-no">' + pad2(i + 1) + '</span>' +
              '<span class="pg-text"><span class="lv-unit">' + esc(l.unit) + '</span>' +
                '<strong>' + l.emoji + ' ' + esc(l.title) + '</strong>' +
                '<small>' + esc(l.goal) + '</small></span>' +
            '</div>' +
            '<button class="pg-all" data-act="play" data-level="' + l.id + '" data-type="">整关随机</button>' +
          '</div>' +
          '<div class="pg-chips">' + chips + '</div>' +
        '</article>';
      }).join('');
      return '<section class="pg-subject" style="' + colorVars(subject) + '">' +
        '<h2>' + subject.emoji + ' ' + esc(subject.name) + '<small>' + subject.levels.length + ' 关</small></h2>' +
        levels +
      '</section>';
    }).join('');

    app.innerHTML =
      '<div class="page playground">' +
        '<header class="topbar">' +
          '<button class="back-btn" data-act="home">← 首页</button>' +
          '<button class="icon-btn" data-act="sound" aria-label="声音开关">' + (soundOn() ? '🔊' : '🔇') + '</button>' +
        '</header>' +
        '<section class="pg-hero">' +
          '<h1>试玩入口</h1>' +
          '<p>三科 20 关全部解锁。点“整关随机”开一局，或点任意题型只练这一种；做完可以继续换新题。</p>' +
        '</section>' +
        sections +
        '<div class="actions"><button class="btn ghost" data-act="home">返回首页</button></div>' +
      '</div>';
    scrollTop();
  }

  /* ---------------- 渲染：知识点 ---------------- */
  function renderConcept() {
    var subject = bankById(state.subjectId);
    if (!subject) return goHome();
    var level = levelById(subject, state.levelId);
    var idx = levelIndex(subject, state.levelId);
    if (!level) return goHome();
    var points = level.concept.points.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('');

    app.innerHTML =
      '<div class="page concept" style="' + colorVars(subject) + '">' +
        '<header class="topbar">' +
          '<button class="back-btn" data-act="subject">← ' + esc(subject.name) + '</button>' +
          '<button class="icon-btn" data-act="sound" aria-label="声音开关">' + (soundOn() ? '🔊' : '🔇') + '</button>' +
        '</header>' +
        '<section class="concept-head">' +
          '<span class="pill pill-brand">第 ' + (idx + 1) + ' 关 · ' + esc(level.unit) + '</span>' +
          '<h1>' + level.emoji + ' ' + esc(level.title) + '</h1>' +
          '<p>' + esc(level.goal) + '</p>' +
          '<p class="concept-type">本关题型：<b>' + esc(level.paperType || '综合练习') + '</b></p>' +
        '</section>' +
        '<div class="level-intro">' +
          '<span class="li-badge">GO</span>' +
          '<div class="li-text"><b>第 ' + (idx + 1) + ' 关 · 准备闯关</b>' +
            '<small>先看知识点，再开始答题；目标 ⭐⭐⭐ · 本轮记在 ' + esc(playerName()) + ' 名下</small></div>' +
        '</div>' +
        '<section class="panel">' +
          '<h2>先学一学</h2>' +
          '<ul class="points">' + points + '</ul>' +
          '<div class="example-box"><b>举个例子</b><p>' + esc(level.concept.example) + '</p></div>' +
        '</section>' +
        '<section class="panel star-panel">' +
          '<h2>星星怎么得</h2>' +
          '<div class="star-rule"><span class="stars">' + starHTML(3) + '</span><span>答对，且不超过 <b>' + level.fast + '</b> 秒</span></div>' +
          '<div class="star-rule"><span class="stars">' + starHTML(2) + '</span><span>答对，且不超过 <b>' + level.ok + '</b> 秒</span></div>' +
          '<div class="star-rule"><span class="stars">' + starHTML(1) + '</span><span>答对了，但超过 <b>' + level.ok + '</b> 秒</span></div>' +
          '<div class="star-rule"><span class="stars">' + starHTML(0) + '</span><span>答错，0 星</span></div>' +
          '<p class="muted">一组 10 题，做完立刻出逐题评测；答错的题会换同类型新题重做。不同题型时限不同，答题时以题目上方的本题标准为准。</p>' +
        '</section>' +
        '<div class="actions">' +
          '<button class="btn primary" data-act="start">开始练习 · 10 题</button>' +
          '<button class="btn ghost" data-act="subject">返回关卡</button>' +
        '</div>' +
      '</div>';
  }

  /* ---------------- 渲染：答题（试卷式） ---------------- */
  function optionsHTML(q) {
    return q.options.map(function (o, i) {
      return '<button class="option" data-opt="' + i + '" data-act="option">' +
        '<span class="opt-key">' + 'ABCD'[i] + '</span>' +
        '<span class="opt-text">' + esc(o) + '</span>' +
      '</button>';
    }).join('');
  }

  function verticalHTML(v) {
    return '<div class="vertical-calc" aria-hidden="true">' +
      '<div class="v-row">' + esc(v.top) + '</div>' +
      '<div class="v-row"><span class="v-op">' + esc(v.op) + '</span>' + esc(v.bottom) + '</div>' +
      '<div class="v-line"></div>' +
      '<div class="v-row v-result">？</div>' +
    '</div>';
  }

  function renderQuiz() {
    if (!session) return goHome();
    var subject = session.subject;
    var level = session.level;
    var q = session.questions[session.index];
    if (!q) return finishRound();
    var total = session.questions.length;
    var pct = Math.round(session.index / total * 100);
    var kind = q.kind || 'choice';
    var lim = limitsOf(q);
    var paperType = q.paperType || level.paperType || '练习';

    var extra = '';
    if (q.passage) extra += '<div class="passage"><b>课内阅读</b><p>' + esc(q.passage) + '</p></div>';
    if (q.pinyin) extra += '<div class="pinyin-box">' + esc(q.pinyin) + '</div>';
    if (q.svg) extra += '<div class="pic-box pic-svg">' + q.svg + '</div>';
    if (q.image) extra += '<div class="pic-box"><span class="pic-emoji">' + esc(q.image) + '</span></div>';
    if (q.color) extra += '<div class="pic-box"><span class="swatch" style="background:' + q.color + '"></span></div>';
    if (q.vertical) extra += verticalHTML(q.vertical);
    if (q.pattern) extra += '<div class="pattern-box">仿写结构：<b>' + esc(q.pattern) + '</b></div>';

    var body;
    if (kind === 'choice') {
      body = '<div class="options">' + optionsHTML(q) + '</div>';
    } else if (kind === 'judge') {
      body = '<div class="judge-row">' +
        '<button class="judge-btn" data-act="option" data-opt="0"><span>✓</span>对</button>' +
        '<button class="judge-btn" data-act="option" data-opt="1"><span>✗</span>错</button>' +
      '</div>';
    } else {
      body = '<div class="answer-row">' +
        '<input id="answer-input" class="answer-input" type="text" autocomplete="off" spellcheck="false" ' +
          'inputmode="' + (q.inputMode || 'text') + '" placeholder="' + esc(q.placeholder || '填写答案') + '" aria-label="答案">' +
        (q.unit ? '<span class="answer-unit">' + esc(q.unit) + '</span>' : '') +
        '<button class="btn primary submit-btn" data-act="submit">提交</button>' +
      '</div>';
    }

    app.innerHTML =
      '<div class="page quiz" style="' + colorVars(subject) + '">' +
        '<header class="quiz-top">' +
          '<button class="icon-btn" data-act="quit" aria-label="退出本关">✕</button>' +
          '<div class="q-progress"><span class="bar"><i style="width:' + pct + '%"></i></span><small>第 ' + (session.index + 1) + ' / ' + total + ' 题</small></div>' +
          '<div class="hud"><span class="timer" id="timer">0.0s</span><span class="pot" id="pot" title="现在答对可以得到的星星">' + starHTML(3) + '</span></div>' +
        '</header>' +
        '<main class="quiz-main">' +
          '<div class="round-tag">' + (session.round > 1 ? '补做第 ' + (session.round - 1) + ' 轮 · 已换新题' : '第 1 轮 · 首轮计星') + '</div>' +
          '<section class="paper">' +
            '<div class="paper-head"><span class="paper-type">' + esc(paperType) + '</span><span class="paper-no">第 ' + (session.index + 1) + ' 题</span></div>' +
            extra +
            '<h1 class="question">' + markKeywords(esc(q.q)) + '</h1>' +
            body +
            '<div id="feedback"></div>' +
          '</section>' +
          '<p class="quiz-note">' +
            (kind === 'choice' || kind === 'judge' ? '选完立刻判对错 · ' : '写完点“提交”或按回车 · ') +
            '本题 ≤' + lim.fast + ' 秒 3 星 · ≤' + lim.ok + ' 秒 2 星 · 答错 0 星' +
          '</p>' +
        '</main>' +
      '</div>';

    scrollTop();
    startTimer();

    // 仅在测试模式下暴露当前题，方便自动化验收；正常双击打开不会生效
    if (window.location.search.indexOf('test=1') !== -1) {
      window.__G3_CURRENT__ = { q: q, levelId: session.level.id, index: session.index };
      window.__G3_ROUND__ = {
        levelId: session.level.id,
        round: session.round,
        questions: session.questions
      };
    }

    var input = document.getElementById('answer-input');
    if (input && window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
      input.focus();
    }
    chime();
  }

  function startTimer() {
    clearInterval(ticker);
    if (!session) return;
    session.qStart = performance.now();
    session.locked = false;
    updateTimer();
    ticker = setInterval(updateTimer, 100);
  }

  function updateTimer() {
    if (!session) { clearInterval(ticker); return; }
    var el = document.getElementById('timer');
    if (!el) { clearInterval(ticker); return; }
    var sec = (performance.now() - session.qStart) / 1000;
    var lim = limitsOf(session.questions[session.index]);
    el.textContent = sec.toFixed(1) + 's';
    el.className = 'timer' + (sec > lim.ok ? ' slow' : sec > lim.fast ? ' mid' : '');
    var pot = document.getElementById('pot');
    if (pot) {
      var s = sec <= lim.fast ? 3 : sec <= lim.ok ? 2 : 1;
      pot.innerHTML = starHTML(s);
    }
  }

  function commit(choice, given, correct) {
    if (state.screen !== 'quiz' || !session || session.locked) return;
    var q = session.questions[session.index];
    if (!q) return;
    var lim = limitsOf(q);
    var elapsed = (performance.now() - session.qStart) / 1000;
    var stars = correct ? (elapsed <= lim.fast ? 3 : elapsed <= lim.ok ? 2 : 1) : 0;
    session.locked = true;
    clearInterval(ticker);
    var answer = {
      choice: choice,
      given: given,
      correct: correct,
      elapsed: elapsed,
      stars: stars,
      fast: lim.fast,
      ok: lim.ok
    };
    session.answers.push(answer);

    var all = document.querySelectorAll('.option, .judge-btn');
    for (var k = 0; k < all.length; k++) all[k].disabled = true;
    var input = document.getElementById('answer-input');
    if (input) { input.disabled = true; input.classList.add('locked'); }
    var submit = document.querySelector('.submit-btn');
    if (submit) submit.disabled = true;

    showFeedback(q, answer);
    var current = session;
    if (correct) {
      dingdong();
      setTimeout(function () { applause(); }, 280);
      var autoNext = window.location.search.indexOf('test=1') !== -1 ? 80 : 1400;
      setTimeout(function () {
        if (session !== current || state.screen !== 'quiz') return;
        advance();
      }, autoNext);
    } else {
      progress.wrong = progress.wrong || [];
      progress.wrong.unshift({
        subject: session.subject.id,
        level: session.level.id,
        q: q.q,
        answer: correctTextOf(q),
        tip: q.tip || '',
        at: Date.now()
      });
      if (progress.wrong.length > 300) progress.wrong.length = 300;
      saveProgress();
      failSound();
      var qIndex = session.index;
      setTimeout(function () {
        if (session !== current || state.screen !== 'quiz' || session.index !== qIndex) return;
        say('答错了。正确答案是' + correctTextOf(q) + '。');
      }, 500);
    }
  }

  function advance() {
    if (!session || state.screen !== 'quiz') return;
    session.index++;
    session.locked = false;
    if (session.index < session.questions.length) renderQuiz();
    else finishRound();
  }

  function decomposeHTML(q) {
    if (!q.decompose || !q.decompose.length) return '';
    var tags = q.decompose.map(function (d) {
      return '<span class="dc dc-' + esc(d.kind) + '"><i>' + esc(d.label) + '</i>' + esc(d.text) + '</span>';
    }).join('');
    return '<div class="fb-decompose"><b>' + esc(q.decomposeTitle || '句子结构') + '</b>' + tags + '</div>' +
      (q.explain ? '<p class="fb-why">' + esc(q.explain) + '</p>' : '');
  }

  function showFeedback(q, a) {
    var box = document.getElementById('feedback');
    if (!box) return;
    var kind = q.kind || 'choice';
    if (kind === 'choice' || kind === 'judge') {
      var rightIdx = kind === 'judge' ? (q.answer ? 0 : 1) : q.answer;
      var sel = kind === 'judge' ? '.judge-btn' : '.option';
      var nodes = document.querySelectorAll(sel);
      for (var i = 0; i < nodes.length; i++) {
        var idx = parseInt(nodes[i].getAttribute('data-opt'), 10);
        if (idx === rightIdx) nodes[i].classList.add('right');
        else if (!a.correct && idx === a.choice) nodes[i].classList.add('wrong');
      }
    }
    var dc = decomposeHTML(q);
    if (a.correct) {
      box.innerHTML = '<div class="feedback ok">' +
        '<div class="fb-head"><b>答对了！</b><span class="fb-stars">' + starHTML(a.stars) + '</span></div>' +
        '<p class="fb-line">用时 ' + a.elapsed.toFixed(1) + ' 秒，得 ' + a.stars + ' 星。</p>' +
        dc +
        (q.tip ? '<p class="fb-why">' + esc(q.tip) + '</p>' : '') +
      '</div>';
      return;
    }
    box.innerHTML = '<div class="feedback bad">' +
      '<div class="fb-head"><b>答错了</b><span class="fb-stars">' + starHTML(0) + '</span></div>' +
      '<p class="fb-line">你的作答：<em>' + esc(givenTextOf(q, a)) + '</em></p>' +
      '<p class="fb-line">正确答案：<b>' + esc(correctTextOf(q)) + '</b></p>' +
      dc +
      '<p class="fb-why">错在哪：' + esc(q.tip || '看清题目要求，再想一想。') + '</p>' +
      '<p class="fb-next">这道题会换成同知识点的新题，稍后重做。</p>' +
      '<button class="btn primary fb-btn" data-act="next-q">继续</button>' +
    '</div>';
  }

  function choose(i) {
    if (state.screen !== 'quiz' || !session || session.locked) return;
    var q = session.questions[session.index];
    if (!q) return;
    var kind = q.kind || 'choice';
    var btn = document.querySelector('[data-opt="' + i + '"]');
    if (btn) btn.classList.add('chosen');
    if (kind === 'judge') {
      if (i !== 0 && i !== 1) return;
      commit(i, i === 0 ? '对' : '错', (i === 0) === !!q.answer);
      return;
    }
    if (!q.options || i < 0 || i >= q.options.length) return;
    commit(i, null, i === q.answer);
  }

  function submitFill() {
    if (state.screen !== 'quiz' || !session || session.locked) return;
    var q = session.questions[session.index];
    var input = document.getElementById('answer-input');
    if (!q || !input) return;
    var val = input.value;
    if (!String(val).trim()) {
      toast('先写下答案，再提交');
      input.focus();
      return;
    }
    var accepted = (q.answers || []).concat(q.accept || []);
    var norm = normalizeAnswer(val);
    var ok = accepted.some(function (a) { return normalizeAnswer(a) === norm; });
    commit(null, String(val).trim(), ok);
  }

  function finishRound() {
    clearInterval(ticker);
    if (!session) return;
    var total = session.questions.length;
    var correct = 0, stars = 0;
    session.answers.forEach(function (a) { if (a.correct) correct++; stars += a.stars; });
    session.lastWrong = total - correct;
    session.roundStars = stars;
    if (session.round === 1) {
      session.firstStars = stars;
      session.firstCorrect = correct;
    }
    state.screen = 'review';
    render();
  }

  /* ---------------- 渲染：本轮评测 ---------------- */
  function whyText(a) {
    if (!a.correct) return '答错了，得 0 星。';
    var t = a.elapsed.toFixed(1);
    if (a.elapsed <= a.fast) return '答对，用时 ' + t + ' 秒（不超过 ' + a.fast + ' 秒），得 3 星。';
    if (a.elapsed <= a.ok) return '答对，用时 ' + t + ' 秒（超过 ' + a.fast + ' 秒、不超过 ' + a.ok + ' 秒），得 2 星。';
    return '答对，用时 ' + t + ' 秒（超过 ' + a.ok + ' 秒），得 1 星。';
  }

  function correctTextOf(q) {
    var kind = q.kind || 'choice';
    if (kind === 'judge') return q.answer ? '对' : '错';
    if (kind === 'fill') return q.displayAnswer || (q.answers && q.answers[0]) || '';
    return q.options[q.answer];
  }

  function givenTextOf(q, a) {
    if (a.given != null) return a.given;
    var kind = q.kind || 'choice';
    if (kind === 'judge') return a.choice === 0 ? '对' : '错';
    return q.options ? q.options[a.choice] : '';
  }

  function renderReview() {
    if (!session) return goHome();
    var subject = session.subject;
    var level = session.level;
    var total = session.questions.length;
    var correct = total - session.lastWrong;
    var wrong = session.lastWrong;
    var items = session.questions.map(function (q, i) {
      var a = session.answers[i];
      if (!a) return '';
      return '<article class="review-item ' + (a.correct ? 'ok' : 'bad') + '">' +
        '<div class="ri-top">' +
          '<span class="ri-idx">' + (i + 1) + '</span>' +
          '<span class="ri-state">' + (a.correct ? '答对' : '答错') + '</span>' +
          (q.paperType ? '<span class="ri-type">' + esc(q.paperType) + '</span>' : '') +
          '<span class="ri-stars">' + starHTML(a.stars) + '</span>' +
        '</div>' +
        '<p class="ri-q">' + (q.pinyin ? '<em class="ri-pinyin">' + esc(q.pinyin) + '</em> ' : '') + markKeywords(esc(q.q)) + '</p>' +
        '<div class="ri-ans">' +
          '<span class="chip ' + (a.correct ? 'good' : 'bad') + '">你的作答：' + esc(givenTextOf(q, a)) + '</span>' +
          (a.correct ? '' : '<span class="chip good">正确答案：' + esc(correctTextOf(q)) + '</span>') +
        '</div>' +
        '<p class="ri-why">' + whyText(a) + '</p>' +
        '<p class="ri-tip">💡 ' + esc(q.tip) + '</p>' +
      '</article>';
    }).join('');

    var actions;
    if (wrong > 0) {
      actions = '<button class="btn primary" data-act="retry">重做错题（' + wrong + ' 题 · 已换新题）</button>' +
        '<button class="btn ghost" data-act="back-subject">暂时离开</button>';
    } else {
      actions = '<button class="btn primary" data-act="settle">查看通关结算</button>' +
        '<button class="btn ghost" data-act="back-subject">返回关卡</button>';
    }

    app.innerHTML =
      '<div class="page review" style="' + colorVars(subject) + '">' +
        '<header class="topbar">' +
          '<button class="back-btn" data-act="back-subject">← 关卡</button>' +
          '<button class="icon-btn" data-act="sound" aria-label="声音开关">' + (soundOn() ? '🔊' : '🔇') + '</button>' +
        '</header>' +
        '<section class="review-head">' +
          '<div class="score-ring"><b>' + correct + '</b><span>/ ' + total + ' 题</span></div>' +
          '<h1>' + (wrong === 0 ? '本轮全部答对！' : '本轮评测') + '</h1>' +
          '<p class="review-player">👤 ' + esc(playerName()) + ' 的逐题评测</p>' +
          '<p>本轮获得 ' + session.roundStars + ' 星' + (session.round > 1 ? '（补做，不计入总分）' : '（计入本关总分）') + '</p>' +
        '</section>' +
        (wrong > 0
          ? '<div class="notice">做错的 ' + wrong + ' 道题，要换同知识点的新题重做，直到全部答对。已经答对的原题不会再出现。</div>'
          : '<div class="notice good">' + (session.round > 1 ? '错题已经全部补对，可以结算啦！' : '一次全对，太厉害了！') + '</div>') +
        '<section class="review-list">' + items + '</section>' +
        '<div class="actions">' + actions + '</div>' +
      '</div>';
    scrollTop();
  }

  /* ---------------- 渲染：通关结算 ---------------- */
  function renderSettle() {
    if (!session) return goHome();
    var subject = session.subject;
    var level = session.level;
    var first = session.firstStars;
    var total = session.firstTotal || 10;
    var maxStars = total * 3;
    var ratio = maxStars ? first / maxStars : 0;
    var tier = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;
    var tierText = tier === 3 ? '三星通关 · 又准又快！' : tier === 2 ? '二星通关 · 再快一点就满星！' : '一星通关 · 先求稳，再提速！';
    var big = '';
    for (var i = 0; i < 3; i++) big += '<span class="big-star ' + (i < tier ? 'on' : 'off') + '" style="animation-delay:' + (i * 0.15) + 's">★</span>';

    var idx = session.levelIndex;
    var next = subject.levels[idx + 1];
    var detail = '首轮答对 ' + session.firstCorrect + ' / ' + total + ' 题';
    if (session.retryRounds > 0) detail += '，补做 ' + session.retryRounds + ' 轮后全部掌握';
    else detail += '，一次全对！';

    var allDone = !session.playground && subjectStats(subject).done === subject.levels.length;
    var primary = allDone
      ? '<button class="btn primary" data-act="reward">领取学科奖励</button>'
      : next
        ? '<button class="btn primary" data-act="next">挑战下一关</button>'
        : '<button class="btn primary" data-act="back-subject">返回关卡地图</button>';
    var actions = session.playground
      ? '<button class="btn primary" data-act="again">再换一组新题</button>' +
        '<button class="btn ghost" data-act="playground">返回试玩入口</button>'
      : primary +
        '<button class="btn ghost" data-act="again">再练一次（新题）</button>' +
        '<button class="btn ghost" data-act="back-subject">返回关卡地图</button>';

    app.innerHTML =
      '<div class="page settle" style="' + colorVars(subject) + '">' +
        '<div class="settle-inner">' +
          '<div class="big-stars">' + big + '</div>' +
          '<p class="settle-kicker">' + (session.playground ? '试玩' : '第 ' + (idx + 1) + ' 关') + ' · ' + esc(level.unit) + '</p>' +
          '<p class="settle-player">👤 ' + esc(playerName()) + '</p>' +
          '<h1>通关！</h1>' +
          '<p class="settle-title">' + level.emoji + ' ' + esc(level.title) + '</p>' +
          '<div class="settle-score"><b>' + first + '</b><span>/ ' + maxStars + ' 星</span></div>' +
          '<p class="settle-detail">' + detail + '</p>' +
          '<div class="medal">' + tierText + '</div>' +
          '<div class="pass-card">' +
            '<span class="pc-tag">过关卡</span>' +
            '<b>' + esc(subject.name) + ' · ' + level.emoji + ' ' + esc(level.title) + '</b>' +
            '<em>第 ' + (idx + 1) + ' 关 · ' + esc(playerName()) + ' · ⭐ ' + first + '</em>' +
          '</div>' +
          '<div class="actions">' + actions + '</div>' +
        '</div>' +
      '</div>';
    scrollTop();
    if (!session.celebrated) {
      session.celebrated = true;
      confetti();
      applause();
    }
  }

  /* ---------------- 流程控制 ---------------- */
  function render() {
    clearInterval(ticker);
    if (!BANKS.length) {
      app.innerHTML = '<div class="fatal">题库加载失败，请确认 data 文件夹与 index.html 在同一目录。</div>';
      return;
    }
    if (state.screen === 'home') renderHome();
    else if (state.screen === 'players') renderPlayers();
    else if (state.screen === 'subject') renderSubject();
    else if (state.screen === 'reward') renderReward();
    else if (state.screen === 'playground') renderPlayground();
    else if (state.screen === 'concept') renderConcept();
    else if (state.screen === 'quiz') renderQuiz();
    else if (state.screen === 'review') renderReview();
    else if (state.screen === 'settle') renderSettle();
    else renderHome();
  }

  function goHome() {
    session = null;
    state.screen = 'home';
    state.subjectId = null;
    state.levelId = null;
    render();
  }

  function openSubject(id) {
    session = null;
    state.screen = 'subject';
    state.subjectId = id;
    state.levelId = null;
    render();
  }

  function openLevel(id) {
    var subject = bankById(state.subjectId);
    if (!subject) return goHome();
    var idx = levelIndex(subject, id);
    if (idx < 0) return;
    if (locked(subject, idx)) {
      toast('先完成上一关，才能解锁这一关');
      return;
    }
    state.screen = 'concept';
    state.levelId = id;
    render();
  }

  function startRound(n, isFirst, typeFilter, playground) {
    var subject = bankById(state.subjectId);
    if (!subject) return goHome();
    var level = levelById(subject, state.levelId);
    var idx = levelIndex(subject, state.levelId);
    if (!level) return goHome();

    if (isFirst) {
      var seeded = new Set();
      if (!playground) seedRecent(subject, level, seeded);
      session = {
        subject: subject,
        level: level,
        levelIndex: idx,
        round: 1,
        retryRounds: 0,
        seen: seeded,
        firstStars: 0,
        firstCorrect: 0,
        firstTotal: 0,
        celebrated: false,
        questions: [],
        answers: [],
        index: 0,
        lastWrong: 0,
        roundStars: 0,
        locked: false,
        typeFilter: typeFilter || null,
        playground: !!playground
      };
    } else {
      if (!session) return goHome();
      session.round++;
      session.retryRounds++;
      session.celebrated = false;
    }

    session.questions = generateQuestions(level, n, session.seen, session.typeFilter);
    if (!session.playground) rememberQuestions(subject, level, session.questions);
    if (isFirst) session.firstTotal = session.questions.length;
    session.answers = [];
    session.index = 0;
    session.lastWrong = 0;
    session.roundStars = 0;
    session.locked = false;
    if (!session.questions.length) {
      toast('题目生成失败，请刷新页面再试');
      return;
    }
    state.screen = 'quiz';
    render();
  }

  function settle() {
    if (!session) return goHome();
    if (session.lastWrong > 0) return;
    ensureAudio();
    if (!session.playground) {
      var id = session.level.id;
      var rec = progress.levels[id];
      if (!rec || session.firstStars > (rec.best || 0)) {
        progress.levels[id] = { best: session.firstStars, at: Date.now() };
      } else {
        rec.at = Date.now();
      }
      saveProgress();
    }
    state.screen = 'settle';
    render();
  }

  function backToSubject() {
    var wasPlayground = session && session.playground;
    session = null;
    state.screen = wasPlayground ? 'playground' : 'subject';
    render();
  }

  function nextLevel() {
    if (!session) return goHome();
    var subject = session.subject;
    var next = subject.levels[session.levelIndex + 1];
    if (!next) {
      toast('这是本学科最后一关，去挑战其他学科吧');
      backToSubject();
      return;
    }
    state.levelId = next.id;
    state.screen = 'concept';
    session = null;
    render();
  }

  /* ---------------- 声音与动画 ---------------- */
  function ensureAudio() {
    if (!soundOn()) return null;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    } catch (e) { return null; }
  }

  function tone(ac, freq, start, dur, vol) {
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(vol, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(ac.destination);
    o.start(start); o.stop(start + dur + 0.05);
  }

  // 答对：叮咚
  function dingdong() {
    var ac = ensureAudio();
    if (!ac) return;
    var t = ac.currentTime + 0.02;
    tone(ac, 1046.5, t, 0.22, 0.09);
    tone(ac, 783.99, t + 0.2, 0.32, 0.09);
  }

  // 答错：下落感
  function failSound() {
    var ac = ensureAudio();
    if (!ac) return;
    var t = ac.currentTime + 0.02;
    [392, 329.63, 261.63].forEach(function (f, i) {
      tone(ac, f, t + i * 0.16, 0.26, 0.09);
    });
  }

  // 进入下一题 / 下一关：叮咯
  function chime() {
    var ac = ensureAudio();
    if (!ac) return;
    var t = ac.currentTime + 0.01;
    tone(ac, 987.77, t, 0.1, 0.045);
    tone(ac, 1318.51, t + 0.08, 0.12, 0.045);
  }

  function say(text) {
    if (!soundOn() || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    try {
      window.speechSynthesis.cancel();
      var u = new window.SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    } catch (e) { /* 浏览器不支持时忽略 */ }
  }

  function applause() {
    var ac = ensureAudio();
    if (!ac) return;
    try {
      var now = ac.currentTime + 0.05;
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        tone(ac, f, now + i * 0.1, 0.5, 0.07);
      });
      for (var i = 0; i < 24; i++) {
        var t = now + Math.random() * 1.4;
        var len = Math.floor(ac.sampleRate * 0.09);
        var buf = ac.createBuffer(1, len, ac.sampleRate);
        var d = buf.getChannelData(0);
        for (var j = 0; j < len; j++) d[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / len, 3);
        var src = ac.createBufferSource();
        src.buffer = buf;
        var bp = ac.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 900 + Math.random() * 1200;
        bp.Q.value = 0.7;
        var g = ac.createGain();
        g.gain.value = 0.12 + Math.random() * 0.12;
        src.connect(bp); bp.connect(g); g.connect(ac.destination);
        src.start(t);
      }
    } catch (e) { /* 忽略音频错误 */ }
  }

  function confetti() {
    if (!fx) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!fx.getContext) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = Math.floor(window.innerWidth * dpr);
    var H = Math.floor(window.innerHeight * dpr);
    fx.width = W; fx.height = H;
    fx.style.width = window.innerWidth + 'px';
    fx.style.height = window.innerHeight + 'px';
    var ctx = fx.getContext('2d');
    var colors = ['#f7b731', '#f26b5e', '#3f7dfb', '#27a97a', '#a86ef5', '#ff8fab'];
    var parts = [];
    for (var i = 0; i < 130; i++) {
      parts.push({
        x: Math.random() * W,
        y: -Math.random() * H * 0.5,
        vx: (Math.random() - 0.5) * 2.2 * dpr,
        vy: (2.2 + Math.random() * 4) * dpr,
        s: (5 + Math.random() * 7) * dpr,
        r: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.3,
        c: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    var start = performance.now();
    fx.style.display = 'block';
    function frame(now) {
      var t = now - start;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = t > 2200 ? Math.max(0, 1 - (t - 2200) / 800) : 1;
      parts.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.03 * dpr; p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        ctx.restore();
      });
      if (t < 3000) requestAnimationFrame(frame);
      else {
        ctx.clearRect(0, 0, W, H);
        fx.style.display = 'none';
      }
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- 交互 ---------------- */
  function onClick(e) {
    var target = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!target) return;
    var act = target.getAttribute('data-act');

    if (act === 'sound') {
      progress.sound = !soundOn();
      saveProgress();
      if (progress.sound) ensureAudio();
      render();
      return;
    }
    if (act === 'reset') {
      if (window.confirm('确定清空“' + playerName() + '”的所有关卡进度、星星和错题记录吗？')) {
        var keepSound = soundOn();
        progress = blankProgress();
        progress.sound = keepSound;
        saveProgress();
        goHome();
        toast('进度已清空');
      }
      return;
    }
    if (act === 'players') {
      session = null;
      state.screen = 'players';
      render();
      return;
    }
    if (act === 'enter-player') {
      var nameInput = document.getElementById('player-name');
      enterPlayer(nameInput ? nameInput.value : '');
      return;
    }
    if (act === 'pick-player') {
      enterPlayer(target.getAttribute('data-name'));
      return;
    }
    if (act === 'home') { goHome(); return; }
    if (act === 'subject') {
      var sid = target.getAttribute('data-subject') || state.subjectId;
      if (sid) openSubject(sid);
      else goHome();
      return;
    }
    if (act === 'level') {
      openLevel(target.getAttribute('data-level'));
      return;
    }
    if (act === 'playground') {
      session = null;
      state.screen = 'playground';
      render();
      return;
    }
    if (act === 'play') {
      var lid = target.getAttribute('data-level');
      var type = target.getAttribute('data-type') || null;
      var owner = null;
      BANKS.forEach(function (b) {
        if (!owner && levelById(b, lid)) owner = b;
      });
      if (!owner) return;
      ensureAudio();
      state.subjectId = owner.id;
      state.levelId = lid;
      startRound(10, true, type, true);
      return;
    }
    if (act === 'start') {
      ensureAudio();
      startRound(10, true);
      return;
    }
    if (act === 'option') {
      choose(parseInt(target.getAttribute('data-opt'), 10));
      return;
    }
    if (act === 'submit') {
      submitFill();
      return;
    }
    if (act === 'quit') {
      var msg = session && session.answers.length > 0
        ? '退出后本轮答题不会保存，确定退出吗？'
        : '确定退出本关吗？';
      if (window.confirm(msg)) backToSubject();
      return;
    }
    if (act === 'retry') {
      if (!session) return goHome();
      var wrong = session.lastWrong;
      if (wrong <= 0) return;
      startRound(wrong, false);
      return;
    }
    if (act === 'settle') { settle(); return; }
    if (act === 'reward') {
      state.screen = 'reward';
      render();
      return;
    }
    if (act === 'next-q') { advance(); return; }
    if (act === 'again') {
      ensureAudio();
      if (session && session.playground) startRound(10, true, session.typeFilter, true);
      else startRound(10, true);
      return;
    }
    if (act === 'next') { nextLevel(); return; }
    if (act === 'back-subject') {
      if (state.screen === 'review' && session && session.lastWrong > 0) {
        if (!window.confirm('还没有全部答对，离开后本轮成绩不会保存。确定离开吗？')) return;
      }
      backToSubject();
      return;
    }
  }

  function onKey(e) {
    if (state.screen !== 'quiz' || !session || session.locked) return;
    var q = session.questions[session.index];
    if (!q) return;
    var kind = q.kind || 'choice';
    if (e.key === 'Enter') {
      if (kind !== 'choice' && kind !== 'judge') {
        e.preventDefault();
        submitFill();
      }
      return;
    }
    if (kind !== 'choice' && kind !== 'judge') return;
    var k = String(e.key || '').toUpperCase();
    var idx = -1;
    if (k >= '1' && k <= '4') idx = parseInt(k, 10) - 1;
    else if ('ABCD'.indexOf(k) >= 0) idx = 'ABCD'.indexOf(k);
    if (idx < 0) return;
    if (kind === 'judge' && idx > 1) return;
    if (kind === 'choice' && (!q.options || idx >= q.options.length)) return;
    e.preventDefault();
    choose(idx);
  }

  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);

  render();
})();
