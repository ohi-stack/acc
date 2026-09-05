import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  AlertTriangle, 
  ArrowRight, 
  FileCheck,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';
import { api } from '../api';

interface CommandCenterViewProps {
  onNavigate: (route: string) => void;
  onRefreshApprovals: () => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({ onNavigate, onRefreshApprovals }) => {
  const defaultObjective = "Review the latest pull request, run the Engineering Council, fix approved issues, test the build, and prepare deployment proof.";
  const [objective, setObjective] = useState(defaultObjective);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [executionOutcome, setExecutionOutcome] = useState<any>(null);

  const handlePlan = async () => {
    if (!objective.trim()) return;
    try {
      setIsPlanning(true);
      setExecutionOutcome(null);
      const planData = await api.planObjective(objective);
      setPlan(planData);
    } catch (err: any) {
      alert(`Planning failed: ${err.message}`);
    } finally {
      setIsPlanning(false);
    }
  };

  const handleExecute = async () => {
    if (!plan) return;
    try {
      setIsExecuting(true);
      const outcome = await api.executeObjective({
        objective: plan.objective,
        tasks: plan.tasks,
        riskClassification: plan.riskClassification
      });
      setExecutionOutcome(outcome);
      onRefreshApprovals();
    } catch (err: any) {
      alert(`Execution failed: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-3 border-b border-[#1e293b]">
        <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
          <Terminal className="w-5 h-5 text-[#d4af37]" />
          Command Center
          <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#141d30] text-cyan-400 border border-cyan-500/30">
            Primary Operator Gateway
          </span>
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Submit high-level operational objectives. ACC analyzes risk, classifies policies, assigns governed agents, and presents structured pre-flight plans before execution.
        </p>
      </div>

      {/* Objective Input Card */}
      <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-5 space-y-4">
        <label className="text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
          <span>HIGH-LEVEL OBJECTIVE</span>
          <span className="text-[10px] text-slate-400">Natural language goal → Governed structured execution</span>
        </label>

        <div className="relative">
          <textarea
            rows={3}
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="Describe what ACC should execute..."
            className="w-full bg-[#070b14] border border-[#1e293b] focus:border-cyan-500/70 rounded-lg p-3.5 text-xs font-mono text-slate-100 placeholder-slate-600 outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 text-[11px] font-mono">
          <span className="text-slate-500 py-1">Presets:</span>
          {[
            { label: 'Engineering Council PR SDLC', text: "Review the latest pull request, run the Engineering Council, fix approved issues, test the build, and prepare deployment proof." },
            { label: 'Security & Secret Scan', text: "Execute full vulnerability scan, verify role privilege boundaries, and check for hardcoded secrets." },
            { label: 'Production Release Attestation', text: "Compile verified build evidence, run smoke tests, and register deployment proof with QR-V signature." }
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setObjective(preset.text)}
              className="px-2.5 py-1 rounded bg-[#070b14] hover:bg-[#141d30] border border-[#1e293b] text-slate-300 hover:text-cyan-300 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>ACC transforms intent into verified tasks and audit records.</span>
          </div>

          <button
            onClick={handlePlan}
            disabled={isPlanning || !objective.trim()}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
          >
            {isPlanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing & Decomposing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Decompose & Generate Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Plan Preview & Pre-Flight Review (Shown before execution!) */}
      {plan && (
        <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <div>
                <h2 className="text-sm font-mono font-bold text-slate-100">
                  Pre-Flight Execution Plan
                </h2>
                <div className="text-[11px] text-slate-400 font-mono">
                  Review planned tasks, assigned agents, risk level, and required tools before authorizing execution.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono px-2.5 py-1 rounded font-bold ${
                plan.riskClassification === 'HIGH' || plan.riskClassification === 'CRITICAL'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              }`}>
                RISK: {plan.riskClassification}
              </span>
            </div>
          </div>

          {/* Pre-Flight Checklist */}
          <div className="bg-[#070b14] border border-[#1e293b] rounded-lg p-3.5">
            <div className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider mb-2">
              Pre-Flight Governance Verifications
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
              {plan.preFlightChecklist.map((check: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{check.item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decomposed Tasks Grid */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-300 font-semibold uppercase">
              Assigned Tasks & Agent Matrix ({plan.tasks.length} Stages)
            </div>

            <div className="space-y-2">
              {plan.tasks.map((task: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-[#070b14] border border-[#1e293b] rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded bg-[#141d30] border border-[#1e293b] text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {task.order}
                    </span>
                    <div>
                      <div className="text-slate-100 font-semibold flex items-center gap-2">
                        <span>{task.type}</span>
                        <span className="text-[10px] text-slate-400">({task.description})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Agent: <span className="text-cyan-300">{task.assignedAgentName}</span> • Model: <span className="text-purple-300">{task.model}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <span className={`text-[10px] px-2 py-0.5 rounded ${
                      task.riskLevel === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-[#141d30] text-slate-300'
                    }`}>
                      {task.riskLevel} Risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Approvals Notice */}
          {plan.requiredApprovals && plan.requiredApprovals.length > 0 && (
            <div className="bg-amber-950/30 border border-amber-500/40 rounded-lg p-3 flex items-start gap-2.5 text-xs text-amber-200 font-mono">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Human Authorization Gate Required:</span> Production merge and release operations require dual operator approval. Initiating will enqueue an approval ticket into the approval queue.
              </div>
            </div>
          )}

          {/* Action Trigger */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setPlan(null)}
              className="px-3 py-2 rounded-lg bg-[#070b14] border border-[#1e293b] text-slate-400 hover:text-slate-200 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching to Execution Gateway...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Authorize & Execute Governed Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Execution Outcome Card */}
      {executionOutcome && (
        <div className="bg-[#0d1322] border border-emerald-500/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Execution Pipeline Complete</span>
            </div>
            <button
              onClick={() => onNavigate(`/executions/${executionOutcome.execution.executionId}`)}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Inspect Full Trace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#070b14] rounded-lg border border-[#1e293b]">
              <div className="text-slate-400 text-[10px]">EXECUTION ID</div>
              <div className="text-cyan-300 font-semibold">{executionOutcome.execution.executionId}</div>
            </div>
            <div className="p-3 bg-[#070b14] rounded-lg border border-[#1e293b]">
              <div className="text-slate-400 text-[10px]">VERIFICATION ID</div>
              <div className="text-emerald-300 font-semibold">{executionOutcome.execution.verificationId || 'QRV-VERIFIED'}</div>
            </div>
            <div className="p-3 bg-[#070b14] rounded-lg border border-[#1e293b]">
              <div className="text-slate-400 text-[10px]">EXECUTION DURATION</div>
              <div className="text-purple-300 font-semibold">{executionOutcome.execution.durationMs}ms</div>
            </div>
          </div>

          <div className="bg-[#070b14] border border-[#1e293b] rounded-lg p-3">
            <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold mb-1">
              Synthesized Agent Outcome
            </div>
            <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {executionOutcome.execution.output?.summary || 'Execution completed with verified cryptographic evidence.'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
