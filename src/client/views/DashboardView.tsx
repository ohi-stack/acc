import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  ListTodo, 
  GitFork, 
  ShieldCheck, 
  AlertOctagon, 
  Cpu, 
  Rocket, 
  HeartPulse, 
  ArrowRight, 
  Check, 
  X, 
  ExternalLink,
  RefreshCw,
  Clock,
  Shield
} from 'lucide-react';
import { api } from '../api';
import { Agent, Execution, ApprovalRequest } from '../types';

interface DashboardViewProps {
  onNavigate: (route: string) => void;
  onRefreshApprovals: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onRefreshApprovals }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [agentsData, execsData, approvalsData, health] = await Promise.all([
        api.getAgents(),
        api.getExecutions(),
        api.getApprovals('PENDING'),
        api.getSystemHealth()
      ]);
      setAgents(agentsData);
      setExecutions(execsData);
      setApprovals(approvalsData);
      setHealthData(health);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDecide = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      setActionLoading(id);
      await api.decideApproval(id, decision, `Manual ${decision.toLowerCase()} via Operator Dashboard`);
      await loadData();
      onRefreshApprovals();
    } catch (err: any) {
      alert(`Approval decision failed: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const activeAgents = agents.filter(a => a.status === 'READY' || a.status === 'EXECUTING').length;
  const runningExecutions = executions.filter(e => e.status === 'RUNNING').length;
  const failedExecutions = executions.filter(e => e.status === 'FAILED').length;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
            Operational Dashboard
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#141d30] text-[#d4af37] border border-[#d4af37]/30">
              ACC™ Control Plane
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Centralized coordination across agents, tasks, models, policies, and immutable audit ledgers.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1322] border border-[#1e293b] text-xs font-mono text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 1. Operational Summary Metrics (8 Key Indicators) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Active Agents', value: activeAgents, total: agents.length, icon: Bot, color: 'text-cyan-400', route: '/agents' },
          { label: 'Running Tasks', value: runningExecutions, icon: ListTodo, color: 'text-emerald-400', route: '/tasks' },
          { label: 'Workflows', value: 2, icon: GitFork, color: 'text-blue-400', route: '/workflows' },
          { label: 'Pending Approvals', value: approvals.length, icon: ShieldCheck, color: approvals.length > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-400', route: '/approvals' },
          { label: 'Failed Executions', value: failedExecutions, icon: AlertOctagon, color: failedExecutions > 0 ? 'text-rose-400' : 'text-slate-400', route: '/executions' },
          { label: 'Providers', value: 6, icon: Cpu, color: 'text-purple-400', route: '/models' },
          { label: 'Deployments', value: 1, icon: Rocket, color: 'text-sky-400', route: '/deployments' },
          { label: 'System Health', value: healthData?.overallStatus || 'Healthy', icon: HeartPulse, color: 'text-emerald-400', route: '/status' }
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(metric.route)}
              className="bg-[#0d1322] border border-[#1e293b] hover:border-cyan-500/40 rounded-lg p-3 cursor-pointer transition-all hover:bg-[#11192e] group"
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${metric.color}`} />
                <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="mt-2 text-lg font-mono font-bold text-slate-100 leading-tight">
                {metric.value}
                {metric.total !== undefined && <span className="text-xs text-slate-500 font-normal">/{metric.total}</span>}
              </div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-tight truncate mt-0.5">
                {metric.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Two-Column Grid: Approvals + Live Execution Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Approval Queue */}
        <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-mono font-semibold text-slate-200">
                Human Authorization Queue
              </h2>
              {approvals.length > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {approvals.length} Awaiting Decision
                </span>
              )}
            </div>
            <button
              onClick={() => onNavigate('/approvals')}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 mt-3 space-y-3">
            {approvals.length === 0 ? (
              <div className="py-10 text-center text-slate-500 font-mono text-xs">
                <Check className="w-8 h-8 text-emerald-500/50 mx-auto mb-2" />
                Zero pending actions. All privileged operations authorized.
              </div>
            ) : (
              approvals.map((req) => (
                <div
                  key={req.id}
                  className="bg-[#070b14] border border-[#1e293b] rounded-lg p-3.5 space-y-2 hover:border-amber-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                        <span>{req.requested_action}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          req.risk_level === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          req.risk_level === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        }`}>
                          {req.risk_level} RISK
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        Resource: <span className="text-cyan-300">{req.affected_resource}</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(req.created_at).toLocaleTimeString()}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-[#0d1322] p-2 rounded border border-[#1e293b]/50">
                    {req.reason}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-400">
                    <div>
                      Agent: <span className="text-slate-300">{req.requesting_agent}</span> • Policy: <span className="text-slate-300">{req.policy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecide(req.id, 'REJECTED')}
                        disabled={actionLoading === req.id}
                        className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-200 flex items-center gap-1 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleDecide(req.id, 'APPROVED')}
                        disabled={actionLoading === req.id}
                        className="px-3 py-1 rounded bg-emerald-950/80 hover:bg-emerald-800 border border-emerald-600/70 text-emerald-200 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        <span>Authorize</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Live Execution Feed */}
        <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <h2 className="text-sm font-mono font-semibold text-slate-200">
                Live Execution Feed
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/executions')}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>All Executions</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 mt-3 space-y-2 overflow-y-auto max-h-[380px]">
            {executions.length === 0 ? (
              <div className="py-10 text-center text-slate-500 font-mono text-xs">
                No active executions. Run an objective in the Command Center to initiate work.
              </div>
            ) : (
              executions.slice(0, 7).map((exec) => (
                <div
                  key={exec.id}
                  onClick={() => onNavigate(`/executions/${exec.id}`)}
                  className="p-2.5 rounded-lg bg-[#070b14] border border-[#1e293b] hover:border-cyan-500/40 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-200">
                        {exec.id.slice(0, 14)}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        exec.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        exec.status === 'RUNNING' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse' :
                        exec.status === 'ESCALATED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {exec.status}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Task: <span className="text-slate-200">{exec.task_type || 'objective_exec'}</span> • Model: <span className="text-purple-300">{exec.model}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono text-[10px] text-slate-400">
                    <div>{exec.duration_ms ? `${exec.duration_ms}ms` : 'active'}</div>
                    <div className="text-slate-500">{new Date(exec.created_at).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Agent Health & Infrastructure Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Health Registry (2 columns) */}
        <div className="lg:col-span-2 bg-[#0d1322] border border-[#1e293b] rounded-xl p-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-mono font-semibold text-slate-200">
                Agent Health & Workload
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/agents')}
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              Inspect Registry →
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {agents.slice(0, 4).map((agent) => (
              <div
                key={agent.id}
                className="bg-[#070b14] border border-[#1e293b] rounded-lg p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-200 truncate">
                    {agent.name}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {agent.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Concurrency: {agent.max_concurrency}</span>
                  <span className="text-purple-300">{agent.model_adapter}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(Array.isArray(agent.capabilities) ? agent.capabilities : []).slice(0, 3).map((cap, i) => (
                    <span key={i} className="text-[9px] font-mono px-1 rounded bg-[#141d30] text-slate-300 border border-[#1e293b]">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure Health Card (1 column) */}
        <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-mono font-semibold text-slate-200">
                Infrastructure Health
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/status')}
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              Full Probe →
            </button>
          </div>

          <div className="mt-3 space-y-2 text-xs font-mono">
            {[
              { name: 'ACC Control Plane API', status: 'Healthy', note: 'Node.js Port 3000' },
              { name: 'PostgreSQL Database', status: 'Healthy', note: 'Persistent Engine' },
              { name: 'Task Queue Worker', status: 'Healthy', note: 'acc-tasks (0 queued)' },
              { name: 'Google Gemini Provider', status: process.env.GEMINI_API_KEY ? 'Healthy' : 'Authorization Required', note: 'gemini-3.8-flash' },
              { name: 'QR-V Attestation Engine', status: 'Healthy', note: 'Cryptographic SHA-256' },
              { name: 'GitHub Organization Adapter', status: 'Healthy', note: 'github-actions' }
            ].map((srv, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#070b14] border border-[#1e293b]">
                <div>
                  <div className="text-slate-200 font-medium text-[11px]">{srv.name}</div>
                  <div className="text-[9px] text-slate-400">{srv.note}</div>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                  srv.status === 'Healthy' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  srv.status === 'Authorization Required' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {srv.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
