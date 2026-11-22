/* 本地自绘插图 · 全部为内嵌 SVG，无外链，双击离线可用 */
(function () {
  var P = {};

  function frame(inner) {
    return '<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" role="img">' +
      '<rect x="0" y="0" width="320" height="170" rx="14" fill="#f8fbfd"/>' + inner + '</svg>';
  }

  /* ---------- 古诗画面 ---------- */
  P.poem = function (title) {
    if (title === '山行') {
      return frame(
        '<rect width="320" height="170" fill="#fdf6e9"/>' +
        '<circle cx="262" cy="38" r="18" fill="#f7c873"/>' +
        '<path d="M0 132 L62 62 L124 132 Z" fill="#aebccb"/>' +
        '<path d="M70 132 L160 42 L250 132 Z" fill="#93a7bb"/>' +
        '<path d="M200 132 L276 72 L320 132 Z" fill="#b9c7d5"/>' +
        '<path d="M6 166 Q72 126 126 104 T214 86 T316 70" stroke="#d7b184" stroke-width="6" fill="none"/>' +
        '<g fill="#cf4b3a"><circle cx="52" cy="104" r="15"/><circle cx="74" cy="96" r="11"/><circle cx="240" cy="94" r="13"/></g>' +
        '<g stroke="#7a4a2b" stroke-width="3"><line x1="52" y1="118" x2="52" y2="140"/><line x1="240" y1="106" x2="240" y2="128"/></g>' +
        '<rect x="140" y="128" width="40" height="20" rx="4" fill="#8b5e3c"/>' +
        '<circle cx="148" cy="151" r="6" fill="#4a3b2c"/><circle cx="172" cy="151" r="6" fill="#4a3b2c"/>'
      );
    }
    if (title === '赠刘景文') {
      return frame(
        '<rect width="320" height="170" fill="#fdf8ee"/>' +
        '<rect y="108" width="320" height="62" fill="#cfe3e8"/>' +
        '<g stroke="#8d7b5a" stroke-width="3" fill="none">' +
          '<path d="M40 120 Q44 88 38 66"/><path d="M84 120 Q90 92 82 72"/><path d="M128 120 Q124 96 130 78"/>' +
        '</g>' +
        '<g fill="#9c7a4c"><ellipse cx="38" cy="64" rx="14" ry="7"/><ellipse cx="82" cy="70" rx="12" ry="6"/></g>' +
        '<g fill="#f2c14e"><circle cx="206" cy="118" r="9"/><circle cx="222" cy="108" r="8"/><circle cx="238" cy="120" r="9"/><circle cx="254" cy="110" r="8"/></g>' +
        '<g stroke="#3f7d4e" stroke-width="3"><line x1="206" y1="127" x2="206" y2="142"/><line x1="238" y1="129" x2="238" y2="144"/></g>' +
        '<g fill="#e8862c"><circle cx="272" cy="98" r="11"/><circle cx="292" cy="112" r="10"/></g>' +
        '<path d="M258 142 Q276 112 300 88" stroke="#6b4a2a" stroke-width="5" fill="none"/>'
      );
    }
    if (title === '夜书所见') {
      return frame(
        '<rect width="320" height="170" fill="#172a46"/>' +
        '<circle cx="256" cy="42" r="17" fill="#f5e6b8"/>' +
        '<circle cx="250" cy="38" r="15" fill="#172a46"/>' +
        '<path d="M40 150 Q44 92 42 58" stroke="#3b3027" stroke-width="7" fill="none"/>' +
        '<g fill="#5b4632"><circle cx="30" cy="64" r="16"/><circle cx="52" cy="56" r="14"/><circle cx="58" cy="76" r="12"/></g>' +
        '<g stroke="#6b5a45" stroke-width="3"><line x1="120" y1="108" x2="120" y2="146"/><line x1="144" y1="112" x2="144" y2="148"/><line x1="168" y1="108" x2="168" y2="146"/></g>' +
        '<line x1="108" y1="126" x2="182" y2="126" stroke="#6b5a45" stroke-width="3"/>' +
        '<circle cx="206" cy="118" r="14" fill="#f7d67a" opacity="0.35"/>' +
        '<rect x="200" y="116" width="12" height="18" rx="2" fill="#f3c34f"/>' +
        '<line x1="206" y1="134" x2="206" y2="150" stroke="#8a6b3a" stroke-width="3"/>'
      );
    }
    if (title === '望天门山') {
      return frame(
        '<rect width="320" height="170" fill="#e9f4fb"/>' +
        '<circle cx="252" cy="36" r="16" fill="#f7b84b"/>' +
        '<path d="M0 150 L0 40 L78 96 L96 150 Z" fill="#6f8a6a"/>' +
        '<path d="M320 150 L320 46 L244 98 L224 150 Z" fill="#5f7b5d"/>' +
        '<path d="M70 150 Q140 118 190 150 T320 150 L320 170 L0 170 Z" fill="#79b8d8"/>' +
        '<path d="M150 108 L166 128 L134 128 Z" fill="#ffffff"/>' +
        '<line x1="150" y1="88" x2="150" y2="126" stroke="#4a5b6a" stroke-width="3"/>' +
        '<path d="M150 90 L178 108 L150 118 Z" fill="#f2f7fb" stroke="#c7d6e2"/>'
      );
    }
    if (title === '饮湖上初晴后雨') {
      return frame(
        '<defs><linearGradient id="sky2" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0" stop-color="#bfe0f5"/><stop offset="1" stop-color="#cfd8e6"/>' +
        '</linearGradient></defs>' +
        '<rect width="320" height="170" fill="url(#sky2)"/>' +
        '<circle cx="72" cy="40" r="18" fill="#f6c452"/>' +
        '<g stroke="#8fa6bb" stroke-width="2" opacity="0.8">' +
          '<line x1="198" y1="24" x2="190" y2="52"/><line x1="218" y1="20" x2="210" y2="52"/>' +
          '<line x1="238" y1="26" x2="230" y2="54"/><line x1="258" y1="20" x2="250" y2="50"/>' +
        '</g>' +
        '<path d="M0 104 Q70 70 140 96 T320 90 L320 170 L0 170 Z" fill="#8ec7b6"/>' +
        '<path d="M0 118 Q80 100 160 120 T320 112 L320 170 L0 170 Z" fill="#5fa9c9"/>' +
        '<path d="M108 128 L130 128 L124 136 L114 136 Z" fill="#8a5a34"/>' +
        '<line x1="119" y1="118" x2="119" y2="128" stroke="#6b4426" stroke-width="2"/>' +
        '<path d="M119 118 L140 126 L119 131 Z" fill="#fff7ea"/>' +
        '<g stroke="#4b6b5a" stroke-width="2" fill="none">' +
          '<path d="M244 122 q8 -12 16 0"/><path d="M252 122 v8"/>' +
        '</g>'
      );
    }
    return frame(
      '<rect width="320" height="170" fill="#18294a"/>' +
      '<circle cx="248" cy="44" r="18" fill="#f3e7bd"/>' +
      '<path d="M0 122 Q80 108 160 118 T320 114 L320 170 L0 170 Z" fill="#2f5f7a"/>' +
      '<ellipse cx="160" cy="132" rx="118" ry="14" fill="#cfe6ec" opacity="0.55"/>' +
      '<ellipse cx="176" cy="132" rx="34" ry="8" fill="#3f7d5c"/>' +
      '<path d="M150 130 q10 -14 22 -4 q10 8 18 4" stroke="#2f5f4a" stroke-width="3" fill="none"/>' +
      '<circle cx="176" cy="128" r="3" fill="#8fd0a8"/>' +
      '<g fill="#f3e7bd" opacity="0.5"><circle cx="70" cy="140" r="2"/><circle cx="104" cy="148" r="2"/><circle cx="236" cy="144" r="2"/></g>'
    );
  };

  /* ---------- 数学：钟面 ---------- */
  P.clock = function (h, m) {
    var cx = 160, cy = 85, r = 64;
    var ticks = '';
    for (var i = 0; i < 12; i++) {
      var a = i * 30 * Math.PI / 180;
      var x1 = cx + Math.sin(a) * (r - 9), y1 = cy - Math.cos(a) * (r - 9);
      var x2 = cx + Math.sin(a) * (r - 3), y2 = cy - Math.cos(a) * (r - 3);
      ticks += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="#7d8fa3" stroke-width="' + (i % 3 === 0 ? 3 : 1.5) + '"/>';
    }
    var ha = ((h % 12) + m / 60) * 30 * Math.PI / 180;
    var ma = m * 6 * Math.PI / 180;
    var hx = cx + Math.sin(ha) * 32, hy = cy - Math.cos(ha) * 32;
    var mx = cx + Math.sin(ma) * 48, my = cy - Math.cos(ma) * 48;
    return frame(
      '<circle cx="160" cy="85" r="70" fill="#ffffff" stroke="#3f5a78" stroke-width="5"/>' +
      ticks +
      '<text x="160" y="47" text-anchor="middle" font-size="13" fill="#3f5a78">12</text>' +
      '<text x="216" y="90" text-anchor="middle" font-size="13" fill="#3f5a78">3</text>' +
      '<text x="160" y="138" text-anchor="middle" font-size="13" fill="#3f5a78">6</text>' +
      '<text x="104" y="90" text-anchor="middle" font-size="13" fill="#3f5a78">9</text>' +
      '<line x1="160" y1="85" x2="' + hx.toFixed(1) + '" y2="' + hy.toFixed(1) + '" stroke="#26313f" stroke-width="6" stroke-linecap="round"/>' +
      '<line x1="160" y1="85" x2="' + mx.toFixed(1) + '" y2="' + my.toFixed(1) + '" stroke="#e05a4f" stroke-width="3.5" stroke-linecap="round"/>' +
      '<circle cx="160" cy="85" r="4" fill="#26313f"/>'
    );
  };

  /* ---------- 数学：看图列式 ---------- */
  P.groups = function (n, per) {
    var inner = '';
    var cols = Math.min(3, n);
    var cellW = 96, cellH = 76;
    for (var i = 0; i < n; i++) {
      var col = i % cols, row = Math.floor(i / cols);
      var gx = 20 + col * cellW, gy = 12 + row * cellH;
      inner += '<rect x="' + gx + '" y="' + gy + '" width="82" height="62" rx="10" fill="#fff" stroke="#cfe0ea" stroke-width="2"/>';
      for (var j = 0; j < per && j < 6; j++) {
        var px = gx + 15 + (j % 3) * 25;
        var py = gy + 20 + Math.floor(j / 3) * 24;
        inner += '<circle cx="' + px + '" cy="' + py + '" r="8" fill="#f26b5e"/>';
        inner += '<path d="M' + (px - 3) + ' ' + (py - 8) + ' q3 -5 6 0" stroke="#4f8a3d" stroke-width="2" fill="none"/>';
      }
    }
    return frame(inner);
  };

  P.twoGroups = function (a, b) {
    function dots(x0, y0, count, color) {
      var s = '';
      for (var i = 0; i < count && i < 15; i++) {
        var px = x0 + (i % 5) * 18;
        var py = y0 + Math.floor(i / 5) * 18;
        s += '<circle cx="' + px + '" cy="' + py + '" r="7" fill="' + color + '"/>';
      }
      return s;
    }
    return frame(
      '<rect x="16" y="38" width="116" height="96" rx="12" fill="#fff" stroke="#cfe0ea" stroke-width="2"/>' +
      dots(34, 60, a, '#4f8ad1') +
      '<text x="156" y="100" text-anchor="middle" font-size="34" fill="#7c8798">+</text>' +
      '<rect x="186" y="38" width="116" height="96" rx="12" fill="#fff" stroke="#cfe0ea" stroke-width="2"/>' +
      dots(204, 60, b, '#f26b5e')
    );
  };

  P.rect = function (l, w) {
    return frame(
      '<rect x="58" y="46" width="204" height="78" rx="4" fill="#eaf0ff" stroke="#3f7dfb" stroke-width="3"/>' +
      '<text x="160" y="34" text-anchor="middle" font-size="14" fill="#255fd6">长 ' + l + ' 厘米</text>' +
      '<text x="18" y="90" font-size="14" fill="#255fd6">宽 ' + w + ' 厘米</text>' +
      '<path d="M58 134 L262 134" stroke="#9db3d8" stroke-width="1.5"/>' +
      '<path d="M58 130 v8 M262 130 v8" stroke="#9db3d8" stroke-width="1.5"/>'
    );
  };

  /* ---------- 英语：看图选词 ---------- */
  P.word = function (entry) {
    if (entry.color) {
      return frame('<ellipse cx="160" cy="92" rx="72" ry="48" fill="' + entry.color + '" stroke="#26313f" stroke-width="2"/>' +
        '<ellipse cx="136" cy="74" rx="18" ry="9" fill="#ffffff" opacity="0.45"/>');
    }
    var en = entry.en;
    if (en === 'ruler') {
      var t = '';
      for (var i = 0; i < 10; i++) t += '<line x1="' + (86 + i * 16) + '" y1="64" x2="' + (86 + i * 16) + '" y2="' + (i % 2 ? 78 : 84) + '" stroke="#b98a1f" stroke-width="2"/>';
      return frame('<rect x="72" y="58" width="180" height="48" rx="8" fill="#f6c453" stroke="#b98a1f" stroke-width="2"/>' + t);
    }
    if (en === 'eraser') {
      return frame('<rect x="96" y="62" width="130" height="54" rx="14" fill="#ffb3c1" stroke="#d9738a" stroke-width="2"/>' +
        '<rect x="96" y="84" width="130" height="32" rx="12" fill="#ffd6de"/>');
    }
    if (en === 'crayon') {
      return frame('<rect x="126" y="52" width="62" height="78" rx="6" fill="#f08a3c" stroke="#c4641d" stroke-width="2"/>' +
        '<path d="M126 52 L157 24 L188 52 Z" fill="#e05a4f"/>' +
        '<rect x="126" y="92" width="62" height="14" fill="#f7c99b"/>');
    }
    if (en === 'bag') {
      return frame('<path d="M116 50 q44 -30 88 0" stroke="#265fb0" stroke-width="7" fill="none"/>' +
        '<rect x="86" y="62" width="148" height="76" rx="18" fill="#3f7dfb" stroke="#265fb0" stroke-width="2"/>' +
        '<rect x="112" y="96" width="96" height="30" rx="8" fill="#8fb4ff"/>');
    }
    if (en === 'pen') {
      return frame('<rect x="92" y="76" width="132" height="20" rx="9" fill="#2f6fd0"/>' +
        '<path d="M224 86 L252 78 L252 94 Z" fill="#26313f"/>' +
        '<rect x="104" y="72" width="14" height="28" rx="5" fill="#8fb4ff"/>');
    }
    if (en === 'pencil') {
      return frame('<rect x="78" y="70" width="130" height="26" rx="4" fill="#f6c453" stroke="#b98a1f" stroke-width="2"/>' +
        '<path d="M208 70 L246 83 L208 96 Z" fill="#f2d3a1"/>' +
        '<path d="M236 79 L246 83 L236 87 Z" fill="#26313f"/>' +
        '<rect x="66" y="70" width="14" height="26" rx="5" fill="#ffb3c1"/>');
    }
    if (en === 'pencil box') {
      return frame('<rect x="76" y="62" width="168" height="70" rx="10" fill="#4fae7c" stroke="#2c7c54" stroke-width="2"/>' +
        '<line x1="76" y1="86" x2="244" y2="86" stroke="#2c7c54" stroke-width="3"/>' +
        '<rect x="146" y="80" width="28" height="14" rx="4" fill="#f7d67a"/>');
    }
    if (en === 'book') {
      return frame('<path d="M160 54 L86 66 L86 124 L160 112 Z" fill="#eef3ff" stroke="#6b8fd1" stroke-width="2"/>' +
        '<path d="M160 54 L234 66 L234 124 L160 112 Z" fill="#f8fbff" stroke="#6b8fd1" stroke-width="2"/>' +
        '<line x1="160" y1="54" x2="160" y2="112" stroke="#6b8fd1" stroke-width="3"/>' +
        '<line x1="100" y1="80" x2="146" y2="74" stroke="#b7c8e6" stroke-width="2"/>' +
        '<line x1="100" y1="94" x2="146" y2="88" stroke="#b7c8e6" stroke-width="2"/>');
    }
    var emoji = entry.emoji || '📘';
    return frame('<text x="160" y="112" text-anchor="middle" font-size="84">' + emoji + '</text>');
  };

  window.QB.pic = P;
})();
