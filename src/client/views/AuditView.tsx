import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  Lock, 
  Clock,
  Key,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api';
import { AuditRecordItem } from '../types';

export const AuditView: React.FC = () => {
  const [records, setRecords] = useState<AuditRecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('');

  const loadAuditRecords = async () => {
    try {
      setLoading(true);
      const data = await api.getAuditRecords(100, 0);
      setRecords(data || []);
    } catch (err) {
      console.error('Failed to load audit records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditRecords();
  }, []);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `acc-audit-ledger-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filtered = records.filter(r => {
    const matchesQuery = !filterQuery || 
      r.action.toLowerCase().includes(filterQuery.toLowerCase()) || 
      r.actor_id.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.policy_id.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesRisk = !riskFilter || r.risk_level === riskFilter;
    const matchesDecision = !decisionFilter || r.decision === decisionFilter;
    return matchesQuery && matchesRisk && matchesDecision;
  });

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-[#d4af37]" />
            Authoritative Audit Ledger
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#141d30] text-emerald-400 border border-emerald-500/30">
              Append-Only Tamper-Evident
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Cryptographic SHA-256 state tracking for every operator decision, agent mutation, model invocation, and human authorization.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadAuditRecords}
            disabled={loading}
            className="p-2 rounded-lg bg-[#0d1322] border border-[#1e293b] text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#d4af37]' : ''}`} />
          </button>
          <button
            onClick={handleExportJson}
            className="px-3.5 py-1.5 rounded-lg bg-[#141d30] hover:bg-[#1e293b] border border-[#1e293b] text-xs font-mono text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1322] border border-[#1e293b] p-3 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-[#070b14] px-3 py-1.5 rounded-lg border border-[#1e293b]">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by action, actor, or policy ID..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="bg-transparent text-slate-200 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={decisionFilter}
            onChange={(e) => setDecisionFilter(e.target.value)}
            className="bg-[#070b14] border border-[#1e293b] rounded px-2.5 py-1 text-slate-200 outline-none cursor-pointer"
          >
            <option value="">All Decisions</option>
            <option value="ALLOW">ALLOW</option>
            <option value="DENY">DENY</option>
            <option value="ESCALATE">ESCALATE</option>
          </select>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-[#070b14] border border-[#1e293b] rounded px-2.5 py-1 text-slate-200 outline-none cursor-pointer"
          >
            <option value="">All Risks</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#070b14] text-slate-400 border-b border-[#1e293b]">
              <tr>
                <th className="p-3">RECORD ID</th>
                <th className="p-3">ACTION</th>
                <th className="p-3">ACTOR</th>
                <th className="p-3">DECISION</th>
                <th className="p-3">RISK</th>
                <th className="p-3">POLICY ID</th>
                <th className="p-3">INPUT / OUTPUT SHA</th>
                <th className="p-3 text-right">TIMESTAMP (UTC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Zero audit ledger records matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-[#141d30] transition-colors">
                    <td className="p-3 font-semibold text-cyan-300">
                      {r.id.slice(0, 14)}
                    </td>
                    <td className="p-3 text-slate-200 font-medium">
                      {r.action}
                    </td>
                    <td className="p-3 text-slate-300">
                      <span className="text-[10px] text-slate-500">{r.actor_type}: </span>
                      <span>{r.actor_id}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.decision === 'ALLOW' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        r.decision === 'ESCALATE' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {r.decision}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        r.risk_level === 'CRITICAL' ? 'bg-rose-950 text-rose-300' :
                        r.risk_level === 'HIGH' ? 'bg-amber-950 text-amber-300' :
                        'bg-[#070b14] text-slate-400'
                      }`}>
                        {r.risk_level}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">
                      {r.policy_id}
                    </td>
                    <td className="p-3 text-slate-500 text-[10px] truncate max-w-[120px]">
                      in:{r.input_hash.slice(0, 8)}... out:{r.output_hash.slice(0, 8)}...
                    </td>
                    <td className="p-3 text-right text-slate-500 text-[10px]">
                      {new Date(r.timestamp_utc).toISOString().slice(11, 19)} UTC
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
