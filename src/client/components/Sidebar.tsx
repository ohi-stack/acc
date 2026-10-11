import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  Terminal,
  Brain,
  Network,
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
  UserCircle,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  pendingApprovals: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavSection {
  title: string;
  items: {
    label: string;
    route: string;
    icon: React.ComponentType<{ className?: string }>;
    accent?: 'purple' | 'cyan' | 'gold';
    highlight?: boolean;
    badge?: number;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  pendingApprovals,
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse
}) => {
  // Listen for Escape key to dismiss mobile drawer
  useEffect(() => {
    if (!isMobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onCloseMobile) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  const navSections: NavSection[] = [
    {
      title: 'Control Plane',
      items: [
        { label: 'Dashboard', route: '/console/dashboard', icon: LayoutDashboard },
        { label: 'Command', route: '/console/command', icon: Terminal, highlight: true }
      ]
    },
    {
      title: 'Governed Operators',
      items: [
        { label: 'Oru’Valen', route: '/oruvalen', icon: Brain, accent: 'purple' },
        { label: 'OMOS', route: '/omos', icon: Network, accent: 'cyan' },
        { label: 'Engineering Council', route: '/engineering-council', icon: Code2, accent: 'cyan' }
      ]
    },
    {
      title: 'Execution Engine',
      items: [
        { label: 'Agents', route: '/agents', icon: Bot, accent: 'gold' },
        { label: 'Tasks', route: '/tasks', icon: ListTodo },
        { label: 'Workflows', route: '/workflows', icon: GitFork },
        { label: 'Models', route: '/models', icon: Cpu, accent: 'purple' },
        { label: 'Connections', route: '/connections', icon: Radio },
        { label: 'Executions', route: '/executions', icon: Activity }
      ]
    },
    {
      title: 'Authority & Audit',
      items: [
        { label: 'Approvals', route: '/approvals', icon: ShieldCheck, badge: pendingApprovals },
        { label: 'Deployments', route: '/deployments', icon: Rocket },
        { label: 'Verification', route: '/verification', icon: CheckCircle },
        { label: 'Audit', route: '/audit', icon: FileSpreadsheet },
        { label: 'System Health', route: '/status', icon: HeartPulse }
      ]
    }
  ];

  const bottomNavItems = [
    { label: 'Documentation', route: '/docs', icon: BookOpen },
    { label: 'Settings', route: '/settings', icon: Settings },
    { label: 'Account', route: '/account', icon: UserCircle }
  ];

  const handleItemClick = (route: string) => {
    onNavigate(route);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-30 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-[#070b14] border-r border-[#1e293b] flex flex-col justify-between shrink-0 h-full select-none transition-all duration-200 ease-in-out ${
          isCollapsed ? 'lg:w-16' : 'lg:w-64'
        } w-72 max-w-[85vw] ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header with Touch-Friendly Close Button */}
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-[#1e293b] lg:hidden shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#997a15] p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-[#070b14] rounded-[6px] flex items-center justify-center">
                <span className="font-display font-black text-xs text-[#d4af37]">OHI</span>
              </div>
            </div>
            <div>
              <div className="font-display font-bold text-xs tracking-wider text-slate-100 leading-tight">
                OHI-ACC™
              </div>
              <div className="text-[10px] font-mono text-slate-400 leading-none">
                Execution Control Plane
              </div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#141d30] min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Navigation Items List with Logical Groupings */}
        <div className="flex-1 overflow-y-auto py-2.5 px-2 space-y-3">
          {navSections.map((section, sIdx) => (
            <div key={section.title} className="space-y-0.5">
              {!isCollapsed && (
                <div className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold ${sIdx > 0 ? 'mt-2' : ''}`}>
                  {section.title}
                </div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route || currentRoute.startsWith(`${item.route}/`);

                return (
                  <button
                    key={item.route}
                    onClick={() => handleItemClick(item.route)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2'
                    } rounded-lg text-xs font-medium transition-all group min-h-[44px] ${
                      isActive
                        ? 'bg-[#141d30] text-slate-100 border border-[#1e293b] shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#0d1322]'
                    } ${item.highlight && !isActive ? 'hover:text-[#d4af37]' : ''}`}
                  >
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? item.accent === 'purple'
                              ? 'text-purple-400'
                              : item.accent === 'cyan'
                              ? 'text-cyan-400'
                              : 'text-[#d4af37]'
                            : item.highlight
                            ? 'text-[#d4af37]/80 group-hover:text-[#d4af37]'
                            : item.accent === 'purple'
                            ? 'text-purple-400/70 group-hover:text-purple-300'
                            : item.accent === 'cyan'
                            ? 'text-cyan-400/70 group-hover:text-cyan-300'
                            : item.accent === 'gold'
                            ? 'text-[#d4af37]/70 group-hover:text-[#d4af37]'
                            : 'text-slate-400 group-hover:text-slate-300'
                        }`}
                      />
                      {!isCollapsed && (
                        <span className={`tracking-wide truncate ${isActive ? 'font-semibold text-slate-100' : ''}`}>
                          {item.label}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-500 text-black font-bold shrink-0">
                        {item.badge}
                      </span>
                    )}

                    {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-2 right-2" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Controls / Meta / Desktop Toggle */}
        <div className="p-2 border-t border-[#1e293b] space-y-1 bg-[#070b14]/95 shrink-0">
          {!isCollapsed && (
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Console Meta
            </div>
          )}

          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;

            return (
              <button
                key={item.route}
                onClick={() => handleItemClick(item.route)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-2 py-2' : 'gap-2.5 px-3 py-1.5'
                } rounded-lg text-xs transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-[#141d30] text-[#d4af37] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0d1322]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}

          {/* Desktop Collapse / Expand Toggle Button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={`hidden lg:flex w-full items-center ${
                isCollapsed ? 'justify-center px-2 py-2' : 'gap-2 px-3 py-2'
              } text-[11px] font-mono text-slate-400 hover:text-slate-200 hover:bg-[#0d1322] rounded-lg transition-colors border border-transparent hover:border-[#1e293b] min-h-[40px]`}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-cyan-400" />
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4 text-slate-400" />
                  <span>Collapse Menu</span>
                </>
              )}
            </button>
          )}

          {!isCollapsed && (
            <div className="pt-2 px-3 flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span>OHI-ACC™ v1.4.0</span>
              <span>ONEGODIAN, LLC</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
