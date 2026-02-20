// 第一題的選項固定「以上皆有經營」放在最後
const quizData = [
  { type:"choice",
    question:"本公司經營業務相當多元，請問下列何者不是經營項目？",
    options:["四星巨","生產美片","卡菇","跨月大元素","以上皆有經營"],
    answer:"以上皆有經營"
  },
  { type:"choice",
    question:"兵貴神速，請問下列哪一位進菇速度最快？",
    options:["草","毛","KU","老公"],
    answer:"草"
  },
  { type:"choice",
    question:"勞闆慈悲為懷，請問揪野女人進菇台詞是？",
    options:["兄弟大飯店","來來大飯店","晶華酒店","福華飯店"],
    answer:"來來大飯店"
  },
  { type:"choice",
    question:"下列哪位人士尚未洩漏本名？",
    options:["予秧","多莉","估董","勞闆"],
    answer:"予秧"
  },
  { type:"sort",
    question:"請將本公司成員的現居住地，由南到北排列：",
    items:["捏","ㄑ","酥","瓜"],
    answer:["捏","ㄑ","酥","瓜"]
  },
  { type:"match",
    question:"請配對正確的大腿圍",
    pairs:{ "捏":"21","ㄑ":"55","瓜":"16","酥":"15" }
  },
  { type:"match",
    question:"請配對地瓜動物園居民數量",
    pairs:{ "貓":"1","天竺鼠":"3","烏龜":"3","魚":"一堆" }
  },
  { type:"match",
    question:"請配對正確老巢",
    pairs:{ "捏":"土耳其","ㄑ":"荷蘭","瓜":"北海道","酥":"墨西哥" }
  }
];

// 狀態與 DOM 快取（不變）
let current = 0;
let userAnswers = new Array(quizData.length).fill(null);

const qEl  = document.getElementById("question");
const cEl  = document.getElementById("content");
const pEl  = document.getElementById("progress");
const btn  = document.getElementById("nextBtn");
const nav  = document.getElementById("nav");
const card = document.querySelector(".card");

// 工具函式
function shuffle(array) {
  const a = [...array];
  return a.sort(() => Math.random() - 0.5);
}

// 導覽圓點（不變）
function createNav() {
  nav.innerHTML = "";
  quizData.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "dot";
    d.innerText = i + 1;
    d.onclick = () => {
      current = i;
      loadQuestion();
    };
    nav.appendChild(d);
  });
}

function updateNav() {
  const dots = nav.querySelectorAll(".dot");
  dots.forEach((d, i) => {
    d.classList.remove("active", "answered");
    if (i === current) d.classList.add("active");
    if (userAnswers[i] !== null) d.classList.add("answered");
  });
}

// 載入題目
function loadQuestion() {
  const q = quizData[current];
  qEl.innerText = q.question;
  pEl.innerText = `第 ${current + 1} 題 / 共 ${quizData.length} 題`;
  cEl.innerHTML = "";
  btn.disabled = true;

  if (q.type === "choice") renderChoice(q);
  if (q.type === "sort")   renderSort(q);
  if (q.type === "match")  renderMatch(q);

  btn.innerText = current === quizData.length - 1 ? "完成測驗" : "下一題";
  updateNav();
}

// 單選題（第一題不隨機）
function renderChoice(q) {
  let options = [...q.options];
  
  // 第一題固定「以上皆有經營」放最後
  if (current === 0) {
    options = q.options.slice(0, -1);
    const last = q.options[q.options.length - 1];
    options.sort(() => Math.random() - 0.5);
    options.push(last);
  } else {
    options = shuffle(options);
  }

  options.forEach(opt => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = opt;
    div.onclick = () => {
      userAnswers[current] = opt;
      document.querySelectorAll(".option").forEach(o =>
        o.classList.remove("active")
      );
      div.classList.add("active");
      btn.disabled = false;
    };
    cEl.appendChild(div);
  });

  const prev = userAnswers[current];
  if (prev !== null) {
    [...cEl.children].forEach(child => {
      if (child.innerText === prev) {
        child.classList.add("active");
        btn.disabled = false;
      }
    });
  }
}

