export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;   // <--- Añade esto
  direccion: string;  // <--- Añade esto
  email: string;
  rol: string;
  vehiculos?: any[];  // <--- Añade esto con el "?" para que no explote si no tiene coches aún
  citas?: any[];      // <--- Añade esto también
}