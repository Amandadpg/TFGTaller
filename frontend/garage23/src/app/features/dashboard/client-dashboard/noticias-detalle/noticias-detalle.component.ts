import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
    selector: 'app-noticia-detalle',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './noticias-detalle.component.html'
})
export class NoticiaDetalleComponent implements OnInit {
    private route = inject(ActivatedRoute);
    noticia: any;

    listaNoticias = [
        {
            id: 1,
            fecha: '10 MAYO 2026',
            categoria: 'Tecnología',
            titulo: 'Incorporamos la última tecnología en diagnosis avanzada.',
            imagen: 'https://images.pexels.com/photos/4489749/pexels-photo-4489749.jpeg?auto=compress&cs=tinysrgb&w=1200',
            // Ahora el cuerpo es una lista (Array) con varios párrafos
            cuerpo: [
                'Llevamos la precisión al siguiente nivel. En Garage23AMG entendemos que un vehículo de alto rendimiento requiere herramientas a su altura. Por eso, hemos incorporado sistemas de diagnosis por fibra óptica que analizan cada sensor del coche en tiempo real.',
                'Esta nueva maquinaria nos permite detectar averías microscópicas que los escáneres tradicionales pasan por alto. Gracias a esto, podemos realizar ajustes precisos en la inyección, optimizar el rendimiento del motor y asegurar que la electrónica de tu vehículo funcione como un reloj suizo.',
                'Nuestro equipo técnico ya ha recibido la formación oficial para operar esta tecnología. Si sientes que tu coche no rinde al 100% o tienes un testigo encendido en el cuadro, tráelo. Nosotros encontraremos la raíz del problema exacto sin hacerte perder tiempo ni dinero, garantizando siempre la máxima transparencia.'
            ]
        },
        {
            id: 2,
            fecha: '28 ABRIL 2026',
            categoria: 'Casos de Éxito',
            titulo: 'El renacer de una bestia: Restauración de un C63 AMG.',
            imagen: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
            cuerpo: [
                'Esta unidad llegó a nuestras instalaciones con el motor fatigado, ruidos metálicos en la distribución y una pintura negra que había perdido todo su brillo original debido a los lavados en rodillo y el paso del tiempo.',
                'Nuestro equipo se puso manos a la obra. Primero, realizamos una reconstrucción completa de las culatas y la distribución del motor V8, devolviéndole su compresión original y ese rugido gutural que tanto caracteriza a AMG. Posteriormente, el chasis fue revisado milímetro a milímetro para asegurar una rigidez perfecta en curva.',
                'Para terminar, aplicamos un proceso de detallado exterior (Detaling) en tres fases, sellando la pintura con un coating cerámico de dureza 9H. Hoy, este C63 vuelve a lucir como el día que salió del concesionario en Affalterbach. Es un orgullo para nuestro equipo ver cómo estas joyas vuelven a devorar kilómetros.'
            ]
        },
        {
            id: 3,
            fecha: '15 MARZO 2026',
            categoria: 'Mantenimiento',
            titulo: 'Prepara tu coche para el verano: 5 puntos clave.',
            imagen: 'https://images.pexels.com/photos/3807571/pexels-photo-3807571.jpeg?auto=compress&cs=tinysrgb&w=1200',
            cuerpo: [
                'El calor del sur es el enemigo número uno de las mecánicas potentes. Las altas temperaturas castigan sin piedad el sistema de refrigeración y los compuestos de goma del vehículo, por lo que una revisión a tiempo puede salvarte de una avería grave en plenas vacaciones.',
                'En nuestro chequeo de verano prestamos especial atención al estado del líquido refrigerante y al rendimiento de los electros ventiladores. Además, comprobamos la carga del gas del aire acondicionado, asegurando que el habitáculo mantenga una temperatura óptima sin forzar el compresor.',
                'Por último, pero no menos importante, analizamos minuciosamente los neumáticos. Comprobamos la presión, el desgaste y buscamos posibles signos de cristalización, ya que el asfalto ardiendo degrada las ruedas a un ritmo alarmante. Pide cita antes de tu viaje y asegúrate de disfrutar del asfalto con total tranquilidad.'
            ]
        }
    ];

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.noticia = this.listaNoticias.find(n => n.id === id);
    }
}
