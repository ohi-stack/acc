import React from 'react';
import {
  BrainCircuit,
  BookOpenCheck,
  GitBranch,
  History,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow
} from 'lucide-react';

const memoryClasses = [
  ['Institutional Memory', 'Approved authority records, chronology, standards, policies, and canonical documentation.'],
  ['Lived Experience', 'User-supplied or explicitly authorized real-world events and context.'],
  ['Decision Memory', 'Problem, alternatives, constraints, choice, stated reasoning, action, and measured outcome.'],
  ['Outcome Learning', 'Verified outcomes converted into reviewable learning proposals before durable update.'],
  ['Current State', 'Newest verified and approved priorities, constraints, roles, preferences, and operating posture.']
];

const epistemicClasses = [
  ['FACT', 'Established by an approved source, direct record, or verified external result.'],
  ['USER STATEMENT', 'What the human explicitly said, wanted, believed, intended, corrected, or instructed.'],
  ['INFERENCE', 'A reasoned pattern interpretation that remains an inference until confirmed or superseded.'],
  ['PREDICTION', 'A probabilistic expectation about a future preference or choice; never a fact or authority.']
];

const maturityItems = [
  ['Context snapshots', 'Contracted', 'Versioned caller-supplied Oru context is part of the governed OMOS integration target.'],
  ['Lived-experience model', 'Source implemented', 'Architecture and machine-readable contract are synchronized across OMOS and ACC sources.'],
  ['Approved-source retrieval', 'Integration target', 'Not represented as Production until source permissions, provenance, owner isolation, and tests are proven.'],
  ['ACC execution handoff', 'Integration target', 'Consequential actions remain Human-Gate approved before ACC execution.'],
  ['Outcome ingestion', 'Integration target', 'Verified external results must return to OMOS before a learning proposal is generated.'],
  ['Durable current-state editing', 'Approval gated', 'No inference or prediction may silently rewrite durable human current state.']
];

