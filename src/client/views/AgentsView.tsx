import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  RefreshCw, 
  ShieldCheck, 
  Power, 
  PowerOff, 
  Clock, 
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  CalendarDays,
  LayoutGrid
} from 'lucide-react';
import { api } from '../api';
import { Agent, SovereignApplicationModule } from '../types';
import { DystopianPreventionTimeline } from '../components/DystopianPreventionTimeline';

interface AgentsViewProps {
  onNavigate: (route: string) => void;
}

type TabType = 'all' | 'class_a' | 'class_b' | 'class_c' | 'sam';

export const AgentsView: React.FC<AgentsViewProps> = ({ onNavigate }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [samModules, setSamModules] = useState<SovereignApplicationModule[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [selectedSam, setSelectedSam] = useState<SovereignApplicationModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [reconciling, setReconciling] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [classAViewMode, setClassAViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');

  const loadData = async () => {
    try {
      setLoading(true);
      const [agentList, samList] = await Promise.all([
        api.getAgents(),
        api.getSamCatalog().catch(() => [])
      ]);
      setAgents(agentList);
      setSamModules(samList);
    } catch (err) {
      console.error('Failed to load agents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReconcile = async () => {
    try {
      setReconciling(true);
      await api.reconcileBaseline();
      await loadData();
    } catch (err: any) {
      alert(`Reconciliation error: ${err.message}`);
    } finally {
      setReconciling(false);
    }
  };

  const handleInspect = async (id: string) => {
    try {
      const detailed = await api.getAgent(id);
      setSelectedAgent(detailed);
      setSelectedSam(null);
    } catch (err: any) {
      console.error('Failed to inspect agent', err);
    }
  };

  const handleSetStatus = async (id: string, status: string) => {
    try {
      setMutatingId(id);
      await api.setAgentStatus(id, status);
      await loadData();
      if (selectedAgent && selectedAgent.id === id) {
        handleInspect(id);
      }
    } catch (err: any) {
      console.error('Failed to mutate agent status', err);
    } finally {
      setMutatingId(null);
    }
  };

  // Class counts
  const classACount = agents.filter(a => a.classification?.includes('Class A') || a.id.startsWith('00')).length;
  const classBCount = agents.filter(a => a.classification?.includes('Class B') || (/^\d{5}$/).test(a.id)).length;
  const classCCount = agents.filter(a => a.classification?.includes('Class C') || a.id.startsWith('KA-')).length;

  // Filter agents
  const filteredAgents = agents.filter(agent => {
    // Tab filter
    if (activeTab === 'class_a' && !(agent.classification?.includes('Class A') || agent.id.startsWith('00'))) return false;
    if (activeTab === 'class_b' && !(agent.classification?.includes('Class B') || (/^\d{5}$/).test(agent.id))) return false;
    if (activeTab === 'class_c' && !(agent.classification?.includes('Class C') || agent.id.startsWith('KA-'))) return false;

    // Division filter
    if (selectedDivision !== 'all' && agent.division !== selectedDivision) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = agent.name.toLowerCase().includes(q);
      const matchId = agent.id.toLowerCase().includes(q);
      const matchDiv = (agent.division || '').toLowerCase().includes(q);
      const matchType = agent.type.toLowerCase().includes(q);
      return matchName || matchId || matchDiv || matchType;
    }
    return true;
  });

  const filteredSam = samModules.filter(m => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
    }
    return true;
  });

  // Extract unique divisions
  const uniqueDivisions = Array.from(new Set(agents.map(a => a.division).filter(Boolean))) as string[];

  return (
    <div className="p-4 sm:p-6 space-y-5 overflow-y-auto h-full max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#1e293b]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              Agent Registry & Governance
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
              52 Canonical Baseline
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Preserves the 52-entry reconciliation baseline across 3 generations, with distinct application module catalogs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReconcile}
            disabled={reconciling}
            className="px-3 py-1.5 rounded-lg bg-[#0d1322] border border-[#d4af37]/40 hover:border-[#d4af37] text-[#d4af37] text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-sm"
            title="Reconcile authoritative 52-agent baseline directly into database"
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${reconciling ? 'animate-spin' : ''}`} />
            <span>{reconciling ? 'Reconciling...' : 'Reconcile Baseline'}</span>
          </button>

          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-lg bg-[#0d1322] border border-[#1e293b] text-slate-300 hover:text-white"
            title="Refresh agents"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Generation & Classification Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0d1322] border border-[#1e293b] rounded-lg">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
            activeTab === 'all'
              ? 'bg-[#141d30] text-slate-100 font-semibold border border-[#1e293b]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Registry ({agents.length})
        </button>
        <button
          onClick={() => setActiveTab('class_a')}
          className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'class_a'
              ? 'bg-[#141d30] text-amber-300 font-semibold border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Class A: Dystopian Prevention</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-500/20">
            {classACount || 9}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('class_b')}
          className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'class_b'
              ? 'bg-[#141d30] text-cyan-300 font-semibold border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Class B: Named Operational</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
            {classBCount || 23}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('class_c')}
          className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'class_c'
              ? 'bg-[#141d30] text-purple-300 font-semibold border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Class C: Knowledge Agents</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/60 text-purple-300 border border-purple-500/20">
            {classCCount || 20}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('sam')}
          className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'sam'
              ? 'bg-[#141d30] text-emerald-300 font-semibold border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Sovereign App Modules (SAM)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/20">
            13
          </span>
        </button>
      </div>

      {/* Sub-Filters: Search & Division */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={activeTab === 'sam' ? "Search SAM virtual tools..." : "Search by name, ID, division..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1322] border border-[#1e293b] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-500/50 font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {activeTab === 'class_a' && (
            <div className="flex items-center gap-1 p-1 bg-[#0d1322] border border-[#1e293b] rounded-lg">
              <button
                onClick={() => setClassAViewMode('timeline')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  classAViewMode === 'timeline'
                    ? 'bg-[#141d30] text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Timeline View</span>
              </button>
              <button
                onClick={() => setClassAViewMode('grid')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  classAViewMode === 'grid'
                    ? 'bg-[#141d30] text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid Cards</span>
              </button>
            </div>
          )}

          {activeTab !== 'sam' && uniqueDivisions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 shrink-0">Division:</span>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="bg-[#0d1322] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="all">All Divisions ({uniqueDivisions.length})</option>
                {uniqueDivisions.map(div => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Class A Callout Banner when on 'all' tab */}
      {activeTab === 'all' && (
        <div className="p-3 bg-[#0d1322] border border-amber-500/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-300">Class A Dystopian Prevention:</strong> 9 timestamped OAIAID agents (Feb. 12, 2025) with exact YYYYMMDDHHMMSS chronology.
            </span>
          </div>
          <button
            onClick={() => {
              setActiveTab('class_a');
              setClassAViewMode('timeline');
            }}
            className="px-2.5 py-1 rounded bg-[#141d30] hover:bg-[#1a253d] text-amber-300 border border-amber-500/30 text-[11px] font-semibold shrink-0 self-start sm:self-auto transition-colors"
          >
            Open Timeline Visualization →
          </button>
        </div>
      )}

      {/* Content View: Sovereign Application Modules Tab */}
      {activeTab === 'sam' ? (
        <div className="space-y-4">
          <div className="p-3 bg-[#0d1322] border border-emerald-500/20 rounded-lg text-xs font-mono text-slate-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-300">Sovereign Application Modules (SAM) — January 19, 2023</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                These 13 tools constitute historical virtual coaching and wellness concepts. Per the governance directive, they are cataloged here as application modules and are intentionally distinct from canonical numbered registry agents.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredSam.map((module) => (
              <div
                key={module.id}
                onClick={() => setSelectedSam(module)}
                className={`p-4 rounded-xl border bg-[#0d1322] transition-all cursor-pointer hover:border-emerald-500/50 ${
                  selectedSam?.id === module.id ? 'border-emerald-400 ring-1 ring-emerald-400/40' : 'border-[#1e293b]'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1e293b]">
                  <span className="font-mono text-xs font-bold text-emerald-400">{module.id}</span>
                  <span className="text-[10px] font-mono text-slate-400">{module.historicalDate}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-100">{module.name}</h3>
                <p className="text-[11px] font-mono text-slate-400 mt-1">{module.category}</p>
                <p className="text-xs text-slate-300 mt-2.5 line-clamp-2">{module.description}</p>
                <div className="mt-3 pt-2 border-t border-[#1e293b] flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Class: Application Module</span>
                  <span className="text-emerald-400/80">{module.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'class_a' && classAViewMode === 'timeline' ? (
        /* Dystopian Prevention Vertical Timeline Visualization */
        <DystopianPreventionTimeline
          onSelectAgent={handleInspect}
          selectedAgentId={selectedAgent?.id}
        />
      ) : (
        /* Agent Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredAgents.map((agent) => {
            const isClassA = agent.classification?.includes('Class A') || agent.id.startsWith('00');
            const isClassB = agent.classification?.includes('Class B') || (/^\d{5}$/).test(agent.id);
            const isClassC = agent.classification?.includes('Class C') || agent.id.startsWith('KA-');
            const isReady = agent.status === 'READY' || agent.status === 'AUTHORIZED';

            return (
              <div
                key={agent.id}
                onClick={() => handleInspect(agent.id)}
                className={`p-4 rounded-xl border bg-[#0d1322] transition-all cursor-pointer flex flex-col justify-between hover:border-cyan-500/50 group ${
                  selectedAgent?.id === agent.id ? 'border-cyan-400 ring-1 ring-cyan-400/40' : 'border-[#1e293b]'
                }`}
              >
                <div>
                  {/* Top: ID & Generation Tag */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1e293b]">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono text-xs font-bold tracking-tight ${
                        isClassA ? 'text-amber-400' : isClassB ? 'text-cyan-400' : 'text-purple-400'
                      }`}>
                        {agent.id}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      isClassA 
                        ? 'bg-amber-950/40 text-amber-300 border-amber-500/20' 
                        : isClassB
                        ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/20'
                        : 'bg-purple-950/40 text-purple-300 border-purple-500/20'
                    }`}>
                      {isClassA ? 'Class A' : isClassB ? 'Class B' : 'Class C'}
                    </span>
                  </div>

                  {/* Name & Division */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {agent.division || agent.type}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className={`w-2 h-2 rounded-full ${isReady ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      <span className="text-[10px] font-mono text-slate-400">{agent.status}</span>
                    </div>
                  </div>

                  {/* Historical Timestamp for Class A */}
                  {agent.source_timestamp && (
                    <div className="mt-2 text-[10px] font-mono text-amber-300/80 flex items-center gap-1 bg-amber-950/30 px-2 py-1 rounded border border-amber-500/10">
                      <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{agent.source_timestamp}</span>
                    </div>
                  )}

                  {/* Capabilities List */}
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {(agent.capabilities || []).slice(0, 3).map((cap, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#070b14] text-slate-300 border border-[#1e293b]"
                      >
                        {cap.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {(agent.capabilities || []).length > 3 && (
                      <span className="text-[10px] font-mono text-slate-400 px-1 py-0.5">
                        +{(agent.capabilities || []).length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-3 pt-2.5 border-t border-[#1e293b] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">
                    Concurrency: {agent.max_concurrency || 1}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetStatus(agent.id, isReady ? 'DRAFT' : 'READY');
                    }}
                    disabled={mutatingId === agent.id}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                      isReady 
                        ? 'text-rose-400 hover:bg-rose-950/40' 
                        : 'text-emerald-400 hover:bg-emerald-950/40'
                    }`}
                  >
                    {isReady ? <PowerOff className="w-3 h-3" /> : <Power className="w-3 h-3" />}
                    <span>{isReady ? 'Pause' : 'Activate'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drawer / Inspector Modal for Selected Agent */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-end z-50">
          <div className="w-full max-w-xl h-full bg-[#0d1322] border-l border-[#1e293b] p-6 overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
                  {selectedAgent.classification || 'Canonical Registry Entry'}
                </span>
                <h2 className="text-lg font-display font-bold text-slate-100 flex items-center gap-2">
                  <span>{selectedAgent.name}</span>
                  <span className="text-xs font-mono text-slate-400">({selectedAgent.id})</span>
                </h2>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#1e293b]"
              >
                ✕
              </button>
            </div>

            {/* Provenance & Registry Metadata */}
            <div className="space-y-2 p-3 bg-[#070b14] border border-[#1e293b] rounded-lg text-xs font-mono">
              <div className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider pb-1 border-b border-[#1e293b]">
                Provenance Record & Invariants
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-400">Division: </span>
                  <span className="text-slate-100 font-semibold">{selectedAgent.division || 'General Execution'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Authority Role: </span>
                  <span className="text-cyan-300">{selectedAgent.authority_role}</span>
                </div>
                <div>
                  <span className="text-slate-400">Registry State: </span>
                  <span className="text-emerald-300">{selectedAgent.registry_state || 'Registered'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Operational State: </span>
                  <span className="text-emerald-300">{selectedAgent.operational_state || 'Production'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Source Record: </span>
                  <span className="text-slate-200">{selectedAgent.source_record || 'OAIAID Directory'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Source Timestamp: </span>
                  <span className="text-amber-300">{selectedAgent.source_timestamp || 'N/A (Derived)'}</span>
                </div>
              </div>
            </div>

            {/* Description & Bounded Scope */}
            {selectedAgent.description && (
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-semibold text-slate-300">Governance Scope</h4>
                <p className="text-xs text-slate-300 p-2.5 rounded bg-[#070b14] border border-[#1e293b] leading-relaxed">
                  {selectedAgent.description}
                </p>
              </div>
            )}

            {/* Capabilities */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono font-semibold text-slate-300">Capabilities Manifest</h4>
              <div className="flex flex-wrap gap-1.5">
                {(selectedAgent.capabilities || []).map((cap: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs font-mono px-2 py-1 rounded bg-[#070b14] text-cyan-300 border border-[#1e293b]"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Supported Task Types */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono font-semibold text-slate-300">Supported Task Types</h4>
              <div className="flex flex-wrap gap-1.5">
                {(selectedAgent.supported_task_types || []).map((t: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs font-mono px-2 py-1 rounded bg-[#070b14] text-amber-300 border border-[#1e293b]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Executions */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-semibold text-slate-300">Recent Executions</h4>
              {selectedAgent.recentExecutions?.length ? (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {selectedAgent.recentExecutions.map((ex: any) => (
                    <div key={ex.id} className="p-2 rounded bg-[#070b14] border border-[#1e293b] text-xs font-mono flex items-center justify-between">
                      <span className="text-cyan-400">{ex.id}</span>
                      <span className="text-slate-400">{ex.status}</span>
                      <span className="text-slate-400">{new Date(ex.created_at).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-mono text-slate-400 p-2 bg-[#070b14] rounded border border-[#1e293b]">
                  No executions recorded for this agent.
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between">
              <button
                onClick={() => onNavigate(`/tasks?agentId=${selectedAgent.id}`)}
                className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono flex items-center gap-1.5"
              >
                <span>Dispatch Task to Agent</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSelectedAgent(null)}
                className="px-3 py-1.5 rounded bg-[#1e293b] text-slate-300 hover:text-white text-xs font-mono"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
