const playersEl = document.getElementById('players');
const searchEl = document.getElementById('search');
const sortEl = document.getElementById('sort');

let players = [];

async function loadPlayers(){
  try{
    const res = await fetch('players.json');
    players = await res.json();
  }catch(e){
    players = [];
  }
  renderPlayers();
}

function formatNumber(n){return n!=null?n:'—'}

function renderPlayers(){
  const q = searchEl.value.trim().toLowerCase();
  let list = players.slice();

  if(q){
    list = list.filter(p=>p.name.toLowerCase().includes(q));
  }

  switch(sortEl.value){
    case 'goals_desc': list.sort((a,b)=> (b.goals||0)-(a.goals||0)); break;
    case 'goals_asc': list.sort((a,b)=> (a.goals||0)-(b.goals||0)); break;
    case 'caps_desc': list.sort((a,b)=> (b.caps||0)-(a.caps||0)); break;
    case 'caps_asc': list.sort((a,b)=> (a.caps||0)-(b.caps||0)); break;
    case 'name_asc': list.sort((a,b)=> a.name.localeCompare(b.name)); break;
  }

  if(list.length===0){
    playersEl.innerHTML = '<div class="empty">No players found.</div>';
    return;
  }

  playersEl.innerHTML = '';
  for(const p of list){
    const card = document.createElement('article');
    card.className = 'card';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    const img = document.createElement('img');
    img.alt = p.name;
    img.src = p.image || 'placeholder.svg';
    avatar.appendChild(img);

    const meta = document.createElement('div');
    meta.className = 'meta';
    const h3 = document.createElement('h3');
    h3.textContent = p.name;
    const desc = document.createElement('p');
    desc.textContent = p.nationality ? p.nationality : 'Iraq';

    const stats = document.createElement('div');
    stats.className = 'stats';
    const s1 = document.createElement('div'); s1.className='stat'; s1.textContent = `Goals: ${formatNumber(p.goals)}`
    const s2 = document.createElement('div'); s2.className='stat'; s2.textContent = `Caps: ${formatNumber(p.caps)}`
    stats.appendChild(s1); stats.appendChild(s2);

    meta.appendChild(h3); meta.appendChild(desc); meta.appendChild(stats);

    card.appendChild(avatar); card.appendChild(meta);
    playersEl.appendChild(card);
  }
}

searchEl.addEventListener('input',()=>renderPlayers());
sortEl.addEventListener('change',()=>renderPlayers());

loadPlayers();
