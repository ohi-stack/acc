import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bell, 
  Search, 
  User, 
  Globe, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { getOperator, setOperator } from '../api';

interface TopBarProps {
  pendingApprovals: number;
  onNavigate: (route: string) => void;
  onOpenCommandPalette: () => void;
  systemStatus: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  pendingApprovals,
  onNavigate,
  onOpenCommandPalette,
  systemStatus
}) => {
  const [env, setEnv] = useState('Production (acc.onegodian.com)');
  const [operator, setCurrentOperator] = useState(getOperator());
  const [showOperatorMenu, setShowOperatorMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSwitchOperator = (actor: string, role: string) => {
    setOperator(actor, role);
    setCurrentOperator({ actor, role });
    setShowOperatorMenu(false);
  };

  return (
    <header className="h-14 bg-[#070b14] border-b border-[#1e293b] flex items-center justify-between px-4 z-20 shrink-0 select-none">
      {/* Left: ACC™ Brand Logo */}
      <div className="flex items-center gap-3">
        <div 
          onClick={() => onNavigate('/console/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#997a15] p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#070b14] rounded-[6px] flex items-center justify-center">
              <span className="font-display font-black text-xs tracking-wider text-[#d4af37]">ACC</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold tracking-wider text-sm text-slate-100 group-hover:text-[#d4af37] transition-colors">
                ACC™
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#1e293b] text-[#d4af37] font-semibold border border-[#d4af37]/20">
                ONEGODIAN
              </span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono tracking-tight leading-none">
              Agent Command Console
            </span>
          </div>
        </div>

        {/* Environment Selector */}
        <div className="ml-4 pl-4 border-l border-[#1e293b] hidden md:flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <select 
            value={env}
            onChange={(e) => setEnv(e.target.value)}
            className="bg-[#0d1322] text-xs font-mono text-slate-300 border border-[#1e293b] rounded px-2 py-1 outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="Production (acc.onegodian.com)">Production (acc.onegodian.com)</option>
            <option value="Staging (staging.acc.onegodian.com)">Staging (staging.acc.onegodian.com)</option>
            <option value="Sandbox (Isolated VPC)">Sandbox (Isolated VPC)</option>
            <option value="Local Cloud Run Replica">Local Cloud Run Replica</option>
          </select>
        </div>
      </div>

      {/* Middle: Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden lg:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full bg-[#0d1322] border border-[#1e293b] hover:border-cyan-500/50 rounded-lg px-3 py-1.5 text-xs text-slate-400 flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="font-mono">Quick command or resource search...</span>
          </div>
          <kbd className="text-[10px] font-mono bg-[#141d30] border border-[#1e293b] px-1.5 py-0.5 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Status, Approvals, Operator */}
      <div className="flex items-center gap-3">
        {/* System Status */}
        <div 
          onClick={() => onNavigate('/status')}
          className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-[#0d1322] border border-[#1e293b] cursor-pointer hover:border-cyan-500/40 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] font-mono text-emerald-300">
            {systemStatus || 'Operational'}
          </span>
        </div>

        {/* Pending Approvals Badge */}
        <button
          onClick={() => onNavigate('/approvals')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition-all ${
            pendingApprovals > 0 
              ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 hover:bg-amber-900/50 animate-pulse'
              : 'bg-[#0d1322] border-[#1e293b] text-slate-400 hover:text-slate-200'
          }`}
          title="Human Authorization Approval Queue"
        >
          <ShieldCheck className={`w-3.5 h-3.5 ${pendingApprovals > 0 ? 'text-amber-400' : 'text-slate-400'}`} />
          <span>Queue</span>
          {pendingApprovals > 0 && (
            <span className="bg-amber-500 text-black font-bold text-[10px] px-1.5 py-0.2 rounded-full">
              {pendingApprovals}
            </span>
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg bg-[#0d1322] border border-[#1e293b] text-slate-400 hover:text-slate-200 hover:border-cyan-500/40 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0d1322] border border-[#1e293b] rounded-lg shadow-2xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] text-slate-300 font-mono font-semibold">
                <span>System Notifications</span>
                <span className="text-[10px] text-cyan-400">Live stream</span>
              </div>
              <div className="py-2 space-y-2">
                <div className="p-2 rounded bg-[#070b14] border border-[#1e293b]/50">
                  <p className="text-slate-200 font-medium">OMOS Governance Sync</p>
                  <p className="text-[10px] text-slate-400">Immutable hash chain verified for last 50 tasks.</p>
                </div>
                <div className="p-2 rounded bg-[#070b14] border border-[#1e293b]/50">
                  <p className="text-slate-200 font-medium">Model Health Attestation</p>
                  <p className="text-[10px] text-slate-400">Google Gemini 3.8 Flash online with active adapter.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Current Operator & Role */}
        <div className="relative">
          <button
            onClick={() => setShowOperatorMenu(!showOperatorMenu)}
            className="flex items-center gap-2 bg-[#0d1322] hover:bg-[#141d30] border border-[#1e293b] rounded-lg px-2.5 py-1 text-xs transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-[10px]">
              OP
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-slate-200 font-medium leading-none text-[11px]">{operator.actor}</div>
              <div className="text-[9px] font-mono text-[#d4af37] leading-tight">{operator.role}</div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showOperatorMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0d1322] border border-[#1e293b] rounded-lg shadow-2xl p-2 z-50 text-xs">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 py-1">
                Simulate Operator Role (RBAC)
              </div>
              <div className="space-y-1">
                {[
                  { actor: 'onegodian_admin', role: 'super_admin', label: 'Super Admin (Full Root)' },
                  { actor: 'domain_lead_01', role: 'domain_lead', label: 'Domain Lead (Autonomous Systems)' },
                  { actor: 'acc_operator_01', role: 'acc_operator', label: 'ACC Operator (Site Reliability)' },
                  { actor: 'compliance_obs', role: 'observer', label: 'Compliance Observer (Read-Only)' }
                ].map((item) => (
                  <button
                    key={item.role}
                    onClick={() => handleSwitchOperator(item.actor, item.role)}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between text-xs font-mono transition-colors ${
                      operator.role === item.role
                        ? 'bg-[#141d30] text-[#d4af37] font-semibold border border-[#d4af37]/30'
                        : 'text-slate-300 hover:bg-[#141d30]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {operator.role === item.role && <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
