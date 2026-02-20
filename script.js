const quizData = [
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
    question: "勞闆慈悲為懷，常在大群佈施，請問勞闆揪野女人進菇的台詞是？",
    options: ["兄弟大飯店", "來來大飯店", "晶華酒店", "福華飯店"],
    answer: "來來大飯店"
  },
  {
    type: "multi",
    title: "第四題",
    question: "請問下列哪位神秘人士尚未洩漏本名？",
    options: ["予秧", "多莉", "估董", "勞闆", "ㄑ", "地瓜", "ㄟ力酥"],
    answer: ["予秧", "地瓜"]
  },
  {
    type: "single",
    title: "第五題",
    question: "公司群組吵得要命，請問下列哪個關鍵字出現最多次？",
    options: ["坐牢", "長照", "拉屎", "笑屎"],
    answer: "笑屎"
  },
  {
    type: "match",
    title: "第六題",
    question: "請將本公司成員的現居住地，由南到北依序排列",
    pairs: {
      "捏": "1",
      "ㄑ": "2",
      "酥": "3",
      "瓜": "4"
    }
  },
  {
    type: "match",
    title: "第七題",
    question: "抱對蜜大腿就有菇可打，請選出正確的大腿圍",
    pairs: {
      "捏": "21",
      "ㄑ": "55",
      "瓜": "16",
      "酥": "15"
    }
  },
  {
    type: "match",
    title: "第八題",
    question: "請配對地瓜動物園居民的正確數量",
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
    question: "請配對正確的老巢",
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
    question: "請依大姨媽來的順序從月初到月底排列",
    pairs: {
      "瓜": "1",
      "酥": "2",
      "捏": "3",
      "ㄑ": "4"
    }
  }
];

const quizContainer = document.getElementById("quiz");

quizData.forEach((q, index) => {
  const card = document.createElement("div");
  card.className = "quiz-card";

  let html = `
    <h2>${q.title}</h2>
    <p>${q.question}</p>
  `;

  if (q.type === "single" || q.type === "multi") {
    q.options.forEach(opt => {
      html += `
        <label class="option">
          <input type="${q.type === "single" ? "radio" : "checkbox"}" 
                 name="q${index}">
          <span>${opt}</span>
        </label>
      `;
    });
  }

  if (q.type === "match") {
    Object.keys(q.pairs).forEach(left => {
      html += `
        <div class="match-row">
          <span class="match-left">${left}</span>
          <select>
            ${Object.values(q.pairs)
              .map(v => `<option value="${v}">${v}</option>`)
              .join("")}
          </select>
        </div>
      `;
    });
  }

  card.innerHTML = html;
  quizContainer.appendChild(card);
});
