(function(){
'use strict';
try{if(parseFloat(getComputedStyle(document.documentElement).paddingBottom)>0)document.documentElement.classList.add('rootpad');}catch(e){}
var $=function(s){return document.querySelector(s)};
var chat=$('#chat'), inner=$('#chatInner');
var WD=['일','월','화','수','목','금','토'];
function dateLabel(d){var p=d.split('-').map(Number);var dt=new Date(p[0],p[1]-1,p[2]);
  return p[0]+'년 '+p[1]+'월 '+p[2]+'일 '+WD[dt.getDay()]+'요일';}
function identity(d){var r=IDENTITY[0];IDENTITY.forEach(function(x){if(x.from<=d)r=x});return r;}
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;}

$('#hName').textContent=CONFIG.headerName;
function daysTogether(){
  var t=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()).split('-').map(Number);
  var s=CONFIG.startDate.split('-').map(Number);
  var n=Math.round((Date.UTC(t[0],t[1]-1,t[2])-Date.UTC(s[0],s[1]-1,s[2]))/86400000);
  return Math.max(0,n+(CONFIG.startCountsAsDay1?1:0));
}

/* ── 번역 상태 ── */
var trOn=false;try{trOn=localStorage.getItem('pop-tr')==='1'}catch(e){}
var TR=window.TRANSLATIONS||{},EN=window.UI_EN||{};
function T(s){var t=TR[s];return (t&&t!==s)?t:null;}
var WD_EN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var MO_EN=['January','February','March','April','May','June','July','August','September','October','November','December'];
function dateLabelEN(d){var p=d.split('-').map(Number);var dt=new Date(p[0],p[1]-1,p[2]);
  return WD_EN[dt.getDay()]+', '+MO_EN[p[1]-1]+' '+p[2]+', '+p[0];}
function pillLabel(d){return trOn?dateLabelEN(d):dateLabel(d);}

var pills={}, hits=[];
function render(){
  inner.textContent='';pills={};hits=[];
  var prev=null;
  BLOCKS.forEach(function(b,bi){
    if(b.d!==prev){
      var pill=el('div','datepill');var sp=el('span',null,pillLabel(b.d));pill.appendChild(sp);
      pill.dataset.date=b.d;pills[b.d]=sp;inner.appendChild(pill);prev=b.d;
    }
    var id=identity(b.d);
    var blk=el('div','block');blk.dataset.i=bi;
    var av=el('img','avatar');av.src=id.avatar;av.alt='';av.draggable=false;blk.appendChild(av);
    av.style.cursor='zoom-in';av.addEventListener('click',function(){openProfilePhoto(id);});
    var body=el('div','body');
    var who=el('div','who');
    who.appendChild(el('span','nm',id.name));
    who.appendChild(el('i','badge'));
    who.appendChild(el('span','tm',b.t));
    body.appendChild(who);
    var list=el('div','list');
    b.items.forEach(function(it){
      var n,t;
      if(it.k==='t'){
        t=trOn?T(it.v):null;
        if(t){n=el('div','bubble trx'+(it.cls?' '+it.cls:''));var o=el('div','o',it.v);if(it.cls)o.className='o';n.appendChild(o);n.appendChild(el('div','t',t));}
        else n=el('div','bubble'+(it.cls?' '+it.cls:''),it.v);
        n.dataset.s=it.v+(T(it.v)?'\n'+T(it.v):'');hits.push(n);
      }
      else if(it.k==='e'){n=el('div','bubble emoji',it.v);}
      else if(it.k==='r'){
        var tq=trOn?T(it.q):null,ta=trOn?T(it.a):null;
        n=el('div','reply'+(trOn?' trx':''));
        n.appendChild(el('div','rt',trOn?(EN.replyTitle||"계란학살자's reply"):'계란학살자님의 답장'));
        n.appendChild(el('div','rq',tq?tq+' '+(EN.translatedMark||'(Translated)'):it.q));
        var ra=el('div','ra'+(ta?' o':''));ra.appendChild(el('b','rarr'));ra.appendChild(el('span',null,it.a));n.appendChild(ra);
        if(ta){var rb=el('div','ra t');rb.appendChild(el('b','rarr'));rb.appendChild(el('span',null,ta));n.appendChild(rb);}
        n.dataset.s=[it.q,it.a,T(it.q)||'',T(it.a)||''].join('\n');hits.push(n);
      }else if(it.k==='p'){
        var ph=PHOTOS[it.id];
        n=el('button','photo');n.type='button';
        var w=it.w>it.h?220:165;n.style.width=w+'px';n.style.aspectRatio=it.w+'/'+it.h;
        var im=el('img');im.src=ph.mid||ph.web;im.alt='';im.loading='lazy';im.decoding='async';im.draggable=false;n.appendChild(im);
        n.addEventListener('click',function(){openViewer(ph,id,b)});
      }
      list.appendChild(n);
    });
    body.appendChild(list);blk.appendChild(body);inner.appendChild(blk);
  });
  $('#hSub').textContent=(trOn?(EN.headerSubTemplate||'Together for {n} days'):CONFIG.headerSubTemplate).replace('{n}',daysTogether());
  $('#bottomText').textContent=trOn?(EN.bottom||'Artist message archive'):'아티스트 메시지 보관 기록';
  document.body.classList.toggle('tr-on',trOn);
  if(typeof refreshDateOptions==='function')refreshDateOptions();
}
render();

/* 사진 확대 + 저장 */
var themeMeta=document.querySelector('meta[name="theme-color"]');
if(!themeMeta){themeMeta=document.createElement('meta');themeMeta.name='theme-color';themeMeta.content='#c9d0ea';document.head.appendChild(themeMeta);}
function setTheme(dark){document.documentElement.classList.toggle('viewing',dark);themeMeta.content=dark?'#000000':'#c9d0ea';}
var viewer=$('#viewer'),vImg=$('#vImg'),vSave=$('#vSave'),cur=null;
function openViewer(ph,ident,b){
  cur={ph:ph,when:b.d.replace(/-/g,'.')+' '+b.t,orig:ph.orig,key:b.d.replace(/-/g,'')+'_'+b.t.replace(':','')+'_'+Object.keys(PHOTOS).find(function(k){return PHOTOS[k]===ph})};
  // 먼저 중간 크기로 바로 보여주고, 큰 사진이 준비되면 교체
  vImg.src=ph.mid||ph.web;var big=new Image();big.onload=function(){if(cur&&cur.ph===ph)vImg.src=ph.web;};big.src=ph.web;
  $('#vAv').src=ident.avatar;$('#vNm').textContent=ident.name;$('#vTm').textContent=cur.when;
  clearTimeout(vT);viewer.classList.remove('open','closing');viewer.hidden=false;
  requestAnimationFrame(function(){requestAnimationFrame(function(){viewer.classList.add('open');})});
  vT=setTimeout(function(){setTheme(true);},380);   // 다 올라온 뒤 상단까지 검정
}
var vT=null;
function closeViewer(){
  if(viewer.hidden)return;clearTimeout(vT);setTheme(false);
  viewer.classList.add('closing');viewer.classList.remove('open');
  vT=setTimeout(function(){viewer.hidden=true;viewer.classList.remove('closing');vImg.removeAttribute('src');cur=null;},280);
}
$('#vClose').addEventListener('click',closeViewer);
document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(!sView.hidden)closeSView();else if(false);else if(!viewer.hidden)closeViewer();else if(!sDetail.hidden)closePost();else if(home&&!home.hidden&&!openSh&&gallery.hidden)closeHome();else if(openSh)closeSheet();else if(!gallery.hidden){if(selMode)setSelMode(false);else gallery.hidden=true;}menu.hidden=true}});

