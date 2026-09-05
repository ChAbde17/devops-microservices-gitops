import React from 'react';
import {
  GitBranch,
  GitCommit,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';

export default function GitOpsDrawer({
  commitSha = '45b6192',
  syncStatus = 'Synced',
  lastSync = '2 mins ago',
}) {
  const syncWaves = [
    { wave: 'Wave 0', name: 'Namespaces & ConfigMaps', status: 'COMPLETED' },
    { wave: 'Wave 1', name: 'PostgreSQL & Redis DB StatefulSets', status: 'COMPLETED' },
    { wave: 'Wave 2', name: 'FastAPI Backend Deployment & Service', status: 'COMPLETED' },
    { wave: 'Wave 3', name: 'Vite Frontend & NGINX Ingress Controller', status: 'COMPLETED' },
    { wave: 'Wave 4', name: 'Prometheus ServiceMonitors & AlertRules', status: 'COMPLETED' },
  ];

  return (
    <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-card-dark backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">ArgoCD Declarative GitOps Controller</h3>
            <p className="text-xs text-slate-400">
              Continuous deployment reconciler syncing Git desired state to KinD cluster
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" dot pulse>
            {syncStatus}
          </Badge>
          <Badge variant="brand">Self-Healing: ON</Badge>
        </div>
      </div>

      {/* Repo & Commit metadata cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Target Repository
          </span>
          <div className="mt-1 font-mono text-xs text-white truncate flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">ChAbde17/devops-microservices-gitops</span>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Revision SHA (Head)
          </span>
          <div className="mt-1 font-mono text-xs text-white flex items-center gap-1.5">
            <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-bold">{commitSha}</span>
            <span className="text-slate-400">(main)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Reconcile Drift Policy
          </span>
          <div className="mt-1 font-mono text-xs text-indigo-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Prune + Automated Heal</span>
          </div>
        </div>
      </div>

      {/* Sync Waves Timeline */}
      <div className="mt-6">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Helm Deployment Sync Waves
        </h4>
        <div className="space-y-2.5">
          {syncWaves.map((wave, idx) => (
            <div
              key={wave.wave}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <span className="text-indigo-400 font-bold shrink-0">{wave.wave}</span>
                <span className="text-slate-300 font-sans font-medium">{wave.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold text-[11px]">Synced</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
