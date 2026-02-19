const quizData = [
  {
    question: "本公司業務內容",
    options: ["衝四星巨", "美片", "卡菇", "跨月大元素", "以上皆是"],
    answer: "以上皆是"
  },
  {
    question: "下列何者進菇速度最快",
    options: ["草", "毛", "KU", "老公"],
    answer: "草"
  },
  {
    question: "勞闆揪人進菇台詞",
    options: ["來來大飯店", "兄弟大飯店", "晶華酒店", "福華飯店"],
    answer: "來來大飯店"
  }
];

let current = 0;
let userAnswers = new Array(quizData.length).fill(null);

const qEl = document.getElementById("question");
const oEl = document.getElementById("options");
const pEl = document.getElementById("progress");
const btn = document.getElementById("nextBtn");
const nav = document.getElementById("nav");

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createNav() {
  nav.innerHTML = "";
  quizData.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "dot";
    dot.innerText = i + 1;
    dot.onclick = () => {
      current = i;
      loadQuestion();
    };
    nav.appendChild(dot);
  });
}

function updateNav() {
  document.querySelectorAll(".dot").forEach((d, i) => {
    d.classList.remove("active", "answered");
    if (i === current) d.classList.add("active");
    if (userAnswers[i] !== null) d.classList.add("answered");
  });
}

function loadQuestion() {
  const q = quizData[current];

  pEl.innerText = `第 ${current + 1} 題 / 共 ${quizData.length} 題`;

  qEl.innerText = q.question;
  oEl.innerHTML = "";
  btn.disabled = userAnswers[current] === null;

  const shuffled = shuffle([...q.options]);

  shuffled.forEach(opt => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = opt;

    if (userAnswers[current] === opt) {
      div.classList.add("active");
    }

    div.onclick = () => {
      userAnswers[current] = opt;
      loadQuestion();
    };

    oEl.appendChild(div);
  });

  btn.innerText = current === quizData.length - 1 ? "完成測驗" : "下一題";

  updateNav();

  document.querySelector(".card").classList.add("fade");
  setTimeout(() => {
    document.querySelector(".card").classList.remove("fade");
  }, 200);
}

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
    if (userAnswers[i] === q.answer) correct++;
  });

  const score = Math.round((correct / quizData.length) * 100);

  let review = "";
  quizData.forEach((q, i) => {
    review += `
      <div class="review">
        <p><strong>第 ${i + 1} 題：</strong>${q.question}</p>
        <p>你的答案：${userAnswers[i] || "未作答"}</p>
        <p>正確答案：${q.answer}</p>
      </div>
    `;
  });

  document.querySelector(".card").innerHTML = `
    <h2>測驗完成 🎉</h2>
    <div class="final">${score} 分</div>
    ${review}
    <button onclick="restart()">重新作答</button>
  `;
}

function restart() {
  current = 0;
  userAnswers = new Array(quizData.length).fill(null);
  document.querySelector(".card").innerHTML = `
    <div class="nav" id="nav"></div>
    <div class="progress" id="progress"></div>
    <img class="pikmin" src="https://upload.wikimedia.org/wikipedia/en/7/75/Pikmin_character.png">
    <h2 id="question"></h2>
    <div id="options"></div>
    <button id="nextBtn" onclick="nextQuestion()" disabled>下一題</button>
  `;
  location.reload();
}

createNav();
loadQuestion();
