
import React from 'react';
import VerdictBadge from './VerdictBadge';

interface ReportRendererProps {
  text: string;
}

const ReportRenderer: React.FC<ReportRendererProps> = ({ text }) => {
  const sections = text.split('\n\n');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {sections.map((section, idx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        // Main Title
        if (trimmed.startsWith('# ')) {
          return (
            <div key={idx} className="pb-4 border-b border-slate-200">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {trimmed.replace('# ', '')}
              </h1>
            </div>
          );
        }

        // Section Headers
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-xl font-bold text-slate-800 flex items-center gap-3 pt-4">
              <span className="h-6 w-1 bg-indigo-600 rounded-full"></span>
              {trimmed.replace('## ', '')}
            </h2>
          );
        }

        // Claim Cards
        if (trimmed.startsWith('### ')) {
          const lines = trimmed.split('\n');
          const title = lines[0].replace('### ', '');
          const content = lines.slice(1);
          
          let confidence = "0";
          const confidenceLine = content.find(l => l.toLowerCase().includes('**confidence**'));
          if (confidenceLine) {
            confidence = confidenceLine.split(':')[1]?.replace('%', '').trim() || "0";
          }

          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{title}</h3>
                  <div className="flex flex-col items-end gap-2">
                    {content.map((line, lIdx) => {
                      if (line.toLowerCase().includes('**verdict**')) {
                        return <VerdictBadge key={lIdx} verdict={line.split(':')[1]?.trim() || 'UNKNOWN'} />;
                      }
                      return null;
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  {content.map((line, lIdx) => {
                    if (line.toLowerCase().includes('**confidence**')) {
                      return (
                        <div key={lIdx} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>Confidence Score</span>
                            <span>{confidence}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 transition-all duration-1000" 
                              style={{ width: `${confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    }
                    if (line.toLowerCase().includes('**explanation**')) {
                      return (
                        <div key={lIdx} className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="block font-bold text-slate-400 text-[10px] uppercase mb-1">Evidence Breakdown</span>
                          {line.split(':')[1]?.trim()}
                        </div>
                      );
                    }
                    if (line.toLowerCase().includes('**sources**')) {
                      return (
                        <div key={lIdx} className="text-xs text-slate-500 italic flex items-center gap-2">
                          <i className="fas fa-quote-left text-indigo-300 text-[10px]"></i>
                          {line.split(':')[1]?.trim()}
                        </div>
                      );
                    }
                    if (line.toLowerCase().includes('**verdict**')) return null;
                    return <p key={lIdx} className="text-sm text-slate-600">{line}</p>;
                  })}
                </div>
              </div>
            </div>
          );
        }

        // Standard Text
        return (
          <div key={idx} className="text-slate-600 text-sm leading-relaxed space-y-2">
            {trimmed.split('\n').map((line, lIdx) => (
              <p key={lIdx}>{line}</p>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ReportRenderer;
