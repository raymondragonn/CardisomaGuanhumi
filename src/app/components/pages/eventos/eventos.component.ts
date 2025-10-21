import { Component, OnInit } from '@angular/core';

// Interface para los eventos
interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: Date;
  hora: string;
  ubicacion: string;
  tipo: 'limpieza' | 'voluntariado';
  inscritos: number;
  imagen: string;
  organizador: string;
  requisitos: string[];
}

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss'
})
export class EventosComponent implements OnInit {

  // Array de eventos
  eventos: Evento[] = [
    {
      id: 1,
      titulo: 'Jornada de Limpieza Costera',
      descripcion: 'Únete a nosotros para limpiar las playas y zonas costeras que son hábitat del cangrejo azul. Ayudaremos a mantener limpio el ecosistema.',
      fecha: new Date('2025-11-15'),
      hora: '8:00 AM - 12:00 PM',
      ubicacion: 'Playa Mocambo, Boca del Río, Veracruz',
      tipo: 'limpieza',
      inscritos: 32,
      imagen: 'assets/img/eventos/limpieza.jpg',
      organizador: 'Proyecto Cangrejo Azul',
      requisitos: ['Ropa cómoda', 'Protector solar', 'Botella de agua', 'Guantes (opcional)']
    },
    {
      id: 2,
      titulo: 'Monitoreo Nocturno de Migración',
      descripcion: 'Acompaña a nuestros biólogos en una noche de monitoreo de la migración reproductiva del cangrejo azul. Experiencia educativa única.',
      fecha: new Date('2025-11-22'),
      hora: '7:00 PM - 11:00 PM',
      ubicacion: 'Zona de Manglares, Alvarado',
      tipo: 'voluntariado',
      inscritos: 15,
      imagen: 'assets/img/eventos/monitoreo.jpg',
      organizador: 'Universidad Veracruzana',
      requisitos: ['Linterna', 'Repelente de mosquitos', 'Ropa oscura', 'Calzado cerrado']
    },
    {
      id: 3,
      titulo: 'Taller de Conservación Marina',
      descripcion: 'Aprende sobre la importancia ecológica del cangrejo azul y cómo podemos contribuir a su conservación. Incluye actividades prácticas.',
      fecha: new Date('2025-11-29'),
      hora: '10:00 AM - 2:00 PM',
      ubicacion: 'Centro Comunitario La Boticaria',
      tipo: 'voluntariado',
      inscritos: 28,
      imagen: 'assets/img/eventos/taller.jpg',
      organizador: 'Asociación de Conservación',
      requisitos: ['Cuaderno', 'Pluma', 'Actitud de aprendizaje']
    },
    {
      id: 4,
      titulo: 'Voluntariado: Reforestación de Manglar',
      descripcion: 'Participa en la siembra de mangles para restaurar el hábitat natural del cangrejo azul. Contribuye directamente a la conservación.',
      fecha: new Date('2025-12-06'),
      hora: '7:00 AM - 1:00 PM',
      ubicacion: 'Laguna de Alvarado',
      tipo: 'voluntariado',
      inscritos: 18,
      imagen: 'assets/img/eventos/voluntariado.jpg',
      organizador: 'Conanp',
      requisitos: ['Ropa que se pueda ensuciar', 'Botas de hule', 'Sombrero', 'Agua']
    }
  ];

  // Filtro de eventos
  filtroActivo: string = 'todos';

  constructor() { }

  ngOnInit(): void {
  }

  // Método para obtener eventos filtrados
  get eventosFiltrados(): Evento[] {
    if (this.filtroActivo === 'todos') {
      return this.eventos;
    }
    return this.eventos.filter(evento => evento.tipo === this.filtroActivo);
  }

  // Método para cambiar el filtro
  cambiarFiltro(tipo: string): void {
    this.filtroActivo = tipo;
  }

  // Método para unirse a un evento
  unirseEvento(evento: Evento): void {
    evento.inscritos++;
    alert(`¡Te has registrado exitosamente para "${evento.titulo}"!\n\nRecibirás un correo de confirmación con los detalles.`);
  }

  // Obtener clase CSS según el tipo de evento
  getTipoClase(tipo: string): string {
    const clases: { [key: string]: string } = {
      'limpieza': 'tipo-limpieza',
      'monitoreo': 'tipo-monitoreo',
      'educativo': 'tipo-educativo',
      'voluntariado': 'tipo-voluntariado'
    };
    return clases[tipo] || '';
  }

  // Obtener icono según el tipo de evento
  getTipoIcono(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'limpieza': 'bi-trash3',
      'monitoreo': 'bi-binoculars',
      'educativo': 'bi-book',
      'voluntariado': 'bi-hand-thumbs-up'
    };
    return iconos[tipo] || 'bi-calendar-event';
  }

  // Formatear fecha
  formatearFecha(fecha: Date): string {
    const opciones: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return fecha.toLocaleDateString('es-MX', opciones);
  }
}
