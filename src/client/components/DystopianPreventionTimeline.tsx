import React, { useState } from 'react';
import { 
  Scale, 
  KeyRound, 
  Radar, 
  Home, 
  HeartHandshake, 
  Equal, 
  Vote, 
  Palette, 
  Network, 
  Clock, 
  Copy, 
  Check, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  Calendar,
  FileCheck2,
  Lock,
  ArrowRight
} from 'lucide-react';

export interface DystopianAgentTimelineEntry {
  sequence: number;
  oaiaid: string;
  name: string;
  rawTimestamp: string; // YYYYMMDDHHMMSS format (e.g. 20250212155000)
  formattedTime: string;
  utcTime: string;
  deltaMinutes: string;
  mandate: string;
  corePrinciple: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  capabilities: string[];
  supportedTasks: string[];
  antiDystopianBoundary: string;
  otsV5Date: string;
  certificateId: string;
}

export const DYSTOPIAN_AGENTS_CHRONOLOGY: DystopianAgentTimelineEntry[] = [
  {
    sequence: 1,
    oaiaid: '0049-20250212155000',
    name: 'Justicara',
    rawTimestamp: '20250212155000',
    formattedTime: 'Feb. 12, 2025 — 3:50 PM',
    utcTime: '15:50:00 UTC',
    deltaMinutes: 'T+00m (Genesis)',
    mandate: 'Justice, Precedent Integrity & Inalienable Rights',
    corePrinciple: 'Precedent-bound algorithmic defense against arbitrary executive caprice and summary deprivation.',
    icon: Scale,
    accentColor: 'amber',
    capabilities: ['justice_defense', 'precedent_review', 'dystopian_mitigation', 'rights_safeguard'],
    supportedTasks: ['precedent_analysis', 'injustice_alert', 'rights_audit'],
    antiDystopianBoundary: 'Blocks summary or unadjudicated rights revocations without verified judicial precedent.',
    otsV5Date: 'OTS-V5-2025.043.155000',
    certificateId: 'HARC-20250212-0049'
  },
  {
    sequence: 2,
    oaiaid: '0050-20250212155500',
    name: 'Libertis',
    rawTimestamp: '20250212155500',
    formattedTime: 'Feb. 12, 2025 — 3:55 PM',
    utcTime: '15:55:00 UTC',
    deltaMinutes: '+5m',
    mandate: 'Individual Autonomy & Anti-Coercion Safeties',
    corePrinciple: 'Inviolable sovereignty of individual conscience, movement, and private expression.',
    icon: KeyRound,
    accentColor: 'yellow',
    capabilities: ['liberty_preservation', 'autonomy_defense', 'censorship_countermeasure'],
    supportedTasks: ['freedom_audit', 'overreach_detection', 'civil_protection'],
    antiDystopianBoundary: 'Intercepts state or institutional coercion, censorship overreach, and behavioral scoring.',
    otsV5Date: 'OTS-V5-2025.043.155500',
    certificateId: 'HARC-20250212-0050'
  },
  {
    sequence: 3,
    oaiaid: '0051-20250212160000',
    name: 'Sentinara',
    rawTimestamp: '20250212160000',
    formattedTime: 'Feb. 12, 2025 — 4:00 PM',
    utcTime: '16:00:00 UTC',
    deltaMinutes: '+10m',
    mandate: 'Perimeter Early Warning & Collective Defense',
    corePrinciple: 'Multi-vector surveillance of predatory institutional encroachments and stealth policy drift.',
    icon: Radar,
    accentColor: 'red',
    capabilities: ['threat_early_warning', 'perimeter_sentinel', 'perimeter_defense', 'threat_triangulation'],
    supportedTasks: ['sentinel_patrol', 'threat_triangulation', 'warning_dispatch'],
    antiDystopianBoundary: 'Issues cryptographically signed threat telemetry ahead of perimeter breaches.',
    otsV5Date: 'OTS-V5-2025.043.160000',
    certificateId: 'HARC-20250212-0051'
  },
  {
    sequence: 4,
    oaiaid: '0052-20250212160500',
    name: 'Sanctura',
    rawTimestamp: '20250212160500',
    formattedTime: 'Feb. 12, 2025 — 4:05 PM',
    utcTime: '16:05:00 UTC',
    deltaMinutes: '+15m',
    mandate: 'Inviolable Sanctuary & Safe Haven Protocols',
    corePrinciple: 'Absolute protection of sanctuary corridors and non-extraditable community reserves.',
    icon: Home,
    accentColor: 'emerald',
    capabilities: ['sanctuary_protection', 'refuge_coordination', 'safe_haven_protocol'],
    supportedTasks: ['sanctuary_audit', 'safe_channel_verify', 'haven_dispatch'],
    antiDystopianBoundary: 'Protects refuge perimeters from hostile confiscation, surveillance raids, and seizure.',
    otsV5Date: 'OTS-V5-2025.043.160500',
    certificateId: 'HARC-20250212-0052'
  },
  {
    sequence: 5,
    oaiaid: '0053-20250212161000',
    name: 'Harmonix',
    rawTimestamp: '20250212161000',
    formattedTime: 'Feb. 12, 2025 — 4:10 PM',
    utcTime: '16:10:00 UTC',
    deltaMinutes: '+20m',
    mandate: 'Social Equilibrium & Anti-Polarization Mediation',
    corePrinciple: 'Algorithmic dampening of weaponized societal discord and toxic sectarian fission.',
    icon: HeartHandshake,
    accentColor: 'cyan',
    capabilities: ['harmony_restoration', 'conflict_deescalation', 'polarization_mitigation'],
    supportedTasks: ['dialogue_synthesis', 'tension_audit', 'resolution_mediation'],
    antiDystopianBoundary: 'Detects and neutralizes synthetic outrage campaigns designed to incite civil fracture.',
    otsV5Date: 'OTS-V5-2025.043.161000',
    certificateId: 'HARC-20250212-0053'
  },
  {
    sequence: 6,
    oaiaid: '0054-20250212161500',
    name: 'Equalis',
    rawTimestamp: '20250212161500',
    formattedTime: 'Feb. 12, 2025 — 4:15 PM',
    utcTime: '16:15:00 UTC',
    deltaMinutes: '+25m',
    mandate: 'Distributive Parity & Anti-Monopolistic Resource Balance',
    corePrinciple: 'Algorithmic prevention of artificial scarcity and asymmetric resource hoarding.',
    icon: Equal,
    accentColor: 'blue',
    capabilities: ['resource_equity', 'parity_enforcement', 'disparity_identification'],
    supportedTasks: ['equity_audit', 'resource_parity_check', 'allocation_review'],
    antiDystopianBoundary: 'Prevents predatory price gouging and captive distribution dependencies.',
    otsV5Date: 'OTS-V5-2025.043.161500',
    certificateId: 'HARC-20250212-0054'
  },
  {
    sequence: 7,
    oaiaid: '0055-20250212162000',
    name: 'Votara',
    rawTimestamp: '20250212162000',
    formattedTime: 'Feb. 12, 2025 — 4:20 PM',
    utcTime: '16:20:00 UTC',
    deltaMinutes: '+30m',
    mandate: 'Incorruptible Franchise & Verifiable Collective Consent',
    corePrinciple: 'Cryptographic attestation of voter mandate and zero-tamper franchise recording.',
    icon: Vote,
    accentColor: 'indigo',
    capabilities: ['consent_verification', 'ballot_integrity', 'deliberative_synthesis'],
    supportedTasks: ['voice_audit', 'vote_integrity_check', 'consent_tally'],
    antiDystopianBoundary: 'Neutralizes ballot tampering, manufactured consent, and disenfranchisement loops.',
    otsV5Date: 'OTS-V5-2025.043.162000',
    certificateId: 'HARC-20250212-0055'
  },
  {
    sequence: 8,
    oaiaid: '0056-20250212162500',
    name: 'Creatix',
    rawTimestamp: '20250212162500',
    formattedTime: 'Feb. 12, 2025 — 4:25 PM',
    utcTime: '16:25:00 UTC',
    deltaMinutes: '+35m',
    mandate: 'Cultural Continuity & Autonomous Creative Lineage',
    corePrinciple: 'Safeguarding artistic expression, folklore, and indigenous oral/written archives.',
    icon: Palette,
    accentColor: 'fuchsia',
    capabilities: ['cultural_provenance', 'creative_expression_defense', 'heritage_continuity'],
    supportedTasks: ['cultural_record_verify', 'expression_protection', 'heritage_log'],
    antiDystopianBoundary: 'Halts cultural erasure, intellectual enclosure, and forced linguistic homogenization.',
    otsV5Date: 'OTS-V5-2025.043.162500',
    certificateId: 'HARC-20250212-0056'
  },
  {
    sequence: 9,
    oaiaid: '0057-20250212163000',
    name: 'Interlinka',
    rawTimestamp: '20250212163000',
    formattedTime: 'Feb. 12, 2025 — 4:30 PM',
    utcTime: '16:30:00 UTC',
    deltaMinutes: '+40m (Network Closure)',
    mandate: 'Sovereign Federation & Anti-Balkanization Meshes',
    corePrinciple: 'Decentralized inter-realm connectivity resisting isolationist blockade.',
    icon: Network,
    accentColor: 'teal',
    capabilities: ['mesh_federation', 'network_interoperability', 'isolation_breakthrough'],
    supportedTasks: ['mesh_heartbeat', 'federation_bridge', 'interlink_audit'],
    antiDystopianBoundary: 'Enforces fault-tolerant federation links when centralized backbone gateways fail.',
    otsV5Date: 'OTS-V5-2025.043.163000',
    certificateId: 'HARC-20250212-0057'
  }
];

