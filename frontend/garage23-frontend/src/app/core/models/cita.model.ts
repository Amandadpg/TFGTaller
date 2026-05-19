export interface Cita {
  id: number;
  fecha: string;
  hora: string;
  estado: 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA';
  matriculaVehiculo: string;
  nombreServicio: string;
  nombreUsuario?: string;
}
