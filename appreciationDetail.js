let pageData = {
    currentTab: 0,
    poemData: {
        title: "",
        author: "",
        content: "",
        translation: "",
        appreciation: "" // 确保这个字段存在
    }
}

//页面初始化读取跳转诗词数据
function initPage(){
    const params = new URLSearchParams(window.location.search)
    const poemDataStr = params.get('poemData')
    if(poemDataStr){
        try{
            const poemData = JSON.parse(decodeURIComponent(poemDataStr))
            pageData.poemData = poemData // 把数据存入pageData
            renderAllData()
        }catch(err){
            alert('数据加载失败')
            history.back()
        }
    }
    bindTabEvent()
    document.querySelector('.back-btn').addEventListener('click',()=>history.back())
}

//渲染全部诗词内容
function renderAllData(){
    document.getElementById('showTitle').innerText = pageData.poemData.title
    document.getElementById('showAuthor').innerText = pageData.poemData.author
    document.getElementById('showContent').innerText = pageData.poemData.content
    document.getElementById('transText').innerText = pageData.poemData.translation
    // 修正：这里原来是 pageData.appreciation，现在是 pageData.poemData.appreciation
    document.getElementById('apprText').innerText = pageData.poemData.appreciation 
}

//绑定译文赏析标签切换
function bindTabEvent(){
    const tabList = document.querySelectorAll('.tab-item')
    const transDom = document.getElementById('transText')
    const apprDom = document.getElementById('apprText')
    tabList.forEach(item=>{
        item.addEventListener('click',function(){
            const tab = parseInt(this.dataset.tab)
            pageData.currentTab = tab
            tabList.forEach(t=>t.classList.remove('active'))
            this.classList.add('active')
            if(tab === 0){
                transDom.classList.remove('hide')
                apprDom.classList.add('hide')
            }else{
                transDom.classList.add('hide')
                apprDom.classList.remove('hide')
            }
        })
    })
}

window.onload = initPage