import React, { useState } from 'react';
import { SUBMITTED_CODE, CORRECTED_CODE_SINGLE, GIT_DIFF_PATCH } from '../data/prReviewData';
import { Copy, Check, Split, FileCode, CheckCircle2, AlertTriangle } from 'lucide-react';

interface CodeDiffViewerProps {
  highlightLine?: number | null;
}

export const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({ highlightLine }) => {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedCorrected, setCopiedCorrected] = useState(false);

  const handleCopy = (text: string, type: 'original' | 'corrected') => {
    navigator.clipboard.writeText(text);
    if (type === 'original') {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedCorrected(true);
      setTimeout(() => setCopiedCorrected(false), 2000);
    }
  };

  const submittedLines = SUBMITTED_CODE.split('\n');
  const correctedLines = CORRECTED_CODE_SINGLE.split('\n');

  // Flagged line checks
  const isLineFlagged = (lineNum: number) => {
    return [5, 6, 10, 14].includes(lineNum);
  };

  const getLineAnnotation = (lineNum: number) => {
    switch (lineNum) {
      case 5:
        return 'CRITICAL: Hardcoded API Secret Key (Rule 2 / CWE-798)';
      case 6:
        return 'CRITICAL: Plaintext Database Password in URI (Rule 2 / CWE-798)';
      case 10:
        return 'BLOCKING: Direct MongoClient in Controller & Socket Leak (Rule 1 / CWE-400)';
      case 14:
        return 'BLOCKING: Raw collection.insert without try/catch or Repository (Rule 1 & 3)';
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span>Interactive Code Diff & Architectural Refactor</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare the developer's submitted controller code with the compliant Repository Pattern implementation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'split'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'unified'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Unified Git Patch</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'split' ? (
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left Panel: Submitted Code */}
          <div className="rounded-xl border border-rose-900/40 bg-slate-950 overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 bg-rose-950/30 border-b border-rose-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-xs font-mono font-medium text-rose-300">
                  controllers/user_controller.py (Original Submitted)
                </span>
              </div>
              <button
                onClick={() => handleCopy(SUBMITTED_CODE, 'original')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                title="Copy original code"
              >
                {copiedOriginal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedOriginal ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3 font-mono text-xs overflow-x-auto flex-1 leading-relaxed">
              {submittedLines.map((line, idx) => {
                const lineNum = idx + 1;
                const flagged = isLineFlagged(lineNum);
                const annotation = getLineAnnotation(lineNum);
                const isTargetHighlight = highlightLine === lineNum;

                return (
                  <div key={lineNum} className="group">
                    <div
                      className={`flex items-start rounded px-1.5 py-0.5 transition-colors ${
                        flagged
                          ? 'bg-rose-950/40 text-rose-200 border-l-2 border-rose-500'
                          : isTargetHighlight
                          ? 'bg-indigo-950/50 text-indigo-200'
                          : 'text-slate-300 hover:bg-slate-900/50'
                      }`}
                    >
                      <span className="text-slate-600 select-none w-8 text-right pr-3 shrink-0 tabular-nums">
                        {lineNum}
                      </span>
                      <span className="flex-1 whitespace-pre">{line || ' '}</span>
                    </div>

                    {flagged && annotation && (
                      <div className="my-1 ml-8 mr-2 p-1.5 rounded bg-rose-950/70 border border-rose-800/60 text-[11px] text-rose-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                        <span>{annotation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-xs text-rose-300 flex items-center justify-between">
              <span>Status: Non-Compliant with ARCHITECTURE.md</span>
              <span className="font-mono text-rose-400 font-semibold">4 Flagged Lines</span>
            </div>
          </div>

          {/* Right Panel: Corrected Code */}
          <div className="rounded-xl border border-emerald-900/40 bg-slate-950 overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 bg-emerald-950/30 border-b border-emerald-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono font-medium text-emerald-300">
                  controllers/user_controller.py (Architect Refactor)
                </span>
              </div>
              <button
                onClick={() => handleCopy(CORRECTED_CODE_SINGLE, 'corrected')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                title="Copy corrected code"
              >
                {copiedCorrected ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCorrected ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3 font-mono text-xs overflow-x-auto flex-1 max-h-[620px] leading-relaxed">
              {correctedLines.map((line, idx) => {
                const lineNum = idx + 1;
                const isCommentHeader = line.startsWith('# =');
                const isRepository = line.includes('class UserRepository');
                const isTry = line.trim().startsWith('try:') || line.trim().startsWith('except');
                const isEnv = line.includes('os.getenv');

                return (
                  <div
                    key={lineNum}
                    className={`flex items-start rounded px-1.5 py-0.5 ${
                      isEnv || isRepository || isTry
                        ? 'bg-emerald-950/30 text-emerald-200'
                        : isCommentHeader
                        ? 'text-indigo-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-900/50'
                    }`}
                  >
                    <span className="text-slate-600 select-none w-8 text-right pr-3 shrink-0 tabular-nums">
                      {lineNum}
                    </span>
                    <span className="flex-1 whitespace-pre">{line || ' '}</span>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-xs text-emerald-300 flex items-center justify-between">
              <span>Status: Fully Compliant with ARCHITECTURE.md</span>
              <span className="font-mono text-emerald-400 font-semibold">Repository Pattern Active</span>
            </div>
          </div>
        </div>
      ) : (
        /* Unified Git Diff View */
        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-300">
              git diff patch · Ready for git apply
            </span>
            <button
              onClick={() => handleCopy(GIT_DIFF_PATCH, 'corrected')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              {copiedCorrected ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCorrected ? 'Copied Patch' : 'Copy Git Diff'}</span>
            </button>
          </div>

          <div className="p-4 font-mono text-xs overflow-x-auto max-h-[600px] leading-relaxed">
            {GIT_DIFF_PATCH.split('\n').map((line, idx) => {
              const isAdded = line.startsWith('+') && !line.startsWith('+++');
              const isRemoved = line.startsWith('-') && !line.startsWith('---');
              const isHeader = line.startsWith('@@') || line.startsWith('---') || line.startsWith('+++');

              return (
                <div
                  key={idx}
                  className={`px-2 py-0.5 whitespace-pre ${
                    isAdded
                      ? 'bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500'
                      : isRemoved
                      ? 'bg-rose-950/40 text-rose-300 border-l-2 border-rose-500 line-through opacity-80'
                      : isHeader
                      ? 'text-indigo-400 font-bold bg-slate-900/40'
                      : 'text-slate-400'
                  }`}
                >
                  {line || ' '}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
