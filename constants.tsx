import React from 'react';

export const CHURCHES = [
  { id: '1', name: 'PUNTO CLAVE', address: 'Sede Punto Clave' },
  { id: '2', name: 'CENTRO', address: 'Sede Centro' },
  { id: '3', name: 'SANTA CRUZ', address: 'Sede Santa Cruz' },
  { id: '4', name: 'LAURELES', address: 'Sede Laureles' },
  { id: '5', name: 'CASTILLA', address: 'Sede Castilla' },
  { id: '6', name: 'BELLO', address: 'Sede Bello' },
  { id: '7', name: 'ANDES', address: 'Sede Andes' },
  { id: '8', name: 'SAN JERÓNIMO', address: 'Sede San Jerónimo' },
  { id: '9', name: 'RIONEGRO', address: 'Sede Rionegro' },
  { id: '10', name: 'ITAGÜÍ', address: 'Sede Itagüí' },
  { id: '11', name: 'GIRARDOTA', address: 'Sede Girardota' },
  { id: '12', name: 'CHIGORODÓ', address: 'Sede Chigorodó' },
  { id: '13', name: 'CAREPA', address: 'Sede Carepa' },
  { id: '14', name: 'APARTADÓ', address: 'Sede Apartadó' }
];

export const SERVICE_DAYS = [
  "DOMINGO",
  "LUNES",
  "MARTES",
  "MIÉRCOLES",
  "JUEVES",
  "VIERNES",
  "SÁBADO"
];

export const SERVICE_TIMES = [
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "12:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM"
];

export const ICONS = {
  Dashboard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="15" rx="1"/></svg>
  ),
  UserPlus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
  ),
  History: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
  ),
  Report: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
  ),
  Church: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 21-4-4h3V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10h3l-4 4"/><path d="M7 5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2"/><path d="M9 11h6"/><path d="M9 15h6"/><path d="M12 9v12"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  )
};