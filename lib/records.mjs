import validateSchema from './schema-validator.mjs';

export const writingLabels = {unconfirmed:'Unconfirmed', planning:'Planning', analysis:'Analysis', drafting:'Drafting', internal_revision:'Internal revision', coauthor_review:'Coauthor review', ready_to_submit:'Ready to submit', journal_revision:'Journal revision', complete:'Complete', paused:'Paused'};
export const journalLabels = {unconfirmed:'Unconfirmed', not_submitted:'Not submitted', submitted:'Submitted', under_review:'Under review', revision_requested:'Revision requested', accepted:'Accepted', published:'Published', withdrawn:'Withdrawn', rejected:'Rejected'};
const day = 86400000;
const canonical = value => JSON.stringify(value, Object.keys(value).sort());
export const todayUTC = () => new Date().toISOString().slice(0,10);
export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(value + 'T00:00:00Z');
  return Number.isFinite(time) && new Date(time).toISOString().slice(0,10) === value;
}
export function safeUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password && Boolean(url.hostname); } catch { return false; }
}
export function validateData(data, {today = todayUTC(), previous = null} = {}) {
  if (!validateSchema(data)) return validateSchema.errors.map(e => `${e.instancePath || '/'}: ${e.message}`);
  const errors = [];
  const check = (condition, message) => { if (!condition) errors.push(message); };
  function walk(value, path='') {
    if (!value || typeof value !== 'object') return;
    for (const [key, v] of Object.entries(value)) {
      const at = `${path}/${key}`;
      if (v !== null && /(?:On|Date)$/.test(key)) {
        check(validDate(v), `${at}: invalid calendar date`);
        if (key !== 'dueDate') check(v <= data.snapshotDate, `${at}: evidence cannot postdate the snapshot`);
      }
      if (key === 'url' && v !== null) check(safeUrl(v), `${at}: use an HTTPS URL without embedded credentials`);
      walk(v, at);
    }
  }
  check(validDate(data.snapshotDate) && data.snapshotDate <= today, '/snapshotDate: use a real date no later than today');
  walk(data);
  check(new Set(data.records.map(r=>r.id)).size === data.records.length, '/records: duplicate manuscript IDs');
  for (const r of data.records) {
    const prefix = `${r.id}: `;
    const manuscriptFiles=r.supportingLinks.filter(l=>l.kind==='manuscript');
    check(manuscriptFiles.length<=1,prefix+'select at most one uploaded manuscript copy');
    check(manuscriptFiles.every(l=>Boolean(l.confirmedOn)),prefix+'uploaded manuscript copy requires a destination check date');
    if (data.dataClass === 'synthetic_demo') {
      check(r.id.startsWith('DEMO-'), prefix+'demo requires DEMO IDs');
      const urls = [r.currentDraft.url, ...r.supportingLinks.map(x=>x.url), ...r.history.linkChanges.map(x=>x.url)].filter(Boolean);
      check(urls.every(url => {try {return new URL(url).hostname === 'example.org';} catch {return false;}}), prefix+'demo URLs must use example.org');
    } else check(r.id.startsWith('MS-'), prefix+'manuscript records require MS IDs');
    const description=r.abstractOrSummary;
    if(data.dataClass==='public_metadata') check(Boolean(description),prefix+'public records require an abstract, a sourced summary, or an explicit unresolved description');
    if(description) {
      const resolved=description.kind!=='unresolved';
      check(resolved ? Boolean(description.text&&description.sourceCheckedOn&&description.sourceVersionLabel) : description.text===null&&description.sourceCheckedOn===null,prefix+'description content requires an inspected source/version; unresolved content must stay null');
      check(description.abstractPresence===({abstract:'present',summary:'absent_in_inspected_source',unresolved:'unverified'}[description.kind]),prefix+'a summary requires an inspected source with no abstract; unverified content must remain unresolved');
    }
    if(data.dataClass==='public_metadata') {
      const serialized=JSON.stringify(r);
      check(!/(?:\/Users\/|\/Volumes\/|file:\/\/|@[^\s"]+\.[a-z]{2,})/i.test(serialized),prefix+'public metadata must not contain local paths or email addresses');
      const urls=[r.currentDraft.url,...r.supportingLinks.map(x=>x.url),...r.history.linkChanges.map(x=>x.url)].filter(Boolean);
      for(const url of urls) check(data.publicLinkReviews?.some(review=>review.url===url&&review.checkedOn&&review.audienceNote),prefix+'every public link requires a recorded destination and access review');
      check(!r.currentDraft.url||r.currentDraft.status==='confirmed',prefix+'public current-draft URLs must be version-confirmed');
    }
    for (const [name, v] of Object.entries({scope:r.scope, writing:r.writing, journal:r.journal, currentDraft:r.currentDraft})) {
      check(Boolean(v.confirmedOn) === Boolean(v.confirmedBy), prefix+name+' confirmation requires a date and person together');
    }
    check(r.scope.status !== 'confirmed' || Boolean(r.scope.confirmedOn), prefix+'confirmed scope requires confirmation evidence');
    check(r.scope.status !== 'candidate' || r.scope.confirmedOn === null, prefix+'candidate scope cannot be confirmed');
    check(r.writing.stage !== 'unconfirmed' || r.writing.confirmedOn === null, prefix+'unknown writing stage cannot be confirmed');
    check(r.journal.status !== 'unconfirmed' || r.journal.confirmedOn === null, prefix+'unknown journal state cannot be confirmed');
    check(r.currentDraft.status !== 'confirmed' || Boolean(r.currentDraft.url && r.currentDraft.confirmedOn), prefix+'confirmed draft requires URL and confirmation');
    check(r.currentDraft.status === 'confirmed' || r.currentDraft.confirmedOn === null, prefix+'unresolved draft cannot have a confirmation date');
    check(r.currentDraft.status !== 'unavailable' || r.currentDraft.url === null, prefix+'unavailable draft must not have a URL');
    check(r.nextAction.dueStatus !== 'unconfirmed' || r.nextAction.dueDate === null, prefix+'unknown due date must be null');
    check(r.nextAction.dueStatus === 'unconfirmed' || Boolean(r.nextAction.dueDate && r.nextAction.text), prefix+'a dated action requires a date and action');
    check(r.nextAction.dueStatus !== 'agreed' || Boolean(r.nextAction.agreedOn && r.nextAction.owner), prefix+'agreed deadline requires owner and agreement date');
    check(r.nextAction.dueStatus !== 'agreed' || r.nextAction.status === 'agreed', prefix+'an agreed deadline requires an agreed action');
    check(r.nextAction.status !== 'unconfirmed' || r.nextAction.text === null, prefix+'unknown action text must be null');
    check(r.nextAction.status === 'unconfirmed' || Boolean(r.nextAction.text), prefix+'a proposed or agreed action requires text');
    check(r.nextAction.dueStatus === 'agreed' || r.nextAction.agreedOn === null, prefix+'only agreed deadlines can have an agreement date');
    for (const [name, list, id] of [['blockers',r.blockers,'id'],['linkChanges',r.history.linkChanges,'eventId'],['submissions',r.history.submissions,'eventId']]) {
      check(new Set(list.map(x=>x[id])).size === list.length, prefix+name+' has duplicate event IDs');
    }
    for (const b of r.blockers) check((b.status === 'resolved') === Boolean(b.resolvedOn), prefix+'blocker resolution must have a date');
    if (r.currentDraft.url) check(r.history.linkChanges.at(-1)?.url===r.currentDraft.url, prefix+'current/last-known draft URL must match the latest link-history event');
    check(r.history.linkChanges.every((event,i,events)=>i===0||event.recordedOn>=events[i-1].recordedOn), prefix+'link history must be in recorded-date order');
    const prior = previous?.records.find(x=>x.id===r.id);
    if (prior) {
      for (const key of ['linkChanges','submissions']) {
        for (const event of prior.history[key]) check(r.history[key].some(x=>canonical(x)===canonical(event)), prefix+key+' history is append-only; retain the original event');
      }
      if(prior.currentDraft.url!==r.currentDraft.url) check(r.history.linkChanges.length>prior.history.linkChanges.length&&r.history.linkChanges.at(-1)?.url===r.currentDraft.url, prefix+'changing or clearing the canonical link requires a new link-history event');
    }
  }
  if (previous) for (const r of previous.records) check(data.records.some(x=>x.id===r.id), `${r.id}: retain the record; archive it instead of deleting its stable ID`);
  return errors;
}
export function freshness(date, staleAfterDays, today=todayUTC()) {
  if (!date) return 'unconfirmed';
  return (Date.parse(today)-Date.parse(date))/day > staleAfterDays ? 'stale' : 'current';
}
export function attentionReasons(r, staleAfterDays, today=todayUTC()) {
  const reasons = [];
  if (r.currentDraft.status !== 'confirmed') reasons.push('Current draft unconfirmed');
  else if (freshness(r.currentDraft.confirmedOn, staleAfterDays, today)==='stale') reasons.push('Draft confirmation stale');
  const source = freshness(r.confirmation.sourceCheckedOn, staleAfterDays, today);
  if (source==='unconfirmed') reasons.push('Source not confirmed');
  if (source==='stale') reasons.push('Source confirmation stale');
  if(r.scope.confirmedOn&&freshness(r.scope.confirmedOn,staleAfterDays,today)==='stale') reasons.push('Scope confirmation needs refresh');
  if(r.writing.reportedOn&&freshness(r.writing.reportedOn,staleAfterDays,today)==='stale') reasons.push('Writing status needs refresh');
  if(r.journal.reportedOn&&freshness(r.journal.reportedOn,staleAfterDays,today)==='stale') reasons.push('Journal status needs refresh');
  if (r.blockers.some(b=>b.status==='open')) reasons.push('Open blocker');
  if (r.nextAction.dueStatus==='agreed' && r.nextAction.dueDate < today) reasons.push('Agreed action overdue');
  return reasons;
}
export function inventoryGroup(r) {
  if (r.scope.status==='candidate') return 'candidates';
  return r.inventoryState==='archived' ? 'archived' : 'active';
}
export function selectRecords(records, filters, staleAfterDays, today=todayUTC()) {
  const query = filters.query.trim().toLocaleLowerCase();
  const items = records.filter(r => {
    const searchable = [r.id,r.title,r.shortTitle,r.abstractOrSummary?.text,...r.tags,...(r.authors?.names||[]),r.lead,r.steward,r.nextAction.text,r.nextAction.owner,r.journal.name,writingLabels[r.writing.stage],journalLabels[r.journal.status]].filter(Boolean).join(' ').toLocaleLowerCase();
    return inventoryGroup(r)===filters.group && (!query || searchable.includes(query)) &&
      (filters.stage==='all' || r.writing.stage===filters.stage) &&
      (filters.journal==='all' || r.journal.status===filters.journal) &&
      (filters.person==='all' || [r.lead,r.steward,r.nextAction.owner,...(r.authors?.names||[])].includes(filters.person)) &&
      (!filters.attention || attentionReasons(r,staleAfterDays,today).length>0);
  });
  const alpha=(a,b)=>a.title.localeCompare(b.title) || a.id.localeCompare(b.id);
  return items.sort((a,b)=> {
    if (filters.sort==='due') {
      const da=a.nextAction.dueStatus==='agreed' ? a.nextAction.dueDate : '9999';
      const db=b.nextAction.dueStatus==='agreed' ? b.nextAction.dueDate : '9999';
      return da.localeCompare(db)||alpha(a,b);
    }
    if (filters.sort==='confirmation') return (a.confirmation.sourceCheckedOn||'').localeCompare(b.confirmation.sourceCheckedOn||'')||alpha(a,b);
    if (filters.sort==='stage') return Object.keys(writingLabels).indexOf(a.writing.stage)-Object.keys(writingLabels).indexOf(b.writing.stage)||alpha(a,b);
    return alpha(a,b);
  });
}
