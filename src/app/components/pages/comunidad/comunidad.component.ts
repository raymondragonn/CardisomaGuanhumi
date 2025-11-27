import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CrearEventoService } from 'src/app/services/crear-evento.service';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

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
export class ComunidadComponent implements OnInit, OnDestroy {
  @ViewChild('municipioChart') municipioChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('anioChart') anioChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('mesChart') mesChart?: ElementRef<HTMLCanvasElement>;
  
  // Control de vistas
  vistaActual: 'observaciones' | 'graficas' = 'observaciones';
  
  // Charts
  chartMunicipio?: Chart;
  chartAnio?: Chart;
  chartMes?: Chart;
  
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
  
  cambiarVista(vista: 'observaciones' | 'graficas'): void {
    this.vistaActual = vista;
    if (vista === 'graficas') {
      // Esperar a que el DOM se actualice antes de crear las gráficas
      setTimeout(() => {
        this.crearGraficas();
      }, 100);
    }
  }
  
  crearGraficas(): void {
    if (!this.estadisticas) return;
    
    // Destruir gráficas existentes
    this.destruirGraficas();
    
    this.crearGraficaMunicipios();
    this.crearGraficaAnios();
    this.crearGraficaMeses();
  }
  
  destruirGraficas(): void {
    if (this.chartMunicipio) {
      this.chartMunicipio.destroy();
    }
    if (this.chartAnio) {
      this.chartAnio.destroy();
    }
    if (this.chartMes) {
      this.chartMes.destroy();
    }
  }
  
  crearGraficaMunicipios(): void {
    if (!this.municipioChart || !this.estadisticas) return;
    
    const ctx = this.municipioChart.nativeElement.getContext('2d');
    if (!ctx) return;
    
    const municipios = Object.entries(this.estadisticas.por_municipio)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Top 10 municipios
    
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: municipios.map(m => m[0]),
        datasets: [{
          label: 'Observaciones por Municipio',
          data: municipios.map(m => m[1]),
          backgroundColor: 'rgba(39, 174, 96, 0.7)',
          borderColor: 'rgba(39, 174, 96, 1)',
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Top 10 Municipios con más Observaciones',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    };
    
    this.chartMunicipio = new Chart(ctx, config);
  }
  
  crearGraficaAnios(): void {
    if (!this.anioChart || !this.estadisticas) return;
    
    const ctx = this.anioChart.nativeElement.getContext('2d');
    if (!ctx) return;
    
    const anios = Object.entries(this.estadisticas.por_anio)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
    
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: anios.map(a => a[0]),
        datasets: [{
          label: 'Observaciones por Año',
          data: anios.map(a => a[1]),
          backgroundColor: 'rgba(199, 237, 253, 0.3)',
          borderColor: 'rgba(12, 74, 110, 1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(12, 74, 110, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Tendencia de Observaciones por Año',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    };
    
    this.chartAnio = new Chart(ctx, config);
  }
  
  crearGraficaMeses(): void {
    if (!this.mesChart || !this.observaciones || this.observaciones.length === 0) return;
    
    const ctx = this.mesChart.nativeElement.getContext('2d');
    if (!ctx) return;
    
    // Contar observaciones por mes
    const mesesCount: { [key: string]: number } = {};
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    // Inicializar todos los meses en 0
    nombresMeses.forEach(mes => mesesCount[mes] = 0);
    
    this.observaciones.forEach(obs => {
      if (obs.fecha_colecta) {
        const fecha = new Date(obs.fecha_colecta);
        const mes = nombresMeses[fecha.getMonth()];
        mesesCount[mes]++;
      }
    });
    
    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: nombresMeses,
        datasets: [{
          label: 'Observaciones por Mes',
          data: nombresMeses.map(mes => mesesCount[mes]),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(199, 237, 253, 0.7)',
            'rgba(39, 174, 96, 0.7)',
            'rgba(231, 76, 60, 0.7)',
            'rgba(241, 196, 15, 0.7)',
            'rgba(155, 89, 182, 0.7)',
            'rgba(52, 152, 219, 0.7)'
          ],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right'
          },
          title: {
            display: true,
            text: 'Distribución de Observaciones por Mes',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        }
      }
    };
    
    this.chartMes = new Chart(ctx, config);
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
    
    // Preseleccionar "Alvarado" si está disponible
    if (this.municipiosUnicos.includes('Alvarado') && !this.municipioFiltro) {
      this.municipioFiltro = 'Alvarado';
      this.filtrarObservaciones();
    }
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
  
  ngOnDestroy(): void {
    this.destruirGraficas();
  }
}
