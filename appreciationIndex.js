let pageData = {
    poemName: "",
    loading: false,
    apiConfig: {
        apiKey: "d469d701-6038-4eaa-a2dc-ea85dd31d8d0",
        model: "doubao-1-5-lite-32k-250115",
        apiUrl: "https://ark.cn-beijing.volces.com/api/v3/chat/completions"
    }
}

const nameInput = document.getElementById('poemNameInput')
const submitBtn = document.getElementById('submitBtn')

nameInput.addEventListener('input',(e)=>{
    pageData.poemName = e.target.value
})

submitBtn.addEventListener('click',generatePoemDetail)

async function generatePoemDetail(){
    const { poemName } = pageData
    if (!poemName.trim()) {
        alert('请输入诗词名称')
        return
    }
    if(pageData.loading) return

    pageData.loading = true
    submitBtn.classList.add('loading')
    submitBtn.innerText = '生成中...'

    const { apiUrl, apiKey, model } = pageData.apiConfig
    try{
        const res = await fetch(apiUrl,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${apiKey}`
            },
            body:JSON.stringify({
                model: model,
                messages: [
                    {
                        role: "system",
                        content: "你是专业的古诗文专家，严格按照JSON格式返回结果，不要任何多余内容、解释、markdown格式，只返回纯JSON。格式要求：{\"title\":\"诗词标题\",\"author\":\"作者朝代+姓名\",\"content\":\"诗词原文（保留换行）\",\"translation\":\"白话文译文（分段清晰）\",\"appreciation\":\"深度赏析（包含意境、手法、情感、背景，分段清晰）\"}"
                    },
                    {
                        role: "user",
                        content: `请提供《${poemName}》的完整信息，严格按照要求的JSON格式返回，不要任何多余内容`
                    }
                ],
                temperature: 0.7,
                stream: false
            })
        })
        const result = await res.json()
        const aiResult = JSON.parse(result.choices[0].message.content)
        //携带诗词数据跳转详情赏析页
        window.location.href = `appreciationDetail.html?poemData=${encodeURIComponent(JSON.stringify(aiResult))}`
    }catch(error){
        alert('生成失败，请重试')
        console.error(error)
    }finally{
        pageData.loading = false
        submitBtn.classList.remove('loading')
        submitBtn.innerText = '查看译文与赏析'
    }
}