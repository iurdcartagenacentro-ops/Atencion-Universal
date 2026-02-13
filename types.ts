export interface Appointment {
  id: string;
  userId: string; // Vinculación con el usuario que lo creó
  name: string;
  phone: string;
  neighborhood: string; // Barrio donde vive
  date: string;
  time: string;
  church: string;
  notes: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: number;
}

export interface AuthUser {
  id: string;
  name: string;
  emailOrPhone: string;
  password?: string; // En un entorno real, esto no se guardaría así
  role: 'admin' | 'pastor' | 'voluntario';
  avatar: string;
}

export interface Church {
  id: string;
  name: string;
  address: string;
}

export type ViewState = 'dashboard' | 'new' | 'edit' | 'history' | 'all_history' | 'settings';