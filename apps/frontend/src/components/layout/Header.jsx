import React from 'react';
import {
  Menu,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  GitFork,
  Radio,
} from 'lucide-react';
import Badge from '../ui/Badge.jsx';

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  environment,
  setEnvironment,
  isRefreshing,
  onRefresh,
  lastScrapeTime,
  backendConnected,
}) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 flex items-center justify-between">
      {/* Left side: Mobile Toggle & Environment Switcher */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Environment Pill Selector */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setEnvironment('development')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              environment === 'development'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            devops-dev
          </button>
          <button
            onClick={() => setEnvironment('production')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              environment === 'production'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            devops-prod
          </button>
        </div>

        {/* Backend Connection Indicator */}
        <div className="hidden sm:flex items-center gap-2">
          {backendConnected ? (
            <Badge variant="emerald" dot pulse>
              FastAPI: Online (200)
            </Badge>
          ) : (
            <Badge variant="amber" dot>
              Mock Telemetry (Standby)
            </Badge>
          )}
        </div>
      </div>

      {/* Right side: Scrape Status, Refresh & External Link */}
      <div className="flex items-center gap-3">
        {/* Scrape Rate Ticker */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/80">
          <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Prometheus Scrape: 5s</span>
          {lastScrapeTime && <span className="text-slate-400">({lastScrapeTime})</span>}
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors disabled:opacity-50"
          title="Poll live telemetry endpoints"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
        </button>

        {/* GitHub Repo Button */}
        <a
          href="https://github.com/ChAbde17/devops-microservices-gitops"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700/80 hover:text-white transition-all shadow-sm"
        >
          <GitFork className="w-3.5 h-3.5 text-indigo-400" />
          <span>GitHub</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>
    </header>
  );
}
