
import React, { useState, useMemo } from 'react';
import { Appointment } from '../types';
import { ICONS, CHURCHES } from '../constants';
import { generateFollowUpMessage } from '../services/geminiService';

interface DashboardProps {
  appointments: Appointment[];
  onNew: () => void;
  onEdit: (appointment: Appointment) => void;
  onComplete: (id: string) => void;
  onSelectUserActivity: (userName: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ appointments, onNew, onEdit, onComplete, onSelectUserActivity }) => {
  const [churchFilter, setChurchFilter] = useState<string>('all');
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  
  const pending = appointments.filter(a => a.status === 'pending');
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  
  const filteredPending = pending.filter(a => 
    churchFilter === 'all' || a.church === churchFilter
  );

  const statsByUser = useMemo(() => {
    const stats: Record<string, number> = {};
    appointments.forEach(apt => {
      const name = apt.userName || 'Sistema';
      stats[name] = (stats[name] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [appointments]);

  const handleAiMessage = async (apt: Appointment) => {
    setAiLoading(apt.id);
    const message = await generateFollowUpMessage(apt.name, apt.church, apt.time, apt.notes);
    setAiLoading(null);
    
    // Abrir WhatsApp con el mensaje generado
    const encodedMsg = encodeURIComponent(message || '');
    const whatsappUrl = `https://wa.me/${apt.phone.replace(/\D/g, '')}?text=${encodedMsg}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('¡Copiado!');
  };

  const handleQuickSync = () => {
    const code = JSON.stringify(appointments);
    navigator.clipboard.writeText(code);
    alert("CÓDIGO DE RED COPIADO.\n\nEnvía este código a tus compañeros por WhatsApp. Ellos deben ir a Ajustes > Importar y pegarlo para que todos vean los mismos contactos.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Panel de Atendimientos</h1>
          <p className="text-slate-500 font-medium">Gestiona leads de Facebook con Inteligencia Artificial</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <button
            onClick={handleQuickSync}
            className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-white border-2 border-slate-100 text-slate-600 px-6 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest text-xs"
          >
            <ICONS.Sync />
            Sincronizar Equipo
          </button>
          <button
            onClick={onNew}
            className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-[#2b44d3] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-widest text-xs"
          >
            <ICONS.UserPlus />
            Nuevo Registro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <ICONS.Dashboard />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">En Espera</p>
            <h3 className="text-3xl font-black text-slate-900">{pending.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <ICONS.Check />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Finalizados</p>
            <h3 className="text-3xl font-black text-slate-900">{completedCount}</h3>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl flex items-center gap-5 text-white">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
             <ICONS.Sparkles />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">IA Activa</p>
            <h3 className="text-2xl font-black">Gemini 3.0</h3>
          </div>
        </div>
      </div>

      {/* Actividad de Equipo */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Actividad por Colaborador</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Haz clic para ver sus conversaciones específicas</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {statsByUser.map(([userName, count]) => (
            <button 
              key={userName} 
              onClick={() => onSelectUserActivity(userName)}
              className="flex items-center gap-3 bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
            >
              <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center text-sm font-black shadow-sm group-hover:scale-110 transition-transform">
                {userName.charAt(0)}
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{userName}</p>
                <p className="text-sm font-black text-slate-900">{count} <span className="text-[9px] text-slate-400">Reg.</span></p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Personas Pendientes</h2>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Usa la IA para redactar mensajes de seguimiento</p>
          </div>
          
          <select 
            value={churchFilter}
            onChange={(e) => setChurchFilter(e.target.value)}
            className="w-full sm:w-64 text-xs font-black border-2 border-slate-100 rounded-xl p-3 focus:border-blue-500 outline-none bg-slate-50 uppercase tracking-wider transition-all"
          >
            <option value="all">TODAS LAS SEDES</option>
            {CHURCHES.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        
        <div className="divide-y divide-slate-50">
          {filteredPending.length === 0 ? (
            <div className="p-20 text-center">
              <div className="inline-block p-6 bg-slate-50 rounded-full mb-4 text-slate-300">
                <ICONS.Dashboard />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No hay pendientes en esta sede</p>
            </div>
          ) : (
            filteredPending.map(apt => (
              <div key={apt.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors group">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-2xl group-hover:bg-[#2b44d3] group-hover:text-white transition-all shrink-0">
                    {apt.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
                      {apt.name}
                    </h4>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-500">{apt.phone}</span>
                        <button onClick={() => copyToClipboard(apt.phone)} className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:underline">Copiar</button>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-widest">
                          {apt.church}
                        </span>
                        {apt.userName && (
                          <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-widest">
                            👤 Atendido por: {apt.userName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    disabled={aiLoading === apt.id}
                    onClick={() => handleAiMessage(apt)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
                  >
                    {aiLoading === apt.id ? 'Generando...' : <><ICONS.Sparkles /> Mensaje IA</>}
                  </button>
                  <button 
                    onClick={() => onComplete(apt.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#2b44d3] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
                  >
                    Finalizar
                  </button>
                  <button 
                    onClick={() => onEdit(apt)}
                    className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
