import {readFile} from 'node:fs/promises';
import {validateData} from '../lib/records.mjs';
const args=process.argv.slice(2);
const file=args[0]||'data/manuscripts.json';
const priorIndex=args.indexOf('--previous');
const retainedIndex=args.indexOf('--retained');
try {
  const data=JSON.parse(await readFile(file,'utf8'));
  const previous=priorIndex<0?null:JSON.parse(await readFile(args[priorIndex+1],'utf8'));
  const retainedRecords=retainedIndex<0?[]:JSON.parse(await readFile(args[retainedIndex+1],'utf8')).records;
  const errors=validateData(data,{previous,retainedRecords});
  if(errors.length) {console.error(errors.join('\n'));process.exitCode=1;}
  else console.log(`Valid ${data.dataClass} register: ${data.records.length} records.${previous?' History and stable IDs preserved.':''}`);
} catch {console.error('Could not read or parse the specified register.');process.exitCode=1;}
