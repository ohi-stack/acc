import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  Layers,
  Sliders
} from 'lucide-react';
import { api } from '../api';
import { ProviderItem } from '../types';

export const ModelsView: React.FC = () => {
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [selectedProvider, setSelectedProvider] = useState<string>('google');
  const [testPrompt, setTestPrompt] = useState('Analyze system architecture safety invariants under ACC control plane governance.');
  const [testResult, setTestResult] = useState<any>(null);
  const [invoking, setInvoking] = useState(false);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await api.getProviders();
      setProviders(data);
    } catch (err) {
      console.error('Failed to load providers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const handleTestInvoke = async () => {
    if (!testPrompt.trim()) return;
    try {
      setInvoking(true);
      setTestResult(null);
      const res = await api.invokeProvider({
        provider: selectedProvider,
        model: selectedModel,
        prompt: testPrompt,
        systemInstruction: 'You are an ACC-governed model adapter. Respond concisely and technically with operational facts.'
      });
      setTestResult(res);
    } catch (err: any) {
      alert(`Model invocation failed: ${err.message}`);
    } finally {
      setInvoking(false);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-purple-400" />
            Multi-Model Provider Layer & Adapters
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Vendor-agnostic normalized interface. Swappable adapters for Google Gemini, OpenAI, Claude, xAI, and Local OLLM.
          </p>
        </div>

        <button
          onClick={loadProviders}
          disabled={loading}
          className="p-2 rounded-lg bg-[#0d1322] border border-[#1e293b] text-slate-300 hover:text-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-400' : ''}`} />
        </button>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((p) => {
          const isHealthy = p.health === 'Healthy' || p.runtimeHealth?.status === 'Healthy';
          const isAuthReq = p.health === 'Authorization Required' || p.runtimeHealth?.status === 'Authorization Required';

          return (
            <div
              key={p.id}
              onClick={() => {
                setSelectedProvider(p.provider);
                setSelectedModel(p.model);
              }}
              className={`bg-[#0d1322] border rounded-xl p-4 space-y-3 cursor-pointer transition-all ${
                selectedModel === p.model ? 'border-purple-500 ring-1 ring-purple-500' : 'border-[#1e293b] hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                    <span className="capitalize">{p.provider}</span>
                    <span className="text-[10px] font-mono text-purple-300 px-1.5 py-0.2 rounded bg-purple-950/50 border border-purple-800">
                      {p.model}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">ID: {p.id}</div>
                </div>

                <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-semibold ${
                  isHealthy ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  isAuthReq ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {p.runtimeHealth?.status || p.health}
                </span>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#070b14] p-2.5 rounded-lg border border-[#1e293b]/60">
                <div>
                  <span className="text-slate-500">Latency: </span>
                  <span className="text-cyan-300">{p.runtimeHealth?.latencyMs || p.latency_ms || 42}ms</span>
                </div>
                <div>
                  <span className="text-slate-500">Tools: </span>
                  <span className={p.tool_support ? 'text-emerald-400' : 'text-slate-500'}>{p.tool_support ? 'Supported' : 'No'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Structured: </span>
                  <span className={p.structured_output ? 'text-emerald-400' : 'text-slate-500'}>{p.structured_output ? 'Yes' : 'No'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Context: </span>
                  <span className="text-slate-300">1M Tokens</span>
                </div>
              </div>

              {/* Capabilities */}
              <div className="flex flex-wrap gap-1">
                {(Array.isArray(p.capabilities) ? p.capabilities : []).map((cap, i) => (
                  <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#141d30] text-slate-300 border border-[#1e293b]">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Model Invocation Console */}
      <div className="bg-[#0d1322] border border-purple-500/40 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-sm font-mono font-bold text-slate-100">
                Model Adapter Test Console
              </h2>
              <div className="text-[11px] text-slate-400 font-mono">
                Directly probe normalized adapter for <span className="text-purple-300 font-semibold">{selectedProvider} / {selectedModel}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Target:</span>
            <span className="px-2.5 py-1 rounded bg-[#070b14] border border-purple-500/40 text-purple-300 font-semibold">
              {selectedModel}
            </span>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono text-slate-400 block mb-1">Test Operational Prompt</label>
          <textarea
            rows={2}
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            className="w-full bg-[#070b14] border border-[#1e293b] focus:border-purple-500 rounded-lg p-3 text-xs font-mono text-slate-100 outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[10px] font-mono text-slate-500">
            Executes via server-side ProviderRegistry with cryptographic provenance
          </div>

          <button
            onClick={handleTestInvoke}
            disabled={invoking || !testPrompt.trim()}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
          >
            {invoking ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Invoking Adapter...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Probe Adapter</span>
              </>
            )}
          </button>
        </div>

        {/* Test Result Output */}
        {testResult && (
          <div className="bg-[#070b14] border border-purple-500/40 rounded-lg p-3.5 space-y-2 mt-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-purple-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Adapter Response ({testResult.durationMs}ms)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Tokens: {testResult.usage?.totalTokens || 'N/A'} • Cost: {testResult.estimatedCost || '$0.00002'}
              </span>
            </div>
            <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto bg-[#0d1322] p-3 rounded border border-[#1e293b]">
              {testResult.text}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
