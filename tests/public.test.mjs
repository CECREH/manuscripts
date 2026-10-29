import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {validateData,selectRecords,attentionReasons} from '../lib/records.mjs';
const data=JSON.parse(await readFile(new URL('../data/public-manuscripts.json',import.meta.url),'utf8'));
test('public inventory preserves uncertainty, historical evidence and distinct manuscript identities',()=>{
  assert.deepEqual(validateData(data),[]);
  assert.equal(data.records.length,19);
  assert.equal(data.records.filter(r=>r.scope.status==='confirmed').length,7);
  assert.ok(data.records.every(r=>r.currentDraft.url===null&&r.currentDraft.status==='unconfirmed'));
  assert.ok(data.records.every(r=>r.nextAction.dueDate===null&&r.lead===null&&r.steward===null));
  assert.equal(data.records.find(r=>r.id==='MS-0007').localVersion.authority,'conflict');
  assert.equal(data.records.find(r=>r.id==='MS-0007').scope.status,'candidate');
  assert.equal(data.records.find(r=>r.id==='MS-0012').history.submissions.length,2);
  assert.ok(attentionReasons(data.records.find(r=>r.id==='MS-0002'),30,'2026-10-29').includes('Writing status needs refresh'));
  const selected=selectRecords(data.records,{query:'',group:'active',stage:'all',journal:'all',person:'Ali Nejat',attention:false,sort:'title'},30);
  assert.ok(selected.length>0&&selected.every(r=>r.authors.names.includes('Ali Nejat')));
});
test('public gate rejects private paths, email addresses and unreviewed draft links',()=>{
  for(const text of ['/Volumes/research/private.docx','/Users/researcher/private','file:///tmp/draft','private@example.com']) {
    const changed=structuredClone(data);changed.records[0].confirmation.note=text;
    assert.ok(validateData(changed).some(e=>/local paths or email/.test(e)));
  }
  const changed=structuredClone(data);changed.records[0].currentDraft.url='https://example.org/draft';
  assert.ok(validateData(changed).some(e=>/every public link requires/.test(e)));
  assert.ok(validateData(changed).some(e=>/version-confirmed/.test(e)));
});
test('public release requires explicit build intent and excludes manuscript/source evidence files',async()=>{
  const refused=spawnSync(process.execPath,['scripts/build.mjs','--data','data/public-manuscripts.json'],{encoding:'utf8'});
  assert.equal(refused.status,1);assert.match(refused.stderr,/explicit --public/);
  const built=spawnSync(process.execPath,['scripts/build.mjs','--public'],{encoding:'utf8'});
  assert.equal(built.status,0,built.stderr);
  assert.equal(JSON.parse(await readFile('dist/public/data/manuscripts.json','utf8')).dataClass,'public_metadata');
  const files=await readdir('dist/public',{recursive:true});
  assert.ok(files.every(f=>!/(?:\.docx|\.pdf|\.qmd|private|source-receipts|README)/i.test(f)));
  const html=await readFile('dist/public/index.html','utf8');
  assert.match(html,/<meta name="robots" content="noindex, nofollow">/);
  assert.ok(!/https?:\/\//.test(html),'HTML navigation stays inside the tracker');
});
