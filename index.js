const poetList = [
  {
    id: "libai",
    name: "李白",
    desc: "诗仙 · 豪放浪漫",
    avatar: "李"
  },
  {
    id: "dufu",
    name: "杜甫",
    desc: "诗圣 · 沉郁顿挫",
    avatar: "杜"
  },
  {
    id: "sushi",
    name: "苏轼",
    desc: "东坡居士 · 豁达洒脱",
    avatar: "苏"
  },
  {
    id: "wangwei",
    name: "王维",
    desc: "诗佛 · 诗中有画",
    avatar: "王"
  },
  {
    id: "liqingzhao",
    name: "李清照",
    desc: "千古第一才女 · 婉约词宗",
    avatar: "李"
  },
  {
    id: "xinqiji",
    name: "辛弃疾",
    desc: "词中之龙 · 豪放悲壮",
    avatar: "辛"
  }
]

function renderPoetCard(){
  const box = document.getElementById('poetList')
  let html = ''
  poetList.forEach(item=>{
    html += `
    <div class="poet-card" data-id="${item.id}">
      <div class="poet-avatar">
        <span class="avatar-text">${item.name.charAt(0)}</span>
      </div>
      <div class="poet-info">
        <div class="poet-name">${item.name}</div>
        <div class="poet-desc">${item.desc}</div>
      </div>
      <div class="arrow">→</div>
    </div>
    `
  })
  box.innerHTML = html
  bindClickEvent()
}

function bindClickEvent(){
  document.querySelectorAll('.poet-card').forEach(card=>{
    card.addEventListener('click',function(){
      const poetId = this.dataset.id
      const targetPoet = poetList.find(v=>v.id===poetId)
      if(!targetPoet) return
      window.location.href = `chat.html?poetId=${targetPoet.id}&poetName=${targetPoet.name}`
    })
  })
}

window.onload = renderPoetCard