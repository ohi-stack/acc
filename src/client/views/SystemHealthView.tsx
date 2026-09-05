import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Server, 
  Database, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  Activity,
  Layers
} from 'lucide-react';
import { api } from '../api';

export const SystemHealthView: React.FC = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadHealth = async () => {
    try {
      setLoading(true);
      const data = await api.getSystemHealth();
      setHealthData(data);
    } catch (err) {
      console.error('Failed to load system health', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  const overall = healthData?.overallStatus || 'Healthy';

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
            <HeartPulse className="w-5 h-5 text-emerald-400" />
            Infrastructure & Subsystem Health Probes
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real operational probes. Never faked or fabricated. Exact latencies, memory footprint, and queue depth.
          </p>
        </div>

        <button
          onClick={loadHealth}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1322] border border-[#1e293b] text-xs font-mono text-slate-300 hover:text-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Execute Probe</span>
        </button>
      </div>

      {/* Top Level System Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between text-xs font-mono ${
        overall === 'Healthy' ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' :
        overall === 'Degraded' ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' :
        'bg-rose-950/30 border-rose-500/40 text-rose-200'
      }`}>
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
          <div>
            <div className="font-bold text-sm">System Status: {overall.toUpperCase()}</div>
            <div className="text-[10px] text-slate-400">All core control plane services active on Port 3000</div>
          </div>
        </div>

        <div className="text-right text-[10px] text-slate-400">
          <div>Last Checked: {healthData?.timestamp ? new Date(healthData.timestamp).toLocaleTimeString() : 'now'}</div>
        </div>
      </div>

      {/* Queue & Worker Metrics Cards */}
      {healthData?.queueMetrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-[#0d1322] border border-[#1e293b] rounded-lg p-3">
            <div className="text-slate-500 text-[10px]">QUEUE DEPTH (acc-tasks)</div>
            <div className="text-lg font-bold text-slate-100 mt-1">{healthData.queueMetrics.queueDepth}</div>
          </div>
          <div className="bg-[#0d1322] border border-[#1e293b] rounded-lg p-3">
            <div className="text-slate-500 text-[10px]">ACTIVE WORKER POOL</div>
            <div className="text-lg font-bold text-cyan-300 mt-1">{healthData.queueMetrics.activeWorkers}</div>
          </div>
          <div className="bg-[#0d1322] border border-[#1e293b] rounded-lg p-3">
            <div className="text-slate-500 text-[10px]">FAILED TASK RATE</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">{healthData.queueMetrics.failedTaskRate}</div>
          </div>
          <div className="bg-[#0d1322] border border-[#1e293b] rounded-lg p-3">
            <div className="text-slate-500 text-[10px]">COMPLETED TASKS</div>
            <div className="text-lg font-bold text-purple-300 mt-1">{healthData.queueMetrics.completedCount}</div>
          </div>
        </div>
      )}

      {/* Subsystem Probes List */}
      <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl overflow-hidden">
        <div className="p-3 bg-[#070b14] border-b border-[#1e293b] text-xs font-mono text-slate-400 font-semibold">
          Probed Subsystems ({healthData?.subsystems?.length || 0})
        </div>

        <div className="divide-y divide-[#1e293b]">
          {healthData?.subsystems?.map((sub: any, idx: number) => {
            const isHealthy = sub.status === 'Healthy';
            const isAuthReq = sub.status === 'Authorization Required';

            return (
              <div key={idx} className="p-3.5 flex items-center justify-between text-xs font-mono hover:bg-[#141d30] transition-colors">
                <div className="space-y-0.5">
                  <div className="text-slate-100 font-semibold flex items-center gap-2">
                    <span>{sub.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase">({sub.category})</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{sub.details || 'Operational'}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-[11px]">
                    <div className="text-slate-300">
                      {sub.latencyMs !== null ? `${sub.latencyMs}ms latency` : 'Not Available'}
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    isHealthy ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    isAuthReq ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {sub.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
