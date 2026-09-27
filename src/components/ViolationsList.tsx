import React from 'react';
import { ArchitectureRule, SecurityVulnerability } from '../types/review';
import { AlertOctagon, ShieldAlert, BookOpen, CheckCircle, ArrowRight, Code } from 'lucide-react';

interface ViolationsListProps {
  architectureRules: ArchitectureRule[];
  vulnerabilities: SecurityVulnerability[];
  onInspectCodeLine?: (lineNumber: number) => void;
}

export const ViolationsList: React.FC<ViolationsListProps> = ({
  architectureRules,
  vulnerabilities,
  onInspectCodeLine,
}) => {
  return (
    <div className="space-y-8">
      {/* Section 1: ARCHITECTURE.md Guideline Violations */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Internal Repository Violations (ARCHITECTURE.md)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              The submitted pull request was cross-referenced against the repository guidelines. All 3 rules were broken.
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-rose-400">
            3 Violations (Blocking)
          </span>
        </div>

        <div className="grid gap-4 mt-4">
          {architectureRules.map((rule, idx) => (
            <div
              key={rule.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-all text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-mono text-xs font-semibold">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-white">{rule.name}</h3>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-rose-400 font-mono uppercase font-semibold">
                    Rule Broken
                  </span>
                  {rule.lineNumbers && (
                    <span className="text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      Lines: {rule.lineNumbers.join(', ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Exact documentation quote */}
              <div className="mt-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800/60">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>ARCHITECTURE.md Requirement:</span>
                  <span className="text-rose-400 font-normal">STRICT MANDATE</span>
                </div>
                <p className="text-xs text-slate-200 italic font-mono bg-slate-900/60 p-2 rounded border border-slate-800">
                  &ldquo;{rule.documentationQuote}&rdquo;
                </p>
              </div>

              {/* Finding & Recommendation */}
              <div className="mt-3 grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/40">
                  <div className="font-semibold text-slate-300 mb-1">Developer Violation:</div>
                  <p className="text-slate-400 leading-relaxed">
                    {rule.description}
                  </p>
                </div>
                <div className="p-3 bg-indigo-950/20 rounded-lg border border-indigo-900/30">
                  <div className="font-semibold text-indigo-300 mb-1">Required Architectural Fix:</div>
                  <p className="text-slate-300 leading-relaxed">
                    {rule.recommendation}
                  </p>
                </div>
              </div>

              {rule.lineNumbers && onInspectCodeLine && (
                <div className="mt-3 pt-3 border-t border-slate-800/60 flex justify-end">
                  <button
                    onClick={() => onInspectCodeLine(rule.lineNumbers![0])}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <span>View flagged lines in Diff</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: DevSecOps Vulnerabilities & Exploits */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>DevSecOps Vulnerabilities & Secret Exposure (CWE Matrix)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live credentials, database authentication strings, and DoS vectors discovered during static AST evaluation.
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-rose-400">
            {vulnerabilities.length} Security Hazards
          </span>
        </div>

        <div className="grid gap-4 mt-4">
          {vulnerabilities.map((vuln) => (
            <div
              key={vuln.title}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700/80 transition-all text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 text-xs font-mono font-semibold rounded ${
                    vuln.severity === 'critical'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {vuln.cwe} · {vuln.severity.toUpperCase()}
                  </span>
                  <h3 className="text-sm font-semibold text-white">{vuln.title}</h3>
                </div>

                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Line {vuln.lineNumber}
                </span>
              </div>

              {/* Code snippet */}
              <div className="mt-3">
                <div className="text-[11px] font-mono text-slate-500 mb-1">Offending Code Snippet:</div>
                <div className="bg-rose-950/20 border border-rose-900/40 rounded p-2 text-xs font-mono text-rose-200 overflow-x-auto">
                  {vuln.snippet}
                </div>
              </div>

              <div className="mt-3 grid sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-slate-400 font-medium mb-1">Impact & Threat Model:</div>
                  <p className="text-slate-300 leading-relaxed">
                    {vuln.description}
                  </p>
                </div>
                <div>
                  <div className="text-emerald-400 font-medium mb-1">DevSecOps Remediation:</div>
                  <p className="text-slate-300 leading-relaxed">
                    {vuln.remediation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
