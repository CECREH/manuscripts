import {readFile,writeFile,mkdir,copyFile,readdir,stat,chmod} from 'node:fs/promises';
import {dirname,resolve,relative,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateData} from '../lib/records.mjs';
import {siteAssets} from './assets.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const value=key=>args[args.indexOf(key)+1];
try {
  const input=resolve(args.includes('--data')?value('--data'):resolve(root,'data/manuscripts.json'));
  const data=JSON.parse(await readFile(input,'utf8'));
  const errors=validateData(data);if(errors.length) throw new Error(`Validation failed: ${errors.join('; ')}`);
  const confidential=data.dataClass==='confidential';
  if(confidential&&!args.includes('--private-local')) throw new Error('Confidential data requires --private-local. No remote deployment is provided.');
  if(confidential&&!args.includes('--out')) throw new Error('Confidential previews require an explicit output directory outside the repository.');
  const output=resolve(args.includes('--out')?value('--out'):resolve(root,'dist/demo'));
  const rel=relative(root,output);
  const outside=rel==='..'||rel.startsWith('../')||isAbsolute(rel);
  if(confidential&&!outside) throw new Error('Confidential previews must stay outside the source repository.');
  if(!confidential&&output!==resolve(root,'dist/demo')) throw new Error('Demo builds are restricted to dist/demo.');
  if(confidential&&(output===dirname(root)||output===resolve('/'))) throw new Error('Choose a dedicated local preview directory.');
  await mkdir(output,{recursive:true,mode:confidential?0o700:0o755});
  const existing=await readdir(output);
  if(existing.length) {
    let prior;
    try {prior=JSON.parse(await readFile(resolve(output,'.build.json'),'utf8'));} catch {throw new Error('Output is not an existing generated preview. Choose an empty directory.');}
    if(prior.dataClass!==data.dataClass) throw new Error('Never mix demonstration and confidential builds in one directory.');
    const allowedTop=new Set(siteAssets.map(p=>p.split('/')[0]).concat('.build.json'));
    if(existing.some(name=>!allowedTop.has(name))) throw new Error('Unexpected files in the output directory; inspect them before building.');
  }
  for(const asset of siteAssets) {
    const target=resolve(output,asset);await mkdir(dirname(target),{recursive:true,mode:confidential?0o700:0o755});
    if(asset==='data/manuscripts.json') await writeFile(target,JSON.stringify(data,null,2)+'\n',{mode:confidential?0o600:0o644});
    else await copyFile(resolve(root,asset),target);
    if(confidential) await chmod(target,0o600);
  }
  await writeFile(resolve(output,'.build.json'),JSON.stringify({dataClass:data.dataClass,localOnly:confidential,files:siteAssets},null,2)+'\n',{mode:confidential?0o600:0o644});
  console.log(`Built ${data.dataClass} preview: ${output}\n${confidential?'LOCAL ONLY: hosting and repository audience are not verified.':'Synthetic demonstration only. No deployment performed.'}`);
} catch(error) {console.error(error.message);process.exitCode=1;}
