console.log("SCRIPT FINAL FULL VERSION LOADED");

// ---------- 工具 ----------
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ---------- 題庫 ----------
const questions = [
  {
    type: "multi",
    title: "本公司經營業務相當多元，請問下列何者為經營項目？",
    options: ["四星巨", "揪打美片", "卡菇", "跨月大元素"],
    answer: ["四星巨", "揪打美片", "卡菇", "跨月大元素"]
  },
  {
    type: "multi",
    title: "下列敘述何者正確？（複選）",
    options: [
      "券咖共享，老公也共享。本公司被勞闆納入後宮的老公共有4位。",
      "ㄑ4稱職ㄉ薪水小偷，遲到早退不加班。",
      "地瓜重度沈迷皮克敏，蹲美巨衝4星、蹲熱門菇、跑現場活動、偷座標，樣樣精通。",
      "客家人ㄟ力酥超擅長種花，天天都滿金。"
    ],
    answer: [
      "券咖共享，老公也共享。本公司被勞闆納入後宮的老公共有4位。",
      "地瓜重度沈迷皮克敏，蹲美巨衝4星、蹲熱門菇、跑現場活動、偷座標，樣樣精通。"
    ]
  },
  {
    type: "single",
    title: "勞闆揪野女人進菇的台詞是？",
    options: ["兄弟大飯店", "來來大飯店", "晶華酒店", "福華飯店"],
    answer: "來來大飯店"
  },
  {
    type: "multi",
    title: "哪位神秘人士尚未洩漏本名？",
    options: ["予秧", "多莉", "估董", "勞闆", "ㄑ", "地瓜", "ㄟ力酥"],
    answer: ["予秧", "地瓜"]
  },
  {
    type: "single",
    title: "公司群組出現最多次的關鍵字？",
    options: ["坐牢", "長照", "拉屎", "笑屎"],
    answer: "笑屎"
  },
  {
    type: "match",
    title: "成員現居地由南到北（1=最南）",
    answer: { 捏: "1", ㄑ: "2", 酥: "3", 瓜: "4" }
  },
  {
    type: "match",
    title: "正確的大腿圍",
    answer: { 捏: "21", ㄑ: "55", 瓜: "16", 酥: "15" }
  },
  {
    type: "match",
    title: "地瓜動物園居民數量",
    answer: { 貓: "1", 天竺鼠: "3", 烏龜: "3", 魚: "一堆" }
  },
  {
    type: "match",
    title: "正確老巢",
    answer: { 捏: "土耳其", ㄑ: "荷蘭", 瓜: "北海道", 酥: "墨西哥" }
  },
  {
    type: "match",
    title: "請配對正確的心頭好",
    answer: { 勞闆: "眼屎", ㄑ: "丫鬟", 瓜: "小粉", 酥: "胖紫" }
  }
];

// ---------- 狀態 ----------
let current = 0;
let answers = {};

const nav = document.getElementById("nav");
const questionEl = document.getElementById("question");
const contentEl = document.getElementById("content");
const progressEl = document.getElementById("progress");
const nextBtn = document.getElementById("nextBtn");

// ---------- 導覽 ----------
function renderNav() {
  nav.innerHTML = "";
  questions.forEach((_, i) => {
    const b = document.createElement("button");
    b.textContent = i + 1;
    if (i === current) b.classList.add("active");
    if (answers[i]) b.classList.add("answered");
    b.onclick = () => {
      current = i;
      render();
    };
    nav.appendChild(b);
  });
}

// ---------- 題目渲染 ----------
function enableNext() {
  nextBtn.disabled = false;
}

function render() {
  renderNav();
  nextBtn.disabled = true;
  nextBtn.textContent = current === questions.length - 1 ? "完成測驗" : "下一題";

  const q = questions[current];
  progressEl.textContent = `第 ${current + 1} / ${questions.length} 題`;
  questionEl.textContent = q.title;
  contentEl.innerHTML = "";

  // 單選 / 複選
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
            answers[current] = answers[current].filter(x => x !== opt);
            div.classList.remove("selected");
          } else {
            answers[current].push(opt);
            div.classList.add("selected");
          }
        }
        enableNext();
        renderNav();
      };

      box.appendChild(div);
    });

    contentEl.appendChild(box);
  }

  // 配對題
  if (q.type === "match") {
    answers[current] ||= {};
    const keys = Object.keys(q.answer);
    const values = shuffle(Object.values(q.answer));

    keys.forEach(k => {
      const row = document.createElement("div");
      row.className = "match-row";

      const label = document.createElement("span");
      label.textContent = k;

      const select = document.createElement("select");
      select.innerHTML = `<option value="">請選擇</option>`;
      values.forEach(v => {
        const o = document.createElement("option");
        o.value = v;
        o.textContent = v;
        select.appendChild(o);
      });

      select.onchange = () => {
        answers[current][k] = select.value;
        if (Object.keys(answers[current]).length === keys.length) {
          enableNext();
          renderNav();
        }
      };

      row.append(label, select);
      contentEl.appendChild(row);
    });
  }
}

// ---------- 計分 ----------
function calculateScore() {
  let score = 0;

  questions.forEach((q, i) => {
    const a = answers[i];
    if (!a) return;

    // 前 5 題
    if (i < 5) {
      if ([...a].sort().join() === [...q.answer].sort().join()) {
        score += 10;
      }
    }

    // 配對題
    if (q.type === "match") {
      Object.keys(q.answer).forEach(k => {
        if (a[k] === q.answer[k]) score += 2.5;
      });
    }
  });

  return score;
}

// ---------- 下一題 / 完成 ----------
nextBtn.onclick = () => {
  if (current < questions.length - 1) {
    current++;
    render();
  } else {
    const score = calculateScore();
    document.querySelector(".card").innerHTML = `
      <h2>🎉 測驗完成</h2>
      <p style="font-size:22px;margin:20px 0;">你的分數：<strong>${score}</strong> 分</p>
      <button onclick="location.reload()">重新作答</button>
    `;
  }
};

// ---------- 啟動 ----------
render();
