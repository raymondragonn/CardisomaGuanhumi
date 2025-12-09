import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface Recurso {
  id: number;
  titulo: string;
  descripcion: string;
  autor?: string;
  fecha: string;
  fuente?: string;
  enlace: string;
  imagen?: string;
  imagenRelacionada?: boolean;
  categoria: string;
  tipo: 'articulo' | 'investigacion' | 'video' | 'noticia' | 'publicacion';
  plataforma?: string;
  duracion?: string;
  tipoDocumento?: string;
  embedUrl?: string;
  previewType?: 'image' | 'pdf' | 'video' | 'instagram' | 'embed';
}

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss']
})
export class RecursosComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sectionHeader', { static: false }) sectionHeader!: ElementRef;
  @ViewChild('filtersContainer', { static: false }) filtersContainer!: ElementRef;
  @ViewChild('featuredContainer', { static: false }) featuredContainer!: ElementRef;
  @ViewChild('newsGrid', { static: false }) newsGrid!: ElementRef;
  @ViewChild('ctaBox', { static: false }) ctaBox!: ElementRef;
  @ViewChildren('featuredCard') featuredCards!: QueryList<ElementRef>;
  @ViewChildren('newsCard') newsCards!: QueryList<ElementRef>;
  
  activeSection: string = 'todos';
  private observer?: IntersectionObserver;
  private sections: Element[] = [];
  private scrollTimeout?: any;
  private gsapTimeline?: gsap.core.Timeline;
  private gsapContext?: gsap.Context;
  private hoverAnimations: Map<Element, gsap.core.Tween> = new Map();
  
  // Filtros
  searchTerm: string = '';
  filtroActivo: string = 'todos';

  // Todos los recursos combinados
  todosLosRecursos: Recurso[] = [];
  recursosFiltrados: Recurso[] = [];

  // Categorías de filtro
  categorias = [
    { id: 'todos', nombre: 'Todos', icono: 'bi-grid-3x3-gap' },
    { id: 'articulo', nombre: 'Artículos', icono: 'bi-file-text' },
    { id: 'investigacion', nombre: 'Investigaciones', icono: 'bi-journal-text' },
    { id: 'video', nombre: 'Videos', icono: 'bi-play-circle' },
    { id: 'noticia', nombre: 'Noticias', icono: 'bi-newspaper' },
    { id: 'publicacion', nombre: 'Publicaciones', icono: 'bi-share' }
  ];

  ngOnInit() {
    this.inicializarRecursos();
    this.aplicarFiltros();
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
    this.setupScrollListener();
    // Usar requestAnimationFrame para mejor sincronización con el renderizado
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.initGSAPAnimations();
      });
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    if (this.gsapTimeline) {
      this.gsapTimeline.kill();
    }
    if (this.gsapContext) {
      this.gsapContext.kill();
    }
    // Limpiar hover animations
    this.hoverAnimations.forEach(animation => animation.kill());
    this.hoverAnimations.clear();
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    window.removeEventListener('scroll', this.onScroll);
  }

  inicializarRecursos() {
    this.todosLosRecursos = [
      // Artículos
      {
        id: 1,
        titulo: 'Salvamos al Cangrejo Azul de la Riviera Veracruzana',
        descripcion: 'Campaña de activismo y conservación para proteger al cangrejo azul (Cardisoma guanhumi) en la Riviera Veracruzana. Una iniciativa que busca generar conciencia sobre la importancia de preservar esta especie endémica.',
        autor: 'Actívate México',
        fecha: '2024',
        fuente: 'Actívate.org.mx',
        enlace: 'https://activate.org.mx/activacion/salvamos-al-cangrejo-azul-de-la-riviera-veracruzana-68994bd8c1391',
        imagen: 'assets/img/recursos/salvemos_al_cangrejo_azul.png',
        categoria: 'Activismo',
        tipo: 'articulo',
        previewType: 'image'
      },

      // Investigaciones
      {
        id: 2,
        titulo: 'Estudio de Cardisoma guanhumi en la Zona de Poza Rica',
        descripcion: 'Tesis de maestría que analiza las características poblacionales y el estado de conservación del cangrejo azul en la región de Poza Rica, Veracruz.',
        autor: 'Gloria Isabel Aquino Díaz',
        fecha: '2019',
        fuente: 'Universidad Veracruzana - MCA',
        enlace: 'https://www.uv.mx/pozarica/mca/files/2019/05/G03_GLORIA-ISABEL-AQUINO-DIAZ.pdf',
        imagen: 'assets/img/recursos/estudio_de_cardisoma_guanhumi.png',
        categoria: 'Tesis',
        tipo: 'investigacion',
        tipoDocumento: 'PDF',
        previewType: 'image'
      },
      {
        id: 3,
        titulo: 'Biología y Ecología del Cardisoma guanhumi',
        descripcion: 'Investigación doctoral sobre la biología, ecología y comportamiento del cangrejo azul en ecosistemas de manglar mexicanos.',
        autor: 'UNAM',
        fecha: '2013',
        fuente: 'UNAM - Tesis',
        enlace: 'https://tesiunamdocumentos.dgb.unam.mx/ptd2013/Presenciales/0696227/0696227.pdf',
        imagen: 'assets/img/recursos/biologia_y_ecologia_del_cardisoma_guanhumi.png',
        categoria: 'Tesis Doctoral',
        tipo: 'investigacion',
        tipoDocumento: 'PDF',
        previewType: 'image'
      },
      {
        id: 4,
        titulo: 'Population Dynamics of Cardisoma guanhumi',
        descripcion: 'Artículo científico publicado en SciELO sobre la dinámica poblacional del cangrejo azul, incluyendo análisis de densidad y distribución espacial.',
        autor: 'SciELO Chile',
        fecha: '2021',
        fuente: 'Latin American Journal of Aquatic Research',
        enlace: 'https://www.scielo.cl/scielo.php?pid=S0718-560X2021000100136&script=sci_arttext&tlng=en',
        imagen: 'assets/img/cangrejo/ciclo_vida_cardisoma.png',
        categoria: 'Artículo Científico',
        tipo: 'investigacion',
        tipoDocumento: 'Artículo',
        previewType: 'image'
      },
      {
        id: 5,
        titulo: 'Cardisoma guanhumi en Alvarado - Estudio Integral',
        descripcion: 'Libro científico que documenta aspectos biológicos, ecológicos y de conservación del cangrejo azul en la región de Alvarado, Veracruz.',
        autor: 'Google Books',
        fecha: '2015',
        fuente: 'Publicación Académica',
        enlace: 'https://books.google.com.mx/books?hl=es&lr=&id=mRnM8zubAI0C&oi=fnd&pg=PA9&dq=cardisoma+guanhumi+alvarado&ots=qyAAOPtmof&sig=BZPsee3Y56rhCwBihRYBaOMdqSQ&redir_esc=y#v=onepage&q=cardisoma%20guanhumi%20alvarado&f=false',
        imagen: 'assets/img/cangrejo/map_cardisoma.jpg',
        categoria: 'Libro',
        tipo: 'investigacion',
        tipoDocumento: 'Libro',
        previewType: 'image'
      },

      // Videos
      {
        id: 6,
        titulo: 'El Cangrejo Azul en su Hábitat Natural',
        descripcion: 'Video de Instagram mostrando el comportamiento del cangrejo azul en su ambiente natural, capturando momentos únicos de esta especie.',
        plataforma: 'Instagram',
        fecha: '2024',
        enlace: 'https://www.instagram.com/p/DNHK6EDtk79/',
        imagen: 'assets/img/recursos/el_cangrejo_azul_en_su_habitat.png',
        imagenRelacionada: true,
        categoria: 'Documental',
        tipo: 'video',
        duracion: '0:30',
        previewType: 'image'
      },
      {
        id: 7,
        titulo: 'Conservación del Cardisoma guanhumi',
        descripcion: 'Reel educativo sobre las acciones de conservación que se están realizando para proteger al cangrejo azul en Veracruz.',
        plataforma: 'Instagram',
        fecha: '2024',
        enlace: 'https://www.instagram.com/p/DLP2OsZu6gj/',
        imagen: 'assets/img/recursos/conservacion_del_cardisoma_guanhumi.png',
        imagenRelacionada: true,
        categoria: 'Educativo',
        tipo: 'video',
        duracion: '0:45',
        previewType: 'image'
      },
      {
        id: 8,
        titulo: 'Vida del Cangrejo Azul',
        descripcion: 'Reel que muestra aspectos fascinantes de la vida cotidiana del cangrejo azul, incluyendo alimentación y comportamiento social.',
        plataforma: 'Instagram',
        fecha: '2024',
        enlace: 'https://www.instagram.com/reel/C9SAlisud5Y/',
        imagen: 'assets/img/cangrejo/CangrejoAzul1.jpg',
        imagenRelacionada: true,
        categoria: 'Naturaleza',
        tipo: 'video',
        duracion: '0:35',
        previewType: 'image'
      },

      // Noticias
      {
        id: 9,
        titulo: 'Sobreexplotación desdibuja al cangrejo azul en Alvarado',
        descripcion: 'Reportaje sobre la alerta de posible extinción del cangrejo azul debido a la sobreexplotación en la zona de Alvarado, Veracruz.',
        autor: 'Excélsior',
        fecha: '2025',
        fuente: 'Excélsior',
        enlace: 'https://www.excelsior.com.mx/nacional/sobreexplotacion-desdibuja-al-cangrejo-azul-en-alvarado-alertan-de-su-posible-extincion',
        imagen: 'assets/img/recursos/sobreexplotacion_desdibuja.png',
        categoria: 'Alerta Ambiental',
        tipo: 'noticia',
        previewType: 'image'
      },
      {
        id: 10,
        titulo: 'Desarrollos inmobiliarios hunden al cangrejo azul',
        descripcion: 'Earth Mission denuncia que los desarrollos inmobiliarios en Veracruz están destruyendo el hábitat del cangrejo azul.',
        autor: 'Aristegui Noticias',
        fecha: '2025',
        fuente: 'Aristegui Noticias',
        enlace: 'https://aristeguinoticias.com/1208/naturaleza/earth-mission-denuncia-desarrollos-inmobiliarios-hunden-al-cangrejo-azul-en-veracruz/',
        imagen: 'assets/img/recursos/desarrollos_inmobiliarios_hunden_al_cangrejo_azul.png',
        categoria: 'Denuncia',
        tipo: 'noticia',
        previewType: 'image'
      },
      {
        id: 11,
        titulo: 'Cangrejo azul: No se detiene urbanización en Alvarado',
        descripcion: 'La alcaldesa de Alvarado afirma que la urbanización no se detendrá a pesar de las preocupaciones sobre el cangrejo azul.',
        autor: 'e-Veracruz',
        fecha: '2025-09-11',
        fuente: 'e-Veracruz',
        enlace: 'https://e-veracruz.mx/nota/2025-09-11/ecologia/cangrejo-azul-no-detiene-urbanizacion-en-alvarado-afirma-alcaldesa',
        imagen: 'assets/img/recursos/no_se_detiene_urbanizacion_en_alvarado.png',
        categoria: 'Política',
        tipo: 'noticia',
        previewType: 'image'
      },
      {
        id: 12,
        titulo: 'Riviera Veracruzana: El desarrollo que devasta ecosistema del cangrejo azul',
        descripcion: 'Reportaje especial sobre cómo el desarrollo inmobiliario de la Riviera Veracruzana está afectando al ecosistema del cangrejo azul.',
        autor: 'La Silla Rota',
        fecha: '2025-08-13',
        fuente: 'La Silla Rota Veracruz',
        enlace: 'https://lasillarota.com/veracruz/reportajes/2025/8/13/riviera-veracruzana-el-desarrollo-inmobiliario-que-devasta-ecosistema-del-cangrejo-azul-550252.html',
        imagen: 'assets/img/cangrejo/CangrejoAzul2.jpg',
        categoria: 'Reportaje',
        tipo: 'noticia',
        previewType: 'image'
      },
      {
        id: 13,
        titulo: 'Lanzan campaña para salvar al cangrejo azul',
        descripcion: 'Organizaciones lanzan una campaña de conservación para proteger al cangrejo azul en la Riviera Veracruzana.',
        autor: 'Riviera Veracruz Now',
        fecha: '2025-08-15',
        fuente: 'Riviera Veracruz Now',
        enlace: 'https://rivieraveracruznow.com/2025/08/15/lanzan-campana-para-salvar-al-cangrejo-azul-en-la-riviera-veracruzana/',
        imagen: 'assets/img/cangrejo/photo_cardisoma.jpeg',
        categoria: 'Conservación',
        tipo: 'noticia',
        previewType: 'image'
      },
      {
        id: 14,
        titulo: 'Cangrejos azules en Veracruz - CNN en Español',
        descripcion: 'Cobertura de CNN sobre la situación de los cangrejos azules en Veracruz y el llamado a la conservación.',
        autor: 'CNN en Español',
        fecha: '2025-09-25',
        fuente: 'CNN en Español',
        enlace: 'https://cnnespanol.cnn.com/2025/09/25/video/video/cnne-cangrejos-azules-veracruz-cte-llamado-tierra',
        imagen: 'assets/img/cangrejo/text_cardisoma.jpeg',
        categoria: 'Internacional',
        tipo: 'noticia',
        previewType: 'image'
      },

      // Publicaciones de redes sociales
      {
        id: 15,
        titulo: 'Información sobre el Cangrejo Azul',
        descripcion: 'Publicación informativa sobre las características y la importancia ecológica del cangrejo azul en los ecosistemas costeros.',
        plataforma: 'Instagram',
        fecha: '2024',
        enlace: 'https://www.instagram.com/p/DLQe4bJSJSl/?img_index=1',
        imagen: 'assets/img/recursos/informacion_sobre_el_cangrejo_azul.png',
        imagenRelacionada: true,
        categoria: 'Educativo',
        tipo: 'publicacion',
        previewType: 'image'
      },
      {
        id: 16,
        titulo: 'Conservemos al Cardisoma guanhumi',
        descripcion: 'Post de concientización sobre la necesidad de proteger al cangrejo azul y su hábitat natural en Veracruz.',
        plataforma: 'Instagram',
        fecha: '2024',
        enlace: 'https://www.instagram.com/p/DNMWmmltFM_/?img_index=1',
        imagen: 'assets/img/recursos/conservemos_al_cardisoma_guanhumi.png',
        imagenRelacionada: true,
        categoria: 'Conservación',
        tipo: 'publicacion',
        previewType: 'image'
      },
      {
        id: 17,
        titulo: 'Datos curiosos del Cangrejo Azul',
        descripcion: 'Publicación con datos interesantes y curiosidades sobre el cangrejo azul que pocos conocen.',
        plataforma: 'Instagram',
        fecha: '2024',
        enlace: 'https://www.instagram.com/p/DN9ZY8KDcG2/?img_index=1',
        imagen: 'assets/img/cangrejo/hembra_macho_cardisoma.png',
        imagenRelacionada: true,
        categoria: 'Curiosidades',
        tipo: 'publicacion',
        previewType: 'image'
      },
      {
        id: 18,
        titulo: 'Protege al Cangrejo Azul',
        descripcion: 'Llamado a la acción para unirse a los esfuerzos de conservación del cangrejo azul en la costa veracruzana.',
        plataforma: 'Instagram',
        fecha: '2024',
        enlace: 'https://www.instagram.com/p/DNlrzaBBsBk/?img_index=1',
        imagen: 'assets/img/cangrejo/macho_cardisoma.jpg',
        imagenRelacionada: true,
        categoria: 'Activismo',
        tipo: 'publicacion',
        previewType: 'image'
      }
    ];

    this.recursosFiltrados = [...this.todosLosRecursos];
  }

  aplicarFiltros() {
    let recursos = [...this.todosLosRecursos];

    // Filtrar por tipo
    if (this.filtroActivo !== 'todos') {
      recursos = recursos.filter(r => r.tipo === this.filtroActivo);
    } else {
      // Intercalar recursos por tipo cuando se muestra "Todos"
      recursos = this.intercalarPorTipo(recursos);
    }

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase().trim();
      recursos = recursos.filter(r => 
        r.titulo.toLowerCase().includes(termino) ||
        r.descripcion.toLowerCase().includes(termino) ||
        r.categoria.toLowerCase().includes(termino) ||
        (r.autor && r.autor.toLowerCase().includes(termino)) ||
        (r.fuente && r.fuente.toLowerCase().includes(termino)) ||
        this.getNombreTipo(r.tipo).toLowerCase().includes(termino) ||
        r.tipo.toLowerCase().includes(termino)
      );
    }

    this.recursosFiltrados = recursos;
    
    // Animar los cambios de filtro
    setTimeout(() => {
      this.animateFilterChange();
    }, 50);
  }

  // Intercala recursos de diferentes tipos para una distribución uniforme
  private intercalarPorTipo(recursos: Recurso[]): Recurso[] {
    const tipos = ['noticia', 'articulo', 'investigacion', 'video', 'publicacion'];
    const porTipo: { [key: string]: Recurso[] } = {};
    
    // Agrupar por tipo
    tipos.forEach(tipo => {
      porTipo[tipo] = recursos.filter(r => r.tipo === tipo);
    });

    const resultado: Recurso[] = [];
    let tieneRecursos = true;
    let index = 0;

    // Intercalar tomando uno de cada tipo en cada iteración
    while (tieneRecursos) {
      tieneRecursos = false;
      for (const tipo of tipos) {
        if (porTipo[tipo] && porTipo[tipo].length > index) {
          resultado.push(porTipo[tipo][index]);
          tieneRecursos = true;
        }
      }
      index++;
    }

    return resultado;
  }

  cambiarFiltro(filtro: string) {
    this.filtroActivo = filtro;
    this.aplicarFiltros();
  }

  onSearchChange() {
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.searchTerm = '';
    this.filtroActivo = 'todos';
    this.aplicarFiltros();
  }


  getIconoPorTipo(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'articulo': 'bi-file-text',
      'investigacion': 'bi-journal-text',
      'video': 'bi-play-circle',
      'noticia': 'bi-newspaper',
      'publicacion': 'bi-share'
    };
    return iconos[tipo] || 'bi-file';
  }

  getColorPorTipo(tipo: string): string {
    const colores: { [key: string]: string } = {
      'articulo': '#3498db',
      'investigacion': '#e74c3c',
      'video': '#9b59b6',
      'noticia': '#f39c12',
      'publicacion': '#27ae60'
    };
    return colores[tipo] || '#95a5a6';
  }

  getNombreTipo(tipo: string): string {
    const nombres: { [key: string]: string } = {
      'articulo': 'Artículo',
      'investigacion': 'Investigación',
      'video': 'Video',
      'noticia': 'Noticia',
      'publicacion': 'Publicación'
    };
    return nombres[tipo] || 'Recurso';
  }


  contarPorTipo(tipo: string): number {
    if (tipo === 'todos') {
      return this.todosLosRecursos.length;
    }
    return this.todosLosRecursos.filter(r => r.tipo === tipo).length;
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-10% 0px -70% 0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    };

    this.observer = new IntersectionObserver((entries) => {
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

      if (mostVisibleSection) {
        this.activeSection = mostVisibleSection;
      }
    }, options);

    this.sections = Array.from(document.querySelectorAll('.section-anchor'));
    this.sections.forEach(section => {
      this.observer?.observe(section);
    });
  }

  setupScrollListener() {
    this.onScroll = this.throttle(() => {
      this.updateActiveSection();
    }, 100);

    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  onScroll = () => {};

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
    const scrollPosition = window.scrollY + viewportHeight / 3;

    let closestSection: string | null = null;
    let closestDistance = Infinity;

    this.sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionBottom = sectionTop + rect.height;
      const sectionCenter = sectionTop + rect.height / 2;
      const distance = Math.abs(scrollPosition - sectionCenter);

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
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // ==========================================
  // ANIMACIONES GSAP AVANZADAS
  // ==========================================
  initGSAPAnimations() {
    // Crear contexto GSAP para limpieza automática
    this.gsapContext = gsap.context(() => {
      // Timeline principal de entrada
      const masterTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      // Animación del header con efecto cinematográfico
      if (this.sectionHeader?.nativeElement) {
        const title = this.sectionHeader.nativeElement.querySelector('.title');
        const subtitle = this.sectionHeader.nativeElement.querySelector('.subtitle');
        
        if (title) {
          // Animación de título con efecto de revelación
          masterTL.fromTo(title, 
            {
              y: 60,
              opacity: 0,
              scale: 0.9,
              rotationX: -15,
              transformPerspective: 1000
            },
            {
              duration: 1,
              y: 0,
              opacity: 1,
              scale: 1,
              rotationX: 0,
              ease: 'power4.out'
            }
          );
        }
        
        if (subtitle) {
          masterTL.fromTo(subtitle, 
            {
              y: 40,
              opacity: 0,
              filter: 'blur(10px)'
            },
            {
              duration: 0.8,
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              ease: 'power2.out'
            }, '-=0.6'
          );
        }
      }

      // Animación de los filtros con efecto de rebote elegante
      if (this.filtersContainer?.nativeElement) {
        const filterButtons = this.filtersContainer.nativeElement.querySelectorAll('.filter-tabs button');
        
        masterTL.fromTo(filterButtons, 
          {
            y: 30,
            opacity: 0,
            scale: 0.8
          },
          {
            duration: 0.6,
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: {
              amount: 0.4,
              from: 'center'
            },
            ease: 'back.out(1.4)'
          }, '-=0.3'
        );

        // Hover con efecto de elevación y brillo
        filterButtons.forEach((button: Element) => {
          this.setupAdvancedHover(button, 'filter');
        });
      }

      // Animación de las tarjetas destacadas
      this.animateFeaturedCards();
      
      // Animación del grid de noticias
      this.animateNewsGrid();
      
      // Animación del CTA box
      this.animateCTABox();
    });
  }

  animateFeaturedCards() {
    const featuredCards = document.querySelectorAll('.featured-card');
    if (featuredCards.length === 0) return;

    // Animación de entrada con efecto 3D y parallax
    featuredCards.forEach((card: Element, index: number) => {
      const overlay = card.querySelector('.featured-overlay');
      const content = card.querySelector('.featured-content');
      const category = card.querySelector('.news-category');
      const title = card.querySelector('.featured-title');
      const date = card.querySelector('.featured-date');

      const cardTL = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true
        }
      });

      // Entrada de la tarjeta con efecto 3D
      cardTL.fromTo(card, 
        {
          opacity: 0,
          y: 80,
          scale: 0.85,
          rotationY: index === 0 ? -8 : 8,
          transformPerspective: 1200,
          transformOrigin: index === 0 ? 'right center' : 'left center'
        },
        {
          duration: 1,
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          ease: 'power3.out',
          delay: index * 0.15
        }
      );

      // Animación del overlay
      if (overlay) {
        cardTL.fromTo(overlay,
          { opacity: 0 },
          { duration: 0.6, opacity: 1, ease: 'power2.out' },
          '-=0.6'
        );
      }

      // Animación del contenido con stagger
      if (content) {
        const contentElements = [category, title, date].filter(el => el);
        cardTL.fromTo(contentElements,
          {
            y: 30,
            opacity: 0
          },
          {
            duration: 0.5,
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: 'power2.out'
          },
          '-=0.4'
        );
      }

      // Hover avanzado con parallax en imagen
      this.setupAdvancedHover(card, 'featured');
    });
  }

  animateNewsGrid() {
    const newsCards = document.querySelectorAll('.news-card');
    if (newsCards.length === 0) return;

    // Animación con efecto de cascada diagonal
    ScrollTrigger.batch(newsCards, {
      onEnter: (elements) => {
        gsap.fromTo(elements, 
          {
            opacity: 0,
            y: 50,
            scale: 0.9,
            rotationX: 10,
            transformPerspective: 800
          },
          {
            duration: 0.7,
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            stagger: {
              amount: 0.6,
              from: 'start',
              grid: [4, 4],
              axis: 'x'
            },
            ease: 'power2.out'
          }
        );
      },
      start: 'top 90%',
      once: true
    });

    // Hover avanzado para cada tarjeta
    newsCards.forEach((card: Element) => {
      this.setupAdvancedHover(card, 'news');
    });
  }

  animateFilterChange() {
    // Animar salida de elementos actuales con efecto de dispersión
    const featuredCards = document.querySelectorAll('.featured-card');
    const newsCards = document.querySelectorAll('.news-card');
    
    if (featuredCards.length === 0 && newsCards.length === 0) {
      return;
    }
    
    const allCards = [...Array.from(featuredCards), ...Array.from(newsCards)];
    
    // Efecto de salida con dispersión
    const exitTimeline = gsap.timeline({
      onComplete: () => {
        requestAnimationFrame(() => {
          const newFeaturedCards = document.querySelectorAll('.featured-card');
          const newNewsCards = document.querySelectorAll('.news-card');
          const newAllCards = [...Array.from(newFeaturedCards), ...Array.from(newNewsCards)];
          
          if (newAllCards.length > 0) {
            // Estado inicial con efecto de zoom
            gsap.set(newAllCards, { 
              opacity: 0, 
              y: 40, 
              scale: 0.9,
              rotationX: 5,
              transformPerspective: 800
            });
            
            // Entrada con efecto de materialización
            gsap.to(newAllCards, {
              duration: 0.6,
              opacity: 1,
              y: 0,
              scale: 1,
              rotationX: 0,
              stagger: {
                amount: 0.4,
                from: 'start',
                grid: 'auto'
              },
              ease: 'power2.out'
            });
          }
        });
      }
    });
    
    // Animación de salida con efecto de elevación y desvanecimiento
    exitTimeline.to(allCards, {
      duration: 0.3,
      opacity: 0,
      y: -25,
      scale: 0.95,
      stagger: {
        amount: 0.15,
        from: 'end'
      },
      ease: 'power2.in'
    });
  }

  animateCTABox() {
    const ctaBox = document.querySelector('.cta-box');
    if (!ctaBox) return;

    const ctaTitle = ctaBox.querySelector('h2');
    const ctaText = ctaBox.querySelector('p');
    const ctaButton = ctaBox.querySelector('.btn-primary');

    const ctaTL = gsap.timeline({
      scrollTrigger: {
        trigger: ctaBox,
        start: 'top 85%',
        once: true
      }
    });

    // Animación del contenedor con efecto de expansión
    ctaTL.fromTo(ctaBox,
      {
        opacity: 0,
        y: 60,
        scale: 0.95,
        boxShadow: '0 0 0 rgba(0, 0, 0, 0)'
      },
      {
        duration: 0.9,
        opacity: 1,
        y: 0,
        scale: 1,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        ease: 'power3.out'
      }
    );

    // Animación del título
    if (ctaTitle) {
      ctaTL.fromTo(ctaTitle,
        { y: 30, opacity: 0 },
        { duration: 0.6, y: 0, opacity: 1, ease: 'power2.out' },
        '-=0.5'
      );
    }

    // Animación del texto
    if (ctaText) {
      ctaTL.fromTo(ctaText,
        { y: 20, opacity: 0 },
        { duration: 0.5, y: 0, opacity: 1, ease: 'power2.out' },
        '-=0.3'
      );
    }

    // Animación del botón con efecto de pulso
    if (ctaButton) {
      ctaTL.fromTo(ctaButton,
        { scale: 0.8, opacity: 0 },
        { 
          duration: 0.5, 
          scale: 1, 
          opacity: 1, 
          ease: 'back.out(2)'
        },
        '-=0.2'
      );

      // Hover especial para el botón
      this.setupAdvancedHover(ctaButton, 'cta-button');
    }

    // Animación flotante sutil
    gsap.to(ctaBox, {
      y: -5,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1
    });
  }

  // Sistema avanzado de hover según el tipo de elemento
  private setupAdvancedHover(element: Element, type: 'filter' | 'featured' | 'news' | 'cta-button') {
    let currentTween: gsap.core.Tween | null = null;

    const handleMouseEnter = () => {
      if (currentTween) currentTween.kill();
      
      switch(type) {
        case 'filter':
          currentTween = gsap.to(element, {
            duration: 0.25,
            scale: 1.08,
            y: -2,
            ease: 'power2.out'
          });
          break;
          
        case 'featured':
          const featuredOverlay = element.querySelector('.featured-overlay');
          const featuredContent = element.querySelector('.featured-content');
          
          currentTween = gsap.to(element, {
            duration: 0.4,
            scale: 1.03,
            y: -8,
            ease: 'power2.out'
          });
          
          if (featuredOverlay) {
            gsap.to(featuredOverlay, {
              duration: 0.4,
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.2) 100%)',
              ease: 'power2.out'
            });
          }
          
          if (featuredContent) {
            gsap.to(featuredContent, {
              duration: 0.3,
              y: -5,
              ease: 'power2.out'
            });
          }
          break;
          
        case 'news':
          const newsImage = element.querySelector('.news-image');
          
          currentTween = gsap.to(element, {
            duration: 0.35,
            y: -10,
            scale: 1.02,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            ease: 'power2.out'
          });
          
          if (newsImage) {
            gsap.to(newsImage, {
              duration: 0.4,
              scale: 1.1,
              ease: 'power2.out'
            });
          }
          break;
          
        case 'cta-button':
          currentTween = gsap.to(element, {
            duration: 0.3,
            scale: 1.05,
            y: -3,
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
            ease: 'power2.out'
          });
          break;
      }
      
      if (currentTween) {
        this.hoverAnimations.set(element, currentTween);
      }
    };

    const handleMouseLeave = () => {
      if (currentTween) currentTween.kill();
      
      switch(type) {
        case 'filter':
          currentTween = gsap.to(element, {
            duration: 0.2,
            scale: 1,
            y: 0,
            ease: 'power1.out'
          });
          break;
          
        case 'featured':
          const featuredOverlay = element.querySelector('.featured-overlay');
          const featuredContent = element.querySelector('.featured-content');
          
          currentTween = gsap.to(element, {
            duration: 0.35,
            scale: 1,
            y: 0,
            ease: 'power2.out'
          });
          
          if (featuredOverlay) {
            gsap.to(featuredOverlay, {
              duration: 0.35,
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.1) 100%)',
              ease: 'power2.out'
            });
          }
          
          if (featuredContent) {
            gsap.to(featuredContent, {
              duration: 0.25,
              y: 0,
              ease: 'power2.out'
            });
          }
          break;
          
        case 'news':
          const newsImage = element.querySelector('.news-image');
          
          currentTween = gsap.to(element, {
            duration: 0.3,
            y: 0,
            scale: 1,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            ease: 'power1.out'
          });
          
          if (newsImage) {
            gsap.to(newsImage, {
              duration: 0.35,
              scale: 1,
              ease: 'power2.out'
            });
          }
          break;
          
        case 'cta-button':
          currentTween = gsap.to(element, {
            duration: 0.25,
            scale: 1,
            y: 0,
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            ease: 'power1.out'
          });
          break;
      }
      
      if (currentTween) {
        this.hoverAnimations.set(element, currentTween);
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    element.addEventListener('mouseleave', handleMouseLeave, { passive: true });
  }
}
