import React, { useState, useEffect } from 'react';
import { 
  ListTodo, 
  Plus, 
  RefreshCw, 
  Search, 
  RotateCcw, 
  XCircle, 
  ExternalLink, 
  Clock, 
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../api';
import { Task } from '../types';

interface TasksViewProps {
  onNavigate: (route: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onNavigate }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [createForm, setCreateForm] = useState({
    type: 'pr_assessment',
    priority: 'NORMAL',
    payloadStr: '{\n  "repo": "ohi-stack/acc",\n  "prNumber": 42\n}'
  });

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getTasks({
        status: statusFilter || undefined,
        search: searchQuery || undefined
      });
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [statusFilter]);

  const handleInspect = async (id: string) => {
    try {
      const task = await api.getTask(id);
      setSelectedTask(task);
    } catch (err: any) {
      alert(`Failed to get task: ${err.message}`);
    }
  };

  const handleRetry = async (id: string) => {
    try {
      await api.retryTask(id);
      await loadTasks();
      if (selectedTask?.id === id) handleInspect(id);
    } catch (err: any) {
      alert(`Retry failed: ${err.message}`);
    }
  };

  const handleCancel = async (id: string) => {
    const reason = prompt('Cancellation reason:') || 'Cancelled by Operator';
    try {
      await api.cancelTask(id, reason);
      await loadTasks();
      if (selectedTask?.id === id) handleInspect(id);
    } catch (err: any) {
      alert(`Cancel failed: ${err.message}`);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(createForm.payloadStr);
      } catch {
        alert('Invalid JSON in payload');
        return;
      }
      await api.createTask({
        type: createForm.type,
        priority: createForm.priority,
        payload: parsedPayload
      });
      setShowCreateModal(false);
      await loadTasks();
    } catch (err: any) {
      alert(`Failed to create task: ${err.message}`);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
            <ListTodo className="w-5 h-5 text-emerald-400" />
            Task Management & Queue
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Deterministic state machine: CREATED → VALIDATED → QUEUED → RESERVED → RUNNING → COMPLETED.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadTasks}
            disabled={loading}
            className="p-2 rounded-lg bg-[#0d1322] border border-[#1e293b] text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enqueue Task</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1322] border border-[#1e293b] p-3 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-[#070b14] px-3 py-1.5 rounded-lg border border-[#1e293b]">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks by ID or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadTasks()}
            className="bg-transparent text-slate-200 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#070b14] border border-[#1e293b] rounded px-2.5 py-1 text-slate-200 outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="QUEUED">QUEUED</option>
            <option value="RUNNING">RUNNING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="FAILED">FAILED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-[#0d1322] border border-[#1e293b] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#070b14] text-slate-400 border-b border-[#1e293b]">
              <tr>
                <th className="p-3">TASK ID</th>
                <th className="p-3">TYPE</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">PRIORITY</th>
                <th className="p-3">ASSIGNED AGENT</th>
                <th className="p-3">RETRIES</th>
                <th className="p-3">CREATED</th>
                <th className="p-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No tasks found matching current filters.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => handleInspect(task.id)}
                    className="hover:bg-[#141d30] cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-semibold text-cyan-300">
                      {task.id.slice(0, 16)}
                    </td>
                    <td className="p-3 text-slate-200">
                      {task.type}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        task.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        task.status === 'RUNNING' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse' :
                        task.status === 'QUEUED' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                        task.status === 'CANCELLED' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                        'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        task.priority === 'CRITICAL' ? 'bg-rose-950 text-rose-300' :
                        task.priority === 'HIGH' ? 'bg-amber-950 text-amber-300' :
                        'bg-[#070b14] text-slate-400'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">
                      {task.assigned_agent_id || 'unassigned'}
                    </td>
                    <td className="p-3 text-slate-400">
                      {task.retry_count}/{task.max_retries}
                    </td>
                    <td className="p-3 text-slate-500 text-[10px]">
                      {new Date(task.created_at).toLocaleTimeString()}
                    </td>
                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {task.status === 'FAILED' && (
                          <button
                            onClick={() => handleRetry(task.id)}
                            className="p-1 rounded bg-[#070b14] hover:bg-[#1e293b] text-amber-300"
                            title="Retry Task"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {(task.status === 'QUEUED' || task.status === 'RUNNING') && (
                          <button
                            onClick={() => handleCancel(task.id)}
                            className="p-1 rounded bg-[#070b14] hover:bg-[#1e293b] text-rose-300"
                            title="Cancel Task"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleInspect(task.id)}
                          className="p-1 rounded bg-[#070b14] hover:bg-[#1e293b] text-cyan-300"
                          title="Inspect Details"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Details Drawer */}
      {selectedTask && (
        <div className="bg-[#0d1322] border border-cyan-500/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-cyan-400" />
              <div>
                <h2 className="text-sm font-mono font-bold text-slate-100">
                  Task Inspector: {selectedTask.id}
                </h2>
                <div className="text-[10px] text-slate-400 font-mono">
                  Submitted by {selectedTask.submitted_by} • Priority: {selectedTask.priority}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedTask(null)}
              className="text-xs font-mono text-slate-400 hover:text-slate-200"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payload */}
            <div className="bg-[#070b14] border border-[#1e293b] rounded-lg p-3">
              <div className="text-xs font-mono text-slate-300 font-semibold mb-2">
                Input Payload
              </div>
              <pre className="text-[11px] font-mono text-slate-300 bg-[#0d1322] p-2.5 rounded overflow-x-auto max-h-48">
                {JSON.stringify(selectedTask.payload, null, 2)}
              </pre>
            </div>

            {/* Results or Error */}
            <div className="bg-[#070b14] border border-[#1e293b] rounded-lg p-3">
              <div className="text-xs font-mono text-slate-300 font-semibold mb-2">
                Result Payload / Error Trace
              </div>
              {selectedTask.error ? (
                <div className="text-[11px] font-mono text-rose-300 bg-rose-950/40 border border-rose-900 p-2.5 rounded">
                  {selectedTask.error}
                </div>
              ) : selectedTask.result ? (
                <pre className="text-[11px] font-mono text-emerald-300 bg-[#0d1322] p-2.5 rounded overflow-x-auto max-h-48">
                  {JSON.stringify(selectedTask.result, null, 2)}
                </pre>
              ) : (
                <div className="text-[11px] font-mono text-slate-500">
                  No execution output available yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enqueue Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0d1322] border border-[#1e293b] rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
              <h2 className="text-sm font-mono font-bold text-slate-100 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-emerald-400" />
                Enqueue New Work Task
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white font-mono text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Task Type</label>
                <select
                  value={createForm.type}
                  onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                  className="w-full bg-[#070b14] border border-[#1e293b] rounded p-2 text-slate-100 outline-none"
                >
                  <option value="pr_assessment">pr_assessment</option>
                  <option value="ast_diff_review">ast_diff_review</option>
                  <option value="ci_build">ci_build</option>
                  <option value="security_audit">security_audit</option>
                  <option value="deployment_proof">deployment_proof</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Priority</label>
                <select
                  value={createForm.priority}
                  onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                  className="w-full bg-[#070b14] border border-[#1e293b] rounded p-2 text-slate-100 outline-none"
                >
                  <option value="LOW">LOW</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">JSON Payload</label>
                <textarea
                  rows={4}
                  value={createForm.payloadStr}
                  onChange={(e) => setCreateForm({ ...createForm, payloadStr: e.target.value })}
                  className="w-full bg-[#070b14] border border-[#1e293b] rounded p-2 text-slate-100 outline-none font-mono resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded bg-[#070b14] text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Enqueue into acc-tasks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
