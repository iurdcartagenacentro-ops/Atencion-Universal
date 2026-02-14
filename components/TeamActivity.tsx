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
  // Agrupar atendimientos por usuario
  const groupedAppointments = useMemo(() => {
    const groups: Record<string, Appointment[]> = {};
    appointments.forEach(apt => {
      const user = apt.userName || 'Sistema';
      if (!groups[user]) groups[user] = [];
      groups[user].push(apt);
    });
    return groups;
  }, [appointments]);

  const usersList = Object.keys(groupedAppointments).sort();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:gap-3 transition-all mb-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Volver al Panel
          </button>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Actividad de Equipo</h1>
          <p className="text-slate-500 font-medium">Historial completo agrupado por colaborador</p>
        </div>
      </div>

      <div className="space-y-12">
        {usersList.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-[2.5rem] border border-dashed border-slate-200">
             <p className="text-slate-400 font-bold uppercase tracking-widest">Aún no hay registros de actividad</p>
          </div>
        ) : (
          usersList
            .filter(user => !selectedUser || user === selectedUser)
            .map(user => (
            <section key={user} className="space-y-6">
              <div className="flex items-center gap-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                  {user.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{user}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {groupedAppointments[user].length} {groupedAppointments[user].length === 1 ? 'Registro' : 'Registros'} en total
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {groupedAppointments[user].sort((a,b) => b.createdAt - a.createdAt).map(apt => (
                  <div key={apt.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all flex flex-col sm:flex-row justify-between gap-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center font-black shrink-0">
                        {apt.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black text-slate-900 uppercase tracking-tight leading-none">{apt.name}</h4>
                        <p className="text-xs font-bold text-slate-500">{apt.phone}</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">
                            {apt.church}
                          </span>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                            apt.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {apt.status === 'completed' ? 'Finalizado' : 'Pendiente'}
                          </span>
                        </div>
                        <div className="pt-2 text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                           <span>📅 {apt.date}</span>
                           <span>⏰ {apt.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-end gap-2">
                      <button 
                        onClick={() => onEdit(apt)}
                        className="flex-1 sm:flex-none p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"
                        title="Editar Registro"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                      </button>
                      <a 
                        href={`https://wa.me/${apt.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-none p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all flex items-center justify-center"
                        title="Contactar WhatsApp"
                      >
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
};