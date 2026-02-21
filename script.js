console.log("SCRIPT FIXED VERSION LOADED");

const questions = [
  {
    type: "multi",
    title: "本公司經營業務相當多元，請問下列何者為經營項目？",
    options: ["四星巨", "揪打美片", "卡菇", "跨月大元素"],
    answer: ["四星巨", "揪打美片", "卡菇", "跨月大元素"]
  },
  {
    type: "single",
    title: "兵貴神速，請問下列哪一位進菇速度最快？",
    options: ["草", "毛", "KU", "老公"],
    answer: ["草"]
  },
  {
    type: "single",
    title: "勞闆揪野女人進菇的台詞是？",
    options: ["兄弟大飯店", "來來大飯店", "晶華酒店", "福華飯店"],
    answer: ["來來大飯店"]
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
    answer: ["笑屎"]
  },
  {
    type: "match",
    title: "請將成員現居地由南到北排列",
    pairs: ["捏", "ㄑ", "瓜", "酥"],
    answer: { 捏: "1", ㄑ: "2", 酥: "3", 瓜: "4" }
  },
  {
    type: "match",
    title: "抱對蜜大腿就有菇可打，請配對正確的大腿圍",
    pairs: ["捏", "ㄑ", "瓜", "酥"],
    answer: { 捏: "21", ㄑ: "55", 瓜: "16", 酥: "15" }
  },
  {
    type: "match",
    title: "地瓜動物園居民數量",
    pairs: ["貓", "天竺鼠", "烏龜", "魚"],
    answer: { 貓: "1", 天竺鼠: "3", 烏龜: "3", 魚: "一堆" }
  },
  {
    type: "match",
    title: "正確老巢配對",
    pairs: ["捏", "ㄑ", "瓜", "酥"],
    answer: { 捏: "土耳其", ㄑ: "荷蘭", 瓜: "北海道", 酥: "墨西哥" }
  },
  {
    type: "match",
    title: "請依大姨媽來的順序（1=最早）",
    pairs: ["捏", "ㄑ", "瓜", "酥"],
    answer: { 瓜: "1", 酥: "2", 捏: "3", ㄑ: "4" }
  }
];

let current = 0;
let answers = {};

const nav = document.getElementById("nav");
const questionEl = document.getElementById("question");
const contentEl = document.getElementById("content");
const progressEl = document.getElementById("progress");
const nextBtn = document.getElementById("nextBtn");

function renderNav() {
  nav.innerHTML = "";
  questions.forEach((_, i) => {
    const b = document.createElement("button");
    b.textContent = i + 1;
    if (i === current) b.classList.add("active");
    b.onclick = () => { current = i; render(); };
    nav.appendChild(b);
  });
}

function enableNext() {
  nextBtn.disabled = false;
  nextBtn.classList.add("enabled");
}

function render() {
  renderNav();
  nextBtn.disabled = true;
  nextBtn.classList.remove("enabled");
  nextBtn.textContent = current === questions.length - 1 ? "完成測驗" : "下一題";

  const q = questions[current];
  progressEl.textContent = `第 ${current + 1} / ${questions.length} 題`;
  questionEl.textContent = q.title;
  contentEl.innerHTML = "";

  if (q.type === "single" || q.type === "multi") {
    const box = document.createElement("div");
    box.className = "options";

    q.options.forEach(opt => {
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
        enableNext();
      };

      box.appendChild(div);
    });

    contentEl.appendChild(box);
  }

  if (q.type === "match") {
    answers[current] ||= {};
    q.pairs.forEach(p => {
      const row = document.createElement("div");
      row.className = "match-row";

      const label = document.createElement("label");
      label.textContent = p;

      const select = document.createElement("select");
      select.innerHTML = `<option value="">請選擇</option>`;
      Object.values(q.answer).forEach(v => {
        const o = document.createElement("option");
        o.value = v;
        o.textContent = v;
        select.appendChild(o);
      });

      select.onchange = () => {
        answers[current][p] = select.value;
        if (Object.keys(answers[current]).length === q.pairs.length) {
          enableNext();
        }
      };

      row.append(label, select);
      contentEl.appendChild(row);
    });
  }
}

function calculateScore() {
  let correct = 0;

  questions.forEach((q, i) => {
    const a = answers[i];
    if (!a) return;

    if (q.type !== "match") {
      if (JSON.stringify(a.sort()) === JSON.stringify(q.answer.sort())) {
        correct++;
      }
    } else {
      let ok = true;
      for (let k in q.answer) {
        if (a[k] !== q.answer[k]) ok = false;
      }
      if (ok) correct++;
    }
  });

  return Math.round((correct / questions.length) * 100);
}

nextBtn.onclick = () => {
  if (current < questions.length - 1) {
    current++;
    render();
  } else {
    const score = calculateScore();
    document.querySelector(".card").innerHTML = `
      <h2>🎉 測驗完成</h2>
      <p style="font-size:20px;">你的分數：<strong>${score}</strong> / 100</p>
      <button onclick="location.reload()">重新作答</button>
    `;
  }
};

render();
