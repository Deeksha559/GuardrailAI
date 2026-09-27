import React from 'react';
import { GitPullRequest, AlertTriangle, ShieldX, Bot, BookOpen } from 'lucide-react';

interface PRBannerProps {
  onShowGuidelines: () => void;
}

export const PRBanner: React.FC<PRBannerProps> = ({ onShowGuidelines }) => {
  return (
    <div className="bg-slate-900/60 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-mono">
              <span className="flex items-center gap-1 text-indigo-400 font-medium">
                <GitPullRequest className="w-3.5 h-3.5" />
                <span>PR #104</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>branch: feature/user-auth</span>
              <span aria-hidden="true">→</span>
              <span>main</span>
              <span aria-hidden="true">·</span>
              <span>author: @dev-contributor</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white flex items-center gap-3">
              <span>feat(auth): add user registration endpoint and DB connection</span>
            </h1>

            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Changes Requested by GuardrailAI</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>IBM Bob 2.0 Agentic Framework</span>
              <span aria-hidden="true">·</span>
              <button
                onClick={onShowGuidelines}
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 flex items-center gap-1"
              >
                <BookOpen className="w-3 h-3" />
                <span>View ARCHITECTURE.md</span>
              </button>
            </div>
          </div>

          {/* Metric cards with single elevation, clean borders, tabular numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <div className="text-xs text-slate-500 font-medium">Architecture Rules</div>
              <div className="text-xl font-bold font-mono tabular-nums text-rose-400 mt-0.5">3 / 3 Failed</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Strict Enforcement</div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <div className="text-xs text-slate-500 font-medium">Security Leaks</div>
              <div className="text-xl font-bold font-mono tabular-nums text-rose-400 mt-0.5">2 Critical</div>
              <div className="text-[11px] text-slate-400 mt-0.5">CWE-798 Secrets</div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <div className="text-xs text-slate-500 font-medium">Parallel Agents</div>
              <div className="text-xl font-bold font-mono tabular-nums text-indigo-400 mt-0.5">2 Active</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Dual Reasoning</div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <div className="text-xs text-slate-500 font-medium">Commit Patch</div>
              <div className="text-xl font-bold font-mono tabular-nums text-emerald-400 mt-0.5">Ready</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Validated Clean</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
