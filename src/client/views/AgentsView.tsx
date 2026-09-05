import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Plus, 
  RefreshCw, 
  ShieldCheck, 
  Power, 
  PowerOff, 
  Sliders, 
  ExternalLink,
  Cpu,
  Layers,
  Clock,
  Activity
} from 'lucide-react';
import { api } from '../api';
import { Agent } from '../types';

interface AgentsViewProps {
  onNavigate: (route: string) => void;
}

export const AgentsView: React.FC<AgentsViewProps> = ({ onNavigate }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'autonomous_worker',
    capabilities: 'ast_review, verification, test_matrix',
    supportedTaskTypes: 'pr_assessment, ast_diff_review',
    environment: 'production',
    maxConcurrency: 3,
    queueAffinity: 'acc-tasks',
    authorityRole: 'agent_executor',
    modelAdapter: 'gemini-3.8-flash'
  });

  const loadAgents = async () => {
    try {
      setLoading(true);
      const data = await api.getAgents();
      setAgents(data);
    } catch (err) {
      console.error('Failed to load agents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleInspect = async (id: string) => {
    try {
      const detailed = await api.getAgent(id);
      setSelectedAgent(detailed);
    } catch (err: any) {
      alert(`Failed to inspect agent: ${err.message}`);
    }
  };

  const handleSetStatus = async (id: string, status: string) => {
    try {
      setMutatingId(id);
      await api.setAgentStatus(id, status);
      await loadAgents();
      if (selectedAgent && selectedAgent.id === id) {
        handleInspect(id);
      }
    } catch (err: any) {
      alert(`Failed to mutate agent status: ${err.message}`);
    } finally {
      setMutatingId(null);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.registerAgent({
        name: formData.name,
        type: formData.type,
        capabilities: formData.capabilities.split(',').map(s => s.trim()),
        supported_task_types: formData.supportedTaskTypes.split(',').map(s => s.trim()),
        environment: formData.environment,
        max_concurrency: Number(formData.maxConcurrency),
        queue_affinity: formData.queueAffinity,
        authority_role: formData.authorityRole,
        model_adapter: formData.modelAdapter
      });
      setShowRegisterModal(false);
      await loadAgents();
    } catch (err: any) {
      alert(`Registration failed: ${err.message}`);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
            <Bot className="w-5 h-5 text-cyan-400" />
            Agent Registry & Governance
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Strictly bounded execution agents with typed capabilities, queue affinities, and non-escalatable authority roles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadAgents}
            disabled={loading}
            className="p-2 rounded-lg bg-[#0d1322] border border-[#1e293b] text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Agent</span>
          </button>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const isReady = agent.status === 'READY' || agent.status === 'EXECUTING';
          return (
            <div
              key={agent.id}
              className={`bg-[#0d1322] border rounded-xl p-4 space-y-3 transition-all ${
                selectedAgent?.id === agent.id ? 'border-cyan-500 ring-1 ring-cyan-500' : 'border-[#1e293b] hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    <span>{agent.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">v{agent.version}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">{agent.id}</div>
                </div>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-semibold ${
                  agent.status === 'READY' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  agent.status === 'EXECUTING' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse' :
                  agent.status === 'TERMINATED' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {agent.status}
                </span>
              </div>

              {/* Metadata Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#070b14] p-2.5 rounded-lg border border-[#1e293b]/60">
                <div>
                  <span className="text-slate-500">Role: </span>
                  <span className="text-[#d4af37] font-semibold">{agent.authority_role}</span>
                </div>
                <div>
                  <span className="text-slate-500">Model: </span>
                  <span className="text-purple-300">{agent.model_adapter}</span>
                </div>
                <div>
                  <span className="text-slate-500">Queue: </span>
                  <span className="text-slate-300">{agent.queue_affinity}</span>
                </div>
                <div>
                  <span className="text-slate-500">Concurrency: </span>
                  <span className="text-slate-300">{agent.current_workload}/{agent.max_concurrency}</span>
                </div>
              </div>

              {/* Capabilities */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Capabilities:</div>
                <div className="flex flex-wrap gap-1">
                  {(Array.isArray(agent.capabilities) ? agent.capabilities : []).map((cap, i) => (
                    <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#141d30] text-cyan-300 border border-[#1e293b]">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1e293b] text-xs font-mono">
                <button
                  onClick={() => handleInspect(agent.id)}
                  className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Inspect</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                <div className="flex items-center gap-1.5">
                  {isReady ? (
                    <button
                      onClick={() => handleSetStatus(agent.id, 'TERMINATED')}
                      disabled={mutatingId === agent.id}
                      className="px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[10px] flex items-center gap-1"
                      title="Terminate agent execution"
                    >
                      <PowerOff className="w-3 h-3" />
                      <span>Disable</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSetStatus(agent.id, 'READY')}
                      disabled={mutatingId === agent.id}
                      className="px-2 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-[10px] flex items-center gap-1"
                      title="Activate agent to ready state"
                    >
                      <Power className="w-3 h-3" />
                      <span>Enable</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Agent Drawer / Inspector */}
      {selectedAgent && (
        <div className="bg-[#0d1322] border border-cyan-500/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <div>
                <h2 className="text-sm font-mono font-bold text-slate-100">
                  Inspecting: {selectedAgent.name} ({selectedAgent.id})
                </h2>
                <div className="text-[10px] text-slate-400 font-mono">
                  State history and authoritative execution trace
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedAgent(null)}
              className="text-xs font-mono text-slate-400 hover:text-slate-200"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Executions */}
            <div className="bg-[#070b14] border border-[#1e293b] rounded-lg p-3">
              <div className="text-xs font-mono text-slate-300 font-semibold mb-2">
                Recent Executions by this Agent
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs font-mono">
                {selectedAgent.recentExecutions?.length === 0 ? (
                  <div className="text-slate-500 text-[11px]">No executions recorded yet.</div>
                ) : (
                  selectedAgent.recentExecutions?.map((ex: any) => (
                    <div
                      key={ex.id}
                      onClick={() => onNavigate(`/executions/${ex.id}`)}
                      className="p-2 rounded bg-[#0d1322] border border-[#1e293b] hover:border-cyan-500/40 cursor-pointer flex items-center justify-between"
                    >
                      <span className="text-slate-200">{ex.id.slice(0, 14)}</span>
                      <span className="text-emerald-300 text-[10px]">{ex.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Audit History */}
            <div className="bg-[#070b14] border border-[#1e293b] rounded-lg p-3">
              <div className="text-xs font-mono text-slate-300 font-semibold mb-2">
                Audit Trail Entries
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs font-mono">
                {selectedAgent.auditHistory?.length === 0 ? (
                  <div className="text-slate-500 text-[11px]">Zero audit records for this agent.</div>
                ) : (
                  selectedAgent.auditHistory?.map((aud: any) => (
                    <div key={aud.id} className="p-2 rounded bg-[#0d1322] border border-[#1e293b] text-[11px]">
                      <div className="text-slate-200 font-semibold">{aud.action}</div>
                      <div className="text-slate-400 text-[9px]">{new Date(aud.timestamp_utc).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Agent Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0d1322] border border-[#1e293b] rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
              <h2 className="text-sm font-mono font-bold text-slate-100 flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                Register Governed Agent
              </h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-white font-mono text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Agent Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Repository Governance Agent"
                  className="w-full bg-[#070b14] border border-[#1e293b] rounded p-2 text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Authority Role</label>
                  <select
                    value={formData.authorityRole}
                    onChange={(e) => setFormData({ ...formData, authorityRole: e.target.value })}
                    className="w-full bg-[#070b14] border border-[#1e293b] rounded p-2 text-slate-100 outline-none"
                  >
                    <option value="agent_executor">agent_executor (Bounded)</option>
                    <option value="domain_lead">domain_lead (Council)</option>
                    <option value="acc_operator">acc_operator (Operational)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Model Adapter</label>
                  <select
                    value={formData.modelAdapter}
                    onChange={(e) => setFormData({ ...formData, modelAdapter: e.target.value })}
                    className="w-full bg-[#070b14] border border-[#1e293b] rounded p-2 text-slate-100 outline-none"
                  >
                    <option value="gemini-3.8-flash">Google Gemini 3.8 Flash</option>
                    <option value="gemini-3.1-pro-preview">Google Gemini 3.1 Pro</option>
                    <option value="gpt-4o">OpenAI GPT-4o</option>
                    <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
                    <option value="grok-3">xAI Grok 3</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Capabilities (comma separated)</label>
                <input
                  type="text"
                  value={formData.capabilities}
                  onChange={(e) => setFormData({ ...formData, capabilities: e.target.value })}
                  className="w-full bg-[#070b14] border border-[#1e293b] rounded p-2 text-slate-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Max Concurrency</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.maxConcurrency}
                    onChange={(e) => setFormData({ ...formData, maxConcurrency: Number(e.target.value) })}
                    className="w-full bg-[#070b14] border border-[#1e293b] rounded p-2 text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Queue Affinity</label>
                  <input
                    type="text"
                    value={formData.queueAffinity}
                    onChange={(e) => setFormData({ ...formData, queueAffinity: e.target.value })}
                    className="w-full bg-[#070b14] border border-[#1e293b] rounded p-2 text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-3 py-1.5 rounded bg-[#070b14] text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
