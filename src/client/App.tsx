import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { DashboardView } from './views/DashboardView';
import { CommandCenterView } from './views/CommandCenterView';
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
  };

  const renderCurrentView = () => {
    if (currentRoute.startsWith('/console/command')) {
      return <CommandCenterView onNavigate={navigate} onRefreshApprovals={refreshPendingApprovals} />;
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
    // Default to Dashboard
    return <DashboardView onNavigate={navigate} onRefreshApprovals={refreshPendingApprovals} />;
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#070b14] text-slate-100 overflow-hidden">
      {/* Global Top Bar */}
      <TopBar
        pendingApprovals={pendingApprovals}
        onNavigate={navigate}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        systemStatus={systemStatus}
      />

      {/* Main App Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Persistent Navigation */}
        <Sidebar
          currentRoute={currentRoute}
          onNavigate={navigate}
          pendingApprovals={pendingApprovals}
        />

        {/* Dynamic View Area */}
        <main className="flex-1 bg-[#070b14] overflow-hidden">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={navigate}
      />
    </div>
  );
};