export const OruValenView: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-[#070b14] text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-7 space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-[#3b2f12] bg-gradient-to-br from-[#11101a] via-[#0d1322] to-[#070b14] p-7 shadow-2xl">
          <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[#d4af37]/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#f3cf58]">
              <span className="rounded-full border border-[#d4af37]/30 px-3 py-1">O-H-I Twin</span>
              <span className="rounded-full border border-purple-400/20 px-3 py-1 text-purple-300">OMOS governed</span>
              <span className="rounded-full border border-cyan-400/20 px-3 py-1 text-cyan-300">ACC execution</span>
            </div>
            <div className="mt-6 flex items-start gap-4">
              <div className="rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-3 text-[#f3cf58]"><BrainCircuit className="h-8 w-8" /></div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">Oru’Valen™ Twin Console</h1>
                <p className="mt-3 max-w-4xl text-sm md:text-base leading-7 text-slate-300">The personalized continuity and context layer for OneGodian operational intelligence. Oru preserves approved history, lived experience, decisions, outcomes, corrections, and current-state context so OMOS can reason with continuity while ACC performs only authorized execution.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[#1e293b] bg-[#0d1322] p-5">
            <div className="flex items-center gap-2 text-[#f3cf58]"><BookOpenCheck className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">Oru’Valen</span></div>
            <h2 className="mt-3 text-lg font-semibold text-white">Continuity + context</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Memory classes, corrections, lived-experience records, decision history, learning proposals, and approved current state.</p>
          </div>
          <div className="rounded-xl border border-purple-500/20 bg-[#0d1322] p-5">
            <div className="flex items-center gap-2 text-purple-300"><GitBranch className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">OMOS</span></div>
            <h2 className="mt-3 text-lg font-semibold text-white">Governed reasoning</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Distillation, alignment, Council synthesis, Human Gate, Decision Records, provenance, persistence, and audit.</p>
          </div>
          <div className="rounded-xl border border-cyan-500/20 bg-[#0d1322] p-5">
            <div className="flex items-center gap-2 text-cyan-300"><Workflow className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">ACC</span></div>
            <h2 className="mt-3 text-lg font-semibold text-white">Authorized execution</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Approved tools, agents, workflows, connectors, deployments, verification, external effects, and outcome reporting.</p>
          </div>
        </section>

        <section className="rounded-xl border border-[#1e293b] bg-[#0d1322] p-5">
          <div className="flex items-center gap-2"><Workflow className="h-5 w-5 text-[#d4af37]" /><h2 className="text-lg font-semibold text-white">Canonical governed loop</h2></div>
          <div className="mt-4 overflow-x-auto rounded-lg border border-[#1e293b] bg-[#070b14] p-4 font-mono text-xs leading-6 text-[#f3cf58]">
            Human input or authorized evidence → Oru context snapshot → OMOS governed reasoning → Council / synthesis → Human Gate → Decision Record → ACC authorized execution → verification / audit → outcome → proposed Oru learning → human-approved memory/current-state update
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2"><History className="h-5 w-5 text-[#d4af37]" /><h2 className="text-lg font-semibold text-white">Memory architecture</h2></div>
          <p className="mt-2 text-sm text-slate-400">The Twin learns through explicit record classes rather than treating every conversation or model inference as durable truth.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {memoryClasses.map(([title, description]) => (
              <article key={title} className="rounded-xl border border-[#1e293b] bg-[#0d1322] p-4">
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2"><Target className="h-5 w-5 text-purple-300" /><h2 className="text-lg font-semibold text-white">Fact is not inference</h2></div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {epistemicClasses.map(([title, description]) => (
              <article key={title} className="rounded-xl border border-purple-500/15 bg-[#0d1322] p-4">
                <div className="text-[10px] font-mono font-bold tracking-[0.18em] text-purple-300">{title}</div>
                <p className="mt-2 text-xs leading-5 text-slate-400">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 rounded-lg border-l-2 border-[#d4af37] bg-[#d4af37]/5 px-4 py-3 text-xs leading-5 text-slate-300">Direct human correction has higher authority than a prior model inference about that human. Historical records remain preserved; a newer verified and approved state may supersede an earlier current-state assumption.</div>
        </section>

        <section>
          <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-cyan-300" /><h2 className="text-lg font-semibold text-white">Integration maturity</h2></div>
          <div className="mt-4 overflow-hidden rounded-xl border border-[#1e293b] bg-[#0d1322]">
            <div className="grid grid-cols-[1.1fr_.75fr_2fr] gap-3 border-b border-[#1e293b] bg-[#101829] px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-slate-400"><span>Capability</span><span>Status</span><span>Boundary</span></div>
            {maturityItems.map(([capability, status, boundary]) => (
              <div key={capability} className="grid grid-cols-[1.1fr_.75fr_2fr] gap-3 border-b border-[#1e293b]/70 px-4 py-3 text-xs last:border-b-0">
                <span className="font-medium text-slate-200">{capability}</span>
                <span className="font-mono text-[#f3cf58]">{status}</span>
                <span className="leading-5 text-slate-400">{boundary}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex items-center gap-2 text-emerald-300"><ShieldCheck className="h-5 w-5" /><h2 className="font-semibold">Authority boundary</h2></div>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-300">
              <li>• Human authority remains final.</li>
              <li>• Oru does not impersonate the founder, legal owner, governing authority, or final decision-maker.</li>
              <li>• High-risk execution remains Human-Gate and ACC approval controlled.</li>
              <li>• Durable memory/current-state changes must be attributable, versioned, reviewable, and approved under policy.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 text-amber-300"><ShieldCheck className="h-5 w-5" /><h2 className="font-semibold">Privacy boundary</h2></div>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-300">
              <li>• Lived Experience does not imply background surveillance.</li>
              <li>• Only user-supplied or explicitly authorized sources may contribute context.</li>
              <li>• Restricted financial, health, identity, legal, and private-contact records require access controls.</li>
              <li>• Connector read access does not imply write authority.</li>
            </ul>
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1e293b] bg-[#0d1322] px-5 py-4 text-xs text-slate-400">
          <span>Canonical Oru architecture: <a className="text-[#f3cf58] hover:underline" href="https://omos.onegodian.com/oru/" target="_blank" rel="noreferrer">OMOS.OneGodian.com/oru/</a></span>
          <span>Machine profile: <a className="text-[#f3cf58] hover:underline" href="https://omos.onegodian.com/api/oru.json" target="_blank" rel="noreferrer">/api/oru.json</a></span>
        </section>
      </div>
    </div>
  );
};
