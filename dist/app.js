const grid = document.querySelector('#project-grid');
const dialog = document.querySelector('#project-dialog');
const imageDialog = document.querySelector('#image-dialog');
let projects = [];
const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imagePath = name => './assets/screenshots/' + encodeURIComponent(name);
function render(filter='Todos') {
 const items=projects.filter(p=>filter==='Todos'||p.category===filter);
 document.querySelector('#project-count').textContent = `${items.length} projetos`;
 grid.innerHTML=items.map(p=>`<article class="project-card"><button class="project-image" data-project="${esc(p.id)}" aria-label="Ver ${esc(p.name)}">${p.image?`<img src="${imagePath(p.image)}" alt="${esc(p.kind)} de ${esc(p.name)}" width="1440" height="960" loading="lazy"><span class="image-kind">${esc(p.kind)}</span>`:`<span class="empty-art"><strong aria-hidden="true">{ }</strong><span>Em preparação</span></span>`}</button><div class="project-meta"><span>${esc(p.category==='Web'?'WEB & FULLSTACK':p.category==='Desktop'?'DESKTOP & MOBILE':'APIS & AUTOMAÇÃO')}</span><span>${p.repo?.startsWith('glwydson')?'GLWYDSON':'AYO'}</span></div><h3><button data-project="${esc(p.id)}">${esc(p.name)}</button></h3><p>${esc(p.description)}</p><div class="tags">${p.stack.slice(0,4).map(s=>`<span class="tag">${esc(s)}</span>`).join('')}</div><button class="card-link" data-project="${esc(p.id)}">Conhecer o projeto +</button></article>`).join('');
}
function expand(image,caption){document.querySelector('#expanded-image').src=imagePath(image);document.querySelector('#expanded-image').alt=caption;document.querySelector('#expanded-caption').textContent=caption;imageDialog.showModal();}
function showProject(id) {
 const p=projects.find(p=>p.id===id);if(!p)return;
 document.querySelector('#dialog-category').textContent=p.category==='Web'?'WEB & FULLSTACK':p.category==='Desktop'?'DESKTOP & MOBILE':'APIS & AUTOMAÇÃO';
 document.querySelector('#dialog-content').innerHTML=`<h2 id="dialog-title">${esc(p.name)}</h2><p>${esc(p.description)}</p>${p.image?`<button class="detail-picture" data-expand="${esc(p.id)}" aria-label="Ampliar captura de ${esc(p.name)}"><img src="${imagePath(p.image)}" alt="${esc(p.caption)}" width="1440" height="960"></button><p class="capture-caption">${esc(p.caption)} Clique na imagem para ampliar.</p>`:`<p class="capture-caption">${esc(p.caption)}</p>`}<div class="tags">${p.stack.map(s=>`<span class="tag">${esc(s)}</span>`).join('')}</div><div class="detail-text"><div><h3>Sobre o projeto</h3><p>${esc(p.detail)}</p></div><div><h3>${p.kind==='Em preparação'?'Estado atual':'O que o projeto reúne'}</h3><ul>${p.features.map(f=>`<li>${esc(f)}</li>`).join('')}</ul></div></div><div class="detail-actions">${p.repo?`<a class="button primary" href="https://github.com/${esc(p.repo)}" target="_blank" rel="noopener noreferrer">Ver repositório no GitHub</a>`:'<p>Código não disponível publicamente.</p>'}</div>`;
 dialog.showModal();dialog.scrollTop=0;
}
document.addEventListener('click',e=>{const target=e.target.closest('[data-project]');if(target)showProject(target.dataset.project);const image=e.target.closest('[data-expand]');if(image){const p=projects.find(p=>p.id===image.dataset.expand);expand(p.image,p.caption);}});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});render(button.dataset.filter);}));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
document.querySelector('#close-image').addEventListener('click',()=>imageDialog.close());
for(const d of [dialog,imageDialog])d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});
fetch('./projects.json').then(r=>{if(!r.ok)throw Error('catálogo');return r.json();}).then(data=>{projects=data;render();}).catch(()=>{grid.innerHTML='<p>Não foi possível carregar a galeria. Recarregue a página ou conheça os projetos no <a href="https://github.com/glwydson">GitHub glwydson</a> e <a href="https://github.com/atrzad">GitHub Ayo</a>.</p>';});
