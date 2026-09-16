import React from 'react';
import {
  Brain,
  Database,
  History,
  ShieldCheck,
  ExternalLink,
  Layers3,
  FileCheck2,
  UserRoundCheck,
  Repeat2,
  UsersRound,
  WalletCards,
  Sparkles
} from 'lucide-react';

export const OruValenView: React.FC = () => {
  const systems = [
    {
      title: 'Institutional Memory',
      description: 'Approved OneGodian chronology, entities, terminology, architecture, policies, standards, and records.',
      icon: Database,
      status: 'Approved records'
    },
    {
      title: 'Lived Experience',
      description: 'Authorized event → context → decision → stated reason → action → result → later outcome → proposed lesson records.',
      icon: History,
      status: 'Controlled source'
    },
    {
      title: 'Decision Memory',
      description: 'Preserves problems, alternatives, constraints, choices, stated reasoning, outcomes, revisions, and corrections.',
      icon: FileCheck2,
      status: 'Human-governed'
    },
    {
      title: 'Behavior & Routine',
      description: 'Repeated operating patterns and bottlenecks inferred only from authorized evidence and kept separate from verified fact.',
      icon: Repeat2,
      status: 'Evidence-based'
    },
    {
      title: 'Relationship Context',
      description: 'Factual, access-controlled records of relevant people, roles, interactions, and commitments without speculative profiling.',
      icon: UsersRound,
      status: 'Restricted where needed'
    },
    {
      title: 'Economic Reality',
      description: 'Permissioned evidence about what produces or consumes resources. Financial records remain restricted and purpose-limited.',
      icon: WalletCards,
      status: 'Restricted'
    },
    {
      title: 'Preferences & Judgment',
      description: 'Repeated approvals, rejections, corrections, and choices used to identify durable preferences without replacing human judgment.',
      icon: Sparkles,
      status: 'Reviewable inference'
    },
    {
      title: 'Lessons & Operating Rules',
      description: 'Outcome-derived learning proposals that remain reviewable before they become durable memory or current-state rules.',
      icon: Brain,
      status: 'Approval-gated'
    },
    {
      title: 'Current-State Model',
      description: 'Tracks the newest verified and approved priorities, constraints, roles, commitments, preferences, and risks while preserving history.',
      icon: Layers3,
      status: 'Versioned'
    }
  ];

  const evidenceClasses = [
    ['FACT', 'Established by an approved source, direct record, or verified external result.'],
    ['USER STATEMENT', 'What the human explicitly said, wanted, believed, intended, instructed, or corrected at that time.'],
    ['INFERENCE', 'A reasoned interpretation of a pattern in evidence; it remains an inference unless confirmed or superseded.'],
    ['PREDICTION', 'A probabilistic expectation about a future preference or action; never fact or authority.']
  ];

  const maturity = [
    ['Oru architecture surface', 'Implemented in ACC source'],
    ['Lived Experience contract', 'Implemented in synchronized source contract'],
    ['Approved-source automatic retrieval', 'Integration target'],
    ['Automatic memory injection', 'Integration target'],
    ['ACC execution handoff bound to Oru provenance', 'Integration target'],
    ['Outcome ingestion / learning proposals', 'Integration target'],
    ['Authenticated durable current-state editing', 'Integration target'],
    ['Complete digital-twin learning loop', 'Not claimed Production']
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-6 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2.5">
            <Brain className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-display font-bold text-slate-100">Oru’Valen™ Intelligence Twin</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/50 text-purple-300 border border-purple-500/30">
              O-H-I TWIN
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1.5 max-w-4xl">
            Oru’Valen is the personalized continuity/context layer that preserves approved history, lived experience, decisions, outcomes, corrections, and current-state context so OMOS can reason with continuity while ACC executes only authorized actions.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <a
            href="https://omos.onegodian.com/oru/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1322] border border-[#1e293b] text-xs font-mono text-slate-300 hover:text-white hover:border-purple-500/40 transition-all"
          >
            Oru Architecture <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://omos.onegodian.com/api/oru.json"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1322] border border-[#1e293b] text-xs font-mono text-slate-300 hover:text-white hover:border-purple-500/40 transition-all"
          >
            Machine Profile <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <UserRoundCheck className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-mono font-semibold text-slate-200">Canonical Governed Loop</h2>
        </div>
        <div className="font-mono text-[11px] leading-7 text-[#f3cf58] overflow-x-auto">
          HUMAN INPUT OR AUTHORIZED EVIDENCE → ORU CONTEXT SNAPSHOT → OMOS GOVERNED REASONING → COUNCIL / SYNTHESIS → HUMAN GATE → DECISION RECORD → ACC AUTHORIZED EXECUTION → VERIFICATION / AUDIT → OUTCOME → PROPOSED ORU LEARNING → HUMAN-APPROVED MEMORY / CURRENT-STATE UPDATE
        </div>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-mono font-semibold text-slate-200">Memory Architecture</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {systems.map(({ title, description, icon: Icon, status }) => (
            <div key={title} className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
                </div>
                <span className="text-[9px] font-mono uppercase tracking-wide text-slate-400 border border-[#26324a] rounded px-2 py-0.5">
                  {status}
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <FileCheck2 className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-mono font-semibold text-slate-200">Fact Is Not Inference</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {evidenceClasses.map(([title, description]) => (
            <div key={title} className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-4">
              <div className="text-[10px] font-mono font-bold tracking-[0.16em] text-cyan-300">{title}</div>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border-l-2 border-[#d4af37] bg-[#d4af37]/5 px-4 py-3 text-xs leading-5 text-slate-300">
          Direct human correction has higher authority than a prior model inference about that human. Historical records remain preserved; newer verified and approved state may supersede an earlier current-state assumption.
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-mono font-semibold text-slate-200">Authority & Privacy Boundary</h2>
          </div>
          <div className="text-xs text-slate-400 leading-relaxed space-y-2">
            <p>Oru’Valen may provide context, continuity, pattern analysis, inference, prediction, proposed learning, and decision support.</p>
            <p className="text-slate-200">Oru’Valen does not own, govern, self-authorize, impersonate the founder, or replace authorized human judgment.</p>
            <p>Lived Experience does not imply background surveillance. Only user-supplied or explicitly authorized sources may contribute context.</p>
            <p>Restricted financial, health, legal, identity, private-contact, and credential data require appropriate access controls. Connector read access never implies write authority.</p>
          </div>
        </div>

        <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Layers3 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-mono font-semibold text-slate-200">Integration Maturity</h2>
          </div>
          <div className="space-y-2">
            {maturity.map(([capability, status]) => (
              <div key={capability} className="flex items-center justify-between gap-4 border-b border-[#1e293b]/70 pb-2 last:border-0 last:pb-0">
                <span className="text-xs text-slate-300">{capability}</span>
                <span className="text-[10px] font-mono text-[#f3cf58] text-right">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#0d1322] border border-purple-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <h2 className="text-sm font-mono font-semibold text-slate-200">Outcome Learning Rule</h2>
        </div>
        <p className="text-xs leading-relaxed text-slate-400">
          Verified execution outcomes should return through ACC and OMOS provenance before Oru creates a learning proposal. A learning proposal is reviewable evidence, not an automatic durable self-rewrite; durable memory/current-state changes remain attributable, versioned, and approval-gated.
        </p>
      </div>
    </div>
  );
};
