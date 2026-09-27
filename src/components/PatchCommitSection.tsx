import React, { useState } from 'react';
import { CORRECTED_CODE_SINGLE, GIT_DIFF_PATCH } from '../data/prReviewData';
import { Check, Copy, Download, GitCommit, FileCode, CheckCircle, Terminal } from 'lucide-react';

interface PatchCommitSectionProps {
  onApplied?: () => void;
  isApplied?: boolean;
}

const MODULAR_FILES = {
  config: `# app/core/config.py
import os
import logging

logger = logging.getLogger(__name__)

class AppConfig:
    """Manages application credentials loaded strictly from the environment."""
    API_SECRET_KEY: str = os.getenv("API_SECRET_KEY", "")
    DB_URI: str = os.getenv("DB_URI", "")

    @classmethod
    def validate(cls) -> None:
        if not cls.DB_URI:
            raise EnvironmentError("Critical: DB_URI environment variable is missing.")
`,
  repository: `# app/repositories/user_repository.py
import logging
from typing import Any, Dict
import pymongo
from pymongo.errors import PyMongoError

logger = logging.getLogger(__name__)

class UserRepository:
    """Repository Layer: Encapsulates all database operations, isolating MongoDB logic from controllers."""
    def __init__(self, db_client: pymongo.MongoClient, database_name: str = "user_database"):
        self.db = db_client[database_name]
        self.collection = self.db["users"]

    def create_user(self, username: str, email: str) -> Dict[str, Any]:
        """Inserts a new user record with error handling and returning created state."""
        try:
            user_doc = {"user": username, "email": email}
            result = self.collection.insert_one(user_doc)
            return {"id": str(result.inserted_id), "user": username, "email": email}
        except PyMongoError as exc:
            logger.error("Database operation failed in UserRepository.create_user: %s", exc)
            raise RuntimeError(f"Database insertion failed: {exc}") from exc
`,
  controller: `# app/controllers/user_controller.py
import logging
from typing import Any, Dict, Optional
import pymongo
from pymongo.errors import PyMongoError

from app.core.config import AppConfig
from app.repositories.user_repository import UserRepository

logger = logging.getLogger(__name__)

_db_client: Optional[pymongo.MongoClient] = None

def get_user_repository() -> UserRepository:
    global _db_client
    if _db_client is None:
        AppConfig.validate()
        _db_client = pymongo.MongoClient(AppConfig.DB_URI, serverSelectionTimeoutMS=5000)
    return UserRepository(_db_client)

def handle_user_request(request_data: Dict[str, Any], user_repo: Optional[UserRepository] = None) -> tuple[Dict[str, Any], int]:
    """Controller handling user registration with validation, repository pattern, and try-catch safety."""
    try:
        if not isinstance(request_data, dict):
            return {"status": "error", "message": "Invalid request payload format."}, 400

        username = request_data.get('username')
        email = request_data.get('email')

        if not username or not email:
            return {"status": "error", "message": "Missing required fields: 'username' and 'email'."}, 400

        # Delegate persistence to Repository Layer
        repo = user_repo or get_user_repository()
        created_user = repo.create_user(username=username, email=email)
        logger.info("User %s created successfully with id %s", username, created_user['id'])

        return {
            "status": "success",
            "message": "User inserted successfully!",
            "data": created_user
        }, 201

    except PyMongoError as db_err:
        logger.error("Database error occurred while handling user request: %s", db_err)
        return {"status": "error", "message": "Service unavailable due to storage failure."}, 503

    except Exception as exc:
        logger.exception("Unexpected error processing user request: %s", exc)
        return {"status": "error", "message": "Internal server error occurred."}, 500
`
};

export const PatchCommitSection: React.FC<PatchCommitSectionProps> = ({ onApplied, isApplied }) => {
  const [activeTab, setActiveTab] = useState<'single' | 'modular' | 'git'>('single');
  const [modularFile, setModularFile] = useState<'config' | 'repository' | 'controller'>('repository');
  const [copied, setCopied] = useState(false);

  const getActiveCode = () => {
    if (activeTab === 'single') return CORRECTED_CODE_SINGLE;
    if (activeTab === 'git') return GIT_DIFF_PATCH;
    return MODULAR_FILES[modularFile];
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getActiveCode();
    const filename = activeTab === 'git' ? 'patch.diff' : 'user_controller_patch.py';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header with Title and Strategy Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-emerald-400" />
            <span>Ready-to-Commit Code Patch</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Production-ready implementation resolving all 3 ARCHITECTURE.md violations and DevSecOps security issues.
          </p>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'single'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Single-File Patch
          </button>
          <button
            onClick={() => setActiveTab('modular')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'modular'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Modular Architecture
          </button>
          <button
            onClick={() => setActiveTab('git')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'git'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Unified Git Patch
          </button>
        </div>
      </div>

      {/* Sub-nav for modular files */}
      {activeTab === 'modular' && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-mono">Module:</span>
          <button
            onClick={() => setModularFile('repository')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              modularFile === 'repository'
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            user_repository.py (Rule 1)
          </button>
          <button
            onClick={() => setModularFile('config')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              modularFile === 'config'
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            config.py (Rule 2)
          </button>
          <button
            onClick={() => setModularFile('controller')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              modularFile === 'controller'
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            user_controller.py (Rule 3)
          </button>
        </div>
      )}

      {/* Code Container */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono text-slate-300">
              {activeTab === 'single'
                ? 'controllers/user_controller.py'
                : activeTab === 'git'
                ? 'git diff -u controllers/user_controller.py'
                : modularFile === 'repository'
                ? 'app/repositories/user_repository.py'
                : modularFile === 'config'
                ? 'app/core/config.py'
                : 'app/controllers/user_controller.py'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800/80 rounded border border-slate-700/80 flex items-center gap-1.5 transition-colors"
              title="Download patch file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 text-xs text-white bg-indigo-600 hover:bg-indigo-500 rounded flex items-center gap-1.5 transition-colors shadow-sm"
              title="Copy code to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Clean pre code block */}
        <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed bg-slate-950 text-slate-200 max-h-[580px]">
          <pre className="selection:bg-indigo-500/30 selection:text-white">
            <code>{getActiveCode()}</code>
          </pre>
        </div>

        {/* Patch verification checklist footer */}
        <div className="px-4 py-3 bg-slate-900/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Rule 1: Repository Pattern Implemented</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Rule 2: Environment Variables (os.getenv)</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Rule 3: Try-Catch Error Boundary Enforced</span>
            </span>
          </div>

          {onApplied && (
            <button
              onClick={onApplied}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                isApplied
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {isApplied ? '✓ Patch Staged to Branch' : 'Simulate Commit Patch'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
