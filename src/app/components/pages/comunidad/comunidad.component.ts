import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrearEventoService } from 'src/app/services/crear-evento.service';

interface ObservacionNaturalista {
  id: number;
  id_ejemplar: string;
  especie_valida_busqueda: string;
  latitud: number;
  longitud: number;
  localidad: string;
  municipio: string;
  estado: string;
  pais: string;
  fecha_colecta: string;
  colector: string;
  coleccion: string;
  institucion: string;
  proyecto: string;
  url_origen: string;
  url_ejemplar: string;
  created_at: string;
}

interface Estadisticas {
  total_observaciones: number;
  por_estado: { [key: string]: number };
  por_municipio: { [key: string]: number };
  por_anio: { [key: string]: number };
  rango_fechas: {
    fecha_minima: string;
    fecha_maxima: string;
  };
}

@Component({
  selector: 'app-comunidad',
  templateUrl: './comunidad.component.html',
  styleUrls: ['./comunidad.component.scss']
})
export class ComunidadComponent implements OnInit {
  observaciones: ObservacionNaturalista[] = [];
  observacionSeleccionada: ObservacionNaturalista | null = null;
  mostrarModal: boolean = false;
  cargando: boolean = false;
  error: string | null = null;

  // Estadísticas
  estadisticas: Estadisticas | null = null;
  totalObservaciones: number = 0;
  
  // Filtros
  municipioFiltro: string = '';
  municipiosUnicos: string[] = [];
  anioFiltro: string = '';
  aniosUnicos: number[] = [];

  constructor(
    private crearEventoService: CrearEventoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarObservaciones();
    this.cargarEstadisticas();
  }

  cargarObservaciones(): void {
    this.cargando = true;
    this.error = null;

    this.crearEventoService.getObservacionesNaturalista({ limit: 100 }).subscribe({
      next: (response) => {
          this.observaciones = response;
        this.extraerMunicipios();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar observaciones:', error);
        this.error = 'No se pudieron cargar las observaciones. Verifica que el servidor esté activo.';
        this.cargando = false;
      }
    });
  }

  cargarEstadisticas(): void {
    this.crearEventoService.getEstadisticasNaturalista().subscribe({
      next: (response) => {
        this.estadisticas = response;
        this.totalObservaciones = response.total_observaciones;
        // Extraer años de las estadísticas
        if (response.por_anio) {
          this.aniosUnicos = Object.keys(response.por_anio)
            .map(key => parseInt(key))
            .sort((a, b) => b - a); // Ordenar de más reciente a más antiguo
        }
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });
  }

  extraerMunicipios(): void {
    const municipios = new Set<string>();
    this.observaciones.forEach(obs => {
      if (obs.municipio) {
        municipios.add(obs.municipio);
      }
    });
    this.municipiosUnicos = Array.from(municipios).sort();
  }

  filtrarObservaciones(): void {
    this.cargando = true;
    
    const params: any = { limit: 100 };
    
    if (this.municipioFiltro) {
      params.municipio = this.municipioFiltro;
    }
    
    if (this.anioFiltro) {
      // Calcular fecha_inicio y fecha_fin para el año seleccionado
      params.fecha_inicio = `${this.anioFiltro}-01-01`;
      params.fecha_fin = `${this.anioFiltro}-12-31`;
    }

    this.crearEventoService.getObservacionesNaturalista(params).subscribe({
      next: (response) => {
        this.observaciones = response;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al filtrar:', error);
        this.cargando = false;
      }
    });
  }

  filtrarPorMunicipio(): void {
    this.filtrarObservaciones();
  }

  filtrarPorAnio(): void {
    this.filtrarObservaciones();
  }

  limpiarFiltros(): void {
    this.municipioFiltro = '';
    this.anioFiltro = '';
    this.cargarObservaciones();
  }

  verDetalle(observacion: ObservacionNaturalista): void {
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
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fecha;
    }
  }

  abrirEnlaceOriginal(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  irAFormulario(): void {
    this.router.navigate(['/formulario']);
  }
}
