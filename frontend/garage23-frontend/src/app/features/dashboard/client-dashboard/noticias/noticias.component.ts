import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-noticias',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './noticias.component.html'
})
export class NoticiasComponent {

    listaNoticias = [
        {
            id: 1,
            fecha: '10 MAYO 2026',
            categoria: 'Tecnología',
            titulo: 'Incorporamos la última tecnología en diagnosis avanzada.',
            resumen: 'Hemos actualizado nuestros equipos con las últimas máquinas de diagnosis oficiales para asegurar una precisión milimétrica en los ajustes de motor y electrónica de tu vehículo premium.',
            cuerpo: 'Llevamos la precisión al siguiente nivel. En Garage23AMG entendemos que un vehículo de alto rendimiento requiere herramientas a su altura. Por eso, hemos incorporado sistemas de diagnosis por fibra óptica que analizan cada sensor del coche en tiempo real. Esto no solo nos permite detectar averías actuales, sino prevenir fallos futuros antes de que ocurran.',
            // FOTO ARREGLADA: Mecánico usando tecnología (Pexels)
            imagen: 'https://images.pexels.com/photos/4489749/pexels-photo-4489749.jpeg?auto=compress&cs=tinysrgb&w=1200'
        },
        {
            id: 2,
            fecha: '28 ABRIL 2026',
            categoria: 'Casos de Éxito',
            titulo: 'El renacer de una bestia: Restauración de un C63 AMG.',
            resumen: 'Entró al taller necesitando mucho cariño y ha salido listo para volver a rugir. Descubre el proceso completo de restauración de chapa, pintura y puesta a punto de motor de esta joya alemana.',
            cuerpo: 'Esta unidad llegó con el motor fatigado y la pintura desgastada por el tiempo. Tras 200 horas de trabajo artesanal, reconstrucción de culatas y un proceso de detallado exterior con coating cerámico, este C63 vuelve a lucir como el día que salió del concesionario. Un orgullo para nuestro equipo.',
            // FOTO ORIGINAL (Esta funcionaba bien)
            imagen: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80'
        },
        {
            id: 3,
            fecha: '15 MARZO 2026',
            categoria: 'Mantenimiento',
            titulo: 'Prepara tu coche para el verano: 5 puntos clave.',
            resumen: 'Las altas temperaturas no perdonan a la mecánica de alto rendimiento. Te contamos qué revisamos en nuestro chequeo de verano: refrigeración, frenos, neumáticos y lubricantes.',
            cuerpo: 'El calor es el enemigo número uno de los motores potentes. Recomendamos encarecidamente revisar el estado del líquido refrigerante, la carga del aire acondicionado y, sobre todo, la presión y cristalización de los neumáticos, que sufren especialmente con el asfalto a altas temperaturas.',
            // FOTO ARREGLADA: Mantenimiento en el taller (Pexels)
            imagen: 'https://images.pexels.com/photos/3807571/pexels-photo-3807571.jpeg?auto=compress&cs=tinysrgb&w=1200'
        }
    ];

}