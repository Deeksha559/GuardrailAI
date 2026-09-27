import React from 'react';
import { ShieldCheck, Download, Copy, Check } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenExportModal: () => void;
  onApplyPatch: () => void;
  patchApplied: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenExportModal,
  onApplyPatch,
  patchApplied,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyReview = () => {
    onOpenExportModal();
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white hover:text-indigo-400 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span>GuardrailAI</span>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-white bg-slate-800/80'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Review Summary
          </button>
          <button
            onClick={() => setActiveTab('tracks')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'tracks'
                ? 'text-white bg-slate-800/80'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Parallel Agent Tracks
          </button>
          <button
            onClick={() => setActiveTab('violations')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'violations'
                ? 'text-white bg-slate-800/80'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Policy Violations
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'diff'
                ? 'text-white bg-slate-800/80'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Code Diff & Patch
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'playground'
                ? 'text-white bg-slate-800/80'
                : 'hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            PR Analyzer Lab
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyReview}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/80 rounded-md hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>GitHub Markdown</span>
          </button>
          <button
            onClick={onApplyPatch}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
              patchApplied
                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20'
            }`}
          >
            {patchApplied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Patch Ready</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Apply Patch</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
