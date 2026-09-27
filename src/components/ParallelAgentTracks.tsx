import React, { useState } from 'react';
import { AgentTrack, AgentThoughtStep } from '../types/review';
import { ShieldAlert, Layers, Clock, AlertCircle, CheckCircle, ChevronRight, Terminal, Cpu } from 'lucide-react';

interface ParallelAgentTracksProps {
  tracks: AgentTrack[];
  onSelectFinding?: (step: AgentThoughtStep) => void;
}

export const ParallelAgentTracks: React.FC<ParallelAgentTracksProps> = ({ tracks, onSelectFinding }) => {
  const [selectedTrackId, setSelectedTrackId] = useState<'both' | 'devsecops' | 'architect'>('both');
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  const filteredTracks = selectedTrackId === 'both' 
    ? tracks 
    : tracks.filter(t => t.id === selectedTrackId);

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Dual Parallel Analysis Tracks (IBM Bob 2.0 Agentic Framework)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Two specialized sub-agents independently evaluate the Pull Request across security and architectural dimensions in parallel.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setSelectedTrackId('both')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedTrackId === 'both'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Both Tracks
          </button>
          <button
            onClick={() => setSelectedTrackId('devsecops')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedTrackId === 'devsecops'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            DevSecOps
          </button>
          <button
            onClick={() => setSelectedTrackId('architect')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedTrackId === 'architect'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Software Architect
          </button>
        </div>
      </div>

      {/* Grid of tracks */}
      <div className={`grid gap-6 ${selectedTrackId === 'both' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {filteredTracks.map(track => {
          const isDevSec = track.id === 'devsecops';
          const accentBorder = isDevSec ? 'border-rose-900/40 hover:border-rose-700/60' : 'border-amber-900/40 hover:border-amber-700/60';
          const iconColor = isDevSec ? 'text-rose-400' : 'text-amber-400';
          const headerBg = isDevSec ? 'bg-rose-950/20' : 'bg-amber-950/20';

          return (
            <div
              key={track.id}
              className={`rounded-xl border ${accentBorder} bg-slate-900/70 overflow-hidden transition-all flex flex-col`}
            >
              {/* Agent track header */}
              <div className={`p-4 border-b border-slate-800 ${headerBg}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${isDevSec ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40' : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'}`}>
                      {isDevSec ? <ShieldAlert className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-xs font-mono text-slate-400">{track.framework}</div>
                      <h3 className="text-sm font-semibold text-white">{track.agentName}</h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium ${
                      isDevSec ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}>
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{track.findingsCount} Issues Flagged</span>
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-300 leading-relaxed">
                  {track.summary}
                </div>
              </div>

              {/* Execution thought stream */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Sub-Agent Step Stream</span>
                    </span>
                    <span className="text-[11px] text-slate-500">Execution latency: 226ms</span>
                  </div>

                  <div className="space-y-2.5">
                    {track.steps.map((step, idx) => {
                      const isSelected = activeStepId === step.id;
                      return (
                        <div
                          key={step.id}
                          onClick={() => {
                            setActiveStepId(isSelected ? null : step.id);
                            if (onSelectFinding) onSelectFinding(step);
                          }}
                          className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-slate-800/90 border-indigo-500/60 shadow-sm'
                              : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700/80'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-xs mb-1">
                            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                              <span>Step 0{idx + 1}: {step.phase}</span>
                            </span>
                            <span className="font-mono text-[11px] text-slate-500">{step.timestamp}</span>
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed">
                            {step.thought}
                          </p>

                          <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                            <span className="text-rose-300 font-mono">
                              {step.detail}
                            </span>
                            {step.ruleRef && (
                              <span className="text-slate-400 font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                {step.ruleRef}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium text-slate-300">Agent Verdict:</span>
                  <span className={`font-mono text-xs ${isDevSec ? 'text-rose-400' : 'text-amber-400'}`}>
                    {track.verdict}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
