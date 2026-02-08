
import React, { useState, useRef } from 'react';
import { VerificationStatus, FactCheckResponse, VerificationStep } from './types';
import { verifyNews } from './services/geminiService';
import ReportRenderer from './components/ReportRenderer';

const STEPS: VerificationStep[] = [
  { id: 'ocr', label: 'Analyzing Content Structure', active: false, completed: false },
  { id: 'claims', label: 'Extracting Claims', active: false, completed: false },
  { id: 'search', label: 'Consulting Global Repositories', active: false, completed: false },
  { id: 'cross', label: 'Cross-Referencing Evidence', active: false, completed: false },
  { id: 'synth', label: 'Synthesizing Verdict', active: false, completed: false },
];

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<VerificationStatus>(VerificationStatus.IDLE);
  const [result, setResult] = useState<FactCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSteps, setActiveSteps] = useState(STEPS);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateSteps = (currentId: string) => {
    setActiveSteps(prev => prev.map(step => ({
      ...step,
      active: step.id === currentId,
      completed: prev.findIndex(s => s.id === step.id) < prev.findIndex(s => s.id === currentId)
    })));
  };

  const handleVerify = async () => {
    if (!input.trim() && !imagePreview) return;

    setStatus(VerificationStatus.LOADING);
    setError(null);
    setResult(null);
    
    // UI progression simulation
    const stepDuration = 800;
    updateSteps('ocr');
    
    try {
      setTimeout(() => updateSteps('claims'), stepDuration);
      setTimeout(() => updateSteps('search'), stepDuration * 2);
      setTimeout(() => updateSteps('cross'), stepDuration * 3);
      setTimeout(() => updateSteps('synth'), stepDuration * 4);

      const data = await verifyNews(input, imagePreview || undefined);
      
      setResult(data);
      setStatus(VerificationStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message);
      setStatus(VerificationStatus.ERROR);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClear = () => {
    setInput('');
    setImagePreview(null);
    setStatus(VerificationStatus.IDLE);
    setResult(null);
    setError(null);
    setActiveSteps(STEPS);
  };

  const getFavicon = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-900 selection:bg-indigo-100 flex flex-col">
      <nav className="h-20 border-b border-slate-200 bg-white/70 backdrop-blur-xl sticky top-0 z-40 flex items-center px-8">
        <div className="max-w-[1400px] w-full mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center rotate-3 shadow-lg shadow-slate-200">
              <i className="fas fa-shield-check text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">Veritas <span className="text-indigo-600">Pro</span></h1>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Forensic Intelligence Unit</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Status: Optimal</span>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] w-full mx-auto p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-8">
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 leading-tight">Combat disinformation with evidence.</h2>
              <p className="text-slate-500 text-sm leading-relaxed">Veritas Pro uses Gemini 3 Pro reasoning and live Google Search grounding to dissect and verify complex news claims.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 p-6 space-y-6 relative overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
              {imagePreview && (
                <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-100 bg-slate-50">
                  <img src={imagePreview} alt="Analysis Target" className="w-full h-full object-contain" />
                  <button 
                    onClick={removeImage}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste news text or viral headline..."
                className="w-full min-h-[140px] text-lg font-medium text-slate-700 bg-transparent resize-none focus:outline-none placeholder:text-slate-300"
              />

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100 flex items-center justify-center"
                    title="Upload Screenshot"
                  >
                    <i className="fas fa-camera"></i>
                  </button>
                  <button onClick={handleClear} className="px-4 h-12 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all border border-slate-100 text-xs font-bold uppercase tracking-widest">
                    Clear
                  </button>
                </div>

                <button
                  onClick={handleVerify}
                  disabled={(!input.trim() && !imagePreview) || status === VerificationStatus.LOADING}
                  className={`
                    flex-1 h-12 flex items-center justify-center gap-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg
                    ${status === VerificationStatus.LOADING 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                    }
                  `}
                >
                  {status === VerificationStatus.LOADING ? (
                    <i className="fas fa-cog fa-spin text-lg"></i>
                  ) : (
                    <>
                      <i className="fas fa-bolt"></i>
                      Analyze Facts
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {status === VerificationStatus.LOADING && (
            <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-4 shadow-2xl animate-in zoom-in-95 duration-300">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-2">Engine Pipeline</h3>
              <div className="space-y-4">
                {activeSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-500
                      ${step.completed ? 'bg-indigo-500 border-indigo-500' : step.active ? 'border-indigo-400 animate-pulse' : 'border-slate-700'}
                    `}>
                      {step.completed && <i className="fas fa-check text-[8px] text-white"></i>}
                    </div>
                    <span className={`text-xs font-bold tracking-wide transition-colors duration-500 ${step.active ? 'text-white' : 'text-slate-500'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-8">
          {status === VerificationStatus.IDLE && (
            <div className="h-full border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 bg-slate-50/50">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-6 text-slate-200">
                <i className="fas fa-microscope text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-400">Analysis Engine Idle</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-xs">Reports are generated using real-time search grounding and multi-source verification.</p>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-100 p-8 rounded-[2rem] flex gap-6 items-start animate-in fade-in">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-exclamation-circle text-rose-600 text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-black text-rose-900 uppercase tracking-widest mb-2">Pipeline Fault</h3>
                <p className="text-rose-700 text-sm leading-relaxed">{error}</p>
                <button onClick={handleVerify} className="mt-6 px-6 py-2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-700 transition-all">Retry Analysis</button>
              </div>
            </div>
          )}

          {status === VerificationStatus.SUCCESS && result && (
            <div className="animate-in fade-in duration-700 space-y-12 pb-20">
              <ReportRenderer text={result.reportText} />

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <i className="fas fa-book-open text-indigo-500"></i>
                  Grounding Sources ({result.sources.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.sources.map((source, sIdx) => source.web && (
                    <a 
                      key={sIdx} 
                      href={source.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 hover:shadow-xl transition-all flex items-start gap-4"
                    >
                      <img 
                        src={getFavicon(source.web.uri) || ''} 
                        className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 p-1"
                        alt="favicon"
                        onError={(e) => (e.currentTarget.src = "https://www.google.com/s2/favicons?sz=64&domain=google.com")}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 block truncate">
                          {new URL(source.web.uri).hostname}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-indigo-600">
                          {source.web.title}
                        </h4>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="h-20 border-t border-slate-100 flex items-center px-8 bg-white mt-auto">
        <div className="max-w-[1400px] w-full mx-auto flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex gap-8">
            <span>© 2025 Veritas Forensic Unit</span>
            <span className="flex items-center gap-2">
              <i className="fas fa-lock text-indigo-500"></i> Secure Analysis
            </span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-600 transition-colors">Safety Guidelines</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">API Console</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