// 排序題（修復拖曳 bug）
function renderSort(q) {
  const items = shuffle(q.items);
  
  items.forEach(text => {
    const div = document.createElement("div");
    div.className = "drag-item";
    div.draggable = true;
    div.innerText = text;
    
    // 拖曳事件
    div.ondragstart = e => {
      e.dataTransfer.setData("text/plain", text);
      div.classList.add("dragging");
    };
    
    div.ondragend = () => {
      div.classList.remove("dragging");
    };
    
    div.ondragover = e => {
      e.preventDefault();
    };
    
    div.ondrop = e => {
      e.preventDefault();
      const from = e.dataTransfer.getData("text/plain");
      const fromEl = [...cEl.children].find(x => x.innerText === from);
      if (fromEl && fromEl !== div) {
        const rect = div.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        if (e.clientY < midpoint) {
          cEl.insertBefore(fromEl, div);
        } else {
          cEl.insertBefore(fromEl, div.nextSibling);
        }
        saveSort();
      }
    };
    
    cEl.appendChild(div);
  });

  // 恢復之前作答
  const prev = userAnswers[current];
  if (Array.isArray(prev)) {
    cEl.innerHTML = "";
    prev.forEach(text => {
      const div = document.createElement("div");
      div.className = "drag-item";
      div.draggable = true;
      div.innerText = text;
      
      // 重新綁定拖曳事件
      div.ondragstart = e => {
        e.dataTransfer.setData("text/plain", text);
        div.classList.add("dragging");
      };
      div.ondragend = () => div.classList.remove("dragging");
      div.ondragover = e => e.preventDefault();
      div.ondrop = e => {
        e.preventDefault();
        const from = e.dataTransfer.getData("text/plain");
        const fromEl = [...cEl.children].find(x => x.innerText === from);
        if (fromEl && fromEl !== div) {
          const rect = div.getBoundingClientRect();
          const midpoint = rect.top + rect.height / 2;
          if (e.clientY < midpoint) {
            cEl.insertBefore(fromEl, div);
          } else {
            cEl.insertBefore(fromEl, div.nextSibling);
          }
          saveSort();
        }
      };
      
      cEl.appendChild(div);
    });
  }

  saveSort();
}

function saveSort() {
  const arr = [...cEl.children].map(x => x.innerText);
  userAnswers[current] = arr;
  btn.disabled = false;
}

// 配對題（新版 App 風格）
function renderMatch(q) {
  const keys = Object.keys(q.pairs);
  const values = shuffle(Object.values(q.pairs));
  const prev = userAnswers[current] || {};

  keys.forEach((k, index) => {
    const pair = document.createElement("div");
    pair.className = "match-pair";

    const label = document.createElement("div");
    label.className = "match-label";
    label.innerText = k;

    const select = document.createElement("select");
    select.className = "match-select";
    select.innerHTML =
      `<option value="">請選擇</option>` +
      values.map(v => `<option value="${v}">${v}</option>`).join("");

    if (prev[k]) {
      select.value = prev[k];
    }

    select.onchange = () => {
      if (!userAnswers[current]) userAnswers[current] = {};
      userAnswers[current][k] = select.value;
      
      const allFilled = keys.every(key => userAnswers[current][key]);
      btn.disabled = !allFilled;
    };

    pair.append(label, select);
    cEl.appendChild(pair);
  });
}

// 其他函式保持不變...
function nextQuestion() {
  if (current < quizData.length - 1) {
    current++;
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  let correct = 0;
  quizData.forEach((q, i) => {
    const ans = userAnswers[i];
    if (q.type === "choice" && ans === q.answer) correct++;
    if (q.type === "sort" && 
        Array.isArray(ans) &&
        JSON.stringify(ans) === JSON.stringify(q.answer)) correct++;
    if (q.type === "match") {
      let ok = true;
      for (const k in q.pairs) {
        if (!ans || ans[k] !== q.pairs[k]) {
          ok = false;
          break;
        }
      }
      if (ok) correct++;
    }
  });

  const score = Math.round((correct / quizData.length) * 100);

  card.innerHTML = `
    <h1 class="title">大年初五辦尾牙 🎉</h1>
    <h2>測驗完成！</h2>
    <div class="final">${score} 分</div>
    <p>共 ${quizData.length} 題，答對 ${correct} 題</p>
    <button onclick="location.reload()">重新作答</button>
  `;
}

// 初始化
createNav();
loadQuestion();
