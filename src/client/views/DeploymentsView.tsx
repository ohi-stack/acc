import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  GitCommit, 
  GitBranch, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  Layers,
  RotateCcw
} from 'lucide-react';
import { api } from '../api';
import { DeploymentItem } from '../types';

export const DeploymentsView: React.FC = () => {
  const [deployments, setDeployments] = useState<DeploymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDeployments = async () => {
    try {
      setLoading(true);
      const data = await api.getDeployments();
      setDeployments(data);
    } catch (err) {
      console.error('Failed to load deployments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeployments();
  }, []);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
            <Rocket className="w-5 h-5 text-sky-400" />
            Deployment Proof & Release Attestation
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Cryptographic release records with commit SHAs, health verification, smoke tests, and rollback targets.
          </p>
        </div>

        <button
          onClick={loadDeployments}
          disabled={loading}
          className="p-2 rounded-lg bg-[#0d1322] border border-[#1e293b] text-slate-300 hover:text-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
        </button>
      </div>

      {/* Deployments Cards */}
      <div className="space-y-4">
        {deployments.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-slate-500 bg-[#0d1322] border border-[#1e293b] rounded-xl">
            No deployment records found. Execute an Engineering Council run to generate verified deployment proof.
          </div>
        ) : (
          deployments.map((dep) => (
            <div
              key={dep.id}
              className="bg-[#0d1322] border border-[#1e293b] hover:border-sky-500/40 rounded-xl p-5 space-y-4 text-xs font-mono transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-100">
                    <span className="text-sky-300">{dep.repository}</span>
                    <span className="text-slate-500">/</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                      {dep.branch}
                    </span>
                    {dep.pr_number && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#141d30] text-purple-300 border border-purple-800">
                        PR #{dep.pr_number}
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Maturity: {dep.maturity}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Environment: <span className="text-slate-200 uppercase">{dep.environment}</span> • Deployment ID: <span className="text-cyan-400">{dep.id}</span>
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-500">
                  <div className="flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(dep.deployment_start).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Hashes & Verification Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#070b14] p-3 rounded-lg border border-[#1e293b]/60">
                <div>
                  <div className="text-[10px] text-slate-500">MERGED COMMIT SHA</div>
                  <div className="text-slate-300 truncate font-mono">{dep.merged_sha}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">DEPLOYED RUNTIME SHA</div>
                  <div className="text-cyan-300 truncate font-mono">{dep.deployed_sha}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">HEALTH CHECK & SMOKE TESTS</div>
                  <div className="text-emerald-300 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{dep.health_check_status} / {dep.smoke_tests_status}</span>
                  </div>
                </div>
              </div>

              {/* Verifiable Evidence */}
              {dep.verification_evidence && (
                <div className="bg-[#070b14] p-2.5 rounded border border-[#1e293b]/60">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1">
                    Cryptographic Verification Proof
                  </div>
                  <pre className="text-slate-300 text-[11px] whitespace-pre-wrap leading-relaxed">
                    {JSON.stringify(dep.verification_evidence, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
