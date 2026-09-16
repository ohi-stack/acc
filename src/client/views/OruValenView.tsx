import React from 'react';
import {
  BrainCircuit,
  ShieldCheck,
  BookOpen,
  Database,
  GitBranch,
  Activity,
  ExternalLink,
  ArrowRight,
  LockKeyhole,
  Scale,
  Workflow,
  History,
  CircleDot
} from 'lucide-react';

interface OruValenViewProps {
  onNavigate: (route: string) => void;
}

const memoryLayers = [
  ['Institutional Memory', 'Authoritative OneGodian records, chronology, entities, systems, and standards.', BookOpen],
  ['Lived Experience', 'Event → context → decision → action → outcome → lesson.', History],
  ['Decision Memory', 'Problems, options, constraints, choices, reasoning, outcomes, and revisions.', GitBranch],
  ['Current-State Model', 'What is true now: priorities, active work, constraints, commitments, and risks.', Database],
  ['Execution Intelligence', 'Routes approved work through ACC tools, agents, workflows, and deployment gates.', Workflow]
] as const;

const evidenceClasses = [
  ['FACT', 'Evidence-supported record.'],
  ['STATED POSITION', 'Explicit human statement, preference, or intent.'],
  ['INFERENCE', 'Pattern-based conclusion with confidence and supporting evidence.'],
  ['PREDICTION', 'Forecast of likely preference or action; never authority.']
] as const;

export const OruValenView: React.FC<OruValenViewProps> = ({ onNavigate }) => {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-2xl border border-purple-500/25 bg-gradient-to-br from-[#0d1322] via-[#0a1020] to-[#130d22] p-6 shadow-2xl shadow-purple-950/20">
          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl border border-purple-400/30 bg-purple-500/10 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-purple-300 font-mono">O-H-I Twin • ACC Control Plane</div>
                  <h1 className="text-2xl font-bold text-slate-100">Oru’Valen™</h1>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-300">
                Operational intelligence twin for knowledge continuity, lived-experience learning, decision support,
                workflow coordination, and authorized execution. Human authority remains final.
              </p>
              <div className="mt-4 rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/5 px-4 py-3 text-xs text-slate-300">
                <span className="font-semibold text-[#e7c766]">Governing rule:</span>{' '}
                Preserve identity. Respect chronology. Learn from reality. Separate fact from inference. Protect authority.
                Verify records. Measure outcomes. Execute only within authorized boundaries.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 min-w-[330px]">
              <div className="rounded-xl border border-emerald-500/25 bg-emerald-950/20 p-3">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold"><ShieldCheck className="w-4 h-4" /> Human Authority</div>
                <div className="mt-2 text-[11px] text-slate-400">Final decision-maker</div>
              </div>
              <div className="rounded-xl border border-cyan-500/25 bg-cyan-950/20 p-3">
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold"><Activity className="w-4 h-4" /> ACC Runtime</div>
                <div className="mt-2 text-[11px] text-slate-400">Execution control plane</div>
              </div>
              <div className="rounded-xl border border-purple-500/25 bg-purple-950/20 p-3">
                <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold"><BrainCircuit className="w-4 h-4" /> OMOS</div>
                <div className="mt-2 text-[11px] text-slate-400">Governed reasoning layer</div>
              </div>
              <div className="rounded-xl border border-amber-500/25 bg-amber-950/20 p-3">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold"><LockKeyhole className="w-4 h-4" /> Approval Gate</div>
                <div className="mt-2 text-[11px] text-slate-400">High-risk actions gated</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {memoryLayers.map(([title, description, Icon]) => (
            <article key={title} className="rounded-xl border border-[#1e293b] bg-[#0d1322] p-4 hover:border-purple-500/30 transition-colors">
              <Icon className="w-4 h-4 text-purple-300" />
              <h2 className="mt-3 text-xs font-semibold text-slate-200">{title}</h2>
              <p className="mt-2 text-[11px] leading-5 text-slate-400">{description}</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <article className="rounded-xl border border-[#1e293b] bg-[#0d1322] p-5">
            <div className="flex items-center gap-2 border-b border-[#1e293b] pb-3">
              <Scale className="w-4 h-4 text-[#d4af37]" />
              <h2 className="text-sm font-semibold text-slate-200">Evidence Classes</h2>
            </div>
            <div className="mt-4 space-y-3">
              {evidenceClasses.map(([name, description]) => (
                <div key={name} className="flex gap-3 rounded-lg border border-[#1e293b] bg-[#070b14] p-3">
                  <CircleDot className="mt-0.5 w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono font-bold tracking-wide text-cyan-300">{name}</div>
                    <div className="mt-1 text-[11px] text-slate-400">{description}</div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-[#1e293b] bg-[#0d1322] p-5">
            <div className="flex items-center gap-2 border-b border-[#1e293b] pb-3">
              <Workflow className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-slate-200">Canonical Operating Loop</h2>
            </div>
            <div className="mt-4 text-xs font-mono leading-7 text-slate-300">
              LIVE → CAPTURE → VERIFY → CLASSIFY → REMEMBER → DETECT PATTERNS → PREDICT → RECOMMEND →
              ACT WITH AUTHORITY → MEASURE → LEARN
            </div>
            <p className="mt-4 text-[11px] leading-5 text-slate-400">
              Oru’Valen may model preferences and likely decisions, but inference and prediction never become authority.
              Material execution remains permissioned and auditable through ACC.
            </p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onClick={() => onNavigate('/approvals')} className="flex items-center justify-between rounded-lg border border-amber-500/25 bg-amber-950/20 px-3 py-2.5 text-xs text-amber-200 hover:border-amber-400/50">
                <span>Human Authorization Queue</span><ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onNavigate('/audit')} className="flex items-center justify-between rounded-lg border border-cyan-500/25 bg-cyan-950/20 px-3 py-2.5 text-xs text-cyan-200 hover:border-cyan-400/50">
                <span>Audit & Provenance</span><ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onNavigate('/engineering-council')} className="flex items-center justify-between rounded-lg border border-purple-500/25 bg-purple-950/20 px-3 py-2.5 text-xs text-purple-200 hover:border-purple-400/50">
                <span>Engineering Council</span><ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onNavigate('/connections')} className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#070b14] px-3 py-2.5 text-xs text-slate-300 hover:border-slate-500/50">
                <span>Connected Systems</span><ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        </section>

        <section className="rounded-xl border border-[#1e293b] bg-[#0d1322] p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">Architecture Boundary</h2>
              <p className="mt-2 text-[11px] leading-5 text-slate-400 max-w-4xl">
                Oru’Valen provides continuity and context. OMOS provides governed reasoning and Decision Records.
                ACC controls authorized execution. External agents remain separate registry entries and do not redefine Oru’Valen as an AI agent.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="https://omos.onegodian.com/oru/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/20 px-3 py-2 text-[11px] text-purple-200 hover:border-purple-400/60">
                Oru Architecture <ExternalLink className="w-3 h-3" />
              </a>
              <a href="https://omos.onegodian.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/20 px-3 py-2 text-[11px] text-cyan-200 hover:border-cyan-400/60">
                OMOS <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
