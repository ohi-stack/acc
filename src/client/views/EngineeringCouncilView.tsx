import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertOctagon, 
  GitPullRequest, 
  GitMerge, 
  Rocket, 
  FileCheck, 
  ExternalLink,
  RefreshCw,
  Layers,
  Sparkles
} from 'lucide-react';
import { api } from '../api';

interface EngineeringCouncilViewProps {
  onNavigate: (route: string) => void;
  onRefreshApprovals: () => void;
}

export const EngineeringCouncilView: React.FC<EngineeringCouncilViewProps> = ({ onNavigate, onRefreshApprovals }) => {
  const [issueTitle, setIssueTitle] = useState('Implement Durable PostgreSQL Persistence & Model Provider Failover');
  const [repo, setRepo] = useState('ohi-stack/acc');
  const [isRunning, setIsRunning] = useState(false);
  const [councilResult, setCouncilResult] = useState<any>(null);

  const handleRunCouncil = async () => {
    try {
      setIsRunning(true);
      const result = await api.runCouncil(issueTitle, repo);
      setCouncilResult(result);
      onRefreshApprovals();
    } catch (err: any) {
      alert(`Engineering Council run failed: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-3 border-b border-[#1e293b]">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-cyan-400" />
            Governed Engineering Council
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#141d30] text-[#d4af37] border border-[#d4af37]/30">
              14-Stage SDLC Attestation
            </span>
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Rigorous engineering governance pipeline. Every state transition requires distinct verifiable proof.
          PR opened ≠ completed. CI passed ≠ production. Merge ≠ deployment. Deployment ≠ verified.
        </p>
      </div>

      {/* Input / Trigger Card */}
      <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-5 space-y-4">
        <div className="text-xs font-mono text-slate-300 font-semibold uppercase">
          Initiate Governed Engineering SDLC Flow
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Issue / Feature Title</label>
            <input
              type="text"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              className="w-full bg-[#070b14] border border-[#1e293b] rounded-lg p-2.5 text-xs font-mono text-slate-100 outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Target Repository</label>
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="w-full bg-[#070b14] border border-[#1e293b] rounded-lg p-2.5 text-xs font-mono text-slate-100 outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-[11px] font-mono text-slate-400">
            Agents involved: <span className="text-cyan-300">agent-eng-pr-01</span>, <span className="text-emerald-300">agent-sec-guard-01</span>, <span className="text-purple-300">agent-omos-auditor-01</span>
          </div>

          <button
            onClick={handleRunCouncil}
            disabled={isRunning || !issueTitle.trim()}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Advancing 14-Stage SDLC Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Governed Council Flow</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 rounded-lg bg-[#070b14] border border-[#1e293b] text-slate-300">
          <div className="text-[10px] text-amber-400 font-bold">SDLC INVARIANT 1</div>
          <div>PR opened ≠ completed</div>
        </div>
        <div className="p-3 rounded-lg bg-[#070b14] border border-[#1e293b] text-slate-300">
          <div className="text-[10px] text-amber-400 font-bold">SDLC INVARIANT 2</div>
          <div>CI passed ≠ production</div>
        </div>
        <div className="p-3 rounded-lg bg-[#070b14] border border-[#1e293b] text-slate-300">
          <div className="text-[10px] text-amber-400 font-bold">SDLC INVARIANT 3</div>
          <div>Merge ≠ deployment</div>
        </div>
        <div className="p-3 rounded-lg bg-[#070b14] border border-[#1e293b] text-slate-300">
          <div className="text-[10px] text-amber-400 font-bold">SDLC INVARIANT 4</div>
          <div>Deployment ≠ verified</div>
        </div>
      </div>

      {/* 14-Stage Execution Chain & Evidence */}
      {councilResult && (
        <div className="bg-[#0d1322] border border-cyan-500/50 rounded-xl p-5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-sm font-mono font-bold text-slate-100">
                  Engineering Council Run: {councilResult.councilRunId}
                </h2>
                <div className="text-[11px] text-slate-400 font-mono">
                  Maturity: <span className="text-emerald-300 font-bold">{councilResult.finalMaturity}</span> • PR #{councilResult.prNumber} • Ledger SHA: {councilResult.engineeringRecordSha.slice(0, 16)}...
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/deployments')}
              className="px-3 py-1.5 rounded bg-[#141d30] border border-[#1e293b] text-cyan-300 text-xs font-mono hover:text-white"
            >
              View in Deployments Proof →
            </button>
          </div>

          <div className="space-y-3">
            {councilResult.stages.map((stg: any, idx: number) => (
              <div
                key={idx}
                className="bg-[#070b14] border border-[#1e293b] rounded-lg p-3.5 space-y-2 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-100">{stg.name}</span>
                    <span className="text-[10px] text-slate-400">({stg.stage})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{stg.agent}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                      {stg.status}
                    </span>
                  </div>
                </div>

                {/* Specific Evidence Payload */}
                <div className="bg-[#0d1322] p-2.5 rounded border border-[#1e293b]/60 text-[11px] text-slate-300">
                  <div className="text-[9px] text-slate-400 uppercase font-semibold mb-1">
                    Verifiable Evidence Artifact
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap text-slate-300 leading-relaxed font-mono">
                    {JSON.stringify(stg.evidence, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