function fileName(p){return p.split('/').pop();}
function mimeOf(n){return /\.png$/i.test(n)?'image/png':'image/jpeg';}
function anchorSave(url,name){var a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();}
async function savePhoto(){
  if(!cur)return;var name='계란학살자_'+cur.key+(/\.png$/i.test(cur.orig)?'.png':'.jpg');
  vSave.classList.add('busy');
  try{
    var blob=null;
    try{var r=await fetch(cur.orig);if(r.ok)blob=await r.blob();}catch(e){}
    // 1) 아티스트 보관 페이지 안에서 열린 경우(다운로드 기능 제공 시)
    var dl=null;try{dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null;}catch(e){}
    if(dl&&blob){try{await dl.save({filename:name,data:blob});}catch(e){}return;}
    // 2) 일반 웹/아이폰: 공유 시트(→ '이미지 저장'으로 사진 앱에 저장)
    if(blob&&navigator.canShare&&navigator.share){
      var f=new File([blob],name,{type:blob.type||mimeOf(name)});
      if(navigator.canShare({files:[f]})){try{await navigator.share({files:[f]});return;}catch(e){if(e&&e.name==='AbortError')return;}}
    }
    // 3) 그 밖: 파일 다운로드
    if(blob){var u=URL.createObjectURL(blob);anchorSave(u,name);setTimeout(function(){URL.revokeObjectURL(u)},4000);}
    else anchorSave(cur.orig,name);
  }finally{vSave.classList.remove('busy');}
}
vSave.addEventListener('click',savePhoto);

