import React from 'react';
import { ArchitectureRule, SecurityVulnerability, AgentTrack } from '../types/review';
import { AlertOctagon, CheckCircle2, ShieldAlert, Layers, ArrowRight, GitCommit, FileText, Lock, Database, Terminal } from 'lucide-react';

interface OverviewSummaryProps {
  onNavigateTab: (tab: string) => void;
  onShowGuidelines: () => void;
  onOpenExportModal: () => void;
}

export const OverviewSummary: React.FC<OverviewSummaryProps> = ({
  onNavigateTab,
  onShowGuidelines,
  onOpenExportModal,
}) => {
  return (
    <div className="space-y-6 text-left">
      {/* Executive Review Banner */}
      <div className="p-5 rounded-xl border border-rose-900/50 bg-rose-950/20 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-rose-950 text-rose-400 border border-rose-800/60 mt-0.5">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-rose-400 uppercase tracking-wider font-semibold">
                <span>GuardrailAI Review Engine Verdict</span>
                <span aria-hidden="true">·</span>
                <span>Automated PR Gate</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                Pull Request #104: Changes Requested (Non-Compliant)
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
                The automated dual-track analysis by <strong>GuardrailAI (IBM Bob 2.0 Agentic Framework)</strong> has evaluated pull request #104 against internal <button onClick={onShowGuidelines} className="text-indigo-400 hover:text-indigo-300 underline font-medium">ARCHITECTURE.md</button> guidelines and DevSecOps security baselines. The review identified <strong>3 blocking architectural violations</strong> and <strong>2 critical security credential leaks (CWE-798)</strong>. A complete, ready-to-commit refactored code patch has been generated.
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('diff')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>View Code Patch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenExportModal}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/80 rounded-md hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy PR Comment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Parallel Tracks Quick Snapshot */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Track 1 Snapshot */}
        <div
          onClick={() => onNavigateTab('tracks')}
          className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-rose-800/50 hover:bg-slate-900/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-950/60 text-rose-400 border border-rose-800/40">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400">Track 01</span>
                <h3 className="text-sm font-semibold text-white group-hover:text-rose-300 transition-colors">
                  DevSecOps Security Track
                </h3>
              </div>
            </div>
            <span className="text-xs font-mono text-rose-400 font-semibold">
              4 Issues Flagged
            </span>
          </div>

          <div className="mt-3.5 space-y-2 text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-rose-400 font-mono text-[10px] mt-0.5">CRIT</span>
              <span><strong>Line 5:</strong> Hardcoded production API secret key (<code className="font-mono text-rose-300 text-[11px]">sk-live-5582...</code>).</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-rose-400 font-mono text-[10px] mt-0.5">CRIT</span>
              <span><strong>Line 6:</strong> Hardcoded MongoDB admin password in URI (<code className="font-mono text-rose-300 text-[11px]">admin:password123</code>).</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-amber-400 font-mono text-[10px] mt-0.5">HIGH</span>
              <span><strong>Line 10:</strong> New <code className="font-mono text-slate-300">MongoClient</code> created per request causes socket leak.</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-indigo-400 font-medium">
            <span>Inspect DevSecOps reasoning logs</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Track 2 Snapshot */}
        <div
          onClick={() => onNavigateTab('tracks')}
          className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-amber-800/50 hover:bg-slate-900/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/40">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400">Track 02</span>
                <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                  Software Architect Track
                </h3>
              </div>
            </div>
            <span className="text-xs font-mono text-amber-400 font-semibold">
              3 Guidelines Failed
            </span>
          </div>

          <div className="mt-3.5 space-y-2 text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-amber-400 font-mono text-[10px] mt-0.5">RULE 1</span>
              <span><strong>Repository Layer:</strong> Bypassed by raw PyMongo collection access in controller.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-amber-400 font-mono text-[10px] mt-0.5">RULE 2</span>
              <span><strong>Secret Config:</strong> Hardcoded constants violate 12-factor process environment rule.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-amber-400 font-mono text-[10px] mt-0.5">RULE 3</span>
              <span><strong>Try-Catch:</strong> 0 error handling blocks present, exposing system to 500 crashes.</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-indigo-400 font-medium">
            <span>Inspect Architecture compliance breakdown</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Summary Matrix Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Repository Policy Audit Matrix</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Target: ARCHITECTURE.md</span>
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/20">
            <div className="flex items-start gap-3">
              <span className="text-rose-400 font-mono font-semibold shrink-0">FAILED</span>
              <div>
                <strong className="text-white">Rule 1: Repository Pattern Enforcement</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">Raw pymongo calls directly inside handle_user_request().</p>
              </div>
            </div>
            <span className="font-mono text-rose-300 text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Remediation: UserRepository abstraction
            </span>
          </div>

          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/20">
            <div className="flex items-start gap-3">
              <span className="text-rose-400 font-mono font-semibold shrink-0">FAILED</span>
              <div>
                <strong className="text-white">Rule 2: Environment Variables for Secrets</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">Hardcoded API_SECRET_KEY and DB_URI strings in code.</p>
              </div>
            </div>
            <span className="font-mono text-rose-300 text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Remediation: os.getenv() configuration class
            </span>
          </div>

          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/20">
            <div className="flex items-start gap-3">
              <span className="text-rose-400 font-mono font-semibold shrink-0">FAILED</span>
              <div>
                <strong className="text-white">Rule 3: Try-Catch Exception Boundaries</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">No try-except handling in controller or database execution.</p>
              </div>
            </div>
            <span className="font-mono text-rose-300 text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Remediation: PyMongoError & generic try-except
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
