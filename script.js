function submitQuiz() {
  let score = 0;

  const answers = {
    q1: "E", // 以上皆是
    q2: "A", // 草
    q3: "A"  // 來來大飯店
  };

  for (let q in answers) {
    const selected = document.querySelector(`input[name="${q}"]:checked`);
    if (selected && selected.value === answers[q]) {
      score++;
    }
  }

  document.getElementById("result").innerText =
    `你的得分：${score} / ${Object.keys(answers).length}`;
}
