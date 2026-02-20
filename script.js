// ✅ 確認 JS 有載入
alert("JS 已成功載入");

// 題庫（先 1 題）
const quizData = [
  {
    question: "🎉 公司尾牙辦在什麼時候？",
    options: ["除夕", "初一", "初五", "元宵"],
    answer: "初五"
  }
];

let current = 0;

const qEl = document.getElementById("question");
const cEl = document.getElementById("content");
const pEl = document.getElementById("progress");
const btn = document.getElementById("nextBtn");
const nav = document.getElementById("nav");

// 題號
function createNav(){
  nav.innerHTML = "";
  quizData.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.innerText = i + 1;
    nav.appendChild(d);
  });
}

// 載入題目
function loadQuestion(){
  const q = quizData[current];
  pEl.innerText = `第 1 題 / 共 1 題`;
  qEl.innerText = q.question;
  cEl.innerHTML = "";

  q.options.forEach(opt => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = opt;
    div.onclick = () => {
      document.querySelectorAll(".option").forEach(o=>o.classList.remove("active"));
      div.classList.add("active");
    };
    cEl.appendChild(div);
  });
}

createNav();
loadQuestion();
