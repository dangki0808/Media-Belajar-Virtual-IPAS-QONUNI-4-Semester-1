/* Virtual IPAS Lab · Qonuni 4 · Semester 1 — mesin halaman, kuis, dan simulasi.
   Catatan desain: tidak ada gambar/ikon makhluk bernyawa (orang/hewan), sesuai adab materi Kuttab. */
(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
const PFX='ipasq4s1:';
const store={get(k){try{const v=localStorage.getItem(PFX+k);return v==null?null:JSON.parse(v);}catch(e){return null;}},set(k,v){try{localStorage.setItem(PFX+k,JSON.stringify(v));}catch(e){}}};
let VO=null; const pickV=()=>{try{const vs=speechSynthesis.getVoices();VO=vs.find(v=>/^id/i.test(v.lang))||null;}catch(e){}};
try{speechSynthesis.onvoiceschanged=pickV;pickV();}catch(e){}
function say(t){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(t).replace(/[“”"]/g,''));u.lang='id-ID';if(VO)u.voice=VO;u.rate=.92;speechSynthesis.speak(u);}catch(e){}}
const sp=(t,l='🔊')=>`<button class="say" data-say="${esc(t)}" aria-label="Dengarkan">${l}</button>`;
document.addEventListener('click',e=>{const b=e.target.closest('[data-say]');if(b){e.preventDefault();say(b.dataset.say);}});
const BAB={1:['Makanan Bergizi untuk Kesehatan Pencernaanmu','🥗'],2:['Tarik dan Hembuskan','🌬️'],3:['Jejak Sang Pahlawan','🎖️']};
const alive=el=>document.body.contains(el);
const praise=()=>shuf(['MasyaAllah, hebat!','Barakallahu fiik!','Alhamdulillah, tepat!','Bagus sekali!'])[0];
const fin=(el,msg,again)=>{el.insertAdjacentHTML('beforeend',`<div class="fb ok">🎉 ${msg} ${again?'<button class="btn soft again" style="margin-left:6px">🔁 Ulangi</button>':''}</div>`);if(again)$('.again',el).onclick=again;};

/* ---------- widget umum ---------- */
const W={};
W.order=(el,c)=>{ let a; do{a=shuf(c.steps.map((s,i)=>i));}while(a.every((v,i)=>v===i)&&c.steps.length>1);
  const draw=(chk)=>{ el.innerHTML=`<ol class="ordl">${a.map((k,i)=>`<li class="${chk?(k===i?'good':'no'):''}"><span class="n">${i+1}</span><span class="e" style="font-size:1.5rem">${c.steps[k][0]}</span><span class="t">${esc(c.steps[k][1])}</span><span class="mv"><button data-u="${i}" aria-label="naik">▲</button><button data-d="${i}" aria-label="turun">▼</button></span></li>`).join('')}</ol><div class="row" style="margin-top:10px"><button class="btn" id="oc">✔️ Periksa urutan</button></div><div class="ofb"></div>`;
    $$('[data-u]',el).forEach(b=>b.onclick=()=>{const i=+b.dataset.u;if(i>0){[a[i-1],a[i]]=[a[i],a[i-1]];draw();}});
    $$('[data-d]',el).forEach(b=>b.onclick=()=>{const i=+b.dataset.d;if(i<a.length-1){[a[i+1],a[i]]=[a[i],a[i+1]];draw();}});
    $('#oc',el).onclick=()=>{ const ok=a.every((k,i)=>k===i); draw(true); const f=$('.ofb',el);
      if(ok){ f.innerHTML=`<div class="fb ok">✅ ${praise()} Urutannya benar.</div>`; say(c.steps.map(s=>s[1]).join('. ')); }
      else f.innerHTML=`<div class="fb no">Ada ${a.filter((k,i)=>k!==i).length} langkah yang belum tepat (bergaris merah). Pindahkan dengan ▲ ▼, lalu periksa lagi.</div>`; }; };
  draw(); };

W.sort=(el,c)=>{ const items=shuf(c.items.map((x,i)=>({...{e:x[0],t:x[1],b:x[2]},i}))); let sel=null, miss=0, done=0;
  el.innerHTML=`<p class="muted">Ketuk satu kartu, lalu ketuk kotak tujuannya.</p><div class="pool">${items.map(x=>`<button class="tok" data-i="${x.i}">${x.e} ${esc(x.t)}</button>`).join('')}</div><div class="bins">${c.bins.map((b,k)=>`<div class="bin" data-b="${k}" role="button" tabindex="0"><h4>${b[0]} ${esc(b[1])}</h4><div class="in"></div></div>`).join('')}</div><div class="sfb"></div>`;
  const pool=$('.pool',el);
  $$('.pool .tok',el).forEach(t=>t.onclick=()=>{ $$('.pool .tok',el).forEach(x=>x.classList.remove('sel')); t.classList.add('sel'); sel=t; say(c.items[+t.dataset.i][1]); });
  $$('.bin',el).forEach(b=>b.onclick=()=>{ if(!sel) { $('.sfb',el).innerHTML='<div class="fb no">Pilih dulu satu kartu di atas.</div>'; return; }
    const it=c.items[+sel.dataset.i], k=+b.dataset.b;
    if(it[2]===k){ sel.classList.remove('sel'); sel.classList.add('good'); $('.in',b).appendChild(sel); sel.onclick=null; sel=null; done++; $('.sfb',el).innerHTML='';
      if(done===c.items.length){ const s=Math.max(0,Math.round((c.items.length-miss)/c.items.length*100)); fin(el,`Semua kartu sudah di tempatnya! Salah tempat: ${miss} kali.`,()=>W.sort(el,c)); say('Alhamdulillah, selesai!'); } }
    else { miss++; sel.classList.add('no'); const s2=sel; setTimeout(()=>s2.classList.remove('no'),450); $('.sfb',el).innerHTML=`<div class="fb no">Belum tepat. “${esc(it[1])}” bukan termasuk ${esc(c.bins[k][1])}. Coba kotak lain!</div>`; } }); };

W.match=(el,c)=>{ const L=shuf(c.pairs.map((p,i)=>i)), R=shuf(c.pairs.map((p,i)=>i)); let sel=null, done=0, miss=0;
  el.innerHTML=`<div class="pairs"><div>${L.map(i=>`<button class="tok" data-l="${i}">${c.pairs[i][0]} ${esc(c.pairs[i][1])}</button>`).join('')}</div><div>${R.map(i=>`<button class="tok" data-r="${i}">${esc(c.pairs[i][2])}</button>`).join('')}</div></div><div class="mfb"></div>`;
  $$('[data-l]',el).forEach(b=>b.onclick=()=>{ if(b.classList.contains('good'))return; $$('[data-l]',el).forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); sel=+b.dataset.l; say(c.pairs[sel][1]); });
  $$('[data-r]',el).forEach(b=>b.onclick=()=>{ if(sel==null||b.classList.contains('good'))return; const r=+b.dataset.r, lb=$(`[data-l="${sel}"]`,el);
    if(r===sel){ b.classList.add('good'); lb.classList.add('good'); lb.classList.remove('sel'); done++; $('.mfb',el).innerHTML=`<div class="fb ok">✅ ${esc(c.pairs[r][1])} — ${esc(c.pairs[r][2])}</div>`; say(c.pairs[r][1]+', '+c.pairs[r][2]); sel=null;
      if(done===c.pairs.length) fin(el,`${praise()} Semua pasangan cocok. Salah pilih: ${miss} kali.`,()=>W.match(el,c)); }
    else { miss++; b.classList.add('no'); setTimeout(()=>b.classList.remove('no'),450); } }); };

W.flash=(el,c)=>{ const Q=shuf(c.items); let i=0, sc=0;
  const show=()=>{ if(!alive(el))return; if(i>=Q.length){ const s=Math.round(sc/Q.length*100); el.innerHTML=`<div class="stage" style="text-align:center"><div class="huge">${s>=80?'🏆':s>=60?'🌟':'🌱'}</div><div class="big">${sc} dari ${Q.length} benar</div><button class="btn" id="fa">🔁 Main lagi</button></div>`; $('#fa',el).onclick=()=>W.flash(el,c); return; }
    const q=Q[i]; el.innerHTML=`<div class="row" style="justify-content:space-between"><span class="muted">Soal ${i+1}/${Q.length}</span><span class="score">⭐ ${sc}</span></div><div class="prog"><i style="width:${i/Q.length*100}%"></i></div><div class="stage" style="text-align:center"><div class="huge">${q[0]}</div><div class="big">${esc(q[1])}</div></div><div class="opts">${c.opts.map((o,k)=>`<button class="opt" data-k="${k}">${esc(o)}</button>`).join('')}</div><div class="ffb"></div>`;
    say(q[1]);
    $$('.opt',el).forEach(b=>b.onclick=()=>{ const ok=+b.dataset.k===q[2]; if(ok)sc++; $$('.opt',el).forEach(x=>{x.disabled=true;if(+x.dataset.k===q[2])x.classList.add('good');}); if(!ok)b.classList.add('no');
      $('.ffb',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅ '+praise():'❌ Jawabannya: '+esc(c.opts[q[2]])} <span class="muted">${esc(q[3]||'')}</span></div><button class="btn" id="fn">Lanjut →</button>`; $('#fn',el).onclick=()=>{i++;show();}; }); };
  show(); };


/* ---------- simulasi khusus Qonuni 4 ---------- */
const printPanel=el=>{ $$('.panel').forEach(p=>p.classList.remove('printme')); el.closest('.panel').classList.add('printme'); window.print(); };
W.cases=(el,c)=>{ const Q=shuf(c.items); let i=0, sc=0;
  const show=()=>{ if(!alive(el))return; if(i>=Q.length){ el.innerHTML=`<div class="stage" style="text-align:center"><div class="huge">${sc===Q.length?'🏆':sc>=Q.length/2?'🌟':'🌱'}</div><div class="big">${sc} dari ${Q.length} kasus tepat</div><p>Setiap masalah punya solusi bila kita peduli dan mau bergerak bersama.</p><button class="btn" id="ca">🔁 Ulangi</button></div>`; $('#ca',el).onclick=()=>W.cases(el,c); return; }
    const q=Q[i], ord=shuf(q[2].map((_,k)=>k));
    el.innerHTML=`<div class="row" style="justify-content:space-between"><span class="muted">Kasus ${i+1}/${Q.length}</span><span class="score">⭐ ${sc}</span></div><div class="prog"><i style="width:${i/Q.length*100}%"></i></div>
     <div class="stage casec"><div class="huge">${q[0]}</div><p class="big" style="font-size:1.08rem">${esc(q[1])} ${sp(q[1])}</p></div><b>Apa solusi yang paling tepat?</b><div class="opts">${ord.map(k=>`<button class="opt" data-k="${k}">${esc(q[2][k])}</button>`).join('')}</div><div class="cfb"></div>`;
    $$('.opt',el).forEach(b=>b.onclick=()=>{ const ok=+b.dataset.k===0; if(ok)sc++; $$('.opt',el).forEach(x=>{x.disabled=true; if(+x.dataset.k===0)x.classList.add('good');}); if(!ok)b.classList.add('no');
      $('.cfb',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?'✅ '+praise():'❌ Solusi yang tepat sudah ditandai hijau.'} <span class="muted">${esc(q[3]||'')}</span></div><button class="btn" id="cn">${i+1<Q.length?'Kasus berikutnya →':'Lihat hasil'}</button>`; $('#cn',el).onclick=()=>{i++;show();}; }); };
  show(); };

/* peta skematis (tidak berskala) */
const pts=a=>a.map(p=>p.join(',')).join(' ');
const NUSA={sumatra:[[18.9,27.5],[36.9,30.8],[57.4,60.5],[86.1,99],[106.6,121],[105,152.9],[94.3,151.8],[73.8,132],[57.4,104.5],[45.1,71.5],[24.6,46.2]],
 jawa:[[100,154],[123,159.3],[147.6,162.6],[176.3,172.7],[175.5,182.6],[147.6,178.2],[123,172.7],[102.3,163.9]],
 kalimantan:[[130.4,71.5],[139.4,69.3],[151.7,59.4],[164,52.8],[176.3,37.4],[188.6,16.5],[200.9,12.1],[213.2,29.7],[205,41.8],[203.4,66],[212.4,77],[200.9,82.5],[196.8,99],[192.7,123.2],[188.6,132],[176.3,129.8],[164,123.2],[151.7,121],[141,119.9],[139.4,104.5],[131.2,93.5]],
 malaysiaKal:[[136.9,67.1],[155.8,72.6],[176.3,72.6],[185.3,44],[201.7,41.8],[213.2,29.7],[200.9,12.1],[188.6,16.5],[176.3,37.4],[164,52.8],[151.7,59.4],[139.4,69.3]],
 sulawesi:[[217.3,148.5],[215.7,126.5],[211.6,116.6],[217.3,93.5],[221.4,79.2],[229.6,74.8],[246,78.1],[262.4,71.5],[260.8,83.6],[241.9,83.6],[229.6,84.7],[226.3,96.8],[233.7,99],[248.5,97.9],[244.4,105.6],[232.1,108.9],[240.3,123.2],[247.6,138.6],[241.9,147.4],[233.7,136.4],[227.1,119.9],[224.7,150.6]],
 papua:[[311.6,101.2],[323.9,92.4],[337.8,97.9],[340.3,115.5],[348.5,124.3],[364.9,105.6],[393.6,116.6],[418.2,129.8],[434.6,148.5],[446.9,159.5],[442.8,176],[426.4,173.8],[410,187],[393.6,188.1],[377.2,177.1],[369,180.4],[367.4,167.2],[352.6,138.6],[336.2,132],[326.4,132],[319.8,118.8],[332.1,113.3],[319.8,110]],
 png:[[393.6,116.6],[418.2,129.8],[434.6,148.5],[446.9,159.5],[442.8,176],[426.4,173.8],[410,187],[393.6,188.1]],
 semenanjung:[[54.1,15.4],[69.7,17.6],[83.6,28.6],[86.9,49.5],[91.8,71.5],[86.1,73.7],[68.1,57.2],[59.9,38.5],[59,24.2]],
 mindanao:[[237.8,11],[254.2,22],[266.5,26.4],[274.7,16.5],[273.1,0],[241.9,0]],
 australia:[[290,250],[300,232],[318,222],[340,220],[352,228],[366,232],[378,222],[398,218],[410,236],[430,250]]};
const ISL=[[182,180,5,3],[191,181,4,3],[207,181,11,3],[234,186,14,3],[228,195,7,3],[287,77,5,9],[299,122,12,3],[275,125,6,3],[107,112,5,3],[122,120,4,3],[255,194,10,4]];
const spotsSVG=(S,found,WD=450)=>S.map((s,i)=>{ const f=found.has(i), lx=Math.max(48,Math.min(WD-48,s[0]));
  return `<g data-sp="${i}" class="spot ${f?'ok':''}" role="button" tabindex="0" aria-label="titik ${'ABCDEFGHIJ'[i]}"><circle cx="${s[0]}" cy="${s[1]}" r="13"/><text x="${s[0]}" y="${s[1]+5}" text-anchor="middle" class="sl">${f?'✓':'ABCDEFGHIJ'[i]}</text>${f?`<text x="${lx}" y="${s[1]>30?s[1]-15:s[1]+26}" text-anchor="middle" class="lbl">${esc(s[2])}</text>`:''}</g>`; }).join('');
const MAP={
 dunia:(S,found,extra='')=>`<svg viewBox="0 0 400 260" class="map" role="img" aria-label="Peta posisi silang Indonesia (skematis)"><rect width="400" height="260" class="sea"/>
  <path class="land2" d="M0,0 H400 V40 L360,55 L330,48 L300,70 L262,60 L240,78 L215,72 L190,90 L160,80 L130,95 L100,75 L60,85 L30,70 L0,80Z"/>
  <path class="land2" d="M250,195 L280,180 L300,186 L320,176 L345,185 L370,200 L380,225 L365,250 L330,252 L300,240 L270,245 L248,225Z"/>
  <g class="land"><ellipse cx="132" cy="122" rx="24" ry="6" transform="rotate(38 132 122)"/><ellipse cx="168" cy="149" rx="19" ry="4"/><ellipse cx="186" cy="120" rx="15" ry="13"/><ellipse cx="225" cy="126" rx="7" ry="14"/><ellipse cx="278" cy="134" rx="23" ry="9"/><ellipse cx="200" cy="157" rx="12" ry="2.5"/><ellipse cx="228" cy="160" rx="10" ry="2.5"/></g>
  <line x1="0" y1="124" x2="400" y2="124" class="eq"/><text x="6" y="119" class="eqt">khatulistiwa</text>
  <text x="392" y="252" text-anchor="end" class="eqt">U ↑</text>${extra}${spotsSVG(S,found)}</svg>`,
 nusa:(S,found,batas)=>`<svg viewBox="0 0 450 250" class="map" role="img" aria-label="Peta Indonesia (skematis)"><rect width="450" height="250" class="sea"/>
  <polygon class="land2" points="${pts(NUSA.semenanjung)}"/><polygon class="land2" points="${pts(NUSA.mindanao)}"/><polygon class="land2" points="${pts(NUSA.australia)}"/>
  ${['sumatra','jawa','kalimantan','sulawesi','papua'].map(k=>`<polygon class="land" points="${pts(NUSA[k])}"/>`).join('')}
  <polygon class="land2" points="${pts(NUSA.malaysiaKal)}"/><polygon class="land2" points="${pts(NUSA.png)}"/>
  <g class="land">${ISL.map(e=>`<ellipse cx="${e[0]}" cy="${e[1]}" rx="${e[2]}" ry="${e[3]}" transform="rotate(-12 ${e[0]} ${e[1]})"/>`).join('')}</g><ellipse class="land2" cx="272" cy="187" rx="11" ry="3.5" transform="rotate(-20 272 187)"/>
  ${batas?`<g class="bline"><polyline points="136.9,67.1 155.8,72.6 176.3,72.6 185.3,44 201.7,41.8"/><line x1="393.6" y1="116.6" x2="393.6" y2="188.1"/><line x1="264" y1="191" x2="266" y2="184"/></g>`:''}
  <circle cx="88.6" cy="73.7" r="2.5" class="land2"/>
  <line x1="0" y1="88" x2="450" y2="88" class="eq"/><text x="440" y="83" text-anchor="end" class="eqt">khatulistiwa</text>
  <g class="eqt"><text x="20" y="242">🟩 Indonesia · ⬜ negara lain · peta skematis</text></g>${spotsSVG(S,found)}</svg>`};
MAP.batas=(S,f)=>MAP.nusa(S,f,1);
W.peta=(el,c)=>{ const S=c.spots, order=shuf(S.map((s,i)=>i)); let qi=0, miss=0; const found=new Set();
  const draw=msg=>{ el.innerHTML=`<div class="simbox mapbox">${MAP[c.map](S,found)}</div><div class="stage">${qi<order.length?`<p class="big" style="font-size:1.1rem;margin:0 0 6px">📍 Ketuk letak: <b>${esc(S[order[qi]][2])}</b> ${sp('Ketuk letak '+S[order[qi]][2])}</p>`:'<p class="big" style="font-size:1.1rem;margin:0 0 6px">🎉 Semua sudah ditemukan!</p>'}<div class="prog"><i style="width:${found.size/S.length*100}%"></i></div><div id="pf">${msg||''}</div></div>`;
    $$('[data-sp]',el).forEach(g=>g.onclick=()=>{ if(qi>=order.length)return; const i=+g.dataset.sp, want=order[qi];
      if(found.has(i)) return;
      if(i===want){ found.add(i); qi++; say(S[i][2]); draw(`<div class="fb ok">✅ ${esc(S[i][2])}. ${esc(S[i][3])}</div>`); if(qi===order.length) fin(el,`Semua tempat ditemukan! Salah ketuk: ${miss} kali.`,()=>W.peta(el,c)); }
      else { miss++; draw(`<div class="fb no">Belum tepat. Itu bukan ${esc(S[want][2])}. Coba huruf lain!</div>`); } }); };
  draw(); };

W.muson=(el)=>{ const BL=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']; let m=0, qd=0;
  const wet=i=>i>=9||i<=2;
  const draw=()=>{ const h=wet(m);
    const extra=h?`<path d="M235,58 C255,95 268,120 300,182" class="wind wet" marker-end="url(#mw)"/><path d="M170,62 C190,100 230,140 285,190" class="wind wet" marker-end="url(#mw)"/>
      <g class="cloud"><ellipse cx="180" cy="104" rx="20" ry="9"/><ellipse cx="225" cy="108" rx="18" ry="8"/><ellipse cx="140" cy="108" rx="16" ry="7"/></g>${Array.from({length:14},(_,i)=>`<line x1="${130+i*8}" y1="${114+(i%3)*3}" x2="${127+i*8}" y2="${122+(i%3)*3}" class="rain"/>`).join('')}
      <defs><marker id="mw" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6z" fill="#2f63b0"/></marker></defs><text x="245" y="40" class="wl wet">angin basah dari Asia</text>`
     :`<path d="M300,190 C270,150 255,120 235,62" class="wind dry" marker-end="url(#md)"/><path d="M285,196 C230,150 200,110 175,66" class="wind dry" marker-end="url(#md)"/><circle cx="215" cy="100" r="13" class="sun"/>
      <defs><marker id="md" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6z" fill="#d9731a"/></marker></defs><text x="300" y="172" class="wl dry" text-anchor="middle">angin kering dari Australia</text>`;
    el.innerHTML=`<div class="simbox mapbox">${MAP.dunia([],new Set(),extra)}<div class="big">${BL[m]} → <span style="color:var(--acc)">${h?'🌧️ muson barat · musim hujan':'☀️ muson timur · musim kemarau'}</span></div>
     <input type="range" class="slider" id="mm" min="0" max="11" value="${m}" aria-label="Bulan"><div class="row muted" style="justify-content:space-between;font-size:.8rem"><span>Jan</span><span>Apr</span><span>Jul</span><span>Okt</span><span>Des</span></div></div>
     <div class="bins"><div class="bin" style="cursor:default"><h4>🌾 Petani</h4>${h?'Menanam padi di sawah yang tergenang air hujan.':'Menanam palawija: jagung dan kacang.'}</div>
      <div class="bin" style="cursor:default"><h4>🧂 Petani garam</h4>${h?'Sulit membuat garam karena hujan.':'Panen garam! Panas matahari menguapkan air laut.'}</div>
      <div class="bin" style="cursor:default"><h4>🎒 Perlengkapanku</h4>${h?'☂️ payung dan jas hujan':'🧢 topi dan botol minum'}</div>
      <div class="bin" style="cursor:default"><h4>💨 Mengapa?</h4>${h?'Angin dari Asia melewati Samudra Pasifik dan Laut Cina Selatan sehingga membawa banyak uap air.':'Angin dari Benua Australia yang kering hanya membawa sedikit uap air.'}</div></div>
     <p class="muted">“Sekitar” — waktu musim bisa bergeser. BMKG mengumumkan perkiraan awal musim setiap tahun.</p><div id="mq"></div>`;
    $('#mm',el).oninput=e=>{ m=+e.target.value; draw(); };
    if(!qd){ const months=shuf([0,2,4,7,10]).slice(0,3); $('#mq',el).innerHTML=`<div class="stage"><b>Uji dirimu:</b>${months.map(k=>`<div class="qi"><div class="qq">Bulan ${BL[k]} biasanya bertiup angin ...</div><div class="bsb"><button data-mk="${k}" data-v="1">🌧️ Muson barat</button><button data-mk="${k}" data-v="0">☀️ Muson timur</button></div></div>`).join('')}</div>`;
      let ok=0, n=0; $$('[data-mk]',el).forEach(b=>b.onclick=()=>{ const k=+b.dataset.mk; if(b.parentNode.dataset.d)return; b.parentNode.dataset.d=1; const r=(b.dataset.v==='1')===wet(k); b.classList.add(r?'good':'no'); n++; if(r)ok++; if(n===3){ qd=1; fin($('#mq',el),`${ok}/3 benar. Muson barat (hujan) sekitar Oktober–Maret, muson timur (kemarau) sekitar April–September.`); } }); } };
  draw(); };

W.poster=(el,c)=>{ const SEC=[['alam','🌾','Kekayaan alam (pilih minimal 2)',2,['Talas Bogor','Manggis','Sayur-mayur Puncak','Kebun teh','Ikan hias air tawar','Curug Gunung Salak','Kebun Raya Bogor']],['budaya','🎋','Budaya (pilih minimal 2)',2,['Angklung','Batik Bogor','Rumah panggung','Asinan Bogor','Doclang','Hatur nuhun (bahasa Sunda)']],['potensi','🚀','Potensi & cara memajukannya (pilih 1)',1,['Keripik talas → membeli dan mengenalkan produk lokal','Kebun Raya Bogor → menjaga kebersihan tempat wisata','Sepatu Ciomas → bangga memakai produk daerah','Kebun teh Puncak → menanam pohon dan menjaga lereng']]];
  const st=Object.assign({nama:'Bogor',letak:'',slogan:'',alam:[],budaya:[],potensi:[]},store.get('poster')||{}); const save=()=>store.set('poster',st);
  const prev=()=>`<div class="posterv"><div class="pt1">${esc(st.nama||'Nama daerah')}</div><div class="pt2">📍 ${esc(st.letak||'Letak daerah …')}</div>
    <div class="pg"><div><b>🌾 Kekayaan alam</b><ul>${st.alam.map(x=>`<li>${esc(x)}</li>`).join('')||'<li class="muted">…</li>'}</ul></div><div><b>🎋 Budaya</b><ul>${st.budaya.map(x=>`<li>${esc(x)}</li>`).join('')||'<li class="muted">…</li>'}</ul></div></div>
    <div><b>🚀 Potensi & cara memajukan</b><ul>${st.potensi.map(x=>`<li>${esc(x)}</li>`).join('')||'<li class="muted">…</li>'}</ul></div><div class="pslog">📣 ${esc(st.slogan||'Slogan ajakan …')}</div></div>`;
  el.innerHTML=`<div class="noprint"><div class="stage"><label><b>🏷️ Nama daerah / judul</b><input class="inp" id="pn" value="${esc(st.nama)}"></label>
    <label><b>📍 Letak daerah</b><input class="inp" id="pl" value="${esc(st.letak)}" placeholder="Contoh: di Provinsi Jawa Barat, di kaki Gunung Salak"></label></div>
    ${SEC.map(s=>`<div class="stage"><b>${s[1]} ${esc(s[2])}</b><div class="pool" style="margin-top:6px">${s[4].map(o=>`<button class="tok ${st[s[0]].includes(o)?'sel':''}" data-ps="${s[0]}" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div></div>`).join('')}
    <div class="stage"><label><b>📣 Slogan</b><input class="inp" id="pg" value="${esc(st.slogan)}" placeholder="Contoh: Bogor Hijau, Air Terjaga, Warga Sejahtera!"></label></div>
    <div class="row"><button class="btn gold" id="pc">✅ Periksa poster</button><button class="btn ghost" id="pp">🖨️ Cetak sketsa poster</button></div><div id="pcf"></div></div><h3 style="margin-top:14px">🖼️ Pratinjau poster</h3><div id="pv">${prev()}</div>`;
  const up=()=>{ save(); $('#pv',el).innerHTML=prev(); };
  $('#pn',el).oninput=e=>{st.nama=e.target.value;up();}; $('#pl',el).oninput=e=>{st.letak=e.target.value;up();}; $('#pg',el).oninput=e=>{st.slogan=e.target.value;up();};
  $$('[data-ps]',el).forEach(b=>b.onclick=()=>{ const k=b.dataset.ps, o=b.dataset.o, a=st[k], lim=k==='potensi'?1:99;
    if(a.includes(o)) a.splice(a.indexOf(o),1); else { if(a.length>=lim){ const old=a.shift(); const ob=$$(`[data-ps="${k}"]`,el).find(x=>x.dataset.o===old); if(ob)ob.classList.remove('sel'); } a.push(o); }
    b.classList.toggle('sel',a.includes(o)); up(); });
  $('#pc',el).onclick=()=>{ const R=[['Judul & nama daerah',st.nama.trim().length>1],['Letak daerah',st.letak.trim().length>4],['Minimal 2 kekayaan alam',st.alam.length>=2],['Minimal 2 budaya',st.budaya.length>=2],['1 potensi dan cara memajukannya',st.potensi.length===1],['Slogan',st.slogan.trim().length>4]], ok=R.every(r=>r[1]);
    $('#pcf',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${R.map(r=>(r[1]?'✅ ':'⬜ ')+r[0]).join('<br>')}${ok?'<br><b>MasyaAllah, isi poster lengkap! Sekarang pindahkan ke kertas karton dengan gambar benda, alam, atau simbol.</b>':'<br>Lengkapi bagian yang belum dicentang.'}</div>`; if(ok) say('Alhamdulillah, isi poster lengkap'); };
  $('#pp',el).onclick=()=>printPanel(el); };

W.rantai=(el)=>{ const O={padi:'🌾',rumput:'🌿',daun:'🍃',tikus:'🏷️',belalang:'🏷️',ulat:'🏷️',burung:'🏷️',katak:'🏷️',ular:'🏷️',elang:'🏷️'}, PROD=['padi','rumput','daun'];
  const E={padi:['tikus','belalang','burung'],rumput:['belalang','ulat'],daun:['ulat'],tikus:['ular','elang'],belalang:['katak','burung'],ulat:['katak','burung'],burung:['elang','ular'],katak:['ular'],ular:['elang'],elang:[]};
  const ROLE=['Produsen','Konsumen I','Konsumen II','Konsumen III']; let ch=[], msg='', done=false; const found=[];
  const draw=()=>{ el.innerHTML=`<p class="muted">🏷️ = kartu kata (hewan ditulis, tidak digambar). Panah → berarti “dimakan oleh”.</p><div class="pool">${Object.keys(O).map(k=>`<button class="tok" data-o="${k}">${O[k]} ${k}</button>`).join('')}</div>
    <div class="stage"><b>Rantai makananku:</b><div class="chainb">${ch.length?ch.map((k,i)=>`${i?'<span class="ar">→</span>':''}<span class="cbox"><span>${O[k]} ${k}</span><small>${ROLE[i]}</small></span>`).join(''):'<span class="muted">Mulai dengan mengetuk produsen (tumbuhan hijau).</span>'}</div>
     <div class="row" style="margin-top:8px"><button class="btn" id="rs" ${ch.length>=3?'':'disabled'}>✔️ Rantai selesai</button><button class="btn ghost" id="ru" ${ch.length?'':'disabled'}>↩️ Hapus terakhir</button></div><div>${msg}</div></div>
    <div class="stage"><b>Rantai yang sudah kutemukan (${found.length}/3):</b>${found.length?`<ol>${found.map(f=>`<li>${f.join(' → ')}</li>`).join('')}</ol>`:'<p class="muted">Belum ada.</p>'}${found.length>=2?`<p class="muted">Perhatikan: ${(()=>{ const cnt={}; found.forEach(f=>f.forEach(k=>cnt[k]=(cnt[k]||0)+1)); const sh=Object.keys(cnt).filter(k=>cnt[k]>1); return sh.length?'<b>'+sh.join(', ')+'</b> ada di lebih dari satu rantai. Rantai-rantai yang saling berhubungan seperti ini membentuk <b>jaring-jaring makanan</b>.':'coba temukan rantai yang memakai kartu yang sama.'; })()}</p>`:''}</div>`;
    $$('[data-o]',el).forEach(b=>b.onclick=()=>{ const k=b.dataset.o; say(k);
      if(!ch.length){ if(!PROD.includes(k)){ msg=`<div class="fb no">Rantai makanan selalu dimulai dari <b>produsen</b>, yaitu tumbuhan hijau. ${k} bukan produsen.</div>`; return draw(); } ch.push(k); msg=''; return draw(); }
      if(ch.length>=4){ msg='<div class="fb no">Rantai di sini cukup sampai 4 kartu. Tekan “Rantai selesai”.</div>'; return draw(); }
      if(ch.includes(k)){ msg='<div class="fb no">Kartu itu sudah ada di rantai.</div>'; return draw(); }
      const last=ch[ch.length-1]; if(!E[last].includes(k)){ msg=`<div class="fb no">Apakah ${last} dimakan oleh ${k}? Belum tepat. ${E[last].length?'Coba kartu lain.':last+' adalah pemangsa puncak di sini.'}</div>`; return draw(); }
      ch.push(k); msg=`<div class="fb ok">✅ ${last} dimakan oleh ${k}.</div>`; draw(); });
    const rs=$('#rs',el); if(rs) rs.onclick=()=>{ const key=ch.join('>'); if(found.some(f=>f.join('>')===key)){ msg='<div class="fb no">Rantai ini sudah kamu temukan. Coba susunan lain!</div>'; return draw(); }
      found.push(ch.slice()); say(ch.join(', dimakan oleh, ')); ch=[]; msg='<div class="fb ok">✅ Rantai tersimpan! Ingat: semua makhluk yang mati akan diuraikan oleh pengurai (jamur, bakteri, cacing tanah).</div>'; draw();
      if(found.length===3&&!done){ done=true; fin(el,'Tiga rantai makanan berhasil disusun! Rantai-rantai itu saling terhubung menjadi jaring-jaring makanan.',()=>W.rantai(el)); } };
    const ru=$('#ru',el); if(ru) ru.onclick=()=>{ ch.pop(); msg=''; draw(); }; };
  draw(); };

W.seimbang=(el)=>{ let pem=true, tikus=20, padi=100, bulan=0, crash=false, won=false; const hist=[20];
  const draw=(msg='')=>{ const st=padi>=85?['🌾','Panen melimpah','ok']:padi>=40?['🍂','Panen berkurang','warn']:['⚠️','Gagal panen!','bad'];
    const H=hist.slice(-12), bw=300/12;
    el.innerHTML=`<div class="simbox"><div class="chainb" style="justify-content:center"><span class="cbox"><span>🌾 padi</span><small>${Math.round(padi)}%</small></span><span class="ar">→</span><span class="cbox"><span>🏷️ tikus</span><small>${tikus} ekor</small></span><span class="ar">→</span><span class="cbox ${pem?'':'gone'}"><span>🏷️ ular</span><small>${pem?'ada':'🚫 diburu'}</small></span><span class="ar">→</span><span class="cbox ${pem?'':'gone'}"><span>🏷️ elang</span><small>${pem?'ada':'🚫 diburu'}</small></span></div>
     <svg viewBox="0 0 320 130" class="chart" role="img" aria-label="Grafik jumlah tikus"><line x1="10" y1="110" x2="315" y2="110" class="ax"/>${H.map((v,i)=>`<rect x="${12+i*bw}" y="${110-Math.min(100,v/4)}" width="${bw-4}" height="${Math.min(100,v/4)}" class="bar ${v>60?'hi':''}"/><text x="${12+i*bw+(bw-4)/2}" y="124" text-anchor="middle" class="tk">${bulan-H.length+1+i}</text>`).join('')}<text x="12" y="12" class="tk">jumlah tikus per bulan</text></svg>
     <div class="big">${st[0]} Bulan ke-${bulan}: ${st[1]}</div><div class="prog"><i style="width:${padi}%"></i></div><p class="muted">Bilah hijau = hasil padi</p></div>
    <div class="stage"><div class="row"><button class="btn ${pem?'':'ghost'}" id="sp1">🛡️ Lindungi ular & elang</button><button class="btn ${pem?'ghost':''}" id="sp0">🚫 Ular & elang diburu habis</button></div>
     <div class="row" style="margin-top:8px"><button class="btn gold" id="sr">▶️ Jalankan 1 bulan</button><button class="btn soft" id="sx">🔄 Mulai dari awal</button></div>${msg}</div>
    <div class="stage"><b>🎯 Tantangan:</b><ol><li ${crash?'style="text-decoration:line-through"':''}>Buru ular dan elang, lalu jalankan bulan demi bulan sampai sawah gagal panen.</li><li ${won?'style="text-decoration:line-through"':''}>Lindungi kembali ular dan elang, jalankan terus sampai panen pulih (padi 90% atau lebih).</li></ol>${won?'<div class="fb ok">🎉 Tantangan berhasil! Keseimbangan kembali karena pemangsa dijaga. “Janganlah kamu merusak keseimbangan itu.” (QS. Ar-Rahman: 8) <button class="btn soft" id="sx2">🔁 Ulangi</button></div>':''}</div>`;
    const x2=$('#sx2',el); if(x2) x2.onclick=()=>W.seimbang(el);
    $('#sp1',el).onclick=()=>{pem=true;draw('<div class="fb ok">Ular dan elang dilindungi. Mereka akan memangsa tikus lagi.</div>');}; $('#sp0',el).onclick=()=>{pem=false;draw('<div class="fb no">Ular dan elang diburu habis. Rantai makanan terputus!</div>');};
    $('#sx',el).onclick=()=>W.seimbang(el);
    $('#sr',el).onclick=()=>{ bulan++; tikus=pem?Math.round(tikus+(20-tikus)*0.55):Math.min(400,Math.round(tikus*1.6+2)); padi=Math.max(0,Math.min(100,100-(tikus-20)*0.35)); hist.push(tikus);
      let m=''; if(!crash&&padi<40){ crash=true; m='<div class="fb no">Tikus meledak dan padi habis dimakan. Inilah akibat merusak keseimbangan ekosistem!</div>'; }
      if(crash&&!won&&pem&&padi>=90){ won=true; draw('<div class="fb ok">Alhamdulillah, panen pulih!</div>'); say('Alhamdulillah, panen pulih'); return; }
      draw(m); }; };
  draw(); };

W.siklus=(el)=>{ const ST=[['☀️','Panaskan laut','Penguapan (evaporasi): panas matahari mengubah air laut, sungai, dan danau menjadi uap air. Daun tumbuhan juga melepaskan uap air (transpirasi).'],['☁️','Dinginkan uap di langit','Pengembunan (kondensasi): di tempat tinggi udaranya dingin, uap air menjadi titik-titik air kecil dan membentuk awan.'],['🌧️','Turunkan hujan','Hujan (presipitasi): titik-titik air bergabung menjadi besar dan berat, lalu jatuh ke bumi.'],['🏞️','Alirkan & resapkan','Aliran dan peresapan: air hujan mengalir lewat sungai ke laut, sebagian meresap ke tanah menjadi air tanah.']];
  let s=0, loops=0, msg=''; const ord=shuf([0,1,2,3]);
  const scene=()=>`<svg viewBox="0 0 320 200" class="cyc" role="img" aria-label="Simulasi siklus air"><rect width="320" height="200" class="sky"/>
    <circle cx="40" cy="36" r="${s>=1?20:15}" class="sun ${s>=1?'on':''}"/>
    <path d="M190,150 L250,70 L320,150Z" class="mt"/><rect x="150" y="150" width="170" height="50" class="gr"/><rect x="0" y="150" width="150" height="50" class="sw"/>
    <g transform="translate(176 150)"><rect x="-2.5" y="-24" width="5" height="24" fill="#7a5230"/><circle cy="-30" r="11" fill="#2f7a3a"/></g>
    ${s>=1?`<g class="vap">${[30,70,110].map(x=>`<path d="M${x},145 q6,-10 0,-20 q-6,-10 0,-20 q6,-10 0,-20"/>`).join('')}<path d="M176,112 q5,-8 0,-16 q-5,-8 0,-16"/></g><text x="72" y="98" class="nlab">1</text>`:''}
    <g class="cl ${s>=2?'on':''}" opacity="${s>=2?1:.25}"><ellipse cx="200" cy="40" rx="34" ry="15"/><ellipse cx="228" cy="32" rx="22" ry="13"/><ellipse cx="172" cy="34" rx="20" ry="11"/></g>${s>=2?'<text x="150" y="30" class="nlab">2</text>':''}
    ${s>=3?Array.from({length:12},(_,i)=>`<line x1="${178+i*6}" y1="${58+(i%3)*5}" x2="${174+i*6}" y2="${74+(i%3)*5}" class="rain"/>`).join('')+'<text x="262" y="72" class="nlab">3</text>':''}
    ${s>=4?`<path d="M250,100 C230,130 200,140 150,160" class="riv"/><path d="M200,170 h-40" class="arw" marker-end="url(#sa)"/><path d="M230,180 C210,195 120,195 80,185" class="gw" marker-end="url(#sa)"/><text x="196" y="196" class="nlab">4</text>`:''}
    <defs><marker id="sa" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6z" fill="#1d6fb8"/></marker></defs>
    <text x="8" y="192" class="tk">laut</text><text x="262" y="145" class="tk">gunung</text></svg>`;
  const draw=()=>{ el.innerHTML=`<div class="simbox">${scene()}<div class="big">${s===0?'💧 Siap memulai siklus':s<4?ST[s-1][0]+' '+esc(ST[s-1][2].split(':')[0]):'🔁 Satu putaran selesai!'}</div><p>${s>0?esc(ST[s-1][2]):'Tekan tombol yang benar untuk langkah pertama.'}</p></div>
    <div class="stage"><b>Langkah berikutnya?</b><div class="opts" style="margin-top:6px">${ord.map(k=>`<button class="opt ${k<s?'good':''}" data-k="${k}" ${k<s||s===4?'disabled':''}>${ST[k][0]} ${ST[k][1]}</button>`).join('')}</div>${msg}
     ${s===4?`<p><b>Putaran ke-${loops}.</b> Air tidak pernah habis karena terus berputar dalam siklus.</p>${loops<2?'<button class="btn" id="sg">🔁 Putar lagi</button>':''}`:''}</div>`;
    $$('[data-k]',el).forEach(b=>b.onclick=()=>{ const k=+b.dataset.k; if(k===s){ s++; msg=''; say(ST[k][2].split(':')[0]); if(s===4){ loops++; } draw(); if(s===4&&loops===2) fin(el,'Dua putaran siklus air selesai: penguapan → pengembunan → hujan → aliran & peresapan.',()=>W.siklus(el)); }
      else { msg=`<div class="fb no">Belum tepat. ${s===0?'Siklus dimulai dari panas matahari.':'Setelah '+ST[s-1][1].toLowerCase()+', apa yang terjadi?'}</div>`; draw(); } });
    const g=$('#sg',el); if(g) g.onclick=()=>{ s=0; msg=''; draw(); }; };
  draw(); };

W.airku=(el)=>{ const A=[['🕌','Berwudu',5,'kali/orang',[['Keran dibuka deras',4],['Secukupnya, seperti satu mud',0.75]]],['🚿','Mandi',2,'kali/orang',[['Shower lama',60],['Pakai gayung secukupnya',20]]],['🪥','Gosok gigi',2,'kali/orang',[['Keran dibiarkan terbuka',6],['Pakai gelas',0.5]]],['🍽️','Mencuci piring',1,'kali/rumah',[['Air terus mengalir',40],['Pakai baskom',15]]],['🪴','Menyiram tanaman',1,'kali/rumah',[['Pakai air bersih baru',10],['Pakai air bekas cucian sayur',0]]],['🚰','Keran bocor',1,'sepanjang hari',[['Dibiarkan menetes',10],['Segera diperbaiki',0]]]];
  const ch=A.map(()=>0); let org=4, done=false; const fmt=v=>Math.round(v).toLocaleString('id-ID');
  const tot=sel=>A.reduce((t,a,i)=>t+a[4][sel?sel[i]:ch[i]][1]*a[2]*(a[3].includes('orang')?org:1),0);
  const draw=()=>{ const now=tot(), bor=tot(A.map(()=>0)), save=bor-now;
    el.innerHTML=`<div class="stage"><label><b>🏠 Jumlah anggota keluarga:</b> ${org} orang<input type="range" class="slider" id="ao" min="1" max="8" value="${org}"></label></div>
    <div class="tw"><table class="t air"><tr><th>Kegiatan</th><th>Kebiasaan</th><th>Liter/hari</th></tr>${A.map((a,i)=>`<tr><td>${a[0]} ${esc(a[1])}<br><small class="muted">${a[2]}× ${a[3]}</small></td><td><div class="bsb">${a[4].map((o,k)=>`<button data-a="${i}" data-k="${k}" class="${ch[i]===k?(k?'good':'no'):''}">${k?'💚':'💸'} ${esc(o[0])}</button>`).join('')}</div></td><td><b>${fmt(a[4][ch[i]][1]*a[2]*(a[3].includes('orang')?org:1))}</b></td></tr>`).join('')}</table></div>
    <div class="simbox"><div class="row" style="justify-content:space-around"><div><div class="muted">Pemakaian keluarga</div><div class="big">💧 ${fmt(now)} L/hari</div><div class="muted">${fmt(now*30)} L/bulan</div></div><div><div class="muted">Air yang diselamatkan</div><div class="big" style="color:var(--ok)">💚 ${fmt(save*30)} L/bulan</div><div class="muted">≈ cukup untuk ${fmt(save*30/0.75)} kali wudu (1 mud ≈ 0,75 L)</div></div></div>
     <div class="prog"><i style="width:${bor?now/bor*100:0}%"></i></div><p class="muted">Bilah = pemakaian dibanding semua kebiasaan boros.</p></div><div id="af"></div>`;
    $('#ao',el).oninput=e=>{org=+e.target.value;draw();};
    $$('[data-a]',el).forEach(b=>b.onclick=()=>{ ch[+b.dataset.a]=+b.dataset.k; draw(); if(!done&&ch.every(x=>x===1)){ done=true; fin(el,`Keluargamu menjadi keluarga hemat air! Menghemat ${fmt((tot(A.map(()=>0))-tot())*30)} liter sebulan. “Janganlah berlebih-lebihan.” (QS. Al-A’raf: 31)`); say('MasyaAllah, keluarga hemat air'); } }); };
  draw(); };

W.beregu=(el)=>{ const P=window.PTM.find(p=>p.n===16).quiz;
  const Q=P.pg.map(q=>({q:q.q,o:q.o,ord:shuf(q.o.map((_,i)=>i)),pt:q.ph?2:1})).concat(P.bs.map(b=>({q:'Benar atau salah? '+b[0],o:b[1]?['Benar','Salah']:['Salah','Benar'],ord:b[1]?[0,1]:[1,0],pt:b[3]?2:1})));
  const T=[['🌼','Melati'],['🌹','Mawar'],['🌸','Anggrek'],['🌻','Kenanga']]; const sc=[0,0,0,0]; let qi=0, t=0, answered=false;
  const board=()=>`<div class="teams">${T.map((x,i)=>`<div class="team ${i===t&&qi<Q.length?'on':''}"><div>${x[0]} Regu ${x[1]}</div><b>${sc[i]}</b></div>`).join('')}</div>`;
  const draw=()=>{ if(qi>=Q.length){ const mx=Math.max(...sc), w=T.filter((x,i)=>sc[i]===mx).map(x=>x[0]+' Regu '+x[1]).join(' & ');
      el.innerHTML=board()+`<div class="stage" style="text-align:center"><div class="huge">🏆</div><div class="big">${w}</div><p>Barakallahu fiikum untuk semua regu! Semua yang belajar dengan ikhlas adalah pemenang.</p><button class="btn" id="bz">🔁 Mulai kuis beregu baru</button></div>`; $('#bz',el).onclick=()=>W.beregu(el); say('Selamat, '+w); return; }
    const q=Q[qi]; answered=false;
    el.innerHTML=board()+`<div class="row" style="justify-content:space-between"><span class="muted">Soal ${qi+1}/${Q.length}</span>${q.pt>1?'<span class="chip gold">⭐ Penghubung · 2 poin</span>':'<span class="chip soft">1 poin</span>'}</div><div class="prog"><i style="width:${qi/Q.length*100}%"></i></div>
     <div class="stage"><p class="muted" style="margin:0">Giliran: <b>${T[t][0]} Regu ${T[t][1]}</b></p><p class="big" style="font-size:1.12rem">${esc(q.q)} ${sp(q.q)}</p></div><div class="opts">${q.ord.map((k,j)=>`<button class="opt" data-k="${k}">${q.ord.length>2?'abcd'[j]+'. ':''}${esc(q.o[k])}</button>`).join('')}</div><div id="bf"></div>`;
    $$('.opt',el).forEach(b=>b.onclick=()=>{ if(answered)return; answered=true; const ok=+b.dataset.k===0; if(ok) sc[t]+=q.pt; $$('.opt',el).forEach(x=>{x.disabled=true; if(+x.dataset.k===0)x.classList.add('good');}); if(!ok)b.classList.add('no');
      $('#bf',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?`✅ Benar! +${q.pt} poin untuk Regu ${T[t][1]}.`:'❌ Belum tepat. Jawaban: '+esc(q.o[0])}</div><button class="btn" id="bn">${qi+1<Q.length?'Soal berikutnya →':'Lihat juara'}</button>`;
      $$('.teams b',el)[t].textContent=sc[t]; say(ok?'Benar':'Belum tepat'); $('#bn',el).onclick=()=>{ qi++; t=(t+1)%4; draw(); }; }); };
  draw(); };

W.refleksi=(el,c)=>{ const RK=c.key||'refl', r=store.get(RK)||{};
  el.innerHTML=`<div class="stage"><label><b>Nama:</b><input class="inp" data-r="nama" value="${esc(r.nama||'')}"></label></div>${c.q.map((q,i)=>`<div class="qi"><div class="qq"><span class="n">${i+1}.</span>${esc(q)} ${sp(q)}</div><textarea data-r="${i}" placeholder="Tulis dengan jujur…">${esc(r[i]||'')}</textarea></div>`).join('')}
   <div class="row noprint"><button class="btn gold" id="rf">✅ Selesai</button><button class="btn ghost" id="rp">🖨️ Cetak lembar refleksi</button></div><div id="rff"></div>`;
  $$('[data-r]',el).forEach(t=>t.oninput=()=>{ r[t.dataset.r]=t.value; store.set(RK,r); });
  $('#rf',el).onclick=()=>{ const n=c.q.filter((q,i)=>(r[i]||'').trim().length>3).length; $('#rff',el).innerHTML=n===c.q.length?'<div class="fb ok">🎉 MasyaAllah, refleksimu lengkap. Semoga semester depan semakin semangat belajar!</div>':`<div class="fb no">Sudah ${n} dari ${c.q.length} pertanyaan dijawab. Lengkapi yang lain, ya.</div>`; };
  $('#rp',el).onclick=()=>printPanel(el); };

/* ---------- simulasi khusus Qonuni 4 (bagan organ skematis, tanpa sosok tubuh) ---------- */
MAP.cerna=(S,found,extra='')=>`<svg viewBox="0 0 300 345" class="map organ" role="img" aria-label="Bagan skematis saluran pencernaan"><rect width="300" height="345" class="obg"/>
  <rect x="110" y="14" width="80" height="32" rx="16" class="o-mulut"/><line x1="122" y1="30" x2="178" y2="30" class="o-gigi"/>
  <path d="M150,46 L150,132" class="o-kerong"/>
  <path d="M46,122 Q60,100 120,108 Q152,112 160,132 Q140,172 90,174 Q52,172 46,150Z" class="o-hati"/>
  <path d="M150,130 Q172,116 206,122 Q242,132 238,162 Q232,194 200,194 Q178,194 170,178 Q186,172 196,172 Q214,168 214,155 Q212,140 188,140 Q166,140 156,140Z" class="o-lambung"/>
  <ellipse cx="176" cy="204" rx="32" ry="6" transform="rotate(-8 176 204)" class="o-pankreas"/>
  <path d="M198,192 Q214,214 192,232" class="o-halus"/>
  <path d="M112,236 Q132,226 152,236 T192,236 Q208,246 192,256 T152,256 T112,256 Q96,266 112,276 T152,276 T192,276 Q206,286 190,294 L166,300" class="o-halus"/>
  <path d="M90,298 L90,224 Q90,216 98,216 L222,216 Q232,216 232,224 L232,292 Q232,302 220,304 L160,308 L152,318" class="o-besar"/>
  <circle cx="150" cy="324" r="5" class="o-anus"/>
  <text x="8" y="338" class="eqt">bagan skematis · tidak berskala</text>${extra}${spotsSVG(S,found,300)}</svg>`;
const napasSVG=(k=1,dome=262,extra='')=>`<rect width="300" height="300" class="obg"/>
  <path d="M120,12 Q150,-2 180,12 L188,40 Q150,50 112,40Z" class="o-hidung"/>
  <path d="M150,42 L150,92" class="o-faring"/><rect x="141" y="62" width="18" height="14" rx="4" class="o-laring"/>
  <rect x="143" y="92" width="14" height="50" rx="5" class="o-trakea"/>${[100,110,120,130].map(y=>`<line x1="143" y1="${y}" x2="157" y2="${y}" class="o-ring"/>`).join('')}
  <g transform="translate(92 200) scale(${k}) translate(-92 -200)"><ellipse cx="92" cy="200" rx="50" ry="64" class="o-paru"/></g>
  <g transform="translate(208 200) scale(${k}) translate(-208 -200)"><ellipse cx="208" cy="200" rx="50" ry="64" class="o-paru"/></g>
  <path d="M150,140 L112,166 M150,140 L188,166" class="o-bronkus"/>
  <path d="M112,166 L92,190 M112,166 L110,200 M92,190 L76,210 M92,190 L96,226 M188,166 L208,190 M188,166 L190,200 M208,190 L224,210 M208,190 L204,226" class="o-bronkiolus"/>
  <path d="M28,${dome+20} Q150,${dome} 272,${dome+20}" class="o-diafragma"/>
  <text x="6" y="14" class="eqt">bagan skematis</text><text x="6" y="26" class="eqt">tidak berskala</text>${extra}`;
MAP.napas=(S,found,extra='')=>`<svg viewBox="0 0 300 300" class="map organ" role="img" aria-label="Bagan skematis organ pernapasan">${napasSVG(1,258,extra)}${spotsSVG(S,found,300)}</svg>`;

W.jalan=(el,c)=>{ const S=c.steps; let i=0, miss=0; const found=new Set();
  const draw=msg=>{ const cur=S[Math.min(i,S.length-1)];
    const extra=i<S.length?`<circle cx="${cur[0]}" cy="${cur[1]}" r="19" class="pulse"/><text x="${cur[0]+22}" y="${cur[1]+6}" font-size="18">🍞</text>`:'';
    el.innerHTML=`<div class="simbox mapbox">${MAP[c.map](S.map(s=>[s[0],s[1],s[2],s[5]]),found,extra)}</div>
     <div class="stage">${i<S.length?`<p class="muted" style="margin:0">Langkah ${i+1} dari ${S.length}</p><p class="big" style="font-size:1.1rem;margin:.2em 0">📍 Roti sekarang di: <b>${esc(S[i][2])}</b></p><p><b>${esc(S[i][3])}</b> ${sp(S[i][3])}</p><div class="opts">${shuf(S[i][4].map((_,k)=>k)).map(k=>`<button class="opt" data-k="${k}">${esc(S[i][4][k])}</button>`).join('')}</div>`:'<p class="big" style="font-size:1.1rem">🎉 Perjalanan roti selesai!</p>'}<div class="prog"><i style="width:${found.size/S.length*100}%"></i></div><div id="jf">${msg||''}</div></div>`;
    $$('[data-k]',el).forEach(b=>b.onclick=()=>{ if(+b.dataset.k===0){ found.add(i); const s=S[i]; i++; say(s[5]); draw(`<div class="fb ok">✅ ${esc(s[5])}</div>`); if(i===S.length) fin(el,`Roti sudah menempuh seluruh saluran pencernaan! Salah pilih: ${miss} kali.`,()=>W.jalan(el,c)); }
      else { miss++; b.classList.add('no'); b.disabled=true; $('#jf',el).innerHTML='<div class="fb no">Belum tepat. Ingat tugas organ ini, lalu coba lagi.</div>'; } }); };
  draw(); };

W.menu=(el)=>{ const G={pokok:['🍚','Makanan pokok'],lauk:['🥚','Lauk pauk'],sayur:['🥬','Sayur'],buah:['🍌','Buah'],minum:['💧','Air putih / susu'],batas:['⚠️','Batasi']};
  const F=[['nasi','🍚','Nasi','pokok'],['jagung','🌽','Nasi jagung','pokok'],['ubi','🍠','Ubi rebus','pokok'],['roti','🍞','Roti gandum','pokok'],['kentang','🥔','Kentang','pokok'],
   ['telur','🥚','Telur rebus','lauk'],['ikan','🍢','Ikan bakar','lauk'],['tempe','🟫','Tempe','lauk'],['tahu','⬜','Tahu','lauk'],['daging','🥩','Daging sapi','lauk'],['kacang','🫘','Kacang merah','lauk'],
   ['bayam','🥬','Sayur bayam','sayur'],['wortel','🥕','Wortel','sayur'],['asem','🍲','Sayur asem','sayur'],['brokoli','🥦','Brokoli','sayur'],
   ['pisang','🍌','Pisang','buah'],['pepaya','🍈','Pepaya','buah'],['jeruk','🍊','Jeruk','buah'],['apel','🍎','Apel','buah'],['semangka','🍉','Semangka','buah'],
   ['air','💧','Air putih','minum'],['susu','🥛','Susu','minum'],
   ['mi','🍜','Mi instan','batas'],['goreng','🥟','Gorengan','batas'],['manis','🥤','Minuman manis','batas'],['permen','🍬','Permen','batas'],['keripik','🍟','Keripik kemasan','batas']];
  const M=[['🌅','Sarapan'],['☀️','Makan siang'],['🌙','Makan malam']]; const st=Object.assign({0:[],1:[],2:[]},store.get('menu')||{}); let m=0, done=false;
  const grp=k=>F.find(f=>f[0]===k)[3], has=(mi,g)=>st[mi].some(k=>grp(k)===g), nb=mi=>st[mi].filter(k=>grp(k)==='batas').length;
  const okMeal=mi=>['pokok','lauk','sayur','buah','minum'].every(g=>has(mi,g))&&nb(mi)===0;
  const plate=mi=>{ const seg=[['sayur',0,108,'#5bb36a'],['buah',108,180,'#f2b632'],['pokok',180,288,'#e9d9b5'],['lauk',288,360,'#d9731a']];
    const arc=(a0,a1)=>{ const r=58,cx=70,cy=70,p=a=>[cx+r*Math.cos((a-90)*Math.PI/180),cy+r*Math.sin((a-90)*Math.PI/180)]; const [x0,y0]=p(a0),[x1,y1]=p(a1); return `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${a1-a0>180?1:0} 1 ${x1},${y1}Z`; };
    return `<svg viewBox="0 0 140 140" width="140" class="plate" role="img" aria-label="Isi Piringku"><circle cx="70" cy="70" r="66" class="pl-rim"/>${seg.map(s=>`<path d="${arc(s[1],s[2])}" fill="${has(mi,s[0])?s[3]:'#ddd'}" stroke="#fff" stroke-width="2"/>`).join('')}</svg>`; };
  const draw=()=>{ const sel=st[m];
    el.innerHTML=`<div class="row">${M.map((x,i)=>`<button class="btn ${i===m?'':'ghost'}" data-m="${i}">${x[0]} ${x[1]} ${okMeal(i)?'✅':''}</button>`).join('')}</div>
     <div class="stage"><div class="row" style="align-items:center;gap:14px">${plate(m)}<div><b>${M[m][0]} ${M[m][1]}:</b> ${sel.length?sel.map(k=>{ const f=F.find(x=>x[0]===k); return f[1]+' '+esc(f[2]); }).join(', '):'<span class="muted">belum ada</span>'}
      <ul class="chk">${['pokok','lauk','sayur','buah','minum'].map(g=>`<li>${has(m,g)?'✅':'⬜'} ${G[g][1]}</li>`).join('')}${nb(m)?`<li>⚠️ ${nb(m)} makanan yang sebaiknya dibatasi</li>`:''}</ul></div></div>
      <p class="muted" style="margin:0">Piring: hijau = sayur, kuning = buah, krem = makanan pokok, oranye = lauk.</p></div>
     ${Object.keys(G).map(g=>`<div class="stage"><b>${G[g][0]} ${G[g][1]}</b><div class="pool" style="margin-top:6px">${F.filter(f=>f[3]===g).map(f=>`<button class="tok ${sel.includes(f[0])?'sel':''}" data-f="${f[0]}">${f[1]} ${esc(f[2])}</button>`).join('')}</div></div>`).join('')}
     <div class="row noprint"><button class="btn gold" id="mc">✅ Periksa menu sehari</button><button class="btn ghost" id="mp">🖨️ Cetak menu</button><button class="btn soft" id="mr">🗑️ Kosongkan</button></div><div id="mf"></div>`;
    $$('[data-m]',el).forEach(b=>b.onclick=()=>{ m=+b.dataset.m; draw(); });
    $$('[data-f]',el).forEach(b=>b.onclick=()=>{ const k=b.dataset.f, a=st[m]; if(a.includes(k)) a.splice(a.indexOf(k),1); else { if(a.length>=7){ $('#mf',el).innerHTML='<div class="fb no">Cukup 7 pilihan untuk sekali makan. Ingat, jangan berlebihan!</div>'; return; } a.push(k); } store.set('menu',st); say(F.find(f=>f[0]===k)[2]); draw(); });
    $('#mr',el).onclick=()=>{ st[0]=[];st[1]=[];st[2]=[]; store.set('menu',st); draw(); };
    $('#mp',el).onclick=()=>printPanel(el);
    $('#mc',el).onclick=()=>{ const n=[0,1,2].filter(okMeal).length;
      $('#mf',el).innerHTML=`<div class="fb ${n===3?'ok':'no'}">${[0,1,2].map(i=>`${okMeal(i)?'✅':'⬜'} ${M[i][1]}${okMeal(i)?' lengkap dan sehat':': '+(['pokok','lauk','sayur','buah','minum'].filter(g=>!has(i,g)).map(g=>'tambah '+G[g][1].toLowerCase()).concat(nb(i)?['kurangi makanan yang dibatasi']:[]).join(', ')||'')}`).join('<br>')}</div>`;
      if(n===3&&!done){ done=true; fin(el,'MasyaAllah, menu sehari kelompokmu bergizi seimbang! Presentasikan alasan pilihan menunya.'); say('MasyaAllah, menu sehat lengkap'); } }; };
  draw(); };

W.napas=(el)=>{ let ph='rest', auto=null, cnt=0, t=0, tm=null, dur=60, kond='Duduk tenang'; const res=[];
  const stop=()=>{ if(auto){clearInterval(auto);auto=null;} if(tm){clearInterval(tm);tm=null;} };
  const scene=()=>{ const k=ph==='in'?1.07:ph==='out'?0.9:1, dome=ph==='in'?272:ph==='out'?244:258;
    const arr=ph==='in'?`<path d="M150,-2 L150,30" class="arw-in" marker-end="url(#ai)"/><text x="190" y="24" class="g-o2">O₂ masuk</text>`:ph==='out'?`<path d="M150,30 L150,0" class="arw-out" marker-end="url(#ao)"/><text x="190" y="24" class="g-co2">CO₂ keluar</text>`:'';
    return `<svg viewBox="0 0 300 300" class="map organ" role="img" aria-label="Simulasi napas">${napasSVG(k,dome,arr+'<defs><marker id="ai" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6z" fill="#2a8a52"/></marker><marker id="ao" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6z" fill="#555"/></marker></defs>')}</svg>`; };
  const info={rest:['🫁 Siap','Tekan tombol untuk menarik atau menghembuskan napas.'],in:['⬇️ Inspirasi (menghirup)','Diafragma mendatar (turun), tulang rusuk terangkat, rongga dada membesar, paru-paru mengembang, udara kaya oksigen masuk.'],out:['⬆️ Ekspirasi (menghembuskan)','Diafragma melengkung ke atas, tulang rusuk turun, rongga dada mengecil, paru-paru mengempis, udara berisi karbon dioksida keluar.']};
  const draw=()=>{ el.innerHTML=`<div class="simbox mapbox">${scene()}<div class="big">${info[ph][0]}</div><p>${info[ph][1]}</p></div>
    <div class="row"><button class="btn" id="ni">⬇️ Tarik napas</button><button class="btn" id="no">⬆️ Hembuskan</button><button class="btn ${auto?'':'ghost'}" id="na">${auto?'⏸️ Hentikan':'▶️ Bernapas otomatis'}</button></div>
    <div class="stage"><h3 style="margin:.2em 0">⏱️ Hitung Frekuensi Napasku</h3><p class="muted" style="margin:0">Duduk tenang. Setiap kali kamu menghirup lalu menghembuskan napas, tekan tombol <b>+1 napas</b>.</p>
     <div class="row" style="margin:8px 0"><label>Keadaan: <select id="nk" class="inp" style="display:inline-block;width:auto;margin:0">${['Duduk tenang','Setelah melompat 20 kali','Setelah berjalan cepat'].map(x=>`<option ${x===kond?'selected':''}>${x}</option>`).join('')}</select></label>
      <label>Lama: <select id="nd" class="inp" style="display:inline-block;width:auto;margin:0"><option value="60" ${dur===60?'selected':''}>60 detik</option><option value="30" ${dur===30?'selected':''}>30 detik (×2)</option></select></label></div>
     <div class="row" style="align-items:center"><button class="btn gold" id="ns" ${tm?'disabled':''}>▶️ Mulai</button><button class="btn" id="np" ${tm?'':'disabled'} style="font-size:1.2rem;padding:12px 22px">+1 napas</button><span class="big">⏱️ ${tm?dur-t:dur} dtk · ${cnt} napas</span></div>
     ${res.length?`<div class="tw"><table class="t"><tr><th>Keadaan</th><th>Napas per menit</th><th>Keterangan</th></tr>${res.map(r=>`<tr><td>${esc(r[0])}</td><td><b>${r[1]}</b></td><td>${r[1]<18?'Lebih lambat dari biasanya; coba hitung ulang dengan teliti.':r[1]<=30?'Wajar untuk anak saat tenang (sekitar 18–30).':'Lebih cepat, wajar setelah bergerak.'}</td></tr>`).join('')}</table></div>`:''}
     <p class="muted">Napas anak usia sekolah saat tenang biasanya sekitar 18–30 kali per menit dan bertambah setelah bergerak.</p></div><div id="nf"></div>`;
    $('#ni',el).onclick=()=>{ ph='in'; draw(); say('Tarik napas'); }; $('#no',el).onclick=()=>{ ph='out'; draw(); say('Hembuskan'); };
    $('#na',el).onclick=()=>{ if(auto){ clearInterval(auto); auto=null; draw(); return; } auto=setInterval(()=>{ if(!alive(el)){stop();return;} ph=ph==='in'?'out':'in'; if(!tm) draw(); },1800); draw(); };
    $('#nk',el).onchange=e=>{ kond=e.target.value; }; $('#nd',el).onchange=e=>{ dur=+e.target.value; draw(); };
    $('#np',el).onclick=()=>{ if(!tm)return; cnt++; const s=$('.stage .big',el); if(s) s.textContent=`⏱️ ${dur-t} dtk · ${cnt} napas`; };
    $('#ns',el).onclick=()=>{ cnt=0; t=0; if(auto){clearInterval(auto);auto=null;} tm=setInterval(()=>{ if(!alive(el)){stop();return;} t++; const s=$('.stage .big',el); if(s) s.textContent=`⏱️ ${dur-t} dtk · ${cnt} napas`;
      if(t>=dur){ clearInterval(tm); tm=null; const f=cnt*(60/dur); res.push([kond,f]); draw(); if(res.length>=2&&!el.dataset.f){ el.dataset.f=1; fin(el,'Bagus! Bandingkan hasilmu: napas lebih cepat setelah bergerak karena otot membutuhkan lebih banyak oksigen.'); } } },1000); draw(); }; };
  draw(); };

W.balon=(el)=>{ let r=0, anim=null; const D=Object.assign({rows:[['',null,null],['',null,null],['',null,null],['',null,null]]},store.get('balon')||{});
  const avg=x=>x[1]!=null&&x[2]!=null?Math.round((x[1]+x[2])/2*10)/10:x[1]!=null?x[1]:x[2];
  const chart=()=>{ const v=D.rows.map(avg), mx=Math.max(10,...v.filter(x=>x!=null)); return `<svg viewBox="0 0 300 150" class="chart" role="img" aria-label="Grafik lingkar balon"><line x1="10" y1="120" x2="295" y2="120" class="ax"/>${D.rows.map((x,i)=>{ const a=v[i]; return a==null?'':`<rect x="${22+i*70}" y="${120-a/mx*100}" width="46" height="${a/mx*100}" class="bar hi2"/><text x="${45+i*70}" y="${114-a/mx*100}" text-anchor="middle" class="tk">${a} cm</text>`; }).join('')}${D.rows.map((x,i)=>`<text x="${45+i*70}" y="136" text-anchor="middle" class="tk">${esc((x[0]||'Anggota '+(i+1)).slice(0,10))}</text>`).join('')}</svg>`; };
  const blow=to=>{ if(anim)clearInterval(anim); r=8; anim=setInterval(()=>{ if(!alive(el)){clearInterval(anim);return;} r+=2; const b=$('#bl',el); if(b){ b.setAttribute('rx',r*0.85); b.setAttribute('ry',r); } if(r>=to){ clearInterval(anim); anim=null; } },40); };
  el.innerHTML=`<div class="simbox"><svg viewBox="0 0 220 170" width="220" role="img" aria-label="Balon"><ellipse id="bl" cx="110" cy="80" rx="7" ry="8" class="balon"/><path d="M110,150 L110,165" stroke="#888" stroke-width="2"/><polygon points="104,150 116,150 110,142" class="balon"/></svg>
    <div class="row" style="justify-content:center"><button class="btn ghost" id="b1">🌬️ Tiup dengan napas biasa</button><button class="btn" id="b2">💨 Tarik napas dalam, lalu tiup</button></div><p id="bt" class="muted">Coba kedua tombol dan bandingkan ukuran balonnya.</p></div>
   <div class="stage"><h3 style="margin:.2em 0">📝 Hasil percobaan kelompokku</h3><p class="muted" style="margin:0">Ukur lingkar balon (cm) dengan tali atau meteran jahit.</p>
    <div class="tw"><table class="t"><tr><th>Nama</th><th>Percobaan 1 (cm)</th><th>Percobaan 2 (cm)</th><th>Rata-rata</th></tr>${D.rows.map((x,i)=>`<tr><td><input class="inp sm" data-r="${i}" data-c="0" value="${esc(x[0])}" placeholder="Anggota ${i+1}"></td><td><input class="inp sm" type="number" min="0" max="200" data-r="${i}" data-c="1" value="${x[1]??''}"></td><td><input class="inp sm" type="number" min="0" max="200" data-r="${i}" data-c="2" value="${x[2]??''}"></td><td><b class="av">${avg(x)??'–'}</b></td></tr>`).join('')}</table></div>
    <div id="bc">${chart()}</div><div class="row noprint"><button class="btn gold" id="bk">✅ Buat kesimpulan</button><button class="btn ghost" id="bp">🖨️ Cetak</button></div><div id="bf"></div></div>`;
  $('#b1',el).onclick=()=>{ blow(34); $('#bt',el).textContent='Napas biasa: udara yang dihembuskan sedikit, balon kecil.'; };
  $('#b2',el).onclick=()=>{ blow(64); $('#bt',el).textContent='Napas dalam: paru-paru menampung lebih banyak udara, balon jauh lebih besar!'; say('Balon lebih besar'); };
  $$('[data-r]',el).forEach(inp=>inp.oninput=()=>{ const i=+inp.dataset.r, c=+inp.dataset.c; D.rows[i][c]=c?(inp.value===''?null:Math.max(0,+inp.value)):inp.value; store.set('balon',D); $$('.av',el)[i].textContent=avg(D.rows[i])??'–'; $('#bc',el).innerHTML=chart(); });
  $('#bp',el).onclick=()=>printPanel(el);
  $('#bk',el).onclick=()=>{ const v=D.rows.map((x,i)=>[x[0]||'Anggota '+(i+1),avg(x)]).filter(x=>x[1]!=null); if(v.length<2){ $('#bf',el).innerHTML='<div class="fb no">Isi hasil minimal dua anggota terlebih dahulu.</div>'; return; }
    v.sort((a,b)=>b[1]-a[1]); $('#bf',el).innerHTML=`<div class="fb ok">📊 Balon terbesar: <b>${esc(v[0][0])}</b> (${v[0][1]} cm), terkecil: <b>${esc(v[v.length-1][0])}</b> (${v[v.length-1][1]} cm).<br>Kesimpulan: kapasitas napas setiap orang berbeda. Perbedaan dapat dipengaruhi ukuran tubuh, kebiasaan olahraga, dan kesehatan paru-paru.</div>`; if(!el.dataset.f){ el.dataset.f=1; say('Alhamdulillah, kesimpulan dibuat'); } }; };

W.rencana=(el)=>{ const NIL=['🎁 Rela berkorban','🔥 Pantang menyerah','🇮🇩 Cinta tanah air','🔗 Persatuan','⚖️ Jujur','⏰ Disiplin'];
  const TOK=['Pangeran Diponegoro','Tuanku Imam Bonjol','Cut Nyak Dien','Sultan Hasanuddin','Kapitan Pattimura','Ki Hajar Dewantara','K.H. Ahmad Dahlan','K.H. Hasyim Asy’ari','Bung Tomo','Jenderal Sudirman','Ir. Soekarno','Drs. Mohammad Hatta','TGKH Muhammad Zainuddin Abdul Madjid'];
  const st=Object.assign({nama:'',nilai:'',tokoh:'',aksi:'',waktu:'',tempat:'',hari:[0,0,0,0,0,0,0]},store.get('rencana')||{}); const save=()=>store.set('rencana',st);
  const card=()=>`<div class="posterv"><div class="pt1">🎯 Rencana Aksiku</div><div class="pt2">${esc(st.nama||'Nama santri')}</div>
    <p><b>Nilai yang dilatih:</b> ${esc(st.nilai||'…')}<br><b>Teladan:</b> ${esc(st.tokoh||'…')}<br><b>Aksi nyata:</b> ${esc(st.aksi||'…')}<br><b>Kapan:</b> ${esc(st.waktu||'…')} · <b>Di mana:</b> ${esc(st.tempat||'…')}</p>
    <div class="days">${st.hari.map((h,i)=>`<label class="day ${h?'on':''}"><input type="checkbox" data-h="${i}" ${h?'checked':''}> Hari ${i+1}</label>`).join('')}</div><p class="muted" style="margin:.4em 0 0">Terlaksana ${st.hari.filter(x=>x).length} dari 7 hari.</p></div>`;
  el.innerHTML=`<div class="noprint"><div class="stage"><label><b>Nama</b><input class="inp" data-k="nama" value="${esc(st.nama)}"></label>
    <b>🌟 Nilai kepahlawanan</b><div class="pool" style="margin:6px 0 10px">${NIL.map(n=>`<button class="tok ${st.nilai===n?'sel':''}" data-n="${esc(n)}">${n}</button>`).join('')}</div>
    <label><b>🎖️ Tokoh teladan</b><select class="inp" data-k="tokoh"><option value="">— pilih —</option>${TOK.map(t=>`<option ${st.tokoh===t?'selected':''}>${esc(t)}</option>`).join('')}</select></label>
    <label><b>🎯 Aksi nyata</b><input class="inp" data-k="aksi" value="${esc(st.aksi)}" placeholder="Contoh: murajaah hafalan 10 menit setiap selesai Maghrib"></label>
    <label><b>📅 Kapan</b><input class="inp" data-k="waktu" value="${esc(st.waktu)}" placeholder="Contoh: setiap hari selama 7 hari"></label>
    <label><b>📍 Di mana</b><input class="inp" data-k="tempat" value="${esc(st.tempat)}" placeholder="Contoh: di rumah dan di kuttab"></label></div>
    <div class="row"><button class="btn gold" id="rc">✅ Periksa rencana</button><button class="btn ghost" id="rp">🖨️ Cetak untuk presentasi</button></div><div id="rf"></div></div><h3 style="margin-top:14px">🪧 Kartu rencana aksi</h3><div id="rv">${card()}</div>`;
  const up=()=>{ save(); $('#rv',el).innerHTML=card(); bindH(); };
  const bindH=()=>$$('[data-h]',el).forEach(c=>c.onchange=()=>{ st.hari[+c.dataset.h]=c.checked?1:0; up(); if(st.hari.every(x=>x)&&!el.dataset.f){ el.dataset.f=1; fin(el,'Tujuh hari aksi terlaksana! Kamu sudah menjadi pahlawan kecil. Barakallahu fiik.'); } });
  $$('[data-k]',el).forEach(i=>i.oninput=i.onchange=()=>{ st[i.dataset.k]=i.value; up(); });
  $$('[data-n]',el).forEach(b=>b.onclick=()=>{ st.nilai=b.dataset.n; $$('[data-n]',el).forEach(x=>x.classList.toggle('sel',x===b)); up(); });
  $('#rp',el).onclick=()=>printPanel(el); bindH();
  $('#rc',el).onclick=()=>{ const R=[['Nilai kepahlawanan',!!st.nilai],['Tokoh teladan',!!st.tokoh],['Aksi nyata yang jelas',st.aksi.trim().length>8],['Waktu pelaksanaan',st.waktu.trim().length>2],['Tempat',st.tempat.trim().length>2]], ok=R.every(r=>r[1]);
    $('#rf',el).innerHTML=`<div class="fb ${ok?'ok':'no'}">${R.map(r=>(r[1]?'✅ ':'⬜ ')+r[0]).join('<br>')}${ok?'<br><b>Rencana siap dipresentasikan! Centang setiap hari yang berhasil kamu laksanakan.</b>':''}</div>`; }; };

W.rubrik=(el)=>{ const A=['Kisah perjuangan lengkap','Ketepatan fakta sejarah','Nilai teladan & aksi nyata','Cara menyampaikan','Kerja sama / kemandirian'];
  const D=store.get('rubrik')||{g:[['Kelompok 1',[0,0,0,0,0]],['Kelompok 2',[0,0,0,0,0]],['Kelompok 3',[0,0,0,0,0]]]}; const save=()=>store.set('rubrik',D);
  const tot=s=>s.reduce((a,b)=>a+b,0), nil=s=>s.every(x=>x)?Math.round(tot(s)/20*100):null;
  const draw=()=>{ el.innerHTML=`<p class="muted">Skor: 4 = sangat baik · 3 = baik · 2 = cukup · 1 = perlu bimbingan.</p>${D.g.map((g,i)=>`<div class="stage rub"><div class="row" style="justify-content:space-between;align-items:center"><input class="inp" data-gn="${i}" value="${esc(g[0])}" style="max-width:220px;margin:0"><span class="big">${nil(g[1])!=null?'Nilai '+nil(g[1]):'Skor '+tot(g[1])+'/20'}</span></div>
      ${A.map((a,k)=>`<div class="rrow"><span>${esc(a)}</span><div class="bsb">${[1,2,3,4].map(v=>`<button data-g="${i}" data-a="${k}" data-v="${v}" class="${g[1][k]===v?'sel':''}">${v}</button>`).join('')}</div></div>`).join('')}</div>`).join('')}
     <div class="row noprint"><button class="btn ghost" id="ga">➕ Tambah kelompok/santri</button>${D.g.length>1?'<button class="btn soft" id="gd">➖ Hapus terakhir</button>':''}<button class="btn ghost" id="gp">🖨️ Cetak rekap</button></div>`;
    $$('[data-gn]',el).forEach(i=>i.oninput=()=>{ D.g[+i.dataset.gn][0]=i.value; save(); });
    $$('[data-g]',el).forEach(b=>b.onclick=()=>{ D.g[+b.dataset.g][1][+b.dataset.a]=+b.dataset.v; save(); draw(); });
    $('#ga',el).onclick=()=>{ if(D.g.length<12){ D.g.push(['Kelompok '+(D.g.length+1),[0,0,0,0,0]]); save(); draw(); } };
    const gd=$('#gd',el); if(gd) gd.onclick=()=>{ D.g.pop(); save(); draw(); };
    $('#gp',el).onclick=()=>printPanel(el); };
  draw(); };

/* ---------- kuis (A–D) ---------- */
function quiz(el,P){ const Z=P.quiz, key='p'+P.n; const pg=Z.pg.map(q=>({...q,ord:shuf(q.o.map((_,i)=>i))})); const R=shuf(Z.jd.map((p,i)=>i)); const ans={pg:{},bs:{},jd:{}}; const ur=store.get('ur'+P.n)||{};
  const best=store.get(key);
  el.innerHTML=`<p class="muted">${P.ev?'Kerjakan sendiri dengan jujur dan teliti. Awali dengan bismillah.':'Baca setiap soal dengan teliti. Awali dengan bismillah.'} ${best!=null?`<b>Nilai terbaikmu: ${best}</b>`:''}</p>
   <div class="qsec">A. Pilihlah jawaban yang paling benar!</div>${pg.map((q,i)=>`<div class="qi" id="qa${i}"><div class="qq"><span class="n">${i+1}.</span>${esc(q.q)} ${sp(q.q)}</div><div class="opts">${q.ord.map((k,j)=>`<button class="opt" data-a="${i}" data-k="${k}">${'abcd'[j]}. ${esc(q.o[k])}</button>`).join('')}</div><div class="ex"></div></div>`).join('')}
   <div class="qsec">B. Benar atau Salah?</div>${Z.bs.map((b,i)=>`<div class="qi" id="qb${i}"><div class="qq"><span class="n">${pg.length+i+1}.</span>${esc(b[0])} ${sp(b[0])}</div><div class="bsb"><button data-b="${i}" data-v="1">✔️ Benar</button><button data-b="${i}" data-v="0">✖️ Salah</button></div><div class="ex"></div></div>`).join('')}
   <div class="qsec">C. Jodohkan!</div><div class="qi">${Z.jd.map((p,i)=>`<div class="jd" id="qc${i}"><b>${pg.length+Z.bs.length+i+1}. ${esc(p[0])}</b><select data-c="${i}"><option value="">— pilih —</option>${R.map(r=>`<option value="${r}">${esc(Z.jd[r][1])}</option>`).join('')}</select></div>`).join('')}</div>
   <div class="qsec">D. Jawablah dengan kalimatmu sendiri</div>${Z.ur.map((u,i)=>`<div class="qi"><div class="qq">${esc(u[0])}</div><textarea data-u="${i}" placeholder="Tulis jawabanmu…">${esc(ur[i]||'')}</textarea><button class="btn soft" data-show="${i}" style="margin-top:6px">💡 Lihat contoh jawaban</button><div class="ex" id="ue${i}" hidden>${esc(u[1])}</div></div>`).join('')}
   <div class="result"><button class="btn gold" id="qs" style="width:100%;font-size:1.1rem;padding:12px">✅ Periksa jawaban A, B, dan C</button></div><div id="qr"></div>`;
  $$('[data-a]',el).forEach(b=>b.onclick=()=>{ if(el.dataset.done)return; const i=+b.dataset.a; ans.pg[i]=+b.dataset.k; $$(`[data-a="${i}"]`,el).forEach(x=>x.classList.toggle('sel',x===b)); });
  $$('[data-b]',el).forEach(b=>b.onclick=()=>{ if(el.dataset.done)return; const i=+b.dataset.b; ans.bs[i]=b.dataset.v==='1'; $$(`[data-b="${i}"]`,el).forEach(x=>x.classList.toggle('sel',x===b)); });
  $$('[data-c]',el).forEach(s=>s.onchange=()=>{ ans.jd[+s.dataset.c]=s.value===''?null:+s.value; });
  $$('[data-u]',el).forEach(t=>t.oninput=()=>{ ur[+t.dataset.u]=t.value; store.set('ur'+P.n,ur); });
  $$('[data-show]',el).forEach(b=>b.onclick=()=>{ $('#ue'+b.dataset.show,el).hidden=false; });
  $('#qs',el).onclick=()=>{ const tot=pg.length+Z.bs.length+Z.jd.length, kos=tot-Object.keys(ans.pg).length-Object.keys(ans.bs).length-Object.values(ans.jd).filter(v=>v!=null).length;
    if(kos>0&&!el.dataset.warned){ el.dataset.warned=1; $('#qr',el).innerHTML=`<div class="fb no">Masih ada ${kos} soal yang belum dijawab. Tekan tombol periksa sekali lagi bila ingin tetap memeriksa.</div>`; return; }
    el.dataset.done=1; let ok=0;
    pg.forEach((q,i)=>{ const r=ans.pg[i]===0; if(r)ok++; $$(`[data-a="${i}"]`,el).forEach(x=>{ x.disabled=true; if(+x.dataset.k===0)x.classList.add('good'); else if(+x.dataset.k===ans.pg[i])x.classList.add('no'); }); $(`#qa${i} .ex`,el).innerHTML=(r?'✅ ':'❌ ')+esc(q.ex||''); });
    Z.bs.forEach((b,i)=>{ const r=ans.bs[i]===b[1]; if(r)ok++; $$(`[data-b="${i}"]`,el).forEach(x=>{ x.disabled=true; if((x.dataset.v==='1')===b[1])x.classList.add('good'); else if(x.classList.contains('sel'))x.classList.add('no'); }); $(`#qb${i} .ex`,el).innerHTML=(r?'✅ ':'❌ ')+(b[1]?'Benar.':'Salah. ')+esc(b[2]||''); });
    Z.jd.forEach((p,i)=>{ const s=$(`[data-c="${i}"]`,el), r=ans.jd[i]===i; if(r)ok++; s.disabled=true; s.classList.add(r?'good':'no'); if(!r) s.insertAdjacentHTML('afterend',`<div class="ex" style="grid-column:2">→ ${esc(p[1])}</div>`); });
    const nilai=Math.round(ok/tot*100), b0=store.get(key); if(b0==null||nilai>b0) store.set(key,nilai);
    $('#qs',el).hidden=true;
    $('#qr',el).innerHTML=`<div class="card" style="text-align:center;border:2px solid var(--gold)"><div class="huge">${nilai>=85?'🏆':nilai>=70?'🌟':'🌱'}</div><div class="big">Nilai: ${nilai}</div><p>${ok} dari ${tot} soal benar. ${nilai>=85?'MasyaAllah, luar biasa!':nilai>=70?'Alhamdulillah, bagus! Pelajari lagi soal yang salah.':'Ayo baca lagi Ayo Memahami, lalu coba lagi. Semangat!'}</p><p class="muted">Nilai terbaik: ${Math.max(nilai,b0||0)} · Bagian D diperiksa bersama ustadz/ustadzah.</p><button class="btn" id="qa">🔁 Ulangi kuis</button></div>`;
    $('#qa',el).onclick=()=>{ quiz(el,P); el.removeAttribute('data-done'); el.removeAttribute('data-warned'); el.scrollIntoView({behavior:'smooth'}); }; say(nilai>=70?'Alhamdulillah':'Semangat, coba lagi'); };
}

/* ---------- tugas rumah ---------- */
function tugas(P){ const T=P.tugas; let tbl='';
  if(T.cols){ const rows=T.fixed?T.fixed.map(f=>[f,...T.cols.slice(1).map(()=>'')]):Array.from({length:T.rows||4},()=>T.cols.map(()=>''));
    tbl=`<div class="tw"><table class="t"><tr><th>No</th>${T.cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr>${T.ex?`<tr><td><i>Contoh</i></td>${T.ex.map(x=>`<td><i>${esc(x)}</i></td>`).join('')}</tr>`:''}${rows.map((r,i)=>`<tr><td>${i+1}</td>${r.map((c,k)=>`<td class="blank">${k===0&&T.fixed?esc(c):''}</td>`).join('')}</tr>`).join('')}</table></div>`; }
  return `<div class="card printme"><h2>🏠 Tugas di Rumah: ${esc(T.t)}</h2><p>${esc(T.d)}</p>${T.steps?`<b>Langkah-langkah:</b><ol>${T.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`:''}${tbl}${T.draw?`<div class="drawbox">${esc(T.draw)}</div>`:''}
   ${T.q?`<b>Jawablah:</b><ol>${T.q.map(q=>`<li>${esc(q)}<div style="border-bottom:1.5px dotted var(--muted);height:30px"></div></li>`).join('')}</ol>`:''}
   <div class="ortu"><b>Catatan untuk Ayah/Bunda:</b> Ananda sedang belajar “${esc(P.t)}”. Mohon dampingi ananda dan biarkan ananda menulis sendiri. ${esc(T.kumpul||'Dikumpulkan pada pertemuan IPAS berikutnya.')}<br>Paraf orang tua: .................................</div>
   <div class="row noprint" style="margin-top:10px"><button class="btn" onclick="document.querySelectorAll('.panel').forEach(p=>p.classList.remove('printme'));document.getElementById('tugas').classList.add('printme');window.print()">🖨️ Cetak lembar tugas</button></div></div>`; }

/* ---------- halaman pertemuan ---------- */
function page(n){ const all=window.PTM, P=all.find(x=>x.n===n), prev=all.find(x=>x.n===n-1), next=all.find(x=>x.n===n+1), B=BAB[P.bab];
  document.body.dataset.bab=P.bab; document.title=`P${n} · ${P.t} · IPAS Qonuni 4`;
  const gk='g'+n, gs=store.get(gk)||[];
  const learn=P.learn.map(b=>`<div class="card learn"><h3>${esc(b.h)} ${sp(b.h+'. '+(b.p||'')+(b.li?b.li.map(l=>l[1]+', '+l[2]).join('. '):''))}</h3>${b.p?`<p>${esc(b.p)}</p>`:''}${b.li?b.li.map(l=>`<div class="li"><span class="e">${l[0]}</span><div><b>${esc(l[1])}</b> — ${esc(l[2])}</div></div>`).join(''):''}${b.ol?`<ol>${b.ol.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`:''}${b.warn?`<div class="warn">⚠️ <b>Hati-hati:</b> ${esc(b.warn)}</div>`:''}</div>`).join('');
  const flow=`<div class="card"><h3>📊 ${esc(P.flow.t)}</h3><div class="flow ${P.flow.type==='map'?'':'chainf'}">${P.flow.s.map(s=>`<div class="st"><span class="e">${s[0]}</span>${esc(s[1])}</div>`).join('')}</div></div>`;
  document.body.innerHTML=`<header class="top"><div class="wrap"><a class="back" href="../index.html">← Beranda</a><div class="brand">${B[1]} IPAS Qonuni 4 <small>· Pertemuan ${n}</small></div><div class="pn">${prev?`<a href="p${String(prev.n).padStart(2,'0')}.html" title="Sebelumnya">‹</a>`:''}${next?`<a href="p${String(next.n).padStart(2,'0')}.html" title="Berikutnya">›</a>`:''}</div></div></header>
  <div class="wrap"><section class="hero"><span class="chip">Pertemuan ${n} · Bab ${P.bab}: ${esc(B[0])}</span> ${P.ev?'<span class="chip gold">📝 '+esc(P.evl||'Evaluasi Bab '+P.bab)+'</span>':''}<h1>${P.ic} ${esc(P.t)}</h1><div class="row"><span class="chip soft">Metode: ${esc(P.metode)}</span><span class="chip soft">⏱️ 1 × 60 menit</span></div></section>
   <div class="card ayat"><div class="lbl">🌙 Mari Mengingat Allah</div><blockquote>${esc(P.ayat[0])}</blockquote><cite>${esc(P.ayat[1])} ${sp(P.ayat[0]+'. '+P.ayat[1])}</cite><p>${esc(P.ayat[2])}</p></div>
   <div class="card"><h2><span class="ic">🎯</span>Hari Ini Aku Belajar</h2><ul class="goals">${P.goals.map((g,i)=>`<li><input type="checkbox" data-g="${i}" ${gs.includes(i)?'checked':''} aria-label="tandai tujuan ${i+1}"><span>${esc(g)}</span></li>`).join('')}</ul><p class="muted" style="margin:.4em 0 0;font-size:.9rem">Centang setelah kamu merasa bisa.</p></div>
   <nav class="tabs"><button data-t="pahami">📖 Ayo Memahami</button><button data-t="lab">🔬 Lab</button><button data-t="main">🎮 Latihan</button><button data-t="kuis">📝 Kuis</button><button data-t="tugas">🏠 Tugas Rumah</button></nav>
   <section class="panel" id="pahami">${learn}<div class="card tahu"><b>💡 Tahukah Kamu?</b> ${esc(P.tahu)} ${sp(P.tahu)}</div>${P.warn?`<div class="card warn">⚠️ ${esc(P.warn)}</div>`:''}${flow}<div class="row"><button class="btn" data-goto="lab">Lanjut ke Lab 🔬</button></div></section>
   <section class="panel" id="lab"><div class="card"><h2><span class="ic">${P.lab.ic}</span>${esc(P.lab.t)}</h2><p class="muted">${esc(P.lab.d)}</p><div id="labw"></div></div><div class="row"><button class="btn" data-goto="main">Lanjut ke Latihan 🎮</button></div></section>
   <section class="panel" id="main"><div class="card"><h2><span class="ic">${P.game.ic}</span>${esc(P.game.t)}</h2><p class="muted">${esc(P.game.d)}</p><div id="gamew"></div></div><div class="row"><button class="btn" data-goto="kuis">Lanjut ke Kuis 📝</button></div></section>
   <section class="panel" id="kuis"><div class="card"><h2><span class="ic">📝</span>${esc(P.kt||'Kuis: Ayo Uji Dirimu!')}</h2><div id="quizw"></div></div></section>
   <section class="panel" id="tugas">${tugas(P)}</section>
   <div class="navbot">${prev?`<a class="btn ghost" href="p${String(prev.n).padStart(2,'0')}.html">‹ P${prev.n}: ${esc(prev.t)}</a>`:'<span></span>'}${next?`<a class="btn" href="p${String(next.n).padStart(2,'0')}.html">P${next.n}: ${esc(next.t)} ›</a>`:'<a class="btn" href="../latihan/index.html">📚 Latihan Semester ›</a>'}</div></div>
  <footer><div class="wrap">Virtual IPAS Lab · Qonuni 4 · Semester 1 · Kuttab Raudhah Nabawiyah</div></footer>`;
  const bs=$$('.tabs button'); const go=(id,u)=>{ bs.forEach(b=>b.classList.toggle('on',b.dataset.t===id)); $$('.panel').forEach(p=>p.classList.toggle('on',p.id===id)); if(u){ try{history.replaceState(null,'','#'+id);}catch(e){} window.scrollTo({top:Math.min(window.scrollY,$('.tabs').offsetTop-56)}); } };
  bs.forEach(b=>b.onclick=()=>go(b.dataset.t,1)); $$('[data-goto]').forEach(b=>b.onclick=()=>go(b.dataset.goto,1));
  const h=location.hash.slice(1); go(bs.some(b=>b.dataset.t===h)?h:'pahami'); if(h) setTimeout(()=>window.scrollTo(0,0),0);
  $$('[data-g]').forEach(c=>c.onchange=()=>{ const s=$$('[data-g]').filter(x=>x.checked).map(x=>+x.dataset.g); store.set(gk,s); });
  W[P.lab.w]($('#labw'),P.lab); W[P.game.w]($('#gamew'),P.game); quiz($('#quizw'),P);
}
window.IPAS={page,W,store,say,sp,shuf,esc,$,$$,BAB,quiz};
})();
