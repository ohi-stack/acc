import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Brain, 
  Network, 
  Bot, 
  ShieldCheck, 
  Menu 
} from 'lucide-react';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { DashboardView } from './views/DashboardView';
import { CommandCenterView } from './views/CommandCenterView';
import { OruValenView } from './views/OruValenView';
import { OMOSView } from './views/OMOSView';
import { AgentsView } from './views/AgentsView';
import { TasksView } from './views/TasksView';
import { WorkflowsView } from './views/WorkflowsView';
import { EngineeringCouncilView } from './views/EngineeringCouncilView';
import { ModelsView } from './views/ModelsView';
import { ConnectionsView } from './views/ConnectionsView';
import { ExecutionsView } from './views/ExecutionsView';
import { ApprovalsView } from './views/ApprovalsView';
import { DeploymentsView } from './views/DeploymentsView';
import { VerificationView } from './views/VerificationView';
import { AuditView } from './views/AuditView';
import { SystemHealthView } from './views/SystemHealthView';
import { DocsView, SettingsView, AccountView } from './views/DocsSettingsAccountView';
import { api } from './api';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const p = window.location.pathname;
    return p === '/' ? '/console/dashboard' : p;
  });
  const [pendingApprovals, setPendingApprovals] = useState<number>(0);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState('Operational');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const refreshPendingApprovals = async () => {
    try {
      const count = await api.getPendingApprovalCount();
      setPendingApprovals(count);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshPendingApprovals();
    const interval = setInterval(refreshPendingApprovals, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      setCurrentRoute(p === '/' ? '/console/dashboard' : p);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    window.history.pushState({}, '', route);
    setCurrentRoute(route);
    setIsMobileMenuOpen(false);
  };

  const renderCurrentView = () => {
    if (currentRoute.startsWith('/console/command')) {
      return <CommandCenterView onNavigate={navigate} onRefreshApprovals={refreshPendingApprovals} />;
    }
    if (currentRoute.startsWith('/oruvalen')) {
      return <OruValenView />;
    }
    if (currentRoute.startsWith('/omos')) {
      return <OMOSView />;
    }
    if (currentRoute.startsWith('/agents')) {
      return <AgentsView onNavigate={navigate} />;
    }
    if (currentRoute.startsWith('/tasks')) {
      return <TasksView onNavigate={navigate} />;
    }
    if (currentRoute.startsWith('/workflows')) {
      return <WorkflowsView onNavigate={navigate} onRefreshApprovals={refreshPendingApprovals} />;
    }
    if (currentRoute.startsWith('/engineering-council')) {
      return <EngineeringCouncilView onNavigate={navigate} onRefreshApprovals={refreshPendingApprovals} />;
    }
    if (currentRoute.startsWith('/models')) {
      return <ModelsView />;
    }
    if (currentRoute.startsWith('/connections')) {
      return <ConnectionsView />;
    }
    if (currentRoute.startsWith('/executions')) {
      const parts = currentRoute.split('/');
      const initialId = parts.length > 2 ? parts[2] : undefined;
      return <ExecutionsView initialExecutionId={initialId} />;
    }
    if (currentRoute.startsWith('/approvals') || currentRoute.startsWith('/governance/authority')) {
      return <ApprovalsView onRefreshApprovals={refreshPendingApprovals} />;
    }
    if (currentRoute.startsWith('/deployments')) {
      return <DeploymentsView />;
    }
    if (currentRoute.startsWith('/verification')) {
      return <VerificationView />;
    }
    if (currentRoute.startsWith('/audit')) {
      return <AuditView />;
    }
    if (currentRoute.startsWith('/status')) {
      return <SystemHealthView />;
    }
    if (currentRoute.startsWith('/docs')) {
      return <DocsView />;
    }
    if (currentRoute.startsWith('/settings')) {
      return <SettingsView />;
    }
    if (currentRoute.startsWith('/account')) {
      return <AccountView />;
    }
    return <DashboardView onNavigate={navigate} onRefreshApprovals={refreshPendingApprovals} />;
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#070b14] text-slate-100 overflow-hidden">
      <TopBar
        pendingApprovals={pendingApprovals}
        onNavigate={navigate}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        systemStatus={systemStatus}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          currentRoute={currentRoute}
          onNavigate={navigate}
          pendingApprovals={pendingApprovals}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          isCollapsed={isDesktopCollapsed}
          onToggleCollapse={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
        />

        <main className="flex-1 bg-[#070b14] overflow-hidden min-w-0 pb-14 lg:pb-0">
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Responsive Bottom Navigation Bar */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-[#070b14]/95 backdrop-blur-md border-t border-[#1e293b] flex items-center justify-around px-1 select-none shadow-2xl"
        aria-label="Mobile Navigation"
      >
        <button
          onClick={() => navigate('/console/dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-mono transition-colors min-h-[44px] min-w-[48px] ${
            currentRoute.startsWith('/console/dashboard')
              ? 'text-[#d4af37] font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Console</span>
        </button>

        <button
          onClick={() => navigate('/oruvalen')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-mono transition-colors min-h-[44px] min-w-[48px] ${
            currentRoute.startsWith('/oruvalen')
              ? 'text-purple-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Brain className="w-4 h-4 mb-0.5" />
          <span>Oru’Valen</span>
        </button>

        <button
          onClick={() => navigate('/omos')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-mono transition-colors min-h-[44px] min-w-[48px] ${
            currentRoute.startsWith('/omos')
              ? 'text-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Network className="w-4 h-4 mb-0.5" />
          <span>OMOS</span>
        </button>

        <button
          onClick={() => navigate('/agents')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-mono transition-colors min-h-[44px] min-w-[48px] ${
            currentRoute.startsWith('/agents')
              ? 'text-[#d4af37] font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4 mb-0.5" />
          <span>Agents</span>
        </button>

        <button
          onClick={() => navigate('/approvals')}
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-mono transition-colors min-h-[44px] min-w-[48px] ${
            currentRoute.startsWith('/approvals')
              ? 'text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 mb-0.5" />
          <span>Approvals</span>
          {pendingApprovals > 0 && (
            <span className="absolute top-1 right-2 bg-amber-500 text-black text-[9px] font-bold px-1 rounded-full">
              {pendingApprovals}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-mono transition-colors min-h-[44px] min-w-[48px] ${
            isMobileMenuOpen
              ? 'text-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Toggle full console menu"
        >
          <Menu className="w-4 h-4 mb-0.5" />
          <span>Menu</span>
        </button>
      </nav>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={navigate}
      />
    </div>
  );
};
