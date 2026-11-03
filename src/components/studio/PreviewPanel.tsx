import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { StudentProductivityApp } from '../preview-apps/StudentProductivityApp';
import { SaaSAnalyticsApp } from '../preview-apps/SaaSAnalyticsApp';
import { ECommerceApp } from '../preview-apps/ECommerceApp';
import { DynamicGenericApp } from '../preview-apps/DynamicGenericApp';
import { 
  Monitor, Tablet, Smartphone, RotateCw, ExternalLink, 
  Maximize2, Eye, ShieldCheck, CheckCircle2, Sparkles, X, Sliders
} from 'lucide-react';

export function PreviewPanel() {
  const {
    activeProject,
    visualInspectActive,
    setVisualInspectActive,
    selectedVisualElement,
    setSelectedVisualElement,
    applyVisualStyles,
    sendMessageToAgent,
  } = useProject();

  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [routeUrl, setRouteUrl] = useState('/');
  const [refreshKey, setRefreshKey] = useState(0);

  // Quick edit visual inspector state
  const [visualBg, setVisualBg] = useState('#0f172a');
  const [visualPadding, setVisualPadding] = useState('16px');

  if (!activeProject) return null;

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleInspectClick = (e: React.MouseEvent) => {
    if (!visualInspectActive) return;
    e.stopPropagation();

    const target = e.target as HTMLElement;
    const componentName = target.getAttribute('data-component') || target.tagName.toLowerCase();
    const fileSource = target.getAttribute('data-file') || 'src/App.tsx';

    setSelectedVisualElement({
      id: `el-${Date.now()}`,
      tag: target.tagName.toLowerCase(),
      name: componentName,
      text: target.innerText?.slice(0, 40) || 'Interactive Node',
      styles: {
        padding: window.getComputedStyle(target).padding,
        margin: window.getComputedStyle(target).margin,
        backgroundColor: window.getComputedStyle(target).backgroundColor,
        color: window.getComputedStyle(target).color,
        fontSize: window.getComputedStyle(target).fontSize,
        borderRadius: window.getComputedStyle(target).borderRadius,
      },
      fileSource,
    });
  };

  const getViewportWidthClass = () => {
    if (viewport === 'mobile') return 'max-w-[375px] h-[667px] my-auto shadow-2xl rounded-2xl border-4 border-slate-700';
    if (viewport === 'tablet') return 'max-w-[768px] h-full shadow-xl rounded-xl border border-slate-800';
    return 'w-full h-full';
  };

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col overflow-hidden relative">
      {/* Top Viewport Toolbar */}
      <div className="h-10 border-b border-slate-800 bg-slate-900/80 px-3 flex items-center justify-between gap-3 shrink-0 text-xs">
        {/* Device Viewport Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1 rounded transition-colors ${viewport === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Desktop Viewport (1440px)"
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1 rounded transition-colors ${viewport === 'tablet' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Tablet Viewport (768px)"
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1 rounded transition-colors ${viewport === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Mobile Viewport (375px)"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-sm flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 font-mono text-[11px]">
          <span className="text-slate-500">https://</span>
          <span className="text-slate-300 truncate">preview.buildmint.app</span>
          <span className="text-emerald-400 font-semibold">{routeUrl}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Visual Edit Toggle */}
          <button
            onClick={() => {
              setVisualInspectActive(!visualInspectActive);
              if (visualInspectActive) setSelectedVisualElement(null);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              visualInspectActive
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
            title="Click to visually select elements and style them"
          >
            <Eye className="h-3 w-3" />
            <span className="hidden sm:inline">Visual Edit</span>
          </button>

          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reload Preview"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Live Application Canvas Container */}
      <div 
        className="flex-1 overflow-auto bg-slate-950 p-2 flex items-center justify-center relative"
        onClick={handleInspectClick}
      >
        <div key={refreshKey} className={`transition-all duration-200 overflow-hidden ${getViewportWidthClass()}`}>
          {activeProject.appTemplateType === 'student_productivity' ? (
            <StudentProductivityApp />
          ) : activeProject.appTemplateType === 'saas_analytics' ? (
            <SaaSAnalyticsApp />
          ) : activeProject.appTemplateType === 'ecommerce' ? (
            <ECommerceApp />
          ) : (
            <DynamicGenericApp prompt={activeProject.prompt} title={activeProject.name} />
          )}
        </div>

        {/* Visual Inspection Property Inspector Drawer */}
        {selectedVisualElement && (
          <div className="absolute right-4 bottom-4 w-72 bg-slate-900/95 backdrop-blur-md border border-purple-500/50 rounded-xl p-3.5 shadow-2xl z-40 text-xs space-y-3 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-purple-400" />
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">Visual Inspector</span>
              </div>
              <button onClick={() => setSelectedVisualElement(null)} className="text-slate-400 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-1 font-mono text-[10px] text-slate-400">
              <div>Target: <span className="text-purple-300 font-semibold">{selectedVisualElement.tag}</span></div>
              <div>Source: <span className="text-slate-300 truncate">{selectedVisualElement.fileSource}</span></div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-300 font-semibold block">Ask AI to restyle this component:</label>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    sendMessageToAgent(`Restyle the ${selectedVisualElement.tag} component with a modern card shadow and 16px padding`);
                    setSelectedVisualElement(null);
                  }}
                  className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-[11px] font-medium transition-colors"
                >
                  Apply AI Style
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
