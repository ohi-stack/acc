import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  Hash,
  Terminal,
  Cpu
} from 'lucide-react';
import { api } from '../api';
import { Execution } from '../types';

interface ExecutionsViewProps {
  initialExecutionId?: string;
}

export const ExecutionsView: React.FC<ExecutionsViewProps> = ({ initialExecutionId }) => {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [selectedTrace, setSelectedTrace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadExecutions = async () => {
    try {
      setLoading(true);
      const data = await api.getExecutions();
      setExecutions(data);
      if (initialExecutionId) {
        handleInspect(initialExecutionId);
      }
    } catch (err) {
      console.error('Failed to load executions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExecutions();
  }, [initialExecutionId]);

  const handleInspect = async (id: string) => {
    try {
      const trace = await api.getExecutionTrace(id);
      setSelectedTrace(trace);
    } catch (err: any) {
      alert(`Failed to load execution trace: ${err.message}`);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-cyan-400" />
            Execution Traces & Pipeline Provenance
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            11-stage immutable pipeline verification with input/output SHA-256 digests and cryptographic signatures.
          </p>
        </div>

        <button
          onClick={loadExecutions}
          disabled={loading}
          className="p-2 rounded-lg bg-[#0d1322] border border-[#1e293b] text-slate-300 hover:text-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Main Layout: List on Left, Trace Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Executions Table (5 cols on lg) */}
        <div className="lg:col-span-5 bg-[#0d1322] border border-[#1e293b] rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 bg-[#070b14] border-b border-[#1e293b] text-xs font-mono text-slate-400 font-semibold">
            Recorded Executions ({executions.length})
          </div>

          <div className="divide-y divide-[#1e293b] overflow-y-auto max-h-[600px]">
            {executions.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-slate-500">
                No executions recorded yet.
              </div>
            ) : (
              executions.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => handleInspect(ex.id)}
                  className={`p-3 cursor-pointer hover:bg-[#141d30] transition-colors space-y-1 ${
                    selectedTrace?.execution?.id === ex.id ? 'bg-[#141d30] border-l-2 border-cyan-400' : ''
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-200">{ex.id.slice(0, 14)}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                      ex.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      ex.status === 'RUNNING' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse' :
                      ex.status === 'ESCALATED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {ex.status}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Task: {ex.task_type || 'task_run'}</span>
                    <span className="text-purple-300">{ex.model}</span>
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                    <span>{ex.duration_ms ? `${ex.duration_ms}ms` : 'active'}</span>
                    <span>{new Date(ex.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Trace Inspector (7 cols on lg) */}
        <div className="lg:col-span-7 bg-[#0d1322] border border-[#1e293b] rounded-xl p-5 space-y-5">
          {!selectedTrace ? (
            <div className="py-20 text-center text-xs font-mono text-slate-500">
              Select an execution from the left list to inspect its 11-stage audit trace.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
                <div>
                  <h2 className="text-sm font-mono font-bold text-slate-100 flex items-center gap-2">
                    <span>Trace: {selectedTrace.execution.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {selectedTrace.execution.status}
                    </span>
                  </h2>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    Model: <span className="text-purple-300">{selectedTrace.execution.model}</span> • Provider: <span className="text-cyan-300">{selectedTrace.execution.provider}</span> • Duration: {selectedTrace.execution.duration_ms}ms
                  </div>
                </div>
              </div>

              {/* 11-Stage Progression */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-300 font-semibold uppercase">
                  11-Stage Pipeline Progression
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {selectedTrace.stages?.map((stage: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded bg-[#070b14] border border-[#1e293b] flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#141d30] text-cyan-300 text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-slate-200 font-semibold">{stage.name}</div>
                          <div className="text-[10px] text-slate-500">{stage.actor}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold">
                          {stage.status}
                        </span>
                        <div className="text-[9px] text-slate-500 mt-0.5">{stage.latencyMs}ms</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cryptographic Proof Verification */}
              {selectedTrace.verification && (
                <div className="bg-[#070b14] border border-emerald-500/40 rounded-lg p-3 space-y-1.5 text-xs font-mono">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>QR-V Verification Attestation</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    Status: <span className="text-emerald-300 font-semibold">{selectedTrace.verification.status}</span>
                  </div>
                  <div className="text-slate-400 text-[10px] truncate">
                    Signature: <span className="text-cyan-300">{selectedTrace.verification.signature}</span>
                  </div>
                </div>
              )}

              {/* Output Payload */}
              <div className="bg-[#070b14] border border-[#1e293b] rounded-lg p-3 space-y-1 text-xs font-mono">
                <div className="text-slate-400 text-[10px] font-semibold uppercase">
                  Verified Output Payload
                </div>
                <pre className="text-slate-200 text-[11px] whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                  {JSON.stringify(selectedTrace.execution.output_payload, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
