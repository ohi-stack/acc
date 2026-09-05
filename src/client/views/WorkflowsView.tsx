import React, { useState, useEffect } from 'react';
import { 
  GitFork, 
  Plus, 
  Play, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  RefreshCw,
  GitBranch,
  Layers
} from 'lucide-react';
import { api } from '../api';
import { Workflow } from '../types';

interface WorkflowsViewProps {
  onNavigate: (route: string) => void;
  onRefreshApprovals: () => void;
}

export const WorkflowsView: React.FC<WorkflowsViewProps> = ({ onNavigate, onRefreshApprovals }) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [runningId, setRunningId] = useState<string | null>(null);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const data = await api.getWorkflows();
      setWorkflows(data);
    } catch (err) {
      console.error('Failed to load workflows', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  const handleInspect = async (id: string) => {
    try {
      const detailed = await api.getWorkflow(id);
      setSelectedWorkflow(detailed);
    } catch (err: any) {
      alert(`Failed to load workflow: ${err.message}`);
    }
  };

  const handleRun = async (id: string) => {
    try {
      setRunningId(id);
      await api.runWorkflow(id, { environment: 'production', triggeredBy: 'operator' });
      await handleInspect(id);
      onRefreshApprovals();
    } catch (err: any) {
      alert(`Run failed: ${err.message}`);
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
            <GitFork className="w-5 h-5 text-blue-400" />
            Workflow Engine & Orchestration
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Multi-stage DAG pipelines with parallel branches, rollback handlers, and human authorization gates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadWorkflows}
            disabled={loading}
            className="p-2 rounded-lg bg-[#0d1322] border border-[#1e293b] text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Workflows List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className={`bg-[#0d1322] border rounded-xl p-5 space-y-4 transition-all ${
              selectedWorkflow?.id === wf.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-[#1e293b] hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span>{wf.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {wf.status}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">{wf.description}</p>
              </div>
            </div>

            {/* Visual Steps Overview */}
            <div className="space-y-1.5 bg-[#070b14] p-3 rounded-lg border border-[#1e293b]/60">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                Pipeline Stages ({Array.isArray(wf.steps) ? wf.steps.length : 0} steps)
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(Array.isArray(wf.steps) ? wf.steps : []).map((step: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="px-2 py-1 rounded bg-[#141d30] text-slate-200 border border-[#1e293b] flex items-center gap-1">
                      <span className="text-[10px] text-cyan-400">{step.step || idx + 1}.</span>
                      <span>{step.name}</span>
                    </span>
                    {idx < wf.steps.length - 1 && <ArrowRight className="w-3 h-3 text-slate-600" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1e293b] text-xs font-mono">
              <button
                onClick={() => handleInspect(wf.id)}
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Inspect Runs</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <button
                onClick={() => handleRun(wf.id)}
                disabled={runningId === wf.id}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{runningId === wf.id ? 'Running...' : 'Trigger Run'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Run Details */}
      {selectedWorkflow && (
        <div className="bg-[#0d1322] border border-blue-500/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div>
              <h2 className="text-sm font-mono font-bold text-slate-100">
                Run History: {selectedWorkflow.name}
              </h2>
              <div className="text-[10px] text-slate-400 font-mono">
                Authoritative execution logs and outputs
              </div>
            </div>
            <button
              onClick={() => setSelectedWorkflow(null)}
              className="text-xs font-mono text-slate-400 hover:text-slate-200"
            >
              Close ✕
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedWorkflow.runs?.length === 0 ? (
              <div className="text-slate-500 text-xs font-mono text-center py-6">
                No runs recorded yet. Click "Trigger Run" above.
              </div>
            ) : (
              selectedWorkflow.runs?.map((run: any) => (
                <div key={run.id} className="p-3 bg-[#070b14] border border-[#1e293b] rounded-lg flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="text-slate-200 font-semibold">{run.id}</div>
                    <div className="text-[10px] text-slate-400">
                      Step {run.current_step} • Started: {new Date(run.started_at).toLocaleTimeString()}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                    {run.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