function saveName(b,pid,orig){return '계란학살자_'+b.d.replace(/-/g,'')+'_'+b.t.replace(':','')+'_'+pid.replace('_frame','')+(/\.png$/i.test(orig)?'.png':'.jpg');}
async function fetchBlob(u){try{var r=await fetch(u);if(r.ok)return await r.blob();}catch(e){}return null;}
var CRC=(function(){var t=new Uint32Array(256);for(var n=0;n<256;n++){var c=n;for(var k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crc32(u8){var c=0xFFFFFFFF;for(var i=0;i<u8.length;i++)c=CRC[(c^u8[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
async function makeZip(files){ // 무압축 ZIP (사진은 이미 압축돼 있어 그대로 묶음)
  var enc=new TextEncoder(),parts=[],central=[],off=0;
  for(var f of files){
    var data=new Uint8Array(await f.blob.arrayBuffer()),name=enc.encode(f.name),crc=crc32(data);
    var lh=new DataView(new ArrayBuffer(30));
    lh.setUint32(0,0x04034b50,true);lh.setUint16(4,20,true);lh.setUint16(6,0x0800,true);lh.setUint16(8,0,true);
    lh.setUint32(14,crc,true);lh.setUint32(18,data.length,true);lh.setUint32(22,data.length,true);lh.setUint16(26,name.length,true);
    parts.push(lh,name,data);
    var ch=new DataView(new ArrayBuffer(46));
    ch.setUint32(0,0x02014b50,true);ch.setUint16(4,20,true);ch.setUint16(6,20,true);ch.setUint16(8,0x0800,true);
    ch.setUint32(16,crc,true);ch.setUint32(20,data.length,true);ch.setUint32(24,data.length,true);ch.setUint16(28,name.length,true);ch.setUint32(42,off,true);
    central.push(ch,name);off+=30+name.length+data.length;
  }
  var csize=central.reduce(function(s,p){return s+p.byteLength},0);
  var end=new DataView(new ArrayBuffer(22));
  end.setUint32(0,0x06054b50,true);end.setUint16(8,files.length,true);end.setUint16(10,files.length,true);end.setUint32(12,csize,true);end.setUint32(16,off,true);
  return new Blob(parts.concat(central,[end]),{type:'application/zip'});
}
async function saveMany(list){
  var files=[];
  for(var x of list){var b=await fetchBlob(x.ph.orig);if(b)files.push({name:x.name||saveName(x.b,x.pid,x.ph.orig),blob:b});}
  if(!files.length){list.forEach(function(x){anchorSave(x.ph.orig,saveName(x.b,x.pid,x.ph.orig))});return;}
  var dl=null;try{dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null;}catch(e){}
  if(dl){
    try{ if(files.length===1)await dl.save({filename:files[0].name,data:files[0].blob});
         else await dl.save({filename:'계란학살자_보관함_'+files.length+'장.zip',data:await makeZip(files)}); }catch(e){}
    return;
  }
  if(navigator.canShare&&navigator.share){
    var fs=files.map(function(f){return new File([f.blob],f.name,{type:f.blob.type||mimeOf(f.name)})});
    if(navigator.canShare({files:fs})){try{await navigator.share({files:fs});return;}catch(e){if(e&&e.name==='AbortError')return;}}
  }
  var out=files.length===1?files[0]:{name:'계란학살자_보관함_'+files.length+'장.zip',blob:await makeZip(files)};
  var u=URL.createObjectURL(out.blob);anchorSave(u,out.name);setTimeout(function(){URL.revokeObjectURL(u)},8000);
}


/* POP 프로필 사진 크게 보기 (오른쪽 위 저장 → 원본 저장) */
function openProfilePhoto(id){
  var src=id.avatarOrig||id.avatar;
  openViewer({web:src,mid:id.avatar,orig:src},id,{d:'',t:''});
  cur.key='프로필_'+(id.from||'').replace(/-/g,'');$('#vTm').textContent='프로필 사진';
}
/* 흔들림 + 이동 */
function shake(node){node.classList.remove('shake');void node.offsetWidth;node.classList.add('shake');
  setTimeout(function(){node.classList.remove('shake')},1500);}
function goTo(node,block){
  var cr=chat.getBoundingClientRect(),nr=node.getBoundingClientRect();
  var top=chat.scrollTop+(nr.top-cr.top)-(cr.height/2-nr.height/2);
  chat.scrollTo({top:Math.max(0,top),behavior:'auto'});
  setTimeout(function(){shake(node)},60);
}

/* 메뉴(옛 드롭다운: 사용 안 함, 남겨둠) */
var menu=$('#menu');

/* 아래에서 올라오는 시트 공통 (번역 설정 / 아티스트 정보) */
var dim=$('#sheetDim'),openSh=null;
function openSheet(sh){
  if(openSh&&openSh!==sh){openSh.classList.remove('open');openSh.hidden=true;}
  menu.hidden=true;openSh=sh;dim.hidden=false;sh.hidden=false;sh.scrollTop=0;
  void sh.offsetHeight;dim.classList.add('open');sh.classList.add('open');   // 바로 시작(프레임 대기 없이)
}
function closeSheet(cb){
  var sh=openSh;if(!sh){if(cb)cb();return;}
  dim.classList.remove('open');sh.classList.remove('open');openSh=null;
  setTimeout(function(){if(!sh.classList.contains('open')){sh.hidden=true;sh.style.transform='';if(!openSh)dim.hidden=true;}if(cb)cb();},sh.classList.contains('psheet')&&!sh.classList.contains('fast')?390:330);
}
dim.addEventListener('click',function(){closeSheet()});
// 위쪽 손잡이 부분을 아래로 끌어서 닫기
function dragToClose(sh){
  var y0=null,dy=0;
  sh.addEventListener('pointerdown',function(e){var top=sh.getBoundingClientRect().top;if(e.clientY-top>56||e.target.closest('button,.switch'))return;y0=e.clientY;dy=0;sh.style.transition='none';sh.setPointerCapture(e.pointerId);});
  sh.addEventListener('pointermove',function(e){if(y0===null)return;dy=Math.max(0,e.clientY-y0);sh.style.transform='translateY('+dy+'px)';});
  function end(){if(y0===null)return;sh.style.transition='';sh.style.transform='';var close=dy>70;y0=null;if(close)closeSheet();}
  sh.addEventListener('pointerup',end);sh.addEventListener('pointercancel',end);
}

/* 번역 설정 시트 (오른쪽 위 번역 아이콘) */
var sheet=$('#sheet'),sw=$('#trSwitch');
sw.setAttribute('aria-checked',String(trOn));
$('#fnBtn').addEventListener('click',function(e){e.stopPropagation();openSheet(sheet);});
sw.addEventListener('click',function(){
  trOn=!trOn;sw.setAttribute('aria-checked',String(trOn));
  try{localStorage.setItem('pop-tr',trOn?'1':'0')}catch(e){}
  rerenderKeep();
});
dragToClose(sheet);

/* 아티스트 정보 시트 (상단 이름·화살표) */
var psheet=$('#psheet'),titleBtn=$('#titleBtn');
var latestId=IDENTITY[IDENTITY.length-1];
$('#pAv').src=latestId.avatar;$('#pName').textContent=CONFIG.headerName;
// 보관함: 사진을 최신순으로 (보낸 사람·시간 정보 포함)
var allPhotos=[];
BLOCKS.forEach(function(b){b.items.forEach(function(it){if(it.k==='p')allPhotos.push({ph:PHOTOS[it.id],pid:it.id,b:b,id:identity(b.d)})})});
allPhotos.reverse();
function thumbBtn(x,cls){var t=el('button',cls);t.type='button';var im=el('img');im.src=x.ph.thumb||x.ph.web;im.alt='';im.loading='lazy';im.decoding='async';im.draggable=false;t.appendChild(im);
  t.addEventListener('click',function(){if(selMode&&t.classList.contains('g-item')){toggleSel(t,x);return;}openViewer(x.ph,x.id,x.b)});return t;}
var pThumbs=$('#pThumbs');allPhotos.slice(0,4).forEach(function(x){pThumbs.appendChild(thumbBtn(x,'p-thumb'))});
function openProfile(e){if(e)e.stopPropagation();openSheet(psheet);}
titleBtn.addEventListener('click',openProfile);
titleBtn.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openProfile(e)}});
dragToClose(psheet);
$('#pDate').addEventListener('click',function(){closeSheet(function(){openCalendar()})});
$('#pWord').addEventListener('click',function(){showPanel('wordPanel');try{wIn.focus({preventScroll:true});}catch(e){wIn.focus();}psheet.classList.add('fast');dim.classList.add('fast');closeSheet(function(){psheet.classList.remove('fast');dim.classList.remove('fast');});});
$('#pExit').addEventListener('click',function(){closeSheet();openHome();});   // 나가기 = 홈으로 (왼쪽 위 '<'와 같음)


/* 달력 (날짜 검색) */
var csheet=$('#csheet'),cDays=$('#cDays'),cMonthEl=$('#cMonth'),cPrev=$('#cPrev'),cNext=$('#cNext');
var msgDates={};BLOCKS.forEach(function(b){msgDates[b.d]=1});
var dkeys=Object.keys(msgDates).sort();
function ym(d){return d.slice(0,7);}
function todayKST(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
var minYM=ym(dkeys[0]),maxYM=ym(todayKST())>ym(dkeys[dkeys.length-1])?ym(todayKST()):ym(dkeys[dkeys.length-1]);
var curYM=null;
function shiftYM(s,n){var y=+s.slice(0,4),m=+s.slice(5,7)-1+n;y+=Math.floor(m/12);m=((m%12)+12)%12;return y+'-'+String(m+1).padStart(2,'0');}
function pad(n){return String(n).padStart(2,'0');}
function drawCal(){
  var y=+curYM.slice(0,4),m=+curYM.slice(5,7);
  cMonthEl.textContent=trOn?(MO_EN[m-1]+' '+y):(y+'년 '+m+'월');
  $('#cTitle').textContent=trOn?'Calendar':'달력';
  $('#cLatest').textContent=trOn?'Go to the latest pop':'마지막 팝으로';
  var wd=$('#cWd');wd.textContent='';(trOn?['Sun','Mon','Tue','Wed','Thu','Fri','Sat']:WD).forEach(function(w){wd.appendChild(el('span',null,w))});
  cDays.textContent='';
  var first=new Date(y,m-1,1).getDay(),n=new Date(y,m,0).getDate(),today=todayKST();
  for(var i=0;i<first;i++)cDays.appendChild(el('span'));
  for(var d=1;d<=n;d++){
    var key=y+'-'+pad(m)+'-'+pad(d),has=!!msgDates[key];
    var c=el('button','c-day'+(has?' has':'')+(key===today?' today':''),String(d));c.type='button';
    if(has){(function(k){c.addEventListener('click',function(){closeSheet(function(){gotoDate(k)})})})(key);c.setAttribute('aria-label',dateLabel(key)+' 대화로 이동');}
    else c.disabled=true;
    cDays.appendChild(c);
  }
  cPrev.disabled=curYM<=minYM;cNext.disabled=curYM>=maxYM;
}
cPrev.addEventListener('click',function(){if(curYM>minYM){curYM=shiftYM(curYM,-1);drawCal();}});
cNext.addEventListener('click',function(){if(curYM<maxYM){curYM=shiftYM(curYM,1);drawCal();}});
$('#cClose').addEventListener('click',function(){closeSheet()});
$('#cLatest').addEventListener('click',function(){closeSheet(function(){chat.scrollTo({top:chat.scrollHeight,behavior:'smooth'})})});
function openCalendar(){curYM=maxYM;drawCal();openSheet(csheet);}
dragToClose(csheet);


/* ───── 홈 화면 ───── */
var home=$('#home');
(function buildHome(){
  $('#hAv').src=latestId.avatar;$('#hNm').textContent=CONFIG.headerName;$('#hDays').textContent='함께한지 '+daysTogether()+'일';
  // 사진 넘기기 (최근 8장)
  var track=$('#hTrack'),dots=$('#hDots'),list=allPhotos.slice(0,8);
  list.forEach(function(x,i){var s=el('button','h-slide');s.type='button';var im=el('img');im.src=x.ph.mid||x.ph.web;im.alt='';im.loading=i<2?'eager':'lazy';im.decoding='async';s.appendChild(im);
    s.addEventListener('click',function(){openViewer(x.ph,x.id,x.b)});track.appendChild(s);dots.appendChild(el('i',i?'':'on'));});
  var idx=0;function setIdx(i){idx=i;[].forEach.call(dots.children,function(d,k){d.classList.toggle('on',k===i)});$('#hNext').disabled=i>=list.length-1;}
  track.addEventListener('scroll',function(){var i=Math.round(track.scrollLeft/track.clientWidth);if(i!==idx)setIdx(i);},{passive:true});
  $('#hNext').addEventListener('click',function(){track.scrollTo({left:(idx+1)*track.clientWidth,behavior:'smooth'})});
  // 최근 메시지 5개 (최신순) → 누르면 대화의 그 말풍선으로
  var recent=[];for(var bi=BLOCKS.length-1;bi>=0&&recent.length<5;bi--){var b=BLOCKS[bi];for(var ii=b.items.length-1;ii>=0&&recent.length<5;ii--){var it=b.items[ii];var txt=it.k==='t'?it.v:it.k==='r'?it.a:it.k==='e'?it.v:'사진';recent.push({b:b,bi:bi,txt:txt});}}
  var hl=$('#hList');recent.forEach(function(r){var row=el('button','h-item');row.type='button';
    row.appendChild(el('span','h-when',r.b.d.slice(5).replace('-','.')+' '+r.b.t));row.appendChild(el('span','h-txt',r.txt));
    row.addEventListener('click',function(){closeHome(function(){var blk=inner.querySelector('.block[data-i="'+r.bi+'"]');if(blk){var bubbles=blk.querySelectorAll('.list>*');var target=bubbles[bubbles.length-1]||blk;goTo(target);}})});hl.appendChild(row);});
  // 숫자
  var nText=0;BLOCKS.forEach(function(b){b.items.forEach(function(it){if(it.k!=='p')nText++})});
  var st=$('#hStats');[[nText+'개','메시지'],[allPhotos.length+'장','사진'],[BLOCKS[0].d.replace(/-/g,'.'),'첫 팝']].forEach(function(p){var d=el('div');d.appendChild(el('b',null,p[0]));d.appendChild(el('span',null,p[1]));st.appendChild(d)});
})();
var homeT=null,navBusy=false;
/* 화면 전환: 아이폰 앱처럼 한 화면이 밀려 들어오고 다른 화면은 살짝 뒤로 물러남(시차 효과) */
var NAV_EASE='cubic-bezier(.32,.72,0,1)',NAV_MS=640;
var homeShade=document.createElement('div');homeShade.className='nav-shade';home.appendChild(homeShade);
function finishAnims(el){if(el.getAnimations)el.getAnimations().forEach(function(x){x.cancel()});}
function openHome(){            // 대화방 → 홈 : 대화방이 오른쪽으로 빠지고 홈이 왼쪽에서 살짝 따라옴
  if(navBusy)return;navBusy=true;clearTimeout(homeT);
  var app=$('#app');home.hidden=false;home.classList.add('open');
  app.classList.add('nav-top');home.classList.add('nav-under');
  document.documentElement.classList.add('athome');themeMeta.content='#ffffff';
  var o={duration:NAV_MS,easing:NAV_EASE,fill:'forwards'};
  app.animate([{transform:'translate3d(0,0,0)'},{transform:'translate3d(100%,0,0)'}],o);
  home.animate([{transform:'translate3d(-100%,0,0)'},{transform:'translate3d(0,0,0)'}],o);
  homeT=setTimeout(function(){finishAnims(app);finishAnims(home);finishAnims(homeShade);app.classList.remove('nav-top');home.classList.remove('nav-under');navBusy=false;},NAV_MS+20);
}
function closeHome(cb){         // 홈 → 대화방 : 대화방이 오른쪽에서 밀려 들어오고 홈은 왼쪽으로 살짝 물러남
  if(home.hidden){if(cb)cb();return;}
  if(navBusy){setTimeout(function(){closeHome(cb)},NAV_MS);return;}
  navBusy=true;clearTimeout(homeT);
  var app=$('#app');app.classList.add('nav-top');home.classList.add('nav-under');
  document.documentElement.classList.remove('athome');themeMeta.content='#c9d0ea';
  var o={duration:NAV_MS,easing:NAV_EASE,fill:'forwards'};
  app.animate([{transform:'translate3d(100%,0,0)'},{transform:'translate3d(0,0,0)'}],o);
  home.animate([{transform:'translate3d(0,0,0)'},{transform:'translate3d(-100%,0,0)'}],o);
  homeT=setTimeout(function(){home.hidden=true;home.classList.remove('open','nav-under');finishAnims(app);finishAnims(home);finishAnims(homeShade);app.classList.remove('nav-top');navBusy=false;if(cb)cb();},NAV_MS+20);
}
function popIn(){closeHome();}
$('#backBtn').addEventListener('click',function(e){e.stopPropagation();openHome();});   // 왼쪽 위 '<' → 홈 화면
$('#hMore').addEventListener('click',function(){closeHome()});

/* ───── Story ───── */
var STORYD=window.STORY||[],homeEl=$('#home');
(function buildStory(){
  var mem=$('#sMembers');(window.STORY_MEMBERS||[]).forEach(function(m){var b=el('button','s-mem'+(m.me?' me':''));b.type='button';var im=el('img');im.src=m.img;im.alt='';b.appendChild(im);b.appendChild(el('span',null,m.name));
    b.disabled=true;b.tabIndex=-1;if(m.me)b.classList.add('sel');mem.appendChild(b);});   // 멤버 선택 불가(보기 전용)
  var feed=$('#sFeed');STORYD.forEach(function(p){feed.appendChild(postNode(p,false));});
})();
function myCount(p){var n=0;(p.reactions||[]).forEach(function(r,ri){try{if(localStorage.getItem('react:'+p.id+':'+ri)==='1')n++}catch(e){}});return n;}
function postNode(p,detail){
  var w=el('article','s-post');
  var hd=el('div','s-head');var av=el('img','s-av');av.src=latestId.avatar;av.alt='';hd.appendChild(av);
  var nm=el('div','s-nm');nm.appendChild(el('span',null,'계란학살자'));nm.appendChild(el('i','s-seal'));
  if(detail){var nw=el('div','s-nmw');nw.appendChild(nm);nw.appendChild(el('div','s-when',p.when));hd.appendChild(nw);}else hd.appendChild(nm);
  var mr=el('button','s-more');mr.type='button';mr.setAttribute('aria-label','더보기');hd.appendChild(mr);w.appendChild(hd);
  if(p.media&&p.media.srcs){var srcs=p.media.srcs,md=el('div','s-media');var tr=el('div','s-track');
    srcs.forEach(function(s,si){var im=el('img');im.src=s;im.alt='';if(!detail){im.loading='lazy';im.decoding='async';}else im.decoding='sync';im.draggable=false;tr.appendChild(im);});
    md.appendChild(tr);w.appendChild(md);var cur=0,dt=null;
    if(srcs.length>1){dt=el('div','s-dots');srcs.forEach(function(_,di){dt.appendChild(el('i',di?'':'on'))});w.appendChild(dt);
      tr.addEventListener('scroll',function(){var i=Math.round(tr.scrollLeft/tr.clientWidth);if(i!==cur){cur=i;[].forEach.call(dt.children,function(d,k){d.classList.toggle('on',k===i)});}},{passive:true});}
    md.addEventListener('click',function(e){e.stopPropagation();openSView(p,cur);});}
  w.appendChild(el('div','s-text',p.text));
  var mt=el('div','s-meta'+(detail?' s-meta-d':''));mt.appendChild(el('span',null,p.when));mt.appendChild(el('span',null,'·'));
  var l=el('span');l.appendChild(el('i','ic-smile'));var lk=el('span','s-likes',String(p.likes+myCount(p)));lk.dataset.p=p.id;l.appendChild(lk);mt.appendChild(l);w.appendChild(mt);   // 댓글 수 표시는 넣지 않음
  function best(){var b=el('div','s-best');b.appendChild(el('b',null,p.best.user));b.appendChild(el('span',null,p.best.text));return b;}
  if(p.reactions&&p.reactions.length){var rs=el('div','s-reacts');p.reactions.forEach(function(r,ri){var x=el('button','s-r');x.type='button';
      var key='react:'+p.id+':'+ri,mine=false;try{mine=localStorage.getItem(key)==='1'}catch(e){}
      x.appendChild(el('span','s-emo',r.e||''));var cnt=el('span','s-n',String(r.n+(mine?1:0)));x.appendChild(cnt);x.classList.toggle('on',mine);
      x.addEventListener('click',function(e){e.stopPropagation();mine=!mine;x.classList.toggle('on',mine);cnt.textContent=String(r.n+(mine?1:0));
        try{localStorage.setItem(key,mine?'1':'0')}catch(_){}
        // 상세/목록 양쪽 같은 버튼도 맞춰줌
        document.querySelectorAll('.s-r[data-k="'+key+'"]').forEach(function(o){if(o!==x){o.classList.toggle('on',mine);o.querySelector('.s-n').textContent=String(r.n+(mine?1:0));}});
        document.querySelectorAll('.s-likes[data-p="'+p.id+'"]').forEach(function(s){s.textContent=String(p.likes+myCount(p));});
        x.animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:220,easing:'ease-out'});});
      x.dataset.k=key;rs.appendChild(x);});
    var ad=el('span','s-r add');ad.appendChild(el('i'));rs.appendChild(ad);w.appendChild(rs);}
  if(!detail)w.addEventListener('click',function(){openPost(p)});
  else{w.style.padding='0';w.style.border='0';w.style.cursor='default';}
  return w;
}

/* 스토리 사진 보기: 확대(돋보기·두 번 탭·두 손가락) · 옆으로 넘기기 · 다운로드(원본) · 닫기 */
var sView=$('#sView'),svImg=$('#svImg'),svZoom=$('#svZoom'),svCur=null,svIdx=0,svZ=1,svX=0,svY=0;
function svSize(){return {vw:sView.clientWidth,vh:sView.clientHeight,w:svImg.offsetWidth,h:svImg.offsetHeight};}
function svClamp(){var s=svSize(),mx=Math.max(0,(s.w*svZ-s.vw)/2),my=Math.max(0,(s.h*svZ-s.vh)/2);svX=Math.min(mx,Math.max(-mx,svX));svY=Math.min(my,Math.max(-my,svY));}
function svApply(anim){svImg.style.transition=anim?'transform .3s cubic-bezier(.22,1,.36,1)':'none';
  svImg.style.transform='translate3d('+svX+'px,'+svY+'px,0) scale('+svZ+')';svZoom.classList.toggle('on',svZ>1);svZoom.setAttribute('aria-label',svZ>1?'축소':'확대');}
function svZoomAt(cx,cy,z){var s=svSize(),px=cx-s.vw/2,py=cy-s.vh/2;svX=px-(px-svX)*z/svZ;svY=py-(py-svY)*z/svZ;svZ=z;if(z<=1){svZ=1;svX=svY=0;}else svClamp();svApply(true);}
function svShow(i,dir){var srcs=svCur.media.srcs;svIdx=(i+srcs.length)%srcs.length;svZ=1;svX=svY=0;svApply(false);svImg.src=srcs[svIdx];
  if(dir)svImg.animate([{transform:'translate3d('+(dir*40)+'px,0,0)',opacity:.3},{transform:'translate3d(0,0,0)',opacity:1}],{duration:260,easing:'cubic-bezier(.22,1,.36,1)'});
  var dots=$('#svDots');dots.textContent='';if(srcs.length>1)srcs.forEach(function(_,k){dots.appendChild(el('i',k===svIdx?'on':''))});}
function openSView(p,i){svCur=p;sView.hidden=false;svShow(i||0);sView.animate([{opacity:0},{opacity:1}],{duration:220,easing:'ease-out'});setTheme(true);}
function closeSView(){var an=sView.animate([{opacity:1},{opacity:0}],{duration:180,easing:'ease-in',fill:'forwards'});setTimeout(function(){sView.hidden=true;an.cancel();svImg.removeAttribute('src');svCur=null;if(viewer.hidden)setTheme(false);if(!home.hidden)themeMeta.content='#ffffff';},180);}
$('#svClose').addEventListener('click',closeSView);
function svToggleZoom(){var s=svSize();svZoomAt(s.vw/2,s.vh/2,svZ>1?1:2.5);}
// 돋보기: 아이폰에서 click이 늦거나 빠지는 경우가 있어 pointerup으로도 처리(중복 방지)
var svZLock=0;
svZoom.addEventListener('pointerup',function(e){e.stopPropagation();svZLock=Date.now();svToggleZoom();});
svZoom.addEventListener('click',function(e){e.stopPropagation();if(Date.now()-svZLock>500)svToggleZoom();});
(function(){var pts={},start=null,lastTap=0,moved=false;
  sView.addEventListener('pointerdown',function(e){if(e.target.closest('.sv-bar'))return;pts[e.pointerId]={x:e.clientX,y:e.clientY};var ids=Object.keys(pts);moved=false;
    if(ids.length===1)start={mode:'pan',x:e.clientX,y:e.clientY,sx:svX,sy:svY};
    else if(ids.length===2){var a=pts[ids[0]],b=pts[ids[1]];start={mode:'pinch',d:Math.hypot(a.x-b.x,a.y-b.y),z:svZ,cx:(a.x+b.x)/2,cy:(a.y+b.y)/2,sx:svX,sy:svY};}
    try{sView.setPointerCapture(e.pointerId)}catch(_){}});
  sView.addEventListener('pointermove',function(e){if(!pts[e.pointerId]||!start)return;pts[e.pointerId]={x:e.clientX,y:e.clientY};var ids=Object.keys(pts);
    if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>8)moved=true;
    if(start.mode==='pan'&&ids.length===1){
      if(svZ>1){svX=start.sx+(e.clientX-start.x);svY=start.sy+(e.clientY-start.y);svClamp();svApply(false);}
      else if(svCur&&svCur.media.srcs.length>1){svImg.style.transition='none';svImg.style.transform='translate3d('+(e.clientX-start.x)+'px,0,0)';}}
    else if(start.mode==='pinch'&&ids.length===2){var a=pts[ids[0]],b=pts[ids[1]];var z=Math.min(4,Math.max(1,start.z*Math.hypot(a.x-b.x,a.y-b.y)/start.d));
      var r=sView.getBoundingClientRect(),s=svSize(),px=start.cx-r.left-s.vw/2,py=start.cy-r.top-s.vh/2;svX=px-(px-start.sx)*z/start.z;svY=py-(py-start.sy)*z/start.z;svZ=z;if(z<=1.01){svZ=1;svX=svY=0;}else svClamp();svApply(false);}});
  function up(e){if(!pts[e.pointerId])return;var st=start;delete pts[e.pointerId];
    if(!Object.keys(pts).length){start=null;
      if(st&&st.mode==='pan'&&svZ===1&&svCur&&svCur.media.srcs.length>1){var dx=e.clientX-st.x;
        if(Math.abs(dx)>60)svShow(svIdx+(dx<0?1:-1),dx<0?1:-1);else svApply(true);}
      if(st&&st.mode==='pan'&&!moved&&e.target===svImg){var now=Date.now();if(now-lastTap<300){var r=sView.getBoundingClientRect();svZoomAt(e.clientX-r.left,e.clientY-r.top,svZ>1?1:2.5);lastTap=0;}else lastTap=now;}}}
  sView.addEventListener('pointerup',up);sView.addEventListener('pointercancel',up);
})();
$('#svDl').addEventListener('click',async function(){
  if(!svCur)return;var b=$('#svDl');b.classList.add('busy');
  var src=(svCur.media.origs||svCur.media.srcs)[svIdx];var suf=svCur.media.srcs.length>1?'_'+(svIdx+1):'';
  var name='계란학살자_스토리_'+svCur.id+suf+(/\.png$/i.test(src)?'.png':'.jpg');
  try{await saveMany([{ph:{orig:src},pid:svCur.id,b:{d:'',t:''},name:name}]);}finally{b.classList.remove('busy');}
});

var sDetail=$('#sDetail'),sdT=null;
function openPost(p){
  var body=$('#sdBody');body.textContent='';body.appendChild(postNode(p,true));body.scrollTop=0;
  clearTimeout(sdT);sDetail.hidden=false;   // 바로 표시(밀기 모션 없음)
}
function closePost(){
  var an=sDetail.animate([{transform:'translate3d(0,0,0)'},{transform:'translate3d(100%,0,0)'}],{duration:NAV_MS,easing:NAV_EASE,fill:'forwards'});
  sdT=setTimeout(function(){sDetail.hidden=true;an.cancel();},NAV_MS);
}
$('#sdBack').addEventListener('click',closePost);
function showTab(k){
  homeEl.classList.toggle('on-story',k==='story');
  document.querySelectorAll('.tab').forEach(function(t){t.classList.toggle('on',t.dataset.tab===k)});
  document.documentElement.classList.toggle('atstory',k==='story');
  if(!home.hidden)themeMeta.content='#ffffff';
}

var toastT=null;function toast(msg){var t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){t.hidden=true},1600);}
document.querySelectorAll('.tab').forEach(function(t){t.addEventListener('click',function(){
  var k=t.dataset.tab;
  if(k==='pop'){popIn();return;}
  if(k==='home'){if(homeEl.classList.contains('on-story'))showTab('home');else $('#homeMain').scrollTo({top:0,behavior:'smooth'});return;}
  if(k==='story'){if(homeEl.classList.contains('on-story'))$('#sScroll').scrollTo({top:0,behavior:'smooth'});else showTab('story');return;}
  toast(t.textContent.trim()+' 화면은 준비 중이에요');
})});

/* 보관함 전체보기 + 선택 다운로드 */
var gallery=$('#gallery'),gGrid=$('#gGrid'),gBuilt=false,selMode=false,selected=[];
var gTitle=$('#gTitle'),gSel=$('#gSel'),gDl=$('#gDl');
function buildGallery(){if(gBuilt)return;allPhotos.forEach(function(x){var t=thumbBtn(x,'g-item');t.appendChild(el('i','g-chk'));gGrid.appendChild(t)});gBuilt=true;}
function setSelMode(on){
  selMode=on;selected=[];gallery.classList.toggle('selecting',on);
  gGrid.querySelectorAll('.g-item.sel').forEach(function(t){t.classList.remove('sel')});
  updSel();
}
function updSel(){
  gTitle.textContent=selMode?(selected.length+'개 선택됨'):'보관함';
  gSel.textContent=selMode?'취소':'선택';
  gDl.hidden=!selMode;gDl.disabled=!selected.length;
}
function toggleSel(t,x){
  var i=selected.indexOf(x);
  if(i>-1){selected.splice(i,1);t.classList.remove('sel');}else{selected.push(x);t.classList.add('sel');}
  updSel();
}
$('#pAll').addEventListener('click',function(){
  buildGallery();setSelMode(false);
  closeSheet(function(){gallery.hidden=false;gallery.scrollTop=0;});
});
$('#gBack').addEventListener('click',function(){gallery.hidden=true;setSelMode(false);});
gSel.addEventListener('click',function(){setSelMode(!selMode);});
gDl.addEventListener('click',async function(){
  if(!selected.length)return;
  gDl.disabled=true;gDl.classList.add('busy');
  try{await saveMany(selected.slice());setSelMode(false);}
  finally{gDl.classList.remove('busy');updSel();}
});
// 번역 전환 시 보고 있던 위치 유지
function rerenderKeep(){
  var cr=chat.getBoundingClientRect(),anchor=null,off=0;
  var blocks=inner.querySelectorAll('.block');
  for(var k=0;k<blocks.length;k++){var r=blocks[k].getBoundingClientRect();if(r.bottom>cr.top+1){anchor=blocks[k].dataset.i;off=r.top-cr.top;break;}}
  var atEnd=chat.scrollHeight-chat.scrollTop-chat.clientHeight<4;
  render();
  if(atEnd){chat.scrollTop=chat.scrollHeight;}
  else if(anchor!=null){var nb=inner.querySelector('.block[data-i="'+anchor+'"]');if(nb){chat.scrollTop+= (nb.getBoundingClientRect().top-chat.getBoundingClientRect().top)-off;}}
  if(wIn&&lastQ)runSearchQuiet();
  layoutThumb();upd();
}
document.addEventListener('click',function(e){if(!menu.contains(e.target))menu.hidden=true;});
function showPanel(id){['datePanel','wordPanel'].forEach(function(p){$('#'+p).hidden=(p!==id)});menu.hidden=true;$('#app').classList.toggle('wsearch',id==='wordPanel');setTimeout(function(){layoutThumb();upd();},0);}
document.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',function(){$('#'+b.dataset.close).hidden=true;if(b.dataset.close==='wordPanel'){$('#app').classList.remove('wsearch');wIn.value='';lastQ=null;}clearWord();setTimeout(function(){layoutThumb();upd();},0);})});
$('#miDate').addEventListener('click',function(){showPanel('datePanel')});
$('#miWord').addEventListener('click',function(){showPanel('wordPanel');setTimeout(function(){$('#wordInput').focus()},30)});

/* 배경 전환 (아티스트 지정 배경 이미지가 설정되어 있을 때만) */
if(CONFIG.artistBackground){
  $('#miBg').hidden=false;
  $('#miBg').addEventListener('click',function(){
    var b=document.body,art=b.classList.toggle('bg-artist');b.classList.toggle('bg-default',!art);
    b.style.backgroundImage=art?'url('+CONFIG.artistBackground+')':'';menu.hidden=true;
    try{localStorage.setItem('bg',art?'artist':'default')}catch(e){}
  });
  try{if(localStorage.getItem('bg')==='artist')$('#miBg').click()}catch(e){}
}

/* 날짜 검색 */
var dates=Object.keys(pills);
var dIn=$('#dateInput'),dSel=$('#dateSelect');
dIn.min=dates[0];dIn.max=dates[dates.length-1];
function refreshDateOptions(){if(!dSel||!dates)return;var v=dSel.value;dSel.textContent='';dates.forEach(function(d){var o=el('option',null,pillLabel(d));o.value=d;dSel.appendChild(o)});if(v)dSel.value=v;}
refreshDateOptions();
function gotoDate(d){
  if(!pills[d]){ // 입력 날짜에 대화가 없으면 가장 가까운 이후 날짜
    var nx=dates.filter(function(x){return x>=d})[0]||dates[dates.length-1];d=nx;}
  dIn.value=d;dSel.value=d;goTo(pills[d]);
}
$('#dateGo').addEventListener('click',function(){if(dIn.value)gotoDate(dIn.value)});
dIn.addEventListener('change',function(){if(dIn.value)gotoDate(dIn.value)});
dSel.addEventListener('change',function(){gotoDate(dSel.value)});

/* 단어 찾기 */
var wIn=$('#wordInput'),wCnt=$('#wordCount'),matches=[],mi=-1;
function clearWord(){applyHighlight('');matches=[];mi=-1;wCnt.textContent='';navState();}
function navState(){var pending=wIn&&wIn.value.trim()&&wIn.value.trim()!==lastQ;var off=!pending&&matches.length<2;$('#wordPrev').disabled=off;$('#wordNext').disabled=off;}
function runSearch(){
  var q=wIn.value.trim().toLowerCase();matches=[];mi=-1;
  if(q){hits.forEach(function(n){if(n.dataset.s.toLowerCase().indexOf(q)>-1)matches.push(n)});}
  wCnt.textContent=q?(matches.length?'0/'+matches.length:'0건'):'';
  navState();applyHighlight(q);if(matches.length)step(1);
}
/* 찾은 단어 형광펜 */
var hlLeaves=[];
function leavesOf(n){if(n.classList.contains('bubble')&&!n.classList.contains('trx'))return [n];return Array.prototype.slice.call(n.querySelectorAll('.o,.t,.rq,.ra span'));}
function markLeaf(leaf,q){
  var t=leaf.textContent;leaf.textContent='';
  if(!q){leaf.textContent=t;return;}
  var lt=t.toLowerCase(),i=0,j;
  while((j=lt.indexOf(q,i))>-1){if(j>i)leaf.appendChild(document.createTextNode(t.slice(i,j)));leaf.appendChild(el('mark','hl',t.slice(j,j+q.length)));i=j+q.length;}
  if(i<t.length)leaf.appendChild(document.createTextNode(t.slice(i)));
}
function applyHighlight(q){
  hlLeaves.forEach(function(l){markLeaf(l,'')});hlLeaves=[];
  if(!q)return;
  matches.forEach(function(n){leavesOf(n).forEach(function(l){if(l.textContent.toLowerCase().indexOf(q)>-1){markLeaf(l,q);hlLeaves.push(l);}})});
}
function runSearchQuiet(){var q=wIn.value.trim().toLowerCase();matches=[];mi=-1;if(q){hits.forEach(function(n){if(n.dataset.s.toLowerCase().indexOf(q)>-1)matches.push(n)});}wCnt.textContent=q?(matches.length?'0/'+matches.length:'0건'):'';navState();hlLeaves=[];applyHighlight(q);}
function step(dir){
  if(!matches.length)return;
  mi=(mi+dir+matches.length)%matches.length;
  wCnt.textContent=(mi+1)+'/'+matches.length;goTo(matches[mi]);
}
// 입력 중에는 이동하지 않고, 엔터(아이폰 키보드의 '검색')를 눌렀을 때 이동
var lastQ=null;
wIn.addEventListener('input',function(){if(wIn.value.trim()!==lastQ){applyHighlight('');matches=[];mi=-1;wCnt.textContent='';navState();}});
function submitSearch(dir){
  var q=wIn.value.trim();
  if(!q)return;
  if(q!==lastQ){lastQ=q;runSearch();}   // 새 단어: 첫 결과로 이동
  else step(dir);                        // 같은 단어: 다음/이전 결과로
}
wIn.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.isComposing){e.preventDefault();submitSearch(e.shiftKey?-1:1);wIn.blur();}});
$('#wordForm')&&$('#wordForm').addEventListener('submit',function(e){e.preventDefault();});
$('#wordNext').addEventListener('click',function(){if(wIn.value.trim()!==lastQ)submitSearch(1);else step(1);});
$('#wordPrev').addEventListener('click',function(){if(wIn.value.trim()!==lastQ)submitSearch(-1);else step(-1);});


