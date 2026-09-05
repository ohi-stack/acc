import React from 'react';
import {
  LayoutDashboard,
  Terminal,
  Bot,
  ListTodo,
  GitFork,
  Code2,
  Cpu,
  Radio,
  Activity,
  ShieldCheck,
  Rocket,
  CheckCircle,
  FileSpreadsheet,
  HeartPulse,
  BookOpen,
  Settings,
  UserCircle
} from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  pendingApprovals: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  pendingApprovals
}) => {
  const mainNavItems = [
    { label: 'Dashboard', route: '/console/dashboard', icon: LayoutDashboard },
    { label: 'Command', route: '/console/command', icon: Terminal, highlight: true },
    { label: 'Agents', route: '/agents', icon: Bot },
    { label: 'Tasks', route: '/tasks', icon: ListTodo },
    { label: 'Workflows', route: '/workflows', icon: GitFork },
    { label: 'Engineering Council', route: '/engineering-council', icon: Code2, accent: 'cyan' },
    { label: 'Models', route: '/models', icon: Cpu, accent: 'purple' },
    { label: 'Connections', route: '/connections', icon: Radio },
    { label: 'Executions', route: '/executions', icon: Activity },
    { label: 'Approvals', route: '/approvals', icon: ShieldCheck, badge: pendingApprovals },
    { label: 'Deployments', route: '/deployments', icon: Rocket },
    { label: 'Verification', route: '/verification', icon: CheckCircle },
    { label: 'Audit', route: '/audit', icon: FileSpreadsheet },
    { label: 'System Health', route: '/status', icon: HeartPulse }
  ];

  const bottomNavItems = [
    { label: 'Documentation', route: '/docs', icon: BookOpen },
    { label: 'Settings', route: '/settings', icon: Settings },
    { label: 'Account', route: '/account', icon: UserCircle }
  ];

  return (
    <aside className="w-64 bg-[#070b14] border-r border-[#1e293b] flex flex-col justify-between shrink-0 h-full select-none">
      {/* Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
          Control Plane
        </div>

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route || currentRoute.startsWith(`${item.route}/`);

          return (
            <button
              key={item.route}
              onClick={() => onNavigate(item.route)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-[#141d30] text-slate-100 border border-[#1e293b] shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0d1322]'
              } ${item.highlight && !isActive ? 'hover:text-[#d4af37]' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? item.accent === 'purple'
                        ? 'text-purple-400'
                        : item.accent === 'cyan'
                        ? 'text-cyan-400'
                        : 'text-[#d4af37]'
                      : item.highlight
                      ? 'text-[#d4af37]/70 group-hover:text-[#d4af37]'
                      : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <span className={`tracking-wide ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </div>

              {/* Badge for Approvals or Highlights */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-500 text-black font-bold animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="p-2.5 border-t border-[#1e293b] space-y-1 bg-[#070b14]/90">
        <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
          Console Meta
        </div>
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route;

          return (
            <button
              key={item.route}
              onClick={() => onNavigate(item.route)}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                isActive
                  ? 'bg-[#141d30] text-[#d4af37] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0d1322]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Small version stamp */}
        <div className="pt-2 px-3 flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>ACC™ v1.2.0</span>
          <span>ONEGODIAN, LLC</span>
        </div>
      </div>
    </aside>
  );
};
