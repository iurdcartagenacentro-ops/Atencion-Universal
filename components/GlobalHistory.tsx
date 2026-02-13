import React, { useState } from 'react';
import { Appointment } from '../types';
import { CHURCHES, ICONS } from '../constants';

interface GlobalHistoryProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
}

export const GlobalHistory: React.FC<GlobalHistoryProps> = ({ appointments, onEdit }) => {
  const [filter, setFilter] = useState('');
  const [churchFilter, setChurchFilter] = useState('all');

  const filtered = appointments.filter(apt => {
    const matchesSearch = apt.name.toLowerCase().includes(filter.toLowerCase()) || 
                          apt.phone.includes(filter) ||
                          (apt.neighborhood && apt.neighborhood.toLowerCase().includes(filter.toLowerCase()));
    const matchesChurch = churchFilter === 'all' || apt.church === churchFilter;
    return matchesSearch && matchesChurch;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Reporte General de Atendimientos</h1>
          <p className="text-gray-500 mt-2 font-medium">Visualización de todos los registros y problemas reportados. (Click en nombre para corregir)</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Buscar por nombre, tel o barrio..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-3 pl-10 rounded-xl border border-gray-200 bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-black"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <ICONS.Search />
            </div>
          </div>

          <select
            value={churchFilter}
            onChange={(e) => setChurchFilter(e.target.value)}
            className="p-3 rounded-xl border border-gray-200 bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-black uppercase text-xs tracking-wider"
          >
            <option value="all">TODAS LAS SEDES</option>
            {CHURCHES.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase tracking-widest">No se encontraron registros</p>
          </div>
        ) : (
          filtered.map(apt => (
            <div key={apt.id} className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden hover:border-blue-200 transition-all group">
              <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                {/* Persona & Info */}
                <div className="lg:w-1/3 flex items-start gap-5">
                  <button 
                    onClick={() => onEdit(apt)}
                    className="w-16 h-16 bg-[#2b44d3] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform"
                  >
                    {apt.name.charAt(0).toUpperCase()}
                  </button>
                  <div className="space-y-1">
                    <button onClick={() => onEdit(apt)} className="text-left block">
                      <h3 className="text-xl font-black text-black uppercase tracking-tight leading-none mb-1 group-hover:text-[#2b44d3] transition-colors">{apt.name}</h3>
                    </button>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-bold text-gray-500">{apt.phone}</p>
                      {apt.neighborhood && (
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-tighter">Barrio: {apt.neighborhood}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1 bg-blue-50 text-[#2b44d3] rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                        {apt.church}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        apt.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {apt.status === 'completed' ? 'Finalizado' : 'Pendiente'}
                      </span>
                    </div>
                    <div className="pt-3 flex gap-4 text-xs font-bold text-gray-400">
                      <span className="flex items-center gap-1">📅 {apt.date}</span>
                      <span className="flex items-center gap-1">⏰ {apt.time}</span>
                    </div>
                  </div>
                </div>

                {/* Notas / Problemas */}
                <div className="flex-1 lg:pl-8 lg:border-l border-gray-100">
                  <h4 className="text-[11px] font-black text-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#2b44d3] rounded-full"></span>
                    Problemas Comentados / Notas
                  </h4>
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 min-h-[100px] relative">
                    {apt.notes ? (
                      <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-wrap italic">
                        "{apt.notes}"
                      </p>
                    ) : (
                      <p className="text-gray-300 font-bold uppercase text-[10px] tracking-widest flex items-center justify-center h-full">
                        Sin notas adicionales registradas
                      </p>
                    )}
                    <div className="absolute top-2 right-3 text-[#2b44d3] opacity-10">
                       <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017C11.4647 12 11.017 11.5523 11.017 11V7C11.017 5.89543 11.9124 5 13.017 5H19.017C20.6739 5 22.017 6.34315 22.017 8V15C22.017 17.7614 19.7784 20 17.017 20H15.017C14.4647 20 14.017 20.4477 14.017 21ZM5.017 21L5.017 18C5.017 16.8954 5.91243 16 7.017 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.017C5.46472 8 5.017 8.44772 5.017 9V11C5.017 11.5523 4.56929 12 4.017 12H3.017C2.46472 12 2.017 11.5523 2.017 11V7C2.017 5.89543 2.91243 5 4.017 5H10.017C11.6739 5 13.017 6.34315 13.017 8V15C13.017 17.7614 10.7784 20 8.017 20H6.017C5.46472 20 5.017 20.4477 5.017 21Z"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};