import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  RefreshCw, 
  AlertTriangle, 
  Lock, 
  Clock, 
  FileText,
  PauseCircle,
  AlertOctagon,
  UserCheck
} from 'lucide-react';
import { api } from '../api';
import { ApprovalRequest } from '../types';

interface ApprovalsViewProps {
  onRefreshApprovals: () => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({ onRefreshApprovals }) => {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [loading, setLoading] = useState(true);
  const [decidingId, setDecidingId] = useState<string | null>(null);
  const [emergencyFrozen, setEmergencyFrozen] = useState(false);

  const loadApprovals = async () => {
    try {
      setLoading(true);
      const data = await api.getApprovals(filter === 'ALL' ? undefined : filter);
      setApprovals(data);
    } catch (err) {
      console.error('Failed to load approvals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, [filter]);

  const handleDecision = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    const reason = prompt(`Enter rationale for ${decision}:`) || `Operator ${decision.toLowerCase()} via Authority Console`;
    try {
      setDecidingId(id);
      await api.decideApproval(id, decision, reason);
      await loadApprovals();
      onRefreshApprovals();
    } catch (err: any) {
      alert(`Decision error: ${err.message}`);
    } finally {
      setDecidingId(null);
    }
  };

  const pendingCount = approvals.filter(a => a.status === 'PENDING').length;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            Authority Governance & Human Approval Queue
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Invariable Rule: Agents must NEVER grant themselves additional authority. Privileged actions require human operator sign-off.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setEmergencyFrozen(!emergencyFrozen)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              emergencyFrozen 
                ? 'bg-rose-900 border-rose-600 text-rose-100 animate-pulse'
                : 'bg-[#0d1322] border-rose-800/60 text-rose-400 hover:bg-rose-950/40'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>{emergencyFrozen ? 'SYSTEM PAUSED (FREEZE ACTIVE)' : 'Emergency Freeze'}</span>
          </button>

          <button
            onClick={loadApprovals}
            disabled={loading}
            className="p-2 rounded-lg bg-[#0d1322] border border-[#1e293b] text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Authority Invariants Banner */}
      <div className="bg-[#0d1322] border border-amber-500/40 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-slate-200">Zero Privilege Self-Elevation</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Agents cannot modify their own roles or assign super_admin scopes.</div>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-slate-200">Dual Authorization Gates</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Production deployments and secret reads enforce explicit human approval.</div>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-slate-200">Authoritative Ledger Recording</div>
            <div className="text-[11px] text-slate-400 mt-0.5">All approval and rejection decisions are committed to append-only audit.</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 text-xs font-mono">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filter === tab
                ? 'bg-[#141d30] text-[#d4af37] font-semibold border border-[#d4af37]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab} {tab === 'PENDING' && pendingCount > 0 && `(${pendingCount})`}
          </button>
        ))}
      </div>

      {/* Approvals List */}
      <div className="space-y-3">
        {approvals.length === 0 ? (
          <div className="py-16 text-center text-slate-500 font-mono text-xs bg-[#0d1322] border border-[#1e293b] rounded-xl">
            No approval requests found in this view.
          </div>
        ) : (
          approvals.map((req) => (
            <div
              key={req.id}
              className="bg-[#0d1322] border border-[#1e293b] hover:border-slate-700 rounded-xl p-4 space-y-3 text-xs font-mono transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-100">
                    <span>{req.requested_action}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded ${
                      req.risk_level === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      req.risk_level === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    }`}>
                      {req.risk_level} RISK
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                      req.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                      req.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Resource: <span className="text-cyan-300">{req.affected_resource}</span> • Agent: <span className="text-slate-300">{req.requesting_agent}</span>
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-500">
                  <div className="flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(req.created_at).toLocaleString()}</span>
                  </div>
                  <div className="mt-0.5">Policy: {req.policy}</div>
                </div>
              </div>

              <div className="bg-[#070b14] p-3 rounded-lg border border-[#1e293b]/60 text-slate-300">
                <span className="text-slate-500 text-[10px] block mb-1">REASON / JUSTIFICATION</span>
                {req.reason}
              </div>

              {req.decided_by && (
                <div className="text-[11px] text-slate-400 bg-[#141d30]/60 p-2 rounded border border-[#1e293b] flex items-center justify-between">
                  <span>Decided by: <span className="text-slate-200 font-semibold">{req.decided_by}</span></span>
                  <span>Rationale: <span className="text-slate-200">{req.decision_reason}</span></span>
                  <span>At: {req.decided_at ? new Date(req.decided_at).toLocaleTimeString() : ''}</span>
                </div>
              )}

              {/* Action Controls for Pending Approvals */}
              {req.status === 'PENDING' && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e293b]">
                  <button
                    onClick={() => handleDecision(req.id, 'REJECTED')}
                    disabled={decidingId === req.id}
                    className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-200 flex items-center gap-1 font-semibold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Deny / Reject</span>
                  </button>
                  <button
                    onClick={() => handleDecision(req.id, 'APPROVED')}
                    disabled={decidingId === req.id}
                    className="px-4 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 border border-emerald-600 text-emerald-200 flex items-center gap-1 font-bold transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Authorize Execution</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
