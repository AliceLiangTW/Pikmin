const quizData = [

  { type:"multi",
    question:"本公司經營業務相當多元，請問下列何者為經營項目？",
    options:["四星巨","揪打美片","卡菇","跨月大元素"],
    answer:["四星巨","揪打美片","卡菇","跨月大元素"]
  },

  { type:"choice",
    question:"兵貴神速，請問下列哪一位進菇速度最快？",
    options:["草","毛","KU","老公"],
    answer:"草"
  },

  { type:"choice",
    question:"勞闆慈悲為懷，常在大群佈施，請問勞闆揪野女人進菇的台詞是？",
    options:["兄弟大飯店","來來大飯店","晶華酒店","福華飯店"],
    answer:"來來大飯店"
  },

  { type:"multi",
    question:"請問下列哪位神秘人士尚未洩漏本名？",
    options:["予秧","多莉","估董","勞闆","ㄑ","地瓜","ㄟ力酥"],
    answer:["予秧","地瓜"]
  },

  { type:"choice",
    question:"公司群組吵得要命，請問下列哪個關鍵字出現最多次？",
    options:["坐牢","長照","拉屎","笑屎"],
    answer:"笑屎"
  },

  { type:"sort",
    question:"請將本公司成員的現居住地，由南到北排列：",
    items:["捏","ㄑ","酥","瓜"],
    answer:["捏","ㄑ","酥","瓜"]
  },

  { type:"match",
    question:"抱對蜜大腿就有菇可打，請配對正確的大腿圍",
    pairs:{ "捏":"21","ㄑ":"55","瓜":"16","酥":"15" }
  },

  { type:"match",
    question:"請配對地瓜動物園居民數量",
    pairs:{ "貓":"1","天竺鼠":"3","烏龜":"3","魚":"一堆" }
  },

  { type:"match",
    question:"請配對正確的老巢",
    pairs:{ "捏":"土耳其","ㄑ":"荷蘭","瓜":"北海道","酥":"墨西哥" }
  },

  { type:"sort",
    question:"請依大姨媽來的順序從月初到月底排列：",
    items:["瓜","捏","酥","ㄑ"],
    answer:["瓜","捏","酥","ㄑ"]
  }
];

/* ========= 狀態 ========= */
let current = 0;
let userAnswers = new Array(quizData.length).fill(null);

/* ========= DOM ========= */
const qEl = document.getElementById("question");
const cEl = document.getElementById("content");
const pEl = document.getElementById("progress");
const btn = document.getElementById("nextBtn");
const nav = document.getElementById("nav");

/* ========= 工具 ========= */
function shuffle(arr){
  return [...arr].sort(()=>Math.random()-0.5);
}

/* ========= 導覽 ========= */
function createNav(){
  nav.innerHTML="";
  quizData.forEach((_,i)=>{
    const d=document.createElement("div");
    d.className="dot";
    d.innerText=i+1;
    d.onclick=()=>{ current=i; loadQuestion(); };
    nav.appendChild(d);
  });
}

function updateNav(){
  document.querySelectorAll(".dot").forEach((d,i)=>{
    d.classList.remove("active","answered");
    if(i===current) d.classList.add("active");
    if(userAnswers[i] && (
      Array.isArray(userAnswers[i]) ? userAnswers[i].length>0 : true
    )) d.classList.add("answered");
  });
}

/* ========= 載入題目 ========= */
function loadQuestion(){
  const q = quizData[current];
  qEl.innerText = q.question;
  pEl.innerText = `第 ${current+1} 題 / 共 ${quizData.length} 題`;
  cEl.innerHTML = "";
  btn.disabled = true;

  if(q.type==="choice") renderChoice(q);
  if(q.type==="multi") renderMulti(q);
  if(q.type==="sort") renderSort(q);
  if(q.type==="match") renderMatch(q);

  btn.innerText = current===quizData.length-1 ? "完成測驗" : "下一題";
  updateNav();
}

/* ========= 題型 ========= */
function renderChoice(q){
  shuffle(q.options).forEach(opt=>{
    const div=document.createElement("div");
    div.className="option";
    div.innerText=opt;
    div.onclick=()=>{
      userAnswers[current]=opt;
      document.querySelectorAll(".option").forEach(o=>o.classList.remove("active"));
      div.classList.add("active");
      btn.disabled=false;
    };
    cEl.appendChild(div);
  });
}

function renderMulti(q){
  userAnswers[current] ||= [];
  shuffle(q.options).forEach(opt=>{
    const div=document.createElement("div");
    div.className="option";
    div.innerText=opt;
    div.onclick=()=>{
      const arr=userAnswers[current];
      if(arr.includes(opt)){
        userAnswers[current]=arr.filter(x=>x!==opt);
        div.classList.remove("active");
      }else{
        arr.push(opt);
        div.classList.add("active");
      }
      btn.disabled = userAnswers[current].length===0;
    };
    cEl.appendChild(div);
  });
}

function renderSort(q){
  shuffle(q.items).forEach(text=>{
    const div=document.createElement("div");
    div.className="drag";
    div.draggable=true;
    div.innerText=text;
    div.ondragstart=e=>e.dataTransfer.setData("text",text);
    div.ondragover=e=>e.preventDefault();
    div.ondrop=e=>{
      e.preventDefault();
      const from=e.dataTransfer.getData("text");
      const fromEl=[...cEl.children].find(x=>x.innerText===from);
      cEl.insertBefore(fromEl,div);
      saveSort();
    };
    cEl.appendChild(div);
  });
  saveSort();
}

function saveSort(){
  userAnswers[current]=[...cEl.children].map(x=>x.innerText);
  btn.disabled=false;
}

function renderMatch(q){
  const values=shuffle(Object.values(q.pairs));
  Object.keys(q.pairs).forEach(k=>{
    const row=document.createElement("div");
    row.className="match-row";
    row.innerHTML=`<span>${k}</span>`;
    const select=document.createElement("select");
    select.innerHTML=`<option value="">選擇</option>`+
      values.map(v=>`<option>${v}</option>`).join("");
    select.onchange=()=>{
      userAnswers[current] ||= {};
      userAnswers[current][k]=select.value;
      btn.disabled=false;
    };
    row.appendChild(select);
    cEl.appendChild(row);
  });
}

/* ========= 控制 ========= */
function nextQuestion(){
  current<quizData.length-1 ? (current++,loadQuestion()) : showResult();
}

function showResult(){
  let correct=0;
  quizData.forEach((q,i)=>{
    if(q.type==="choice" && userAnswers[i]===q.answer) correct++;
    if(q.type==="multi" &&
      JSON.stringify([...userAnswers[i]].sort())===
      JSON.stringify([...q.answer].sort())) correct++;
    if(q.type==="sort" &&
      JSON.stringify(userAnswers[i])===JSON.stringify(q.answer)) correct++;
    if(q.type==="match"){
      let ok=true;
      for(let k in q.pairs){
        if(userAnswers[i]?.[k]!==q.pairs[k]) ok=false;
      }
      if(ok) correct++;
    }
  });

  const score=Math.round(correct/quizData.length*100);
  document.querySelector(".card").innerHTML=`
    <h2>測驗完成 🎉</h2>
    <div class="final">${score} 分</div>
    <button onclick="location.reload()">重新作答</button>
  `;
}

/* ========= 啟動 ========= */
createNav();
loadQuestion();
