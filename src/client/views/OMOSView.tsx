import React from 'react';
import {
  Network,
  GitBranch,
  ShieldCheck,
  Server,
  FileJson,
  ExternalLink,
  Workflow,
  Activity
} from 'lucide-react';

export const OMOSView: React.FC = () => {
  const runtimeSurfaces = [
    { label: 'Reference Run', path: '/reference-run', icon: Workflow },
    { label: 'Health', path: '/api/health', icon: Activity },
    { label: 'Manifest', path: '/api/manifest', icon: FileJson },
    { label: 'Providers', path: '/api/v1/providers', icon: Network },
    { label: 'Persistence', path: '/api/v1/persistence', icon: Server }
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-6 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2.5">
            <Network className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-display font-bold text-slate-100">OMOS™ Runtime Integration</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-300 border border-cyan-500/30">
              OPERATING FRAMEWORK
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1.5 max-w-3xl">
            OMOS provides the OneGodian operating and reasoning framework. ACC remains the governed control plane for approvals, routing, execution supervision, and auditability.
          </p>
        </div>
        <a
          href="https://omos.onegodian.com"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1322] border border-[#1e293b] text-xs font-mono text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all"
        >
          Open OMOS <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {runtimeSurfaces.map(({ label, path, icon: Icon }) => (
          <a
            key={path}
            href={`https://omos.onegodian.com${path}`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#0d1322] border border-[#1e293b] hover:border-cyan-500/40 rounded-xl p-4 transition-all group"
          >
            <div className="flex items-center justify-between">
              <Icon className="w-4 h-4 text-cyan-400" />
              <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-cyan-400" />
            </div>
            <div className="mt-3 text-xs font-semibold text-slate-200">{label}</div>
            <div className="mt-1 text-[10px] font-mono text-slate-500 truncate">{path}</div>
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-mono font-semibold text-slate-200">Governed Engineering Flow</h2>
          </div>
          <div className="font-mono text-[11px] leading-7 text-slate-300">
            GitHub Issue → Task Classification → Agent Assignment → Agent Work → PR → Cross-Agent Review → Tests/CI → OMOS Review → Human Approval → Merge → Deployment Proof
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Merge is not completion. Production status requires deployment evidence and runtime verification.
          </p>
        </div>

        <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-mono font-semibold text-slate-200">Authority Chain</h2>
          </div>
          <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
            <p><span className="text-slate-200">Human authority</span> remains final for privileged actions and production approval.</p>
            <p><span className="text-slate-200">OMOS</span> organizes reasoning, alignment, provider routing, decision records, and reference runs according to implemented capability.</p>
            <p><span className="text-slate-200">ACC</span> controls governed execution through policy, approvals, adapters, runners, verification, and audit.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
