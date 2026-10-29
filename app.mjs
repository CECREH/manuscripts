import {validateData, writingLabels, journalLabels, freshness, attentionReasons, selectRecords, todayUTC, safeUrl} from './lib/records.mjs';

const $ = id => document.getElementById(id);
const baseFilters = {query:'',group:'all',stage:'all',journal:'all',person:'all',attention:false,sort:'title'};
let filters = {...baseFilters};
let data = null;
const expanded = new Set();
const descriptionsExpanded = new Set();
const dateFormat = new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
const formatDate = date => date ? dateFormat.format(new Date(date+'T00:00:00Z')) : 'Unconfirmed';
const node = (tag, className='', text='') => {
  const element = document.createElement(tag);
  if (className) element.className=className;
  if (text !== '') element.textContent=text;
  return element;
};
const add = (parent,...children) => {parent.append(...children);return parent;};
const paragraph = (text,className='') => node('p',className,text);
const badge = (text,className='') => node('span',`badge ${className}`,text);
function link(url,label,className='') {
  if (!safeUrl(url)) return node('span',className,'Link unavailable');
  if (data.dataClass==='synthetic_demo') {
    const demo = node(className.includes('draft-link') ? 'button' : 'span',className+' demo-link',label+' · demo');
    if (demo.tagName==='BUTTON') {demo.type='button';demo.disabled=true;}
    demo.title='Synthetic example. No manuscript is linked.';
    return demo;
  }
  const a=node('a',className,label+' ↗');
  a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.referrerPolicy='no-referrer';
  a.setAttribute('aria-label',label+' (opens in a new tab)');
  return a;
}
function termList(pairs) {
  const dl=node('dl');
  for (const [term,value] of pairs) add(dl,node('dt','',term),node('dd','',value||'Unconfirmed'));
  return dl;
}
function section(title,...children) {return add(node('section'),node('h4','',title),...children);}
function renderDescription(r) {
  const description=r.abstractOrSummary;
  if(!description||description.kind==='unresolved') {
    return add(node('aside','synopsis-unresolved'),node('strong','','Abstract / summary unresolved'),paragraph(description?.note||'The manuscript description has not been checked against an available source.'));
  }
  const isAbstract=description.kind==='abstract';
  const details=node('details','synopsis');details.open=descriptionsExpanded.has(r.id);
  details.addEventListener('toggle',()=>{if(details.open) descriptionsExpanded.add(r.id);else descriptionsExpanded.delete(r.id);});
  const summary=add(node('summary'),node('span','',isAbstract?'Read abstract':'Read source-grounded summary'),node('span','synopsis-kind',isAbstract?'Inspected local version':'No abstract in inspected draft'),node('span','chevron','+'));
  summary.lastChild.setAttribute('aria-hidden','true');
  const body=add(node('div','synopsis-body'),node('h4','',isAbstract?'Abstract':'Summary — written for this register'));
  for(const text of description.text.split(/\n\s*\n/)) body.append(paragraph(text,'synopsis-text'));
  body.append(add(node('div','synopsis-source'),paragraph(`Source: ${description.sourceLabel}`),paragraph(`${description.sourceVersionLabel} · Checked ${formatDate(description.sourceCheckedOn)}`),paragraph(description.note)));
  return add(details,summary,body);
}
function renderCard(r) {
  const today=todayUTC();
  const article=node('article','manuscript');
  article.dataset.id=r.id;
  article.setAttribute('aria-labelledby',`title-${r.id}`);
  const meta=add(node('div','record-meta'),node('span','record-id',r.id));
  if(r.inventoryState==='archived') meta.append(badge('Archived'));
  if(r.tags.length) meta.append(node('span','topic',r.tags.slice(0,2).join(' / ')));
  const title=node('h3','',r.title);title.id=`title-${r.id}`;
  const people=add(node('p','people'),node('strong','','Lead '),document.createTextNode(r.lead||'Unconfirmed'),node('br'),node('strong','','Steward '),document.createTextNode(r.steward||'Unconfirmed'));
  const titleCell=add(node('div','title-cell'),meta,title,people);
  if(r.authors?.names.length) titleCell.append(paragraph(`Byline in inspected version: ${r.authors.names.join('; ')}`,'field-note'));
  const stageCell=add(node('div','stage-cell'),paragraph('Writing stage','field-label'),paragraph(writingLabels[r.writing.stage],'stage-value'));
  stageCell.append(paragraph(r.writing.confirmedOn ? `Confirmed ${formatDate(r.writing.confirmedOn)}` : r.writing.stage==='unconfirmed' ? 'Awaiting confirmation' : 'Reported · current stage unconfirmed','field-note'));
  if(r.writing.reportedOn) stageCell.append(paragraph(`Status source dated ${formatDate(r.writing.reportedOn)}`,'field-note'));
  add(stageCell,paragraph('Journal status','field-label journal-label'),paragraph(journalLabels[r.journal.status],'journal-value'));
  if(r.journal.name) stageCell.append(paragraph(r.journal.name,'field-note'));
  if(r.journal.status!=='unconfirmed'&&!r.journal.confirmedOn) stageCell.append(paragraph('Reported · not confirmed','field-note'));
  if(r.journal.reportedOn) stageCell.append(paragraph(`Status source dated ${formatDate(r.journal.reportedOn)}`,'field-note'));
  const draft=node('div','draft-cell');
  const uploaded=r.supportingLinks.find(l=>l.kind==='manuscript');
  draft.append(paragraph(!r.currentDraft.url&&uploaded?'Manuscript file':'Current draft','field-label'));
  const draftFreshness=freshness(r.currentDraft.confirmedOn,data.staleAfterDays,today);
  if(r.currentDraft.url) {
    const isConfirmed=r.currentDraft.status==='confirmed';
    const label=!isConfirmed?'Last-known draft':draftFreshness==='stale'?'Last-confirmed draft':'Open current draft';
    draft.append(link(r.currentDraft.url,label,`draft-link ${!isConfirmed?'unconfirmed-link':''}`));
    if(!isConfirmed) draft.append(paragraph('Current version unconfirmed','draft-status warn'));
    else if(draftFreshness==='stale') draft.append(badge('Confirmation stale','warning'));
    draft.append(paragraph([r.currentDraft.versionLabel,r.currentDraft.versionDate ? formatDate(r.currentDraft.versionDate) : null].filter(Boolean).join(' · ')||'Version label unconfirmed','draft-status'));
    draft.append(paragraph(`Version confirmed: ${formatDate(r.currentDraft.confirmedOn)}`,'field-note'));
  } else if(uploaded) {
    draft.append(link(uploaded.url,'Open uploaded copy','draft-link uploaded-copy'));
    draft.append(paragraph('Current version unconfirmed','draft-status warn'));
    draft.append(paragraph(uploaded.label,'field-note'));
    draft.append(paragraph('OneDrive sign-in and existing access required.','field-note'));
  } else {
    draft.append(paragraph('Current draft link unconfirmed','draft-unresolved'));
    draft.append(paragraph(r.currentDraft.status==='unavailable'?'No link available.':'A current version has not been verified.','field-note'));
  }
  if(r.localVersion) {
    draft.append(badge(r.localVersion.authority==='conflict'?'Local versions need reconciliation':'Local draft located',r.localVersion.authority==='conflict'?'warning':'confirmed'));
    draft.append(paragraph(r.localVersion.versionLabel,'field-note'));
  }
  const main=add(node('div','card-main'),titleCell,stageCell,draft);
  const actionCopy=add(node('div','action-copy'),node('span','action-label',r.nextAction.status==='proposed'?'Suggested next action':'Next action'),paragraph(r.nextAction.text||'Awaiting an agreed next action.'));
  const actionMeta=node('div','action-meta');
  actionMeta.append(add(node('div'),node('strong','','Owner: '),document.createTextNode(r.nextAction.owner||'Unconfirmed')));
  const due=r.nextAction;
  const overdue=due.dueStatus==='agreed'&&due.dueDate<today;
  const dueText=due.dueStatus==='unconfirmed'?'Agreed due date: Unconfirmed':`${due.dueStatus==='proposed'?'Proposed target':'Agreed due'}: ${formatDate(due.dueDate)}${overdue?' · Overdue':''}`;
  actionMeta.append(node('div',overdue?'overdue':due.dueStatus==='proposed'?'proposed':'',dueText));
  add(article,main,renderDescription(r),add(node('div','action-row'),actionCopy,actionMeta));
  const reasons=attentionReasons(r,data.staleAfterDays,today);
  if(reasons.length) article.append(add(node('div','attention-strip'),...reasons.map(reason=>node('span','attention-chip',reason))));
  const details=node('details','record-details');
  details.open=expanded.has(r.id);
  details.addEventListener('toggle',()=>{if(details.open) expanded.add(r.id);else expanded.delete(r.id);});
  const sourceFreshness=freshness(r.confirmation.sourceCheckedOn,data.staleAfterDays,today);
  const summary=add(node('summary'),node('span','','Details & history'),node('span','summary-meta',`Source: ${sourceFreshness==='unconfirmed'?'unconfirmed':formatDate(r.confirmation.sourceCheckedOn)+(sourceFreshness==='stale'?' · stale':'')}`),node('span','chevron','+'));
  summary.lastChild.setAttribute('aria-hidden','true');
  const body=node('div','detail-body');
  const confirmations=section('Version & source confirmation',termList([
    ['Version label',r.currentDraft.versionLabel],['Version dated',formatDate(r.currentDraft.versionDate)],['Version confirmed',r.currentDraft.confirmedOn?`${formatDate(r.currentDraft.confirmedOn)} · ${r.currentDraft.confirmedBy}`:'Unconfirmed'],['Source checked',formatDate(r.confirmation.sourceCheckedOn)],['Record entered / reviewed',formatDate(r.confirmation.recordReviewedOn)]
  ]),paragraph(r.currentDraft.note),paragraph(`Source: ${r.confirmation.sourceLabel}`),paragraph(r.confirmation.note));
  if(r.localVersion) confirmations.append(paragraph(`Local inspection: ${formatDate(r.localVersion.checkedOn)}. ${r.localVersion.note}`));
  const next=section('Ownership & progress',termList([
    ['Lead',r.lead],['Record steward',r.steward],['Action owner',r.nextAction.owner],['Deadline basis',r.nextAction.dueStatus==='unconfirmed'?'Unconfirmed':r.nextAction.dueStatus==='agreed'?`Agreed on ${formatDate(r.nextAction.agreedOn)}`:'Proposed · not agreed']
  ]));
  if(r.authors) next.append(paragraph(`Byline: ${r.authors.names.join('; ')||'Unconfirmed'}. ${r.authors.note}`));
  if(r.writing.note) next.append(paragraph(`Writing: ${r.writing.note}`));
  if(r.journal.note) next.append(paragraph(`Journal: ${r.journal.note}`));
  const blockers=section('Blockers');
  if(!r.blockers.length) blockers.append(paragraph('No blockers recorded. This does not confirm that the paper is unblocked.'));
  else {
    const list=node('ul');
    r.blockers.forEach(b=>list.append(add(node('li',b.status==='open'?'blocker-note':'resolved'),node('strong','',b.status==='open'?'Open · ':'Resolved · '),document.createTextNode(b.text),paragraph(`Recorded ${formatDate(b.recordedOn)}${b.resolvedOn?' · Resolved '+formatDate(b.resolvedOn):''}`,'field-note'))));
    blockers.append(list);
  }
  const supporting=section('Supporting links');
  if(!r.supportingLinks.length) supporting.append(paragraph('No supporting links confirmed.'));
  else {
    const list=node('ul');
    r.supportingLinks.forEach(l=>list.append(add(node('li'),link(l.url,l.label),paragraph(`${l.kind} · Checked ${formatDate(l.confirmedOn)}`,'field-note'))));
    supporting.append(list);
  }
  add(body,add(node('div','detail-grid'),confirmations,next,blockers,supporting));
  const links=section('Draft link history');
  if(!r.history.linkChanges.length) links.append(paragraph('No draft links recorded.'));
  else {
    const list=node('ul');
    [...r.history.linkChanges].reverse().forEach(l=>{
      const time=node('time','',`Recorded ${formatDate(l.recordedOn)}`);time.dateTime=l.recordedOn;
      list.append(add(node('li','history-item'),time,l.url?link(l.url,l.versionLabel||'Recorded draft link'):node('span','','Draft link cleared'),paragraph(l.reason)));
    });links.append(list);
  }
  const submissions=section('Submission history');
  if(!r.history.submissions.length) submissions.append(paragraph(`No submission events recorded.${r.journal.status==='unconfirmed'?' Submission status remains unconfirmed.':''}`));
  else {
    const list=node('ul');
    [...r.history.submissions].reverse().forEach(s=>list.append(add(node('li','history-item'),node('span','history-date',formatDate(s.eventDate)),node('strong','',`${s.status==='resubmitted'?'Resubmitted':journalLabels[s.status]} · ${s.journal||'Journal unconfirmed'}`),paragraph(s.note),paragraph(`Source: ${s.sourceLabel}`))));submissions.append(list);
  }
  body.append(add(node('div','detail-grid history-row'),links,submissions));
  add(details,summary,body);article.append(details);
  return article;
}
function updateOverview() {
  const working=data.records;
  const counts={manuscripts:working.length,linked:working.filter(r=>r.currentDraft.url||r.supportingLinks.some(l=>l.kind==='manuscript')).length,drafts:working.filter(r=>r.currentDraft.status!=='confirmed').length,attention:working.filter(r=>attentionReasons(r,data.staleAfterDays).length).length};
  for(const [key,value] of Object.entries(counts)) if($('count-'+key)) $('count-'+key).textContent=value;
  $('snapshot-date').textContent=formatDate(data.snapshotDate);
  $('coverage-note').textContent=data.coverageNote;
  $('stale-days').textContent=data.staleAfterDays;
  $('maintenance-note').textContent=`Maintainer: ${data.maintenance.primary||'awaiting assignment'} · Backup: ${data.maintenance.backup||'awaiting assignment'}`;
  const demo=data.dataClass==='synthetic_demo';
  const released=data.dataClass==='public_metadata';
  $('access-label').textContent=demo?'Demonstration · Read only':released?'Public metadata · Read only':'Confidential · Read only';
  $('mode-title').textContent=demo?'Demonstration — fictional records only':released?'Manuscript files are separate':'Confidential working register';
  $('mode-copy').textContent=demo?'These examples show how the register works. Counts, people, dates, and draft buttons are illustrative; they do not describe CECREH manuscripts.':released?'Uploaded manuscript copies open in OneDrive and require sign-in and existing access. A verified file link does not confirm the newest author-approved version. Version uncertainty and older status reports are labeled below.':'Unpublished metadata and protected draft links. Scope and current-version confirmation are still required for candidate records. This label does not establish hosting access control.';
  $('mode-banner').classList.toggle('confidential',!demo&&!released);
  $('mode-banner').hidden=false;
}
function populateFilters() {
  for(const [id,labels] of [['stage',writingLabels],['journal',journalLabels]]) {
    $(id).length=1;
    for(const [value,label] of Object.entries(labels)) {const option=node('option','',label);option.value=value;$(id).append(option);}
  }
  $('person').length=1;
  const people=[...new Set(data.records.flatMap(r=>[r.lead,r.steward,r.nextAction.owner,...(r.authors?.names||[])]).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  for(const person of people) {const option=node('option','',person);option.value=person;$('person').append(option);}
}
function render() {
  if(!data) return;
  const records=selectRecords(data.records,filters,data.staleAfterDays);
  $('result-count').textContent=`${records.length} of ${data.records.length} manuscripts`;
  $('results').replaceChildren(...records.map(renderCard));
  $('results').setAttribute('aria-busy','false');
  const hasFilter=Boolean(filters.query||filters.stage!=='all'||filters.journal!=='all'||filters.person!=='all'||filters.attention||filters.sort!=='title');
  $('reset').hidden=!hasFilter;
  $('empty').hidden=records.length>0;
  $('empty-reset').hidden=!hasFilter;
  if(!records.length) {
    $('empty-title').textContent=hasFilter?'No matching manuscripts':'No manuscripts listed yet';
    $('empty-copy').textContent=hasFilter?'Try a broader search or reset the filters. The overview counts always describe the full register.':'Manuscripts will appear here once their source and identity have been checked.';
  }
}
function reset() {
  filters={...baseFilters};
  $('filters').reset();$('attention').checked=false;$('sort').value='title';
  render();$('search').focus();
}
function setControls(disabled) {
  document.querySelectorAll('#filters input,#filters select,#attention,#sort').forEach(el=>el.disabled=disabled);
}
async function load() {
  data=null;setControls(true);$('error').hidden=true;$('empty').hidden=true;$('mode-banner').hidden=true;
  $('results').replaceChildren();$('results').setAttribute('aria-busy','true');$('result-count').textContent='Loading manuscripts…';
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),10000);
  try {
    const response=await fetch('./data/manuscripts.json',{cache:'no-store',credentials:'same-origin',signal:controller.signal});
    if(!response.ok) throw new Error('Data unavailable');
    const text=await response.text();if(text.length>2_000_000) throw new Error('Data too large');
    const loaded=JSON.parse(text);if(validateData(loaded).length) throw new Error('Data validation failed');
    data=loaded;filters={...baseFilters};populateFilters();$('filters').reset();$('attention').checked=false;$('sort').value='title';
    updateOverview();setControls(false);render();
  } catch {
    $('error').hidden=false;$('result-count').textContent='Register unavailable';$('snapshot-date').textContent='Unavailable';$('coverage-note').textContent='No validated data loaded.';
    $('results').setAttribute('aria-busy','false');$('reset').hidden=true;
    document.querySelectorAll('.stat strong').forEach(el=>el.textContent='—');
  } finally {clearTimeout(timeout);}
}
$('filters').addEventListener('submit',e=>e.preventDefault());
$('search').addEventListener('input',e=>{filters.query=e.target.value;render();});
for(const id of ['stage','journal','person','sort']) $(id).addEventListener('change',e=>{filters[id]=e.target.value;render();});
$('attention').addEventListener('change',e=>{filters.attention=e.target.checked;render();});
$('reset').addEventListener('click',reset);$('empty-reset').addEventListener('click',reset);
$('retry').addEventListener('click',()=>load().then(()=>{if(data) $('search').focus();}));
load();
