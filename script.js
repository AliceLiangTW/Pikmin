console.log("SCRIPT FINAL SAFE VERSION LOADED");

/* ========= 工具 ========= */
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* ========= 題庫 ========= */
const questions = [
  {
    type: "multi",
    title: "本公司經營業務相當多元，請問下列何者為經營項目？（複選）",
    options: ["四星巨", "揪打美片", "卡菇", "跨月大元素"],
    answer: ["四星巨", "揪打美片", "卡菇", "跨月大元素"]
  },
  {
    type: "multi",
    title: "下列敘述何者正確？（複選）",
    options: [
      "券咖共享，老公也共享。本公司被勞闆納入後宮的老公共有4位。",
      "ㄑ4稱職ㄉ薪水小偷，遲到早退不加班。",
      "地瓜超級認真蒸玩皮克敏，蹲美巨衝4星、蹲熱門菇、跑現場活動、偷座標，樣樣精通。",
      "客家人ㄟ力酥超用力種花，天天都滿金。"
    ],
    answer: [
      "券咖共享，老公也共享。本公司被勞闆納入後宮的老公共有4位。",
      "地瓜超級認真蒸玩皮克敏，蹲美巨衝4星、蹲熱門菇、跑現場活動、偷座標，樣樣精通。"
    ]
  },
  {
    type: "single",
    title: "勞闆揪野女人進菇的台詞是？",
    options: ["兄弟大飯店", "來來大飯店", "晶華酒店", "福華飯店"],
    answer: ["來來大飯店"]
  },
  {
    type: "multi",
    title: "尼各位小心被肉搜R!!請問下列哪位神秘人士尚未洩漏本名？（複選）",
    options: ["予秧", "多莉", "估董", "勞闆", "ㄑ", "地瓜", "阿皮", "ㄟ力酥"],
    answer: ["予秧", "地瓜"]
  },
  {
    type: "single",
    title: "公司群組吵得要命，已讀不回小心999+。請問公司群組出現次數最多的關鍵字是？",
    options: ["坐牢", "長照", "拉屎", "笑屎"],
    answer: ["笑屎"]
  },
  {
    type: "match",
    title: "現居住地由南到北排列（1 = 最南）",
    pairs: ["捏", "ㄑ", "瓜", "酥"],
    answer: { 捏: "1", ㄑ: "2", 酥: "3", 瓜: "4" }
  },
  {
    type: "match",
    title: "想要有菇打蜜大腿可要抱緊惹！！請選出正確的大腿圍",
    pairs: ["捏", "ㄑ", "瓜", "酥"],
    answer: { 捏: "21", ㄑ: "55", 瓜: "16", 酥: "15" }
  },
  {
    type: "match",
    title: "缺動物園皮請到地瓜家探測～請問地瓜動物園ㄉ居民數量？",
    pairs: ["貓", "天竺鼠", "烏龜", "魚"],
    answer: { 貓: "1", 天竺鼠: "3", 烏龜: "3", 魚: "一堆" }
  },
  {
    type: "match",
    title: "公司越來越國際化，請配對正確ㄉ老巢",
    pairs: ["捏", "ㄑ", "瓜", "酥"],
    answer: { 捏: "土耳其", ㄑ: "荷蘭", 瓜: "北海道", 酥: "墨西哥" }
  },
  {
    type: "match",
    title: "可惡ㄉ皮克敏讀心遊戲害我-1到月底，話說回來，請選出大家ㄉ心頭好",
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

/* ========= 完成頁 ========= */
nextBtn.onclick = () => {
  if (current < questions.length - 1) {
    current++;
    render();
  } else {
    const score = calculateScore();

    let reviewHTML = `<div class="review">`;
    questions.forEach((q, i) => {
      if (i < 5) {
        const ok = JSON.stringify([...answers[i]].sort()) === JSON.stringify([...q.answer].sort());
        reviewHTML += `<div class="review-item">${ok ? "✅" : "❌"} 第 ${i + 1} 題</div>`;
      } else {
        let correct = 0;
        Object.keys(q.answer).forEach(k => {
          if (answers[i][k] === q.answer[k]) correct++;
        });
        reviewHTML += `<div class="review-item">📌 第 ${i + 1} 題：${correct} / ${Object.keys(q.answer).length}</div>`;
      }
    });
    reviewHTML += `</div>`;

    document.querySelector(".card").innerHTML = `
      <div class="result">
        <h2>🎉 測驗完成</h2>

        <div class="score">
          <span>你的分數</span>
          <strong>${score}</strong>
        </div>

        <div class="rank">${getRankText(score)}</div>

        ${reviewHTML}

        <button class="primary" onclick="shareResult(${score})">📸 截圖分享</button>
        <button class="ghost" onclick="location.reload()">🔄 重新作答</button>
      </div>
    `;
  }
};

render();

/* ========= 輔助 ========= */
function getRankText(score) {
  if (score === 0) return "滾";
  if (score < 60) return "🌟 1星團主";
  if (score < 80) return "🌟🌟 2星團主";
  if (score < 100) return "🌟🌟🌟 3星團主";
  return "🌟🌟🌟🌟 4星團主";
}

function shareResult(score) {
  const text = `🎉 大年初五辦尾牙\n我的分數：${score} 分\n稱號：${getRankText(score)}`;
  if (navigator.share) {
    navigator.share({ title: "尾牙測驗結果", text });
  } else {
    alert("此裝置不支援分享，請自行截圖 🙏");
  }
}
