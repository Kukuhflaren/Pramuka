// Logika aplikasi. Dimuat setelah data/bank-*.js dan js/sandi.js.
const $=s=>document.querySelector(s),A='ABCDEFGHIJKLMNOPQRSTUVWXYZ',esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const CATS=[['pk','⭐','Pengetahuan Kepramukaan','r'],['sandi','🔐','Sandi Pramuka','s'],['morse','●','Morse','m'],['tali','🔗','Tali Temali','r'],['kompas','🧭','Kompas','r'],['surv','🍖','Survival','r'],['pppk','🚑','PPPK','r'],['topo','🗺️','Topografi','r'],['peta','📋','Pemetaan','r']];
const rnd=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function show(id){document.querySelectorAll('.screen').forEach(e=>e.classList.toggle('on',e.id===id));scrollTo(0,0)}
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',2600)}
$('#cats').innerHTML=CATS.map(c=>`<button class="cat" onclick="openSetup('${c[0]}')"><span>${c[1]}</span>${c[2]}</button>`).join('');
let cat,cur;
function sync(r,n){r.oninput=()=>n.value=r.value;n.oninput=()=>{n.value=Math.max(1,Math.min(100,+n.value||1));r.value=n.value}}
sync($('#nR'),$('#nN'));sync($('#nR2'),$('#nN2'));
$('#form').onchange=()=>$('#optW').style.display=$('#form').value==='isi'?'none':'block';
function openSetup(k){cat=CATS.find(c=>c[0]===k);$('#stitle').textContent=cat[1]+' '+cat[2];
$('#sRand').style.display=cat[3]==='r'?'block':'none';$('#sSandi').style.display=cat[3]==='s'?'block':'none';$('#sMorse').style.display=cat[3]==='m'?'block':'none';
if(cat[3]==='s'){$('#st1').style.display='block';$('#st2').style.display='none'}show('setup')}

// ===== Morse =====
let ctx,nodes=[];
function playMorse(){stopMorse();ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();const u=1.2/$('#wpm').value,f=+$('#fr').value,w=$('#snd').value;let t=ctx.currentTime+.05;
for(const ch of toMorse($('#mt').value)){if(ch==='.'||ch==='-'){const d=(ch==='.'?1:3)*u,o=ctx.createOscillator(),g=ctx.createGain(),e=Math.min(.004,d/4);o.type=w;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.2,t+e);g.gain.setValueAtTime(.2,t+d-e);g.gain.linearRampToValueAtTime(0,t+d);o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+d);nodes.push(o);t+=d+u}else if(ch===' ')t+=2*u;else t+=4*u}}
function stopMorse(){nodes.forEach(o=>{try{o.stop()}catch(e){}});nodes=[]}

// ===== Sandi =====
$('#jns').innerHTML=JN.map(j=>`<option value="${j[0]}">${j[1]}</option>`).join('');
let S=[],ix=0;const it=()=>S[ix],encOf=o=>o.k.trim()?E[o.j](o.k,o.key):'';
function toStep2(){const n=+$('#nN2').value||1;S=Array.from({length:n},()=>({k:'',j:'abjad',key:{}}));ix=0;$('#st1').style.display='none';$('#st2').style.display='block';draw()}
function draw(){$('#cnt').textContent=`Soal ${ix+1} dari ${S.length}`;$('#kal').value=it().k;$('#jns').value=it().j;fields();prev()}
function fields(){const d=$('#keys');d.innerHTML='';(KF[it().j]||[]).forEach(([id,lb,ty,op])=>{const l=document.createElement('label');l.textContent=lb;let e;if(ty==='s'){e=document.createElement('select');op.forEach(o=>e.add(new Option(o,o)))}else{e=document.createElement('input');e.type={n:'number',date:'date',time:'time'}[ty]||'text'}if(it().key[id]!==undefined)e.value=it().key[id];else it().key[id]=e.value;e.oninput=e.onchange=()=>{it().key[id]=e.value;prev()};d.append(l,e)})}
function prev(){const e=encOf(it()),v=$('#pv');v.textContent=e||'(ketik kalimat)';const br=FF[it().j]&&e;v.style.fontFamily=br?FF[it().j]:'';v.style.fontSize=br?'32px':'';v.style.whiteSpace=br?'pre-wrap':''}
$('#kal').oninput=e=>{it().k=e.target.value;prev()};
$('#jns').onchange=e=>{it().j=e.target.value;it().key={};fields();prev()};
function nav(d){ix=Math.max(0,Math.min(S.length-1,ix+d));draw()}
function finishSandi(){const bad=S.findIndex(o=>!o.k.trim());if(bad>=0){ix=bad;draw();return toast('Soal '+(bad+1)+' belum diisi')}
const items=S.map(o=>{const e=encOf(o),fe=FF[o.j]?`<span style="font-family:${FF[o.j]};font-size:${o.j==='braille'?22:28}px;white-space:pre-wrap;overflow-wrap:anywhere">${esc(e)}</span>`:esc(e),jl=JN.find(j=>j[0]===o.j)[1],ky=Object.values(o.key).filter(Boolean).join(', ');return{q:fe+kt(o),kj:`Kalimat: ${esc(o.k.toUpperCase())} | Jawaban (${esc(jl)}): ${fe}${ky?' | Kunci: '+esc(ky):''}`}});
run('Sandi Pramuka',()=>items)}

