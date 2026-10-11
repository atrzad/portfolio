// Capture actual project screens. Read-only preview servers, isolated data and browser sessions.
import { chromium } from '/home/ayo/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
const base='/home/ayo/Projects';
const out=path.join(base,'portfolio/dist/assets/screenshots');
process.env.DATA_DIR='/tmp/portfolio-capture-data';
const servers=[]; const children=[];
const enhanced=process.argv.includes('--enhanced');
async function serve(port, root, entry) {
 const server=http.createServer(async(req,res)=>{
  try {let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=path.join(root,p);
   if(p==='/'&&entry){res.setHeader('Content-Type','text/html');res.end(typeof entry==='function'?entry():await fs.readFile(entry));return;}
   try{if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');}catch{file=path.join(root,'index.html');}
   const types={'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.woff2':'font/woff2'};
   res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(await fs.readFile(file));
  }catch{res.writeHead(404);res.end('');}
 });await new Promise(r=>server.listen(port,'127.0.0.1',r));servers.push(server);
}
let browser;
try {
 await serve(4391,path.join(base,'duelo-de-termos/apps/web/dist'));
 await serve(4392,path.join(base,'Sistema-Financeiro/web/dist'));
 await serve(4393,path.join(base,'Sistema-de-controle/frontend/dist'));
 const std=await import(path.join(base,'ayo-std/server/paginas.js'));
 const sketch=await import(path.join(base,'ayo-sketchbook/server/paginas.js'));
 await serve(4394,path.join(base,'ayo-std/public'),()=>std.paginaEntrar({}));
 await serve(4395,path.join(base,'ayo-sketchbook/public'),()=>sketch.paginaEntrar({ayoStd:'http://localhost:4394'}));
 await serve(4396,path.join(base,'Contador de dias/public'),path.join(base,'Contador de dias/views/login.html'));
 children.push(spawn(process.execPath,[path.join(base,'Rest-System/frontend/node_modules/vite/bin/vite.js'),'--host','127.0.0.1','--port','4397','--strictPort'],{cwd:path.join(base,'Rest-System/frontend'),stdio:'ignore'}));
 browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:960},deviceScaleFactor:1,colorScheme:'dark'});
 const page=await context.newPage();
 for(const [id,port,urlPath] of (enhanced?[]:[['duelo',4391,'/'],['financeiro',4392,'/'],['controle',4393,'/'],['std',4394,'/'],['sketchbook',4395,'/'],['nossos',4396,'/'],['rest',4397,'/']])){
  await page.goto(`http://127.0.0.1:${port}${urlPath}`,{waitUntil:'networkidle'});
  await page.screenshot({path:path.join(out,id+'.png')});
  console.log(id,await page.title());
 }
 if(enhanced){
  await page.goto('http://127.0.0.1:4391/jogo',{waitUntil:'networkidle'});
  for(const word of ['TERMO','CASAS','LIVRO']){await page.keyboard.type(word);await page.keyboard.press('Enter');await page.waitForTimeout(200);}
  await page.screenshot({path:path.join(out,'duelo.png')});
  await page.emulateMedia({colorScheme:'light'});
  await page.addInitScript(()=>{localStorage.setItem('rest-system:auth',JSON.stringify({nome:'Cozinha · Demonstração',role:'cozinha',token:'demo'}));localStorage.setItem('usuario',JSON.stringify({nome:'Demonstração',email:'demo@example.test',perfil:'Admin'}));localStorage.setItem('token','demo');});
  await page.route('**/pedidos?**',route=>{const status=new URL(route.request().url()).searchParams.get('status_filtro');const items=['Tambaqui assado','Arroz e salada','Suco de cupuaçu'];route.fulfill({json:[1,2].map((n)=>({id:status+n,mesa_numero:status==='recebido'?n:status==='em_preparo'?n+2:n+4,status,itens:[{id:n,quantidade:n,produto_nome:items[n-1],observacao:''}]}))});});
  await page.route('**/health',r=>r.fulfill({json:{status:'ok'}}));
  await page.goto('http://127.0.0.1:4397/cozinha/kds',{waitUntil:'networkidle'});
  await page.screenshot({path:path.join(out,'rest.png')});
  await page.route('**/api/v1/relatorios/**',r=>r.fulfill({json:['Ana (exemplo)','Bruno (exemplo)','Clara (exemplo)','Daniel (exemplo)'].map((name,i)=>({professorId:i,professorNome:name,totalAulas:20,totalPresencas:20-i,totalAusencias:i,totalAusenciasJustificadas:i?1:0,percentualPresenca:100-i*5}))}));
  await page.goto('http://127.0.0.1:4393/',{waitUntil:'networkidle'});
  await page.screenshot({path:path.join(out,'controle.png')});
  await serve(4398,path.join(base,'agent-sandbox/status-server/public'));
  await page.route('**/status.json',r=>r.fulfill({json:{updatedAt:'Demonstração',panes:[{label:'Agente 1 · Revisão',text:'Analisando a estrutura do projeto…\nArquivos organizados para revisão.'},{label:'Agente 2 · Validação',text:'Ambiente de demonstração\nNenhuma sessão pessoal conectada.'}]}}));
  await page.route('http://127.0.0.1:7681/**',r=>r.fulfill({contentType:'text/html',body:'<body style="background:#111;color:#ddd;font:18px monospace;padding:30px"><p>$ Ambiente de demonstração</p><p>Terminal aguardando conexão.</p></body>'}));
  await page.goto('http://127.0.0.1:4398/',{waitUntil:'networkidle'});
  await page.screenshot({path:path.join(out,'agent.png')});
  try{await page.goto('https://glwydson.github.io/landind-mvp/',{waitUntil:'networkidle',timeout:20000});console.log('Landing live:',await page.title());if(!(await page.title()).includes('404'))await page.screenshot({path:path.join(out,'landing-live.png')});}catch{}
  console.log('Enhanced screenshots captured');
 }
 const data=JSON.parse(await fs.readFile(path.join(base,'portfolio/dist/projects.json')));
 for(const p of data.filter(p=>!enhanced&&p.kind==='Documentação'&&p.id!=='kanban')){
  try {
   await page.goto('https://github.com/'+p.repo,{waitUntil:'domcontentloaded',timeout:45000});
   const article=page.locator('article.markdown-body').first();
   if(await article.count())await article.scrollIntoViewIfNeeded();
   await page.waitForTimeout(800);
   await page.screenshot({path:path.join(out,p.id+'.png')});console.log(p.id,await page.title());
  }catch(e){console.log('FAILED',p.id,e.message);}
 }
}finally{await browser?.close();for(const s of servers)s.close();for(const c of children)c.kill();}
