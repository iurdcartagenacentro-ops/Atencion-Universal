
import React, { useState } from 'react';
import { AuthUser } from '../types';

interface AuthScreenProps {
  onLogin: (user: AuthUser) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    name: '',
    identifier: '', // email o teléfono
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulación de proceso de autenticación con persistencia en localStorage
    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem('ecochurch_users') || '[]');
      
      if (mode === 'login') {
        // Buscar usuario por correo o celular
        const user = storedUsers.find((u: any) => u.emailOrPhone === formData.identifier);
        
        if (user) {
          // En una app real validaríamos el password aquí
          const authUser: AuthUser = {
            id: user.id,
            name: user.name,
            emailOrPhone: user.emailOrPhone,
            role: user.role || 'voluntario',
            avatar: user.avatar
          };
          onLogin(authUser);
        } else {
          setError('Usuario no encontrado. Verifique sus datos o regístrese.');
        }
      } else {
        // Modo Registro
        // Verificar si ya existe
        const exists = storedUsers.some((u: any) => u.emailOrPhone === formData.identifier);
        if (exists) {
          setError('Este correo o celular ya está registrado.');
          setLoading(false);
          return;
        }

        const newId = Math.random().toString(36).substring(2, 9);
        const newUser = {
          id: newId,
          name: formData.name,
          emailOrPhone: formData.identifier,
          password: formData.password,
          role: 'pastor', // Default role for demo
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.identifier}`
        };

        storedUsers.push(newUser);
        localStorage.setItem('ecochurch_users', JSON.stringify(storedUsers));

        const authUser: AuthUser = {
          id: newUser.id,
          name: newUser.name,
          emailOrPhone: newUser.emailOrPhone,
          role: 'pastor',
          avatar: newUser.avatar
        };
        onLogin(authUser);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 overflow-hidden relative">
      {/* Decoración de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="glass-morphism p-8 rounded-3xl shadow-2xl bg-white/95">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-[#2b44d3] rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg mb-4">
              A
            </div>
            <h1 className="text-2xl font-black text-black uppercase tracking-tight">Atención Universal</h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Gestión Profesional de Atendimientos</p>
          </div>

          <div className="flex gap-1 bg-gray-100 p-1.5 rounded-2xl mb-8">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-white text-[#2b44d3] shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Ingresar
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'register' ? 'bg-white text-[#2b44d3] shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Registrarse
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-xl animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-[11px] font-black text-black uppercase tracking-widest ml-1">Nombre Completo</label>
                <input
                  required
                  type="text"
                  className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#2b44d3] outline-none transition-all font-medium text-black"
                  placeholder="Ej: Rodrigo Ataide"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-black text-black uppercase tracking-widest ml-1">Correo o Celular</label>
              <input
                required
                type="text"
                className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#2b44d3] outline-none transition-all font-medium text-black"
                placeholder="Identificador de acceso..."
                value={formData.identifier}
                onChange={e => setFormData({ ...formData, identifier: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-black uppercase tracking-widest ml-1">Contraseña</label>
              <input
                required
                type="password"
                className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#2b44d3] outline-none transition-all font-medium text-black"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#2b44d3] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-[0.98] border-b-4 border-blue-900 disabled:opacity-50 mt-6 text-sm"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>{mode === 'login' ? 'Entrar a la Plataforma' : 'Crear Mi Cuenta'}</>
              )}
            </button>
          </form>

          <p className="text-center text-[10px] font-bold text-gray-400 mt-8 uppercase tracking-widest">
            Seguridad y Privacidad Garantizada
          </p>
        </div>
      </div>
    </div>
  );
};
