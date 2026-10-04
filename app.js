'use strict';
const $=s=>document.querySelector(s);
const letters='ABCDEFGHIJ';
const defaults=['SUPREME','GENTLE','DRMIRRA','JINN','ASTAR','Super','LIP','Proper','JJoNak','Viol2t'];
const roles=['tank','damage','damage','support','support'];
const roleNames={damage:'ダメージ',tank:'タンク',support:'サポート'};
const paths={damage:'M3 3h4v15H3zM10 3h4v15h-4zM17 3h4v15h-4zM3 20h4v3H3zM10 20h4v3h-4zM17 20h4v3h-4z',tank:'M12 1 22 5v9c0 5-10 10-10 10S2 19 2 14V5z',support:'M8 2h8v6h6v8h-6v6H8v-6H2V8h6z'};
const defaultLeftLogo=new Image();
defaultLeftLogo.src='images/ossanwatch.png';
defaultLeftLogo.alt='Ossan Watch チームアイコン';
const state={players:defaults.map((name,i)=>({name,video:i<5?['Mauga','Cassidy','Junkrat','JetpackCat','Kiriko'][i]:['Reinhardt','Widowmaker','Tracer','Zenyatta','Illari'][i-5],role:roles[i%5]})),left:{name:'Ossan Watch',score:0,logo:defaultLeftLogo},right:{name:'team 2',score:1,logo:null}};
let noticeTimer;
function notify(message){$('#notice').textContent=message;$('#notice').classList.add('visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('#notice').classList.remove('visible'),4500)}
// 動画の追加: media/に「id.mp4」を置き、この一覧にroles付きで1行追加します。
const videoChoices = [
  {id:'domina', label:'domina.mp4', roles:['tank']},
  {id:'DVa', label:'DVa.mp4', roles:['tank']},
  {id:'Hazard', label:'Hazard.mp4', roles:['tank']},
  {id:'JunkerQueen', label:'JunkerQueen.mp4', roles:['tank']},
  {id:'Orisa', label:'Orisa.mp4', roles:['tank']},
  {id:'Ramattra', label:'Ramattra.mp4', roles:['tank']},
  {id:'Reinhardt', label:'Reinhardt.mp4', roles:['tank']},
  {id:'Roadhog', label:'Roadhog.mp4', roles:['tank']},
  {id:'Sigma', label:'Sigma.mp4', roles:['tank']},
  {id:'Winston', label:'Winston.mp4', roles:['tank']},
  {id:'WreckingBall', label:'WreckingBall.mp4', roles:['tank']},
  {id:'Zarya', label:'Zarya.mp4', roles:['tank']},
  {id:'Doomfist', label:'Doomfist.mp4', roles:['tank']},
  {id:'Mauga', label:'Mauga.mp4', roles:['tank']},
  {id:'Anran', label:'Anran.mp4', roles:['damage']},
  {id:'Ashe', label:'Ashe.mp4', roles:['damage']},
  {id:'Bastion', label:'Bastion.mp4', roles:['damage']},
  {id:'Cassidy', label:'Cassidy.mp4', roles:['damage']},
  {id:'Echo', label:'Echo.mp4', roles:['damage']},
  {id:'Emre', label:'Emre.mp4', roles:['damage']},
  {id:'Freja', label:'Freja.mp4', roles:['damage']},
  {id:'Genji', label:'Genji.mp4', roles:['damage']},
  {id:'Hanzo', label:'Hanzo.mp4', roles:['damage']},
  {id:'Junkrat', label:'Junkrat.mp4', roles:['damage']},
  {id:'Mei', label:'Mei.mp4', roles:['damage']},
  {id:'Pharah', label:'Pharah.mp4', roles:['damage']},
  {id:'Reaper', label:'Reaper.mp4', roles:['damage']},
  {id:'Shion', label:'Shion.mp4', roles:['damage']},
  {id:'Sierra', label:'Sierra.mp4', roles:['damage']},
  {id:'Sojourn', label:'Sojourn.mp4', roles:['damage']},
  {id:'Soldier76', label:'Soldier76.mp4', roles:['damage']},
  {id:'Sombra', label:'Sombra.mp4', roles:['damage']},
  {id:'Symmetra', label:'Symmetra.mp4', roles:['damage']},
  {id:'Torbjorn', label:'Torbjorn.mp4', roles:['damage']},
  {id:'Tracer', label:'Tracer.mp4', roles:['damage']},
  {id:'Vendetta', label:'Vendetta.mp4', roles:['damage']},
  {id:'Venture', label:'Venture.mp4', roles:['damage']},
  {id:'Widowmaker', label:'Widowmaker.mp4', roles:['damage']},
  {id:'Ana', label:'Ana.mp4', roles:['support']},
  {id:'Baptiste', label:'Baptiste.mp4', roles:['support']},
  {id:'Brigitte', label:'Brigitte.mp4', roles:['support']},
  {id:'Illari', label:'Illari.mp4', roles:['support']},
  {id:'JetpackCat', label:'JetpackCat.mp4', roles:['support']},
  {id:'Juno', label:'Juno.mp4', roles:['support']},
  {id:'Kiriko', label:'Kiriko.mp4', roles:['support']},
  {id:'Lifeweaver', label:'Lifeweaver.mp4', roles:['support']},
  {id:'Lucio', label:'Lucio.mp4', roles:['support']},
  {id:'Mercy', label:'Mercy.mp4', roles:['support']},
  {id:'Mizuki', label:'Mizuki.mp4', roles:['support']},
  {id:'Moira', label:'Moira.mp4', roles:['support']},
  {id:'Wuyang', label:'Wuyang.mp4', roles:['support']},
  {id:'Zenyatta', label:'Zenyatta.mp4', roles:['support']},
];
function choicesForRole(role){return videoChoices.filter(v=>v.roles.includes(role))}
function ensureRoleVideo(player){
  const choices=choicesForRole(player.role);
  if(!choices.some(v=>v.id===player.video))player.video=(choices.find(v=>typeof v.id==='string')||choices[0])?.id??null;
  return choices;
}
function updateVideoPreview(card,player){
  const video=card.querySelector('video');
  video.setAttribute('aria-label',videoLabel(player.video));
  if(player.video===null){video.pause();video.removeAttribute('src');video.load();return}
  video.src=videoSrc(player.video);
  video.play().catch(()=>{});
}
function refreshVideoChoices(card,player){
  const previous=player.video;
  const choices=ensureRoleVideo(player);
  const select=card.querySelector('select');
  select.replaceChildren(...choices.map(v=>{const option=document.createElement('option');option.value=v.id;option.textContent=v.label;return option}));
  select.disabled=choices.length===0;
  if(!choices.length){const option=document.createElement('option');option.value='';option.textContent='動画なし';select.append(option)}
  select.value=player.video??'';
  if(previous!==player.video)updateVideoPreview(card,player);
}
function videoSrc(n){return `media/${n}.mp4`}
function videoLabel(n){return n===null?'動画なし':`${n}.mp4 の動画`}
function icon(role){return `<svg class="role-icon" viewBox="0 0 24 24" aria-label="${roleNames[role]}" role="img"><path d="${paths[role]}"></path></svg>`}
function makeVideo(n,cls){const v=document.createElement('video');v.className=cls;if(n!==null)v.src=videoSrc(n);v.muted=true;v.loop=true;v.playsInline=true;v.preload='auto';v.autoplay=true;v.setAttribute('aria-label',videoLabel(n));return v}
state.players.forEach((p,i)=>{const card=document.createElement('article');card.className='player-card';card.innerHTML=`<div class="card-head"><span class="slot-letter">${letters[i]}</span><span>PLAYER ${String(i+1).padStart(2,'0')}</span></div><div class="video-slot"></div><div class="card-fields"><label>${letters[i]} name<input type="text" maxlength="40" aria-label="${letters[i]} name"></label><label>${letters[i]} mov<select aria-label="${letters[i]} mov">${choicesForRole(p.role).map(v=>`<option value="${v.id}">${v.label}</option>`).join('')}</select></label><label>ロール<select class="role-select" aria-label="${letters[i]} ロール">${Object.entries(roleNames).map(([v,n])=>`<option value="${v}">${n}</option>`).join('')}</select></label></div>`;card.querySelector('.video-slot').append(makeVideo(p.video,'mini-video'));const name=card.querySelector('input');name.value=p.name;name.addEventListener('input',()=>p.name=name.value);const selects=card.querySelectorAll('select');refreshVideoChoices(card,p);selects[0].addEventListener('change',()=>{const selected=choicesForRole(p.role).find(v=>String(v.id)===selects[0].value);if(!selected)return;p.video=selected.id;updateVideoPreview(card,p)});selects[1].value=p.role;selects[1].addEventListener('change',()=>{p.role=selects[1].value;refreshVideoChoices(card,p)});$(i<5?'#top-inputs':'#bottom-inputs').append(card)});
for(const side of ['left','right']){const letter=side==='left'?'L':'R';const container=$(`#${side}-team-form`);container.innerHTML=`<label class="upload-box"><span id="${side}-upload-preview">＋<br>アイコン</span><input type="file" accept="image/jpeg,image/png,image/webp" aria-label="${letter}チームアイコン画像"></label><div class="team-fields"><label>${letter} チーム名<input type="text" maxlength="60" aria-label="${letter} チーム名"></label><p class="file-caption">JPG / PNG / WebP · 5MBまで</p><button class="remove-logo" type="button" hidden>画像を削除</button></div>`;if(state[side].logo){$(`#${side}-upload-preview`).replaceChildren(state[side].logo.cloneNode());container.querySelector('.remove-logo').hidden=false}const input=container.querySelector('input[type=text]');input.value=state[side].name;input.addEventListener('input',()=>state[side].name=input.value);const file=container.querySelector('input[type=file]');let uploadRevision=0;file.addEventListener('change',async()=>{const f=file.files[0];if(!f)return;const revision=++uploadRevision;if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>5*1024*1024){notify('5MB以下のJPG・PNG・WebP画像を選択してください。');file.value='';return}const url=URL.createObjectURL(f);try{const image=new Image();image.src=url;await image.decode();if(revision!==uploadRevision)return;if(state[side].logo?.src.startsWith('blob:'))URL.revokeObjectURL(state[side].logo.src);state[side].logo=image;const preview=$(`#${side}-upload-preview`);preview.replaceChildren(image.cloneNode());container.querySelector('.remove-logo').hidden=false}catch{URL.revokeObjectURL(url);notify('画像を読み込めませんでした。別の画像を選択してください。')}finally{file.value=''}});container.querySelector('.remove-logo').addEventListener('click',()=>{uploadRevision++;if(state[side].logo?.src.startsWith('blob:'))URL.revokeObjectURL(state[side].logo.src);state[side].logo=null;$(`#${side}-upload-preview`).innerHTML='＋<br>アイコン';container.querySelector('.remove-logo').hidden=true});const score=$(`#${side}-score`);score.innerHTML=Array.from({length:11},(_,n)=>`<option value="${n}">${n}</option>`).join('');score.value=state[side].score;score.addEventListener('change',()=>state[side].score=Number(score.value))}
function renderOutput(){for(const row of ['#top-output','#bottom-output'])$(row).replaceChildren();state.players.forEach((p,i)=>{const card=document.createElement('div');card.className='output-player';const plate=document.createElement('div');plate.className='nameplate';plate.innerHTML=icon(p.role);const name=document.createElement('span');name.className='player-name';name.textContent=p.name||letters[i];plate.append(name);const video=makeVideo(p.video,'output-video');if(i<5)card.append(video,plate);else card.append(plate,video);$(i<5?'#top-output':'#bottom-output').append(card)});for(const side of ['left','right']){$(`#${side}-title`).textContent=state[side].name||`${side==='left'?'LEFT':'RIGHT'} TEAM`;$(`#${side}-result`).textContent=state[side].score;const logo=$(`#${side}-logo`);logo.replaceChildren();if(state[side].logo)logo.append(state[side].logo.cloneNode());else logo.textContent=side==='left'?'L':'R'}resizeStage()}
function resizeStage(){const shell=$('#stage-shell');const scale=Math.min(shell.clientWidth/1920,shell.clientHeight/1080);$('#stage').style.transform=`translate(-50%, -50%) scale(${scale})`}
new ResizeObserver(resizeStage).observe($('#stage-shell'));
let holdTimer,holdStart=null;
function cancelHold(){clearTimeout(holdTimer);holdTimer=null;holdStart=null}
function closeReturnMenu(){cancelHold();$('#return-menu').hidden=true}
function showReturnMenu(){cancelHold();if($('#output').hidden)return;$('#return-menu').hidden=false;$('#back').focus()}
const surface=$('#stage-shell');
surface.addEventListener('pointerdown',event=>{
  if(!event.isPrimary || event.button!==0){cancelHold();return}
  if(!$('#return-menu').hidden){closeReturnMenu();return}
  holdStart={x:event.clientX,y:event.clientY};
  surface.setPointerCapture(event.pointerId);
  holdTimer=setTimeout(showReturnMenu,650);
});
surface.addEventListener('pointermove',event=>{if(holdStart&&Math.hypot(event.clientX-holdStart.x,event.clientY-holdStart.y)>10)cancelHold()});
for(const type of ['pointerup','pointercancel','lostpointercapture'])surface.addEventListener(type,cancelHold);
surface.addEventListener('contextmenu',event=>event.preventDefault());
surface.addEventListener('dragstart',event=>event.preventDefault());
window.addEventListener('blur',closeReturnMenu);
document.addEventListener('visibilitychange',()=>{if(document.hidden)closeReturnMenu()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('#output').hidden){event.preventDefault();if($('#return-menu').hidden)showReturnMenu();else{closeReturnMenu();surface.focus()}}});
function route(){const output=location.hash==='#output';closeReturnMenu();document.body.classList.toggle('output-mode',output);$('#editor').hidden=output;$('#output').hidden=!output;$('#edit-tab').classList.toggle('active',!output);$('#output-tab').classList.toggle('active',output);if(output)renderOutput();else $('#stage').querySelectorAll('video').forEach(v=>v.pause());$('#editor').querySelectorAll('video').forEach(v=>{if(output)v.pause();else v.play().catch(()=>{})});window.scrollTo(0,0)}
window.addEventListener('hashchange',route);$('#generate').addEventListener('click',()=>location.hash='output');$('#back').addEventListener('click',()=>{closeReturnMenu();location.hash='edit'});
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'configure_roster_player',description:'A〜Jの選手名と登録済みの動画を変更し、現在の画面にも反映する。',inputSchema:{type:'object',properties:{slot:{type:'string',enum:[...letters]},name:{type:'string',maxLength:40},video:{enum:videoChoices.map(v=>v.id)}},required:['slot','name','video'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||!letters.includes(input.slot)||input.slot.length!==1||typeof input.name!=='string'||input.name.length>40||!videoChoices.some(v=>v.id===input.video))throw new Error('Invalid player input');const i=letters.indexOf(input.slot);if(!choicesForRole(state.players[i].role).some(v=>v.id===input.video))throw new Error('Video is not available for this role');Object.assign(state.players[i],{name:input.name,video:input.video});const card=document.querySelectorAll('.player-card')[i];card.querySelector('input').value=input.name;card.querySelector('select').value=input.video;card.querySelector('video').src=videoSrc(input.video);card.querySelector('video').setAttribute('aria-label',videoLabel(input.video));if(!$('#output').hidden)renderOutput();return {slot:input.slot,name:input.name,video:input.video}}})).catch(()=>{})}catch{}}
route();
