import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir} from 'node:fs/promises';
test.use({baseURL:'http://127.0.0.1:4174/manuscripts/'});
test.beforeEach(async({page})=>{await page.clock.install({time:new Date('2026-10-29T20:00:00Z')});});
async function load(page){await page.goto('./');await expect(page.locator('#result-count')).toHaveText('7 of 7 manuscripts with confirmed scope');}
async function a11y(page){expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);}
test('actual public artifact: uncertainty, noindex, authors filter and no tracking',async({page})=>{
  const offOrigin=[];const errors=[];
  page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4174/'))offOrigin.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
  await load(page);await expect(page.locator('#count-candidates')).toHaveText('12');await expect(page.locator('#count-drafts')).toHaveText('19');
  await expect(page.locator('#access-label')).toHaveText('Public metadata · Read only');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex, nofollow');
  await expect(page.locator('article .draft-link')).toHaveCount(0);
  await expect(page.locator('[data-id="MS-0002"]')).toContainText('Writing status needs refresh');
  await a11y(page);await mkdir('artifacts',{recursive:true});await page.screenshot({path:'artifacts/public-desktop.png',fullPage:true});
  await page.getByLabel('Person',{exact:true}).selectOption('Ali Nejat');await expect(page.locator('article')).toHaveCount(2);
  expect(offOrigin).toEqual([]);expect(errors).toEqual([]);
  expect(await page.evaluate(()=>({cookies:document.cookie,local:localStorage.length,session:sessionStorage.length}))).toEqual({cookies:'',local:0,session:0});
});
test('public candidates retain distinct identities and historical submission evidence',async({page})=>{
  await load(page);await page.getByRole('button',{name:'Pending scope 12',exact:true}).click();await expect(page.locator('article')).toHaveCount(12);
  const audit=page.locator('[data-id="MS-0007"]');await expect(audit).toContainText('Local versions need reconciliation');
  await expect(page.locator('[data-id="MS-0003"]')).toBeVisible();
  await page.getByLabel('Search manuscripts').fill('MS-0012');const card=page.locator('[data-id="MS-0012"]');await card.locator('.record-details>summary').click();
  await expect(card).toContainText('Jun 27, 2026');await expect(card).toContainText('Dec 4, 2026');await expect(card).toContainText('Agreed due date: Unconfirmed');
  await a11y(page);await page.screenshot({path:'artifacts/public-details.png',fullPage:true});
});
for(const width of [320,390])test(`public metadata ${width}px mobile has no overflow and accessible disclosures`,async({page})=>{
  await page.setViewportSize({width,height:844});await load(page);await page.screenshot({path:`artifacts/public-mobile-${width}-top.png`,fullPage:false});
  await page.locator('summary').first().click();await a11y(page);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Pending scope 12',exact:true}).click();await page.getByLabel('Search manuscripts').fill('MS-0013');
  await page.locator('.synopsis>summary').first().focus();await page.keyboard.press('Enter');await expect(page.locator('.synopsis').first()).toHaveAttribute('open','');
  await a11y(page);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`artifacts/public-mobile-${width}-details.png`,fullPage:true});
});
test('abstracts and summary are readable, searchable and distinct from unresolved content',async({page})=>{
  await load(page);await page.getByLabel('Search manuscripts').fill('saturation/stress reference');
  await expect(page.locator('article')).toHaveCount(1);const harris=page.locator('[data-id="MS-0005"]');
  await harris.getByText('Read abstract',{exact:true}).click();await expect(harris.locator('.synopsis-text')).toContainText('These estimates are not annual expected claim totals.');
  await expect(harris.locator('.synopsis-source')).toContainText('Checked Oct 29, 2026');await a11y(page);
  await page.screenshot({path:'artifacts/abstract-desktop.png',fullPage:true});
  await page.locator('#reset').click();await page.getByRole('button',{name:'Pending scope 12',exact:true}).click();
  const missing=page.locator('[data-id="MS-0007"]');await expect(missing.locator('.synopsis-unresolved')).toContainText('conflicting titles');await expect(missing.locator('.synopsis-text')).toHaveCount(0);
  await page.getByLabel('Search manuscripts').fill('MS-0015');const summary=page.locator('[data-id="MS-0015"]');
  await summary.getByText('Read source-grounded summary',{exact:true}).click();await expect(summary).toContainText('empty Abstract section');await expect(summary.locator('.synopsis-body h4')).toHaveText('Summary — written for this register');
  await a11y(page);await page.screenshot({path:'artifacts/summary-desktop.png',fullPage:true});
});
test('abstract text is never interpreted as HTML',async({page})=>{
  const data=await (await page.request.get('data/manuscripts.json')).json();data.records.find(r=>r.id==='MS-0005').abstractOrSummary.text='<img src=x onerror=alert(1)> source text';
  await page.route('**/data/manuscripts.json',r=>r.fulfill({json:data}));await load(page);
  const card=page.locator('[data-id="MS-0005"]');await card.getByText('Read abstract',{exact:true}).click();
  await expect(card.locator('.synopsis-text')).toHaveText('<img src=x onerror=alert(1)> source text');await expect(card.locator('.synopsis img')).toHaveCount(0);
});
