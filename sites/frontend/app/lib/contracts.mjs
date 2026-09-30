export const PROVIDERS = [
  {id:'acc-runner',label:'ACC Runner',category:'internal',maturity:'Integrated',executable:true,notes:'Canonical governed ACC runtime.'},
  {id:'human',label:'Human',category:'human',maturity:'External',executable:true,notes:'Executable human assignment target.'},
  {id:'omos',label:'OMOS',category:'internal',maturity:'External',executable:false,notes:'Reasoning integration boundary.'},
  {id:'openai-agents',label:'OpenAI Agents',category:'openai',maturity:'Reserved',executable:false,notes:'Reserved until adapter verification.'},
  {id:'openai-codex',label:'OpenAI Codex',category:'openai',maturity:'External',executable:false,notes:'Engineering execution target; connection required.'},
  {id:'chatgpt-work',label:'ChatGPT Work',category:'openai',maturity:'External',executable:false,notes:'External work surface.'},
  {id:'openai-dot',label:'OpenAI Dot',category:'openai',maturity:'Reserved',executable:false,notes:'Reserved Provider — Execution Not Available'},
  {id:'external-mcp',label:'External MCP',category:'external',maturity:'External',executable:false,notes:'Requires an explicit registered connection.'},
];
export const WORK_STATUSES=['PLANNED','READY','QUEUED','RUNNING','AWAITING_APPROVAL','COMPLETED','BLOCKED','FAILED','CANCELLED'];
export const RESPONSIBILITY_STATUSES=['DRAFT','ACTIVE','PAUSED','BLOCKED','ARCHIVED'];
export function providerPresentation(id, evidence) {
  const definition=PROVIDERS.find(p=>p.id===id);
  if (!definition) return {id,label:id,maturity:'Unavailable',executable:false,health:'Unknown',evidenceAvailable:false,connectionState:'Unknown',lastActivity:null,notes:'Unknown provider. Authorization denied; no fallback.'};
  const maturityMap={available:'Integrated',connected:'Integrated',external:'External',reserved:'Reserved'};
  return {...definition,
    maturity:id==='openai-dot'?'Reserved': evidence ? (maturityMap[evidence.maturity] ?? definition.maturity):definition.maturity,
    executable:id==='openai-dot'?false: definition.executable && evidence?.executable===true,
    health: typeof evidence?.health==='string'?evidence.health:'Unknown',
    connectionState:evidence?.connectionState??'Unknown',
    lastActivity:evidence?.lastActivity??null,
    evidenceAvailable:!!evidence};
}
export function permittedOperation(method, parts) {
  if (!parts.length || parts.some(p=>!p || !/^[a-zA-Z0-9_-]+$/.test(p))) return false;
  if (method==='GET') {
    const collections=['work-orders','responsibilities','execution-providers','agents','tasks','workflows','executions','approvals','deployments','verification','audit','connections','health'];
    return collections.includes(parts[0]) && (parts.length===1 || (parts.length===2 && ['work-orders','agents','tasks','workflows','executions'].includes(parts[0])));
  }
  return method==='POST' && ((parts.length===1 && ['work-orders','responsibilities'].includes(parts[0])) || (parts.length===3 && parts[0]==='approvals' && parts[2]==='decide'));
}
export function validateMutation(resource, body) {
  if (!body || typeof body!=='object' || Array.isArray(body)) return false;
  const nonempty=k=>typeof body[k]==='string' && body[k].trim().length>0;
  const allowed=resource==='work-orders'
    ? ['projectId','responsibilityId','objective','context','provider','executorRef','assignedTo','requiredTools','files','dependencies','schedule','trigger','riskLevel','requiresHumanApproval']
    : resource==='responsibilities'
      ? ['projectId','name','description','provider','ownerId','cadence','triggers','requiresHumanApproval','status']
      : ['decision','reason'];
  if (Object.keys(body).some(k=>!allowed.includes(k))) return false;
  if (resource==='approvals') return ['APPROVED','REJECTED'].includes(body.decision) && nonempty('reason');
  if (!nonempty('projectId') || !PROVIDERS.some(p=>p.id===body.provider)) return false;
  if ('requiresHumanApproval' in body && typeof body.requiresHumanApproval!=='boolean') return false;
  if (resource==='work-orders') return nonempty('objective') && (!body.riskLevel || ['LOW','MEDIUM','HIGH','CRITICAL'].includes(body.riskLevel));
  return nonempty('name') && nonempty('ownerId') && (!body.status || body.status==='DRAFT');
}
export function verifiedDeployment(record, verifications=[]) {
  const hasEvidence=value=>typeof value==='string'?value.trim().length>0:!!value&&typeof value==='object'&&Object.keys(value).length>0;
  const correlated=verifications.filter(v=>v.entity_type==='deployment' && v.entity_id===record?.id).sort((a,b)=>Date.parse(b.verified_at??'')-Date.parse(a.verified_at??''));
  if(correlated.length){const latest=correlated[0];return latest.status==='VERIFIED' && hasEvidence(latest.evidence) && !!latest.verified_at;}
  const verification=record?.verification??record?.verification_evidence;
  return verification?.status==='VERIFIED' && hasEvidence(verification.evidence);
}
export function attentionState(data) {
  const keys=['approvals','work-orders','executions','connections','deployments','verification'];
  return {rows:[],raw:null,loading:keys.some(k=>!data[k] || data[k].loading),error:keys.some(k=>data[k]?.error)?'Attention cannot be assessed until ACC runtime evidence is available.':null};
}
export function healthSummary(raw) {
  const providers=Array.isArray(raw?.subsystems)?raw.subsystems.filter(s=>s.category==='provider'):[];
  return {system:raw?.timestamp?raw.overallStatus??'Unknown':'Unknown',providers:providers.length?`${providers.filter(p=>p.status==='Healthy').length}/${providers.length} healthy`:'Unknown'};
}
export function projectIndex(workOrders, responsibilities) {
  const ids=[...new Set([...workOrders,...responsibilities].map(r=>r.project_id??r.projectId).filter(Boolean))];
  return ids.map(id=>({id,name:id,status:'Unknown',source:'Derived from persisted project references'}));
}
