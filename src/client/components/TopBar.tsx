import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bell, 
  Search, 
  Globe, 
  CheckCircle2, 
  ChevronDown,
  Menu,
  X,
  Flame,
  LogIn,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { getOperator, setOperator } from '../api';
import { useFirebase } from '../context/FirebaseContext';

interface TopBarProps {
  pendingApprovals: number;
  onNavigate: (route: string) => void;
  onOpenCommandPalette: () => void;
  systemStatus: string;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  pendingApprovals,
  onNavigate,
  onOpenCommandPalette,
  systemStatus,
  isMobileMenuOpen = false,
  onToggleMobileMenu
}) => {
  const { user, isFirebaseReady, signInWithGoogle, signOut, loading: authLoading } = useFirebase();
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
    <header className="h-14 bg-[#070b14] border-b border-[#1e293b] flex items-center justify-between px-2.5 sm:px-4 z-20 shrink-0 select-none">
      {/* Left: Mobile Hamburger Toggle + OHI-ACC™ Brand Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-lg bg-[#0d1322] border border-[#1e293b] text-slate-300 hover:text-white hover:border-[#d4af37]/50 lg:hidden transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[#d4af37]" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        )}

        <div 
          onClick={() => onNavigate('/console/dashboard')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#997a15] p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#070b14] rounded-[6px] flex items-center justify-center">
              <span className="font-display font-black text-xs tracking-wider text-[#d4af37]">OHI</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold tracking-wider text-xs sm:text-sm text-slate-100 group-hover:text-[#d4af37] transition-colors whitespace-nowrap">
                OHI-ACC™
              </span>
              <span className="hidden xs:inline-block text-[9px] sm:text-[10px] uppercase font-mono px-1 sm:px-1.5 py-0.5 rounded bg-[#1e293b] text-[#d4af37] font-semibold border border-[#d4af37]/20 whitespace-nowrap">
                ONEGODIAN
              </span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono tracking-tight leading-none hidden sm:inline-block">
              Agent Command Console
            </span>
          </div>
        </div>

        {/* Environment Selector */}
        <div className="ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-[#1e293b] hidden xl:flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
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

      {/* Middle: Command Palette Trigger (Desktop) */}
      <div className="flex-1 max-w-md mx-3 hidden lg:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full bg-[#0d1322] border border-[#1e293b] hover:border-cyan-500/50 rounded-lg px-3 py-1.5 text-xs text-slate-400 flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="font-mono truncate">Quick command or resource search...</span>
          </div>
          <kbd className="text-[10px] font-mono bg-[#141d30] border border-[#1e293b] px-1.5 py-0.5 rounded text-slate-400 shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Status, Approvals, Quick Search icon, Operator */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Mobile Search Icon */}
        <button
          onClick={onOpenCommandPalette}
          className="p-2 rounded-lg bg-[#0d1322] border border-[#1e293b] text-slate-400 hover:text-cyan-400 lg:hidden transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
          title="Quick Command Search"
          aria-label="Quick command search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* System Status (Tablet/Desktop) */}
        <div 
          onClick={() => onNavigate('/status')}
          className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-[#0d1322] border border-[#1e293b] cursor-pointer hover:border-cyan-500/40 transition-colors shrink-0"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-[11px] font-mono text-emerald-300">
            {systemStatus || 'Operational'}
          </span>
        </div>

        {/* Pending Approvals Badge */}
        <button
          onClick={() => onNavigate('/approvals')}
          className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded text-xs font-mono border transition-all shrink-0 min-h-[40px] ${
            pendingApprovals > 0 
              ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 hover:bg-amber-900/50'
              : 'bg-[#0d1322] border-[#1e293b] text-slate-400 hover:text-slate-200'
          }`}
          title="Human Authorization Approval Queue"
        >
          <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${pendingApprovals > 0 ? 'text-amber-400' : 'text-slate-400'}`} />
          <span className="hidden xs:inline">Queue</span>
          {pendingApprovals > 0 && (
            <span className="bg-amber-500 text-black font-bold text-[10px] px-1.5 py-0.2 rounded-full">
              {pendingApprovals}
            </span>
          )}
        </button>

        {/* Notifications */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 sm:p-1.5 rounded-lg bg-[#0d1322] border border-[#1e293b] text-slate-400 hover:text-slate-200 hover:border-cyan-500/40 transition-colors relative min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-[#0d1322] border border-[#1e293b] rounded-lg shadow-2xl p-3 z-50 text-xs">
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

        {/* Firebase Sign In quick button if not authenticated */}
        {!user ? (
          <button
            onClick={() => signInWithGoogle()}
            disabled={authLoading}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0d1322] hover:bg-[#141d30] border border-[#1e293b] text-slate-200 text-xs font-mono transition-colors min-h-[40px] hover:border-amber-500/40"
            title="Sign in with Google via Firebase Auth"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">Sign In</span>
          </button>
        ) : null}

        {/* Current Operator & Role */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowOperatorMenu(!showOperatorMenu)}
            className="flex items-center gap-1.5 sm:gap-2 bg-[#0d1322] hover:bg-[#141d30] border border-[#1e293b] rounded-lg px-2 sm:px-2.5 py-1 text-xs transition-colors min-h-[40px]"
            aria-label="Operator options"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] shrink-0 ${user ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-cyan-500/20 text-cyan-300'}`}>
              {user ? (user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'U') : 'OP'}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-slate-200 font-medium leading-none text-[11px] truncate max-w-[110px]">
                {user?.displayName || user?.email || operator.actor}
              </div>
              <div className="text-[9px] font-mono text-[#d4af37] leading-tight flex items-center gap-1">
                {operator.role}
                {user && <Flame className="w-2.5 h-2.5 text-amber-400 inline" />}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {showOperatorMenu && (
            <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-[#0d1322] border border-[#1e293b] rounded-lg shadow-2xl p-2.5 z-50 text-xs">
              {/* Firebase Authentication Section */}
              <div className="pb-2.5 mb-2 border-b border-[#1e293b]">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Flame className="w-3 h-3 text-amber-400" /> Firebase Auth
                  </span>
                  <span className={isFirebaseReady ? 'text-emerald-400' : 'text-slate-400'}>
                    {isFirebaseReady ? 'Firestore Ready' : 'Connecting...'}
                  </span>
                </div>
                {user ? (
                  <div className="space-y-1.5 bg-[#070b14] p-2 rounded border border-[#1e293b]">
                    <div className="text-slate-200 font-medium truncate text-[11px]">{user.displayName || 'Authorized Operator'}</div>
                    <div className="text-slate-400 text-[10px] font-mono truncate">{user.email}</div>
                    <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Google Verified UID: {user.uid.slice(0, 8)}...
                    </div>
                    <button
                      onClick={() => { signOut(); setShowOperatorMenu(false); }}
                      className="w-full mt-1.5 py-1 px-2 rounded bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-300 font-mono text-[10px] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <LogOut className="w-3 h-3" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5 bg-[#070b14] p-2 rounded border border-[#1e293b]">
                    <p className="text-[10px] text-slate-400">Authenticate with verified Google credentials.</p>
                    <button
                      onClick={() => { signInWithGoogle(); setShowOperatorMenu(false); }}
                      disabled={authLoading}
                      className="w-full py-1.5 px-2 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-[10px] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <LogIn className="w-3 h-3 text-amber-400" /> Sign In with Google
                    </button>
                  </div>
                )}
              </div>

              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-1 py-1">
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
                    className={`w-full text-left px-2.5 py-2 rounded flex items-center justify-between text-xs font-mono transition-colors min-h-[38px] ${
                      operator.role === item.role
                        ? 'bg-[#141d30] text-[#d4af37] font-semibold border border-[#d4af37]/30'
                        : 'text-slate-300 hover:bg-[#141d30]'
                    }`}
                  >
                    <span className="truncate pr-2">{item.label}</span>
                    {operator.role === item.role && <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />}
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

