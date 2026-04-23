let pageData = {
  questions: [],
  total: 0,
  index: 0,
  current: null,
  selected: -1,
  showanswer: false,
  correct: 0,
  rate: "0%"
}

//页面初始化读取传递题目数据
function initPage() {
  const params = new URLSearchParams(window.location.search);
  const questStr = params.get('questions');
  if (!questStr) {
    history.back();
    return;
  }
  try {
    const questions = JSON.parse(decodeURIComponent(questStr));
    pageData.questions = questions;
    pageData.total = questions.length;
    pageData.current = questions[0];
    renderQuestion();
    bindAllEvent();
  } catch (e) {
    history.back();
  }
}

//渲染当前题目与选项
function renderQuestion() {
  const {index,total,current,selected,showanswer} = pageData;
  document.getElementById('nowIndex').innerText = index + 1;
  document.getElementById('totalNum').innerText = total;
  document.getElementById('questText').innerText = current.question;
  document.getElementById('analyBox').style.display = showanswer ? "block" : "none";
  document.getElementById('analyText').innerText = current.analysis;

  //渲染选项
  let optionHtml = '';
  current.options.forEach((item,idx)=>{
    let className = 'option-item';
    if(selected == idx) className += ' selected';
    if(showanswer){
      if(idx === current.answer){
        className += ' right';
      }else if(selected == idx){
        className += ' wrong';
      }
    }
    optionHtml += `<div class="${className}" data-idx="${idx}">${item}</div>`;
  })
  document.getElementById('optionBox').innerHTML = optionHtml;
}

//全页面按钮事件绑定
function bindAllEvent() {
  //选项选中
  document.getElementById('optionBox').addEventListener('click',(e)=>{
    if(e.target.classList.contains('option-item') && !pageData.showanswer){
      pageData.selected = Number(e.target.dataset.idx);
      renderQuestion();
    }
  })

  //提交答案判分
  document.getElementById('submitAns').addEventListener('click',()=>{
    const {current,selected,showanswer} = pageData;
    if(selected === -1){
      alert('请先选择答案');
      return;
    }
    if(showanswer) return;
    if(selected === current.answer){
      pageData.correct ++;
    }
    pageData.showanswer = true;
    renderQuestion();
  })

  //切换下一题
  document.getElementById('nextQuest').addEventListener('click',()=>{
    const nextIdx = pageData.index + 1;
    if(nextIdx >= pageData.total) return;
    pageData.index = nextIdx;
    pageData.current = pageData.questions[nextIdx];
    pageData.selected = -1;
    pageData.showanswer = false;
    renderQuestion();
  })

  //结算最终成绩
  document.getElementById('endQuiz').addEventListener('click',()=>{
    const rate = (pageData.correct / pageData.total * 100).toFixed(0) + "%";
    pageData.rate = rate;
    document.getElementById('quizBox').style.display = "none";
    document.getElementById('resultBox').style.display = "flex";
    document.getElementById('correctNum').innerText = pageData.correct;
    document.getElementById('allNum').innerText = pageData.total;
    document.getElementById('rateText').innerText = rate;
  })

  //返回题库首页
  document.getElementById('backStart').addEventListener('click',()=>{
    history.back();
  })
}

window.onload = initPage;