
import React from 'react';

interface VerdictBadgeProps {
  verdict: string;
}

const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict }) => {
  const normalized = verdict.toUpperCase().trim();
  
  let styles = "bg-slate-100 text-slate-700 border-slate-200";
  let icon = "fa-circle-question";

  if (normalized.includes("TRUE")) {
    styles = "bg-emerald-500 text-white border-emerald-600 shadow-sm";
    icon = "fa-check-circle";
  } else if (normalized.includes("FALSE")) {
    styles = "bg-rose-500 text-white border-rose-600 shadow-sm";
    icon = "fa-circle-xmark";
  } else if (normalized.includes("MISLEADING")) {
    styles = "bg-amber-500 text-white border-amber-600 shadow-sm";
    icon = "fa-triangle-exclamation";
  } else if (normalized.includes("UNVERIFIABLE")) {
    styles = "bg-indigo-500 text-white border-indigo-600 shadow-sm";
    icon = "fa-magnifying-glass";
  }

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${styles}`}>
      <i className={`fas ${icon}`}></i>
      {normalized}
    </span>
  );
};

export default VerdictBadge;
