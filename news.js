const guides = [
  {title:"Tudo sobre GTA 6",text:"Veja data de lançamento, plataformas, personagens, mapa e links oficiais.",link:"https://www.rockstargames.com/VI"},
  {title:"Personagens de GTA 6",text:"Conheça Jason, Lucia e os demais personagens apresentados oficialmente pela Rockstar.",link:"https://www.rockstargames.com/VI/media"},
  {title:"Mapa de GTA 6",text:"Explore as regiões e locais de Leonida já apresentados oficialmente.",link:"https://www.rockstargames.com/VI/media/screenshots"},
  {title:"Edições e pré-venda",text:"Confira as edições, bônus e informações de pré-venda do GTA 6.",link:"https://store.rockstargames.com/pt-BR/game/buy-gta-vi"}
];

let allNews=[];
let tickerTimer=null;

function updateTicker(){
  const el=document.getElementById("ticker");
  if(!el||!allNews.length)return;
  const items=allNews.slice(0,10).map(n=>{
    const tag=n.tag||"NOVIDADE";
    return '<span>'+escapeHtml(tag)+' — '+escapeHtml(n.title)+'</span>';
  });
  el.innerHTML=items.join("");
}

function setupTicker(){
  const btn=document.getElementById("tickerPause");
  const ticker=document.getElementById("ticker");
  if(!btn||!ticker)return;
  btn.addEventListener("click",()=>{
    ticker.classList.toggle("ticker-paused");
    btn.textContent=ticker.classList.contains("ticker-paused")?"▶":"Ⅱ";
  });
}

async function loadNews(){
  const el=document.getElementById("news");
  try{
    const r=await fetch("data/news.json?"+Date.now());
    allNews=await r.json();
    updateTicker();
    render("all");
  }catch(e){
    el.innerHTML='<p>Não foi possível carregar as notícias agora.</p>';
  }
}

function render(filter){
  const el=document.getElementById("news");
  let list;
  if(filter==="guides"){
    list=guides.map(g=>({guide:true,...g}));
  }else{
    list=allNews.filter(n=>{
      if(filter==="official") return n.tag==="OFICIAL";
      if(filter==="rumor") return n.tag==="RUMOR";
      if(filter==="news") return n.tag==="NOVIDADE";
      return true;
    });
  }

  if(!list.length){
    el.innerHTML='<div class="empty"><h3>Nenhum conteúdo encontrado</h3><p>Quando aparecer conteúdo nessa categoria, ele será mostrado aqui.</p></div>';
    return;
  }

  el.innerHTML=list.map(n=>n.guide?guideCard(n):newsCard(n)).join("");
}

function newsCard(n){
  const image=n.image
    ? '<img class="news-image" src="'+escapeHtml(n.image)+'" alt="'+escapeHtml(n.title)+'" loading="lazy" onerror="this.closest(\'.card\').classList.add(\'no-image\');this.remove()">'
    : '';
  return '<article class="card">'+image+
    '<div class="card-body"><div class="badge '+badgeClass(n.tag)+'">'+escapeHtml(n.tag)+'</div>'+
    '<h3>'+escapeHtml(n.title)+'</h3><p>'+escapeHtml(n.text)+'</p>'+
    '<div class="source">'+escapeHtml(n.source||"")+' • '+escapeHtml(n.date||"")+'</div>'+
    (n.link?'<a class="read" href="'+escapeHtml(n.link)+'" target="_blank" rel="noopener noreferrer">Ler notícia →</a>':'')+
    '</div></article>';
}

function guideCard(n){
  return '<article class="card guide-card"><div class="guide-icon">GTA 6</div><div class="card-body">'+
    '<div class="badge guide-badge">GUIA</div><h3>'+escapeHtml(n.title)+'</h3><p>'+escapeHtml(n.text)+'</p>'+
    '<a class="read" href="'+escapeHtml(n.link)+'" target="_blank" rel="noopener noreferrer">Abrir guia →</a>'+
    '</div></article>';
}

function badgeClass(tag){
  return String(tag||"").toLowerCase();
}

function escapeHtml(s=""){
  return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

document.addEventListener("click",e=>{
  const btn=e.target.closest(".filter");
  if(!btn)return;
  e.preventDefault();
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");
  render(btn.dataset.filter);
  document.getElementById("ultimas").scrollIntoView({behavior:"smooth",block:"start"});
});

setupTicker();
loadNews();