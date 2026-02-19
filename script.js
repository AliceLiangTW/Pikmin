const quiz = [
  {
    question: "本公司業務內容",
    options: ["衝四星巨", "美片", "卡菇", "跨月大元素", "以上皆是"],
    answer: 4
  },
  {
    question: "下列何者進菇速度最快",
    options: ["草", "毛", "KU", "老公"],
    answer: 0
  },
  {
    question: "勞闆揪人進菇台詞",
    options: ["來來大飯店", "兄弟大飯店", "晶華酒店", "福華飯店"],
    answer: 0
  }
];

let current = 0;
let score = 0;
let selected = null;

const qEl = document.getElementById("question");
const oEl = document.getElementById("options");
const pEl = document.getElementById("progress");
const btn = document.getElementById("nextBtn");

function loadQuestion() {
  const q = quiz[current];
  pEl.innerText = `第 ${current + 1} 題 / 共 ${quiz.length} 題`;
  qEl.innerText = q.question;
  oEl.innerHTML = "";
  btn.disabled = true;
  selected = null;

  q.options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = opt;
    div.onclick = () => select(i, div);
    oEl.appendChild(div);
  });

  btn.innerText = current === quiz.length - 1 ? "完成測驗" : "下一題";
}

function select(index, el) {
  selected = index;
  document.querySelectorAll(".option").forEach(o => o.classList.remove("active"));
  el.classList.add("active");
  btn.disabled = false;
}

function nextQuestion() {
  if (selected === quiz[current].answer) score++;

  current++;
  if (current < quiz.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.querySelector(".card").innerHTML = `
    <h2>測驗完成 🎉</h2>
    <p class="score">你的得分</p>
    <div class="final">${score} / ${quiz.length}</div>
  `;
}

loadQuestion();
