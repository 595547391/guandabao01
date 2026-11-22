/* 公共出题工具：所有题库文件共用，必须在其他 data 文件之前加载 */
(function () {
  var QB = {};

  QB.int = function (min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  QB.pick = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  QB.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  };

  /**
   * 生成选择题选项。
   * @param {*} correct 正确答案
   * @param {Array} candidates 干扰项候选（会自动排除与正确答案文本相同的项）
   * @param {number} n 选项总数，默认 3
   */
  QB.choice = function (correct, candidates, n) {
    n = n || 3;
    var correctText = String(correct);
    var wrongs = [];
    for (var i = 0; i < candidates.length && wrongs.length < n - 1; i++) {
      var text = String(candidates[i]);
      if (text !== correctText && wrongs.indexOf(text) === -1) wrongs.push(text);
    }
    var options = QB.shuffle([correctText].concat(wrongs));
    return { options: options, answer: options.indexOf(correctText) };
  };

  /** 数字题的干扰项：按偏移量变形，自动去重且避免出现负数 */
  QB.numChoice = function (correct, deltas, n) {
    var cands = [];
    deltas.forEach(function (d) {
      var v = correct + d;
      if (v > 0) cands.push(v);
    });
    cands.push(correct + 1, correct - 1, correct + 10, correct - 10);
    return QB.choice(correct, cands, n || 3);
  };

  /**
   * 注册一个学科的题库。
   * 数据结构：{id, name, emoji, color, desc, levels:[{id, unit, title, emoji, goal, concept, fast, ok, make}]}
   */
  QB.define = function (bank) {
    window.__BANKS = window.__BANKS || [];
    window.__BANKS.push(bank);
  };

  window.QB = QB;
})();
