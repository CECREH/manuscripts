import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateData,freshness,attentionReasons,selectRecords,validDate,safeUrl} from '../lib/records.mjs';
const demo=JSON.parse(await readFile(new URL('../data/manuscripts.json',import.meta.url),'utf8'));
const clone=()=>structuredClone(demo);
const validate=data=>validateData(data,{today:'2026-10-26'});
const filters={query:'',group:'active',stage:'all',journal:'all',person:'all',attention:false,sort:'title'};
test('synthetic demo and an empty inventory pass the same schema',()=>{
  assert.deepEqual(validate(demo),[]);const data=clone();data.records=[];assert.deepEqual(validate(data),[]);
});
test('duplicate IDs, extra fields, and malformed required values are rejected',()=>{
  const data=clone();data.records.push(structuredClone(data.records[0]));assert.match(validate(data).join(),/duplicate manuscript IDs/);
  const unknown=clone();unknown.records[0].guessedAuthorOrder=['A'];assert.match(validate(unknown).join(),/additional properties/);
  const missing=clone();delete missing.records[0].journal;assert.match(validate(missing).join(),/required/);
});
test('calendar dates, future evidence, URLs and demo isolation are enforced',()=>{
  assert.equal(validDate('2026-02-30'),false);assert.equal(validDate('2024-02-29'),true);
  for(const url of ['javascript:alert(1)','http://example.org','https://name:password@example.org','//example.org']) assert.equal(safeUrl(url),false);
  const data=clone();data.records[0].confirmation.sourceCheckedOn='2026-02-30';assert.match(validate(data).join(),/invalid calendar/);
  const future=clone();future.records[0].writing.confirmedOn='2026-10-27';assert.match(validate(future).join(),/postdate/);
  const sensitive=clone();sensitive.records[0].currentDraft.url='https://university.example/private';assert.match(validate(sensitive).join(),/example.org/);
});
test('unknown and confirmed scope/drafts cannot be mixed',()=>{
  const data=clone();data.records[0].scope.confirmedOn=null;assert.ok(validate(data).length);
  const draft=clone();draft.records[0].currentDraft.url=null;assert.match(validate(draft).join(),/confirmed draft/);
  const candidate=clone();candidate.records[4].scope.confirmedOn='2026-10-23';candidate.records[4].scope.confirmedBy='Example maintainer';assert.match(validate(candidate).join(),/candidate scope cannot/);
});
test('proposed dates never become overdue and agreements need an owner',()=>{
  assert.ok(!attentionReasons(demo.records[1],30,'2026-10-26').includes('Agreed action overdue'));
  assert.ok(attentionReasons(demo.records[3],30,'2026-10-26').includes('Agreed action overdue'));
  const data=clone();data.records[0].nextAction.owner=null;assert.match(validate(data).join(),/agreed deadline requires owner/);
  const unknown=clone();unknown.records[0].nextAction.dueStatus='unconfirmed';assert.ok(validate(unknown).length);
});
test('record entry dates cannot mask a stale or unknown source',()=>{
  assert.equal(freshness('2026-09-26',30,'2026-10-26'),'current');
  assert.equal(freshness('2026-09-25',30,'2026-10-26'),'stale');
  assert.equal(freshness(null,30,'2026-10-26'),'unconfirmed');
  assert.ok(attentionReasons(demo.records[2],30,'2026-10-26').includes('Source confirmation stale'));
  assert.ok(attentionReasons(demo.records[4],30,'2026-10-26').includes('Source not confirmed'));
});
test('candidate and archive isolation, combined filters, search, and due ordering',()=>{
  const select=f=>selectRecords(demo.records,{...filters,...f},30,'2026-10-26');
  assert.equal(select({}).length,4);assert.equal(select({group:'candidates'}).length,1);assert.equal(select({group:'archived'}).length,1);
  assert.equal(select({query:'EXAMPLE RESEARCHER B',stage:'coauthor_review'}).length,1);
  assert.equal(select({journal:'revision_requested',attention:true})[0].id,'DEMO-0004');
  assert.deepEqual(select({sort:'due'}).slice(0,2).map(r=>r.id),['DEMO-0004','DEMO-0001']);
  assert.equal(select({query:'no match'}).length,0);
});
test('history and stable IDs cannot silently disappear or change',()=>{
  const data=clone();data.records[0].history.linkChanges.shift();assert.match(validateData(data,{today:'2026-10-26',previous:demo}).join(),/append-only/);
  const removed=clone();removed.records.pop();assert.match(validateData(removed,{today:'2026-10-26',previous:demo}).join(),/archive it/);
  const changed=clone();changed.records[3].history.submissions[0].note='Rewritten';assert.match(validateData(changed,{today:'2026-10-26',previous:demo}).join(),/append-only/);
  const next=clone();next.records[0].currentDraft.url='https://example.org/demo/new';next.records[0].history.linkChanges.push({eventId:'L-new',recordedOn:'2026-10-26',url:'https://example.org/demo/new',versionLabel:'New demo draft',reason:'New canonical version.'});assert.deepEqual(validateData(next,{today:'2026-10-26',previous:demo}),[]);
});
test('link removal requires a dated history event and preserves old URLs',()=>{
  const data=clone();const r=data.records[0];r.currentDraft.url=null;r.currentDraft.status='unavailable';r.currentDraft.confirmedOn=null;r.currentDraft.confirmedBy=null;
  assert.match(validateData(data,{today:'2026-10-26',previous:demo}).join(),/clearing the canonical link/);
  r.history.linkChanges.push({eventId:'L-clear',recordedOn:'2026-10-26',url:null,versionLabel:null,reason:'Previous URL no longer available; retain it only in history.'});
  assert.deepEqual(validateData(data,{today:'2026-10-26',previous:demo}),[]);
});
