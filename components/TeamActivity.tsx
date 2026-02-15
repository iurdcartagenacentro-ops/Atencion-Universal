import React, { useMemo } from 'react';
import { Appointment } from '../types';
import { ICONS } from '../constants';

interface TeamActivityProps {
  appointments: Appointment[];
  selectedUser: string | null;
  onBack: () => void;
  onEdit: (apt: Appointment) => void;
}

export const TeamActivity: React.FC<TeamActivityProps> = ({ appointments, selectedUser, onBack, onEdit }) => {
  const grouped = useMemo(() => {
    const groups: Record<string, Appointment[]> = {};
    appointments.forEach(apt => {
      const u = apt.userName || 'Sistema';
      if (!groups[u]) groups[u] = [];
      groups[u].push(apt);
    });
    return groups;
  }, [appointments]);

  const users = Object.keys(grouped).sort();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:gap-3 transition-all mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Volver
          </button>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Actividad de Red</h1>
          <p className="text-slate-500 font-medium">Conversaciones separadas por colaborador</p>
        </div>
      </div>

      <div className="space-y-16">
        {users.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-[3rem] border border-dashed border-slate-200">
             <p className="text-slate-400 font-bold uppercase tracking-widest">Sin actividad registrada en la red</p>
          </div>
        ) : (
          users
            .filter(u => !selectedUser || u === selectedUser)
            .map(u => (
            <div key={u} className="space-y-8">
              <div className="flex items-center gap-5 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 w-fit pr-10">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-100">
                  {u.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{u}</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-widest border border-blue-100">
                      {grouped[u].length} Atendimientos
                    </span>
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Colaborador Activo</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {grouped[u].sort((a,b) => b.createdAt - a.createdAt).map(apt => (
                  <div key={apt.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all group flex flex-col sm:flex-row justify-between gap-8">
                    <div className="flex gap-6">
                      <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-[1.5rem] flex items-center justify-center font-black text-xl shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {apt.name.charAt(0)}
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{apt.name}</h4>
                        <p className="text-sm font-bold text-slate-500">{apt.phone}</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="text-[10px] font-black uppercase bg-slate-50 text-slate-400 px-3 py-1 rounded-lg border border-slate-100">
                            {apt.church}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg border ${apt.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                            {apt.status === 'completed' ? 'Finalizado' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-end gap-3 shrink-0">
                      <button onClick={() => onEdit(apt)} className="flex-1 sm:flex-none p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                      </button>
                      <a href={`https://wa.me/${apt.phone.replace(/\D/g, '')}`} target="_blank" className="flex-1 sm:flex-none p-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};