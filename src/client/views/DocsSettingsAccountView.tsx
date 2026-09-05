import React from 'react';
import { BookOpen, Settings, UserCircle, ShieldCheck, Key, Server, Database } from 'lucide-react';
import { getOperator } from '../api';

export const DocsView: React.FC = () => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-5xl mx-auto font-mono text-xs text-slate-300">
      <div className="pb-3 border-b border-[#1e293b]">
        <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          ACC™ Architecture & Invariants Documentation
        </h1>
        <p className="text-slate-400 text-xs mt-1">Operational guidelines for ONEGODIAN, LLC Agent Command Console</p>
      </div>

      <div className="space-y-4">
        <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-4 space-y-2">
          <div className="text-sm font-bold text-slate-100">1. Core Execution Separation</div>
          <p className="text-slate-400 leading-relaxed">
            Human / Trusted System → ACC → Agent / Model → Verification → Commit / Release
          </p>
        </div>

        <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-4 space-y-2">
          <div className="text-sm font-bold text-slate-100">2. Security Invariant</div>
          <p className="text-slate-400 leading-relaxed">
            Agents must NEVER grant themselves additional authority. Privileged actions require human operator sign-off before execution.
          </p>
        </div>

        <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-4 space-y-2">
          <div className="text-sm font-bold text-slate-100">3. Governed SDLC Invariants</div>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>PR opened ≠ completed</li>
            <li>CI passed ≠ production</li>
            <li>Merge ≠ deployment</li>
            <li>Deployment ≠ verified</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const SettingsView: React.FC = () => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-5xl mx-auto font-mono text-xs text-slate-300">
      <div className="pb-3 border-b border-[#1e293b]">
        <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-cyan-400" />
          Control Plane Platform Settings
        </h1>
      </div>

      <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-5 space-y-4">
        <div className="text-sm font-bold text-slate-100">Operational Configuration</div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded bg-[#070b14] border border-[#1e293b]">
            <div>
              <div className="text-slate-200 font-semibold">Persistence Engine</div>
              <div className="text-slate-500 text-[10px]">Durable PostgreSQL Client</div>
            </div>
            <span className="text-emerald-400 font-bold">PostgreSQL (Active)</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded bg-[#070b14] border border-[#1e293b]">
            <div>
              <div className="text-slate-200 font-semibold">Primary Intelligence Adapter</div>
              <div className="text-slate-500 text-[10px]">@google/genai SDK Integration</div>
            </div>
            <span className="text-purple-400 font-bold">Google Gemini 3.8 Flash</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded bg-[#070b14] border border-[#1e293b]">
            <div>
              <div className="text-slate-200 font-semibold">Cryptographic Audit Hashing</div>
              <div className="text-slate-500 text-[10px]">SHA-256 with Canonical Gregorian UTC Timestamps</div>
            </div>
            <span className="text-cyan-400 font-bold">Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AccountView: React.FC = () => {
  const operator = getOperator();
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-5xl mx-auto font-mono text-xs text-slate-300">
      <div className="pb-3 border-b border-[#1e293b]">
        <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
          <UserCircle className="w-5 h-5 text-cyan-400" />
          Operator Identity & Session Scope
        </h1>
      </div>

      <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-[#1e293b]">
          <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-lg">
            OP
          </div>
          <div>
            <div className="text-slate-100 text-sm font-bold">{operator.actor}</div>
            <div className="text-[#d4af37] font-semibold">{operator.role}</div>
          </div>
        </div>

        <div className="space-y-2 text-slate-400">
          <div>Tenant Scope: <span className="text-slate-200">global_onegodian</span></div>
          <div>Canonical Domain: <span className="text-cyan-400">acc.onegodian.com</span></div>
          <div>Security Clearance: <span className="text-emerald-400">Super Administrator (Full Root Authority)</span></div>
        </div>
      </div>
    </div>
  );
};
