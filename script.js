console.log("new script loaded");

const app = document.getElementById("app");

let current = 0;
let score = 0;
let answers = {};

const QUESTIONS = [
  {
    type: "multi",
    title: "第一題",
    question: "本公司經營業務相當多元，請問下列何者為經營項目？",
    options: ["四星巨", "揪打美片", "卡菇", "跨月大元素"],
    answer: ["四星巨", "揪打美片", "卡菇", "跨月大元素"]
  },
  {
    type: "single",
    title: "第二題",
    question: "兵貴神速，請問下列哪一位進菇速度最快？",
    options: ["草", "毛", "KU", "老公"],
    answer: "草"
  },
  {
    type: "single",
    title: "第三題",
    question: "勞闆揪野女人進菇的台詞是？",
    options: ["兄弟大飯店", "來來大飯店", "晶華酒店", "福華飯店"],
    answer: "來來大飯店"
  },
  {
    type: "multi",
    title: "第四題",
    question: "哪位神秘人士尚未洩漏本名？",
    options: ["予秧", "多莉", "估董", "勞闆", "ㄑ", "地瓜", "ㄟ力酥"],
    answer: ["予秧", "地瓜"]
  },
  {
    type: "single",
    title: "第五題",
    question: "公司群組最常出現的關鍵字？",
    options: ["坐牢", "長照", "拉屎", "笑屎"],
    answer: "笑屎"
  },
  {
    type: "match",
    title: "第六題",
    question: "請將現居住地由南到北配對",
    pairs: {
      "捏": "1",
      "ㄑ": "2",
      "酥": "3",
      "瓜": "4"
    }
  },
  {
    type: "single",
    title: "第七題",
    question: "正確的大腿圍？",
    options: ["捏：21", "ㄑ：55", "瓜：16", "酥：15"],
    answer: "ㄑ：55"
  },
  {
    type: "match",
    title: "第八題",
    question: "配對地瓜動物園居民數量",
    pairs: {
      "貓": "1",
      "天竺鼠": "3",
      "烏龜": "3",
      "魚": "一堆"
    }
  },
  {
    type: "match",
    title: "第九題",
    question: "配對正確老巢",
    pairs: {
      "捏": "土耳其",
      "ㄑ": "荷蘭",
      "瓜": "北海道",
      "酥": "墨西哥"
    }
  },
  {
    type: "match",
    title: "第十題",
    question: "請依大姨媽來的順序（1～4）",
    pairs: {
      "瓜": "1",
      "酥": "2",
      "捏": "3",
      "ㄑ": "4"
    }
  }
];

function render() {
  app.innerHTML = "";
  const q = QUESTIONS[current];

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h2>${q.title}</h2>
    <p>${q.question}</p>
  `;

  if (q.type === "single" || q.type === "multi") {
    q.options.forEach(opt => {
      const label = document.createElement("label");
      label.className = "option";
      label.innerHTML = `
        <input type="${q.type === "single" ? "radio" : "checkbox"}" name="q" value="${opt}">
        <span>${opt}</span>
      `;
      card.appendChild(label);
    });
  }

  if (q.type === "match") {
    Object.keys(q.pairs).forEach(key => {
      const row = document.createElement("div");
      row.className = "match-row";

      row.innerHTML = `
        <span class="match-key">${key}</span>
        <select class="match-select" data-key="${key}">
          <option value="">請選擇</option>
          ${Object.values(q.pairs).map(v => `<option value="${v}">${v}</option>`).join("")}
        </select>
      `;
      card.appendChild(row);
    });
  }

  const btn = document.createElement("button");
  btn.className = "next-btn";
  btn.innerText = current === QUESTIONS.length - 1 ? "完成測驗" : "下一題";
  btn.onclick = next;

  card.appendChild(btn);
  app.appendChild(card);
}

function next() {
  saveAnswer();
  current++;
  if (current >= QUESTIONS.length) {
    showResult();
  } else {
    render();
  }
}

function saveAnswer() {
  const q = QUESTIONS[current];

  if (q.type === "single") {
    const v = document.querySelector("input[name=q]:checked");
    answers[current] = v ? v.value : null;
    if (v && v.value === q.answer) score += 10;
  }

  if (q.type === "multi") {
    const vs = [...document.querySelectorAll("input[name=q]:checked")].map(i => i.value);
    answers[current] = vs;
    if (JSON.stringify(vs.sort()) === JSON.stringify(q.answer.sort())) score += 10;
  }

  if (q.type === "match") {
    let correct = true;
    document.querySelectorAll(".match-select").forEach(sel => {
      if (q.pairs[sel.dataset.key] !== sel.value) correct = false;
    });
    if (correct) score += 10;
  }
}

function showResult() {
  app.innerHTML = `
    <div class="card">
      <h2>🎉 測驗完成</h2>
      <p>你的分數：<strong>${score} / 100</strong></p>
      <button onclick="restart()">重新作答</button>
    </div>
  `;
}

function restart() {
  current = 0;
  score = 0;
  answers = {};
  render();
}

render();
