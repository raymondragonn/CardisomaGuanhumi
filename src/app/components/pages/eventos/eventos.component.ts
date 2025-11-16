import { Component, OnInit } from '@angular/core';
import { CrearEventoService } from '../../../services/crear-evento.service';

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
  eventos: Evento[] = [];

  // Estado de carga
  isLoading: boolean = true;
  errorMessage: string = '';

  // Filtro de eventos
  filtroActivo: string = 'todos';

  constructor(private eventoService: CrearEventoService) { }

  ngOnInit(): void {
    this.cargarEventos();
  }

  // Método para cargar eventos desde el backend
  cargarEventos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.eventoService.getEventos()
      .subscribe({
        next: (response) => {
          console.log('Eventos cargados desde backend:', response);
          
          // Mapear los eventos del backend al formato del componente
          this.eventos = response.map((evento: any) => {
            console.log('Mapeando evento:', evento);
            
            const eventoMapeado = {
              id: evento.id || 0,
              titulo: evento.titulo || 'Sin título',
              descripcion: evento.descripcion || 'Sin descripción',
              fecha: new Date(evento.fecha || new Date()),
              hora: evento.hora || 'Por confirmar',
              ubicacion: evento.lugar || 'Por confirmar',
              tipo: (evento.tipo || 'voluntariado').toLowerCase(),
              inscritos: evento.total_inscritos || 0,
              imagen: evento.imagen || 'assets/img/cangrejo/CangrejoAzul1.jpg',
              organizador: evento.creado_por?.full_name || evento.creado_por?.username || 'Proyecto Cangrejo Azul',
              requisitos: (() => {
                // Si es un string, dividirlo por comas o puntos
                const requisitosTexto = evento.requisitos || '';
                
                if (typeof requisitosTexto === 'string' && requisitosTexto.trim().length > 0) {
                  // Intentar dividir por comas, puntos y coma, o saltos de línea
                  const separadores = /[,;.\n]+/;
                  return requisitosTexto
                    .split(separadores)
                    .map((r: string) => r.trim())
                    .filter((r: string) => r.length > 0);
                }
                
                return [];
              })()
            };
            
            console.log('Evento mapeado:', eventoMapeado);
            return eventoMapeado;
          });
          
          console.log('Total eventos cargados:', this.eventos.length);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar eventos:', error);
          this.isLoading = false;
          
          if (error.status === 401) {
            this.errorMessage = 'No estás autenticado. Por favor inicia sesión.';
          } else if (error.status === 0) {
            this.errorMessage = 'No se pudo conectar con el servidor.';
          } else {
            this.errorMessage = 'Error al cargar eventos: ' + (error.error?.message || error.message || 'Error desconocido');
          }
          
        }
      });
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
    // Verificar si el usuario está autenticado
    if (!this.eventoService.isAuthenticated()) {
      alert('⚠️ Debes iniciar sesión para unirte a un evento.');
      return;
    }

    // Llamar al servicio para inscribirse
    this.eventoService.inscribirEvento(evento.id)
      .subscribe({
        next: (response) => {
          console.log('Inscripción exitosa:', response);
          evento.inscritos++;
          alert(`✅ ¡Te has registrado exitosamente para "${evento.titulo}"!\n\nRecibirás un correo de confirmación con los detalles.`);
        },
        error: (error) => {
          console.error('Error al inscribirse:', error);
          
          if (error.status === 401) {
            alert('⚠️ Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          } else if (error.status === 409) {
            alert('⚠️ Ya estás inscrito en este evento.');
          } else if (error.status === 404) {
            alert('⚠️ El evento no existe o ha sido cancelado.');
          } else {
            alert(`❌ Error al inscribirse: ${error.error?.message || error.message || 'Error desconocido'}`);
          }
        }
      });
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
