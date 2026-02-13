import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, Appointment, AuthUser } from './types';
import { ICONS, CHURCHES } from './constants';
import { Dashboard } from './components/Dashboard';
import { AppointmentForm } from './components/AppointmentForm';
import { AuthScreen } from './components/AuthScreen';
import { GlobalHistory } from './components/GlobalHistory';
import { Settings } from './components/Settings';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [historyChurchFilter, setHistoryChurchFilter] = useState<string>('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('ecochurch_current_user');
    const savedApps = localStorage.getItem('ecochurch_appointments');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    if (savedApps) {
      setAppointments(JSON.parse(savedApps));
    }
    setIsLoaded(true);
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

  const handleUpdateProfile = (updatedUser: AuthUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('ecochurch_current_user', JSON.stringify(updatedUser));
    
    // También actualizar en la lista global de usuarios
    const storedUsers = JSON.parse(localStorage.getItem('ecochurch_users') || '[]');
    const updatedUsers = storedUsers.map((u: any) => u.id === updatedUser.id ? { ...u, ...updatedUser } : u);
    localStorage.setItem('ecochurch_users', JSON.stringify(updatedUsers));
    
    setView('dashboard');
  };

  // Función auxiliar para persistir atendimientos
  const saveAppointments = useCallback((newAppointments: Appointment[]) => {
    setAppointments(newAppointments);
    localStorage.setItem('ecochurch_appointments', JSON.stringify(newAppointments));
  }, []);

  const handleCreateAppointment = (data: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'userId'>) => {
    if (!currentUser) return;

    const newAppointment: Appointment = {
      ...data,
      userId: currentUser.id,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      status: 'pending'
    };
    saveAppointments([newAppointment, ...appointments]);
    setView('dashboard');
  };

  const handleUpdateAppointment = (data: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'userId'>) => {
    if (!editingAppointment) return;

    const updated = appointments.map(apt => 
      apt.id === editingAppointment.id 
        ? { ...apt, ...data } 
        : apt
    );
    saveAppointments(updated);
    setEditingAppointment(null);
    setView('dashboard');
  };

  const handleCompleteAppointment = (id: string) => {
    const updated = appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'completed' as const } : apt
    );
    saveAppointments(updated);
  };

  const handleStartEdit = (apt: Appointment) => {
    setEditingAppointment(apt);
    setView('edit');
  };

  // Filtrar atendimientos según el usuario y vistas
  const userAppointments = appointments.filter(a => a.userId === currentUser?.id);

  const filteredHistory = userAppointments.filter(a => 
    historyChurchFilter === 'all' || a.church === historyChurchFilter
  );

  if (!isLoaded) return null;

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const NavItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full group ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      <div className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'} transition-colors`}>
        {icon}
      </div>
      <span className="font-bold text-xs uppercase tracking-wider">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      {/* Navegación Lateral */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 p-6 flex flex-col gap-8 shadow-sm z-10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner">
            A
          </div>
          <div>
            <h2 className="font-black text-black leading-tight uppercase tracking-tight">Atención</h2>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Universal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          <NavItem 
            icon={<ICONS.Dashboard />} 
            label="Panel de Control" 
            active={view === 'dashboard'} 
            onClick={() => setView('dashboard')} 
          />
          <NavItem 
            icon={<ICONS.UserPlus />} 
            label="Nuevo Atendimiento" 
            active={view === 'new'} 
            onClick={() => {
              setEditingAppointment(null);
              setView('new');
            }} 
          />
          <NavItem 
            icon={<ICONS.History />} 
            label="Mi Historial" 
            active={view === 'history'} 
            onClick={() => setView('history')} 
          />
          <NavItem 
            icon={<ICONS.Report />} 
            label="Reporte Global" 
            active={view === 'all_history'} 
            onClick={() => setView('all_history')} 
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-50">
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setView('settings')}
              className={`flex items-center gap-3 p-2 rounded-xl transition-all group hover:bg-gray-50 ${view === 'settings' ? 'bg-blue-50' : ''}`}
            >
              <img src={currentUser.avatar} alt="Perfil" className="w-10 h-10 rounded-full border-2 border-blue-50 bg-gray-100 object-cover" />
              <div className="overflow-hidden text-left">
                <p className={`text-xs font-black truncate uppercase ${view === 'settings' ? 'text-blue-600' : 'text-black'}`}>{currentUser.name}</p>
                <p className="text-[10px] text-gray-400 truncate font-bold">{currentUser.emailOrPhone}</p>
              </div>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full py-2 text-[10px] font-black text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto h-screen bg-[#f8fafc]">
        {view === 'dashboard' && (
          <Dashboard 
            appointments={userAppointments} 
            onNew={() => setView('new')} 
            onEdit={handleStartEdit}
            onComplete={handleCompleteAppointment}
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
            onCancel={() => {
              setEditingAppointment(null);
              setView('dashboard');
            }} 
          />
        )}

        {view === 'all_history' && (
          <GlobalHistory appointments={appointments} onEdit={handleStartEdit} />
        )}

        {view === 'settings' && (
          <Settings 
            user={currentUser} 
            onUpdate={handleUpdateProfile} 
            onCancel={() => setView('dashboard')} 
          />
        )}

        {view === 'history' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
               <div>
                  <h1 className="text-3xl font-black text-black uppercase tracking-tight">Mi Historial Personal</h1>
                  <p className="text-gray-500 mt-2 font-medium">Registros cargados por ti. (Click en nombre para editar)</p>
               </div>
               
               <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 w-full sm:w-auto">
                 <span className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Sede</span>
                 <select 
                   value={historyChurchFilter}
                   onChange={(e) => setHistoryChurchFilter(e.target.value)}
                   className="text-sm border border-gray-200 rounded-xl p-2 focus:ring-4 focus:ring-blue-500 outline-none bg-gray-50 font-black text-black uppercase min-w-[200px]"
                 >
                   <option value="all">TODAS LAS SEDES</option>
                   {CHURCHES.map(c => (
                     <option key={c.id} value={c.name}>{c.name}</option>
                   ))}
                 </select>
               </div>
             </div>

             <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-black uppercase tracking-[0.2em]">Persona</th>
                        <th className="px-8 py-5 text-[10px] font-black text-black uppercase tracking-[0.2em]">Iglesia</th>
                        <th className="px-8 py-5 text-[10px] font-black text-black uppercase tracking-[0.2em]">Fecha / Hora</th>
                        <th className="px-8 py-5 text-[10px] font-black text-black uppercase tracking-[0.2em]">Estado</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {filteredHistory.length === 0 ? (
                        <tr><td colSpan={4} className="p-16 text-center text-gray-400 font-bold uppercase tracking-widest">No se encontraron registros en tu historial.</td></tr>
                      ) : (
                        filteredHistory.map(apt => (
                          <tr key={apt.id} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="px-8 py-5">
                              <button onClick={() => handleStartEdit(apt)} className="text-left block group">
                                <div className="font-black text-black uppercase tracking-tight leading-none mb-1 group-hover:text-blue-600 transition-colors">{apt.name}</div>
                                <div className="text-xs text-gray-400 font-bold">{apt.phone}</div>
                                {apt.neighborhood && (
                                  <div className="text-[10px] text-blue-500 font-bold uppercase mt-1">Barrio: {apt.neighborhood}</div>
                                )}
                              </button>
                            </td>
                            <td className="px-8 py-5">
                              <span className="text-xs text-blue-600 font-black uppercase tracking-wider">{apt.church}</span>
                            </td>
                            <td className="px-8 py-5 text-sm text-gray-600">
                              <div className="font-bold text-black">{apt.date}</div>
                              <div className="text-[11px] text-gray-400 font-black">{apt.time}</div>
                            </td>
                            <td className="px-8 py-5">
                              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                apt.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                              }`}>
                                {apt.status === 'completed' ? 'Finalizado' : 'Pendiente'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                   </tbody>
                 </table>
               </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
