const API_KEY = "d469d701-6038-4eaa-a2dc-ea85dd31d8d0";
const API_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
const ENDPOINT_ID = "ep-m-20260406144324-qsmsj";

let pageData = {
  poemname: "",
  loading: false
};

const poemInput = document.getElementById('poemname');
const generateBtn = document.getElementById('generateBtn');

poemInput.addEventListener('input', (e) => {
  pageData.poemname = e.target.value;
})

generateBtn.addEventListener('click', async () => {
  const poemname = pageData.poemname.trim();
  if (!poemname) {
    alert("请输入诗名");
    return;
  }
  if(pageData.loading) return;

  pageData.loading = true;
  generateBtn.innerText = "AI生成题目中...";
  generateBtn.style.opacity = "0.85";

  const prompt = `
请根据古诗《${poemname}》生成6道单选题，要求：
1. 每题4个选项，仅1个正确答案
2. 覆盖：诗句填空、字词释义、作者朝代、主旨情感、文学常识等维度
3. 每道题附带1-2句简短解析
4. 严格返回JSON格式，无任何多余文字，格式如下：
[
  {
    "question": "题目内容",
    "options": ["选项A","选项B","选项C","选项D"],
    "answer": 0,
    "analysis": "解析内容"
  }
]
`;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      timeout: 120000,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: ENDPOINT_ID,
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    })

    if (!res.ok || !res.ok) {
      alert(`生成失败：${res.status}`);
      return;
    }
    const resData = await res.json();
    let content = resData.choices[0].message.content;
    content = content.replace(/^```json\s*/, "").replace(/\s*```$/, "");

    const questions = JSON.parse(content);
    if (!Array.isArray(questions) || questions.length < 6) {
      throw new Error("题目数量不足");
    }
    window.location.href = `examTest.html?questions=${encodeURIComponent(JSON.stringify(questions))}`;
  } catch (err) {
    console.error(err);
    alert("题目生成格式错误，请重试");
  } finally {
    pageData.loading = false;
    generateBtn.innerText = "生成题目";
    generateBtn.style.opacity = "1";
  }
})