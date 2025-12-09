import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { CrearEventoService } from 'src/app/services/crear-evento.service';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  // Campos adicionales para observaciones del formulario
  esFormulario?: boolean;
  datosFormulario?: any; // Datos originales del formulario
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
  styleUrls: ['./comunidad.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(-30px)' }))
      ])
    ])
  ]
})
export class ComunidadComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('municipioChart') municipioChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('anioChart') anioChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('mesChart') mesChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('estacionalidadChart') estacionalidadChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('historialChart') historialChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('municipiosChart') municipiosChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;
  
  // Control de vistas
  vistaActual: 'observaciones' | 'graficas' = 'observaciones';
  chartTabActual: 'estacionalidad' | 'historial' | 'municipios' = 'estacionalidad';
  
  // Charts
  chartMunicipio?: Chart;
  chartAnio?: Chart;
  chartMes?: Chart;
  chartEstacionalidad?: Chart;
  chartHistorial?: Chart;
  chartMunicipios?: Chart;

  // Google Maps
  private map: any = null;
  private observationMarkers: google.maps.Marker[] = [];
  private activeInfoWindow: google.maps.InfoWindow | null = null;
  
  observaciones: ObservacionNaturalista[] = [];
  observacionSeleccionada: ObservacionNaturalista | null = null;
  mostrarModal: boolean = false;
  cargando: boolean = false;
  error: string | null = null;

  // Estadísticas
  estadisticas: Estadisticas | null = null;
  totalObservaciones: number = 0;
  totalObservacionesFormulario: number = 0;
  
  // Filtros
  municipioFiltro: string = '';
  municipiosUnicos: string[] = [];
  anioFiltro: string = '';
  aniosUnicos: number[] = [];

  // Modal de Observación
  mostrarModalObservacion: boolean = false;
  pasoActual: number = 1;
  pasos: string[] = ['Observador', 'Observación', 'Identificación', 'Comportamiento', 'Percepción', 'Finalizar'];
  observacionForm: FormGroup;
  selectedFileModal: File | null = null;
  isSubmittingModal: boolean = false;

  // Modal de Guía Rápida
  mostrarModalGuia: boolean = false;

  constructor(
    private crearEventoService: CrearEventoService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.observacionForm = this.fb.group({
      // Paso 1: Datos del observador
      nombre: [''],
      edad: ['', [Validators.pattern(/^\d+$/)]],
      comunidad: ['', Validators.required],
      frecuenciaObservacion: ['', Validators.required],

      // Paso 2: Observación
      fechaObservacion: ['', Validators.required],
      horaObservacion: ['', Validators.required],
      lugarObservacion: ['', Validators.required],
      tipoHabitat: ['', Validators.required],
      numeroCangrejos: ['', Validators.required],

      // Paso 3: Identificación
      sexoCangrejos: this.fb.group({
        machos: [false],
        hembras: [false],
        hembrasOvigeras: [false],
        noIdentifica: [false]
      }),
      tamanoCangrejos: ['', Validators.required],

      // Paso 4: Comportamientos
      comportamientos: this.fb.group({
        migrando: [false],
        alimentandose: [false],
        escondiendose: [false],
        cruzandoCarretera: [false],
        enMadrigueras: [false]
      }),
      mortalidadAtropellamiento: ['', Validators.required],

      // Paso 5: Percepción
      comparacionCantidad: ['', Validators.required],
      amenazas: this.fb.group({
        perdidaHabitat: [false],
        capturaExcesiva: [false],
        carreteras: [false],
        contaminacion: [false],
        cambioclimatico: [false]
      }),
      importanciaConservacion: [3, Validators.required],

      // Paso 6: Finalizar
      accionesProteccion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarObservaciones();
    this.cargarEstadisticas();
  }

  ngAfterViewInit(): void {
    // Inicializar el mapa después de que la vista esté lista
    setTimeout(() => this.initializeMap(), 500);
  }

  private initializeMap(): void {
    if (this.mapElement && this.mapElement.nativeElement) {
      const mapEl = this.mapElement.nativeElement;
      
      // Esperar a que el componente gmp-map esté listo
      if (mapEl.innerMap) {
        this.map = mapEl.innerMap;
        this.addObservationMarkers();
      } else {
        // Reintentar
        setTimeout(() => this.initializeMap(), 300);
      }
    }
  }

  private addObservationMarkers(): void {
    if (!this.map) return;

    // Limpiar marcadores anteriores
    this.observationMarkers.forEach(marker => marker.setMap(null));
    this.observationMarkers = [];

    // Filtrar observaciones válidas (solo BOCA DEL RIO y ALVARADO)
    // Normalizar los municipios antes de comparar
    const municipiosPermitidos = ['ALVARADO', 'BOCA DEL RIO'];
    const validObservations = this.observaciones.filter(obs => {
      if (!obs.latitud || !obs.longitud || isNaN(obs.latitud) || isNaN(obs.longitud) || !obs.municipio) {
        return false;
      }
      const municipioNormalizado = this.normalizarNombreMunicipio(obs.municipio);
      return municipiosPermitidos.includes(municipioNormalizado);
    });

    // Crear marcadores
    validObservations.forEach((obs, index) => {
      const marker = new google.maps.Marker({
        position: {
          lat: parseFloat(String(obs.latitud)),
          lng: parseFloat(String(obs.longitud))
        },
        map: this.map,
        title: obs.colector || 'Observación',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#0c4a6e',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        },
        zIndex: 100 + index
      });

      // InfoWindow al hacer clic
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 280px; font-family: Arial, sans-serif;">
            <h4 style="margin: 0 0 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">
              ${obs.colector || 'Observador anónimo'}
            </h4>
            <p style="margin: 4px 0; color: #333; font-size: 12px;">
              <strong>Fecha:</strong> ${this.formatearFecha(obs.fecha_colecta)}
            </p>
            <p style="margin: 4px 0; color: #333; font-size: 12px;">
              <strong>Ubicación:</strong> ${obs.municipio || obs.localidad || 'Veracruz'}
            </p>
            ${obs.url_origen ? `<p style="margin: 8px 0 0;"><a href="${obs.url_origen}" target="_blank" style="color: #0c4a6e; font-size: 12px; text-decoration: none;">Ver en iNaturalist →</a></p>` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        // Cerrar el InfoWindow anterior si existe
        if (this.activeInfoWindow) {
          this.activeInfoWindow.close();
        }
        infoWindow.open(this.map, marker);
        this.activeInfoWindow = infoWindow;
      });

      this.observationMarkers.push(marker);
    });

    // Ajustar vista si hay marcadores
    if (validObservations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      validObservations.forEach(obs => {
        bounds.extend({ lat: parseFloat(String(obs.latitud)), lng: parseFloat(String(obs.longitud)) });
      });
      this.map.fitBounds(bounds);
    }
  }

  private updateMapMarkers(): void {
    if (this.map) {
      this.addObservationMarkers();
    } else {
      // Reintentar inicializar
      setTimeout(() => this.initializeMap(), 300);
    }
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

  cambiarChartTab(tab: 'estacionalidad' | 'historial' | 'municipios'): void {
    this.chartTabActual = tab;
    setTimeout(() => {
      this.crearGraficaActual();
    }, 50);
  }

  crearGraficaActual(): void {
    this.destruirGraficasNuevas();
    
    switch (this.chartTabActual) {
      case 'estacionalidad':
        this.crearGraficaEstacionalidad();
        break;
      case 'historial':
        this.crearGraficaHistorial();
        break;
      case 'municipios':
        this.crearGraficaMunicipiosNueva();
        break;
    }
  }

  destruirGraficasNuevas(): void {
    if (this.chartEstacionalidad) {
      this.chartEstacionalidad.destroy();
      this.chartEstacionalidad = undefined;
    }
    if (this.chartHistorial) {
      this.chartHistorial.destroy();
      this.chartHistorial = undefined;
    }
    if (this.chartMunicipios) {
      this.chartMunicipios.destroy();
      this.chartMunicipios = undefined;
    }
  }

  crearGraficaEstacionalidad(): void {
    if (!this.estacionalidadChart || !this.observaciones || this.observaciones.length === 0) return;
    
    const ctx = this.estacionalidadChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const mesesAbrev = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const mesesCount: number[] = new Array(12).fill(0);
    
    this.observaciones.forEach(obs => {
      if (obs.fecha_colecta) {
        const fecha = new Date(obs.fecha_colecta);
        mesesCount[fecha.getMonth()]++;
      }
    });

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: mesesAbrev,
        datasets: [{
          label: 'Observaciones',
          data: mesesCount,
          backgroundColor: 'rgba(125, 211, 252, 0.3)',
          borderColor: '#0c4a6e',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#0c4a6e',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Observaciones por Mes',
            font: { size: 14, weight: 'bold' },
            color: '#0c4a6e',
            padding: { bottom: 15 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    };

    this.chartEstacionalidad = new Chart(ctx, config);
  }

  crearGraficaHistorial(): void {
    if (!this.historialChart || !this.estadisticas) return;
    
    const ctx = this.historialChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const anios = Object.entries(this.estadisticas.por_anio)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: anios.map(a => a[0]),
        datasets: [{
          label: 'Observaciones por año',
          data: anios.map(a => a[1]),
          backgroundColor: '#7dd3fc',
          borderColor: '#0c4a6e',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Tendencia Anual de Observaciones',
            font: { size: 14, weight: 'bold' },
            color: '#0c4a6e',
            padding: { bottom: 15 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    };

    this.chartHistorial = new Chart(ctx, config);
  }

  crearGraficaMunicipiosNueva(): void {
    if (!this.municipiosChart || !this.estadisticas) return;
    
    const ctx = this.municipiosChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const municipios = Object.entries(this.estadisticas.por_municipio)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: municipios.map(m => m[0]),
        datasets: [{
          label: 'Observaciones',
          data: municipios.map(m => m[1]),
          backgroundColor: '#7dd3fc',
          borderColor: '#0c4a6e',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Top Municipios con más Observaciones',
            font: { size: 14, weight: 'bold' },
            color: '#0c4a6e',
            padding: { bottom: 15 }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          y: {
            grid: { display: false }
          }
        }
      }
    };

    this.chartMunicipios = new Chart(ctx, config);
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

    // Cargar observaciones de Naturalista y del formulario en paralelo
    const naturalistaObs$ = this.crearEventoService.getObservacionesNaturalista({ limit: 100 })
      .pipe(catchError(() => of([])));
    
    const formularioObs$ = this.crearEventoService.isAuthenticated() 
      ? this.crearEventoService.getObservaciones().pipe(catchError(() => of([])))
      : of([]);

    // Combinar ambas fuentes usando forkJoin
    forkJoin({
      naturalista: naturalistaObs$,
      formulario: formularioObs$
    }).subscribe({
      next: ({ naturalista, formulario }) => {
        // Normalizar municipios en observaciones de Naturalista
        const naturalistaNormalizado = (naturalista || []).map(obs => ({
          ...obs,
          municipio: this.normalizarNombreMunicipio(obs.municipio)
        }));
        
        // Convertir observaciones del formulario al formato de Naturalista
        const observacionesFormulario = this.convertirObservacionesFormulario(formulario || []);
        this.totalObservacionesFormulario = observacionesFormulario.length;
        
        // Combinar y ordenar por fecha (más recientes primero)
        const todasLasObservaciones = [...naturalistaNormalizado, ...observacionesFormulario];
        this.observaciones = this.ordenarObservacionesPorFecha(todasLasObservaciones);
        
        this.extraerMunicipios();
        this.cargando = false;
        
        // Actualizar marcadores del mapa
        setTimeout(() => {
          this.updateMapMarkers();
        }, 500);
      },
      error: (error) => {
        console.error('Error al cargar observaciones:', error);
        this.error = 'No se pudieron cargar las observaciones. Verifica que el servidor esté activo.';
        this.cargando = false;
      }
    });
  }

  // Función para normalizar nombres de municipios/comunidades
  normalizarNombreMunicipio(nombre: string | null | undefined): string {
    if (!nombre) return '';
    
    const nombreLower = nombre.toLowerCase().trim();
    
    // Normalizar "Boca del Río" / "Boca del Rio" / "boca del rio" -> "BOCA DEL RIO"
    if (nombreLower === 'boca del río' || nombreLower === 'boca del rio' || nombreLower === 'boca del rió') {
      return 'BOCA DEL RIO';
    }
    
    // Normalizar "Alvarado" / "alvarado" -> "ALVARADO"
    if (nombreLower === 'alvarado') {
      return 'ALVARADO';
    }
    
    // Para otros nombres, mantener el formato original
    return nombre.trim();
  }

  convertirObservacionesFormulario(observaciones: any[]): ObservacionNaturalista[] {
    return observaciones.map(obs => {
      const municipioNormalizado = this.normalizarNombreMunicipio(obs.comunidad);
      
      return {
        id: obs.id || 0,
        id_ejemplar: `FORM-${obs.id}`,
        especie_valida_busqueda: 'Cardisoma guanhumi',
        latitud: obs.latitud || 0,
        longitud: obs.longitud || 0,
        localidad: obs.lugar_observacion || '',
        municipio: municipioNormalizado,
        estado: 'Veracruz',
        pais: 'México',
        fecha_colecta: obs.fecha_observacion || obs.created_at || new Date().toISOString(),
        colector: obs.nombre_observador || 'Observador anónimo',
        coleccion: '',
        institucion: '',
        proyecto: 'Observación Comunitaria',
        url_origen: '',
        url_ejemplar: '',
        created_at: obs.created_at || obs.fecha_observacion || new Date().toISOString(),
        esFormulario: true,
        datosFormulario: obs // Guardar los datos originales del formulario
      };
    });
  }

  ordenarObservacionesPorFecha(observaciones: ObservacionNaturalista[]): ObservacionNaturalista[] {
    return observaciones.sort((a, b) => {
      const fechaA = a.fecha_colecta ? new Date(a.fecha_colecta).getTime() : 0;
      const fechaB = b.fecha_colecta ? new Date(b.fecha_colecta).getTime() : 0;
      // Ordenar de más reciente a más antigua (fechaB - fechaA)
      return fechaB - fechaA;
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
        // Crear gráfica inicial después de cargar estadísticas
        setTimeout(() => {
          this.crearGraficaActual();
        }, 300);
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
        // Normalizar el nombre antes de agregarlo al Set
        const municipioNormalizado = this.normalizarNombreMunicipio(obs.municipio);
        if (municipioNormalizado) {
          municipios.add(municipioNormalizado);
        }
      }
    });
    this.municipiosUnicos = Array.from(municipios).sort();
    
    // Preseleccionar "ALVARADO" si está disponible
    if (this.municipiosUnicos.includes('ALVARADO') && !this.municipioFiltro) {
      this.municipioFiltro = 'ALVARADO';
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

    // Cargar observaciones de Naturalista y del formulario
    const naturalistaObs$ = this.crearEventoService.getObservacionesNaturalista(params)
      .pipe(catchError(() => of([])));
    
    const formularioObs$ = this.crearEventoService.isAuthenticated() 
      ? this.crearEventoService.getObservaciones().pipe(catchError(() => of([])))
      : of([]);

    // Combinar ambas fuentes usando forkJoin
    forkJoin({
      naturalista: naturalistaObs$,
      formulario: formularioObs$
    }).subscribe({
      next: ({ naturalista, formulario }) => {
        // Normalizar municipios en observaciones de Naturalista
        const naturalistaNormalizado = (naturalista || []).map(obs => ({
          ...obs,
          municipio: this.normalizarNombreMunicipio(obs.municipio)
        }));
        
        // Convertir observaciones del formulario al formato de Naturalista
        const observacionesFormulario = this.convertirObservacionesFormulario(formulario || []);
        
        // Aplicar filtros a las observaciones del formulario
        let observacionesFiltradas = observacionesFormulario;
        if (this.municipioFiltro) {
          const municipioFiltroNormalizado = this.normalizarNombreMunicipio(this.municipioFiltro);
          observacionesFiltradas = observacionesFiltradas.filter(obs => {
            const municipioObsNormalizado = this.normalizarNombreMunicipio(obs.municipio);
            return municipioObsNormalizado === municipioFiltroNormalizado;
          });
        }
        if (this.anioFiltro) {
          observacionesFiltradas = observacionesFiltradas.filter(obs => {
            if (obs.fecha_colecta) {
              const fecha = new Date(obs.fecha_colecta);
              return fecha.getFullYear().toString() === this.anioFiltro;
            }
            return false;
          });
        }
        
        // Aplicar filtros también a las observaciones de Naturalista
        let naturalistaFiltrado = naturalistaNormalizado;
        if (this.municipioFiltro) {
          const municipioFiltroNormalizado = this.normalizarNombreMunicipio(this.municipioFiltro);
          naturalistaFiltrado = naturalistaFiltrado.filter(obs => {
            const municipioObsNormalizado = this.normalizarNombreMunicipio(obs.municipio);
            return municipioObsNormalizado === municipioFiltroNormalizado;
          });
        }
        if (this.anioFiltro) {
          naturalistaFiltrado = naturalistaFiltrado.filter(obs => {
            if (obs.fecha_colecta) {
              const fecha = new Date(obs.fecha_colecta);
              return fecha.getFullYear().toString() === this.anioFiltro;
            }
            return false;
          });
        }
        
        // Combinar y ordenar por fecha (más recientes primero)
        const todasLasObservaciones = [...naturalistaFiltrado, ...observacionesFiltradas];
        this.observaciones = this.ordenarObservacionesPorFecha(todasLasObservaciones);
        
        this.cargando = false;
        // Actualizar marcadores del mapa
        this.updateMapMarkers();
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
    
    // Si es una observación del formulario y no tiene los datos completos, cargarlos
    if (observacion.esFormulario && !observacion.datosFormulario && observacion.id) {
      this.cargarDatosCompletosFormulario(observacion.id);
    }
  }

  cargarDatosCompletosFormulario(observacionId: number): void {
    this.crearEventoService.getObservacionById(observacionId).subscribe({
      next: (data) => {
        if (this.observacionSeleccionada) {
          this.observacionSeleccionada.datosFormulario = data;
        }
      },
      error: (error) => {
        console.error('Error al cargar datos completos del formulario:', error);
      }
    });
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

  getIniciales(nombre: string | undefined): string {
    if (!nombre || nombre.trim() === '') return '?';
    
    const palabras = nombre.trim().split(/\s+/);
    if (palabras.length === 1) {
      return palabras[0].substring(0, 2).toUpperCase();
    }
    return (palabras[0][0] + palabras[palabras.length - 1][0]).toUpperCase();
  }

  abrirEnlaceOriginal(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  irAFormulario(): void {
    this.router.navigate(['/formulario']);
  }

  // ==========================================
  // MODAL DE OBSERVACIÓN
  // ==========================================
  
  abrirModalObservacion(): void {
    // Verificar autenticación
    if (!this.crearEventoService.isAuthenticated()) {
      alert('Debes iniciar sesión para registrar una observación.');
      return;
    }
    this.mostrarModalObservacion = true;
    this.pasoActual = 1;
    document.body.style.overflow = 'hidden';
    
    // Pre-llenar el nombre del usuario si hay sesión iniciada
    this.crearEventoService.getCurrentUserInfo().subscribe({
      next: (userInfo) => {
        if (userInfo && userInfo.full_name) {
          this.observacionForm.patchValue({
            nombre: userInfo.full_name
          });
        } else if (userInfo && userInfo.username) {
          // Si no hay full_name, usar username como alternativa
          this.observacionForm.patchValue({
            nombre: userInfo.username
          });
        }
      },
      error: (error) => {
        console.error('Error al obtener información del usuario:', error);
        // Si falla, intentar usar el username del localStorage
        const username = this.crearEventoService.getCurrentUsername();
        if (username) {
          this.observacionForm.patchValue({
            nombre: username
          });
        }
      }
    });
  }

  cerrarModalObservacion(): void {
    this.mostrarModalObservacion = false;
    this.pasoActual = 1;
    this.observacionForm.reset({ importanciaConservacion: 3 });
    this.selectedFileModal = null;
    document.body.style.overflow = 'auto';
  }

  pasoSiguiente(): void {
    if (this.puedeAvanzar() && this.pasoActual < 6) {
      this.pasoActual++;
    }
  }

  pasoAnterior(): void {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  irAPaso(paso: number): void {
    // Solo permitir ir a pasos anteriores o al actual
    if (paso <= this.pasoActual) {
      this.pasoActual = paso;
    }
  }

  puedeAvanzar(): boolean {
    switch (this.pasoActual) {
      case 1:
        return this.observacionForm.get('comunidad')?.valid === true && 
               this.observacionForm.get('frecuenciaObservacion')?.valid === true;
      case 2:
        return this.observacionForm.get('fechaObservacion')?.valid === true && 
               this.observacionForm.get('horaObservacion')?.valid === true &&
               this.observacionForm.get('lugarObservacion')?.valid === true &&
               this.observacionForm.get('tipoHabitat')?.valid === true &&
               this.observacionForm.get('numeroCangrejos')?.valid === true;
      case 3:
        return this.observacionForm.get('tamanoCangrejos')?.valid === true;
      case 4:
        return this.observacionForm.get('mortalidadAtropellamiento')?.valid === true;
      case 5:
        return this.observacionForm.get('comparacionCantidad')?.valid === true;
      default:
        return true;
    }
  }

  onFileSelectedModal(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/quicktime'];
      if (validTypes.includes(file.type)) {
        this.selectedFileModal = file;
      } else {
        alert('Formato no válido. Use JPG, PNG, MP4 o MOV.');
        event.target.value = '';
      }
    }
  }

  publicarObservacion(): void {
    if (this.observacionForm.valid) {
      this.isSubmittingModal = true;
      const observacionData = this.prepareObservacionData();
      
      this.crearEventoService.enviarObservacion(observacionData).subscribe({
        next: (response) => {
          if (this.selectedFileModal && response.id) {
            this.subirArchivoObservacion(response.id);
          } else {
            alert('¡Observación publicada con éxito! Gracias por contribuir.');
            this.cerrarModalObservacion();
            this.isSubmittingModal = false;
            // Recargar observaciones y estadísticas después de publicar
            this.cargarObservaciones();
            this.cargarEstadisticas();
          }
        },
        error: (error) => {
          console.error('Error al publicar:', error);
          let msg = 'Error al publicar. Intente nuevamente.';
          if (error.status === 401) msg = 'Sesión expirada. Inicie sesión nuevamente.';
          alert(msg);
          this.isSubmittingModal = false;
        }
      });
    }
  }

  subirArchivoObservacion(observacionId: number): void {
    if (!this.selectedFileModal) return;

    this.crearEventoService.subirFotoObservacion(observacionId, this.selectedFileModal).subscribe({
      next: () => {
        alert('¡Observación y foto publicadas con éxito! Gracias por contribuir.');
        this.cerrarModalObservacion();
        this.isSubmittingModal = false;
        // Recargar observaciones y estadísticas después de publicar
        this.cargarObservaciones();
        this.cargarEstadisticas();
      },
      error: () => {
        alert('Observación guardada, pero hubo un error al subir la foto.');
        this.cerrarModalObservacion();
        this.isSubmittingModal = false;
        // Recargar observaciones y estadísticas aunque haya fallado la foto
        this.cargarObservaciones();
        this.cargarEstadisticas();
      }
    });
  }

  prepareObservacionData(): any {
    const formValue = this.observacionForm.value;
    
    const frecuenciaMap: any = {
      'nunca': 'Nunca',
      'rara-vez': 'Rara vez (1–2 veces al año)',
      'a-veces': 'A veces (cada temporada)',
      'frecuentemente': 'Frecuentemente (varias veces al mes)',
      'muy-frecuentemente': 'Muy frecuentemente (casi todos los días)'
    };

    const cantidadMap: any = {
      '1-5': '1–5',
      '6-20': '6–20',
      '21-50': '21–50',
      'mas-50': 'Más de 50'
    };

    const mortalidadMap: any = {
      'si-muchos': 'Sí, muchos (>10)',
      'si-pocos': 'Sí, pocos (1–10)',
      'no': 'No'
    };

    const comparacionMap: any = {
      'mucho-menor': 'Mucho menor',
      'menor': 'Menor',
      'igual': 'Igual',
      'mayor': 'Mayor',
      'no-se': 'No sé'
    };

    const habitatMap: any = {
      'manglar': 'Manglar',
      'humedal': 'Humedal / laguna',
      'playa': 'Playa / costa',
      'carretera': 'Carretera',
      'zona-urbana': 'Zona urbana',
      'otro': 'Otro'
    };

    const tamanoMap: any = {
      'pequenos': 'Pequeños (<5 cm ancho de caparazón)',
      'medianos': 'Medianos (5–10 cm)',
      'grandes': 'Grandes (>10 cm)',
      'mezcla': 'Mezcla de tamaños'
    };

    // Obtener checkboxes seleccionados
    const sexoCangrejos = this.getSelectedFromGroup(formValue.sexoCangrejos, {
      machos: 'Machos',
      hembras: 'Hembras',
      hembrasOvigeras: 'Hembras con huevos (ovígeras)',
      noIdentifica: 'No sé identificarlo'
    });

    const comportamientos = this.getSelectedFromGroup(formValue.comportamientos, {
      migrando: 'Migrando (movimiento en grupo hacia agua)',
      alimentandose: 'Alimentándose',
      escondiendose: 'Escondiéndose en vegetación',
      cruzandoCarretera: 'Cruzando carretera',
      enMadrigueras: 'Dentro o cerca de madrigueras'
    });

    const amenazas = this.getSelectedFromGroup(formValue.amenazas, {
      perdidaHabitat: 'Pérdida de manglar/hábitat',
      capturaExcesiva: 'Captura excesiva',
      carreteras: 'Carreteras y atropellamiento',
      contaminacion: 'Contaminación',
      cambioclimatico: 'Cambio climático (sequías, inundaciones)'
    });

    return {
      nombre_observador: formValue.nombre || null,
      edad: formValue.edad ? parseInt(formValue.edad) : null,
      comunidad: formValue.comunidad,
      frecuencia_observacion: frecuenciaMap[formValue.frecuenciaObservacion],
      fecha_observacion: formValue.fechaObservacion,
      hora_observacion: formValue.horaObservacion + ':00',
      lugar_observacion: formValue.lugarObservacion,
      tipo_habitat: habitatMap[formValue.tipoHabitat],
      tipo_habitat_otro: null,
      cantidad_cangrejos: cantidadMap[formValue.numeroCangrejos],
      sexo_cangrejos: sexoCangrejos,
      tamano_cangrejos: tamanoMap[formValue.tamanoCangrejos],
      comportamientos: comportamientos,
      comportamiento_otro: null,
      mortalidad_atropellamiento: mortalidadMap[formValue.mortalidadAtropellamiento],
      cambio_poblacion: comparacionMap[formValue.comparacionCantidad],
      amenazas_principales: amenazas,
      amenaza_otra: null,
      importancia_conservacion: formValue.importanciaConservacion,
      acciones_proteccion: formValue.accionesProteccion
    };
  }

  getSelectedFromGroup(group: any, labels: any): string[] {
    const selected: string[] = [];
    for (const key in group) {
      if (group[key]) {
        selected.push(labels[key] || key);
      }
    }
    return selected;
  }

  // ==========================================
  // MODAL DE GUÍA RÁPIDA
  // ==========================================
  
  abrirModalGuia(): void {
    this.mostrarModalGuia = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModalGuia(): void {
    this.mostrarModalGuia = false;
    document.body.style.overflow = 'auto';
  }
  
  ngOnDestroy(): void {
    this.destruirGraficas();
    this.destruirGraficasNuevas();
    
    // Limpiar marcadores del mapa
    this.observationMarkers.forEach(marker => marker.setMap(null));
    this.observationMarkers = [];
  }
}
