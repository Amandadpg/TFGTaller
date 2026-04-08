export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  rol: 'ADMIN' | 'CLIENTE';
}
