import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  Activity,
  ExternalLink,
  Zap
} from 'lucide-react';
import { api } from '../api';
import { ConnectionItem } from '../types';

export const ConnectionsView: React.FC = () => {
  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);

  const loadConnections = async () => {
    try {
      setLoading(true);
      const data = await api.getConnections();
      setConnections(data);
    } catch (err) {
      console.error('Failed to load connections', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  const handleTest = async (id: string) => {
    try {
      setTestingId(id);
      const res = await api.testConnection(id);
      await loadConnections();
      alert(`Connection ${id} test passed! Latency: ${res.latencyMs}ms`);
    } catch (err: any) {
      alert(`Connection test failed: ${err.message}`);
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-cyan-400" />
            Connection Registry & Integrations
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            External platform connections: GitHub, OMOS, QR-V, OBP-1, PostgreSQL, WordPress, and messaging gateways.
          </p>
        </div>

        <button
          onClick={loadConnections}
          disabled={loading}
          className="p-2 rounded-lg bg-[#0d1322] border border-[#1e293b] text-slate-300 hover:text-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Connections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((conn) => {
          const isHealthy = conn.health === 'Healthy';
          const isAuthReq = conn.health === 'Authorization Required';

          return (
            <div
              key={conn.id}
              className="bg-[#0d1322] border border-[#1e293b] hover:border-cyan-500/40 rounded-xl p-4 space-y-3 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <span>{conn.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">v{conn.version}</span>
                    </h2>
                    <div className="text-[10px] font-mono text-slate-500">{conn.platform} • {conn.connection_class}</div>
                  </div>

                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-semibold ${
                    isHealthy ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    isAuthReq ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {conn.health}
                  </span>
                </div>

                {/* Specs Box */}
                <div className="bg-[#070b14] p-2.5 rounded-lg border border-[#1e293b]/60 text-[11px] font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Protocol:</span>
                    <span className="text-cyan-300">{conn.protocol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Auth Method:</span>
                    <span className="text-slate-300">{conn.auth_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Human Approval:</span>
                    <span className={conn.requires_human_approval ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                      {conn.requires_human_approval ? 'Mandatory' : 'Optional'}
                    </span>
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-1 text-[10px] font-mono">
                  <div className="text-slate-400">Write Permissions:</div>
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(conn.write_permissions) ? conn.write_permissions : []).map((perm, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-[#141d30] text-amber-300 border border-amber-500/20">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-slate-500">
                  {conn.last_successful_operation ? 'Verified live' : 'Ready'}
                </span>
                <button
                  onClick={() => handleTest(conn.id)}
                  disabled={testingId === conn.id}
                  className="px-2.5 py-1 rounded bg-[#070b14] hover:bg-[#141d30] border border-[#1e293b] text-cyan-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Zap className={`w-3 h-3 ${testingId === conn.id ? 'animate-bounce text-cyan-400' : ''}`} />
                  <span>{testingId === conn.id ? 'Testing...' : 'Test Ping'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
