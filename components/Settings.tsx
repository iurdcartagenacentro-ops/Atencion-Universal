import React, { useState, useRef } from 'react';
import { AuthUser, Appointment } from '../types';

interface SettingsProps {
  user: AuthUser;
  appointments: Appointment[];
  onUpdate: (updatedUser: AuthUser) => void;
  onImport: (json: string) => void;
  onCancel: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, appointments, onUpdate, onImport, onCancel }) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [importCode, setImportCode] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportCode = JSON.stringify(appointments);

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportCode);
    alert("¡Código copiado! Envíalo a tu equipo para que lo importen.");
  };

  const handleImport = () => {
    if (confirm("Esto reemplazará tus datos actuales por los del equipo. ¿Continuar?")) {
      onImport(importCode);
      setImportCode('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-10 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Mi Perfil y Red</h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Configura tu identidad y sincroniza con el equipo</p>
          </div>
          <button onClick={onCancel} className="bg-white/10 p-3 rounded-2xl hover:bg-white/20 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Perfil */}
          <div className="space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Información Personal
            </h3>
            <div className="flex flex-col items-center gap-6 p-8 bg-slate-50 rounded-[2rem]">
              <div className="relative group">
                <img src={avatar} className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white shadow-xl bg-white" />
                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg hover:scale-110 transition-all border-2 border-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                </button>
                <input type="file" ref={fileInputRef} onChange={(e) => {
                  const f = e.target.files?.[0];
                  if(f) {
                    const r = new FileReader();
                    r.onloadend = () => setAvatar(r.result as string);
                    r.readAsDataURL(f);
                  }
                }} className="hidden" />
              </div>
              <div className="w-full space-y-4">
                <input value={name} onChange={e => setName(e.target.value)} className="w-full p-4 rounded-xl border border-slate-200 font-black uppercase text-center text-sm tracking-widest outline-none focus:border-blue-500" placeholder="TU NOMBRE" />
                <button onClick={() => onUpdate({...user, name, avatar})} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">Actualizar Perfil</button>
              </div>
            </div>
          </div>

          {/* Sincronización Global */}
          <div className="space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Sincronización con el Equipo
            </h3>
            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 space-y-4">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Opción A: Exportar mis datos</p>
                <p className="text-xs text-blue-800 font-medium leading-relaxed">Copia este código y envíalo a tus compañeros para que vean tus atendimientos.</p>
                <button onClick={handleCopyExport} className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200">Copiar Código de Red</button>
              </div>

              <div className="p-6 bg-green-50 rounded-3xl border border-green-100 space-y-4">
                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Opción B: Importar del Equipo</p>
                <p className="text-xs text-green-800 font-medium leading-relaxed">Pega aquí el código que te envió tu compañero para sincronizar las bases de datos.</p>
                <textarea value={importCode} onChange={e => setImportCode(e.target.value)} className="w-full h-24 p-4 rounded-xl border border-green-200 text-[10px] font-mono bg-white outline-none focus:border-green-500" placeholder="Pega el código aquí..." />
                <button disabled={!importCode} onClick={handleImport} className="w-full bg-green-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-200 disabled:opacity-50">Sincronizar Ahora</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};