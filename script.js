console.log("SCRIPT FINAL 100 VERSION LOADED");

/* ========= 工具 ========= */
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* ========= 題庫 ========= */
const questions = [
  // 1
  {
    type: "multi",
    title: "本公司經營業務相當多元，請問下列何者為經營項目？（複選）",
    options: ["四星巨", "揪打美片", "卡菇", "跨月大元素"],
    answer: ["四星巨", "揪打美片", "卡菇", "跨月大元素"]
  },
  // 2
  {
    type: "multi",
    title: "下列敘述何者正確？（複選）",
    options: [
      "券咖共享，老公也共享。本公司被勞闆納入後宮的老公共有4位。",
      "ㄑ4稱職ㄉ薪水小偷，遲到早退不加班。",
      "地瓜超級認蒸玩皮克敏，蹲美巨衝4星、蹲熱門菇、跑現場活動、偷座標，樣樣精通。",
      "客家人ㄟ力酥超擅長種花，天天都滿金。"
    ],
    answer: [
      "券咖共享，老公也共享。本公司被勞闆納入後宮的老公共有4位。",
      "地瓜超級認真蒸玩皮克敏，蹲美巨衝4星、蹲熱門菇、跑現場活動、偷座標，樣樣精通。"
    ]
  },
  // 3
  {
    type: "single",
    title: "勞闆慈悲為懷，常在大群佈施，請問勞闆揪野女人進菇的台詞是？",
    options: ["兄弟大飯店", "來來大飯店", "晶華酒店", "福華飯店"],
    answer: ["來來大飯店"]
  },
  // 4
  {
    type: "multi",
    title: "尼各位小心被肉搜！請問下列哪位神秘人士尚未洩漏本名？（複選）",
    options: ["予秧", "多莉", "估董", "勞闆", "ㄑ", "地瓜", "阿皮", "ㄟ力酥"],
    answer: ["予秧", "地瓜"]
  },
  // 5
  {
    type: "single",
    title: "公司群組吵得要命，不讀不回小心999+，請問公司群組出現最多次的關鍵字是？",
    options: ["坐牢", "長照", "拉屎", "笑屎"],
    answer: ["笑屎"]
  },

  // 6
  {
    type: "match",
    title: "請將下列人士依現居住地由南到北排列（1 = 最南）",
    pairs: ["捏", "ㄑ", "酥", "瓜"],
    answer: { 捏: "1", ㄑ: "2", 瓜: "4", 酥: "3" }
  },
  // 7
  {
    type: "match",
    title: "想要打菇，蜜大腿可要抱緊惹！請配對正確的大腿圍～",
    pairs: ["捏", "ㄑ", "瓜", "酥"],
    answer: { 捏: "21", ㄑ: "55", 瓜: "16", 酥: "15" }
  },
  // 8
  {
    type: "match",
    title: "缺動物園皮9去地瓜家探測，請問地瓜動物園ㄉ居民數量？",
    pairs: ["貓", "天竺鼠", "烏龜", "魚"],
    answer: { 貓: "1", 天竺鼠: "3", 烏龜: "3", 魚: "一堆" }
  },
  // 9
  {
    type: "match",
    title: "狡兔三窟，飛久ㄌ默默9有老巢，以下請配對正確老巢～",
    pairs: ["捏", "ㄑ", "瓜", "酥"],
    answer: { 捏: "土耳其", ㄑ: "荷蘭", 瓜: "北海道", 酥: "墨西哥" }
  },
  // 10
  {
    type: "match",
    title: "可惡皮克敏讀心遊戲，越喜歡越不給你，以下請配對正確的心頭好",
    pairs: ["勞闆", "ㄑ", "瓜", "酥"],
    answer: { 勞闆: "眼屎", ㄑ: "丫鬟", 瓜: "小粉", 酥: "胖紫" }
  }
];

/* ========= 狀態 ========= */
let current = 0;
const answers = {};

/* ========= DOM ========= */
const nav = document.getElementById("nav");
const qEl = document.getElementById("question");
const cEl = document.getElementById("content");
const pEl = document.getElementById("progress");
const nextBtn = document.getElementById("nextBtn");

/* ========= 導覽 ========= */
function renderNav() {
  nav.innerHTML = "";
  questions.forEach((_, i) => {
    const b = document.createElement("button");
    b.textContent = i + 1;
    if (i === current) b.classList.add("active");
    if (answers[i]) b.classList.add("answered");
    b.onclick = () => { current = i; render(); };
    nav.appendChild(b);
  });
}

