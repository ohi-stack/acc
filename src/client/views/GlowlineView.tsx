import React from 'react';
import { Lightbulb, Footprints, House, Building2, TentTree, Route, MonitorSmartphone, Gamepad2, ShieldCheck, FlaskConical } from 'lucide-react';

const products = [
  ['Glowline Path™', 'Private-property pedestrian paths, entrances and accessibility routes', 'V1 PRIORITY', Footprints],
  ['Glowline Home™', 'Residential driveway, stair, landscape and perimeter illumination', 'PLANNED', House],
  ['Glowline Event™', 'Temporary illuminated routes and branded environments', 'PLANNED', TentTree],
  ['Glowline Building™', 'Architectural edge lighting and directional systems', 'PLANNED', Building2],
  ['Glowline Safety™', 'Emergency, evacuation and hazard-identification guidance', 'PLANNED', ShieldCheck],
  ['Glowline Transit / Road™', 'Parking, vehicle and transportation guidance; engineering review required', 'R&D', Route],
  ['Glowline Digital™', 'ACC, website and application navigation language', 'PLANNED', MonitorSmartphone],
  ['Glowline Onegodia™', 'In-world navigation and environmental storytelling system', 'CONCEPT', Gamepad2],
] as const;

export const GlowlineView: React.FC = () => (
  <div className="h-full overflow-y-auto p-6 lg:p-8 bg-[#070b14]">
    <div className="max-w-7xl mx-auto space-y-6">
      <section className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#101224] via-[#0b1020] to-[#171022] p-7 shadow-2xl">
        <div className="flex items-center gap-3 text-purple-300 text-xs font-mono uppercase tracking-[0.2em]"><Lightbulb className="w-4 h-4"/> OHI-X™ • Product Systems • Glowline</div>
        <h1 className="mt-4 text-3xl lg:text-4xl font-semibold text-white">OHI-X Glowline™</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Intelligent Illumination, Guidance & Environmental Wayfinding Systems. ACC tracks Glowline as a governed product-development program from concept through prototype, validation, deployment and operations.</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-200"><FlaskConical className="w-3.5 h-3.5"/> Current stage: Product definition / prototype planning</div>
      </section>

      <section className="grid md:grid-cols-4 gap-3">
        {[['V1 Product','Glowline Path™'],['Architecture','Physical → Control → Intelligence → Management'],['Commercial Owner','ONEGODIAN, LLC'],['Production Rule','Validate before capability claims']].map(([k,v]) => <div key={k} className="rounded-xl border border-slate-800 bg-[#0d1322] p-4"><div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{k}</div><div className="mt-2 text-sm text-slate-100">{v}</div></div>)}
      </section>

      <section>
        <div className="mb-3"><h2 className="text-lg font-semibold">Product Family</h2><p className="text-xs text-slate-400">Stage labels distinguish planned capabilities from validated production systems.</p></div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
          {products.map(([name,desc,status,Icon]) => <article key={name} className="rounded-xl border border-slate-800 bg-[#0d1322] p-4 hover:border-purple-500/40 transition-colors"><div className="flex justify-between gap-3"><Icon className="w-5 h-5 text-purple-400"/><span className="text-[9px] font-mono text-amber-300">{status}</span></div><h3 className="mt-4 text-sm font-semibold">{name}</h3><p className="mt-2 text-xs leading-5 text-slate-400">{desc}</p></article>)}
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#0d1322] p-5"><h2 className="font-semibold">Glowline Path™ V1 Definition of Done</h2><div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300">{['Product specification','Working prototype','Bill of materials','Installation method','Controller specification','Safety requirements','Brand / IP record','Pricing model','Demo installation','Product page + sales materials','Repeatable installation procedure','Validation record'].map(x=><div key={x} className="rounded-lg bg-[#070b14] border border-slate-800 px-3 py-2">○ {x}</div>)}</div></div>
        <div className="rounded-xl border border-slate-800 bg-[#0d1322] p-5"><h2 className="font-semibold">ACC Governance Boundary</h2><p className="mt-3 text-xs leading-6 text-slate-400">ACC may register specifications, tasks, approvals, deployments, verification evidence and operational status. OHI-X intelligence, quantum behavior, safety performance or autonomous capabilities must remain marked planned/R&D until implemented and validated. Final pricing, safety acceptance, regulated deployment and legally operative approvals remain human-controlled.</p></div>
      </section>
    </div>
  </div>
);
