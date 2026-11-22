/* 数学 · 人教版三年级上册 题库
 * 题型对齐普通试卷：口算、填空、选择、判断、竖式计算、解决问题。
 * 每关 = 一个知识点；make() 每次生成一道新题。
 */
(function () {
  var int = QB.int;
  var pick = QB.pick;

  function C(q, correct, candidates, tip, extra) {
    var c = QB.choice(correct, candidates, (extra && extra.n) || 3);
    var base = { q: q, kind: 'choice', options: c.options, answer: c.answer, tip: tip, paperType: '选择' };
    return Object.assign(base, extra || {});
  }

  function F(q, answers, tip, extra) {
    var base = {
      q: q,
      kind: 'fill',
      answers: [].concat(answers),
      displayAnswer: String([].concat(answers)[0]),
      tip: tip,
      paperType: '填空',
      inputMode: 'numeric'
    };
    return Object.assign(base, extra || {});
  }

  function J(q, answer, tip, extra) {
    var base = { q: q, kind: 'judge', answer: answer, tip: tip, paperType: '判断' };
    return Object.assign(base, extra || {});
  }

  QB.define({
    id: 'math',
    name: '数学',
    emoji: '🧮',
    color: 'blue',
    desc: '人教版 · 三年级上册',
    levels: [
      {
        id: 'm1',
        unit: '第一单元',
        title: '时分秒',
        emoji: '⏰',
        goal: '认识时间单位，会算经过时间',
        paperType: '填空、选择、判断',
        concept: {
          points: [
            '钟面上有 12 个大格、60 个小格。短针是时针，长针是分针。',
            '1 时 = 60 分，1 分 = 60 秒。',
            '分针走 1 小格是 1 分钟，走 1 大格是 5 分钟，走一圈是 60 分钟。',
            '经过时间 = 结束时刻 − 开始时刻。'
          ],
          example: '从 8:20 到 8:45，分针从 4 走到 9，走了 5 个大格，5×5 = 25 分钟。'
        },
        fast: 15,
        ok: 35,
        make: function () {
          var t = int(1, 8);
          if (t === 1) {
            var n1 = int(2, 9);
            return F(n1 + ' 分 =（ ）秒', n1 * 60,
              '1 分 = 60 秒，' + n1 + ' 分就是 ' + n1 + ' 个 60 秒，即 ' + n1 * 60 + ' 秒。',
              { fast: 15, ok: 35, placeholder: '写秒数' });
          }
          if (t === 2) {
            var n2 = int(2, 6);
            return F(n2 + ' 时 =（ ）分', n2 * 60,
              '1 时 = 60 分，' + n2 + ' 时就是 ' + n2 + ' × 60 = ' + n2 * 60 + ' 分。',
              { fast: 15, ok: 35, placeholder: '写分钟数' });
          }
          if (t === 3) {
            var m3 = int(1, 5) * 10;
            return F('1 时 ' + m3 + ' 分 =（ ）分', 60 + m3,
              '1 时 = 60 分，再加上 ' + m3 + ' 分，一共是 ' + (60 + m3) + ' 分。',
              { fast: 15, ok: 35, placeholder: '写分钟数' });
          }
          if (t === 4) {
            var h4 = int(7, 10);
            var m4 = pick([0, 10, 20, 30, 40]);
            var d4 = pick([10, 15, 20, 25, 30, 35, 40, 45, 50].filter(function (x) { return m4 + x <= 55; }));
            var tail = m4 + d4 < 10 ? '0' + (m4 + d4) : String(m4 + d4);
            return F('从 ' + h4 + ':' + (m4 < 10 ? '0' + m4 : m4) + ' 到 ' + h4 + ':' + tail + '，一共经过了（ ）分钟。',
              d4, '结束时刻减开始时刻：' + (m4 + d4) + ' − ' + m4 + ' = ' + d4 + ' 分钟。',
              { fast: 25, ok: 50, placeholder: '写分钟数' });
          }
          if (t === 5) {
            var h5 = int(1, 11);
            return C('钟面上时针指向 ' + h5 + '，分针指向 12，这时是（ ）。',
              h5 + ':00', [h5 + ':30', h5 + ':12', h5 + 1 + ':00', '12:' + h5],
              '分针指向 12 表示整点，时针指向几就是几时。', { fast: 15, ok: 35, n: 4 });
          }
          if (t === 6) {
            var x6 = int(1, 6);
            return F('钟面上分针从 12 走到数字 ' + x6 + '，经过了（ ）分钟。',
              x6 * 5, '分针走 1 个大格是 5 分钟，' + x6 + ' 个大格就是 ' + x6 + ' × 5 = ' + x6 * 5 + ' 分钟。',
              { fast: 15, ok: 35, placeholder: '写分钟数' });
          }
          if (t === 7) {
            var ch = int(1, 12);
            var cm = int(0, 11) * 5;
            var mm = cm < 10 ? '0' + cm : String(cm);
            var rightT = ch + ':' + mm;
            var nextH = ch === 12 ? 1 : ch + 1;
            var plus5 = cm + 5 >= 60 ? '00' : (cm + 5 < 10 ? '0' + (cm + 5) : String(cm + 5));
            var plus30raw = cm + 30 >= 60 ? cm - 30 : cm + 30;
            var plus30 = plus30raw < 10 ? '0' + plus30raw : String(plus30raw);
            return C('看钟面，现在是什么时刻？', rightT, [nextH + ':' + mm, ch + ':' + plus5, ch + ':' + plus30],
              '分针指向 ' + (cm / 5) + '，表示 ' + cm + ' 分；时针在 ' + ch + ' 附近，所以是 ' + rightT + '。',
              { svg: QB.pic.clock(ch, cm), paperType: '看钟面读时间', fast: 20, ok: 45, n: 4 });
          }
          var judges = [
            { q: '分针走一圈，时针正好走 1 大格。（ ）', a: true, tip: '分针走一圈是 60 分钟，也就是 1 小时，时针正好走 1 大格。' },
            { q: '1 时 = 100 分。（ ）', a: false, tip: '1 时 = 60 分，不是 100 分。' },
            { q: '秒针走一圈是 1 分钟。（ ）', a: true, tip: '秒针走一圈是 60 秒，也就是 1 分钟。' }
          ];
          var j = pick(judges);
          return J(j.q, j.a, j.tip, { fast: 15, ok: 35 });
        }
      },
      {
        id: 'm2',
        unit: '第二单元',
        title: '万以内的加法和减法（一）',
        emoji: '➕',
        goal: '会口算两位数加减法',
        paperType: '口算',
        concept: {
          points: [
            '口算两位数加减法，先把相同数位对齐，再从个位算起。',
            '加法哪一位满十，就向前一位进 1；减法哪一位不够减，就从前一位退 1。',
            '整十、整百数相加减，可以先算前面的数，再添上 0。',
            '算完可以用估算检查答案是否合理。'
          ],
          example: '36 + 27：30 + 20 = 50，6 + 7 = 13，50 + 13 = 63。'
        },
        fast: 12,
        ok: 30,
        make: function () {
          var t = int(1, 5);
          if (t === 1) {
            var a1 = int(15, 68);
            var b1 = int(11, 99 - a1);
            var s1 = a1 + b1;
            return F(a1 + ' + ' + b1 + ' =', s1,
              a1 + ' + ' + b1 + ' = ' + s1 + '，可以拆成整十数和个位数分别相加。',
              { paperType: '口算', fast: 15, ok: 30, placeholder: '写得数' });
          }
          if (t === 2) {
            var a2 = int(35, 99);
            var b2 = int(11, a2 - 10);
            var s2 = a2 - b2;
            return F(a2 + ' − ' + b2 + ' =', s2,
              a2 + ' − ' + b2 + ' = ' + s2 + '，个位不够减时从前一位退一。',
              { paperType: '口算', fast: 15, ok: 30, placeholder: '写得数' });
          }
          if (t === 3) {
            var a3 = int(2, 6) * 100;
            var b3 = int(1, 3) * 100;
            return F(a3 + ' + ' + b3 + ' =', a3 + b3,
              '整百数相加：' + a3 / 100 + ' + ' + b3 / 100 + ' = ' + (a3 + b3) / 100 + '，再添两个 0，得 ' + (a3 + b3) + '。',
              { paperType: '口算', fast: 15, ok: 30, placeholder: '写得数' });
          }
          if (t === 5) {
            var a5 = int(8, 15);
            var b5 = int(8, 15);
            return F('看图列式：一共有多少个？', a5 + b5,
              '左边 ' + a5 + ' 个，右边 ' + b5 + ' 个，合起来用加法：' + a5 + ' + ' + b5 + ' = ' + (a5 + b5) + '。',
              { svg: QB.pic.twoGroups(a5, b5), paperType: '看图列式', fast: 20, ok: 45, unit: '个', placeholder: '写得数' });
          }
          var a4 = int(23, 68);
          var b4 = int(15, 99 - a4);
          return F('（ ） + ' + b4 + ' = ' + (a4 + b4), a4,
            '求加数用减法：' + (a4 + b4) + ' − ' + b4 + ' = ' + a4 + '。',
            { paperType: '填空', fast: 15, ok: 35, placeholder: '填加数' });
        }
      },
      {
        id: 'm3',
        unit: '第三单元',
        title: '测量',
        emoji: '📏',
        goal: '认识毫米、分米、千米、吨，会换算',
        paperType: '填空、判断、选择',
        concept: {
          points: [
            '1 厘米 = 10 毫米，1 分米 = 10 厘米，1 米 = 10 分米。',
            '1 米 = 100 厘米，1 千米 = 1000 米。',
            '1 吨 = 1000 千克，1 千克 = 1000 克。',
            '量很薄的物体用毫米，量路程用千米，量大宗物品用吨。'
          ],
          example: '3 厘米 = 30 毫米；5 千米 = 5000 米；4 吨 = 4000 千克。'
        },
        fast: 15,
        ok: 35,
        make: function () {
          if (Math.random() < 0.6) {
            var conv = pick([
              { big: '厘米', small: '毫米', f: 10 },
              { big: '分米', small: '厘米', f: 10 },
              { big: '米', small: '分米', f: 10 },
              { big: '米', small: '厘米', f: 100 },
              { big: '千米', small: '米', f: 1000 },
              { big: '吨', small: '千克', f: 1000 },
              { big: '千克', small: '克', f: 1000 }
            ]);
            var n = int(2, 9);
            return F(n + ' ' + conv.big + ' =（ ）' + conv.small, n * conv.f,
              '1 ' + conv.big + ' = ' + conv.f + ' ' + conv.small + '，所以 ' + n + ' ' + conv.big + ' = ' + n + ' × ' + conv.f + ' = ' + n * conv.f + ' ' + conv.small + '。',
              { paperType: '填空', fast: 15, ok: 35, placeholder: '填数' });
          }
          if (Math.random() < 0.55) {
            var units = [
              { q: '一枚硬币的厚度大约是 2（ ）。', right: '毫米', wrongs: ['厘米', '分米', '米'], tip: '硬币很薄，用毫米量比较合适。' },
              { q: '教室的门高大约 2（ ）。', right: '米', wrongs: ['毫米', '厘米', '千米'], tip: '门比人高一点，大约 2 米。' },
              { q: '一头大象大约重 4（ ）。', right: '吨', wrongs: ['克', '千克', '米'], tip: '大象很重，用吨作单位。' },
              { q: '数学书的厚度大约 8（ ）。', right: '毫米', wrongs: ['厘米', '分米', '米'], tip: '书本比较薄，厚度用毫米。' },
              { q: '北京到上海的距离大约 1200（ ）。', right: '千米', wrongs: ['米', '分米', '厘米'], tip: '两个城市之间的距离用千米。' },
              { q: '一个鸡蛋大约重 50（ ）。', right: '克', wrongs: ['千克', '吨', '米'], tip: '一个鸡蛋很轻，大约 50 克。' },
              { q: '一支铅笔长大约 18（ ）。', right: '厘米', wrongs: ['毫米', '分米', '米'], tip: '铅笔长约 18 厘米。' },
              { q: '操场跑道一圈大约 400（ ）。', right: '米', wrongs: ['厘米', '毫米', '千米'], tip: '跑道一圈 400 米。' },
              { q: '一袋大米重 25（ ）。', right: '千克', wrongs: ['克', '吨', '厘米'], tip: '一袋大米重 25 千克。' },
              { q: '小明的身高是 135（ ）。', right: '厘米', wrongs: ['毫米', '米', '千米'], tip: '三年级学生身高约 135 厘米。' },
              { q: '一张课桌高约 70（ ）。', right: '厘米', wrongs: ['毫米', '米', '千米'], tip: '课桌高约 70 厘米。' },
              { q: '一支粉笔长约 75（ ）。', right: '毫米', wrongs: ['厘米', '分米', '米'], tip: '粉笔长约 75 毫米，也就是 7 厘米 5 毫米。' },
              { q: '一枚图钉长约 1（ ）。', right: '厘米', wrongs: ['毫米', '分米', '米'], tip: '图钉很短，长约 1 厘米。' },
              { q: '教室的长约 8（ ）。', right: '米', wrongs: ['厘米', '分米', '千米'], tip: '教室长约 8 米。' },
              { q: '一张床长约 2（ ）。', right: '米', wrongs: ['厘米', '毫米', '千米'], tip: '床长约 2 米。' },
              { q: '一辆卡车载重约 5（ ）。', right: '吨', wrongs: ['千克', '克', '米'], tip: '卡车载重很大，用吨作单位。' },
              { q: '一头牛重约 500（ ）。', right: '千克', wrongs: ['克', '吨', '厘米'], tip: '一头牛约重 500 千克。' },
              { q: '一箱苹果重约 10（ ）。', right: '千克', wrongs: ['克', '吨', '米'], tip: '一箱苹果约重 10 千克。' },
              { q: '一瓶矿泉水重约 500（ ）。', right: '克', wrongs: ['千克', '吨', '厘米'], tip: '一瓶矿泉水约重 500 克。' },
              { q: '小汽车每小时约行 60（ ）。', right: '千米', wrongs: ['米', '分米', '厘米'], tip: '汽车速度用“千米/时”，每小时约 60 千米。' }
            ];
            var u = pick(units);
            return F(u.q, u.right, u.tip,
              { paperType: '填空', fast: 15, ok: 35, placeholder: '填单位' });
          }
          var judges = [
            { q: '1 千米 = 100 米。（ ）', a: false, tip: '1 千米 = 1000 米。' },
            { q: '5 厘米 = 50 毫米。（ ）', a: true, tip: '1 厘米 = 10 毫米，5 厘米就是 50 毫米。' },
            { q: '1 吨 = 1000 千克。（ ）', a: true, tip: '吨和千克之间的进率是 1000。' },
            { q: '1 分米 = 100 厘米。（ ）', a: false, tip: '1 分米 = 10 厘米。' }
          ];
          var j = pick(judges);
          return J(j.q, j.a, j.tip, { paperType: '判断', fast: 15, ok: 35 });
        }
      },
      {
        id: 'm4',
        unit: '第四单元',
        title: '万以内的加法和减法（二）',
        emoji: '🧾',
        goal: '会笔算三位数加减法，会验算和估算',
        paperType: '竖式计算、解决问题',
        concept: {
          points: [
            '三位数加减法：相同数位对齐，从个位算起。',
            '加法哪一位满十，就向前一位进 1；减法哪一位不够减，就从前一位退 1。',
            '加法验算：和 − 一个加数 = 另一个加数。',
            '减法验算：差 + 减数 = 被减数。',
            '估算时，把数看成接近的整百数再计算。'
          ],
          example: '456 + 378 = 834，验算：834 − 378 = 456。'
        },
        fast: 30,
        ok: 65,
        make: function () {
          var t = int(1, 6);
          if (t === 1) {
            var a1 = int(135, 789);
            var b1 = int(105, 899);
            return F('用竖式计算：' + a1 + ' + ' + b1, a1 + b1,
              '相同数位对齐，从个位加起，满十进一。' + a1 + ' + ' + b1 + ' = ' + (a1 + b1) + '。',
              { paperType: '竖式计算', fast: 30, ok: 65, vertical: { top: a1, bottom: b1, op: '+' }, placeholder: '写得数' });
          }
          if (t === 2) {
            var a2 = int(400, 999);
            var b2 = int(105, a2 - 100);
            return F('用竖式计算：' + a2 + ' − ' + b2, a2 - b2,
              '相同数位对齐，从个位减起，不够减向前一位借一。' + a2 + ' − ' + b2 + ' = ' + (a2 - b2) + '。',
              { paperType: '竖式计算', fast: 30, ok: 65, vertical: { top: a2, bottom: b2, op: '−' }, placeholder: '写得数' });
          }
          if (t === 3) {
            var a3 = int(120, 480);
            var b3 = int(110, 499);
            var s3 = a3 + b3;
            return C('计算 ' + a3 + ' + ' + b3 + ' = ' + s3 + '，下面验算正确的是（ ）。',
              s3 + ' − ' + b3 + ' = ' + a3,
              [s3 + ' + ' + b3 + ' = ' + a3, a3 + ' − ' + b3 + ' = ' + s3, b3 + ' − ' + a3 + ' = ' + s3],
              '加法的验算方法：和减去一个加数，应该等于另一个加数。', { paperType: '选择', fast: 25, ok: 50, n: 4 });
          }
          if (t === 4) {
            var e1 = pick([198, 203, 297, 305, 398, 402, 497, 503, 598, 603, 697, 702]);
            var e2 = pick([198, 203, 297, 305, 398, 402, 497, 503, 598, 603]);
            var est = Math.round(e1 / 100) * 100 + Math.round(e2 / 100) * 100;
            return C('估算：' + e1 + ' + ' + e2 + ' 大约是（ ）。', est,
              [est - 100, est + 100, est - 200, est + 200],
              '把 ' + e1 + ' 看作 ' + Math.round(e1 / 100) * 100 + '，' + e2 + ' 看作 ' + Math.round(e2 / 100) * 100 + '，大约等于 ' + est + '。',
              { paperType: '选择', fast: 25, ok: 50 });
          }
          if (t === 5) {
            var total5 = int(500, 900);
            var out5 = int(105, total5 - 100);
            return F('图书馆原来有 ' + total5 + ' 本故事书，借出了 ' + out5 + ' 本，还剩多少本？', total5 - out5,
              '求还剩多少，用减法：' + total5 + ' − ' + out5 + ' = ' + (total5 - out5) + ' 本。',
              { paperType: '解决问题', fast: 35, ok: 75, unit: '本', placeholder: '写答案' });
          }
          var judges = [
            { q: '计算 ' + 456 + ' + ' + 378 + ' 时，个位 6 + 8 = 14，要向十位进 1。（ ）', a: true, tip: '个位相加满十，要向十位进 1。' },
            { q: '减法验算可以用“差 + 减数 = 被减数”。（ ）', a: true, tip: '这是减法的验算方法。' },
            { q: '三位数加三位数，和一定是三位数。（ ）', a: false, tip: '例如 800 + 300 = 1100，和可能是四位数。' }
          ];
          var j = pick(judges);
          return J(j.q, j.a, j.tip, { paperType: '判断', fast: 18, ok: 40 });
        }
      },
      {
        id: 'm5',
        unit: '第五单元',
        title: '倍的认识',
        emoji: '🍎',
        goal: '理解“倍”，会求几倍和一份数',
        paperType: '解决问题、选择、判断',
        concept: {
          points: [
            '把较小的数看作 1 份，几倍就是这样的几份。',
            '求一个数的几倍是多少，用乘法：小数 × 倍数。',
            '求一个数是另一个数的几倍，用除法：大数 ÷ 小数。',
            '求 1 份是多少，也用除法：总数 ÷ 倍数。'
          ],
          example: '4 的 3 倍是 4 × 3 = 12；12 是 4 的 3 倍。'
        },
        fast: 25,
        ok: 55,
        make: function () {
          var t = int(1, 5);
          var a = int(2, 8);
          var b = int(2, 5);
          if (t === 1) {
            return F('苹果有 ' + a + ' 个，梨的个数是苹果的 ' + b + ' 倍。梨有多少个？', a * b,
              '求一个数的几倍是多少，用乘法：' + a + ' × ' + b + ' = ' + a * b + ' 个。',
              { paperType: '解决问题', unit: '个', fast: 30, ok: 65, placeholder: '写答案' });
          }
          if (t === 2) {
            return F('梨有 ' + a * b + ' 个，是苹果的 ' + b + ' 倍。苹果有多少个？', a,
              '求 1 份是多少，用除法：' + a * b + ' ÷ ' + b + ' = ' + a + ' 个。',
              { paperType: '解决问题', unit: '个', fast: 30, ok: 65, placeholder: '写答案' });
          }
          if (t === 3) {
            return F(a * b + ' 是 ' + b + ' 的多少倍？', a,
              '求一个数是另一个数的几倍，用除法：' + a * b + ' ÷ ' + b + ' = ' + a + '。',
              { paperType: '解决问题', unit: '倍', fast: 25, ok: 55, placeholder: '写答案' });
          }
          if (t === 4) {
            return C('求一个数的几倍是多少，应该用（ ）计算。', '乘法',
              ['除法', '加法', '减法'], '求一个数的几倍，就是求几个这样的数相加，用乘法。',
              { paperType: '选择', fast: 15, ok: 35, n: 4 });
          }
          var truth = Math.random() < 0.5;
          var shown = truth ? a : a + 1;
          return J(a * b + ' 是 ' + b + ' 的 ' + shown + ' 倍。（ ）', truth,
            a * b + ' ÷ ' + b + ' = ' + a + '，所以是 ' + a + ' 倍。',
            { paperType: '判断', fast: 18, ok: 40 });
        }
      },
      {
        id: 'm6',
        unit: '第六单元',
        title: '多位数乘一位数',
        emoji: '✖️',
        goal: '会笔算多位数乘一位数',
        paperType: '竖式计算、解决问题',
        concept: {
          points: [
            '从个位起，用一位数依次乘多位数的每一位。',
            '哪一位上的积满几十，就向前一位进几。',
            '0 和任何数相乘都得 0。',
            '整十、整百数乘一位数，可以先算前面的数，再添 0。'
          ],
          example: '24 × 3：4 × 3 = 12，写 2 进 1；2 × 3 = 6，再加进位 1 得 7，所以是 72。'
        },
        fast: 30,
        ok: 65,
        make: function () {
          var t = int(1, 6);
          if (t === 1) {
            var a1 = int(12, 49);
            var b1 = int(2, 9);
            return F('用竖式计算：' + a1 + ' × ' + b1, a1 * b1,
              '从个位乘起：' + a1 + ' × ' + b1 + ' = ' + a1 * b1 + '，注意进位。',
              { paperType: '竖式计算', fast: 30, ok: 65, vertical: { top: a1, bottom: b1, op: '×' }, placeholder: '写得数' });
          }
          if (t === 2) {
            var a2 = int(112, 399);
            var b2 = int(2, 4);
            return F('用竖式计算：' + a2 + ' × ' + b2, a2 * b2,
              '用 ' + b2 + ' 依次乘百位、十位、个位，' + a2 + ' × ' + b2 + ' = ' + a2 * b2 + '。',
              { paperType: '竖式计算', fast: 35, ok: 75, vertical: { top: a2, bottom: b2, op: '×' }, placeholder: '写得数' });
          }
          if (t === 3) {
            var a3 = Math.random() < 0.5 ? int(2, 9) * 10 : int(2, 9) * 100;
            var b3 = int(2, 9);
            return F(a3 + ' × ' + b3 + ' =', a3 * b3,
              '先算 ' + a3 / (a3 >= 100 ? 100 : 10) + ' × ' + b3 + ' = ' + a3 * b3 / (a3 >= 100 ? 100 : 10) + '，再添' + (a3 >= 100 ? '两' : '一') + '个 0，得 ' + a3 * b3 + '。',
              { paperType: '口算', fast: 15, ok: 35, placeholder: '写得数' });
          }
          if (t === 4) {
            var a4 = int(12, 48);
            var b4 = int(2, 9);
            return F('每盒有 ' + a4 + ' 支彩笔，' + b4 + ' 盒一共有多少支？', a4 * b4,
              '求几个相同加数的和，用乘法：' + a4 + ' × ' + b4 + ' = ' + a4 * b4 + ' 支。',
              { paperType: '解决问题', unit: '支', fast: 30, ok: 65, placeholder: '写答案' });
          }
          if (t === 5) {
            var g5 = int(2, 4);
            var p5 = int(3, 6);
            return F('看图列式：一共有多少个？', g5 * p5,
              '每盘 ' + p5 + ' 个，有 ' + g5 + ' 盘，就是 ' + g5 + ' 个 ' + p5 + '，用乘法：' + p5 + ' × ' + g5 + ' = ' + (g5 * p5) + '。',
              { svg: QB.pic.groups(g5, p5), paperType: '看图列式', fast: 20, ok: 45, unit: '个', placeholder: '写得数' });
          }
          var judges = [
            { q: '0 × 9 = 9。（ ）', a: false, tip: '0 和任何数相乘都得 0。' },
            { q: '24 × 3 = 72。（ ）', a: true, tip: '4 × 3 = 12，写 2 进 1；2 × 3 + 1 = 7，所以是 72。' },
            { q: '笔算多位数乘一位数，要从个位乘起。（ ）', a: true, tip: '笔算乘法从个位算起，满几十向前一位进几。' }
          ];
          var j = pick(judges);
          return J(j.q, j.a, j.tip, { paperType: '判断', fast: 15, ok: 35 });
        }
      },
      {
        id: 'm7',
        unit: '第七单元',
        title: '长方形和正方形',
        emoji: '🔲',
        goal: '认识长方形、正方形，会算周长',
        paperType: '解决问题、判断、选择',
        concept: {
          points: [
            '封闭图形一周的长度，就是它的周长。',
            '长方形周长 =（长 + 宽）× 2。',
            '正方形周长 = 边长 × 4。',
            '长方形对边相等，四个角都是直角；正方形四条边都相等。'
          ],
          example: '长 6 厘米、宽 4 厘米的长方形，周长 =（6 + 4）× 2 = 20 厘米。'
        },
        fast: 25,
        ok: 55,
        make: function () {
          var t = int(1, 5);
          if (t === 1) {
            var s1 = int(3, 12);
            return F('一个正方形的边长是 ' + s1 + ' 厘米，它的周长是多少厘米？', s1 * 4,
              '正方形周长 = 边长 × 4 = ' + s1 + ' × 4 = ' + s1 * 4 + ' 厘米。',
              { paperType: '解决问题', unit: '厘米', fast: 25, ok: 55, placeholder: '写答案' });
          }
          if (t === 2) {
            var l2 = int(5, 12);
            var w2 = int(2, l2 - 1);
            return F('一个长方形长 ' + l2 + ' 厘米，宽 ' + w2 + ' 厘米，它的周长是多少厘米？', (l2 + w2) * 2,
              '长方形周长 =（长 + 宽）× 2 =（' + l2 + ' + ' + w2 + '）× 2 = ' + (l2 + w2) * 2 + ' 厘米。',
              { svg: QB.pic.rect(l2, w2), paperType: '解决问题', unit: '厘米', fast: 30, ok: 65, placeholder: '写答案' });
          }
          if (t === 3) {
            var s3 = int(3, 10);
            return F('一个正方形的周长是 ' + s3 * 4 + ' 厘米，它的边长是多少厘米？', s3,
              '正方形周长 ÷ 4 = 边长，' + s3 * 4 + ' ÷ 4 = ' + s3 + ' 厘米。',
              { paperType: '解决问题', unit: '厘米', fast: 25, ok: 55, placeholder: '写答案' });
          }
          if (t === 4) {
            var l4 = int(5, 12);
            var w4 = int(2, l4 - 1);
            var c4 = (l4 + w4) * 2;
            return F('一个长方形的周长是 ' + c4 + ' 厘米，长是 ' + l4 + ' 厘米，宽是多少厘米？', w4,
              '周长 ÷ 2 = 长 + 宽，' + c4 + ' ÷ 2 = ' + (l4 + w4) + '，宽 = ' + (l4 + w4) + ' − ' + l4 + ' = ' + w4 + ' 厘米。',
              { paperType: '解决问题', unit: '厘米', fast: 30, ok: 65, placeholder: '写答案' });
          }
          var judges = [
            { q: '长方形的对边相等，四个角都是直角。（ ）', a: true, tip: '这是长方形的特征。' },
            { q: '正方形的四条边都相等。（ ）', a: true, tip: '正方形四条边相等，四个角都是直角。' },
            { q: '长方形的周长 = 长 + 宽 × 2。（ ）', a: false, tip: '长方形周长 =（长 + 宽）× 2，不能漏掉括号。' },
            { q: '周长相等的两个长方形，形状一定相同。（ ）', a: false, tip: '周长相等，长和宽可能不同，形状不一定相同。' }
          ];
          var j = pick(judges);
          return J(j.q, j.a, j.tip, { paperType: '判断', fast: 18, ok: 40 });
        }
      },
      {
        id: 'm8',
        unit: '第八单元',
        title: '分数的初步认识',
        emoji: '🍰',
        goal: '认识分数，会比较和简单计算',
        paperType: '选择、判断、填空',
        concept: {
          points: [
            '把一个整体平均分成若干份，其中的一份或几份可以用分数表示。',
            '分母表示平均分成几份，分子表示取了几份。',
            '同分母分数比大小：分子大的分数大。',
            '分子相同，分母小的分数大。'
          ],
          example: '把蛋糕平均分成 4 份，每份是 1/4，3 份是 3/4。'
        },
        fast: 15,
        ok: 35,
        make: function () {
          var t = int(1, 6);
          if (t === 1) {
            var n1 = int(2, 9);
            return C('把一个蛋糕平均分成 ' + n1 + ' 份，每份是它的（ ）。',
              '1/' + n1, ['1/' + (n1 + 1), '2/' + n1, n1 + '/1'],
              '平均分成 ' + n1 + ' 份，每份就是 1/' + n1 + '。', { paperType: '选择', fast: 15, ok: 35, n: 4 });
          }
          if (t === 2) {
            var d2 = int(3, 9);
            var f2 = int(1, d2 - 1);
            return F(f2 + '/' + d2 + ' 表示把整体平均分成（ ）份，取其中的 ' + f2 + ' 份。', d2,
              '分母 ' + d2 + ' 表示平均分成 ' + d2 + ' 份，分子 ' + f2 + ' 表示取了 ' + f2 + ' 份。',
              { paperType: '填空', fast: 15, ok: 35, placeholder: '填份数' });
          }
          if (t === 3) {
            var d3 = int(4, 9);
            var x3 = int(1, d3 - 2);
            var y3 = int(x3 + 1, d3 - 1);
            return C(x3 + '/' + d3 + ' 和 ' + y3 + '/' + d3 + ' 比较，（ ）更大。',
              y3 + '/' + d3, [x3 + '/' + d3, '一样大', (x3 + y3) + '/' + d3],
              '同分母分数比大小，分子大的分数大，所以 ' + y3 + '/' + d3 + ' 更大。', { paperType: '选择', fast: 15, ok: 35 });
          }
          if (t === 4) {
            var num4 = int(1, 3);
            var a4 = int(3, 5);
            var b4 = a4 + int(1, 3);
            return C(num4 + '/' + a4 + ' 和 ' + num4 + '/' + b4 + ' 比较，（ ）更大。',
              num4 + '/' + a4, [num4 + '/' + b4, '一样大', (num4 * 2) + '/' + (a4 + b4)],
              '分子相同，分母小的分数大，所以 ' + num4 + '/' + a4 + ' 更大。', { paperType: '选择', fast: 15, ok: 35 });
          }
          if (t === 5) {
            var d5 = int(5, 9);
            var a5 = int(1, d5 - 3);
            var b5 = int(1, d5 - 1 - a5);
            var s5 = a5 + b5;
            return F(a5 + '/' + d5 + ' + ' + b5 + '/' + d5 + ' =（ ）', s5 + '/' + d5,
              '同分母分数相加，分母不变，分子相加：' + a5 + ' + ' + b5 + ' = ' + s5 + '，得 ' + s5 + '/' + d5 + '。',
              { paperType: '填空', fast: 18, ok: 40, inputMode: 'text', placeholder: '如 5/8' });
          }
          var judges = [
            { q: '把一块饼平均分成 3 份，每份是它的 1/3。（ ）', a: true, tip: '平均分成 3 份，每份就是 1/3。' },
            { q: '3/5 的分子是 5。（ ）', a: false, tip: '3/5 的分子是 3，分母是 5。' },
            { q: '同分母分数比大小，分子大的分数大。（ ）', a: true, tip: '分母相同，表示每一份一样大，分子越大，取的份数越多。' },
            { q: '1/2 比 1/3 小。（ ）', a: false, tip: '分子相同，分母小的分数大，所以 1/2 比 1/3 大。' }
          ];
          var j = pick(judges);
          return J(j.q, j.a, j.tip, { paperType: '判断', fast: 15, ok: 35 });
        }
      }
    ]
  });
})();
