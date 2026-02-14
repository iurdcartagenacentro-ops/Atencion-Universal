import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, Appointment, AuthUser } from './types';
import { ICONS } from './constants';
import { Dashboard } from './components/Dashboard';
import { AppointmentForm } from './components/AppointmentForm';
import { AuthScreen } from './components/AuthScreen';
import { GlobalHistory } from './components/GlobalHistory';
import { Settings } from './components/Settings';
import { TeamActivity } from './components/TeamActivity';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedTeamUser, setSelectedTeamUser] = useState<string | null>(null);

  // Hidratación de datos desde el "Mock DB" (LocalStorage)
  useEffect(() => {
    const initApp = async () => {
      try {
        const savedUser = localStorage.getItem('ecochurch_current_user');
        const savedApps = localStorage.getItem('ecochurch_appointments');
        
        if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
          setCurrentUser(JSON.parse(savedUser));
        }
        
        if (savedApps && savedApps !== "undefined" && savedApps !== "null") {
          setAppointments(JSON.parse(savedApps));
        }
      } catch (e) {
        console.error("Error al cargar la base de datos local", e);
      } finally {
        setTimeout(() => setIsLoaded(true), 1000);
      }
    };
    initApp();
  }, []);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('ecochurch_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ecochurch_current_user');
    setView('dashboard');
  };

  const saveToGlobalStorage = useCallback((newAppointments: Appointment[]) => {
    setAppointments(newAppointments);
    localStorage.setItem('ecochurch_appointments', JSON.stringify(newAppointments));
  }, []);

  const handleCreateAppointment = (data: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'userId'>) => {
    if (!currentUser) return;
    
    const newAppointment: Appointment = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: Date.now(),
      status: 'pending'
    };

    saveToGlobalStorage([newAppointment, ...appointments]);
    setView('dashboard');
  };

  const handleUpdateAppointment = (data: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'userId'>) => {
    if (!editingAppointment) return;
    
    const updated = appointments.map(apt => 
      apt.id === editingAppointment.id ? { ...apt, ...data } : apt
    );
    
    saveToGlobalStorage(updated);
    setEditingAppointment(null);
    setView('dashboard');
  };

  const handleCompleteAppointment = (id: string) => {
    const updated = appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'completed' as const } : apt
    );
    saveToGlobalStorage(updated);
  };

  if (!isLoaded) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
      <div className="relative flex flex-col items-center">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-2xl animate-bounce mb-8">
          A
        </div>
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full animate-[loading_1.5s_infinite_ease-in-out]"></div>
        </div>
        <p className="mt-4 text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">Cargando Base de Datos...</p>
      </div>
    </div>
  );

  if (!currentUser) return <AuthScreen onLogin={handleLogin} />;

  const NavItem = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all w-full group ${
        active 
          ? 'bg-[#2b44d3] text-white shadow-xl shadow-blue-500/20' 
          : 'text-slate-500 hover:bg-slate-50'
      }`}
    >
      <div className={active ? 'text-white' : 'text-slate-300 group-hover:text-blue-500'}>
        {icon}
      </div>
      <span className="font-black text-[11px] uppercase tracking-[0.15em]">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      <aside className="w-full md:w-80 bg-white border-r border-slate-100 p-8 flex flex-col gap-10 shadow-sm z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#2b44d3] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
            A
          </div>
          <div>
            <h2 className="font-black text-slate-900 leading-none uppercase tracking-tighter text-xl">Universal</h2>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mt-1">Sincronizado</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<ICONS.Dashboard />} label="Panel Control" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavItem icon={<ICONS.UserPlus />} label="Nuevo Contacto" active={view === 'new'} onClick={() => { setEditingAppointment(null); setView('new'); }} />
          <NavItem icon={<ICONS.Report />} label="Reporte Global" active={view === 'all_history'} onClick={() => setView('all_history')} />
          <NavItem icon={<ICONS.History />} label="Actividad Equipo" active={view === 'team_activity'} onClick={() => { setSelectedTeamUser(null); setView('team_activity'); }} />
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-50">
          <div className="flex flex-col gap-5">
            <button 
              onClick={() => setView('settings')}
              className="flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50 transition-all text-left"
            >
              <img src={currentUser.avatar} alt="Perfil" className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm object-cover bg-slate-100" />
              <div className="overflow-hidden">
                <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 font-bold truncate uppercase tracking-widest">Ajustes</p>
              </div>
            </button>
            <button onClick={handleLogout} className="w-full py-3 text-[10px] font-black text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all uppercase tracking-[0.2em]">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto h-screen bg-[#f8fafc]">
        {view === 'dashboard' && (
          <Dashboard 
            appointments={appointments} 
            onNew={() => setView('new')} 
            onEdit={(apt) => { setEditingAppointment(apt); setView('edit'); }} 
            onComplete={handleCompleteAppointment}
            onSelectUserActivity={(userName) => { setSelectedTeamUser(userName); setView('team_activity'); }}
          />
        )}
        
        {view === 'new' && (
          <AppointmentForm 
            onSave={handleCreateAppointment} 
            onCancel={() => setView('dashboard')} 
          />
        )}
        
        {view === 'edit' && editingAppointment && (
          <AppointmentForm 
            initialData={editingAppointment} 
            onSave={handleUpdateAppointment} 
            onCancel={() => setView('dashboard')} 
          />
        )}
        
        {view === 'all_history' && (
          <GlobalHistory 
            appointments={appointments} 
            onEdit={(apt) => { setEditingAppointment(apt); setView('edit'); }} 
          />
        )}

        {view === 'team_activity' && (
          <TeamActivity 
            appointments={appointments}
            selectedUser={selectedTeamUser}
            onBack={() => setView('dashboard')}
            onEdit={(apt) => { setEditingAppointment(apt); setView('edit'); }}
          />
        )}
        
        {view === 'settings' && (
          <Settings 
            user={currentUser} 
            onUpdate={(u) => { setCurrentUser(u); setView('dashboard'); }} 
            onCancel={() => setView('dashboard')} 
          />
        )}
      </main>
    </div>
  );
};

export default App;