/* ========= 主渲染 ========= */
function render() {
  renderNav();
  nextBtn.disabled = true;
  nextBtn.textContent = current === questions.length - 1 ? "完成測驗" : "下一題";

  const q = questions[current];
  pEl.textContent = `第 ${current + 1} / ${questions.length} 題`;
  qEl.textContent = q.title;
  cEl.innerHTML = "";

  /* 單選 / 多選 */
  if (q.type === "single" || q.type === "multi") {
    const box = document.createElement("div");
    box.className = "options";

    shuffle(q.options).forEach(opt => {
      const div = document.createElement("div");
      div.className = "option";
      div.textContent = opt;

      div.onclick = () => {
        if (q.type === "single") {
          answers[current] = [opt];
          box.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
          div.classList.add("selected");
        } else {
          answers[current] ||= [];
          if (answers[current].includes(opt)) {
            answers[current] = answers[current].filter(o => o !== opt);
            div.classList.remove("selected");
          } else {
            answers[current].push(opt);
            div.classList.add("selected");
          }
        }
        nextBtn.disabled = false;
      };

      box.appendChild(div);
    });

    cEl.appendChild(box);
  }

  /* 配對題 */
  if (q.type === "match") {
    answers[current] ||= {};
    const opts = shuffle(Object.values(q.answer));

    q.pairs.forEach(p => {
      const row = document.createElement("div");
      row.className = "match-row";

      const label = document.createElement("span");
      label.textContent = p;

      const select = document.createElement("select");
      select.innerHTML = `<option value="">請選擇</option>`;
      opts.forEach(v => {
        const o = document.createElement("option");
        o.value = v;
        o.textContent = v;
        select.appendChild(o);
      });

      select.onchange = () => {
        answers[current][p] = select.value;
        if (Object.keys(answers[current]).length === q.pairs.length) {
          nextBtn.disabled = false;
        }
      };

      row.append(label, select);
      cEl.appendChild(row);
    });
  }
}

/* ========= 計分 ========= */
function calculateScore() {
  let score = 0;

  questions.forEach((q, i) => {
    const a = answers[i];
    if (!a) return;

    if (i < 5) {
      if (JSON.stringify([...a].sort()) === JSON.stringify([...q.answer].sort())) {
        score += 10;
      }
    } else {
      Object.keys(q.answer).forEach(k => {
        if (a[k] === q.answer[k]) score += 2.5;
      });
    }
  });

  return score;
}

/* ========= 下一題 / 完成 ========= */
nextBtn.onclick = () => {
  if (current < questions.length - 1) {
    current++;
    render();
  } else {
    const score = calculateScore();

    let review = "";
    questions.forEach((q, i) => {
      const ok =
        i < 5
          ? JSON.stringify([...answers[i]].sort()) === JSON.stringify([...q.answer].sort())
          : Object.keys(q.answer).every(k => answers[i][k] === q.answer[k]);
      review += `<div>${ok ? "✅" : "❌"} 第 ${i + 1} 題</div>`;
    });

let reviewHTML = `<div class="review">`;

questions.forEach((q, i) => {
  const r = getQuestionResult(q, answers[i], i);
  reviewHTML += `
    <div class="review-item ${r.correct ? "correct" : "wrong"}">
      <span>第 ${i + 1} 題</span>
      <span>${r.text}</span>
    </div>
  `;
});

reviewHTML += `</div>`;

document.querySelector(".card").innerHTML = `
  <h2>🎉 測驗完成</h2>

  <p style="font-size:18px;">
    你的分數：<strong>${score}</strong> 分
  </p>

  <p style="font-size:22px; margin:6px 0 12px;">
    ${getRankText(score)}
  </p>

  ${reviewHTML}

  <button onclick="shareResult(${score})">
    📸 截圖分享
  </button>

  <button onclick="location.reload()">
    🔄 重新作答
  </button>
`;
  }
};

render();

// 🎖 分數對應團主稱號
function getRankText(score) {
  if (score === 0) return "滾";
  if (score < 60) return "🌟 1星團主";
  if (score < 80) return "🌟🌟 2星團主";
  if (score < 100) return "🌟🌟🌟 3星團主";
  return "🌟🌟🌟🌟 4星團主";
}

// 📸 分享完成頁（安全版）
function shareResult(score) {
  const text = `🎉 大年初五辦尾牙\n我的分數：${score} 分\n稱號：${getRankText(score)}`;

  if (navigator.share) {
    navigator.share({
      title: "尾牙測驗結果",
      text
    });
  } else {
    alert("此裝置不支援分享，請自行截圖 🙏");
  }
}
