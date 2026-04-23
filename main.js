let pageData = {
    inputText: "",
    chatList: [],
    isSending: false,
    poetId: "libai",
    poetName: "李白",
    systemPrompt: ""
}
const chatBox = document.getElementById('chatBox')
const msgInput = document.getElementById('msgInput')
const sendBtn = document.getElementById('sendBtn')
const chatScroll = document.getElementById('chatScroll')
const loadingDom = document.getElementById('loadingDom')

// 从URL获取诗人参数
function initPage() {
    const params = new URLSearchParams(window.location.search)
    const poetId = params.get('poetId') || 'libai'
    const poetName = params.get('poetName') || '李白'
    const poet = poetsConfig[poetId]
    if (!poet) {
        alert("诗人不存在")
        history.back()
        return
    }
    pageData.poetId = poetId
    pageData.poetName = poetName
    pageData.systemPrompt = poet.prompt
    document.title = `与${poetName}对话`
}

function renderChat(){
    chatBox.innerHTML = ''
    pageData.chatList.forEach(item=>{
        const div = document.createElement('div')
        div.className = `chat-item ${item.role === 'user' ? 'user' : 'ai'}`
        div.innerHTML = `<div class="chat-bubble"><div class="chat-content">${item.content}</div></div>`
        chatBox.appendChild(div)
    })
    chatScroll.scrollTop = chatScroll.scrollHeight
}

msgInput.addEventListener('input',(e)=>{
    pageData.inputText = e.target.value.trim()
})

msgInput.addEventListener('keydown',(e)=>{
    if(e.key === 'Enter') sendMsg()
})

sendBtn.addEventListener('click',sendMsg)

function sendMsg(){
    if(pageData.isSending) return
    if(!pageData.inputText){
        alert("请输入内容")
        return
    }
    const userMsg = {
        id: Date.now().toString(),
        role: "user",
        content: pageData.inputText
    }
    pageData.chatList.push(userMsg)
    pageData.inputText = ""
    msgInput.value = ""
    pageData.isSending = true
    sendBtn.classList.add('disabled')
    loadingDom.style.display = 'flex'
    renderChat()
    requestAiReply(pageData.systemPrompt,userMsg.content)
}

async function requestAiReply(systemPrompt,userInput){
    try{
        const res = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer d469d701-6038-4eaa-a2dc-ea85dd31d8d0"
            },
            body:JSON.stringify({
                model:"ep-m-20260406144324-qsmsj",
                messages:[
                    {role:"system",content:systemPrompt},
                    {role:"user",content:userInput}
                ],
                temperature:0.8,
                max_tokens:1024
            })
        })
        const data = await res.json()
        let reply = "吾今日思绪不畅，愿君换个话题。"
        if(data?.choices?.[0]?.message?.content){
            reply = data.choices[0].message.content.trim()
        }
        pushAiMsg(reply)
    }catch(err){
        console.error(err)
        pushAiMsg("网络不畅，无法应答，请稍后再试。")
    }
}

function pushAiMsg(content){
    const aiMsg = {
        id: (Date.now()+1).toString(),
        role: "ai",
        content: content
    }
    pageData.chatList.push(aiMsg)
    pageData.isSending = false
    sendBtn.classList.remove('disabled')
    loadingDom.style.display = 'none'
    renderChat()
}

// 页面初始化
initPage()