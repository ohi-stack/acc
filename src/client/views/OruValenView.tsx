import React from 'react';
import {
  Brain,
  Database,
  History,
  ShieldCheck,
  ExternalLink,
  Layers3,
  FileCheck2,
  UserRoundCheck
} from 'lucide-react';

export const OruValenView: React.FC = () => {
  const systems = [
    {
      title: 'Institutional Memory',
      description: 'Authoritative OneGodian chronology, entities, terminology, architecture, policies, and records.',
      icon: Database,
      status: 'Connected by contract'
    },
    {
      title: 'Lived Experience',
      description: 'Structured event → context → decision → action → outcome → lesson records where authorized.',
      icon: History,
      status: 'Controlled source'
    },
    {
      title: 'Decision Memory',
      description: 'Preserves decisions, constraints, stated reasons, outcomes, and later corrections without manufacturing authority.',
      icon: FileCheck2,
      status: 'Human-governed'
    },
    {
      title: 'Current-State Model',
      description: 'Tracks what is true now while preserving older states as historical context rather than current fact.',
      icon: Layers3,
      status: 'Versioned'
    }
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-6 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2.5">
            <Brain className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-display font-bold text-slate-100">Oru’Valen™ Intelligence Twin</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-500/30">
              DECISION SUPPORT
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1.5 max-w-3xl">
            Oru’Valen is the OHI Twin that learns, remembers, reasons, and assists across the OneGodian ecosystem while remaining subordinate to authorized human judgment.
          </p>
        </div>
        <a
          href="https://omos.onegodian.com"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1322] border border-[#1e293b] text-xs font-mono text-slate-300 hover:text-white hover:border-purple-500/40 transition-all"
        >
          OMOS Node <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems.map(({ title, description, icon: Icon, status }) => (
          <div key={title} className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-wide text-slate-400 border border-[#26324a] rounded px-2 py-0.5">
                {status}
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">{description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-mono font-semibold text-slate-200">Authority Boundary</h2>
          </div>
          <div className="text-xs text-slate-400 leading-relaxed space-y-2">
            <p>Oru’Valen may recommend, summarize, model preferences, and prepare execution requests.</p>
            <p className="text-slate-200">Oru’Valen does not own, govern, self-authorize, or replace the human authority of One Gregory Onegodian™.</p>
            <p>Privileged actions continue through ACC governance, approvals, policy checks, execution controls, and audit logging.</p>
          </div>
        </div>

        <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <UserRoundCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-mono font-semibold text-slate-200">Canonical Learning Loop</h2>
          </div>
          <div className="font-mono text-[11px] leading-7 text-slate-300">
            LIVE → CAPTURE → VERIFY → CLASSIFY → REMEMBER → DETECT PATTERNS → PREDICT → RECOMMEND → ACT WITH AUTHORITY → MEASURE → LEARN
          </div>
        </div>
      </div>
    </div>
  );
};
