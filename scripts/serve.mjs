import http from 'node:http';
import {readFile,lstat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {siteAssets} from './assets.mjs';
const args=process.argv.slice(2);
const arg=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const root=resolve(arg('--root','dist/demo'));
const port=Number(arg('--port','4173'));
const base=arg('--base','').replace(/\/$/,'');
if(base&&(!/^\/[A-Za-z0-9_-]+$/.test(base))) throw new Error('Base must be a single path segment.');
const manifest=JSON.parse(await readFile(resolve(root,'.build.json'),'utf8'));
if(!['synthetic_demo','confidential','public_metadata'].includes(manifest.dataClass)) throw new Error('Serve a validated build directory.');
const allowed=new Set(siteAssets.filter(f=>f!=='.nojekyll'));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.txt':'text/plain; charset=utf-8'};
const headers={'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"};
const server=http.createServer(async(req,res)=>{
  const deny=(status)=>{res.writeHead(status,{...headers,'Content-Type':'text/plain'});res.end('Unavailable');};
  if(!['GET','HEAD'].includes(req.method)) return deny(405);
  try {
    let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(base) {if(!pathname.startsWith(base+'/')) return deny(404);pathname=pathname.slice(base.length);}
    const path=pathname==='/'?'index.html':pathname.slice(1);
    if(!allowed.has(path)) return deny(404);
    const target=resolve(root,path);
    if((await lstat(target)).isSymbolicLink()) return deny(404);
    for(const part of path.split('/').slice(0,-1)) if((await lstat(resolve(root,part))).isSymbolicLink()) return deny(404);
    const body=await readFile(target);
    res.writeHead(200,{...headers,'Content-Type':types[extname(path)]||'application/octet-stream'});
    res.end(req.method==='HEAD'?undefined:body);
  } catch {deny(404);}
});
server.listen(port,'127.0.0.1',()=>console.log(`Local ${manifest.dataClass} preview: http://127.0.0.1:${port}${base}/`));
