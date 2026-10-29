import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile,mkdir} from 'node:fs/promises';
const demo=JSON.parse(await readFile(new URL('../../data/manuscripts.json',import.meta.url),'utf8'));
test.beforeEach(async({page})=>{await page.clock.install({time:new Date('2026-10-26T20:00:00Z')});});
async function load(page) {await page.goto('./');await expect(page.locator('#result-count')).toHaveText('6 of 6 manuscripts');}
async function a11y(page) {const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(results.violations).toEqual([]);}
async function screenshot(page,path,fullPage=true) {
  await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});
  await page.screenshot({path,fullPage,animations:'disabled'});
}
test('desktop overview, distinct states, details/history, and accessible controls',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await load(page);
  await expect(page.locator('#count-manuscripts')).toHaveText('6');await expect(page.locator('[data-group]')).toHaveCount(0);
  await expect(page.getByText('Demonstration — fictional records only')).toBeVisible();
  const card=page.locator('[data-id="DEMO-0001"]');await card.locator('summary').click();
  await expect(card.getByText('Draft link history')).toBeVisible();await expect(card.getByText('Working draft · v2 · demo')).toBeVisible();
  await expect(page.locator('[data-id="DEMO-0002"]')).not.toContainText('Overdue');
  await expect(page.locator('[data-id="DEMO-0004"]')).toContainText('Agreed action overdue');
  await a11y(page);expect(errors).toEqual([]);
  await mkdir('artifacts',{recursive:true});await screenshot(page,'artifacts/desktop-details.png');
  await card.locator('summary').click();await screenshot(page,'artifacts/desktop-overview.png');
});
test('search, writing/journal/person filters, sorting, and no-match reset',async({page})=>{
  await load(page);await page.getByLabel('Writing stage',{exact:true}).selectOption('journal_revision');
  await page.getByLabel('Journal status',{exact:true}).selectOption('revision_requested');await page.getByLabel('Person',{exact:true}).selectOption('Example researcher A');
  await expect(page.locator('article')).toHaveCount(1);await page.getByLabel('Search manuscripts').fill('nothing matches');
  await expect(page.getByRole('heading',{name:'No matching manuscripts'})).toBeVisible();await a11y(page);
  await page.locator('#empty-reset').click();await expect(page.locator('article')).toHaveCount(6);await expect(page.getByLabel('Search manuscripts')).toBeFocused();
  await page.getByLabel('Sort',{exact:true}).selectOption('due');await expect(page.locator('article').first()).toHaveAttribute('data-id','DEMO-0004');
  await page.getByLabel('Needs attention only').check();await expect(page.locator('article')).toHaveCount(4);
});
test('one list includes every retained paper regardless of historical scope, with archive history intact',async({page})=>{
  await load(page);await expect(page.locator('[data-id="DEMO-0005"]')).toBeVisible();
  await expect(page.locator('[data-id="DEMO-0006"]')).toContainText('Archived');
  await expect(page.locator('[data-group]')).toHaveCount(0);await expect(page.getByText('Pending scope',{exact:true})).toHaveCount(0);await a11y(page);
});
for(const width of [390,320]) test(`mobile ${width}px reflows, remains usable, and passes accessibility scan`,async({page})=>{
  await page.setViewportSize({width,height:844});await load(page);
  await expect(page.locator('.manuscript').first()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await screenshot(page,`artifacts/mobile-${width}-top.png`,false);
  await page.locator('summary').first().click();await a11y(page);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await screenshot(page,`artifacts/mobile-${width}.png`);
});
test('keyboard skip link, disclosure, reset, and focus work without a mouse',async({page})=>{
  await load(page);await page.keyboard.press('Tab');await expect(page.locator('.skip-link')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#register')).toBeFocused();
  await page.locator('summary').first().focus();await page.keyboard.press('Enter');await expect(page.locator('details').first()).toHaveAttribute('open','');
  await page.keyboard.press('Space');await expect(page.locator('details').first()).not.toHaveAttribute('open','');
  await page.getByLabel('Search manuscripts').fill('none');await page.locator('#empty-reset').focus();await page.keyboard.press('Enter');await expect(page.getByLabel('Search manuscripts')).toBeFocused();
});
test('empty inventory is explicit and accessible',async({page})=>{
  await page.route('**/data/manuscripts.json*',r=>r.fulfill({json:{...demo,records:[]}}));await page.goto('./');
  await expect(page.getByRole('heading',{name:'No manuscripts listed yet'})).toBeVisible();await expect(page.locator('#count-manuscripts')).toHaveText('0');await a11y(page);
});
test('a stalled data request times out into the retry state',async({page})=>{
  await page.route('**/data/manuscripts.json*',()=>{});
  await page.goto('./');await page.clock.fastForward(11000);
  await expect(page.getByRole('heading',{name:'The register could not load'})).toBeVisible();
  await expect(page.locator('article')).toHaveCount(0);
});
test('unconfirmed draft links are labeled, protected from referrer leakage, and not prefetched',async({page})=>{
  const data=structuredClone(demo);data.dataClass='confidential';data.records.forEach(r=>r.id=r.id.replace('DEMO','MS'));
  data.records[0].currentDraft.status='unconfirmed';data.records[0].currentDraft.confirmedOn=null;data.records[0].currentDraft.confirmedBy=null;
  const outside=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4173/')) outside.push(r.url());});
  await page.route('**/data/manuscripts.json*',r=>r.fulfill({json:data}));await load(page);
  const link=page.locator('[data-id="MS-0001"] .draft-link');await expect(link).toContainText('Last-known draft');
  await expect(link).toHaveAttribute('rel','noopener noreferrer');await expect(link).toHaveAttribute('referrerpolicy','no-referrer');
  await expect(page.locator('[data-id="MS-0001"]')).toContainText('Current version unconfirmed');expect(outside).toEqual([]);
});
test('a paper without an old scope confirmation appears directly in the single list',async({page})=>{
  await page.route('**/data/manuscripts.json*',r=>r.fulfill({json:{...demo,records:[demo.records[4]]}}));await page.goto('./');
  await expect(page.locator('#count-manuscripts')).toHaveText('1');await expect(page.locator('article')).toHaveCount(1);
});
for(const kind of ['http','json','schema']) test(`data ${kind} failure shows an accessible retry state`,async({page})=>{
  let broken=true;await page.route('**/data/manuscripts.json*',r=>broken ? r.fulfill(kind==='http'?{status:503,body:'Unavailable'}:kind==='json'?{contentType:'application/json',body:'{broken'}:{json:{schemaVersion:1}}):r.fulfill({json:demo}));
  await page.goto('./');await expect(page.getByRole('heading',{name:'The register could not load'})).toBeVisible();await expect(page.locator('article')).toHaveCount(0);await a11y(page);
  broken=false;await page.getByRole('button',{name:'Try again'}).click();await expect(page.locator('article')).toHaveCount(6);await expect(page.locator('#search')).toBeFocused();
});
test('untrusted text is text, links are not prefetched, and no tracking/storage is used',async({page})=>{
  const data=structuredClone(demo);data.records[0].title='<img src=x onerror=alert(1)> & manuscript';
  const offOrigin=[];page.on('request',req=>{if(!req.url().startsWith('http://127.0.0.1:4173/'))offOrigin.push(req.url());});
  await page.route('**/data/manuscripts.json*',r=>r.fulfill({json:data}));await load(page);
  await expect(page.locator('[data-id="DEMO-0001"] h3')).toHaveText(data.records[0].title);
  await expect(page.locator('article img')).toHaveCount(0);expect(offOrigin).toEqual([]);
  expect(await page.evaluate(()=>({cookies:document.cookie,local:localStorage.length,session:sessionStorage.length}))).toEqual({cookies:'',local:0,session:0});
});
test('preview only serves shipped assets, including at project subpaths',async({request})=>{
  for(const path of ['.build.json','../private-data/manuscripts.json','package.json','docs/HOSTING.md','schema/manuscripts.schema.json']) expect((await request.get(path)).status()).toBe(404);
  for(const path of ['index.html','data/manuscripts.json','app.mjs','styles.css']) {const response=await request.get(path);expect(response.status()).toBe(200);expect(response.headers()['cache-control']).toBe('no-store');}
});
