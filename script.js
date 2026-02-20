// ✅ 確保 DOM 載入後才執行
document.addEventListener("DOMContentLoaded", () => {

const quizData = [
  {
    type:"choice",
    question:"兵貴神速，請問下列哪一位進菇速度最快？",
    options:["草","毛","KU","老公"],
    answer:"草"
  },
  {
    type:"choice",
    question:"勞闆慈悲為懷，請問揪野女人進菇的台詞是？",
    options:["兄弟大飯店","來來大飯店","晶華酒店","福華飯店"],
    answer:"來來大飯店"
  }
];

let current = 0;

const qEl = document.getElementById("question");
const cEl = document.getElementById("content");
const btn = document.getElementById("nextBtn");

function loadQuestion(){
  const q = quizData[current];
  qEl.innerText = q.question;
  cEl.innerHTML = "";

  q.options.forEach(opt=>{
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = opt;
    div.onclick = ()=>{
      document.querySelectorAll(".option").forEach(o=>o.classList.remove("active"));
      div.classList.add("active");
      btn.disabled = false;
    };
    cEl.appendChild(div);
  });

  btn.disabled = true;
}

btn.onclick = ()=>{
  current++;
  if(current < quizData.length){
    loadQuestion();
  }else{
    qEl.innerText = "完成 🎉";
    cEl.innerHTML = "";
    btn.style.display = "none";
  }
};

loadQuestion();

});
