const $=id=>document.getElementById(id);document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));b.classList.add('active');$(b.dataset.id).classList.add('active')});
const c=$('canvas'),ctx=c.getContext('2d');let img=null,activeTemplate='social';
const templates={
 social:{w:1080,h:1080,bg:['#073f67','#7028a5','#d23d9c'],tag:'VEXORA STUDIO'},
 story:{w:1080,h:1920,bg:['#101b52','#7a2ca6','#ed65a3'],tag:'قصة اليوم'},
 youtube:{w:1280,h:720,bg:['#082c4e','#1450a0','#15152d'],tag:'▶ VEXORA'},
 quote:{w:1080,h:1080,bg:['#18233c','#4d387c','#111827'],tag:'إلهام'},
 sale:{w:1080,h:1080,bg:['#a21d50','#ed632f','#6b183f'],tag:'عرض خاص'}
};
function draw(){
 const p=templates[activeTemplate];
 c.width=p.w;c.height=p.h;
 let g=ctx.createLinearGradient(0,0,c.width,c.height);g.addColorStop(0,p.bg[0]);g.addColorStop(.58,p.bg[1]);g.addColorStop(1,p.bg[2]);ctx.fillStyle=g;ctx.fillRect(0,0,c.width,c.height);
 // Decorative soft circles and frame.
 ctx.globalAlpha=.13;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(c.width*.86,c.height*.15,c.width*.25,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(c.width*.08,c.height*.9,c.width*.22,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
 ctx.strokeStyle='#ffffff55';ctx.lineWidth=Math.max(3,c.width*.004);ctx.strokeRect(c.width*.055,c.height*.055,c.width*.89,c.height*.89);
 if(img){ctx.save();ctx.globalAlpha=.55;ctx.drawImage(img,c.width*.1,c.height*.15,c.width*.8,c.height*.7);ctx.restore()}
 const title=$('caption').value|| (activeTemplate==='sale'?'خصم 50%':activeTemplate==='quote'?'كلمات تلهمك':activeTemplate==='youtube'?'عنوان الفيديو':activeTemplate==='story'?'لحظتك المميزة':'منشورك يبدأ هنا');
 const sub=$('subcaption').value||'اصنع شيئاً استثنائياً';
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='#0009';ctx.shadowBlur=c.width*.018;
 ctx.font=`700 ${Math.round(c.width*.075)}px Arial`;ctx.lineWidth=Math.max(4,c.width*.006);ctx.strokeStyle='#101020aa';ctx.strokeText(title,c.width/2,c.height*.53,c.width*.78);ctx.fillStyle=$('color').value;ctx.fillText(title,c.width/2,c.height*.53,c.width*.78);
 ctx.shadowBlur=0;ctx.font=`${Math.round(c.width*.032)}px Arial`;ctx.fillStyle='#ffffff';ctx.fillText(sub,c.width/2,c.height*.64,c.width*.78);
 ctx.font=`700 ${Math.round(c.width*.023)}px Arial`;ctx.fillStyle='#c9f5ff';ctx.fillText(p.tag,c.width/2,c.height*.87);
}
$('imageFile').onchange=e=>{let f=e.target.files[0];if(!f)return;img=new Image();img.onload=()=>{c.style.display='block';$('imageHint').style.display='none';draw()};img.src=URL.createObjectURL(f)};
document.querySelectorAll('.template-card').forEach(b=>b.onclick=()=>{document.querySelectorAll('.template-card').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');activeTemplate=b.dataset.template;c.style.display='block';$('imageHint').style.display='none';draw()});
['caption','subcaption','color'].forEach(id=>$(id).oninput=draw);
$('reset').onclick=()=>{$('caption').value='';$('subcaption').value='';$('color').value='#ffffff';draw()};
$('save').onclick=()=>{draw();c.toBlob(b=>{let a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='VEXORA-template.png';a.click();URL.revokeObjectURL(a.href)})};
let v=$('video'),url=null;$('videoFile').onchange=e=>{let f=e.target.files[0];if(!f)return;if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(f);v.src=url;v.style.display='block';$('videoHint').style.display='none';$('status').textContent='تم تحميل الفيديو'};
v.onloadedmetadata=()=>{$('end').value=v.duration.toFixed(1);$('status').textContent='مدة الفيديو: '+v.duration.toFixed(1)+' ثانية'};
$('export').onclick=async()=>{if(!v.src||!v.duration)return alert('اختر فيديو أولاً');if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)return alert('استخدم أحدث Chrome أو Edge لتجربة تصدير الفيديو');let s=Math.max(0,+$('start').value||0),e=+$('end').value||v.duration;if(e<=s||e>v.duration+.1)return alert('تحقق من وقت البداية والنهاية');let cv=document.createElement('canvas');cv.width=v.videoWidth||1280;cv.height=v.videoHeight||720;let cx=cv.getContext('2d'),stream=cv.captureStream(30);try{v.captureStream().getAudioTracks().forEach(t=>stream.addTrack(t))}catch(err){}let mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp9')?'video/webm;codecs=vp9':'video/webm';let rec=new MediaRecorder(stream,{mimeType:mime}),parts=[];rec.ondataavailable=x=>{if(x.data.size)parts.push(x.data)};rec.onstop=()=>{let blob=new Blob(parts,{type:mime}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='VEXORA-clip.webm';a.click();$('status').textContent='اكتمل التصدير';stream.getTracks().forEach(t=>t.stop())};v.pause();v.currentTime=s;await new Promise(r=>{v.addEventListener('seeked',r,{once:true});setTimeout(r,1200)});rec.start(200);await v.play();$('status').textContent='جارٍ التصدير، اترك الصفحة مفتوحة';function frame(){if(v.ended||v.currentTime>=e){v.pause();if(rec.state!=='inactive')rec.stop();return}cx.drawImage(v,0,0,cv.width,cv.height);requestAnimationFrame(frame)}frame()};