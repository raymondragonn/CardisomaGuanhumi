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

  // Filtros
  searchTerm: string = '';
  filtroActivo: string = 'todos';

  // Eventos filtrados
  eventosFiltrados: Evento[] = [];

  // Categorías de filtro
  categorias = [
    { id: 'todos', nombre: 'Todos', icono: 'bi-grid-3x3-gap' },
    { id: 'limpieza', nombre: 'Limpieza', icono: 'bi-trash3' },
    { id: 'voluntariado', nombre: 'Voluntariado', icono: 'bi-hand-thumbs-up' }
  ];

  // Control del modal de creación
  mostrarModalCrear: boolean = false;
  creandoEvento: boolean = false;

  // Datos del formulario de creación
  nuevoEvento = {
    titulo: '',
    descripcion: '',
    fecha: '',
    hora: '',
    lugar: '',
    duracion: 120,
    requisitos: '',
    tipo: 'voluntariado'
  };

  constructor(private eventoService: CrearEventoService) { }

  ngOnInit(): void {
    this.cargarEventos();
    console.log('Usuario es admin:', this.isAdmin());
    console.log('Permiso en localStorage:', localStorage.getItem('user_permiso'));
  }

  // Verificar si el usuario es administrador
  isAdmin(): boolean {
    const isAdminValue = this.eventoService.isAdmin();
    console.log('isAdmin() devuelve:', isAdminValue);
    return isAdminValue;
  }

  // Abrir modal de creación
  abrirModalCrear(): void {
    this.mostrarModalCrear = true;
    this.limpiarFormulario();
  }

  // Cerrar modal de creación
  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
    this.limpiarFormulario();
  }

  // Limpiar formulario
  limpiarFormulario(): void {
    this.nuevoEvento = {
      titulo: '',
      descripcion: '',
      fecha: '',
      hora: '',
      lugar: '',
      duracion: 120,
      requisitos: '',
      tipo: 'voluntariado'
    };
  }

  // Crear evento
  crearEvento(): void {
    // Validaciones
    if (!this.nuevoEvento.titulo || this.nuevoEvento.titulo.trim().length < 3) {
      alert('⚠️ El título debe tener al menos 3 caracteres.');
      return;
    }

    if (!this.nuevoEvento.descripcion || this.nuevoEvento.descripcion.trim().length < 10) {
      alert('⚠️ La descripción debe tener al menos 10 caracteres.');
      return;
    }

    if (!this.nuevoEvento.fecha) {
      alert('⚠️ Debes seleccionar una fecha.');
      return;
    }

    if (!this.nuevoEvento.hora) {
      alert('⚠️ Debes seleccionar una hora.');
      return;
    }

    if (!this.nuevoEvento.lugar || this.nuevoEvento.lugar.trim().length < 3) {
      alert('⚠️ El lugar debe tener al menos 3 caracteres.');
      return;
    }

    if (!this.nuevoEvento.duracion || this.nuevoEvento.duracion <= 0) {
      alert('⚠️ La duración debe ser mayor a 0 minutos.');
      return;
    }

    this.creandoEvento = true;

    // Preparar datos para enviar
    const eventoData = {
      titulo: this.nuevoEvento.titulo.trim(),
      descripcion: this.nuevoEvento.descripcion.trim(),
      fecha: this.nuevoEvento.fecha,
      hora: this.nuevoEvento.hora,
      lugar: this.nuevoEvento.lugar.trim(),
      duracion: this.nuevoEvento.duracion,
      requisitos: this.nuevoEvento.requisitos.trim() || null,
      tipo: this.nuevoEvento.tipo === 'limpieza' ? 'Limpieza' : 'Voluntariado'
    };

    this.eventoService.crearEvento(eventoData)
      .subscribe({
        next: (response) => {
          console.log('Evento creado exitosamente:', response);
          alert(`✅ ¡Evento "${response.titulo}" creado exitosamente!`);
          this.cerrarModalCrear();
          this.cargarEventos(); // Recargar eventos
        },
        error: (error) => {
          console.error('Error al crear evento:', error);
          this.creandoEvento = false;
          
          if (error.status === 401) {
            alert('⚠️ No tienes autorización para crear eventos. Debes ser administrador.');
          } else if (error.status === 403) {
            alert('⚠️ No tienes permisos para crear eventos.');
          } else {
            alert(`❌ Error al crear evento: ${error.error?.detail || error.message || 'Error desconocido'}`);
          }
        },
        complete: () => {
          this.creandoEvento = false;
        }
      });
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
          this.aplicarFiltros();
        },
        error: (error) => {
          console.error('Error al cargar eventos:', error);
          this.isLoading = false;
          
          // Ignorar errores de autorización (401) al cargar eventos
          // Los eventos deben ser visibles para todos
          if (error.status === 401) {
            // Si hay error 401, simplemente no mostrar eventos pero no mostrar error
            this.eventos = [];
            this.eventosFiltrados = [];
            this.errorMessage = '';
            return;
          }
          
          if (error.status === 0) {
            this.errorMessage = 'No se pudo conectar con el servidor.';
          } else {
            this.errorMessage = 'Error al cargar eventos: ' + (error.error?.message || error.message || 'Error desconocido');
          }
          
        }
      });
  }

  

  // Método para aplicar filtros
  aplicarFiltros(): void {
    let eventos = [...this.eventos];

    // Filtrar por tipo
    if (this.filtroActivo !== 'todos') {
      eventos = eventos.filter(e => e.tipo === this.filtroActivo);
    }

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      eventos = eventos.filter(e => 
        e.titulo.toLowerCase().includes(termino) ||
        e.descripcion.toLowerCase().includes(termino) ||
        (e.ubicacion && e.ubicacion.toLowerCase().includes(termino)) ||
        (e.organizador && e.organizador.toLowerCase().includes(termino)) ||
        this.getNombreTipo(e.tipo).toLowerCase().includes(termino) ||
        e.tipo.toLowerCase().includes(termino)
      );
    }

    this.eventosFiltrados = eventos;
  }

  // Método para cambiar el filtro
  cambiarFiltro(tipo: string): void {
    this.filtroActivo = tipo;
    this.aplicarFiltros();
  }

  // Método para manejar cambios en la búsqueda
  onSearchChange(): void {
    this.aplicarFiltros();
  }

  // Método para limpiar filtros
  limpiarFiltros(): void {
    this.searchTerm = '';
    this.filtroActivo = 'todos';
    this.aplicarFiltros();
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

  // Obtener color según el tipo de evento
  getColorPorTipo(tipo: string): string {
    const colores: { [key: string]: string } = {
      'limpieza': '#11998e',
      'monitoreo': '#4568dc',
      'educativo': '#f093fb',
      'voluntariado': '#fa709a'
    };
    return colores[tipo] || '#95a5a6';
  }

  // Obtener nombre del tipo de evento
  getNombreTipo(tipo: string): string {
    const nombres: { [key: string]: string } = {
      'limpieza': 'Limpieza',
      'monitoreo': 'Monitoreo',
      'educativo': 'Educativo',
      'voluntariado': 'Voluntariado'
    };
    return nombres[tipo] || 'Evento';
  }

  // Contar eventos por tipo
  contarPorTipo(tipo: string): number {
    if (tipo === 'todos') {
      return this.eventos.length;
    }
    return this.eventos.filter(e => e.tipo === tipo).length;
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
