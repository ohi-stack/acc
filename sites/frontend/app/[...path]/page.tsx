import { notFound } from 'next/navigation';
import { requireChatGPTUser } from '../chatgpt-auth';
import Console from '../components/Console';
export const dynamic='force-dynamic';
const routes=['projects','responsibilities','work-orders','delegation','agents','tasks','workflows','executions','approvals','deployments','verification','audit','models','oruvalen','omos','engineering-council','connections','status','docs','settings','account'];
export default async function OperatorPage({params}:{params:Promise<{path:string[]}>}){
  const {path}=await params;
  if (!routes.includes(path[0]) && !(path[0]==='console' && ['dashboard','command'].includes(path[1]))) notFound();
  const user=await requireChatGPTUser('/'+path.join('/'));
  return <Console path={path} user={{name:user.displayName,email:user.email}}/>;
}
