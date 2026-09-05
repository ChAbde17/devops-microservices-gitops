import React from 'react';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  Server,
  Database,
  Cpu,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import Badge from '../ui/Badge.jsx';

export default function ServiceMeshTable({ services = [] }) {
  const defaultServices = [
    {
      name: 'backend-api',
      type: 'FastAPI Python 3.11',
      namespace: 'devops-dev',
      image: 'ghcr.io/chabde17/backend:sha-45b6192',
      replicas: '3/3',
      cpu: '48m',
      memory: '64Mi',
      status: 'Healthy',
      port: ':8000',
      icon: Server,
    },
    {
      name: 'frontend-ui',
      type: 'React 18 + Vite Nginx',
      namespace: 'devops-dev',
      image: 'ghcr.io/chabde17/frontend:sha-45b6192',
      replicas: '2/2',
      cpu: '12m',
      memory: '22Mi',
      status: 'Healthy',
      port: ':8080',
      icon: Layers,
    },
    {
      name: 'postgres-db',
      type: 'PostgreSQL 16 Alpine',
      namespace: 'devops-dev',
      image: 'postgres:16-alpine',
      replicas: '1/1',
      cpu: '32m',
      memory: '148Mi',
      status: 'Healthy',
      port: ':5432',
      icon: Database,
    },
    {
      name: 'redis-cache',
      type: 'Redis 7.2 Alpine',
      namespace: 'devops-dev',
      image: 'redis:7-alpine',
      replicas: '1/1',
      cpu: '8m',
      memory: '18Mi',
      status: 'Healthy',
      port: ':6379',
      icon: Cpu,
    },
  ];

  const serviceList = services.length > 0 ? services : defaultServices;

  return (
    <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-card-dark backdrop-blur-sm overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Service Mesh & Workload Inventory</h3>
            <p className="text-xs text-slate-400">
              Live Kubernetes Pods and Deployments running in target namespace
            </p>
          </div>
        </div>
        <Badge variant="sky">4 Services Monitored</Badge>
      </div>

      {/* Table Content */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="pb-3 px-3">Service</th>
              <th className="pb-3 px-3">Container Image</th>
              <th className="pb-3 px-3">Namespace</th>
              <th className="pb-3 px-3">Replicas</th>
              <th className="pb-3 px-3">Resource Saturation</th>
              <th className="pb-3 px-3">Status</th>
              <th className="pb-3 px-3 text-right">Internal Port</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {serviceList.map((svc) => {
              const Icon = svc.icon || Server;
              return (
                <tr
                  key={svc.name}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3 px-3 font-sans">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700 text-indigo-400">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-xs">{svc.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{svc.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 truncate max-w-[180px]" title={svc.image}>
                    {svc.image}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[11px]">
                      {svc.namespace}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-semibold">{svc.replicas}</td>
                  <td className="py-3 px-3 text-slate-300">
                    <span className="text-indigo-400">{svc.cpu}</span> /{' '}
                    <span className="text-slate-400">{svc.memory}</span>
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant={svc.status === 'Healthy' ? 'emerald' : 'amber'} dot>
                      {svc.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right text-indigo-400 font-bold">{svc.port}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
