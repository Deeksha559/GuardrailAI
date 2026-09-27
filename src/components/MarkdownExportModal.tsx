import React, { useState } from 'react';
import { GITHUB_MARKDOWN_COMMENT } from '../data/prReviewData';
import { X, Copy, Check, FileText, CheckCircle2 } from 'lucide-react';

interface MarkdownExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarkdownExportModal: React.FC<MarkdownExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [viewTab, setViewTab] = useState<'raw' | 'rendered'>('rendered');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(GITHUB_MARKDOWN_COMMENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-semibold text-white">GitHub Pull Request Review Output</h2>
              <p className="text-xs text-slate-400">Formatted in standard GitHub Markdown for posting directly to PR #104.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-lg">
              <button
                onClick={() => setViewTab('rendered')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  viewTab === 'rendered' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Rendered Preview
              </button>
              <button
                onClick={() => setViewTab('raw')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  viewTab === 'raw' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Raw Markdown
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs leading-relaxed">
          {viewTab === 'raw' ? (
            <textarea
              readOnly
              value={GITHUB_MARKDOWN_COMMENT}
              className="w-full h-full min-h-[480px] bg-slate-950 text-slate-300 p-4 rounded-lg border border-slate-800 focus:outline-none resize-none font-mono selection:bg-indigo-500/30"
            />
          ) : (
            <div className="space-y-4 text-slate-200 font-sans">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="text-rose-400">●</span>
                    <span>GuardrailAI Pull Request Review Summary</span>
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    CHANGES REQUESTED
                  </span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div><strong>Execution Engine:</strong> IBM Bob 2.0 Agentic Framework (Dual-Track Parallel Analysis)</div>
                  <div><strong>Reviewed Changes:</strong> <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-300 font-mono">controllers/user_controller.py</code></div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-rose-400">1. DevSecOps Security Track Findings</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                  <li>
                    <strong className="text-rose-300">[CRITICAL] Hardcoded Live API Secret Key (CWE-798 / Rule 2):</strong> Line 5 hardcodes an active production secret: <code className="text-rose-300 bg-slate-950 px-1 font-mono">API_SECRET_KEY = "sk-live-55829a8fbc89221a8cd34ee"</code>. Immediate revocation required.
                  </li>
                  <li>
                    <strong className="text-rose-300">[CRITICAL] Hardcoded Database Credentials (CWE-798 / Rule 2):</strong> Line 6 exposes plaintext admin password (<code className="text-rose-300 font-mono">admin:password123</code>) in MongoDB connection string.
                  </li>
                  <li>
                    <strong className="text-amber-300">[HIGH] Connection Lifecycle / Resource Exhaustion (CWE-400):</strong> Line 10 creates a new <code className="font-mono">MongoClient</code> on every request invocation.
                  </li>
                  <li>
                    <strong className="text-amber-300">[MEDIUM] Missing Input Checks / KeyError DoS (CWE-754):</strong> Direct dictionary indexing on <code className="font-mono">request_data['username']</code> without validation.
                  </li>
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-semibold text-amber-400">2. Software Architect Track (Cross-Referencing ARCHITECTURE.md)</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                  <li>
                    <strong className="text-amber-300">[BLOCKING] Rule 1: Repository Layer Pattern Required:</strong> Controller directly connects to and inserts into MongoDB, violating the mandatory repository abstraction rule.
                  </li>
                  <li>
                    <strong className="text-amber-300">[BLOCKING] Rule 2: Environment Variable & Secret Management:</strong> Hardcoded API key and database URI violate 12-factor configuration guidelines.
                  </li>
                  <li>
                    <strong className="text-amber-300">[BLOCKING] Rule 3: Mandatory Try-Catch Error Handling:</strong> <code className="font-mono">handle_user_request</code> contains zero exception handling, leading to unhandled runtime 500 exceptions.
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-semibold text-emerald-400 mb-2">3. Ready-to-Commit Code Patch Preview</h4>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48">
                  <pre><code>{`# Repository Layer Pattern + Environment Config + Try/Catch Safety
class UserRepository:
    def __init__(self, client: pymongo.MongoClient): ...
    def create_user(self, username: str, email: str) -> Dict[str, Any]: ...

def handle_user_request(request_data: Dict[str, Any]):
    try:
        ...
        repo = get_user_repository()
        return repo.create_user(username, email)
    except Exception as exc: ...`}</code></pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>IBM Bob 2.0 GuardrailAI Engine v2.4</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
