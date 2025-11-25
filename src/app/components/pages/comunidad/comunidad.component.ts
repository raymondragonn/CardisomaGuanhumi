import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrearEventoService } from 'src/app/services/crear-evento.service';

interface Observacion {
  id?: number;
  nombre_observador?: string | null;
  edad?: number | null;
  comunidad?: string;
  frecuencia_observacion?: string;
  fecha_observacion?: string;
  hora_observacion?: string;
  lugar_observacion?: string;
  tipo_habitat?: string;
  tipo_habitat_otro?: string | null;
  cantidad_cangrejos?: string;
  sexo_cangrejos?: string[];
  tamano_cangrejos?: string;
  comportamientos?: string[];
  comportamiento_otro?: string | null;
  mortalidad_atropellamiento?: string;
  cambio_poblacion?: string;
  amenazas_principales?: string[];
  amenaza_otra?: string | null;
  importancia_conservacion?: number;
  acciones_proteccion?: string;
  archivo?: string | null;
  fecha_creacion?: string;
}

@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.component.html',
  styleUrls: ['./comunidad.component.scss']
})
export class ComunidadComponent implements OnInit {
  observaciones: Observacion[] = [];
  observacionSeleccionada: Observacion | null = null;
  mostrarModal: boolean = false;
  cargando: boolean = false;
  error: string | null = null;

  // Estadísticas comunitarias
  totalObservaciones: number = 0;
  objetivoObservaciones: number = 100;
  porcentajeCompletado: number = 0;

  constructor(
    private crearEventoService: CrearEventoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Usar datos de ejemplo para demostración
    // Cambiar a this.cargarObservaciones() cuando el backend esté disponible
    this.cargarObservacionesEjemplo();
    // this.cargarObservaciones();
  }

  cargarObservaciones(): void {
    this.cargando = true;
    this.error = null;

    this.crearEventoService.getObservaciones().subscribe({
      next: (response) => {
        // Si la respuesta es un array, usarlo directamente
        // Si es un objeto con una propiedad, extraerla
        if (Array.isArray(response)) {
          this.observaciones = response;
        } else if (response.results) {
          this.observaciones = response.results;
        } else if (response.data) {
          this.observaciones = response.data;
        } else {
          // Si no hay datos, usar ejemplos
          this.observaciones = this.getObservacionesEjemplo();
        }
        this.calcularEstadisticas();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar observaciones:', error);
        // En caso de error, usar datos de ejemplo para demostración
        this.observaciones = this.getObservacionesEjemplo();
        this.calcularEstadisticas();
        this.cargando = false;
        
        // Si el error es 401, el usuario no está autenticado
        if (error.status === 401) {
          this.error = 'Debe iniciar sesión para ver las observaciones.';
        }
      }
    });
  }

  cargarObservacionesEjemplo(): void {
    this.cargando = true;
    // Simular carga asíncrona
    setTimeout(() => {
      this.observaciones = this.getObservacionesEjemplo();
      this.calcularEstadisticas();
      this.cargando = false;
    }, 500);
  }

