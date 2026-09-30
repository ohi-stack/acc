import { getChatGPTUser } from '../../../chatgpt-auth';
import { permittedOperation, validateMutation } from '../../../lib/contracts.mjs';

export const dynamic = 'force-dynamic';
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});

async function handle(request:Request, context:{params:Promise<{path:string[]}>}) {
  const user=await getChatGPTUser();
  if (!user) return json({error:'Unauthorized. Sign in to ACC.'},401);
  const owners=(process.env.ACC_OPERATOR_EMAILS??'onegodianone@gmail.com').split(',').map(s=>s.trim().toLowerCase());
  if (!owners.includes(user.email.toLowerCase())) return json({error:'This identity is not authorized for ACC.'},403);
  const {path}=await context.params;
  if (!permittedOperation(request.method,path)) return json({error:'Unsupported governed operation. No fallback is permitted.'},405);
  const url=new URL(request.url);
  if (request.method==='POST' && request.headers.get('origin')!==url.origin) return json({error:'Same-origin request required.'},403);
  const base=process.env.ACC_API_ORIGIN;
  const key=process.env.ACC_API_KEY;
  if (!base || !key) return json({error:'ACC runtime connection is not configured. Runtime evidence is Unknown.',code:'RUNTIME_UNCONFIGURED'},503);
  let origin:URL;
  try {origin=new URL(base);} catch {return json({error:'Invalid server runtime configuration.'},503);}
  if (origin.protocol!=='https:' || origin.username || origin.password || origin.pathname!=='/' || origin.search || origin.hash) return json({error:'ACC_API_ORIGIN must be a trusted HTTPS origin.'},503);
  let body:string|undefined;
  if (request.method==='POST') {
    const raw=await request.text();
    if (raw.length>64000) return json({error:'Request too large.'},413);
    let value;
    try {value=JSON.parse(raw);} catch {return json({error:'Invalid JSON.'},400);}
    if (!validateMutation(path[0],value)) return json({error:'Invalid governed request. Authority, actor, status and approval assertions are not accepted.'},400);
    body=JSON.stringify(value);
  }
  const target=new URL(`/api/v1/${path.join('/')}`,origin);
  for (const name of ['status','limit','offset']) if(url.searchParams.has(name)) target.searchParams.set(name,url.searchParams.get(name)!);
  try {
    const upstream=await fetch(target,{method:request.method,body,cache:'no-store',redirect:'error',signal:AbortSignal.timeout(12000),headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Accept':'application/json'}});
    const type=upstream.headers.get('content-type')??'';
    if (!type.includes('application/json')) return json({error:'ACC returned no structured runtime evidence.'},502);
    const result=await upstream.json();
    if (!upstream.ok) return json({error:upstream.status===401||upstream.status===403?'ACC rejected the server connection credentials or authority.':`ACC operation failed (${upstream.status}).`,code:'UPSTREAM_ERROR'},upstream.status);
    return json(result);
  } catch {return json({error:'ACC runtime is unavailable. No operation or result is asserted.',code:'RUNTIME_UNAVAILABLE'},502);}
}
export const GET=handle;
export const POST=handle;
