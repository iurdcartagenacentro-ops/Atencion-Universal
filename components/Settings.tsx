
import React, { useState, useRef } from 'react';
import { AuthUser } from '../types';

interface SettingsProps {
  user: AuthUser;
  onUpdate: (updatedUser: AuthUser) => void;
  onCancel: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onUpdate, onCancel }) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...user,
      name,
      avatar
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-8 bg-gray-900 text-white">
          <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            Mi Perfil
          </h2>
          <p className="text-sm font-medium opacity-90 mt-1">Personaliza tu información en la plataforma</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 shadow-xl bg-gray-100">
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-[#2b44d3] text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all active:scale-90 border-2 border-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest text-center">
                Pulsa el icono para cambiar tu foto
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-extrabold text-black uppercase tracking-widest mb-2 ml-1">
                  Tu Nombre Público
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-black uppercase tracking-wider"
                  placeholder="Tu nombre..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-black uppercase tracking-widest mb-2 ml-1">
                  Correo / Celular (No editable)
                </label>
                <input
                  disabled
                  type="text"
                  value={user.emailOrPhone}
                  className="w-full p-4 rounded-xl border border-gray-200 bg-gray-100 font-bold text-gray-400 uppercase tracking-wider opacity-60 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
              <button
                type="submit"
                className="flex-[2] bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-[0.97] border-b-4 border-gray-700 text-sm"
              >
                Guardar Cambios
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
