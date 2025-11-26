import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CrearEventoService } from 'src/app/services/crear-evento.service';

@Component({
  selector: 'app-recorrido',
  templateUrl: './recorrido.component.html',
  styleUrls: ['./recorrido.component.scss']
})
export class RecorridoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;

  // Variables para la simulación
  isSimulating = false;
  simulationProgress = 0;
  simulationStatus = '';
  crabMarkers: any[] = []; // Array para múltiples cangrejos
  survivedCount = 0;
  deadCount = 0;
  totalCrabs = 0;
  private map: any = null;
  private migrationRoutes: google.maps.LatLngLiteral[][] = []; // Múltiples rutas
  private routePolylines: google.maps.Polyline[] = []; // Polylines de rutas
  private dangerZones: any[] = [];
  private beachDestination = { lat: 19.094, lng: -96.074 }; // Zona de playa general
  private naturalistaMarkers: google.maps.Marker[] = []; // Marcadores de observaciones de Naturalista

  // Variables para la navegación guía
  activeSection: string = 'informacion-recorrido';
  private observer?: IntersectionObserver;
  private sections: Element[] = [];
  private scrollTimeout?: any;

  // Variables para el carrusel de amenazas
  amenazasImages = [
    { src: 'assets/img/amenazas/Amenaza1.jpeg', alt: 'Amenaza 1 - Cangrejo Azul', caption: 'Pérdida de hábitat y fragmentación' },
    { src: 'assets/img/amenazas/Amenaza2.jpeg', alt: 'Amenaza 2 - Cangrejo Azul', caption: 'Tráfico vehicular y atropellamientos' },
    { src: 'assets/img/amenazas/Amenaza3.jpeg', alt: 'Amenaza 3 - Cangrejo Azul', caption: 'Captura y sobreexplotación' },
    { src: 'assets/img/amenazas/Amenaza4.jpeg', alt: 'Amenaza 4 - Cangrejo Azul', caption: 'Contaminación ambiental' },
    { src: 'assets/img/amenazas/Amenaza5.jpeg', alt: 'Amenaza 5 - Cangrejo Azul', caption: 'Cambio climático' },
    { src: 'assets/img/amenazas/Amenaza6.jpeg', alt: 'Amenaza 6 - Cangrejo Azul', caption: 'Desarrollo urbano' },
    { src: 'assets/img/amenazas/Amenaza7.jpeg', alt: 'Amenaza 7 - Cangrejo Azul', caption: 'Destrucción de manglares' },
    { src: 'assets/img/amenazas/Amenaza8.jpeg', alt: 'Amenaza 8 - Cangrejo Azul', caption: 'Impacto humano' },
    { src: 'assets/img/amenazas/Amenaza9.jpeg', alt: 'Amenaza 9 - Cangrejo Azul', caption: 'Riesgos durante migración' }
  ];
  currentSlide = 0;
  private autoPlayInterval: any;

  constructor(private crearEventoService: CrearEventoService) { }

  ngOnInit(): void {
    // Cargar observaciones de Naturalista
    this.loadNaturalistaObservations();
    this.activeSection = 'por-que-disminuye';
    this.startAutoPlay();
  }

  // Cargar y mostrar observaciones de Naturalista
  loadNaturalistaObservations(): void {
    this.crearEventoService.getObservacionesNaturalista().subscribe({
      next: (response) => {
        console.log('Respuesta de Naturalista:', response);
        
        // La respuesta puede venir como array directo o como objeto con propiedad 'data' o 'results'
        const observaciones = Array.isArray(response) ? response : (response.data || response.results || []);
        console.log('Observaciones de Naturalista recibidas:', observaciones);
        
        // Esperar a que el mapa esté inicializado
        this.waitForMapAndAddMarkers(observaciones);
      },
      error: (error) => {
        console.error('Error al cargar observaciones de Naturalista:', error);
      }
    });
  }

  // Esperar a que el mapa esté listo y agregar marcadores
  private waitForMapAndAddMarkers(observaciones: any[]): void {
    if (this.map) {
      this.addNaturalistaMarkers(observaciones);
    } else {
      // Reintentar después de 500ms
      setTimeout(() => this.waitForMapAndAddMarkers(observaciones), 500);
    }
  }

  // Agregar marcadores de observaciones de Naturalista al mapa
  private addNaturalistaMarkers(observaciones: any[]): void {
    // Limpiar marcadores anteriores si existen
    this.naturalistaMarkers.forEach(marker => marker.setMap(null));
    this.naturalistaMarkers = [];

    // Filtrar observaciones que tengan latitud y longitud válidas
    const validObservations = observaciones.filter(obs => 
      obs.latitud != null && 
      obs.longitud != null && 
      !isNaN(obs.latitud) && 
      !isNaN(obs.longitud)
    );

    console.log(`Creando ${validObservations.length} marcadores de Naturalista`);

    // Crear un marcador por cada observación
    validObservations.forEach((obs, index) => {
      const marker = new google.maps.Marker({
        position: {
          lat: parseFloat(obs.latitud),
          lng: parseFloat(obs.longitud)
        },
        map: this.map,
        title: `Observación Naturalista #${obs.id}`,
        label: {
          text: '📍',
          fontSize: '20px',
          color: '#4CAF50'
        },
        zIndex: 500 + index
      });

      // Agregar información al hacer clic
      marker.addListener('click', () => {
        const infoContent = `
          <div style="padding: 10px; max-width: 300px;">
            <h3 style="margin: 0 0 10px 0; color: #2E7D32;">🌿 Observación Naturalist</h3>
            <p style= "color: black;"><strong>ID:</strong> ${obs.id}</p>
            <p style= "color: black;"><strong>Especie:</strong> ${obs.especie_valida_busqueda || 'N/A'}</p>
            <p style= "color: black;"><strong>Fecha:</strong> ${obs.fecha_colecta || 'N/A'}</p>
            <p style= "color: black;"><strong>Localidad:</strong> ${obs.localidad || 'N/A'}</p>
            <p style= "color: black;"><strong>Municipio:</strong> ${obs.municipio || 'N/A'}</p>
            <p style= "color: black;"><strong>Estado:</strong> ${obs.estado || 'N/A'}</p>
            <p><strong>Colector:</strong> ${obs.colector || 'N/A'}</p>
            ${obs.url_origen ? `<p><a href="${obs.url_origen}" target="_blank">Ver en iNaturalist</a></p>` : ''}
          </div>
        `;

        const infoWindow = new google.maps.InfoWindow({
          content: infoContent
        });

        infoWindow.open(this.map, marker);
      });

      this.naturalistaMarkers.push(marker);
    });

    console.log(`${this.naturalistaMarkers.length} marcadores de Naturalista agregados al mapa`);
  }

  ngAfterViewInit(): void {
    // Configurar navegación guía
    this.setupIntersectionObserver();
    this.setupScrollListener();
    
    // Esperar a que el mapa esté completamente cargado
    setTimeout(() => {
      this.initializeMap();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
    
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    window.removeEventListener('scroll', this.onScroll);
  }

  initializeMap(): void {
    const mapElement = this.mapElement?.nativeElement;
    
    if (!mapElement || !mapElement.innerMap) {
      console.error('Mapa no disponible todavía, reintentando...');
      setTimeout(() => this.initializeMap(), 500);
      return;
    }

    const map = mapElement.innerMap;
    this.map = map; // Guardar referencia al mapa
    console.log('Mapa cargado correctamente');

    // Definir zonas peligrosas para los cangrejos
    this.dangerZones = [
      
      {
        name: 'Zona Urbana',
        description: 'Pérdida de hábitat y fragmentación',
        coordinates: [
          { lat: 19.056427052875378, lng: -96.06238276243816 },
          { lat: 19.043398695375373, lng: -96.06230811592816 },
          { lat: 19.043084525382767, lng: -96.06552675186465 },
          { lat: 19.03981050796922, lng: -96.0632177304321 },
          { lat: 19.040802641276557, lng: -96.05762010271691 },
          { lat: 19.056058136228927, lng: -96.05846943362835 }
          
        ],
        color: '#FF6B00' // Naranja
      },
      {
        name: 'Zona Urbana',
        description: 'Pérdida de hábitat y fragmentación',
        coordinates: [
          { lat: 19.05766402628653, lng: -96.06913976352247 },
          { lat: 19.05240494212599, lng: -96.07891371423212 },
          { lat: 19.046505771024925, lng: -96.07129764874448 },
          { lat: 19.046985711425876, lng: -96.07057835367004},
          { lat: 19.049505375758983, lng: -96.07155151759409 },
          { lat: 19.052104989333728, lng: -96.06655876355198 },
          { lat: 19.056904168917725, lng: -96.06632605043988 },

          
        ],
        color: '#FF6B00' // Naranja
      },
      {
        name: 'Zona Urbana',
        description: 'Pérdida de hábitat y fragmentación',
        coordinates: [
          { lat: 19.06483575721802, lng: -96.07729692814429 },
          { lat: 19.061856748370445, lng: -96.07354729781868 },
          { lat: 19.065066884977156, lng: -96.06830324960943 },
          { lat: 19.06344898389547, lng: -96.06621106457251},
          { lat: 19.061728341613133, lng: -96.06854779071745 },
          { lat: 19.05975086499906, lng: -96.06618389333819 },
          { lat: 19.057644954885745, lng: -96.06593935222979 },
          { lat: 19.060778128520667, lng: -96.06213537943553 },
          { lat: 19.057079950061294, lng: -96.06191800956182 },
          { lat: 19.056925857502975, lng: -96.06083116019168 },
          { lat: 19.06419373397378, lng: -96.06126589993991 },
          { lat: 19.06804583614364, lng: -96.06862930441999 },
          { lat: 19.0665306866363, lng: -96.07104754426786 },
          { lat: 19.0685080823892, lng: -96.07346578411571 },
          { lat: 19.067224061858525, lng: -96.07523191434169 },
          { lat: 19.066736131448636, lng: -96.07471566089094 },

          
        ],
        color: '#FF6B00' // Naranja
      },
      {
        name: 'Zona Urbana',
        description: 'Pérdida de hábitat y fragmentación',
        coordinates: [
          { lat: 19.063352122641078, lng: -96.07651313542245 },
          { lat: 19.061554435206432, lng: -96.07874117663053 },
          { lat: 19.060010331647803, lng: -96.0773975449192 },
          { lat: 19.05747907922958, lng: -96.0816432367354},
          { lat:  19.061368548725, lng: -96.08601956522317},
          { lat: 19.0624489407287, lng: -96.08556233687355 },
          { lat: 19.064455364344298, lng: -96.08781581945276 },
          { lat: 19.068900277870213, lng: -96.08794645612386 },
          { lat: 19.069474750738365, lng: -96.08744376402501 },
          { lat: 19.07093837430675, lng: -96.0892668148936 },
          { lat: 19.07234640503458, lng: -96.08709091547007 },

          
        ],
        color: '#FF6B00' // Naranja
      },
      {
        name: 'Zona Urbana',
        description: 'Pérdida de hábitat y fragmentación',
        coordinates: [
          { lat: 19.071121858898806, lng: -96.08469142169348 },
          { lat: 19.074449229078894, lng: -96.07981669168383 },
          { lat: 19.073007825907723, lng: -96.07802073852253 },
          { lat: 19.071755007359272, lng: -96.07973117010494},
          { lat:  19.070259695403777, lng: -96.07799223132942},
          { lat: 19.071377812822902, lng: -96.07602523500987 },
          { lat: 19.070098039248677, lng: -96.07440032500678 },
          { lat: 19.068535354958286, lng: -96.07676642202905 },
          { lat: 19.06977472646635, lng: -96.07853386799725 },
          { lat: 19.068063852495015, lng: -96.0811707833532 },
        ],
        color: '#FF6B00' // Naranja
      },
      {
        name: 'Zona Urbana',
        description: 'Pérdida de hábitat y fragmentación',
        coordinates: [
          { lat: 19.073124790526066, lng: -96.08638263251561 },
          { lat: 19.076410216839562, lng: -96.08141648998779 },
          { lat: 19.08308917936506, lng: -96.08867469829802 },
          { lat: 19.081717306337524, lng: -96.08989713338215},
          { lat: 19.08500256224339, lng: -96.09818677129476},
          { lat: 19.08326968812851, lng: -96.09944740747481},
          
        ],
        color: '#FF6B00' // Naranja
      },
      {
        name: 'Zona Urbana',
        description: 'Pérdida de hábitat y fragmentación',
        coordinates: [
          { lat: 19.09128476267898, lng: -96.10336173058484 },
          { lat: 19.08377261788327, lng: -96.10096498976563 },
          { lat: 19.077732455328572, lng: -96.09389460434745 },
          { lat: 19.075693850757915, lng: -96.09409433274901},
          { lat: 19.078147723554636, lng: -96.1118701604949},



          { lat: 19.085584623696192, lng: -96.11059189872475},
          { lat: 19.085056124048634, lng: -96.10875439742914},
          { lat: 19.081658586043147, lng: -96.10711662453569},
          { lat: 19.08199834298088, lng: -96.10555874300309},
          { lat: 19.08739660968054, lng: -96.10527912324068},
          { lat: 19.091888739415666, lng: -96.10607803684749},
          
        ],
        color: '#FF6B00' // Naranja
      },{
        name: 'Zona Urbana',
        description: 'Pérdida de hábitat y fragmentación',
        coordinates: [
          { lat: 19.09128476267898, lng: -96.10336173058484 },
          { lat: 19.08377261788327, lng: -96.10096498976563 },
          { lat: 19.077732455328572, lng: -96.09389460434745 },
          { lat: 19.075693850757915, lng: -96.09409433274901},
          { lat: 19.078147723554636, lng: -96.1118701604949},
          { lat: 19.085584623696192, lng: -96.11059189872475},
          { lat: 19.085056124048634, lng: -96.10875439742914},
          { lat: 19.081658586043147, lng: -96.10711662453569},
          { lat: 19.08199834298088, lng: -96.10555874300309},
          { lat: 19.08739660968054, lng: -96.10527912324068},
          { lat: 19.091888739415666, lng: -96.10607803684749},
          
        ],
        color: '#FF6B00' // Naranja
      },
      {
        name: 'Zona Urbana',
        description: 'Pérdida de hábitat y fragmentación',
        coordinates: [
          { lat: 19.08689327653053, lng: -96.10163092280301 },
          { lat: 19.084384139799738, lng: -96.10049124038039 },
          { lat: 19.08897630455367, lng: -96.0941916770987 },
          { lat: 19.090739756656944, lng: -96.0956319351054 },
                
          
        ],
        color: '#FF6B00' // Naranja
      },
      {
        name: 'Zona Urbana',
        description: 'Pérdida de hábitat y fragmentación',
        coordinates: [
          { lat: 19.073969768289672, lng: -96.10055746482854 },
          { lat: 19.066958592356087, lng: -96.10066244093746 },
          { lat: 19.067157025941242, lng: -96.0951686912511 },
          { lat:  19.072382358204365, lng: -96.0872604910665},
          { lat: 19.077144542838397, lng: -96.09285921686124},
          { lat: 19.076284714071306, lng: -96.09355905758525},
          { lat: 19.07545795143342, lng: -96.09261427260765},
          { lat: 19.07344063328381, lng: -96.09369902573046},
          
          
        ],
        color: '#FF6B00' // Naranja
      },
      {
        name: 'Zona Urbana',
        description: 'Pérdida de hábitat y fragmentación',
        coordinates: [
          { lat: 19.093919618786856, lng:-96.10633718323729},
          { lat: 19.093229661811705, lng:-96.10930635549613},
          { lat: 19.091918735634977, lng:-96.11098564144581},
          { lat: 19.090561801114532, lng:-96.1136627639741},
          { lat: 19.08918185629669, lng:-96.11490397532828},
          { lat: 19.086582928995085, lng:-96.11191046559213},
          { lat: 19.086812924206825, lng:-96.10925768054115},
          { lat: 19.083477962369983, lng:-96.1066535704455},
          { lat: 19.08780189997769, lng:-96.10623983332732},
          { lat: 19.091159773629926, lng:-96.1072620073836},
        ],
        color: '#FF6B00' // Naranja
      },
      {
        name: 'Zona Urbana',
        description: 'Pérdida de hábitat y fragmentación',
        coordinates: [
          { lat: 19.06961671703617, lng: -96.09096859676086},
          { lat: 19.067081351679803, lng:-96.09531580663531},
          { lat: 19.066989875367824, lng:-96.10371701254638},
          { lat: 19.0618614567706, lng:-96.10286700870816},
          { lat: 19.056298507270967, lng:-96.10071274286567},
          { lat: 19.059583565100098, lng:-96.094411770939},
          { lat: 19.063608033853768, lng:-96.08763042851663},
          { lat: 19.066261262589265, lng:-96.08775921845839},
          { lat: 19.06917901173206, lng:-96.08835773198672},
          
        ],
        color: '#FF6B00' // Naranja
      },
      {
        name: 'Intersección Peligrosa',
        description: 'Cruce de múltiples vías',
        coordinates: [
          { lat: 19.09133137737392, lng: -96.10314558662726},
          { lat: 19.089702994834283, lng: -96.1029632160979 },
          { lat: 19.083843730855946, lng: -96.1007815632203 },
          { lat: 19.075349508446763, lng: -96.09075488945895},
          { lat: 19.058360378487095, lng: -96.07021700784227},
          { lat: 19.057367415907777, lng: -96.06839238789505},
          { lat: 19.056966343819525, lng: -96.06608889235629},
          { lat: 19.056107939422233, lng: -96.05721861663135},
          { lat: 19.056326566345007, lng: -96.05720452289818},
          { lat: 19.057221481516592, lng: -96.06606598908436},
          { lat: 19.05764812082441, lng: -96.0682427454229},
          { lat: 19.058624082822803, lng: -96.0699247910918},
          { lat: 19.075653544445288, lng: -96.09043335113893},
          { lat: 19.083585725099553, lng: -96.09995785563994},
          { lat: 19.0850779127135, lng: -96.10107170299055},
          { lat: 19.089797022149767, lng: -96.10258744601433},
          { lat: 19.091295669426685, lng: -96.10280850223819},
        ],
        color: '#D50000' // Rojo oscuro
      },
      {
        name: 'Zona Costera',
        description: 'Alta actividad humana y captura',
        coordinates: [
          { lat: 19.094096205057156, lng: -96.09807237007502 },
          { lat: 19.093549441652755, lng: -96.09767787328232 },
          { lat: 19.092617454415745, lng: -96.09757267413778 },
          { lat: 19.090716181344845, lng: -96.09561334194746 },
          { lat: 19.082965722326747, lng: -96.08927193291434 },
          { lat: 19.08339431729749, lng: -96.08862225305037 },
          { lat: 19.094188748627815, lng: -96.09790150188135 },
        ],
        color: '#C41C00' // Rojo medio
      },
      {
        name: 'Zona Costera',
        description: 'Alta actividad humana y captura',
        coordinates: [
          { lat: 19.07609433030133, lng: -96.08137920796338 },
          { lat: 19.07305422679903, lng: -96.0778491703296 },
          { lat: 19.073409566450323, lng: -96.07738963880344 },
          { lat: 19.070307509097077, lng: -96.07277062149731 },
          { lat: 19.068017486224264, lng: -96.06844684759076 },
          { lat: 19.065194391479267, lng: -96.06322491266097 },
          { lat: 19.064520029683692, lng: -96.06227427800616 },
          { lat: 19.063881175203804, lng: -96.05996230069061},
          { lat: 19.063037832786364, lng: -96.05757997548777},
          { lat: 19.060634638375078, lng: -96.05065275183438},
          { lat: 19.06121995870268, lng: -96.05034960592768},
          { lat: 19.064039673691425, lng: -96.05982479543378},
          { lat: 19.068302867426112, lng: -96.0683385635137},
          { lat: 19.0735833160811, lng: -96.07714784436524},
          { lat: 19.076411942092136, lng:  -96.08115030087217},
        ],
        color: '#C41C00' // Rojo medio
      },
      {
        name: 'Zona Donde vive el cangrejo azul',
        description: 'habitad natural de la especie',
        coordinates: [
          //Esto va abajo
          { lat:19.092295667613058,lng:-96.10341459679574},
          { lat:19.093108251719556,lng:-96.10593309908037},
          { lat:19.091711214485898,lng:-96.10711156961352},
          { lat:19.08843217331335,lng:-96.10660740129931},
          { lat:19.08480974622995,lng:-96.1060439326823},
          { lat:19.083240233311543,lng:-96.10657775795633},
          { lat:19.08671556334751,lng:-96.10900962864953},
          { lat:19.08646332410669,lng:-96.11322091692294},
          { lat:19.08503396114733,lng:-96.11618661289015},
          { lat:19.082050728786953,lng:-96.11181322379647},//cruzado derecha abajo


          { lat:19.07731237029438,lng:-96.11088317945885},
          { lat:19.071546956682894,lng:-96.11104266585043},
          { lat:19.06743944816408,lng:-96.11088317945885},
          { lat:19.063520262579843,lng:-96.11020536229373},
          { lat:19.059544505260604,lng:-96.10821187047188},
          { lat:19.057547144468387,lng:-96.10446394026462},
          { lat:19.0555497596216847,lng:-96.10159318521215},
          { lat:19.053929222168065,lng:-96.09944011892291},
          { lat:19.050085093268777,lng:-96.09868255856199},
          { lat:19.048200683827588,lng:-96.0983237141804},
          { lat:19.052760917904493,lng:-96.09656936387084},
          { lat:19.058489298782675,lng:-96.09413719639576},
          { lat:19.06029822006245,lng:-96.09118669814751},
          { lat:19.060825818386107,lng:-96.08735902474449},
          { lat:19.058526996617957,lng:-96.08418311421408},
          { lat:19.0560773848255,lng:-96.0814718455536},
          { lat:19.05227099318475,lng:-96.0793985224601},
          { lat:19.05018418609528,lng:-96.07777406490406},
          { lat:19.048224401001406,lng:-96.07514253943971},
          { lat:19.04664148075952,lng:-96.07095602165508},
          { lat:19.041241933877444,lng:-96.06873710931927},
          { lat:19.033614388227505,lng:-96.0609101880089},
          { lat:19.02516151799709,lng:-96.05659808970695},
          { lat:19.017536630214835,lng: -96.05196663259314},
          { lat:19.008551329258594,lng:-96.04741404139553},
          { lat:18.999415404436803,lng:-96.04254290440673},
          { lat:18.99498207643275,lng:-96.04038163035511},
          { lat:18.989998673894192,lng:-96.04525259803358},
          { lat:18.98660056685418,lng:-96.05339747409553},
          { lat:18.98629863726974,lng:-96.0613828826781},
          { lat:18.98607282140236,lng:-96.06968727102384},
          { lat:18.98977216921452,lng:-96.07575636980086},
          { lat:18.995888681121315,lng:-96.07695283357016},
          { lat:18.998531522277347,lng:-96.08086328271506},
          { lat:19.001852923927956,lng:-96.0877319234314},
          { lat:19.009848281530154,lng:-96.09290675725005},
          { lat:19.02064513730714,lng:-96.09035102211114},
          { lat:19.0355941390941,lng:-96.08156510524009},
          { lat:19.041860499917846,lng:-96.07813079809887},
          { lat:19.042766457312396,lng:-96.08587791478142},
          { lat:19.043521073147218,lng: -96.09530239956912},
          { lat:19.045492425740804,lng:-96.10504791343403},
          { lat:19.0535695699620224,lng:-96.10904133706319},
          { lat:19.056136374071073,lng:-96.11945862037565},
          { lat:19.06551355095567,lng:-96.11929223040009},
          { lat:19.07358945947047,lng:-96.1184937955488},
          { lat:19.082269360090436,lng:-96.11617711317766},
          { lat:19.08576265753088,lng:-96.11037384879423},

          { lat:19.08503396114733,lng:-96.10862408817381},//arriba a la izquierda
          { lat:19.081810842533415,lng:-96.10725986802869},
          { lat:19.082119143548994,lng:-96.10551010740828},
          { lat:19.087332146542465,lng:-96.10524319477103},
          { lat:19.09156408741427,lng:-96.10619221748063},
          { lat:19.091339881340616,lng:-96.1032561784728},


        ],
        color: '#0045c4ff' // Rojo medio
      }
    ];

    // Crear y dibujar los polígonos de zonas peligrosas
    this.dangerZones.forEach((zone) => {
      const polygon = new google.maps.Polygon({
        paths: zone.coordinates,
        strokeColor: zone.color,
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: zone.color,
        fillOpacity: 0.35,
        map: map
      });

      // Agregar evento click para mostrar información
      polygon.addListener('click', () => {
        alert(`⚠️ ZONA PELIGROSA\n\n${zone.name}\n${zone.description}\n\nEsta área representa un peligro significativo para los cangrejos durante su migración.`);
      });
    });

    // ===== GENERAR MÚLTIPLES RUTAS DE MIGRACIÓN =====
    this.generateMigrationRoutes();

    console.log('Zonas peligrosas dibujadas:', this.dangerZones.length);
    console.log('Rutas de migración generadas:', this.migrationRoutes.length);
  }

  // Generar múltiples rutas desde la zona azul hacia la playa
  private generateMigrationRoutes(): void {
    // Puntos de inicio distribuidos en la zona azul (hábitat natural)
    const baseStartingPoints = [
      { lat: 19.055731354770252, lng: -96.09025361340882 },
      { lat: 19.050085093268777, lng: -96.09868255856199 },
      { lat: 19.045492425740804, lng: -96.10504791343403 },
      { lat: 19.0535695699620224, lng: -96.10904133706319 },
      { lat: 19.06551355095567, lng: -96.11929223040009 },
      { lat: 19.07358945947047, lng: -96.1184937955488 },
      { lat: 19.082269360090436, lng: -96.11617711317766 },
      { lat: 19.08576265753088, lng: -96.11037384879423 },
      { lat: 19.091339881340616, lng: -96.1032561784728 },
      { lat: 19.058489298782675, lng: -96.09413719639576 },
      { lat: 19.06029822006245, lng: -96.09118669814751 },
      { lat: 19.042766457312396, lng: -96.08587791478142 },
      { lat: 19.0355941390941, lng: -96.08156510524009 },
      { lat: 19.02064513730714, lng: -96.09035102211114 },
      { lat: 19.009848281530154, lng: -96.09290675725005 },
      { lat: 19.048200683827588, lng: -96.0983237141804 },
      { lat: 19.052760917904493, lng: -96.09656936387084 },
      { lat: 19.060825818386107, lng: -96.08735902474449 },
      { lat: 19.058526996617957, lng: -96.08418311421408 },
      { lat: 19.0560773848255, lng: -96.0814718455536 }
    ];

    // Puntos de destino en la zona de playa (expandidos para mejor distribución)
    const beachPoints = [
      // Zona norte de la playa (más arriba)
      { lat: 19.094096205057156, lng: -96.09807237007502 },
      { lat: 19.093549441652755, lng: -96.09767787328232 },
      { lat: 19.094188748627815, lng: -96.09790150188135 },
      { lat: 19.092617454415745, lng: -96.09757267413778 },
      { lat: 19.091500000000000, lng: -96.09650000000000 },
      
      // Zona centro-norte
      { lat: 19.090716181344845, lng: -96.09561334194746 },
      { lat: 19.089500000000000, lng: -96.09450000000000 },
      { lat: 19.088000000000000, lng: -96.09350000000000 },
      
      // Zona centro
      { lat: 19.086000000000000, lng: -96.09200000000000 },
      { lat: 19.084500000000000, lng: -96.09050000000000 },
      { lat: 19.08339431729749, lng: -96.08862225305037 },
      { lat: 19.082965722326747, lng: -96.08927193291434 },
      { lat: 19.082000000000000, lng: -96.08800000000000 },
      
      // Zona centro-sur
      { lat: 19.080000000000000, lng: -96.08600000000000 },
      { lat: 19.078500000000000, lng: -96.08450000000000 },
      { lat: 19.077000000000000, lng: -96.08300000000000 },
      { lat: 19.076411942092136, lng: -96.08115030087217 },
      { lat: 19.075500000000000, lng: -96.08000000000000 },
      
      // Zona sur
      { lat: 19.074000000000000, lng: -96.07850000000000 },
      { lat: 19.0735833160811, lng: -96.07714784436524 },
      { lat: 19.072500000000000, lng: -96.07600000000000 },
      { lat: 19.071500000000000, lng: -96.07500000000000 },
      { lat: 19.070931486907376, lng: -96.07456789815195 },
      { lat: 19.070000000000000, lng: -96.07400000000000 },
      
      // Puntos adicionales para extender hacia la derecha (este) - EXTENDIDOS
      { lat: 19.094500000000000, lng: -96.09950000000000 },
      { lat: 19.093000000000000, lng: -96.09900000000000 },
      { lat: 19.091000000000000, lng: -96.09800000000000 },
      { lat: 19.089000000000000, lng: -96.09700000000000 },
      { lat: 19.087000000000000, lng: -96.09600000000000 },
      { lat: 19.085000000000000, lng: -96.09500000000000 },
      { lat: 19.083000000000000, lng: -96.09400000000000 },
      { lat: 19.081000000000000, lng: -96.09300000000000 },
      { lat: 19.079000000000000, lng: -96.09200000000000 },
      { lat: 19.077000000000000, lng: -96.09100000000000 }
    ];

    // Generar 100 rutas usando los puntos base con variación
    const totalRoutes = 100;
    for (let i = 0; i < totalRoutes; i++) {
      // Seleccionar punto de inicio base y agregar variación aleatoria
      const baseStart = baseStartingPoints[i % baseStartingPoints.length];
      const startPoint = {
        lat: baseStart.lat + (Math.random() - 0.5) * 0.003, // Variación de ~300m
        lng: baseStart.lng + (Math.random() - 0.5) * 0.003
      };
      
      // Seleccionar punto de destino con variación para mejor distribución
      const baseEnd = beachPoints[i % beachPoints.length];
      const endPoint = {
        lat: baseEnd.lat + (Math.random() - 0.5) * 0.002, // Variación de ~200m en playa
        lng: baseEnd.lng + (Math.random() - 0.5) * 0.002
      };
      
      // Crear ruta
      const route = this.createRoute(startPoint, endPoint);
      this.migrationRoutes.push(route);
    }

    console.log(`Generadas ${this.migrationRoutes.length} rutas de migración`);
  }

  // Crear una ruta interpolada desde un punto de inicio hasta la playa
  private createRoute(start: google.maps.LatLngLiteral, end: google.maps.LatLngLiteral): google.maps.LatLngLiteral[] {
    const route: google.maps.LatLngLiteral[] = [];
    const steps = 15 + Math.floor(Math.random() * 10); // 15-25 puntos por ruta
    
    // Agregar variación aleatoria a la ruta para que no sean líneas rectas
    const variance = 0.002; // Variación en grados
    
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      
      // Interpolación básica
      let lat = start.lat + (end.lat - start.lat) * ratio;
      let lng = start.lng + (end.lng - start.lng) * ratio;
      
      // Agregar variación aleatoria (excepto en inicio y fin)
      if (i > 0 && i < steps) {
        lat += (Math.random() - 0.5) * variance;
        lng += (Math.random() - 0.5) * variance;
      }
      
      route.push({ lat, lng });
    }
    
    return route;
  }

  // ===== SIMULACIÓN DE MIGRACIÓN MÚLTIPLE =====
  startMigrationSimulation(): void {
    if (this.isSimulating) {
      alert('Ya hay una simulación en curso. Por favor espera a que termine.');
      return;
    }

    // Resetear valores
    this.isSimulating = true;
    this.simulationProgress = 0;
    this.simulationStatus = 'Iniciando migración masiva... 🦀';
    this.survivedCount = 0;
    this.deadCount = 0;

    // Limpiar marcadores anteriores
    this.crabMarkers.forEach(marker => marker.setMap(null));
    this.crabMarkers = [];

    // Limpiar polylines anteriores
    this.routePolylines.forEach(polyline => polyline.setMap(null));
    this.routePolylines = [];

    // Dibujar todas las rutas con polylines (SIN iconos de flechas)
    this.migrationRoutes.forEach((route) => {
      const polyline = new google.maps.Polyline({
        path: route,
        geodesic: true,
        strokeColor: '#00E5FF',
        strokeOpacity: 0.6,
        strokeWeight: 3,
        map: this.map
      });
      this.routePolylines.push(polyline);
    });

    // Crear un cangrejo por cada ruta
    this.totalCrabs = this.migrationRoutes.length;
    
    this.migrationRoutes.forEach((route, index) => {
      // Determinar si este cangrejo sobrevivirá (5% de probabilidad)
      const willSurvive = Math.random() < 0.05;
      
      // Punto donde será capturado (si no sobrevive)
      let capturePoint = -1;
      if (!willSurvive) {
        capturePoint = Math.floor(route.length * (0.2 + Math.random() * 0.7));
      }

      // Crear marcador del cangrejo
      const marker = new google.maps.Marker({
        position: route[0],
        map: this.map,
        title: `Cangrejo #${index + 1}`,
        label: {
          text: '🦀',
          fontSize: '24px' // Más pequeño para 100 cangrejos
        },
        animation: google.maps.Animation.DROP,
        zIndex: 1000 + index
      });

      this.crabMarkers.push(marker);

      // Iniciar animación con delay escalonado
      setTimeout(() => {
        this.animateCrab(marker, route, 0, willSurvive, capturePoint, index);
      }, index * 50); // 50ms de delay entre cada cangrejo (más rápido para 100)
    });

    console.log(`Simulación iniciada con ${this.totalCrabs} cangrejos`);
  }

  private animateCrab(
    marker: google.maps.Marker, 
    route: google.maps.LatLngLiteral[], 
    currentStep: number, 
    willSurvive: boolean, 
    capturePoint: number,
    crabIndex: number
  ): void {
    if (!this.isSimulating) return; // Detener si se canceló la simulación

    if (currentStep >= route.length) {
      // Llegó al final
      this.survivedCount++;
      marker.setLabel({
        text: '✅',
        fontSize: '24px' // Más pequeño para 100 cangrejos
      });
      marker.setAnimation(google.maps.Animation.BOUNCE);
      
      this.updateSimulationProgress();
      return;
    }

    // Actualizar posición del cangrejo
    marker.setPosition(route[currentStep]);

    // Verificar si fue capturado en este punto
    if (!willSurvive && currentStep === capturePoint) {
      this.handleCrabCapture(marker, route[currentStep]);
      return;
    }

    // Actualizar progreso global
    const progress = (currentStep / route.length) * 100;
    this.updateSimulationProgress();

    // Continuar animación
    setTimeout(() => {
      this.animateCrab(marker, route, currentStep + 1, willSurvive, capturePoint, crabIndex);
    }, 100); // Velocidad de animación (un poco más lento para visualizar mejor)
  }

  private handleCrabCapture(marker: google.maps.Marker, position: google.maps.LatLngLiteral): void {
    marker.setAnimation(null);
    this.deadCount++;

    // Determinar causa de captura
    const isInDangerZone = this.isPointInPolygon(position, this.dangerZones);
    let captureIcon = '';

    if (isInDangerZone) {
      // Probabilidades ajustadas: Zona Urbana (40%) > Atropellado (30%) > Capturado (20%)
      const random = Math.random();
      if (random < 0.40) {
        captureIcon = '🏢'; // Zona urbana - PRINCIPAL CAUSA (40%)
      } else if (random < 0.70) {
        captureIcon = '�'; // Atropellado - SEGUNDA CAUSA (30%)
      } else {
        captureIcon = '👤'; // Capturado por humanos - TERCERA CAUSA (20%)
      }
    } else {
      // Si no está en zona peligrosa, es depredador (la causa MENOS común - 10%)
      captureIcon = '🦅'; // Depredador natural
    }

    marker.setLabel({
      text: captureIcon,
      fontSize: '24px' // Más pequeño para 100 cangrejos
    });

    this.updateSimulationProgress();
  }

  private updateSimulationProgress(): void {
    const completed = this.survivedCount + this.deadCount;
    this.simulationProgress = Math.round((completed / this.totalCrabs) * 100);
    
    this.simulationStatus = `Cangrejos: ${this.survivedCount} ✅ sobrevivieron | ${this.deadCount} ❌ murieron | ${this.totalCrabs - completed} 🦀 en camino`;

    // Verificar si todos terminaron
    if (completed >= this.totalCrabs) {
      setTimeout(() => {
        this.finishMultipleSimulation();
      }, 2000);
    }
  }

  private finishMultipleSimulation(): void {
    const survivalRate = ((this.survivedCount / this.totalCrabs) * 100).toFixed(1);
    
    this.simulationStatus = `� Simulación completada: ${survivalRate}% de supervivencia`;
    
    alert(
      `� SIMULACIÓN COMPLETADA\n\n` +
      `Total de cangrejos: ${this.totalCrabs}\n` +
      `✅ Sobrevivieron: ${this.survivedCount}\n` +
      `❌ Murieron: ${this.deadCount}\n\n` +
      `📊 Tasa de supervivencia: ${survivalRate}%\n\n` +
      `La tasa real de supervivencia en la naturaleza es aproximadamente del 5%.`
    );

    setTimeout(() => {
      this.resetSimulation();
    }, 3000);
  }

  private resetSimulation(): void {
    this.isSimulating = false;
    this.simulationProgress = 0;
    this.simulationStatus = '';
    this.survivedCount = 0;
    this.deadCount = 0;
    this.totalCrabs = 0;
    
    // Limpiar marcadores
    this.crabMarkers.forEach(marker => marker.setMap(null));
    this.crabMarkers = [];

    // Limpiar polylines
    this.routePolylines.forEach(polyline => polyline.setMap(null));
    this.routePolylines = [];
  }

  private isPointInPolygon(point: google.maps.LatLngLiteral, zones: any[]): boolean {
    for (const zone of zones) {
      if (google.maps.geometry.poly.containsLocation(
        new google.maps.LatLng(point.lat, point.lng),
        new google.maps.Polygon({ paths: zone.coordinates })
      )) {
        return true;
      }
    }
    return false;
  }

  // ===== NAVEGACIÓN GUÍA =====
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-10% 0px -70% 0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    };

    this.observer = new IntersectionObserver((entries) => {
      // Encontrar la sección más visible
      let maxRatio = 0;
      let mostVisibleSection: string | null = null;

      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          const id = entry.target.id;
          if (id) {
            mostVisibleSection = id;
          }
        }
      });

      // Si hay una sección visible, actualizar
      if (mostVisibleSection) {
        this.activeSection = mostVisibleSection;
      }
    }, options);

    // Observar todas las secciones
    this.sections = Array.from(document.querySelectorAll('.section-anchor'));
    this.sections.forEach(section => {
      this.observer?.observe(section);
    });
  }

  setupScrollListener() {
    // Usar throttling para mejorar el rendimiento
    this.onScroll = this.throttle(() => {
      this.updateActiveSection();
    }, 100);

    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  onScroll = () => {
    // Esta función será sobrescrita por throttle
  };

  throttle(func: Function, limit: number) {
    let inThrottle: boolean;
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  updateActiveSection() {
    const viewportHeight = window.innerHeight;
    const scrollPosition = window.scrollY + viewportHeight / 3; // Punto de referencia en el tercio superior

    let closestSection: string | null = null;
    let closestDistance = Infinity;

    this.sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionBottom = sectionTop + rect.height;
      const sectionCenter = sectionTop + rect.height / 2;

      // Calcular la distancia desde el punto de referencia hasta el centro de la sección
      const distance = Math.abs(scrollPosition - sectionCenter);

      // Si la sección está visible y es la más cercana
      if (rect.top < viewportHeight && rect.bottom > 0 && distance < closestDistance) {
        closestDistance = distance;
        const id = section.id;
        if (id) {
          closestSection = id;
        }
      }
    });

    if (closestSection) {
      this.activeSection = closestSection;
    }
  }

  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset para compensar cualquier header fijo
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // ===== CARRUSEL DE AMENAZAS =====
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.amenazasImages.length;
    this.resetAutoPlay();
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.amenazasImages.length) % this.amenazasImages.length;
    this.resetAutoPlay();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.resetAutoPlay();
  }

  startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambiar cada 5 segundos
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  resetAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}
