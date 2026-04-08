export interface Vehiculo {
  id: number;
  matricula: string;
  marca: string;
  modelo: string;
  tipo: 'MOTO' | 'COCHE' | 'CAMION' | 'OTROS';
}