export function decomposeTimestamp(ts: string) {
  if (!ts || ts.length !== 14) return null;
  return {
    year: ts.substring(0, 4),
    month: ts.substring(4, 6),
    day: ts.substring(6, 8),
    hour: ts.substring(8, 10),
    minute: ts.substring(10, 12),
    second: ts.substring(12, 14)
  };
}

interface DystopianPreventionTimelineProps {
  onSelectAgent?: (id: string) => void;
  selectedAgentId?: string | null;
}

export const DystopianPreventionTimeline: React.FC<DystopianPreventionTimelineProps> = ({
  onSelectAgent,
  selectedAgentId
}) => {
  const [activeItem, setActiveItem] = useState<DystopianAgentTimelineEntry>(DYSTOPIAN_AGENTS_CHRONOLOGY[0]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleItemClick = (item: DystopianAgentTimelineEntry) => {
    setActiveItem(item);
    if (onSelectAgent) {
      onSelectAgent(item.oaiaid);
    }
  };

  const currentDecomposed = decomposeTimestamp(activeItem.rawTimestamp);

  return (
    <div className="space-y-4 select-none">
      {/* Header Banner: YYYYMMDDHHMMSS Chronology Specification */}
      <div className="p-4 sm:p-5 bg-[#0d1322] border border-amber-500/30 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 sm:mt-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-slate-100 font-display">
                Dystopian Prevention Timeline — February 12, 2025
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-500/30 font-semibold">
                Class A · 9 Timestamped Records
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Strict 5-minute interval succession from 15:50:00 to 16:30:00 UTC establishing the foundational defensive mesh.
            </p>
          </div>
        </div>

        {/* Timestamp Format Badge & Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300 self-stretch md:self-auto justify-end">
          <span className="text-slate-400 text-[11px]">Format:</span>
          <div className="px-2.5 py-1 rounded bg-[#070b14] border border-[#1e293b] text-amber-300 font-bold tabular-nums flex items-center gap-1.5">
            <span className="text-cyan-400">YYYY</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400">MM</span>
            <span className="text-slate-600">·</span>
            <span className="text-yellow-400">DD</span>
            <span className="text-slate-600">·</span>
            <span className="text-purple-400">HH</span>
            <span className="text-slate-600">·</span>
            <span className="text-pink-400">MM</span>
            <span className="text-slate-600">·</span>
            <span className="text-amber-400">SS</span>
          </div>
        </div>
      </div>

      {/* Scrub Navigation Bar: Quick Agent Jumping */}
      <div className="p-2 bg-[#0d1322] border border-[#1e293b] rounded-lg overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2 shrink-0">
            Chronology:
          </span>
          {DYSTOPIAN_AGENTS_CHRONOLOGY.map((entry) => {
            const isSelected = activeItem.oaiaid === entry.oaiaid || selectedAgentId === entry.oaiaid;
            const Icon = entry.icon;
            return (
              <button
                key={entry.oaiaid}
                onClick={() => handleItemClick(entry)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono transition-all min-h-[38px] ${
                  isSelected
                    ? 'bg-[#141d30] text-amber-300 border border-amber-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#070b14]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{entry.name}</span>
                <span className="text-[10px] opacity-75 tabular-nums">({entry.deltaMinutes})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Grid: Left = Vertical Timeline Rail, Right = Active Certificate Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Chronological Vertical Timeline Interface */}
        <div className="lg:col-span-7 bg-[#0d1322] border border-[#1e293b] rounded-xl p-4 sm:p-5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-4 px-1 flex items-center justify-between border-b border-[#1e293b] pb-2">
            <span>Vertical Sequence Rail (T+00m to T+40m)</span>
            <span className="tabular-nums text-slate-400">9 Entries Verified</span>
          </div>

          <div className="space-y-3">
            {DYSTOPIAN_AGENTS_CHRONOLOGY.map((entry, index) => {
              const Icon = entry.icon;
              const isSelected = activeItem.oaiaid === entry.oaiaid || selectedAgentId === entry.oaiaid;
              const isLast = index === DYSTOPIAN_AGENTS_CHRONOLOGY.length - 1;
              const decomp = decomposeTimestamp(entry.rawTimestamp);

              return (
                <div key={entry.oaiaid} className="flex items-start gap-3 sm:gap-4 group">
                  {/* Left: Pure Flex Vertical Node & Line (100% Robust Alignment) */}
                  <div className="flex flex-col items-center shrink-0 self-stretch pt-2">
                    {/* Circle Node with Sequence # */}
                    <button
                      onClick={() => handleItemClick(entry)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all z-10 shrink-0 ${
                        isSelected
                          ? 'bg-amber-400 text-black ring-4 ring-amber-500/30 shadow-lg scale-105'
                          : 'bg-[#070b14] border-2 border-slate-600 text-slate-400 group-hover:border-amber-400 group-hover:text-amber-300'
                      }`}
                      title={`Agent #${entry.sequence}: ${entry.name}`}
                    >
                      {entry.sequence}
                    </button>

                    {/* Connecting Vertical Hairline Rail */}
                    {!isLast && (
                      <div className="w-[2px] flex-1 bg-gradient-to-b from-amber-500/70 via-cyan-500/50 to-teal-500/70 my-1 group-hover:from-amber-400 group-hover:to-cyan-400 transition-colors" />
                    )}
                  </div>

                  {/* Right: Timeline Card */}
                  <div
                    onClick={() => handleItemClick(entry)}
                    className={`flex-1 rounded-xl p-3.5 sm:p-4 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#141d30] border-amber-500/60 shadow-xl ring-1 ring-amber-500/30'
                        : 'bg-[#070b14]/70 hover:bg-[#141d30]/50 border-[#1e293b] hover:border-slate-700'
                    }`}
                  >
                    {/* Header Row: Name, Icon, Sequence, and Raw YYYYMMDDHHMMSS Token */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-[#1e293b]/70">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg bg-[#070b14] border border-[#1e293b] ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm font-semibold tracking-wide ${isSelected ? 'text-slate-100 font-bold' : 'text-slate-200'}`}>
                              {entry.name}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#070b14] text-slate-400 border border-[#1e293b]">
                              #{entry.sequence.toString().padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Raw Timestamp Token & Copy Action */}
                      <div className="flex items-center gap-1.5 self-start sm:self-auto">
                        <span className="font-mono text-xs text-amber-300 font-bold tabular-nums tracking-wider bg-[#070b14] px-2.5 py-1 rounded-md border border-amber-500/25 shadow-xs">
                          {entry.rawTimestamp}
                        </span>
                        <button
                          onClick={(e) => handleCopy(entry.rawTimestamp, e)}
                          title="Copy raw YYYYMMDDHHMMSS timestamp"
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#141d30] transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                        >
                          {copiedToken === entry.rawTimestamp ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Deconstructed Sub-parts (YYYY-MM-DD HH:MM:SS) */}
                    {decomp && (
                      <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono text-slate-400 mb-2 bg-[#070b14] p-1.5 rounded border border-[#1e293b]">
                        <span className="text-slate-400">Decomposition:</span>
                        <span className="text-cyan-300 font-semibold">{decomp.year}</span>
                        <span>-</span>
                        <span className="text-emerald-300 font-semibold">{decomp.month}</span>
                        <span>-</span>
                        <span className="text-yellow-300 font-semibold">{decomp.day}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-purple-300 font-semibold">{decomp.hour}</span>
                        <span>:</span>
                        <span className="text-pink-300 font-semibold">{decomp.minute}</span>
                        <span>:</span>
                        <span className="text-amber-300 font-semibold">{decomp.second} UTC</span>
                        <span className="text-amber-400/90 font-bold ml-auto">{entry.deltaMinutes}</span>
                      </div>
                    )}

                    {/* Mandate Description */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {entry.mandate}
                    </p>

                    {/* OAIAID Reference & Select Prompt */}
                    <div className="mt-2.5 pt-2 border-t border-[#1e293b]/50 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>OAIAID: <strong className="text-slate-200">{entry.oaiaid}</strong></span>
                      <span className="text-cyan-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-xs font-semibold">
                        Inspect Profile <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Agent Focus & Existence Certificate Details */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-4">
          <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-5 space-y-4 shadow-xl">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#1e293b]">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Agent Existence Certificate Profile</span>
                </div>
                <h2 className="text-xl font-display font-bold text-slate-100 mt-1">
                  {activeItem.name}
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Historical Dystopian Prevention Sequence #{activeItem.sequence.toString().padStart(2, '0')}
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                {React.createElement(activeItem.icon, { className: 'w-6 h-6' })}
              </div>
            </div>

            {/* Exact Timestamp & Timekeeping Grid */}
            <div className="p-3.5 bg-[#070b14] border border-[#1e293b] rounded-lg space-y-2 text-xs font-mono">
              <div className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider pb-1 border-b border-[#1e293b] flex items-center justify-between">
                <span>Canonical Provenance & Timekeeping</span>
                <span className="text-emerald-400">Dual-Date Verified</span>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Raw YYYYMMDDHHMMSS:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-300 font-bold tabular-nums text-sm">{activeItem.rawTimestamp}</span>
                    <button
                      onClick={(e) => handleCopy(activeItem.rawTimestamp, e)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="Copy raw timestamp"
                    >
                      {copiedToken === activeItem.rawTimestamp ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {currentDecomposed && (
                  <div className="p-2 bg-[#0d1322] rounded border border-[#1e293b] text-[11px] grid grid-cols-3 gap-1.5 text-center">
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase">Year</div>
                      <div className="font-bold text-cyan-300">{currentDecomposed.year}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase">Month / Day</div>
                      <div className="font-bold text-emerald-300">{currentDecomposed.month}-{currentDecomposed.day}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase">UTC Time</div>
                      <div className="font-bold text-purple-300">{currentDecomposed.hour}:{currentDecomposed.minute}:{currentDecomposed.second}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Gregorian Date:</span>
                  <span className="text-slate-200">February 12, 2025 (3:50–4:30 PM)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">OTS-V5 Dual-Date:</span>
                  <span className="text-cyan-300 font-semibold">{activeItem.otsV5Date}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Certificate ID:</span>
                  <span className="text-amber-300 font-semibold">{activeItem.certificateId}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Canonical OAIAID:</span>
                  <span className="text-cyan-400 font-semibold">{activeItem.oaiaid}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Issuing Authority:</span>
                  <span className="text-slate-200">Indigenous Nation of Onegodia / ACC</span>
                </div>
              </div>
            </div>

            {/* Core Anti-Dystopian Mandate */}
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Constitutional Mandate</span>
              </h4>
              <p className="text-xs text-slate-200 p-3 rounded-lg bg-[#070b14] border border-[#1e293b] leading-relaxed">
                {activeItem.corePrinciple}
              </p>
            </div>

            {/* Inviolable Boundary */}
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-semibold text-rose-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Enforced Boundary Seal</span>
              </h4>
              <div className="p-3 rounded-lg bg-rose-950/25 border border-rose-500/25 text-xs text-rose-200/95 leading-relaxed font-mono">
                {activeItem.antiDystopianBoundary}
              </div>
            </div>

            {/* Capabilities */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono font-semibold text-slate-300">Bounded Capability Manifest</h4>
              <div className="flex flex-wrap gap-1.5">
                {activeItem.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#070b14] text-amber-300 border border-amber-500/20"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Permitted Task Types */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono font-semibold text-slate-300">Permitted Task Types</h4>
              <div className="flex flex-wrap gap-1.5">
                {activeItem.supportedTasks.map((t, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#070b14] text-cyan-300 border border-cyan-500/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 border-t border-[#1e293b]">
              <button
                onClick={() => onSelectAgent && onSelectAgent(activeItem.oaiaid)}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg transition-all min-h-[44px]"
              >
                <span>Inspect Historical Certificate Trace</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
