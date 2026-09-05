import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  Hash, 
  Key, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { api } from '../api';
import { VerificationItem } from '../types';

export const VerificationView: React.FC = () => {
  const [verifications, setVerifications] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const data = await api.getVerifications();
      setVerifications(data);
    } catch (err) {
      console.error('Failed to load verification records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerifications();
  }, []);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            Verification Records & Attestations
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            QR-V and OMOS cryptographic attestations guaranteeing structural integrity, schema validation, and proof.
          </p>
        </div>

        <button
          onClick={loadVerifications}
          disabled={loading}
          className="p-2 rounded-lg bg-[#0d1322] border border-[#1e293b] text-slate-300 hover:text-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>

      {/* Verification List */}
      <div className="space-y-3">
        {verifications.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-slate-500 bg-[#0d1322] border border-[#1e293b] rounded-xl">
            No verification attestations recorded yet.
          </div>
        ) : (
          verifications.map((item) => (
            <div
              key={item.id}
              className="bg-[#0d1322] border border-[#1e293b] hover:border-emerald-500/40 rounded-xl p-4 space-y-3 text-xs font-mono transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-100">
                    <span className="text-emerald-300">{item.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {item.status}
                    </span>
                    <span className="text-[10px] text-cyan-400">
                      Target: {item.entity_type} ({item.entity_id})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Verifier: <span className="text-slate-200">{item.verifier_type}</span> ({item.verifier_agent_id || 'system'})
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(item.verified_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Signature */}
              {item.signature && (
                <div className="bg-[#070b14] p-2 rounded border border-[#1e293b]/60 flex items-center gap-2 text-[10px] text-slate-400">
                  <Key className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  <span className="text-slate-500">SIGNATURE:</span>
                  <span className="text-cyan-300 truncate">{item.signature}</span>
                </div>
              )}

              {/* Evidence */}
              <div className="bg-[#070b14] p-2.5 rounded border border-[#1e293b]/60 text-[11px] text-slate-300">
                <div className="text-[9px] text-slate-500 uppercase font-semibold mb-1">
                  Attested Evidence Metadata
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(item.evidence, null, 2)}
                </pre>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
