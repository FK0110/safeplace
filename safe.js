(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const touch=matchMedia('(hover: none) and (pointer: coarse)').matches;
$$('.d').forEach(e=>e.hidden=touch);$$('.m').forEach(e=>e.hidden=!touch);
const panels=$$('.panel'),live=$('#live'),hint=$('#hint'),body=document.body,snd=$('#sound');
const noisy=p=>p&&p.dataset.noise!==undefined;
let i=0,locked=false,idle,last=0;

function show(n){
  i=n;const cur=panels[i],name=cur.dataset.name;
  panels.forEach((p,k)=>{
    p.classList.toggle('current',k===i);
    p.classList.toggle('g1',noisy(cur)&&noisy(p)&&k===i-1);
    p.classList.toggle('g2',noisy(cur)&&noisy(p)&&noisy(panels[i-1])&&k===i-2);
    p.setAttribute('aria-hidden',k!==i);
  });
  body.classList.toggle('noise',noisy(cur));
  body.classList.toggle('relax',name==='relax');
  body.classList.toggle('day',name==='final');
  live.textContent=cur.textContent;
  hint.classList.remove('on');clearTimeout(idle);
  if(name!=='final'&&name!=='relax')idle=setTimeout(()=>hint.classList.add('on'),9000);
  if(name==='music')play();
  if(name==='relax')relax(cur);
}
function next(){
  if(locked||i>=panels.length-1||Date.now()-last<600)return;
  last=Date.now();show(i+1);
}
function relax(el){
  locked=true;const t=$('.time',el);let s=30;t.textContent=s;
  const iv=setInterval(()=>{
    t.textContent=--s;
    if(s<=0){clearInterval(iv);setTimeout(()=>{locked=false;next()},1800)}
  },1000);
}

/* music: plays only if music.mp3 sits next to the page */
let audio,on=true;
try{
  audio=new Audio('music.mp3');audio.loop=true;audio.volume=0;
  audio.addEventListener('canplaythrough',()=>{snd.hidden=false},{once:true});
}catch(e){}
function play(){
  if(!audio||!on)return;
  audio.play().then(()=>{let v=0;const f=setInterval(()=>{v=Math.min(.7,v+.05);audio.volume=v;if(v>=.7)clearInterval(f)},300)}).catch(()=>{});
}
snd.addEventListener('click',()=>{
  on=!on;snd.setAttribute('aria-pressed',on);snd.textContent=on?'sound on':'sound off';
  on?audio.play().catch(()=>{}):audio.pause();
});

addEventListener('keydown',e=>{
  if(e.repeat||!['\u0020','Enter','ArrowRight'].includes(e.key)||e.target.closest('a,button'))return;
  e.preventDefault();next();
});
addEventListener('pointerdown',e=>{if(!e.target.closest('a,button'))next()});
show(0);
})();
