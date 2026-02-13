import React, { useState } from 'react';
import { Appointment } from '../types';
import { CHURCHES, ICONS, SERVICE_DAYS, SERVICE_TIMES } from '../constants';

interface AppointmentFormProps {
  initialData?: Appointment;
  onSave: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'userId'>) => void;
  onCancel: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    neighborhood: initialData?.neighborhood || '',
    date: initialData?.date || SERVICE_DAYS[0],
    time: initialData?.time || SERVICE_TIMES[SERVICE_TIMES.length - 2],
    church: initialData?.church || CHURCHES[0].name,
    notes: initialData?.notes || ''
  });

  const isEdit = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const labelStyle = "block text-[11px] font-extrabold text-black uppercase tracking-widest mb-2 ml-1";
  const inputStyle = "w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-black placeholder:text-gray-300 appearance-none";
  const selectStyle = "w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-black uppercase tracking-wider appearance-none cursor-pointer";

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className={`p-8 ${isEdit ? 'bg-[#4338ca]' : 'bg-[#2b44d3]'} text-white transition-colors`}>
          <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight">
            {isEdit ? <ICONS.Dashboard /> : <ICONS.UserPlus />}
            {isEdit ? 'Corregir Atendimiento' : 'Nuevo Atendimiento'}
          </h2>
          <p className="text-sm font-medium opacity-90 mt-1">
            {isEdit ? `Editando registro de ${initialData.name}` : 'Registra la información del contacto de Facebook manualmente'}
          </p>
        </div>

        <div className="p-8 space-y-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className={labelStyle}>Nombre Completo</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputStyle}
                  placeholder="Ej: Maria García"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Teléfono / WhatsApp</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={inputStyle}
                    placeholder="Ej: +54 9 11 1234..."
                  />
                </div>
                <div>
                  <label className={labelStyle}>Barrio donde vive</label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className={inputStyle}
                    placeholder="Ej: Palermo"
                  />
                </div>
              </div>
              <div>
                <label className={labelStyle}>Iglesia a Participar</label>
                <div className="relative">
                  <select
                    value={formData.church}
                    onChange={(e) => setFormData({ ...formData, church: e.target.value })}
                    className="w-full p-4 rounded-xl border-2 border-blue-200 bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-black text-[#2b44d3] uppercase tracking-wider appearance-none shadow-sm cursor-pointer"
                  >
                    {CHURCHES.map(church => (
                      <option key={church.id} value={church.name} className="font-bold text-gray-900 uppercase">
                        {church.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Día que irá</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={selectStyle}
                    >
                      {SERVICE_DAYS.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelStyle}>Horario</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className={selectStyle}
                    >
                      {SERVICE_TIMES.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className={labelStyle}>Notas Adicionales / Problemas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className={`${inputStyle} h-[120px] resize-none overflow-hidden hover:overflow-y-auto`}
                  placeholder="Escriba detalles adicionales aquí..."
                />
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
              <button
                type="submit"
                className={`flex-[2] ${isEdit ? 'bg-indigo-600 border-indigo-900' : 'bg-[#2b44d3] border-blue-900'} text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:brightness-110 transition-all active:scale-[0.97] border-b-4 text-sm`}
              >
                {isEdit ? 'Actualizar Registro' : 'Guardar Atendimiento'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-5 bg-[#f1f3f5] text-[#495057] rounded-2xl font-black uppercase tracking-[0.15em] hover:bg-gray-200 transition-all active:scale-[0.97] text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};