  getObservacionesEjemplo(): Observacion[] {
    return [
      {
        id: 1,
        nombre_observador: 'María González',
        edad: 35,
        comunidad: 'Playa del Carmen',
        frecuencia_observacion: 'Frecuentemente (varias veces al mes)',
        fecha_observacion: '2024-01-15',
        hora_observacion: '18:30:00',
        lugar_observacion: 'Carretera Cancún-Tulum, km 45',
        tipo_habitat: 'Carretera',
        tipo_habitat_otro: null,
        cantidad_cangrejos: '21–50',
        sexo_cangrejos: ['Machos', 'Hembras', 'Hembras con huevos (ovígeras)'],
        tamano_cangrejos: 'Medianos (5–10 cm)',
        comportamientos: ['Migrando (movimiento en grupo hacia agua)', 'Cruzando carretera'],
        comportamiento_otro: null,
        mortalidad_atropellamiento: 'Sí, pocos (1–10)',
        cambio_poblacion: 'Menor',
        amenazas_principales: ['Carreteras y atropellamiento', 'Pérdida de manglar/hábitat'],
        amenaza_otra: null,
        importancia_conservacion: 5,
        acciones_proteccion: 'Es urgente construir pasos de fauna en las carreteras principales. También necesitamos proteger más áreas de manglar y crear corredores ecológicos que conecten los hábitats naturales.',
        archivo: null,
        fecha_creacion: '2024-01-15T20:00:00Z'
      },
      {
        id: 2,
        nombre_observador: 'Carlos Ramírez',
        edad: 42,
        comunidad: 'Tulum',
        frecuencia_observacion: 'A veces (cada temporada)',
        fecha_observacion: '2024-01-20',
        hora_observacion: '19:15:00',
        lugar_observacion: 'Manglar de Sian Ka\'an',
        tipo_habitat: 'Manglar',
        tipo_habitat_otro: null,
        cantidad_cangrejos: '6–20',
        sexo_cangrejos: ['Machos', 'Hembras'],
        tamano_cangrejos: 'Grandes (>10 cm)',
        comportamientos: ['Alimentándose', 'Dentro o cerca de madrigueras'],
        comportamiento_otro: null,
        mortalidad_atropellamiento: 'No',
        cambio_poblacion: 'Igual',
        amenazas_principales: ['Pérdida de manglar/hábitat', 'Contaminación'],
        amenaza_otra: null,
        importancia_conservacion: 4,
        acciones_proteccion: 'Debemos proteger los manglares existentes y evitar la construcción en estas zonas. También es importante educar a la comunidad sobre la importancia de no contaminar estos ecosistemas.',
        archivo: null,
        fecha_creacion: '2024-01-20T21:30:00Z'
      },
      {
        id: 3,
        nombre_observador: null,
        edad: null,
        comunidad: 'Cozumel',
        frecuencia_observacion: 'Rara vez (1–2 veces al año)',
        fecha_observacion: '2024-02-05',
        hora_observacion: '20:00:00',
        lugar_observacion: 'Playa San Martín',
        tipo_habitat: 'Playa / costa',
        tipo_habitat_otro: null,
        cantidad_cangrejos: '1–5',
        sexo_cangrejos: ['Hembras con huevos (ovígeras)'],
        tamano_cangrejos: 'Mezcla de tamaños',
        comportamientos: ['Migrando (movimiento en grupo hacia agua)'],
        comportamiento_otro: null,
        mortalidad_atropellamiento: 'No',
        cambio_poblacion: 'Mucho menor',
        amenazas_principales: ['Cambio climático (sequías, inundaciones)', 'Captura excesiva'],
        amenaza_otra: 'Turismo masivo en playas de anidación',
        importancia_conservacion: 5,
        acciones_proteccion: 'Necesitamos regular el turismo en las playas durante la temporada de migración. También debemos implementar programas de monitoreo y protección de las áreas de anidación.',
        archivo: null,
        fecha_creacion: '2024-02-05T22:15:00Z'
      },
      {
        id: 4,
        nombre_observador: 'Ana Martínez',
        edad: 28,
        comunidad: 'Puerto Morelos',
        frecuencia_observacion: 'Muy frecuentemente (casi todos los días)',
        fecha_observacion: '2024-02-10',
        hora_observacion: '17:45:00',
        lugar_observacion: 'Zona urbana, colonia centro',
        tipo_habitat: 'Zona urbana',
        tipo_habitat_otro: null,
        cantidad_cangrejos: 'Más de 50',
        sexo_cangrejos: ['Machos', 'Hembras', 'Hembras con huevos (ovígeras)', 'No sé identificarlo'],
        tamano_cangrejos: 'Mezcla de tamaños',
        comportamientos: ['Cruzando carretera', 'Escondiéndose en vegetación'],
        comportamiento_otro: 'Buscando refugio en jardines',
        mortalidad_atropellamiento: 'Sí, muchos (>10)',
        cambio_poblacion: 'Mayor',
        amenazas_principales: ['Carreteras y atropellamiento', 'Pérdida de manglar/hábitat', 'Contaminación'],
        amenaza_otra: null,
        importancia_conservacion: 5,
        acciones_proteccion: 'Urge implementar medidas de protección en las carreteras urbanas, como reductores de velocidad y señalización durante la temporada de migración. También debemos crear más espacios verdes que sirvan como refugio.',
        archivo: null,
        fecha_creacion: '2024-02-10T19:00:00Z'
      },
      {
        id: 5,
        nombre_observador: 'Roberto Sánchez',
        edad: 55,
        comunidad: 'Felipe Carrillo Puerto',
        frecuencia_observacion: 'A veces (cada temporada)',
        fecha_observacion: '2024-02-18',
        hora_observacion: '18:20:00',
        lugar_observacion: 'Humedal Laguna Chacmochuch',
        tipo_habitat: 'Humedal / laguna',
        tipo_habitat_otro: null,
        cantidad_cangrejos: '6–20',
        sexo_cangrejos: ['Machos', 'Hembras'],
        tamano_cangrejos: 'Medianos (5–10 cm)',
        comportamientos: ['Alimentándose', 'Dentro o cerca de madrigueras'],
        comportamiento_otro: null,
        mortalidad_atropellamiento: 'No',
        cambio_poblacion: 'Menor',
        amenazas_principales: ['Pérdida de manglar/hábitat', 'Cambio climático (sequías, inundaciones)'],
        amenaza_otra: null,
        importancia_conservacion: 4,
        acciones_proteccion: 'Es fundamental proteger los humedales y evitar su desecación. Necesitamos programas de reforestación de manglar y control de la extracción de agua en la zona.',
        archivo: null,
        fecha_creacion: '2024-02-18T20:45:00Z'
      },
      {
        id: 6,
        nombre_observador: 'Laura Fernández',
        edad: 31,
        comunidad: 'Cancún',
        frecuencia_observacion: 'Frecuentemente (varias veces al mes)',
        fecha_observacion: '2024-02-25',
        hora_observacion: '19:30:00',
        lugar_observacion: 'Carretera 307, cerca del aeropuerto',
        tipo_habitat: 'Carretera',
        tipo_habitat_otro: null,
        cantidad_cangrejos: '21–50',
        sexo_cangrejos: ['Hembras con huevos (ovígeras)'],
        tamano_cangrejos: 'Grandes (>10 cm)',
        comportamientos: ['Migrando (movimiento en grupo hacia agua)', 'Cruzando carretera'],
        comportamiento_otro: null,
        mortalidad_atropellamiento: 'Sí, muchos (>10)',
        cambio_poblacion: 'Menor',
        amenazas_principales: ['Carreteras y atropellamiento', 'Pérdida de manglar/hábitat'],
        amenaza_otra: null,
        importancia_conservacion: 5,
        acciones_proteccion: 'Necesitamos pasos de fauna urgentemente en esta carretera. También debemos crear barreras que dirijan a los cangrejos hacia los pasos seguros durante la migración.',
        archivo: null,
        fecha_creacion: '2024-02-25T21:00:00Z'
      }
    ];
  }

  verDetalle(observacion: Observacion): void {
    this.observacionSeleccionada = observacion;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.observacionSeleccionada = null;
  }

  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return 'Fecha no disponible';
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fecha;
    }
  }

  formatearHora(hora: string | undefined): string {
    if (!hora) return 'Hora no disponible';
    // Si la hora viene con segundos, removerlos
    return hora.substring(0, 5);
  }

  irAFormulario(): void {
    this.router.navigate(['/formulario']);
  }

  solicitarTestimonio(): void {
    // Redirigir a formulario o a una página específica de testimonio
    // Por ahora redirige al formulario, pero puedes cambiar esto según tu necesidad
    this.router.navigate(['/formulario']);
  }

  calcularEstadisticas(): void {
    // Total de observaciones
    this.totalObservaciones = this.observaciones.length;

    // Calcular porcentaje completado (máximo 100%)
    this.porcentajeCompletado = Math.min(
      (this.totalObservaciones / this.objetivoObservaciones) * 100,
      100
    );
  }
}
