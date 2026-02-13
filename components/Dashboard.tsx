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
  const completed = appointments.filter(a => a.status === 'completed');
  
  const today = new Date().toISOString().split('T')[0];
  const appointmentsToday = appointments.filter(a => a.date === today);

  const filteredPending = pending.filter(a => 
    churchFilter === 'all' || a.church === churchFilter
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido de nuevo</h1>
          <p className="text-gray-500 mt-1">Aquí tienes un resumen de los atendimientos de hoy.</p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          <ICONS.UserPlus />
          Nuevo Atendimiento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <ICONS.Dashboard />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pendientes</p>
              <h3 className="text-2xl font-bold text-gray-900">{pending.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <ICONS.Check />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completados</p>
              <h3 className="text-2xl font-bold text-gray-900">{completed.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <ICONS.History />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Hoy</p>
              <h3 className="text-2xl font-bold text-gray-900">{appointmentsToday.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-bold text-gray-900">Atendimientos Recientes</h2>
            <p className="text-xs text-gray-400 mt-1">Mostrando registros pendientes (Click en nombre para editar)</p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-medium text-gray-400 whitespace-nowrap">Filtrar por iglesia:</span>
            <select 
              value={churchFilter}
              onChange={(e) => setChurchFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 flex-1 sm:flex-none min-w-[150px]"
            >
              <option value="all">Todas las sedes</option>
              {CHURCHES.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="divide-y divide-gray-50">
          {filteredPending.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                <ICONS.Dashboard />
              </div>
              <p className="text-gray-400">No hay atendimientos pendientes {churchFilter !== 'all' ? 'para esta iglesia' : ''}.</p>
              {churchFilter === 'all' && (
                <button onClick={onNew} className="text-blue-600 font-medium mt-2 hover:underline">Comenzar ahora</button>
              )}
            </div>
          ) : (
            filteredPending.slice(0, 10).map(apt => (
              <div key={apt.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors group">
                <div className="flex items-start gap-4">
                  <button 
                    onClick={() => onEdit(apt)}
                    className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 group-hover:scale-105 transition-transform"
                  >
                    {apt.name.charAt(0)}
                  </button>
                  <div>
                    <button 
                      onClick={() => onEdit(apt)}
                      className="text-left"
                    >
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase">{apt.name}</h4>
                    </button>
                    <p className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                      <span>{apt.phone}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-blue-600 font-medium">{apt.church}</span>
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">📅 {apt.date}</span>
                      <span className="flex items-center gap-1">⏰ {apt.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => onComplete(apt.id)}
                    className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors flex items-center gap-2"
                  >
                    <ICONS.Check /> Finalizar
                  </button>
                  <a 
                    href={`https://wa.me/${apt.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    title="Enviar mensaje"
                  >
                    💬
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};