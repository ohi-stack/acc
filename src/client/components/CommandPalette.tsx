import React, { useState, useEffect } from 'react';
import { Search, Terminal, Bot, ListTodo, ShieldCheck, Cpu, Code2, Rocket, FileSpreadsheet, HeartPulse } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { label: 'Go to Command Center', icon: Terminal, route: '/console/command', cat: 'Navigation' },
    { label: 'Go to Dashboard', icon: Terminal, route: '/console/dashboard', cat: 'Navigation' },
    { label: 'Inspect Agents Registry', icon: Bot, route: '/agents', cat: 'Agents' },
    { label: 'View Tasks & Queue', icon: ListTodo, route: '/tasks', cat: 'Tasks' },
    { label: 'Human Authorization Approvals', icon: ShieldCheck, route: '/approvals', cat: 'Governance' },
    { label: 'Governed Engineering Council', icon: Code2, route: '/engineering-council', cat: 'Council' },
    { label: 'AI Model Providers & Adapters', icon: Cpu, route: '/models', cat: 'Models' },
    { label: 'Deployments & Proofs', icon: Rocket, route: '/deployments', cat: 'Deployments' },
    { label: 'Authoritative Audit Log', icon: FileSpreadsheet, route: '/audit', cat: 'Audit' },
    { label: 'System Health & Latency', icon: HeartPulse, route: '/status', cat: 'Health' }
  ];

  const filtered = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()) || a.cat.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-4">
      <div className="w-full max-w-xl bg-[#0d1322] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e293b]">
          <Search className="w-4 h-4 text-cyan-400" />
          <input
            type="text"
            placeholder="Type a command or jump to console view..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="bg-transparent text-sm font-mono text-slate-100 placeholder-slate-500 w-full outline-none"
          />
          <kbd className="text-[10px] font-mono bg-[#141d30] border border-[#1e293b] px-1.5 py-0.5 rounded text-slate-400">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-6 text-slate-500 font-mono text-xs">
              No matching commands or routes found.
            </div>
          ) : (
            filtered.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(action.route);
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#141d30] flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                    <span className="text-xs text-slate-200 group-hover:text-white font-medium">
                      {action.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {action.cat}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
