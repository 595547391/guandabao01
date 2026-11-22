/* 英语 · 人教版 PEP 三年级上册 题库
 * 题型对齐普通试卷：字母书写、看图选词、单项选择、情景交际、判断。
 */
(function () {
  var int = QB.int;
  var pick = QB.pick;

  function C(q, right, wrongs, tip, extra) {
    var c = QB.choice(right, wrongs, (extra && extra.n) || 3);
    var base = { q: q, kind: 'choice', options: c.options, answer: c.answer, tip: tip, paperType: '单项选择' };
    return Object.assign(base, extra || {});
  }

  function F(q, answers, tip, extra) {
    var base = {
      q: q,
      kind: 'fill',
      answers: [].concat(answers),
      displayAnswer: String([].concat(answers)[0]),
      tip: tip,
      paperType: '字母书写',
      inputMode: 'text'
    };
    return Object.assign(base, extra || {});
  }

  function J(q, answer, tip, extra) {
    var base = { q: q, kind: 'judge', answer: answer, tip: tip, paperType: '判断' };
    return Object.assign(base, extra || {});
  }

  var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  var greetings = [
    { q: '早上见到老师，你应该说：', right: 'Good morning!', wrongs: ['Good night!', 'Goodbye!'], tip: '早上问好用 Good morning!' },
    { q: '下午见到同学，你应该说：', right: 'Good afternoon!', wrongs: ['Good morning!', 'Good night!'], tip: '下午问好用 Good afternoon!' },
    { q: "—What's your name? —______", right: 'My name is Amy.', wrongs: ["I'm fine, thank you.", 'Goodbye!'], tip: '问名字用 My name is ... 回答。' },
    { q: '—How are you? —______', right: "I'm fine, thank you.", wrongs: ["I'm nine.", 'My name is Sam.'], tip: "How are you? 是问“你好吗”，回答 I'm fine, thank you." },
    { q: '—Goodbye! —______', right: 'Bye!', wrongs: ['Good night!', 'Thank you!'], tip: 'Goodbye 是再见，可以回答 Bye!' },
    { q: '—Hello! —______', right: 'Hello!', wrongs: ['Good night!', 'Thank you!'], tip: 'Hello 是打招呼，回答 Hello!' },
    { q: '晚上睡觉前，你会说：', right: 'Good night!', wrongs: ['Good morning!', 'Good afternoon!'], tip: '睡前道别用 Good night!' }
  ];

  var stationery = [
    { cn: '尺子', en: 'ruler', emoji: '📏' },
    { cn: '橡皮', en: 'eraser', emoji: '🧽' },
    { cn: '蜡笔', en: 'crayon', emoji: '🖍️' },
    { cn: '书包', en: 'bag', emoji: '🎒' },
    { cn: '钢笔', en: 'pen', emoji: '🖊️' },
    { cn: '铅笔', en: 'pencil', emoji: '✏️' },
    { cn: '铅笔盒', en: 'pencil box', emoji: '🧰' },
    { cn: '书', en: 'book', emoji: '📖' }
  ];

  var colours = [
    { cn: '红色', en: 'red', color: '#e53935' },
    { cn: '黄色', en: 'yellow', color: '#fdd835' },
    { cn: '蓝色', en: 'blue', color: '#1e88e5' },
    { cn: '绿色', en: 'green', color: '#43a047' },
    { cn: '黑色', en: 'black', color: '#212121' },
    { cn: '白色', en: 'white', color: '#ffffff' },
    { cn: '棕色', en: 'brown', color: '#8d6e63' },
    { cn: '橙色', en: 'orange', color: '#fb8c00' }
  ];

  var bodyParts = [
    { cn: '脸', en: 'face', emoji: '🙂' },
    { cn: '耳朵', en: 'ear', emoji: '👂' },
    { cn: '眼睛', en: 'eye', emoji: '👁️' },
    { cn: '鼻子', en: 'nose', emoji: '👃' },
    { cn: '嘴', en: 'mouth', emoji: '👄' },
    { cn: '胳膊', en: 'arm', emoji: '💪' },
    { cn: '手', en: 'hand', emoji: '🖐️' },
    { cn: '头', en: 'head', emoji: '🧑' },
    { cn: '身体', en: 'body', emoji: '🧍' },
    { cn: '腿', en: 'leg', emoji: '🦵' },
    { cn: '脚', en: 'foot', emoji: '🦶' }
  ];

  var animals = [
    { cn: '鸭子', en: 'duck', emoji: '🦆' },
    { cn: '猪', en: 'pig', emoji: '🐷' },
    { cn: '猫', en: 'cat', emoji: '🐱' },
    { cn: '熊', en: 'bear', emoji: '🐻' },
    { cn: '狗', en: 'dog', emoji: '🐶' },
    { cn: '大象', en: 'elephant', emoji: '🐘' },
    { cn: '猴子', en: 'monkey', emoji: '🐵' },
    { cn: '鸟', en: 'bird', emoji: '🐦' },
    { cn: '老虎', en: 'tiger', emoji: '🐯' },
    { cn: '熊猫', en: 'panda', emoji: '🐼' }
  ];

  var foods = [
    { cn: '面包', en: 'bread', emoji: '🍞' },
    { cn: '果汁', en: 'juice', emoji: '🧃' },
    { cn: '蛋', en: 'egg', emoji: '🥚' },
    { cn: '牛奶', en: 'milk', emoji: '🥛' },
    { cn: '水', en: 'water', emoji: '💧' },
    { cn: '蛋糕', en: 'cake', emoji: '🍰' },
    { cn: '鱼', en: 'fish', emoji: '🐟' },
    { cn: '米饭', en: 'rice', emoji: '🍚' }
  ];

  var numbers = [
    { cn: '一', en: 'one' }, { cn: '二', en: 'two' }, { cn: '三', en: 'three' },
    { cn: '四', en: 'four' }, { cn: '五', en: 'five' }, { cn: '六', en: 'six' },
    { cn: '七', en: 'seven' }, { cn: '八', en: 'eight' }, { cn: '九', en: 'nine' },
    { cn: '十', en: 'ten' }
  ];

  function otherEn(entries, entry) {
    return entries.filter(function (x) { return x !== entry; }).map(function (x) { return x.en; });
  }
  function otherCn(entries, entry) {
    return entries.filter(function (x) { return x !== entry; }).map(function (x) { return x.cn; });
  }
  function article(en) {
    return /^[aeiou]/i.test(en) ? 'an' : 'a';
  }

  // 同一单词有 3—4 种问法：看图选词、中译英、英译中、情景句
  function vocab(entry, pool, type, extra) {
    var forms = [2, 3, 4];
    if (entry.emoji || entry.color) forms.push(1, 1);
    var form = pick(forms);
    var c, q, paperType, tip;
    if (form === 1) {
      c = QB.choice(entry.en, QB.shuffle(otherEn(pool, entry)).slice(0, 3), 4);
      q = '看图，选择正确的单词。';
      paperType = '看图选词';
      tip = entry.en + ' —— ' + entry.cn + '。';
    } else if (form === 2) {
      c = QB.choice(entry.en, QB.shuffle(otherEn(pool, entry)).slice(0, 3), 4);
      q = '「' + entry.cn + '」的英文是？';
      paperType = '单项选择';
      tip = entry.cn + ' —— ' + entry.en;
    } else if (form === 3) {
      c = QB.choice(entry.cn, QB.shuffle(otherCn(pool, entry)).slice(0, 3), 4);
      q = '英语单词 ' + entry.en + ' 的意思是？';
      paperType = '单项选择';
      tip = entry.en + ' —— ' + entry.cn;
    } else if (type === 'colour') {
      c = QB.choice(entry.en, QB.shuffle(otherEn(pool, entry)).slice(0, 3), 4);
      q = '—What colour is it? —It\'s ___.（' + entry.cn + '）';
      paperType = '情景交际';
      tip = entry.cn + '是 ' + entry.en + '。';
    } else if (type === 'body') {
      c = QB.choice(entry.en, QB.shuffle(otherEn(pool, entry)).slice(0, 3), 4);
      q = 'This is my ___.（这是我的' + entry.cn + '）';
      paperType = '情景交际';
      tip = entry.cn + ' —— ' + entry.en;
    } else if (type === 'food') {
      c = QB.choice(entry.en, QB.shuffle(otherEn(pool, entry)).slice(0, 3), 4);
      q = '—I\'d like some ___.（我想要一些' + entry.cn + '）';
      paperType = '情景交际';
      tip = entry.cn + ' —— ' + entry.en;
    } else if (type === 'number') {
      c = QB.choice(entry.en, QB.shuffle(otherEn(pool, entry)).slice(0, 3), 4);
      q = '数字“' + entry.cn + '”用英语怎么说？';
      paperType = '单项选择';
      tip = entry.cn + ' —— ' + entry.en;
    } else {
      c = QB.choice(entry.en, QB.shuffle(otherEn(pool, entry)).slice(0, 3), 4);
      q = '—What\'s this? —It\'s ' + article(entry.en) + ' ___.（' + entry.cn + '）';
      paperType = '情景交际';
      tip = entry.cn + ' —— ' + entry.en + '。';
    }
    var base = {
      q: q,
      kind: 'choice',
      options: c.options,
      answer: c.answer,
      tip: tip,
      paperType: paperType,
      family: entry.en,
      fast: 10,
      ok: 22
    };
    if (form === 1) base.svg = QB.pic.word(entry);
    return Object.assign(base, extra || {});
  }

  QB.define({
    id: 'english',
    name: '英语',
    emoji: '🔤',
    color: 'green',
    desc: '人教版 PEP · 三年级上册',
    levels: [
      {
        id: 'e1',
        unit: '字母与问候',
        title: '字母书写与问候',
        emoji: '👋',
        goal: '会写大小写字母，会用日常问候语',
        paperType: '字母书写、情景交际、判断',
        concept: {
          points: [
            '26 个字母有大写和小写：A a、B b、C c……',
            '大写字母 E 的小写是 e，注意占格和笔顺。',
            '早上问好：Good morning! 下午问好：Good afternoon!',
            '问名字：What\'s your name? 答：My name is ...'
          ],
          example: '—Hello! —Hello!    —Goodbye! —Bye!'
        },
        fast: 15,
        ok: 30,
        make: function () {
          var t = int(1, 6);
          if (t === 1) {
            var i1 = int(0, 25);
            var upper = letters[i1];
            var lower = upper.toLowerCase();
            return F('写出大写字母 ' + upper + ' 的小写形式。', lower,
              upper + ' 的小写是 ' + lower + '，注意写在四线三格中的位置。',
              { paperType: '字母书写', fast: 15, ok: 30, placeholder: '写小写字母', accept: [upper] });
          }
          if (t === 2) {
            var i2 = int(0, 25);
            var lower2 = letters[i2].toLowerCase();
            return F('写出小写字母 ' + lower2 + ' 的大写形式。', letters[i2],
              lower2 + ' 的大写是 ' + letters[i2] + '。',
              { paperType: '字母书写', fast: 15, ok: 30, placeholder: '写大写字母', accept: [lower2] });
          }
          if (t === 3) {
            var start = int(0, 22);
            var blank = int(1, 2);
            var seq = [letters[start], letters[start + 1], letters[start + 2], letters[start + 3]];
            var correct = seq[blank];
            seq[blank] = '（ ）';
            return F('按字母表顺序补全：' + seq.join(' '), correct,
              '字母表顺序是 ' + letters.slice(start, start + 4).join('、') + '。',
              { paperType: '字母书写', fast: 15, ok: 30, placeholder: '写字母', accept: [correct.toLowerCase()] });
          }
          if (t === 4) {
            var a = int(0, 24);
            var b = a + 1;
            var truth = Math.random() < 0.5;
            var first = truth ? letters[a] : letters[b];
            var second = truth ? letters[b] : letters[a];
            return J('字母 ' + first + ' 排在 ' + second + ' 前面。（ ）', truth,
              '字母表顺序：' + letters[a] + '、' + letters[b] + '。',
              { paperType: '判断', fast: 10, ok: 22 });
          }
          var g = pick(greetings);
          return C(g.q, g.right, g.wrongs, g.tip, { paperType: '情景交际', fast: 10, ok: 22 });
        }
      },
      {
        id: 'e2',
        unit: 'Unit 1',
        title: '文具 · 看图选词',
        emoji: '✏️',
        goal: '认识 8 个文具单词，会说 I have a ...',
        paperType: '看图选词、单项选择、情景交际',
        concept: {
          points: [
            'Unit 1 文具：ruler 尺子、eraser 橡皮、crayon 蜡笔、bag 书包。',
            '还有：pen 钢笔、pencil 铅笔、pencil box 铅笔盒、book 书。',
            '表达“我有……”：I have a ...',
            '展示物品：Show me your ...'
          ],
          example: 'I have a ruler. 我有一把尺子。'
        },
        fast: 12,
        ok: 25,
        make: function () {
          if (Math.random() < 0.72) return vocab(pick(stationery), stationery, 'stationery');
          var qs = [
            { q: '—I have a ___.（我有一个书包）', right: 'bag', wrongs: ['pen', 'book', 'ruler'], tip: 'bag 是书包。', f: 's1' },
            { q: '—Show me your ___.（给我看看你的钢笔）', right: 'pen', wrongs: ['pencil', 'bag', 'book'], tip: 'pen 是钢笔。', f: 's2' },
            { q: '“铅笔盒”用英语说是：', right: 'pencil box', wrongs: ['pencil', 'book', 'bag'], tip: 'pencil box 是铅笔盒。', f: 's3' },
            { q: '—I have a ___.（我有一支蜡笔）', right: 'crayon', wrongs: ['pen', 'eraser', 'book'], tip: 'crayon 是蜡笔。', f: 's4' },
            { q: '—What\'s this? —It\'s an ___.（这是一块橡皮）', right: 'eraser', wrongs: ['ruler', 'crayon', 'book'], tip: 'eraser 是橡皮，元音开头前面用 an。', f: 's5' }
          ];
          var f = pick(qs);
          return C(f.q, f.right, f.wrongs, f.tip, { paperType: '单项选择', fast: 10, ok: 22, n: 4, family: f.f });
        }
      },
      {
        id: 'e3',
        unit: 'Unit 2',
        title: '颜色 · 看图选词',
        emoji: '🎨',
        goal: '认识 8 种颜色，会问颜色',
        paperType: '看图选词、单项选择、情景交际',
        concept: {
          points: [
            'Unit 2 颜色：red 红色、yellow 黄色、blue 蓝色、green 绿色。',
            '还有：black 黑色、white 白色、brown 棕色、orange 橙色。',
            '问颜色：What colour is it?',
            '答颜色：It\'s red / blue ...'
          ],
          example: '—What colour is it? —It\'s red.'
        },
        fast: 12,
        ok: 25,
        make: function () {
          if (Math.random() < 0.72) return vocab(pick(colours), colours, 'colour');
          var qs = [
            { q: '—What colour is the sky? —It\'s ___.', right: 'blue', wrongs: ['brown', 'black', 'yellow'], tip: '天空是蓝色的，blue。', f: 's1' },
            { q: '香蕉通常是 ___。', right: 'yellow', wrongs: ['blue', 'red', 'black'], tip: '香蕉是黄色的，yellow。', f: 's2' },
            { q: '树叶在春天通常是 ___。', right: 'green', wrongs: ['black', 'white', 'brown'], tip: '绿叶是 green。', f: 's3' },
            { q: '—What colour is your bag? —It\'s ___.（棕色）', right: 'brown', wrongs: ['blue', 'red', 'white'], tip: '棕色是 brown。', f: 's4' },
            { q: '—What colour is snow? —It\'s ___.', right: 'white', wrongs: ['black', 'red', 'green'], tip: '雪是白色的，white。', f: 's5' }
          ];
          var f = pick(qs);
          return C(f.q, f.right, f.wrongs, f.tip, { paperType: '单项选择', fast: 10, ok: 22, n: 4, family: f.f });
        }
      },
      {
        id: 'e4',
        unit: 'Unit 3',
        title: '身体部位 · 看图选词',
        emoji: '🙂',
        goal: '认识 11 个身体部位单词',
        paperType: '看图选词、情景交际',
        concept: {
          points: [
            'Unit 3 身体部位：face 脸、ear 耳朵、eye 眼睛、nose 鼻子、mouth 嘴。',
            '还有：arm 胳膊、hand 手、head 头、body 身体、leg 腿、foot 脚。',
            '介绍身体部位：This is my ...',
            '眼睛和耳朵常成对出现，复数是 eyes、ears。'
          ],
          example: 'This is my nose. 这是我的鼻子。'
        },
        fast: 12,
        ok: 25,
        make: function () {
          if (Math.random() < 0.72) return vocab(pick(bodyParts), bodyParts, 'body');
          var qs = [
            { q: 'We smell with our ___.（我们用鼻子闻）', right: 'nose', wrongs: ['ear', 'hand', 'foot'], tip: 'nose 是鼻子。', f: 's1' },
            { q: 'We eat with our ___.（我们用嘴吃东西）', right: 'mouth', wrongs: ['eye', 'arm', 'leg'], tip: 'mouth 是嘴。', f: 's2' },
            { q: 'We see with our ___.（我们用眼睛看）', right: 'eyes', wrongs: ['ears', 'hands', 'feet'], tip: '眼睛是 eye，两只眼睛用 eyes。', f: 's3' },
            { q: 'We hear with our ___.（我们用耳朵听）', right: 'ears', wrongs: ['eyes', 'legs', 'arms'], tip: '耳朵是 ear，两只耳朵用 ears。', f: 's4' },
            { q: 'We walk with our ___.（我们用腿走路）', right: 'legs', wrongs: ['eyes', 'ears', 'hands'], tip: '腿是 leg，两条腿用 legs。', f: 's5' }
          ];
          var f = pick(qs);
          return C(f.q, f.right, f.wrongs, f.tip, { paperType: '情景交际', fast: 10, ok: 22, n: 4, family: f.f });
        }
      },
      {
        id: 'e5',
        unit: 'Unit 4',
        title: '动物 · 看图选词',
        emoji: '🐼',
        goal: '认识 10 个动物单词',
        paperType: '看图选词、单项选择、情景交际',
        concept: {
          points: [
            'Unit 4 动物：duck 鸭子、pig 猪、cat 猫、bear 熊、dog 狗。',
            '还有：elephant 大象、monkey 猴子、bird 鸟、tiger 老虎、panda 熊猫。',
            '问动物：What\'s this?',
            '答动物：It\'s a ... / It\'s an elephant.（元音开头用 an）'
          ],
          example: '—What\'s this? —It\'s a panda.'
        },
        fast: 12,
        ok: 25,
        make: function () {
          if (Math.random() < 0.72) return vocab(pick(animals), animals, 'animal');
          var qs = [
            { q: '会飞的动物是 ___。', right: 'bird', wrongs: ['fish', 'pig', 'cat'], tip: 'bird 是鸟。', f: 's1' },
            { q: '喜欢吃香蕉的动物是 ___。', right: 'monkey', wrongs: ['duck', 'tiger', 'bear'], tip: 'monkey 是猴子。', f: 's2' },
            { q: '身上有黑白花纹的中国国宝是 ___。', right: 'panda', wrongs: ['tiger', 'bear', 'pig'], tip: 'panda 是熊猫。', f: 's3' },
            { q: '—What\'s this? —It\'s an ___.（大象）', right: 'elephant', wrongs: ['dog', 'cat', 'pig'], tip: 'elephant 以元音开头，前面用 an。', f: 's4' },
            { q: '—Is this a duck? —Yes, it is a ___.（鸭子）', right: 'duck', wrongs: ['dog', 'bird', 'cat'], tip: 'duck 是鸭子。', f: 's5' }
          ];
          var f = pick(qs);
          return C(f.q, f.right, f.wrongs, f.tip, { paperType: '单项选择', fast: 10, ok: 22, n: 4, family: f.f });
        }
      },
      {
        id: 'e6',
        unit: 'Unit 5 · Unit 6',
        title: '食物与数字',
        emoji: '🍰',
        goal: '认识食物单词和 1—10，会问年龄',
        paperType: '情景交际、看图选词、单项选择',
        concept: {
          points: [
            'Unit 5 食物：bread 面包、juice 果汁、egg 蛋、milk 牛奶。',
            '还有：water 水、cake 蛋糕、fish 鱼、rice 米饭。',
            'Unit 6 数字 1—10：one, two, three, four, five, six, seven, eight, nine, ten。',
            '问年龄：How old are you? 答：I\'m nine.'
          ],
          example: '—How old are you? —I\'m nine. 我九岁。'
        },
        fast: 15,
        ok: 30,
        make: function () {
          var t = int(1, 10);
          if (t <= 4) return vocab(pick(foods), foods, 'food');
          if (t <= 8) return vocab(pick(numbers), numbers, 'number');
          var ss = [
            { q: '—How old are you? —I\'m ___.（9 岁）', right: 'nine', wrongs: ['five', 'six', 'ten'], tip: '9 —— nine。', f: 's1' },
            { q: '—How many books? —___（5 本）', right: 'five', wrongs: ['four', 'six', 'nine'], tip: '5 —— five。', f: 's2' },
            { q: 'one + two = ___', right: 'three', wrongs: ['four', 'five', 'two'], tip: '1 + 2 = 3，three。', f: 's3' },
            { q: 'four + five = ___', right: 'nine', wrongs: ['eight', 'ten', 'seven'], tip: '4 + 5 = 9，nine。', f: 's4' },
            { q: '早餐常喝的白色饮品是 ___。', right: 'milk', wrongs: ['juice', 'water', 'rice'], tip: 'milk 是牛奶。', f: 's5' },
            { q: '—Happy birthday! —___', right: 'Thank you.', wrongs: ['Good night!', 'I\'m nine.'], tip: '别人祝你生日快乐，要回答 Thank you.', f: 's6' }
          ];
          var s = pick(ss);
          return C(s.q, s.right, s.wrongs, s.tip, { paperType: '情景交际', fast: 12, ok: 25, n: 4, family: s.f });
        }
      }
    ]
  });
})();
