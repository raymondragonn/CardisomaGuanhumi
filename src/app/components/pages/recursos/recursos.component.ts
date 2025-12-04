import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

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
  activeSection: string = 'todos';
  private observer?: IntersectionObserver;
  private sections: Element[] = [];
  private scrollTimeout?: any;
  
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
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
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
}
