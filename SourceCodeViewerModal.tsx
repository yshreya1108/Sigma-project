import React, { useEffect, useState, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  FileCode,
  Search,
  Layers,
  Cpu,
  FolderGit2,
  Sparkles,
} from 'lucide-react';

export interface SourceModuleEntry {
  path: string;
  category: 'CPP_CORE' | 'TS_ENGINE' | 'REACT_COMPONENT' | 'CONFIG';
  language: string;
  lines: number;
  bytes: number;
  content: string;
}

interface SourceCodeViewerModalProps {
  onClose: () => void;
}

export const SourceCodeViewerModal: React.FC<SourceCodeViewerModalProps> = ({ onClose }) => {
  const [modules, setModules] = useState<SourceModuleEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<
    'ALL' | 'CPP_CORE' | 'TS_ENGINE' | 'REACT_COMPONENT' | 'CONFIG'
  >('ALL');
  const [copiedSingle, setCopiedSingle] = useState<boolean>(false);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  useEffect(() => {
    fetch('/SkillMatch-All-Modules.json')
      .then((res) => res.json())
      .then((data: SourceModuleEntry[]) => {
        setModules(data);
        if (data.length > 0) {
          setSelectedPath(data[0].path);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      if (categoryFilter !== 'ALL' && m.category !== categoryFilter) return false;
      if (
        searchQuery.trim() &&
        !m.path.toLowerCase().includes(searchQuery.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [modules, categoryFilter, searchQuery]);

  const activeModule = useMemo(() => {
    return (
      modules.find((m) => m.path === selectedPath) ||
      filteredModules[0] ||
      null
    );
  }, [modules, selectedPath, filteredModules]);

  const handleCopyCurrent = async () => {
    if (!activeModule) return;
    try {
      await navigator.clipboard.writeText(activeModule.content);
      setCopiedSingle(true);
      setTimeout(() => setCopiedSingle(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyAllModules = async () => {
    if (modules.length === 0) return;
    const combined = modules
      .map(
        (m) =>
          `// ============================================================================\n// FILE: ${m.path} (${m.lines} lines)\n// ============================================================================\n\n${m.content}`
      )
      .join('\n\n\n');
    try {
      await navigator.clipboard.writeText(combined);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } catch {
      // Fallback
    }
  };

  const totalLines = useMemo(
    () => modules.reduce((acc, m) => acc + m.lines, 0),
    [modules]
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 text-white border border-slate-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-4 sm:px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Complete Website Source Code & All Modules Explorer
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {modules.length} Files • {totalLines.toLocaleString()} Lines
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Browse, copy, or download every single C++ module, TypeScript engine, React component, and config file.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyAllModules}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied All {modules.length} Files!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Entire Website Code</span>
                </>
              )}
            </button>

            <a
              href="/SkillMatch-Complete-All-Modules-Code.txt"
              download="SkillMatch-Complete-All-Modules-Code.txt"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>All Code in 1 File (.txt)</span>
            </a>

            <a
              href="/SkillMatch-Full-Source-Code.zip"
              download="SkillMatch-Full-Source-Code.zip"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Full Project (.zip)</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close source code viewer"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter & Search Strip */}
        <div className="bg-slate-900/90 px-4 sm:px-6 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'ALL', label: `All Files (${modules.length})` },
                {
                  id: 'CPP_CORE',
                  label: `C++ Core Modules (${modules.filter((m) => m.category === 'CPP_CORE').length})`,
                },
                {
                  id: 'TS_ENGINE',
                  label: `TypeScript Engines & Data (${modules.filter((m) => m.category === 'TS_ENGINE').length})`,
                },
                {
                  id: 'REACT_COMPONENT',
                  label: `React Components & Views (${modules.filter((m) => m.category === 'REACT_COMPONENT').length})`,
                },
                {
                  id: 'CONFIG',
                  label: `Config & Entry (${modules.filter((m) => m.category === 'CONFIG').length})`,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  categoryFilter === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter module or file name..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Main Body: Sidebar + Code Viewer */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Loading all website modules and source files...
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left File List */}
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/60 overflow-y-auto p-2 space-y-1 max-h-48 md:max-h-none">
              {filteredModules.map((mod) => {
                const isSelected = activeModule?.path === mod.path;
                return (
                  <button
                    key={mod.path}
                    type="button"
                    onClick={() => setSelectedPath(mod.path)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {mod.category === 'CPP_CORE' ? (
                        <Cpu className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      ) : mod.category === 'TS_ENGINE' ? (
                        <Layers className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      ) : (
                        <FileCode className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                      )}
                      <span className="truncate font-mono">{mod.path}</span>
                    </div>
                    <span
                      className={`text-[10px] shrink-0 px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-indigo-700 text-indigo-100'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {mod.lines}L
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Code Panel */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
              {activeModule ? (
                <>
                  <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-300">
                        {activeModule.path}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">
                        {activeModule.lines} lines ({(activeModule.bytes / 1024).toFixed(1)} KB)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyCurrent}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
                    >
                      {copiedSingle ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied {activeModule.path}!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy This Module Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="flex-1 p-4 sm:p-6 overflow-auto text-xs font-mono text-emerald-300 leading-relaxed selection:bg-indigo-500 selection:text-white">
                    <code>{activeModule.content}</code>
                  </pre>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                  No matching module found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
