import React, { useState } from 'react';
import { Appointment } from '../types';
import { ICONS, CHURCHES } from '../constants';

interface DashboardProps {
  appointments: Appointment[];
  onNew: () => void;
  onEdit: (appointment: Appointment) => void;
  onComplete: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ appointments, onNew, onEdit, onComplete }) => {
  const [churchFilter, setChurchFilter] = useState<string>('all');
  
  const pending = appointments.filter(a => a.status === 'pending');
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  
  const filteredPending = pending.filter(a => 
    churchFilter === 'all' || a.church === churchFilter
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('¡Copiado al portapapeles!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Panel Principal</h1>
          <p className="text-slate-500 font-medium">Gestión de atendimientos desde Facebook</p>
        </div>
        <button
          onClick={onNew}
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#2b44d3] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-widest text-sm"
        >
          <ICONS.UserPlus />
          Registrar Nuevo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <ICONS.Dashboard />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Esperando</p>
            <h3 className="text-3xl font-black text-slate-900">{pending.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <ICONS.Check />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Finalizados</p>
            <h3 className="text-3xl font-black text-slate-900">{completedCount}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Atendimientos Pendientes</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lista de contactos hoy</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
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
        </div>
        
        <div className="divide-y divide-slate-50">
          {filteredPending.length === 0 ? (
            <div className="p-20 text-center">
              <div className="inline-block p-6 bg-slate-50 rounded-full mb-4 text-slate-300">
                <ICONS.Dashboard />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No hay personas pendientes</p>
            </div>
          ) : (
            filteredPending.map(apt => (
              <div key={apt.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors group">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-100 shrink-0">
                    {apt.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                      {apt.name}
                    </h4>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-500">{apt.phone}</span>
                        <button 
                          onClick={() => copyToClipboard(apt.phone)}
                          className="text-xs font-black text-blue-500 uppercase tracking-tighter hover:underline"
                        >
                          Copiar
                        </button>
                      </div>
                      <p className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                        {apt.church}
                        {apt.neighborhood && <span className="text-slate-400">({apt.neighborhood})</span>}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <a 
                    href={`https://wa.me/${apt.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-all active:scale-95"
                  >
                    WhatsApp
                  </a>
                  <button 
                    onClick={() => onComplete(apt.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-600 shadow-lg shadow-green-100 transition-all active:scale-95"
                  >
                    <ICONS.Check /> Finalizar
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