import React, { useState, useMemo } from 'react';
import { SUBMITTED_CODE, CORRECTED_CODE_SINGLE } from '../data/prReviewData';
import { Play, RotateCcw, CheckCircle2, AlertTriangle, Shield, Layers, HelpCircle } from 'lucide-react';

export const InteractiveAnalyzer: React.FC = () => {
  const [code, setCode] = useState<string>(SUBMITTED_CODE);
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  // Live Rule Evaluations based on ARCHITECTURE.md
  const evaluation = useMemo(() => {
    const lines = code.split('\n');

    // Rule 1: Repository Pattern
    // Check if raw pymongo is instantiated directly inside controller or raw collection insert
    const hasRawMongoInFunc = /def\s+[a-zA-Z0-9_]+\s*\([^)]*\):[\s\S]*?(pymongo\.MongoClient|insert_one|find_one)/.test(code);
    const hasRepositoryClass = /class\s+[a-zA-Z0-9_]*Repository/.test(code);
    const passesRule1 = hasRepositoryClass && !hasRawMongoInFunc;

    // Rule 2: Hardcoded Secrets
    const hasHardcodedApiKey = /API_SECRET_KEY\s*=\s*["'][^"']+["']/.test(code) && !code.includes('os.getenv("API_SECRET_KEY"');
    const hasHardcodedMongoPassword = /mongodb(\+srv)?:\/\/[a-zA-Z0-9_]+:[^@]+@/.test(code);
    const hasHardcodedString = hasHardcodedApiKey || hasHardcodedMongoPassword;
    const passesRule2 = !hasHardcodedString && code.includes('os.getenv');

    // Rule 3: Try-Catch Handling
    const hasTryBlock = /try\s*:/.test(code);
    const hasExceptBlock = /except\s*.*:/.test(code);
    const passesRule3 = hasTryBlock && hasExceptBlock;

    const detectedHardcodedLines: number[] = [];
    lines.forEach((line, index) => {
      if (
        (line.includes('API_SECRET_KEY') && line.includes('"sk-')) ||
        (line.includes('mongodb') && line.includes('@'))
      ) {
        detectedHardcodedLines.push(index + 1);
      }
    });

    const isFullyCompliant = passesRule1 && passesRule2 && passesRule3;

    return {
      passesRule1,
      passesRule2,
      passesRule3,
      detectedHardcodedLines,
      isFullyCompliant,
    };
  }, [code]);

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 400);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Play className="w-4 h-4 text-indigo-400" />
            <span>PR Analyzer Playground</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify the Python code below to test how GuardrailAI evaluates ARCHITECTURE.md compliance in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCode(SUBMITTED_CODE)}
            className="px-3 py-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-700/80 rounded-md hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Developer Code</span>
          </button>
          <button
            onClick={() => setCode(CORRECTED_CODE_SINGLE)}
            className="px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 rounded-md hover:bg-emerald-900/60 transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Load Compliant Patch</span>
          </button>
        </div>
      </div>

      {/* Editor & Real-time Rule Matrix */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Editor Box */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-300">Editor: controllers/user_controller.py</span>
            <span className="text-slate-500 font-mono">Lines: {code.split('\n').length}</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-[450px] p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-indigo-500/30"
            placeholder="Paste or write Python code here..."
            spellCheck={false}
          />

          <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Interactive simulator tests repository pattern, env vars & try/catch.
            </span>
            <button
              onClick={handleRunAnalysis}
              disabled={analyzing}
              className="px-3.5 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{analyzing ? 'Evaluating...' : 'Re-run Analyzer'}</span>
            </button>
          </div>
        </div>

        {/* Live Evaluation Status */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`p-4 rounded-xl border ${
            evaluation.isFullyCompliant 
              ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' 
              : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
          }`}>
            <div className="flex items-center gap-2.5 mb-1.5">
              {evaluation.isFullyCompliant ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <h3 className="text-sm font-semibold text-white">
                {evaluation.isFullyCompliant
                  ? 'Pull Request Approved · All Rules Pass'
                  : 'Pull Request Blocked · Policy Violations'}
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              {evaluation.isFullyCompliant
                ? 'Code adheres to Repository Pattern, 12-factor configuration, and try/catch fault tolerance.'
                : 'One or more ARCHITECTURE.md repository rules failed validation. See live status below.'}
            </p>
          </div>

          {/* Rule Checks */}
          <div className="space-y-3">
            {/* Rule 1 */}
            <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Rule 1: Repository Layer Pattern</span>
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
                  evaluation.passesRule1
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {evaluation.passesRule1 ? 'PASSED' : 'VIOLATION'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {evaluation.passesRule1
                  ? 'Repository class cleanly abstracts database interactions from request controller.'
                  : 'Direct DB calls or client instantiation found in controller without UserRepository class.'}
              </p>
            </div>

            {/* Rule 2 */}
            <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-rose-400" />
                  <span>Rule 2: Environment Variables (Secrets)</span>
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
                  evaluation.passesRule2
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {evaluation.passesRule2 ? 'PASSED' : 'VIOLATION'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {evaluation.passesRule2
                  ? 'No hardcoded credentials found. Variables loaded via os.getenv().'
                  : 'Hardcoded secret key or plaintext database credentials detected.'}
              </p>
            </div>

            {/* Rule 3 */}
            <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Rule 3: Try-Catch Error Boundary</span>
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
                  evaluation.passesRule3
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {evaluation.passesRule3 ? 'PASSED' : 'VIOLATION'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {evaluation.passesRule3
                  ? 'Function blocks protected by try-except blocks handling operational failures.'
                  : 'No try-except error handling logic detected in functional code blocks.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
