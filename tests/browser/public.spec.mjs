import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir} from 'node:fs/promises';
test.use({baseURL:'http://127.0.0.1:4174/manuscripts/'});
test.beforeEach(async({page})=>{await page.clock.install({time:new Date('2026-10-29T20:00:00Z')});});
async function load(page){await page.goto('./');await expect(page.locator('#result-count')).toHaveText('18 of 18 manuscripts');}
async function a11y(page){expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);}
test('release-versioned assets avoid stale module and schema cache entries',async({page})=>{
  const requested=[];page.on('request',r=>requested.push(r.url()));
  await page.route('**/*.mjs',r=>r.fulfill({contentType:'text/javascript',body:'throw new Error("Stale unversioned module was used");'}));
  await load(page);
  for(const asset of ['app.mjs','lib/records.mjs','lib/schema-validator.mjs','data/manuscripts.json','styles.css']) {
    expect(requested.some(url=>new URL(url).pathname.endsWith('/'+asset)&&/^[0-9a-f]{16}$/.test(new URL(url).searchParams.get('v')||''))).toBe(true);
  }
});
test('actual public artifact: uncertainty, noindex, authors filter and no tracking',async({page})=>{
  const offOrigin=[];const errors=[];
  page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4174/'))offOrigin.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
  await load(page);await expect(page.locator('#count-manuscripts')).toHaveText('18');await expect(page.locator('#count-linked')).toHaveText('18');await expect(page.locator('#count-drafts')).toHaveText('18');
  await expect(page.locator('#access-label')).toHaveText('Public metadata · Read only');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex, nofollow');
  await expect(page.locator('article .uploaded-copy')).toHaveCount(18);
  await expect(page.locator('[data-id="MS-0002"]')).toContainText('Writing status needs refresh');
  await a11y(page);await mkdir('artifacts',{recursive:true});await page.screenshot({path:'artifacts/public-desktop.png',fullPage:true});
  await page.getByLabel('Person',{exact:true}).selectOption('Ali Nejat');await expect(page.locator('article')).toHaveCount(6);
  expect(offOrigin).toEqual([]);expect(errors).toEqual([]);
  expect(await page.evaluate(()=>({cookies:document.cookie,local:localStorage.length,session:sessionStorage.length}))).toEqual({cookies:'',local:0,session:0});
});
test('one public list retains distinct identities and historical submission evidence',async({page})=>{
  await load(page);await expect(page.locator('article')).toHaveCount(18);await expect(page.locator('[data-group]')).toHaveCount(0);
  const audit=page.locator('[data-id="MS-0007"]');await expect(audit).toContainText('Local versions need reconciliation');
  await expect(page.locator('[data-id="MS-0003"]')).toHaveCount(0);
  await page.getByLabel('Search manuscripts').fill('MS-0012');const card=page.locator('[data-id="MS-0012"]');await card.locator('.record-details>summary').click();
  await expect(card).toContainText('Jun 27, 2026');await expect(card).toContainText('Dec 4, 2026');await expect(card).toContainText('Agreed due date: Unconfirmed');
  await a11y(page);await page.screenshot({path:'artifacts/public-details.png',fullPage:true});
});
for(const width of [320,390])test(`public metadata ${width}px mobile has no overflow and accessible disclosures`,async({page})=>{
  await page.setViewportSize({width,height:844});await load(page);await page.screenshot({path:`artifacts/public-mobile-${width}-top.png`,fullPage:false});
  await page.locator('.record-details>summary').first().click();await a11y(page);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByLabel('Search manuscripts').fill('MS-0007');
  await page.locator('.synopsis>summary').first().focus();await page.keyboard.press('Enter');await expect(page.locator('.synopsis').first()).toHaveAttribute('open','');
  await a11y(page);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`artifacts/ms0007-word-mobile-${width}.png`,fullPage:true});
});
test('abstracts and summary are readable and searchable with selected-version provenance',async({page})=>{
  await load(page);await page.getByLabel('Search manuscripts').fill('saturation/stress reference');
  await expect(page.locator('article')).toHaveCount(1);const harris=page.locator('[data-id="MS-0005"]');
  await harris.getByText('Read abstract',{exact:true}).click();await expect(harris.locator('.synopsis-text')).toContainText('These estimates are not annual expected claim totals.');
  await expect(harris.locator('.synopsis-source')).toContainText('Checked Oct 29, 2026');await a11y(page);
  await page.screenshot({path:'artifacts/abstract-desktop.png',fullPage:true});
  await page.locator('#reset').click();
  await page.getByLabel('Search manuscripts').fill('MS-0007');const audit=page.locator('[data-id="MS-0007"]');
  await audit.getByText('Read abstract',{exact:true}).click();await expect(audit.locator('.synopsis-text')).toContainText('capacity-timeliness coefficient is not stably identified');
  await expect(audit.locator('.synopsis-source')).toContainText('Selected Word render · Apr 16, 2026');
  await expect(audit.locator('.synopsis-source')).toContainText('current OneDrive version and relationship to MS-0003 remain unconfirmed');
  await expect(audit.locator('.synopsis-unresolved')).toHaveCount(0);await expect(audit).toContainText('Current version unconfirmed');
  await a11y(page);await page.screenshot({path:'artifacts/ms0007-word-desktop.png',fullPage:true});
  await page.getByLabel('Search manuscripts').fill('MS-0015');const summary=page.locator('[data-id="MS-0015"]');
  await summary.getByText('Read source-grounded summary',{exact:true}).click();await expect(summary).toContainText('empty Abstract section');await expect(summary.locator('.synopsis-body h4')).toHaveText('Summary — written for this register');
  await a11y(page);await page.screenshot({path:'artifacts/summary-desktop.png',fullPage:true});
});
test('unverified source descriptions stay visibly unresolved without invented text',async({page})=>{
  const data=await (await page.request.get('data/manuscripts.json')).json();
  data.records.find(r=>r.id==='MS-0007').abstractOrSummary={kind:'unresolved',text:null,abstractPresence:'unverified',sourceLabel:'Source not yet verified',sourceVersionLabel:null,sourceCheckedOn:null,note:'Confirm the source before adding text.'};
  await page.route('**/data/manuscripts.json*',r=>r.fulfill({json:data}));await load(page);
  await page.getByLabel('Search manuscripts').fill('MS-0007');
  const unresolved=page.locator('[data-id="MS-0007"]');await expect(unresolved.locator('.synopsis-unresolved')).toContainText('Confirm the source before adding text.');
  await expect(unresolved.locator('.synopsis-text')).toHaveCount(0);
});
test('abstract text is never interpreted as HTML',async({page})=>{
  const data=await (await page.request.get('data/manuscripts.json')).json();data.records.find(r=>r.id==='MS-0005').abstractOrSummary.text='<img src=x onerror=alert(1)> source text';
  await page.route('**/data/manuscripts.json*',r=>r.fulfill({json:data}));await load(page);
  const card=page.locator('[data-id="MS-0005"]');await card.getByText('Read abstract',{exact:true}).click();
  await expect(card.locator('.synopsis-text')).toHaveText('<img src=x onerror=alert(1)> source text');await expect(card.locator('.synopsis img')).toHaveCount(0);
});
test('eighteen uploaded-copy links remain distinct, version-cautious and private by existing OneDrive access',async({page})=>{
  const outside=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4174/'))outside.push(r.url());});
  await load(page);const urls=[];
    for(const card of await page.locator('article').all()) {
      const link=card.locator('.uploaded-copy');await expect(link).toContainText('Open uploaded copy');
      await expect(link).toHaveAttribute('rel','noopener noreferrer');await expect(link).toHaveAttribute('referrerpolicy','no-referrer');
      await expect(link).toHaveAttribute('target','_blank');await expect(card).toContainText('Current version unconfirmed');
      await expect(card).toContainText('OneDrive sign-in and existing access required.');urls.push(await link.getAttribute('href'));
    }
  expect(new Set(urls).size).toBe(18);expect(outside).toEqual([]);
  await page.getByLabel('Search manuscripts').fill('MS-0007');
  const selected=page.locator('[data-id="MS-0007"] .uploaded-copy');
  await selected.focus();await expect(selected).toBeFocused();
  await a11y(page);await page.screenshot({path:'artifacts/onedrive-copy-desktop.png',fullPage:true});
});
for(const width of [1440,760,380,320])test(`official red brand and favicon render accessibly at ${width}px`,async({page,request})=>{
  await page.setViewportSize({width,height:1000});await load(page);
  const logo=page.getByRole('img',{name:'Official CECREH logo',exact:true});await expect(logo).toBeVisible();
  expect(await logo.evaluate(img=>img.complete&&img.naturalWidth>0&&img.naturalHeight>0)).toBe(true);
  await expect(logo).toHaveCSS('width',width>760?'130px':'85px');
  await expect(page.locator('body')).toHaveCSS('background-color','rgb(245, 245, 247)');
  await expect(page.locator('.brand')).toHaveCSS('color','rgb(17, 17, 17)');
  await expect(page.locator('.eyebrow').first()).toHaveCSS('color','rgb(207, 7, 2)');
  await expect(page.locator('#search')).toHaveCSS('border-top-color','rgb(117, 117, 117)');
  await page.locator('.brand').focus();await expect(page.locator('.brand')).toHaveCSS('outline-color','rgb(233, 8, 2)');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href','./cecreh-favicon-red-a473da1c.png');
  for(const name of ['cecreh-logo.png','cecreh-favicon-red-a473da1c.png']) {const response=await request.get(name);expect(response.status()).toBe(200);expect(response.headers()['content-type']).toBe('image/png');}
  expect((await request.get('favicon.svg')).status()).toBe(404);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await a11y(page);
  await page.locator('.brand').evaluate(el=>el.blur());
  await page.screenshot({path:`artifacts/official-brand-${width}.png`,fullPage:false});
});