// ===== Random =====
function pick(k,n){const all=BK[k].map(s=>s.split('|')),B=rnd(all.filter(x=>x[2]==='B')),Lx=rnd(all.filter(x=>x[2]==='L'));const nb=Math.min(B.length,Math.round(n*.7));let r=[...B.slice(0,nb),...Lx.slice(0,n-nb)];if(r.length<n)r=r.concat(rnd([...B.slice(nb),...Lx.slice(n-nb)]));if(r.length<n)toast('Bank '+cat[2]+' baru '+all.length+' soal');return rnd(r.slice(0,n))}
function genRandom(){const n=+$('#nN').value||1,k=cat[0],f=$('#form').value,no=+$('#nopt').value,pool=BK[k].map(s=>s.split('|')[1]);
run(cat[2],()=>pick(k,n).map(x=>{const pg=f==='pg'||(f==='mix'&&Math.random()<.5);if(!pg)return{q:esc(x[0])+' …………………………',kj:esc(x[1])+' <small>['+x[2]+']</small>'};
let d=rnd((x[3]||'').split(';').map(t=>t.trim()).filter(t=>t&&t!==x[1])).slice(0,no-1);if(d.length<no-1)d=d.concat(rnd([...new Set(pool)].filter(p=>p!==x[1]&&!d.includes(p))).slice(0,no-1-d.length));const o=rnd([x[1],...d]);return{q:esc(x[0]),o,kj:'<b>'+'abcde'[o.indexOf(x[1])]+')</b> '+esc(x[1])+' <small>['+x[2]+']</small>'}}))}
function run(title,build){show('gen');let p=0;const b=$('#pb');b.style.width=0;const iv=setInterval(()=>{p+=5;b.style.width=p+'%';if(p>=100){clearInterval(iv);cur={title,items:build(),at:Date.now()};render();show('disp')}},100)}
function bodyHTML(kj){const s=cur.items.map((o,i)=>kj?`<div>${i+1}. ${o.kj}</div>`:`<div class="q">${i+1}. ${o.q}${(o.o||[]).map((t,j)=>`<div class="o">${'abcde'[j]}) ${esc(t)}</div>`).join('')}</div>`).join('');return`<div style="text-align:center"><b>${kj?'KUNCI JAWABAN':'SOAL PRAMUKA'} — ${esc(cur.title.toUpperCase())}</b></div><p><b>${kj?'JAWABAN:':'SOAL:'}</b></p>${s}`}
function render(){$('#sheet').innerHTML=bodyHTML(0)+'<div id="kj">'+bodyHTML(1)+'</div>'}
function togKJ(){const k=$('#kj');k.style.display=k.style.display==='block'?'none':'block'}
function save(){try{localStorage.setItem('soalPramuka_'+cur.at,JSON.stringify(cur));toast('Soal tersimpan')}catch(e){toast('Penyimpanan tidak tersedia')}}
function dl(kj){if(!window.html2pdf)return toast('Library PDF belum termuat');const d=document.createElement('div');d.style.cssText='width:150mm;font:12px/1.6 "Times New Roman",serif;color:#000;background:#fff';d.innerHTML=bodyHTML(kj);
html2pdf().set({margin:30,filename:(kj?'KJ_':'Soal_')+cur.title.replace(/\s+/g,'_')+'.pdf',image:{type:'jpeg',quality:.95},html2canvas:{scale:2},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy'],avoid:'.q'}}).from(d).save().catch(()=>toast('Gagal membuat PDF'))}
