import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,mkdir,stat,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {siteAssets} from '../scripts/assets.mjs';
const demo=JSON.parse(await readFile(new URL('../data/manuscripts.json',import.meta.url),'utf8'));
test('build gate rejects confidential default/in-repository output and permits isolated local output',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'manuscript-build-test-'));
  try {
    const data=structuredClone(demo);data.dataClass='confidential';data.records.forEach(r=>r.id=r.id.replace('DEMO','MS'));
    const input=join(dir,'fixture.json');await writeFile(input,JSON.stringify(data),{mode:0o600});
    const run=(...args)=>spawnSync(process.execPath,['scripts/build.mjs','--data',input,...args],{cwd:resolve('.'),encoding:'utf8'});
    assert.equal(run().status,1);
    assert.match(run('--private-local','--out','dist/private-test').stderr,/outside the source repository/);
    const output=join(dir,'preview');const ok=run('--private-local','--out',output);assert.equal(ok.status,0,ok.stderr);
    assert.equal((await stat(join(output,'data/manuscripts.json'))).mode&0o777,0o600);
    assert.equal(JSON.parse(await readFile(join(output,'.build.json'),'utf8')).localOnly,true);
    await mkdir(join(dir,'occupied'));await writeFile(join(dir,'occupied','other.txt'),'Existing content');
    assert.match(run('--private-local','--out',join(dir,'occupied')).stderr,/empty directory/);
  } finally {await rm(dir,{recursive:true,force:true});}
});
test('the default data is synthetic, uses placeholder links, and the shipping manifest is exact',()=>{
  assert.equal(demo.dataClass,'synthetic_demo');
  assert.ok(demo.records.every(r=>r.id.startsWith('DEMO-')));
  assert.deepEqual(siteAssets,['index.html','styles.css','app.mjs','cecreh-logo.png','cecreh-favicon-red-a473da1c.png','lib/records.mjs','lib/schema-validator.mjs','data/manuscripts.json','THIRD_PARTY_NOTICES.txt','.nojekyll']);
});
test('header and cache-safe favicon retain the exact official CECREH artwork',async()=>{
  const expected='a473da1cfcdef681f28b9228d47d07ce1db7a960cf8f2e9a949f0bdd732e4d8a';
  for(const name of ['cecreh-logo.png','cecreh-favicon-red-a473da1c.png']) {
    const bytes=await readFile(name);assert.equal(createHash('sha256').update(bytes).digest('hex'),expected);
    assert.deepEqual([...bytes.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  }
  const html=await readFile('index.html','utf8');
  assert.match(html,/<img class="brand-logo" src="\.\/cecreh-logo\.png" width="130" height="108" alt="Official CECREH logo">/);
  assert.match(html,/<link rel="icon" href="\.\/cecreh-favicon-red-a473da1c\.png" type="image\/png">/);
  assert.ok(!html.includes('favicon.svg')&&!html.includes('brand-mark'));
});
