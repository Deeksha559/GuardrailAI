import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PRBanner } from './components/PRBanner';
import { OverviewSummary } from './components/OverviewSummary';
import { ParallelAgentTracks } from './components/ParallelAgentTracks';
import { ViolationsList } from './components/ViolationsList';
import { CodeDiffViewer } from './components/CodeDiffViewer';
import { PatchCommitSection } from './components/PatchCommitSection';
import { InteractiveAnalyzer } from './components/InteractiveAnalyzer';
import { GuidelinesModal } from './components/GuidelinesModal';
import { MarkdownExportModal } from './components/MarkdownExportModal';
import { ARCHITECTURE_RULES, SECURITY_VULNERABILITIES, DUAL_AGENT_TRACKS } from './data/prReviewData';
import { AgentThoughtStep } from './types/review';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [guidelinesModalOpen, setGuidelinesModalOpen] = useState<boolean>(false);
  const [markdownModalOpen, setMarkdownModalOpen] = useState<boolean>(false);
  const [highlightLine, setHighlightLine] = useState<number | null>(null);
  const [patchApplied, setPatchApplied] = useState<boolean>(false);

  const handleInspectLine = (lineNumber: number) => {
    setHighlightLine(lineNumber);
    setActiveTab('diff');
  };

  const handleSelectFinding = (step: AgentThoughtStep) => {
    // If step has line information, parse or route
    if (step.id === 'sec-1') handleInspectLine(5);
    else if (step.id === 'sec-2') handleInspectLine(6);
    else if (step.id === 'sec-3') handleInspectLine(10);
    else if (step.id === 'sec-4') handleInspectLine(14);
    else if (step.id === 'arch-1') handleInspectLine(10);
    else if (step.id === 'arch-2') handleInspectLine(5);
    else if (step.id === 'arch-3') handleInspectLine(14);
  };

  const handleApplyPatch = () => {
    setPatchApplied(true);
    setActiveTab('diff');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract (1 Row, 3 Zones) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExportModal={() => setMarkdownModalOpen(true)}
        onApplyPatch={handleApplyPatch}
        patchApplied={patchApplied}
      />

      {/* Pull Request Context & Summary Banner */}
      <PRBanner onShowGuidelines={() => setGuidelinesModalOpen(true)} />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab content navigation bar on mobile */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-4 mb-4 border-b border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'}`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('tracks')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'tracks' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'}`}
          >
            Parallel Tracks
          </button>
          <button
            onClick={() => setActiveTab('violations')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'violations' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'}`}
          >
            Violations
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'diff' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'}`}
          >
            Code Diff
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'playground' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'}`}
          >
            Playground
          </button>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <OverviewSummary
              onNavigateTab={(tab) => setActiveTab(tab)}
              onShowGuidelines={() => setGuidelinesModalOpen(true)}
              onOpenExportModal={() => setMarkdownModalOpen(true)}
            />
            <div className="pt-4 border-t border-slate-800">
              <PatchCommitSection
                isApplied={patchApplied}
                onApplied={() => setPatchApplied(true)}
              />
            </div>
          </div>
        )}

        {activeTab === 'tracks' && (
          <ParallelAgentTracks
            tracks={DUAL_AGENT_TRACKS}
            onSelectFinding={handleSelectFinding}
          />
        )}

        {activeTab === 'violations' && (
          <ViolationsList
            architectureRules={ARCHITECTURE_RULES}
            vulnerabilities={SECURITY_VULNERABILITIES}
            onInspectCodeLine={handleInspectLine}
          />
        )}

        {activeTab === 'diff' && (
          <div className="space-y-8">
            <CodeDiffViewer highlightLine={highlightLine} />
            <div className="pt-4 border-t border-slate-800">
              <PatchCommitSection
                isApplied={patchApplied}
                onApplied={() => setPatchApplied(true)}
              />
            </div>
          </div>
        )}

        {activeTab === 'playground' && (
          <InteractiveAnalyzer />
        )}
      </main>

      {/* Internal Guidelines Modal */}
      <GuidelinesModal
        isOpen={guidelinesModalOpen}
        onClose={() => setGuidelinesModalOpen(false)}
      />

      {/* GitHub Markdown Export Modal */}
      <MarkdownExportModal
        isOpen={markdownModalOpen}
        onClose={() => setMarkdownModalOpen(false)}
      />

      {/* Clean Footer conforming to anti-slop guidelines */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">GuardrailAI Core Execution Engine</span>
            <span aria-hidden="true">·</span>
            <span>IBM Bob 2.0 Agentic Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setGuidelinesModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              ARCHITECTURE.md Guidelines
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setMarkdownModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              Export Review Comment
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
