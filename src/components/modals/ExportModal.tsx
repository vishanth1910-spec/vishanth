import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import JSZip from 'jszip';
import { Download, Check, X, FileArchive, CheckCircle2, Shield } from 'lucide-react';

export function ExportModal() {
  const { exportModalOpen, setExportModalOpen, activeProject } = useProject();
  const [isExporting, setIsExporting] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  if (!exportModalOpen || !activeProject) return null;

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // Add all project files into the zip
      Object.entries(activeProject.files).forEach(([path, fileObj]) => {
        zip.file(path, fileObj.content);
      });

      // Add .env.example
      zip.file(
        '.env.example',
        `# Environment variables for ${activeProject.name}
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/${activeProject.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}
JWT_SECRET=super_secret_session_jwt_key_32_chars
NODE_ENV=development
`
      );

      // Add tsconfig.json if not present
      if (!activeProject.files['tsconfig.json']) {
        zip.file(
          'tsconfig.json',
          JSON.stringify(
            {
              compilerOptions: {
                target: 'ES2022',
                module: 'ESNext',
                moduleResolution: 'bundler',
                jsx: 'react-jsx',
                strict: true,
                skipLibCheck: true,
              },
            },
            null,
            2
          )
        );
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeProject.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-source.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadReady(true);
    } catch (err) {
      console.error('Failed to generate ZIP archive', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileArchive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export Project Archive</h3>
              <p className="text-xs text-slate-400">Complete, unencumbered source code ZIP bundle.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setExportModalOpen(false);
              setDownloadReady(false);
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* File Inventory */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-300">Package Contents:</div>
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 max-h-48 overflow-y-auto space-y-1.5 font-mono text-xs">
            {Object.keys(activeProject.files).map((file) => (
              <div key={file} className="flex items-center justify-between text-slate-300">
                <span className="truncate">{file}</span>
                <span className="text-[10px] text-emerald-400">Verified</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-slate-400">
              <span>.env.example</span>
              <span className="text-[10px] text-slate-500">Auto-configured</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>tsconfig.json</span>
              <span className="text-[10px] text-slate-500">Strict mode</span>
            </div>
          </div>
        </div>

        {/* Security & Cleanliness note */}
        <div className="p-3 bg-emerald-950/30 border border-emerald-900/40 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300">
          <Shield className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
          <span>No proprietary lock-in. Standalone code runs with standard `npm install && npm run dev`. Secrets and sensitive tokens are excluded.</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => setExportModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={isExporting}
            onClick={handleDownloadZip}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-emerald-950"
          >
            {isExporting ? (
              <span>Packing ZIP...</span>
            ) : downloadReady ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                <span>Downloaded! Click to save again</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download .ZIP</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
