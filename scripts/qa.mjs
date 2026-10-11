import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from '/home/ayo/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4321')&&r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.goto('http://127.0.0.1:4321/',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.querySelectorAll('img').forEach(i=>i.loading='eager'));
 await page.locator('.project-card').last().scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>[...document.images].filter(i=>i.hasAttribute('src')).every(i=>i.complete&&i.naturalWidth>0));
 assert.equal(await page.locator('.project-card').count(),19);
 await page.getByRole('button',{name:'Desktop & Mobile',exact:true}).click();assert.equal(await page.locator('.project-card').count(),4);
 await page.getByRole('button',{name:'Web & Fullstack',exact:true}).click();assert.equal(await page.locator('.project-card').count(),9);
 await page.getByRole('button',{name:'Todos',exact:true}).click();
 for(const id of ['duelo','financeiro','audio','livraria']){
  await page.locator(`.card-link[data-project="${id}"]`).click();await page.locator('#project-dialog').waitFor({state:'visible'});assert.ok((await page.locator('#dialog-title').textContent()).length>0);
  if(id==='duelo'){await page.locator('.detail-picture').click();assert.ok(await page.locator('#image-dialog').isVisible());await page.keyboard.press('Escape');assert.ok(await page.locator('#project-dialog').isVisible());}
  await page.keyboard.press('Escape');assert.ok(!(await page.locator('#project-dialog').isVisible()));
 }
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'/tmp/portfolio-desktop.png',fullPage:false});
 for(const width of [390,320,768]){
  await page.setViewportSize({width,height:844});await page.evaluate(()=>scrollTo(0,0));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow em ${width}px`);
  if(width===390)await page.screenshot({path:'/tmp/portfolio-mobile.png',fullPage:true});
 }
 await page.setViewportSize({width:1280,height:800});await page.evaluate(()=>document.documentElement.style.fontSize='200%');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow com texto ampliado');
 const response=await page.request.get('http://127.0.0.1:4321/.env');assert.equal(response.status(),404);
 assert.deepEqual(errors,[]);
 console.log('PASS: 19 cards, filtros, detalhes, ampliação/Escape, imagens, 320/390/768/1440px, texto ampliado, sem erros JS/HTTP.');
}finally{await browser.close();}
