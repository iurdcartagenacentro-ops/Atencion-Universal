import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, Appointment, AuthUser } from './types';
import { ICONS } from './constants';
import { Dashboard } from './components/Dashboard';
import { AppointmentForm } from './components/AppointmentForm';
import { AuthScreen } from './components/AuthScreen';
import { GlobalHistory } from './components/GlobalHistory';
import { Settings } from './components/Settings';
import { TeamActivity } from './components/TeamActivity';

const syncChannel = new BroadcastChannel('universal_atencion_sync_v2');

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedTeamUser, setSelectedTeamUser] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing'>('idle');

  // Cargar datos
  useEffect(() => {
    const init = () => {
      const savedUser = localStorage.getItem('ecochurch_current_user');
      const savedApps = localStorage.getItem('ecochurch_appointments');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      if (savedApps) setAppointments(JSON.parse(savedApps));
      setTimeout(() => setIsLoaded(true), 600);
    };
    init();
  }, []);

  // Sincronizar entre pestañas
  useEffect(() => {
    const handleSync = (e: MessageEvent) => {
      if (e.data.type === 'REFRESH_DATA') {
        setAppointments(e.data.payload);
        setSyncStatus('syncing');
        setTimeout(() => setSyncStatus('idle'), 2000);
      }
    };
    syncChannel.addEventListener('message', handleSync);
    return () => syncChannel.removeEventListener('message', handleSync);
  }, []);

  const saveGlobal = useCallback((newApps: Appointment[]) => {
    setAppointments(newApps);
    localStorage.setItem('ecochurch_appointments', JSON.stringify(newApps));
    syncChannel.postMessage({ type: 'REFRESH_DATA', payload: newApps });
  }, []);

  // Función para importar datos de otros usuarios (Sincronización manual entre PCs)
  const importSharedData = (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString);
      if (Array.isArray(imported)) {
        saveGlobal(imported);
        alert("¡Datos sincronizados con éxito!");
      }
    } catch (e) {
      alert("Código de sincronización inválido");
    }
  };

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('ecochurch_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ecochurch_current_user');
    setView('dashboard');
  };

  const handleCreateAppointment = (data: any) => {
    if (!currentUser) return;
    const newApt: Appointment = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: Date.now(),
      status: 'pending'
    };
    saveGlobal([newApt, ...appointments]);
    setView('dashboard');
  };

  const handleUpdateAppointment = (data: any) => {
    if (!editingAppointment) return;
    const updated = appointments.map(a => a.id === editingAppointment.id ? { ...a, ...data } : a);
    saveGlobal(updated);
    setEditingAppointment(null);
    setView('dashboard');
  };

  const handleComplete = (id: string) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status: 'completed' as const } : a);
    saveGlobal(updated);
  };

  if (!isLoaded) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black uppercase tracking-[0.3em] text-xs animate-pulse">Iniciando Sistema Global...</div>;
  if (!currentUser) return <AuthScreen onLogin={handleLogin} />;

  const NavItem = ({ icon, label, id }: { icon: any, label: string, id: ViewState }) => (
    <button
      onClick={() => { setView(id); setSelectedTeamUser(null); }}
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all w-full group ${view === id ? 'bg-[#2b44d3] text-white shadow-xl shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50'}`}
    >
      <div className={view === id ? 'text-white' : 'group-hover:text-blue-500'}>{icon}</div>
      <span className="font-black text-[10px] uppercase tracking-[0.15em]">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      {syncStatus === 'syncing' && (
        <div className="fixed top-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl animate-bounce">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando...</span>
        </div>
      )}

      <aside className="w-full md:w-80 bg-white border-r border-slate-100 p-8 flex flex-col gap-10 z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#2b44d3] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">A</div>
          <div>
            <h2 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Universal</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest">Global Sync Active</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem id="dashboard" label="Panel Control" icon={<ICONS.Dashboard />} />
          <NavItem id="new" label="Nuevo Contacto" icon={<ICONS.UserPlus />} />
          <NavItem id="all_history" label="Reporte Global" icon={<ICONS.Report />} />
          <NavItem id="team_activity" label="Actividad Equipo" icon={<ICONS.History />} />
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-50 flex flex-col gap-4">
          <button 
            onClick={() => setView('settings')}
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-all text-left"
          >
            <img src={currentUser.avatar} className="w-10 h-10 rounded-xl bg-slate-100 object-cover" />
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-slate-900 truncate uppercase">{currentUser.name}</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase">Configuración</p>
            </div>
          </button>
          <button onClick={handleLogout} className="text-[9px] font-black text-red-500 bg-red-50 py-3 rounded-xl uppercase tracking-widest hover:bg-red-100 transition-all">Salir</button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto h-screen">
        {view === 'dashboard' && (
          <Dashboard 
            appointments={appointments} 
            onNew={() => setView('new')} 
            onEdit={(a) => { setEditingAppointment(a); setView('edit'); }} 
            onComplete={handleComplete} 
            onSelectUserActivity={(u) => { setSelectedTeamUser(u); setView('team_activity'); }} 
          />
        )}
        {view === 'new' && <AppointmentForm onSave={handleCreateAppointment} onCancel={() => setView('dashboard')} />}
        {view === 'edit' && editingAppointment && <AppointmentForm initialData={editingAppointment} onSave={handleUpdateAppointment} onCancel={() => setView('dashboard')} />}
        {view === 'all_history' && <GlobalHistory appointments={appointments} onEdit={(a) => { setEditingAppointment(a); setView('edit'); }} />}
        {view === 'team_activity' && <TeamActivity appointments={appointments} selectedUser={selectedTeamUser} onBack={() => setView('dashboard')} onEdit={(a) => { setEditingAppointment(a); setView('edit'); }} />}
        {view === 'settings' && <Settings user={currentUser} appointments={appointments} onImport={importSharedData} onUpdate={(u) => { setCurrentUser(u); setView('dashboard'); }} onCancel={() => setView('dashboard')} />}
      </main>
    </div>
  );
};

export default App;