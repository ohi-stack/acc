export type Row=Record<string,unknown>;
export type Resource={rows:Row[];error:string|null;loading:boolean;raw:unknown};
export const resources=['work-orders','responsibilities','execution-providers','agents','tasks','workflows','executions','approvals','deployments','verification','audit','connections','health'];
export function show(value:unknown):string{
  if(value===undefined||value===null||value==='')return 'Unknown';
  if(typeof value==='boolean')return value?'Yes':'No';
  if(typeof value==='object')return JSON.stringify(value,null,2);
  return String(value);
}
export function pick(row:Row,...keys:string[]):unknown{for(const key of keys)if(row[key]!==undefined&&row[key]!==null)return row[key];return undefined;}
export function status(row:Row){return show(row.status).toUpperCase();}
export function elapsed(row:Row):string{
  const start=Date.parse(show(pick(row,'started_at','created_at'))),end=Date.parse(show(pick(row,'completed_at','updated_at')));
  if(!Number.isFinite(start))return 'Unknown';
  const minutes=Math.max(0,Math.floor(((status(row)==='RUNNING'?Date.now():Number.isFinite(end)?end:start)-start)/60000));
  return minutes<60?`${minutes}m`:`${Math.floor(minutes/60)}h ${minutes%60}m`;
}
export async function request(resource:string,options:RequestInit={}):Promise<unknown>{
  const response=await fetch('/api/v1/'+resource,{...options,cache:'no-store',headers:{'Content-Type':'application/json'}});
  const body=await response.json();
  if(!response.ok)throw new Error(body.error??`Runtime request failed (${response.status})`);
  return body.data??body;
}
