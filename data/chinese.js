/* 语文 · 部编版三年级上册 题库
 * 题型对齐普通试卷：看拼音写词语、选择正确读音、词语搭配、古诗填空、句子仿写、课内阅读。
 * 每关维护精选事实池，随机抽取并变换问法。
 */
(function () {
  var int = QB.int;
  var pick = QB.pick;

  function C(q, right, wrongs, tip, extra) {
    var c = QB.choice(right, wrongs, (extra && extra.n) || 3);
    var base = { q: q, kind: 'choice', options: c.options, answer: c.answer, tip: tip, paperType: '选择' };
    return Object.assign(base, extra || {});
  }

  function J(q, answer, tip, extra) {
    var base = { q: q, kind: 'judge', answer: answer, tip: tip, paperType: '判断' };
    return Object.assign(base, extra || {});
  }

  /* ---------------- 看拼音选字 ---------------- */
  // bi = 要考的字在词语中的位置；wrongs = 同音字或形近字
  var words = [
    { w: '游戏', p: 'yóu xì', bi: 0, m: '玩耍、娱乐', wrongs: ['油', '由', '尤'] },
    { w: '鲜艳', p: 'xiān yàn', bi: 0, m: '颜色明亮好看', wrongs: ['仙', '先', '掀'] },
    { w: '服装', p: 'fú zhuāng', bi: 0, m: '衣服', wrongs: ['福', '扶', '幅'] },
    { w: '打招呼', p: 'dǎ zhāo hu', bi: 0, m: '用语言或动作问候', wrongs: ['朝', '照', '找'] },
    { w: '敬礼', p: 'jìng lǐ', bi: 0, m: '恭敬地行礼', wrongs: ['静', '净', '境'] },
    { w: '教室', p: 'jiào shì', bi: 0, m: '上课的房间', wrongs: ['是', '事', '试'] },
    { w: '朗读', p: 'lǎng dú', bi: 0, m: '大声地读', wrongs: ['浪', '郎', '狼'] },
    { w: '安静', p: 'ān jìng', bi: 0, m: '没有声音', wrongs: ['净', '敬', '竞'] },
    { w: '树枝', p: 'shù zhī', bi: 1, m: '树的分支', wrongs: ['支', '知', '肢'] },
    { w: '古老', p: 'gǔ lǎo', bi: 0, m: '年代久远', wrongs: ['故', '鼓', '谷'] },
    { w: '铜钟', p: 'tóng zhōng', bi: 0, m: '铜做的钟', wrongs: ['同', '童', '桐'] },
    { w: '招引', p: 'zhāo yǐn', bi: 1, m: '吸引', wrongs: ['饮', '隐', '影'] },
    { w: '整洁', p: 'zhěng jié', bi: 1, m: '干净整齐', wrongs: ['结', '节', '杰'] },
    { w: '秋雨', p: 'qiū yǔ', bi: 0, m: '秋天的雨', wrongs: ['丘', '球', '求'] },
    { w: '钥匙', p: 'yào shi', bi: 1, m: '开锁的工具', wrongs: ['是', '事', '时'] },
    { w: '邮票', p: 'yóu piào', bi: 0, m: '寄信用的凭证', wrongs: ['油', '由', '游'] },
    { w: '飘落', p: 'piāo luò', bi: 0, m: '随风落下', wrongs: ['漂', '票', '瓢'] },
    { w: '仙子', p: 'xiān zǐ', bi: 0, m: '神话里的仙女', wrongs: ['先', '鲜', '掀'] },
    { w: '淡黄', p: 'dàn huáng', bi: 0, m: '浅浅的黄色', wrongs: ['蛋', '弹', '诞'] },
    { w: '闻到', p: 'wén dào', bi: 0, m: '用鼻子嗅到', wrongs: ['文', '纹', '蚊'] },
    { w: '梨香', p: 'lí xiāng', bi: 0, m: '梨的香味', wrongs: ['离', '黎', '犁'] },
    { w: '勾住', p: 'gōu zhù', bi: 0, m: '拉住、挂住', wrongs: ['沟', '钩', '购'] },
    { w: '油亮', p: 'yóu liàng', bi: 0, m: '光亮润泽', wrongs: ['由', '邮', '犹'] },
    { w: '潮湿', p: 'cháo shī', bi: 0, m: '含水分多', wrongs: ['朝', '嘲', '巢'] },
    { w: '凌乱', p: 'líng luàn', bi: 0, m: '杂乱不整齐', wrongs: ['铃', '灵', '零'] },
    { w: '增添', p: 'zēng tiān', bi: 1, m: '增加', wrongs: ['天', '田', '填'] },
    { w: '棕红色', p: 'zōng hóng sè', bi: 0, m: '像棕毛的红褐色', wrongs: ['宗', '综', '踪'] },
    { w: '金色', p: 'jīn sè', bi: 0, m: '像金子一样的颜色', wrongs: ['今', '斤', '津'] },
    { w: '放晴', p: 'fàng qíng', bi: 1, m: '雨后天晴', wrongs: ['睛', '情', '请'] },
    { w: '明朗', p: 'míng lǎng', bi: 0, m: '光线充足、清晰', wrongs: ['名', '鸣', '铭'] },
    { w: '排列', p: 'pái liè', bi: 1, m: '按顺序摆放', wrongs: ['烈', '裂', '例'] },
    { w: '规则', p: 'guī zé', bi: 1, m: '大家要遵守的规定', wrongs: ['责', '侧', '测'] },
    { w: '迟到', p: 'chí dào', bi: 0, m: '到得比规定时间晚', wrongs: ['池', '持', '词'] },
    { w: '水泥', p: 'shuǐ ní', bi: 1, m: '建筑材料', wrongs: ['尼', '呢', '你'] },
    { w: '脚印', p: 'jiǎo yìn', bi: 1, m: '脚踩出的痕迹', wrongs: ['应', '映', '饮'] },
    { w: '歌唱', p: 'gē chàng', bi: 1, m: '唱歌', wrongs: ['倡', '畅', '昌'] },
    { w: '丰收', p: 'fēng shōu', bi: 0, m: '收成好', wrongs: ['风', '峰', '蜂'] },
    { w: '谷粒', p: 'gǔ lì', bi: 1, m: '谷物的颗粒', wrongs: ['立', '力', '历'] },
    { w: '湿润', p: 'shī rùn', bi: 1, m: '潮湿润泽', wrongs: ['闰', '认', '任'] },
    { w: '观察', p: 'guān chá', bi: 1, m: '仔细地看', wrongs: ['查', '茶', '擦'] },
    { w: '合拢', p: 'hé lǒng', bi: 1, m: '合在一起', wrongs: ['龙', '笼', '聋'] },
    { w: '有趣', p: 'yǒu qù', bi: 1, m: '有意思', wrongs: ['去', '取', '区'] }
  ];

  var lookalikes = [
    { s: '我（ ）在座位上，认真地听老师讲课。', right: '坐', wrongs: ['座', '做'], tip: '“坐”表示坐下的动作，下面是“土”。' },
    { s: '妈妈把（ ）位让给了一位老奶奶。', right: '座', wrongs: ['坐', '做'], tip: '“座位”的“座”表示位置，上面有“广”。' },
    { s: '今天（ ）次来到公园，我很开心。', right: '再', wrongs: ['在', '载'], tip: '“再”表示又一次。' },
    { s: '小鸟（ ）树上快乐地唱歌。', right: '在', wrongs: ['再', '载'], tip: '“在”表示地点。' },
    { s: '我帮妈妈（ ）家务。', right: '做', wrongs: ['作', '坐'], tip: '“做”表示从事某种活动。' },
    { s: '他的（ ）业写得很工整。', right: '作', wrongs: ['做', '坐'], tip: '“作业”的“作”是单人旁。' },
    { s: '妹妹（ ）上了红领巾。', right: '戴', wrongs: ['带', '袋'], tip: '“戴”是把东西放在头、颈、胸、手等处。' },
    { s: '老师（ ）我们去参观博物馆。', right: '带', wrongs: ['戴', '袋'], tip: '“带”表示带领。' },
    { s: '秋天到了，树（ ）慢慢变黄了。', right: '叶', wrongs: ['夜', '业'], tip: '“树叶”的“叶”是草字头。' },
    { s: '我们要保（ ）小动物。', right: '护', wrongs: ['户', '互'], tip: '“保护”的“护”是提手旁。' },
    { s: '周（ ），我和爸爸去爬山。', right: '末', wrongs: ['未', '抹'], tip: '“周末”的“末”上横长、下横短。' },
    { s: '我们（ ）来要当科学家。', right: '未', wrongs: ['末', '味'], tip: '“未来”的“未”上横短、下横长。' },
    { s: '小鸟的（ ）毛真漂亮。', right: '羽', wrongs: ['雨', '语'], tip: '“羽毛”的“羽”像两片羽毛。' },
    { s: '下课了，同学们在（ ）场上做游戏。', right: '操', wrongs: ['草', '澡'], tip: '“操场”的“操”是提手旁。' },
    { s: '湖水很（ ），能看见小鱼。', right: '清', wrongs: ['青', '情'], tip: '“清澈”的“清”是三点水。' },
    { s: '蜜蜂在花丛中（ ）蜜。', right: '采', wrongs: ['彩', '菜'], tip: '“采蜜”的“采”表示摘取。' },
    { s: '我（ ）经做完作业了。', right: '已', wrongs: ['以', '己'], tip: '“已经”的“已”表示完成。' },
    { s: '我们要（ ）惜粮食。', right: '珍', wrongs: ['真', '针'], tip: '“珍惜”的“珍”是王字旁。' },
    { s: '花园里开满了美丽的（ ）花。', right: '鲜', wrongs: ['仙', '先'], tip: '“鲜花”的“鲜”是鱼字旁。' },
    { s: '我们要遵守交通规（ ）。', right: '则', wrongs: ['侧', '测'], tip: '“规则”的“则”是立刀旁。' }
  ];

  /* ---------------- 多音字 ---------------- */
  var polyphones = [
    { word: '假期', char: '假', right: 'jià', wrongs: ['jiǎ', 'jiā'], tip: '“假期”的“假”读 jià，表示休息的日子。' },
    { word: '真假', char: '假', right: 'jiǎ', wrongs: ['jià', 'jiā'], tip: '“真假”的“假”读 jiǎ，表示不真实。' },
    { word: '理发', char: '发', right: 'fà', wrongs: ['fā', 'fǎ'], tip: '“理发”的“发”读 fà，指头发。' },
    { word: '发现', char: '发', right: 'fā', wrongs: ['fà', 'fǎ'], tip: '“发现”的“发”读 fā，表示发觉。' },
    { word: '睡觉', char: '觉', right: 'jiào', wrongs: ['jué', 'jiǎo'], tip: '“睡觉”的“觉”读 jiào。' },
    { word: '觉得', char: '觉', right: 'jué', wrongs: ['jiào', 'jiǎo'], tip: '“觉得”的“觉”读 jué，表示感觉。' },
    { word: '爱好', char: '好', right: 'hào', wrongs: ['hǎo', 'háo'], tip: '“爱好”的“好”读 hào，表示喜欢。' },
    { word: '好人', char: '好', right: 'hǎo', wrongs: ['hào', 'háo'], tip: '“好人”的“好”读 hǎo，表示善良。' },
    { word: '长大', char: '长', right: 'zhǎng', wrongs: ['cháng', 'zhàng'], tip: '“长大”的“长”读 zhǎng，表示生长。' },
    { word: '长短', char: '长', right: 'cháng', wrongs: ['zhǎng', 'chàng'], tip: '“长短”的“长”读 cháng，表示长度。' },
    { word: '音乐', char: '乐', right: 'yuè', wrongs: ['lè', 'yào'], tip: '“音乐”的“乐”读 yuè。' },
    { word: '快乐', char: '乐', right: 'lè', wrongs: ['yuè', 'lì'], tip: '“快乐”的“乐”读 lè，表示高兴。' },
    { word: '数学', char: '数', right: 'shù', wrongs: ['shǔ', 'shuò'], tip: '“数学”的“数”读 shù。' },
    { word: '数一数', char: '数', right: 'shǔ', wrongs: ['shù', 'shuò'], tip: '“数一数”的“数”读 shǔ，表示点数。' },
    { word: '种子', char: '种', right: 'zhǒng', wrongs: ['zhòng', 'zhōng'], tip: '“种子”的“种”读 zhǒng。' },
    { word: '种树', char: '种', right: 'zhòng', wrongs: ['zhǒng', 'zhōng'], tip: '“种树”的“种”读 zhòng，表示种植。' },
    { word: '银行', char: '行', right: 'háng', wrongs: ['xíng', 'héng'], tip: '“银行”的“行”读 háng。' },
    { word: '行走', char: '行', right: 'xíng', wrongs: ['háng', 'xìng'], tip: '“行走”的“行”读 xíng，表示走。' },
    { word: '相信', char: '相', right: 'xiāng', wrongs: ['xiàng', 'xiǎng'], tip: '“相信”的“相”读 xiāng。' },
    { word: '照相', char: '相', right: 'xiàng', wrongs: ['xiāng', 'xiǎng'], tip: '“照相”的“相”读 xiàng。' },
    { word: '首都', char: '都', right: 'dū', wrongs: ['dōu', 'dù'], tip: '“首都”的“都”读 dū，指国都。' },
    { word: '都是', char: '都', right: 'dōu', wrongs: ['dū', 'dòu'], tip: '“都是”的“都”读 dōu，表示全部。' },
    { word: '重新', char: '重', right: 'chóng', wrongs: ['zhòng', 'chōng'], tip: '“重新”的“重”读 chóng，表示再一次。' },
    { word: '重量', char: '重', right: 'zhòng', wrongs: ['chóng', 'zhōng'], tip: '“重量”的“重”读 zhòng。' },
    { word: '少年', char: '少', right: 'shào', wrongs: ['shǎo', 'shāo'], tip: '“少年”的“少”读 shào，指年纪轻。' },
    { word: '很少', char: '少', right: 'shǎo', wrongs: ['shào', 'shāo'], tip: '“很少”的“少”读 shǎo，表示数量小。' },
    { word: '干活', char: '干', right: 'gàn', wrongs: ['gān', 'gǎn'], tip: '“干活”的“干”读 gàn，表示做事。' },
    { word: '干净', char: '干', right: 'gān', wrongs: ['gàn', 'gǎn'], tip: '“干净”的“干”读 gān。' },
    { word: '教书', char: '教', right: 'jiāo', wrongs: ['jiào', 'jiǎo'], tip: '“教书”的“教”读 jiāo，表示传授。' },
    { word: '教室', char: '教', right: 'jiào', wrongs: ['jiāo', 'jiǎo'], tip: '“教室”的“教”读 jiào。' },
    { word: '天空', char: '空', right: 'kōng', wrongs: ['kòng', 'kǒng'], tip: '“天空”的“空”读 kōng。' },
    { word: '空地', char: '空', right: 'kòng', wrongs: ['kōng', 'kǒng'], tip: '“空地”的“空”读 kòng，表示空着的地方。' },
    { word: '一只', char: '只', right: 'zhī', wrongs: ['zhǐ', 'zhì'], tip: '“一只”的“只”读 zhī，是量词。' },
    { word: '只有', char: '只', right: 'zhǐ', wrongs: ['zhī', 'zhì'], tip: '“只有”的“只”读 zhǐ。' },
    { word: '后背', char: '背', right: 'bèi', wrongs: ['bēi', 'bèn'], tip: '“后背”的“背”读 bèi，指身体后面。' },
    { word: '背包', char: '背', right: 'bēi', wrongs: ['bèi', 'běn'], tip: '“背包”的“背”读 bēi，表示背在背上。' },
    { word: '转身', char: '转', right: 'zhuǎn', wrongs: ['zhuàn', 'zhuān'], tip: '“转身”的“转”读 zhuǎn，表示改变方向。' },
    { word: '转动', char: '转', right: 'zhuàn', wrongs: ['zhuǎn', 'zhuāng'], tip: '“转动”的“转”读 zhuàn，表示旋转。' }
  ];

  /* ---------------- 词语 ---------------- */
  var synonyms = [
    { w: '美丽', right: '漂亮', wrongs: ['难看', '整齐'], tip: '“美丽”和“漂亮”都形容好看。' },
    { w: '高兴', right: '愉快', wrongs: ['难过', '生气'], tip: '“高兴”和“愉快”都表示心情好。' },
    { w: '安静', right: '宁静', wrongs: ['热闹', '吵闹'], tip: '“安静”和“宁静”都表示没有声音。' },
    { w: '立刻', right: '马上', wrongs: ['慢慢', '悄悄'], tip: '“立刻”和“马上”都表示很快。' },
    { w: '仔细', right: '认真', wrongs: ['马虎', '粗心'], tip: '“仔细”和“认真”都表示用心。' },
    { w: '寒冷', right: '严寒', wrongs: ['炎热', '温暖'], tip: '“寒冷”和“严寒”都表示很冷。' },
    { w: '喜欢', right: '喜爱', wrongs: ['讨厌', '害怕'], tip: '“喜欢”和“喜爱”都表示有好感。' },
    { w: '著名', right: '有名', wrongs: ['普通', '无名'], tip: '“著名”和“有名”都表示名气大。' },
    { w: '连忙', right: '赶忙', wrongs: ['缓慢', '悠闲'], tip: '“连忙”和“赶忙”都表示赶快。' },
    { w: '忽然', right: '突然', wrongs: ['渐渐', '慢慢'], tip: '“忽然”和“突然”都表示出乎意料。' },
    { w: '勇敢', right: '英勇', wrongs: ['胆小', '害怕'], tip: '“勇敢”和“英勇”都表示不怕困难。' },
    { w: '茂盛', right: '繁茂', wrongs: ['枯萎', '稀疏'], tip: '“茂盛”和“繁茂”都表示植物长得好。' }
  ];

  var antonyms = [
    { w: '骄傲', right: '谦虚', wrongs: ['自豪', '得意'], tip: '“骄傲”和“谦虚”意思相反。' },
    { w: '危险', right: '安全', wrongs: ['可怕', '紧张'], tip: '“危险”和“安全”意思相反。' },
    { w: '失败', right: '成功', wrongs: ['挫折', '失望'], tip: '“失败”和“成功”意思相反。' },
    { w: '诚实', right: '虚伪', wrongs: ['老实', '真诚'], tip: '“诚实”和“虚伪”意思相反。' },
    { w: '潮湿', right: '干燥', wrongs: ['湿润', '阴冷'], tip: '“潮湿”和“干燥”意思相反。' },
    { w: '寒冷', right: '炎热', wrongs: ['冰冷', '凉爽'], tip: '“寒冷”和“炎热”意思相反。' },
    { w: '明亮', right: '昏暗', wrongs: ['光亮', '清楚'], tip: '“明亮”和“昏暗”意思相反。' },
    { w: '轻松', right: '沉重', wrongs: ['轻快', '舒服'], tip: '“轻松”和“沉重”意思相反。' },
    { w: '复杂', right: '简单', wrongs: ['困难', '麻烦'], tip: '“复杂”和“简单”意思相反。' },
    { w: '愚蠢', right: '聪明', wrongs: ['笨拙', '迟钝'], tip: '“愚蠢”和“聪明”意思相反。' }
  ];

  var measures = [
    { noun: '树叶', right: '片', wrongs: ['条', '朵'], tip: '树叶薄薄的，用“片”。' },
    { noun: '雨伞', right: '把', wrongs: ['张', '根'], tip: '有把手的东西常用“把”。' },
    { noun: '小桥', right: '座', wrongs: ['条', '朵'], tip: '桥、山、房子常用“座”。' },
    { noun: '小河', right: '条', wrongs: ['座', '朵'], tip: '长长的河流用“条”。' },
    { noun: '鲜花', right: '朵', wrongs: ['棵', '把'], tip: '花用“朵”。' },
    { noun: '大树', right: '棵', wrongs: ['朵', '条'], tip: '树木用“棵”。' },
    { noun: '小鸟', right: '只', wrongs: ['头', '匹'], tip: '小动物常用“只”。' },
    { noun: '蚂蚁', right: '群', wrongs: ['只', '条'], tip: '许多蚂蚁聚在一起用“群”。' },
    { noun: '大风', right: '阵', wrongs: ['朵', '棵'], tip: '一阵风，表示风持续的一段时间。' },
    { noun: '图画', right: '幅', wrongs: ['朵', '座'], tip: '图画用“幅”。' },
    { noun: '信', right: '封', wrongs: ['张', '本'], tip: '信装进信封，用“封”。' },
    { noun: '古诗', right: '首', wrongs: ['朵', '座'], tip: '诗、歌用“首”。' }
  ];

  var collocations = [
    { q: '（ ）的眼睛', right: '明亮', wrongs: ['鲜艳', '茂密'], tip: '“明亮的眼睛”搭配恰当。' },
    { q: '（ ）的服装', right: '鲜艳', wrongs: ['安静', '古老'], tip: '“鲜艳的服装”搭配恰当。' },
    { q: '（ ）的草地', right: '金色', wrongs: ['香甜', '整齐'], tip: '“金色的草地”搭配恰当。' },
    { q: '（ ）的树林', right: '茂密', wrongs: ['明亮', '迟到'], tip: '“茂密的树林”搭配恰当。' },
    { q: '（ ）的天空', right: '蔚蓝', wrongs: ['热闹', '丰收'], tip: '“蔚蓝的天空”搭配恰当。' },
    { q: '（ ）的小溪', right: '清澈', wrongs: ['鲜艳', '高大'], tip: '“清澈的小溪”搭配恰当。' },
    { q: '（ ）的歌声', right: '动听', wrongs: ['潮湿', '平整'], tip: '“动听的歌声”搭配恰当。' },
    { q: '（ ）的秋天', right: '凉爽', wrongs: ['明亮', '勇敢'], tip: '“凉爽的秋天”搭配恰当。' }
  ];

  /* ---------------- 古诗 ---------------- */
  var poems = [
    {
      title: '山行', author: '杜牧', dynasty: '唐',
      lines: ['远上寒山石径斜', '白云生处有人家', '停车坐爱枫林晚', '霜叶红于二月花'],
      meanings: [
        '沿着石头小路，向深秋的寒山深处走去。',
        '白云升腾的地方，住着几户人家。',
        '停下车来，是因为喜爱傍晚的枫林。',
        '被霜打过的枫叶，比二月的花还红。'
      ]
    },
    {
      title: '赠刘景文', author: '苏轼', dynasty: '宋',
      lines: ['荷尽已无擎雨盖', '菊残犹有傲霜枝', '一年好景君须记', '最是橙黄橘绿时'],
      meanings: [
        '荷花凋谢了，连那像雨伞一样的荷叶也没有了。',
        '菊花残了，但仍有不怕霜雪的枝干。',
        '一年中最好的景色，你一定要记住。',
        '就是橙子黄了、橘子绿了的时节。'
      ]
    },
    {
      title: '夜书所见', author: '叶绍翁', dynasty: '宋',
      lines: ['萧萧梧叶送寒声', '江上秋风动客情', '知有儿童挑促织', '夜深篱落一灯明'],
      meanings: [
        '梧桐叶沙沙作响，送来阵阵寒意。',
        '江上的秋风，勾起了游子的思乡之情。',
        '料想有孩子在捉蟋蟀。',
        '夜深了，篱笆边还有一盏灯亮着。'
      ]
    },
    {
      title: '望天门山', author: '李白', dynasty: '唐',
      lines: ['天门中断楚江开', '碧水东流至此回', '两岸青山相对出', '孤帆一片日边来'],
      meanings: [
        '天门山从中间断开，楚江奔腾而出。',
        '碧绿的江水向东流，到这里回旋。',
        '两岸的青山相对着出现在眼前。',
        '一片孤帆从太阳升起的地方驶来。'
      ]
    },
    {
      title: '饮湖上初晴后雨', author: '苏轼', dynasty: '宋',
      lines: ['水光潋滟晴方好', '山色空蒙雨亦奇', '欲把西湖比西子', '淡妆浓抹总相宜'],
      meanings: [
        '晴天时，西湖水波荡漾，景色正好。',
        '下雨时，山色迷蒙，也很奇妙。',
        '想把西湖比作美女西施。',
        '无论淡妆还是浓妆，都很合适。'
      ]
    },
    {
      title: '望洞庭', author: '刘禹锡', dynasty: '唐',
      lines: ['湖光秋月两相和', '潭面无风镜未磨', '遥望洞庭山水翠', '白银盘里一青螺'],
      meanings: [
        '湖光和秋月互相映衬，十分和谐。',
        '湖面没有风，像一面没有磨过的镜子。',
        '远远望去，洞庭湖的山水一片青翠。',
        '就像白银盘里放着一只青螺。'
      ]
    }
  ];
  var allPoemLines = [];
  poems.forEach(function (p) { allPoemLines = allPoemLines.concat(p.lines); });
  var allTitles = poems.map(function (p) { return '《' + p.title + '》'; });
  var allAuthors = ['杜牧', '苏轼', '叶绍翁', '李白', '刘禹锡', '杜甫', '王维', '白居易'];

  /* ---------------- 句子 ---------------- */
  var metaphorSets = [
    { right: '弯弯的月亮像一条小船。', body: '弯弯的月亮', word: '像', vehicle: '一条小船', structure: '……像……', wrongs: ['月亮慢慢地升起来了。', '小鸟在树上唱歌。', '我背着书包去上学。'] },
    { right: '云朵像一朵朵棉花糖。', body: '云朵', word: '像', vehicle: '一朵朵棉花糖', structure: '……像……', wrongs: ['云朵在天空中飘动。', '风吹过草地。', '弟弟在操场上跑步。'] },
    { right: '荷叶像一把绿色的大伞。', body: '荷叶', word: '像', vehicle: '一把绿色的大伞', structure: '……像……', wrongs: ['荷叶长在池塘里。', '青蛙在荷叶上跳。', '夏天到了。'] },
    { right: '秋天的雨，是一把钥匙。', body: '秋天的雨', word: '是', vehicle: '一把钥匙', structure: '……是……', wrongs: ['秋天的雨下个不停。', '秋天到了。', '秋风吹落了树叶。'] },
    { right: '细细的春雨像牛毛。', body: '细细的春雨', word: '像', vehicle: '牛毛', structure: '……像……', wrongs: ['春雨下了一整夜。', '小草发芽了。', '春天真美啊。'] }
  ];
  var personSets = [
    { right: '春风轻轻地抚摸着大地。', body: '春风', action: '轻轻地抚摸着大地', structure: '……事物 + 人的动作……', wrongs: ['春风吹过大地。', '春天来了。', '小草长出来了。'] },
    { right: '小鸟在枝头唱着欢快的歌。', body: '小鸟', action: '唱着欢快的歌', structure: '……事物 + 人的动作……', wrongs: ['小鸟在枝头叫。', '小鸟飞走了。', '树上有一只小鸟。'] },
    { right: '大树向人们点头问好。', body: '大树', action: '向人们点头问好', structure: '……事物 + 人的动作……', wrongs: ['大树长得很高。', '人们在树下乘凉。', '大树的叶子绿了。'] },
    { right: '花儿露出了笑脸。', body: '花儿', action: '露出了笑脸', structure: '……事物 + 人的动作……', wrongs: ['花儿开了。', '花园里有好多花。', '花香飘得很远。'] }
  ];
  var punctuation = [
    { s: '你今天怎么没来上学（ ）', right: '？', alt: '?', wrongs: ['。', '！'], tip: '这是疑问句，句末用问号。' },
    { s: '西湖的景色真美啊（ ）', right: '！', alt: '!', wrongs: ['。', '？'], tip: '这是感叹句，句末用感叹号。' },
    { s: '妈妈对我说（ ）快去写作业。', right: '：', alt: ':', wrongs: ['。', '？'], tip: '提示后面是要说的话，用冒号。' },
    { s: '我最喜欢的水果是苹果（ ）', right: '。', alt: '.', wrongs: ['？', '！'], tip: '这是陈述句，句末用句号。' },
    { s: '你今年几岁了（ ）', right: '？', alt: '?', wrongs: ['。', '！'], tip: '这是疑问句，句末用问号。' },
    { s: '这朵花真香啊（ ）', right: '！', alt: '!', wrongs: ['。', '？'], tip: '这是感叹句，句末用感叹号。' }
  ];
  var beiSentences = [
    { s: '小明把窗户关上了。', right: '窗户被小明关上了。', wrongs: ['小明被窗户关上了。', '窗户把小明关上了。', '小明把窗户被关上了。'] },
    { s: '雨水把衣服淋湿了。', right: '衣服被雨水淋湿了。', wrongs: ['雨水被衣服淋湿了。', '衣服把雨水淋湿了。', '雨水把衣服被淋湿了。'] },
    { s: '弟弟把牛奶喝完了。', right: '牛奶被弟弟喝完了。', wrongs: ['弟弟被牛奶喝完了。', '牛奶把弟弟喝完了。', '弟弟把牛奶被喝完了。'] }
  ];

  /* ---------------- 课内阅读 ---------------- */
  var reading = [
    { p: '早晨，从山坡上，从坪坝里，从一条条开着绒球花和太阳花的小路上，走来了许多小学生。', q: '这段话写的是什么时候的情景？', right: '早晨', wrongs: ['中午', '傍晚'], tip: '开头“早晨”点明了时间。' },
    { p: '早晨，从山坡上，从坪坝里，从一条条开着绒球花和太阳花的小路上，走来了许多小学生。', q: '这段话写的是谁走来了？', right: '许多小学生', wrongs: ['许多老师', '许多工人'], tip: '句子写的是小学生来上学。' },
    { p: '秋天的雨，是一把钥匙。它带着清凉和温柔，轻轻地把秋天的大门打开了。', q: '这段话把秋天的雨比作什么？', right: '一把钥匙', wrongs: ['一首歌', '一幅画'], tip: '“秋天的雨，是一把钥匙”是比喻句。' },
    { p: '秋天的雨，是一把钥匙。它带着清凉和温柔，轻轻地把秋天的大门打开了。', q: '秋天的雨给人怎样的感觉？', right: '清凉、温柔', wrongs: ['寒冷、凶猛', '炎热、干燥'], tip: '文中直接写了“清凉和温柔”。' },
    { p: '海底的岩石上生长着各种各样的珊瑚，有的像绽开的花朵，有的像分枝的鹿角。', q: '珊瑚有的像什么？', right: '花朵和鹿角', wrongs: ['小树和小草', '石头和沙子'], tip: '文中写珊瑚像花朵、像鹿角。' },
    { p: '海底的岩石上生长着各种各样的珊瑚，有的像绽开的花朵，有的像分枝的鹿角。', q: '这段话主要写哪里的景色？', right: '海底', wrongs: ['天空', '森林'], tip: '开头写“海底的岩石上”。' },
    { p: '春天，树木抽出新的枝条，长出嫩绿的叶子。山上的积雪融化了，雪水汇成小溪，淙淙地流着。', q: '这段话写的是哪个季节？', right: '春天', wrongs: ['夏天', '冬天'], tip: '开头“春天”点明季节。' },
    { p: '春天，树木抽出新的枝条，长出嫩绿的叶子。山上的积雪融化了，雪水汇成小溪，淙淙地流着。', q: '积雪融化后汇成了什么？', right: '小溪', wrongs: ['大河', '湖泊'], tip: '文中写“雪水汇成小溪”。' },
    { p: '它一下子冲进水里，不见了。可是，没一会儿，它飞起来了，红色的长嘴衔着一条小鱼。', q: '这段话写翠鸟在做什么？', right: '捕鱼', wrongs: ['筑巢', '唱歌'], tip: '翠鸟冲进水里，衔着一条小鱼。' },
    { p: '它一下子冲进水里，不见了。可是，没一会儿，它飞起来了，红色的长嘴衔着一条小鱼。', q: '翠鸟的嘴是什么颜色？', right: '红色', wrongs: ['黄色', '黑色'], tip: '文中写“红色的长嘴”。' },
    { p: '原来，蒲公英的花就像我们的手掌，可以张开、合上。花朵张开时，花瓣是金色的，草地也是金色的；花朵合拢时，金色的花瓣被包住了，草地就变成绿色的了。', q: '草地变成金色，是因为什么？', right: '蒲公英的花张开了', wrongs: ['太阳落山了', '小草枯黄了'], tip: '花朵张开时，草地是金色的。' },
    { p: '原来，蒲公英的花就像我们的手掌，可以张开、合上。花朵张开时，花瓣是金色的，草地也是金色的；花朵合拢时，金色的花瓣被包住了，草地就变成绿色的了。', q: '蒲公英的花被比作什么？', right: '手掌', wrongs: ['小伞', '喇叭'], tip: '文中写“就像我们的手掌”。' },
    { p: '风，是大自然的音乐家。他会在森林里演奏他的手风琴。', q: '风被比作什么？', right: '音乐家', wrongs: ['画家', '舞蹈家'], tip: '“风，是大自然的音乐家”把风当作人来写。' },
    { p: '风，是大自然的音乐家。他会在森林里演奏他的手风琴。', q: '风在哪里演奏？', right: '森林里', wrongs: ['沙漠里', '大海里'], tip: '文中写“在森林里演奏”。' },
    { p: '群儿戏于庭，一儿登瓮，足跌没水中。众皆弃去，光持石击瓮破之，水迸，儿得活。', q: '司马光用什么办法救出了小孩？', right: '拿石头砸破水缸', wrongs: ['大声呼救', '伸手去拉'], tip: '“光持石击瓮破之”就是拿石头砸破水缸。' },
    { p: '群儿戏于庭，一儿登瓮，足跌没水中。众皆弃去，光持石击瓮破之，水迸，儿得活。', q: '文中的“光”指谁？', right: '司马光', wrongs: ['一个小孩', '老师'], tip: '“光”是司马光的名字。' },
    { p: '列宁每次走到白桦树下，都要停下来，仰望这三只欢快的灰雀，还经常给它们带来面包渣和谷粒。', q: '列宁对灰雀怎么样？', right: '非常喜爱', wrongs: ['十分讨厌', '毫不在意'], tip: '列宁常常停下来观察，还给灰雀带食物。' },
    { p: '列宁每次走到白桦树下，都要停下来，仰望这三只欢快的灰雀，还经常给它们带来面包渣和谷粒。', q: '列宁给灰雀带来什么？', right: '面包渣和谷粒', wrongs: ['水和水果', '小虫和树叶'], tip: '文中写“面包渣和谷粒”。' },
    { p: '白求恩大夫在手术台旁，连续工作了六十九个小时。', q: '这段话写的是谁？', right: '白求恩', wrongs: ['司马光', '列宁'], tip: '开头写“白求恩大夫”。' },
    { p: '白求恩大夫在手术台旁，连续工作了六十九个小时。', q: '白求恩连续工作了多少个小时？', right: '六十九个小时', wrongs: ['六个小时', '九个小时'], tip: '文中写“六十九个小时”。' },
    { p: '老屋已经活了一百多岁。它的窗户变成了黑窟窿，门板也破了洞。它很久很久没人住了。', q: '老屋已经活了多少岁？', right: '一百多岁', wrongs: ['十多岁', '五十多岁'], tip: '文中写“一百多岁”。' },
    { p: '老屋已经活了一百多岁。它的窗户变成了黑窟窿，门板也破了洞。它很久很久没人住了。', q: '老屋现在的样子怎样？', right: '很破旧', wrongs: ['很新', '很漂亮'], tip: '窗户变黑窟窿、门板破洞，说明很破旧。' },
    { p: '蚂蚁队长集合好队伍，向大家宣布：“今天搬运粮食，只许出力，不许偷嘴。谁偷嘴就要处罚谁。”', q: '是谁在向大家宣布规则？', right: '蚂蚁队长', wrongs: ['蚂蚁老师', '蜜蜂队长'], tip: '开头写“蚂蚁队长集合好队伍”。' },
    { p: '蚂蚁队长集合好队伍，向大家宣布：“今天搬运粮食，只许出力，不许偷嘴。谁偷嘴就要处罚谁。”', q: '蚂蚁队长宣布的规则是什么？', right: '只许出力，不许偷嘴', wrongs: ['可以随便吃', '谁力气大谁先吃'], tip: '文中直接写出了规则。' },
    { p: '当雷云在天上轰响，六月的阵雨落下的时候，湿润的东风走过荒野，在竹林中吹着口哨。', q: '这段话写的是什么季节的景象？', right: '夏天', wrongs: ['春天', '冬天'], tip: '“六月的阵雨”说明是夏天。' },
    { p: '当雷云在天上轰响，六月的阵雨落下的时候，湿润的东风走过荒野，在竹林中吹着口哨。', q: '东风在竹林中做什么？', right: '吹着口哨', wrongs: ['唱着歌', '跳着舞'], tip: '文中写东风“在竹林中吹着口哨”。' },
    { p: '孙中山小时候在私塾读书。那时候上课，先生念，学生跟着念，咿咿呀呀，像唱歌一样。', q: '这段话写的是谁小时候的事？', right: '孙中山', wrongs: ['司马光', '列宁'], tip: '开头写“孙中山小时候”。' },
    { p: '孙中山小时候在私塾读书。那时候上课，先生念，学生跟着念，咿咿呀呀，像唱歌一样。', q: '那时候上课是什么样子的？', right: '先生念，学生跟着念', wrongs: ['学生自己看书', '先生带学生做游戏'], tip: '文中写“先生念，学生跟着念”。' },
    { p: '她坐在墙角里，蜷着腿，缩成一团。她敢从成把的火柴里抽出一根吗？', q: '小女孩坐在哪里？', right: '墙角里', wrongs: ['屋子里', '火炉旁'], tip: '文中写“她坐在墙角里”。' },
    { p: '她坐在墙角里，蜷着腿，缩成一团。她敢从成把的火柴里抽出一根吗？', q: '小女孩的样子怎样？', right: '蜷着腿，缩成一团', wrongs: ['开心地笑着', '舒服地躺着'], tip: '文中写她“蜷着腿，缩成一团”。' },
    { p: '种子被泥土紧紧地包裹着，它不得不把身体缩成一团。“这真难受。”种子想。', q: '谁被泥土紧紧地包裹着？', right: '种子', wrongs: ['小草', '大树'], tip: '开头写“种子被泥土紧紧地包裹着”。' },
    { p: '种子被泥土紧紧地包裹着，它不得不把身体缩成一团。“这真难受。”种子想。', q: '种子当时的感觉是什么？', right: '难受', wrongs: ['开心', '舒服'], tip: '文中写“这真难受”。' }
  ];

  QB.define({
    id: 'chinese',
    name: '语文',
    emoji: '📖',
    color: 'coral',
    desc: '部编版 · 三年级上册',
    levels: [
      {
        id: 'c1',
        unit: '字词基础',
        title: '看拼音写词语',
        emoji: '✍️',
        goal: '根据拼音和词义选对字，辨清同音字、形近字',
        paperType: '看拼音选字、选择',
        concept: {
          points: [
            '看拼音选字，先读准声母、韵母和声调，再想词语的意思。',
            '选完后检查：这个字放进词语里通不通顺，偏旁对不对。',
            '同音字、形近字要看清偏旁和部件，如“坐”和“座”。',
            '把词语放回句子里读一读，通顺才是选对了。'
          ],
          example: 'yóu xì → 游（ ）；zēng tiān → 增（ ），“添”不是“天”。'
        },
        fast: 20,
        ok: 40,
        make: function () {
          if (Math.random() < 0.55) {
            var w = pick(words);
            var right = w.w.charAt(w.bi);
            var masked = w.w.slice(0, w.bi) + '（ ）' + w.w.slice(w.bi + 1);
            return C('看拼音选字成词：' + masked + '　意思：' + w.m, right, w.wrongs,
              '“' + w.p + '”对应“' + w.w + '”，意思是' + w.m + '，要选“' + right + '”。',
              { pinyin: w.p, paperType: '看拼音选字', fast: 20, ok: 40, n: 4 });
          }
          var l = pick(lookalikes);
          return C('选字填空：' + l.s, l.right, l.wrongs, l.tip,
            { paperType: '选择', fast: 20, ok: 40 });
        }
      },
      {
        id: 'c2',
        unit: '字音基础',
        title: '选择正确读音',
        emoji: '🔤',
        goal: '根据词语判断多音字的读音',
        paperType: '选择正确读音',
        concept: {
          points: [
            '有些字有多个读音，叫多音字；读音不同，意思常常也不同。',
            '判断读音不能只看字，要看它所在的词语和句子。',
            '常见多音字：假（jiǎ / jià）、发（fā / fà）、觉（jué / jiào）、长（cháng / zhǎng）。',
            '遇到不确定的字，可以查字典，再放到词语里读一读。'
          ],
          example: '“假期”读 jià qī，“真假”读 zhēn jiǎ；“音乐”读 yīn yuè，“快乐”读 kuài lè。'
        },
        fast: 15,
        ok: 30,
        make: function () {
          var f = pick(polyphones);
          var q = Math.random() < 0.5
            ? '给加点字选择正确读音：「' + f.word + '」中的「' + f.char + '」'
            : '下面词语中，「' + f.word + '」的「' + f.char + '」读什么？';
          return C(q, f.right, f.wrongs, f.tip, { paperType: '选择正确读音', fast: 15, ok: 30 });
        }
      },
      {
        id: 'c3',
        unit: '词语积累',
        title: '词语搭配',
        emoji: '🧩',
        goal: '积累近反义词、量词和常见搭配',
        paperType: '词语搭配',
        concept: {
          points: [
            '近义词：意思相近的词语，如“美丽—漂亮”。',
            '反义词：意思相反的词语，如“骄傲—谦虚”。',
            '量词要搭配得当：一片树叶、一把雨伞、一座桥。',
            '形容词和名词要搭配合理：明亮的眼睛、金色的草地。'
          ],
          example: '“安静”的近义词是“宁静”，“危险”的反义词是“安全”。'
        },
        fast: 18,
        ok: 36,
        make: function () {
          var t = int(1, 4);
          if (t === 1) {
            var s = pick(synonyms);
            return C('和「' + s.w + '」意思最接近的词语是？', s.right, s.wrongs, s.tip,
              { paperType: '词语积累', fast: 15, ok: 30 });
          }
          if (t === 2) {
            var a = pick(antonyms);
            return C('和「' + a.w + '」意思相反的词语是？', a.right, a.wrongs, a.tip,
              { paperType: '词语积累', fast: 15, ok: 30 });
          }
          if (t === 3) {
            var m = pick(measures);
            return C('一（ ）' + m.noun, m.right, m.wrongs.concat(['个']), m.tip,
              { paperType: '词语搭配', fast: 15, ok: 30, n: 4 });
          }
          var c = pick(collocations);
          return C(c.q, c.right, c.wrongs, c.tip,
            { paperType: '词语搭配', fast: 15, ok: 30 });
        }
      },
      {
        id: 'c4',
        unit: '古诗积累',
        title: '古诗填空',
        emoji: '🏞️',
        goal: '记住诗句、诗题和作者',
        paperType: '古诗填空、选择',
        concept: {
          points: [
            '三上要背 6 首古诗：《山行》《赠刘景文》《夜书所见》《望天门山》《饮湖上初晴后雨》《望洞庭》。',
            '背诗要记牢诗句、题目和作者。',
            '“停车坐爱枫林晚”的“坐”是“因为”的意思。',
            '“欲把西湖比西子”把西湖比作美女西施。'
          ],
          example: '欲把西湖比西子，淡妆浓抹总相宜。——苏轼《饮湖上初晴后雨》'
        },
        fast: 30,
        ok: 60,
        make: function () {
          var t = int(1, 12);
          if (t <= 6) {
            var p = pick(poems);
            var i = int(0, 3);
            var line = p.lines[i];
            var correct, q;
            if (i < 3) {
              correct = p.lines[i + 1];
              q = '「' + line + '」的下一句是：';
            } else {
              correct = p.lines[i - 1];
              q = '「' + line + '」的上一句是：';
            }
            var wrongLines = QB.shuffle(allPoemLines.filter(function (x) { return x !== correct; })).slice(0, 3);
            return C(q, correct, wrongLines,
              '《' + p.title + '》：' + p.lines.join('，') + '。',
              { paperType: '古诗填空', fast: 25, ok: 50, n: 4 });
          }
          if (t <= 8) {
            var p2 = pick(poems);
            var li = int(0, 3);
            var wrongTitles2 = QB.shuffle(allTitles.filter(function (x) { return x !== '《' + p2.title + '》'; })).slice(0, 3);
            return C('「' + p2.lines[li] + '」出自哪首诗？', '《' + p2.title + '》', wrongTitles2,
              '这句出自' + p2.author + '的《' + p2.title + '》。',
              { paperType: '古诗填空', fast: 20, ok: 40, n: 4 });
          }
          if (t === 9) {
            var p3 = pick(poems);
            var wrongAuthors = allAuthors.filter(function (x) { return x !== p3.author; });
            return C('《' + p3.title + '》的作者是谁？', p3.author,
              QB.shuffle(wrongAuthors).slice(0, 3),
              '《' + p3.title + '》是' + p3.author + '写的。',
              { paperType: '选择', fast: 15, ok: 30, n: 4 });
          }
          if (t === 10) {
            var p4 = pick(poems);
            var wrongTitles = allTitles.filter(function (x) { return x !== '《' + p4.title + '》'; });
            return C('「' + p4.lines[int(0, 3)] + '」出自哪首诗？', '《' + p4.title + '》',
              QB.shuffle(wrongTitles).slice(0, 3),
              '这句出自' + p4.author + '的《' + p4.title + '》。',
              { paperType: '选择', fast: 15, ok: 30, n: 4 });
          }
          // 看图题：先看图回想诗句，再问诗题、作者、朝代或诗意
          var pp = pick(poems);
          var pi = int(0, 3);
          var pic = QB.pic.poem(pp.title);
          var mode = int(1, 4);
          if (mode === 1) {
            var picTitles = QB.shuffle(allTitles.filter(function (x) { return x !== '《' + pp.title + '》'; })).slice(0, 3);
            return C('看图画，回想诗句。「' + pp.lines[pi] + '」出自哪首诗？', '《' + pp.title + '》', picTitles,
              '这幅画对应' + pp.dynasty + '代' + pp.author + '的《' + pp.title + '》。',
              { svg: pic, paperType: '古诗配图', fast: 25, ok: 55, n: 4 });
          }
          if (mode === 2) {
            var picAuthors = QB.shuffle(allAuthors.filter(function (x) { return x !== pp.author; })).slice(0, 3);
            return C('看图画，回想诗句。「' + pp.lines[pi] + '」的作者是谁？', pp.author, picAuthors,
              '这句出自' + pp.dynasty + '代' + pp.author + '的《' + pp.title + '》。',
              { svg: pic, paperType: '古诗配图', fast: 20, ok: 45, n: 4 });
          }
          if (mode === 3) {
            var dynChoices = ['唐', '宋', '元', '明'].filter(function (x) { return x !== pp.dynasty; });
            return C('看图画，回想诗句。「' + pp.lines[pi] + '」是哪个朝代的诗？', pp.dynasty, dynChoices,
              '《' + pp.title + '》是' + pp.dynasty + '代' + pp.author + '写的。',
              { svg: pic, paperType: '古诗配图', fast: 15, ok: 35, n: 4 });
          }
          var otherMeanings = [];
          poems.forEach(function (x) {
            x.meanings.forEach(function (m) { if (m !== pp.meanings[pi]) otherMeanings.push(m); });
          });
          return C('看图画，回想诗句。「' + pp.lines[pi] + '」的意思是？', pp.meanings[pi],
            QB.shuffle(otherMeanings).slice(0, 3),
            '「' + pp.lines[pi] + '」的意思是：' + pp.meanings[pi] + '（' + pp.dynasty + '·' + pp.author + '《' + pp.title + '》）',
            { svg: pic, paperType: '古诗配图', fast: 25, ok: 55, n: 4 });
        }
      },
      {
        id: 'c5',
        unit: '句子训练',
        title: '句子仿写',
        emoji: '💬',
        goal: '认识比喻、拟人，会改句子和加标点',
        paperType: '句子仿写、标点、判断',
        concept: {
          points: [
            '比喻：把一种事物比作另一种事物，常用“像、好像、仿佛”。',
            '拟人：把事物当作人来写，让它会说话、会做事、有表情。',
            '问句用“？”，感叹句用“！”，说的话前面常用“：”。',
            '把字句改被字句：把“把”前后的内容交换位置。'
          ],
          example: '弯弯的月亮像一条小船。（比喻）  花儿露出了笑脸。（拟人）'
        },
        fast: 18,
        ok: 36,
        make: function () {
          var t = int(1, 6);
          if (t === 1) {
            var m = pick(metaphorSets);
            var example = pick(metaphorSets.filter(function (x) { return x !== m; }));
            return C('照样子选句子。例句：' + example.right + '（结构：' + example.structure + '）下面哪一句也用了比喻？', m.right, m.wrongs,
              '比喻句把一种事物比作另一种事物，常用“像、好像、是”等喻词。',
              {
                paperType: '句子仿写', fast: 25, ok: 55, n: 4,
                pattern: example.structure,
                decomposeTitle: '正确句子的比喻结构',
                decompose: [
                  { kind: 'body', label: '本体', text: m.body },
                  { kind: 'word', label: '喻词', text: m.word },
                  { kind: 'vehicle', label: '喻体', text: m.vehicle }
                ],
                explain: '把“' + m.body + '”比作“' + m.vehicle + '”。'
              });
          }
          if (t === 2) {
            var p = pick(personSets);
            var pex = pick(personSets.filter(function (x) { return x !== p; }));
            return C('照样子选句子。例句：' + pex.right + '（结构：' + pex.structure + '）下面哪一句也用了拟人？', p.right, p.wrongs,
              '拟人句把事物当作人来写，让它会做人的动作、有人的表情。',
              {
                paperType: '句子仿写', fast: 25, ok: 55, n: 4,
                pattern: pex.structure,
                decomposeTitle: '正确句子的拟人结构',
                decompose: [
                  { kind: 'body', label: '事物', text: p.body },
                  { kind: 'action', label: '人的动作', text: p.action }
                ],
                explain: '把“' + p.body + '”当作人来写，让它' + p.action + '。'
              });
          }
          if (t === 3) {
            var b = pick(beiSentences);
            return C('把下面的把字句改成被字句，正确的是（ ）：' + b.s, b.right, b.wrongs,
              '把字句改被字句：把“把”前后的内容交换位置，再用“被”连接。',
              { paperType: '句子仿写', fast: 20, ok: 40, n: 4 });
          }
          if (t === 4) {
            var pu = pick(punctuation);
            return C(pu.s, pu.right, pu.wrongs, pu.tip,
              { paperType: '标点符号', fast: 15, ok: 30, n: 3 });
          }
          var judges = [
            { q: '“弯弯的月亮像一条小船。”是比喻句。（ ）', a: true, tip: '这句话把月亮比作小船，是比喻句。' },
            { q: '“小鸟在树上唱歌。”是比喻句。（ ）', a: false, tip: '这句话把小鸟当作人来写，是拟人句。' },
            { q: '“花儿露出了笑脸。”是拟人句。（ ）', a: true, tip: '“露出笑脸”把花当作人来写，是拟人句。' },
            { q: '“今天真冷啊！”句末应该用句号。（ ）', a: false, tip: '这是感叹句，句末应该用感叹号。' }
          ];
          var j = pick(judges);
          return J(j.q, j.a, j.tip, { paperType: '判断', fast: 15, ok: 30 });
        }
      },
      {
        id: 'c6',
        unit: '课内阅读',
        title: '课内阅读',
        emoji: '📚',
        goal: '读课文片段，提取信息作答',
        paperType: '课内阅读',
        concept: {
          points: [
            '做课内阅读，先读一遍短文，再读题目。',
            '答案常常就在短文里，学会圈出关键词。',
            '问“什么时候、谁、在哪里、为什么”，要回到文中找依据。',
            '选择题要看清每个选项，排除与短文不符的。'
          ],
          example: '《金色的草地》中，草地变金色是因为蒲公英的花张开了。'
        },
        fast: 20,
        ok: 40,
        make: function () {
          var r = pick(reading);
          return C(r.q, r.right, r.wrongs, r.tip,
            { passage: r.p, paperType: '课内阅读', fast: 20, ok: 40 });
        }
      }
    ]
  });
})();
