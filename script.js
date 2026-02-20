const QUESTIONS = [

/* 第一題｜多選（全部都要選） */
{
  type:"multi",
  q:"本公司經營業務相當多元，請問下列何者為經營項目？",
  opts:["四星巨","揪打美片","卡菇","跨月大元素"],
  ans:["四星巨","揪打美片","卡菇","跨月大元素"]
},

/* 第二題｜單選 */
{
  type:"single",
  q:"兵貴神速，請問下列哪一位進菇速度最快？",
  opts:["草","毛","KU","老公"],
  ans:["草"]
},

/* 第三題｜單選 */
{
  type:"single",
  q:"勞闆慈悲為懷，常在大群佈施，請問勞闆揪野女人進菇的台詞是？",
  opts:["兄弟大飯店","來來大飯店","晶華酒店","福華飯店"],
  ans:["來來大飯店"]
},

/* 第四題｜多選 */
{
  type:"multi",
  q:"請問下列哪位神秘人士尚未洩漏本名？",
  opts:["予秧","多莉","估董","勞闆","ㄑ","地瓜","ㄟ力酥"],
  ans:["予秧","地瓜"]
},

/* 第五題｜單選 */
{
  type:"single",
  q:"公司群組吵得要命，請問下列哪個關鍵字出現最多次？",
  opts:["坐牢","長照","拉屎","笑屎"],
  ans:["笑屎"]
},

/* 第六題｜下拉式（排序概念，題目敘述保留） */
{
  type:"select",
  q:"請將本公司成員的現居住地，由南到北依序排列（請選第一位）",
  opts:["捏","ㄑ","酥","瓜"],
  ans:["捏"]
},

/* 第七題｜下拉式（配對） */
{
  type:"select",
  q:"抱對蜜大腿就有菇可打，請選出正確的大腿圍",
  opts:["21","55","16","15"],
  ans:["21","55","16","15"]
},

/* 第八題｜下拉式（配對） */
{
  type:"select",
  q:"請配對地瓜動物園居民的正確數量",
  opts:["1","3","一堆"],
  ans:["1","3","一堆"]
},

/* 第九題｜下拉式（配對） */
{
  type:"select",
  q:"請配對正確的老巢",
  opts:["土耳其","荷蘭","北海道","墨西哥"],
  ans:["土耳其","荷蘭","北海道","墨西哥"]
},

/* 第十題｜下拉式（排序概念） */
{
  type:"select",
  q:"請依大姨媽來的順序從月初到月底（請選第一位）",
  opts:["瓜","捏","酥","ㄑ"],
  ans:["瓜"]
}

];

let current=0;
let userAnswers=new Array(quizData.length).fill(null);

const qEl=document.getElementById("question");
const cEl=document.getElementById("content");
const pEl=document.getElementById("progress");
const btn=document.getElementById("nextBtn");
const nav=document.getElementById("nav");

function shuffle(a){return a.sort(()=>Math.random()-0.5)}

function createNav(){
  nav.innerHTML="";
  quizData.forEach((_,i)=>{
    const d=document.createElement("div");
    d.className="dot";
    d.innerText=i+1;
    d.onclick=()=>{current=i;loadQuestion();}
    nav.appendChild(d);
  });
}

function updateNav(){
  document.querySelectorAll(".dot").forEach((d,i)=>{
    d.classList.remove("active","answered");
    if(i===current)d.classList.add("active");
    if(userAnswers[i])d.classList.add("answered");
  });
}

function loadQuestion(){
  const q=quizData[current];
  qEl.innerText=q.question;
  pEl.innerText=`第 ${current+1} 題 / 共 ${quizData.length} 題`;
  cEl.innerHTML="";
  btn.disabled=true;

  if(q.type==="choice") renderChoice(q);
  if(q.type==="sort") renderSort(q);
  if(q.type==="match") renderMatch(q);

  btn.innerText=current===quizData.length-1?"完成測驗":"下一題";
  updateNav();
}

function renderChoice(q){
  shuffle([...q.options]).forEach(opt=>{
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

function renderSort(q){
  let items=shuffle([...q.items]);
  items.forEach(text=>{
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
  const arr=[...cEl.children].map(x=>x.innerText);
  userAnswers[current]=arr;
  btn.disabled=false;
}

function renderMatch(q){
  const keys=Object.keys(q.pairs);
  const values=shuffle(Object.values(q.pairs));
  keys.forEach(k=>{
    const row=document.createElement("div");
    row.className="match-row";
    const label=document.createElement("span");
    label.innerText=k;
    const select=document.createElement("select");
    select.innerHTML=`<option value="">選擇</option>`+
      values.map(v=>`<option>${v}</option>`).join("");
    select.onchange=()=>{
      if(!userAnswers[current])userAnswers[current]={};
      userAnswers[current][k]=select.value;
      btn.disabled=false;
    };
    row.append(label,select);
    cEl.appendChild(row);
  });
}

function nextQuestion(){
  current<quizData.length-1? (current++,loadQuestion()):showResult();
}

function showResult(){
  let correct=0;
  quizData.forEach((q,i)=>{
    if(q.type==="choice" && userAnswers[i]===q.answer) correct++;
    if(q.type==="sort" && JSON.stringify(userAnswers[i])===JSON.stringify(q.answer)) correct++;
    if(q.type==="match"){
      let ok=true;
      for(let k in q.pairs){
        if(!userAnswers[i]||userAnswers[i][k]!==q.pairs[k]) ok=false;
      }
      if(ok) correct++;
    }
  });

  const score=Math.round((correct/quizData.length)*100);

  document.querySelector(".card").innerHTML=`
    <h2>測驗完成 🎉</h2>
    <div class="final">${score} 分</div>
    <button onclick="location.reload()">重新作答</button>
  `;
}

createNav();
loadQuestion();