/* 살짝 진동: 안드로이드는 vibrate, 아이폰(iOS 18 이상 사파리)은 숨은 스위치를 눌러 시스템 햅틱을 냄 */
var hapLabel=(function(){try{var lb=document.createElement('label');lb.className='hap';lb.setAttribute('aria-hidden','true');
  var inp=document.createElement('input');inp.type='checkbox';inp.setAttribute('switch','');inp.tabIndex=-1;lb.appendChild(inp);document.body.appendChild(lb);return lb;}catch(e){return null}})();
function haptic(){
  try{if(navigator.vibrate&&navigator.vibrate(8))return;}catch(e){}
  try{if(hapLabel)hapLabel.click();}catch(e){}
}

/* 오른쪽 슬라이더 */
var slider=$('#slider'),thumb=$('#thumb'),dragging=false,grab=0;
function layoutThumb(){
  var sh=chat.scrollHeight,ch=chat.clientHeight,th=slider.clientHeight;
  var h=Math.max(44,th*ch/sh);thumb.style.height=h+'px';
  var max=sh-ch;var y=max>0?(th-h)*chat.scrollTop/max:0;thumb.style.top=y+'px';
}
function setFromY(clientY){
  var r=slider.getBoundingClientRect(),h=thumb.offsetHeight;
  var y=Math.min(Math.max(clientY-r.top-grab,0),r.height-h);
  var ratio=(r.height-h)>0?y/(r.height-h):0;
  chat.scrollTop=ratio*(chat.scrollHeight-chat.clientHeight);
}
slider.addEventListener('pointerdown',function(e){
  var tr=thumb.getBoundingClientRect();
  grab=(e.clientY>=tr.top&&e.clientY<=tr.bottom)?e.clientY-tr.top:tr.height/2;
  dragging=true;slider.classList.add('drag','show');clearTimeout(hideT);slider.setPointerCapture(e.pointerId);haptic();setFromY(e.clientY);e.preventDefault();
});
slider.addEventListener('pointermove',function(e){if(dragging)setFromY(e.clientY)});
function endDrag(){dragging=false;slider.classList.remove('drag');showSlider()}
slider.addEventListener('pointerup',endDrag);slider.addEventListener('pointercancel',endDrag);
var hideT=null;
function showSlider(){slider.classList.add('show');clearTimeout(hideT);if(!dragging)hideT=setTimeout(function(){slider.classList.remove('show')},900);}
chat.addEventListener('scroll',function(){layoutThumb();showSlider()},{passive:true});
slider.addEventListener('mouseenter',function(){slider.classList.add('show');clearTimeout(hideT)});
slider.addEventListener('mouseleave',function(){if(!dragging)showSlider()});
window.addEventListener('resize',layoutThumb);
window.addEventListener('load',function(){layoutThumb();setTimeout(layoutThumb,200)});

