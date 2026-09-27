import React from 'react';
import { X, BookOpen, CheckCircle2, Shield, Layers, AlertCircle } from 'lucide-react';

interface GuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidelinesModal: React.FC<GuidelinesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative text-left">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">INTERNAL REPOSITORY: ARCHITECTURE.md</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <div className="flex items-start gap-3">
              <Layers className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-white">Guideline 1: Repository Layer Pattern</h3>
                <blockquote className="mt-1 text-xs text-slate-300 italic border-l-2 border-amber-500/50 pl-2.5 py-0.5">
                  &ldquo;Every database interaction MUST use the repository layer pattern. Raw SQL queries or direct DB library calls inside views/controllers are strictly forbidden.&rdquo;
                </blockquote>
                <p className="mt-2 text-xs text-slate-400">
                  <strong className="text-slate-300">Rationale:</strong> Isolates persistence mechanisms from controller transport logic, enables mock unit testing, and manages DB client pooling without socket leakage.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-rose-400 mt-1 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-white">Guideline 2: Secret & Environment Configuration</h3>
                <blockquote className="mt-1 text-xs text-slate-300 italic border-l-2 border-rose-500/50 pl-2.5 py-0.5">
                  &ldquo;Sensitive environment variables (API keys, secrets, tokens) must never be hardcoded. They must be loaded via process environment configs or secret managers.&rdquo;
                </blockquote>
                <p className="mt-2 text-xs text-slate-400">
                  <strong className="text-slate-300">Rationale:</strong> Prevents credentials and authentication tokens from entering version control history, enables credential rotation, and complies with SOC2 and ISO 27001.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-white">Guideline 3: Try-Catch Error Boundaries</h3>
                <blockquote className="mt-1 text-xs text-slate-300 italic border-l-2 border-indigo-500/50 pl-2.5 py-0.5">
                  &ldquo;All functional blocks must contain basic try-catch error handling logic to prevent runtime exceptions.&rdquo;
                </blockquote>
                <p className="mt-2 text-xs text-slate-400">
                  <strong className="text-slate-300">Rationale:</strong> Prevents unhandled server 500 crashes from transient network timeouts, database query exceptions, or unexpected payload shapes.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