/* 최신 메시지 버튼 */
var latest=$('#latest');
function upd(){var far=chat.scrollHeight-chat.scrollTop-chat.clientHeight>240;latest.classList.toggle('on',far);}
chat.addEventListener('scroll',upd,{passive:true});
latest.addEventListener('click',function(){chat.scrollTo({top:chat.scrollHeight,behavior:'smooth'})});
function toEnd(){chat.scrollTop=chat.scrollHeight;upd();layoutThumb();}
window.addEventListener('load',function(){toEnd();setTimeout(toEnd,150)});
var userMoved=false;['wheel','touchstart','pointerdown','keydown'].forEach(function(ev){chat.addEventListener(ev,function(){userMoved=true},{passive:true,once:true})});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){if(!userMoved)toEnd();});
if(window.ResizeObserver){var ro=new ResizeObserver(function(){if(!userMoved)toEnd();});ro.observe(inner);ro.observe(chat);setTimeout(function(){ro.disconnect()},4000);}
toEnd();

/* 아이폰 키보드: 보이는 화면 높이에 맞춰 앱 높이를 바꿔, 검색 줄이 키보드 바로 위에 붙도록 */
(function(){var vv=window.visualViewport;if(!vv)return;var raf=0;
  function fit(){cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){
    var keyboard=window.innerHeight-vv.height>80;
    if(keyboard){var top=document.querySelector('.app').getBoundingClientRect().top;document.documentElement.style.setProperty('--vvh',Math.max(0,vv.height-Math.max(0,top))+'px');}else document.documentElement.style.removeProperty('--vvh');
    if(keyboard)window.scrollTo(0,0);
    var atEnd=chat.scrollHeight-chat.scrollTop-chat.clientHeight<40;setTimeout(function(){layoutThumb();upd();if(atEnd)chat.scrollTop=chat.scrollHeight;},300);
  });}
  vv.addEventListener('resize',fit);vv.addEventListener('scroll',function(){if(window.innerHeight-vv.height>80)window.scrollTo(0,0)});
})();
/* 마우스로 가로 줄 넘기기: 휠 · 끌기(관성) — 터치는 기본 스크롤 그대로 */
function mouseHScroll(elm,opts){
  if(!elm||elm.dataset.hs)return;elm.dataset.hs='1';opts=opts||{};
  elm.addEventListener('wheel',function(e){if(Math.abs(e.deltaY)>Math.abs(e.deltaX)&&elm.scrollWidth>elm.clientWidth){
    var max=elm.scrollWidth-elm.clientWidth;if((e.deltaY<0&&elm.scrollLeft<=0)||(e.deltaY>0&&elm.scrollLeft>=max-1))return;
    e.preventDefault();elm.scrollBy({left:e.deltaY*(opts.page?3:1.2),behavior:'smooth'});}},{passive:false});
  var down=false,sx=0,sl=0,lx=0,lt=0,v=0,dragged=false,raf=0,snap='';
  elm.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;down=true;dragged=false;sx=lx=e.clientX;sl=elm.scrollLeft;lt=performance.now();v=0;cancelAnimationFrame(raf);
    snap=getComputedStyle(elm).scrollSnapType;elm.style.scrollSnapType='none';elm.style.scrollBehavior='auto';});
  window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4){dragged=true;elm.classList.add('dragging');}
    var now=performance.now();v=(e.clientX-lx)/Math.max(1,now-lt);lx=e.clientX;lt=now;elm.scrollLeft=sl-dx;});
  window.addEventListener('pointerup',function(){if(!down)return;down=false;elm.classList.remove('dragging');
    if(opts.page){var i=Math.round((elm.scrollLeft+(v<-0.3?elm.clientWidth*0.4:v>0.3?-elm.clientWidth*0.4:0))/elm.clientWidth);elm.style.scrollSnapType=snap;elm.style.scrollBehavior='';elm.scrollTo({left:i*elm.clientWidth,behavior:'smooth'});return;}
    var vel=-v*16;(function glide(){vel*=0.94;elm.scrollLeft+=vel;if(Math.abs(vel)>0.4)raf=requestAnimationFrame(glide);else{elm.style.scrollSnapType=snap;elm.style.scrollBehavior='';}})();});
  elm.addEventListener('click',function(e){if(dragged){e.stopPropagation();e.preventDefault();dragged=false;}},true);
}
mouseHScroll($('#sMembers'));
mouseHScroll($('#hTrack'),{page:true});
document.querySelectorAll('.s-track').forEach(function(t){mouseHScroll(t,{page:true})});
new MutationObserver(function(){document.querySelectorAll('.s-track').forEach(function(t){mouseHScroll(t,{page:true})})}).observe(document.body,{childList:true,subtree:true});
/* 처음 열면: 비밀번호 화면 → 맞으면 홈 화면 */
(function(){
  var gate=$('#gate'),inp=$('#gatePw'),btn=$('#gateGo'),msg=$('#gateMsg');
  function showHomeNow(){home.hidden=false;home.classList.add('open');document.documentElement.classList.add('athome');themeMeta.content='#ffffff';}
  showHomeNow();
  var busy=false,alertBox=$('#gateAlert');
  function tryIn(){
    if(busy)return;var v=inp.value.trim();if(!v){inp.focus();return;}
    busy=true;inp.blur();var chk=$('#gateCheck');chk.hidden=false;chk.classList.remove('out');
    setTimeout(function(){
      busy=false;
      if(v===CONFIG.password){gate.classList.add('out');setTimeout(function(){gate.hidden=true;chk.hidden=true;},260);}
      else{chk.classList.add('out');setTimeout(function(){chk.hidden=true;inp.value='';alertBox.hidden=false;$('#gaOk').focus();},220);}
    },1100);
  }
  $('#gaOk').addEventListener('click',function(){alertBox.hidden=true;inp.focus();});
  btn.addEventListener('click',tryIn);
  inp.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.isComposing){e.preventDefault();tryIn();}});
  inp.addEventListener('input',function(){msg.textContent='';});
  setTimeout(function(){try{inp.focus({preventScroll:true})}catch(e){}},300);
})();
// 이미지 로딩으로 높이가 변해도 처음엔 맨 아래 유지 (aspect-ratio 지정으로 대부분 고정됨)
})();
