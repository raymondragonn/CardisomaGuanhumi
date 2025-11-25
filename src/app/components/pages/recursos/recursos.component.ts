import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss']
})
export class RecursosComponent implements OnInit, AfterViewInit, OnDestroy {
  activeSection: string = 'articulos-web';
  private observer?: IntersectionObserver;
  private sections: Element[] = [];
  private scrollTimeout?: any;

  ngOnInit() {
    this.activeSection = 'articulos-web';
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
    this.setupScrollListener();
    this.initCarousels();
  }

  initCarousels() {
    // Esperar a que Angular renderice completamente
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).jQuery) {
        const $ = (window as any).jQuery;
        
        // Inicializar carrusel de artículos
        $('#articulos-carousel').owlCarousel({
          loop: true,
          nav: true,
          dots: true,
          autoplayHoverPause: true,
          autoplay: false,
          smartSpeed: 1000,
          margin: 15,
          navText: [
            "<i class='bi bi-chevron-left'></i>",
            "<i class='bi bi-chevron-right'></i>"
          ],
          responsive: {
            0: {
              items: 1,
              margin: 10
            },
            576: {
              items: 1,
              margin: 15
            },
            768: {
              items: 2,
              margin: 15
            },
            992: {
              items: 2,
              margin: 15
            },
            1200: {
              items: 3,
              margin: 15
            }
          }
        });

        // Inicializar carrusel de investigaciones
        $('#investigaciones-carousel').owlCarousel({
          loop: true,
          nav: true,
          dots: true,
          autoplayHoverPause: true,
          autoplay: false,
          smartSpeed: 1000,
          margin: 15,
          navText: [
            "<i class='bi bi-chevron-left'></i>",
            "<i class='bi bi-chevron-right'></i>"
          ],
          responsive: {
            0: {
              items: 1,
              margin: 10
            },
            576: {
              items: 1,
              margin: 15
            },
            768: {
              items: 2,
              margin: 15
            },
            992: {
              items: 2,
              margin: 15
            },
            1200: {
              items: 3,
              margin: 15
            }
          }
        });

        // Inicializar carrusel de videos
        $('#videos-carousel').owlCarousel({
          loop: true,
          nav: true,
          dots: true,
          autoplayHoverPause: true,
          autoplay: false,
          smartSpeed: 1000,
          margin: 15,
          navText: [
            "<i class='bi bi-chevron-left'></i>",
            "<i class='bi bi-chevron-right'></i>"
          ],
          responsive: {
            0: {
              items: 1,
              margin: 10
            },
            576: {
              items: 1,
              margin: 15
            },
            768: {
              items: 2,
              margin: 15
            },
            992: {
              items: 2,
              margin: 15
            },
            1200: {
              items: 3,
              margin: 15
            }
          }
        });

        // Inicializar carrusel de posts
        $('#posts-carousel').owlCarousel({
          loop: true,
          nav: true,
          dots: true,
          autoplayHoverPause: true,
          autoplay: false,
          smartSpeed: 1000,
          margin: 15,
          navText: [
            "<i class='bi bi-chevron-left'></i>",
            "<i class='bi bi-chevron-right'></i>"
          ],
          responsive: {
            0: {
              items: 1,
              margin: 10
            },
            576: {
              items: 1,
              margin: 15
            },
            768: {
              items: 2,
              margin: 15
            },
            992: {
              items: 2,
              margin: 15
            },
            1200: {
              items: 3,
              margin: 15
            }
          }
        });
      }
    }, 100);
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

  // Datos de recursos
  articulosWeb = [
    {
      titulo: 'Conservación del Cangrejo Azul en el Caribe',
      descripcion: 'Artículo sobre las estrategias de conservación implementadas en diferentes países del Caribe para proteger al Cardisoma guanhumi.',
      autor: 'María González',
      fecha: '2024-01-15',
      fuente: 'Revista de Conservación Marina',
      enlace: '#',
      imagen: 'assets/img/cangrejo/photo_cardisoma.jpeg',
      categoria: 'Conservación'
    },
    {
      titulo: 'El Papel Ecológico del Cangrejo Azul en los Manglares',
      descripcion: 'Investigación sobre cómo el Cardisoma guanhumi contribuye al mantenimiento y salud de los ecosistemas de manglar.',
      autor: 'Dr. Carlos Rodríguez',
      fecha: '2023-11-20',
      fuente: 'Ecología Tropical',
      enlace: '#',
      imagen: 'assets/img/cangrejo/text_cardisoma.jpeg',
      categoria: 'Ecología'
    },
    {
      titulo: 'Migraciones Reproductivas del Cangrejo Azul',
      descripcion: 'Estudio detallado sobre los patrones migratorios del cangrejo azul durante la época de reproducción.',
      autor: 'Ana Martínez',
      fecha: '2023-09-10',
      fuente: 'Biología Marina',
      enlace: '#',
      imagen: 'assets/img/cangrejo/map_cardisoma.jpg',
      categoria: 'Biología'
    }
  ];

  investigaciones = [
    {
      titulo: 'Estado Poblacional del Cardisoma guanhumi en la Costa Caribe',
      descripcion: 'Investigación sobre el estado actual de las poblaciones de cangrejo azul y las tendencias de declive observadas.',
      autor: 'Instituto de Ciencias Marinas',
      fecha: '2024-02-01',
      tipo: 'Estudio Científico',
      enlace: '#',
      imagen: 'assets/img/cangrejo/map_ubicaction_cardisoma.jpeg',
      categoria: 'Investigación'
    },
    {
      titulo: 'Impacto del Cambio Climático en el Hábitat del Cangrejo Azul',
      descripcion: 'Análisis de cómo el cambio climático afecta los manglares y el hábitat del Cardisoma guanhumi.',
      autor: 'Universidad del Caribe',
      fecha: '2023-12-15',
      tipo: 'Investigación',
      enlace: '#',
      imagen: 'assets/img/cangrejo/photo_cardisoma.jpeg',
      categoria: 'Cambio Climático'
    },
    {
      titulo: 'Genética Poblacional del Cardisoma guanhumi',
      descripcion: 'Estudio genético para entender la diversidad y conectividad entre poblaciones del cangrejo azul.',
      autor: 'Laboratorio de Genética Marina',
      fecha: '2023-10-05',
      tipo: 'Genética',
      enlace: '#',
      imagen: 'assets/img/cangrejo/hembra_macho_cardisoma.png',
      categoria: 'Genética'
    }
  ];

  reelsVideos = [
    {
      titulo: 'Ciclo de Vida del Cangrejo Azul',
      descripcion: 'Video educativo que muestra las diferentes etapas del ciclo de vida del Cardisoma guanhumi.',
      plataforma: 'YouTube',
      duracion: '5:30',
      fecha: '2024-01-20',
      enlace: '#',
      imagen: 'assets/img/cangrejo/ciclo_vida_cardisoma.png',
      categoria: 'Educativo'
    },
    {
      titulo: 'Conservación en Acción: Protegiendo los Manglares',
      descripcion: 'Reel de Instagram mostrando las actividades de conservación realizadas en los manglares.',
      plataforma: 'Instagram',
      duracion: '0:45',
      fecha: '2024-02-10',
      enlace: '#',
      imagen: 'assets/img/cangrejo/photo_cardisoma.jpeg',
      categoria: 'Conservación'
    },
    {
      titulo: 'Diferencias entre Macho y Hembra',
      descripcion: 'Video corto explicando las diferencias físicas entre machos y hembras del cangrejo azul.',
      plataforma: 'TikTok',
      duracion: '1:15',
      fecha: '2024-01-25',
      enlace: '#',
      imagen: 'assets/img/cangrejo/hembra_macho_cardisoma.png',
      categoria: 'Educativo'
    }
  ];

  postsRedes = [
    {
      titulo: 'Día Mundial de los Manglares',
      descripcion: 'Post sobre la importancia de los manglares y el papel del cangrejo azul en estos ecosistemas.',
      plataforma: 'Facebook',
      fecha: '2024-07-26',
      enlace: '#',
      imagen: 'assets/img/cangrejo/photo_cardisoma.jpeg',
      categoria: 'Awareness'
    },
    {
      titulo: 'Curiosidades del Cangrejo Azul',
      descripcion: 'Post con datos curiosos e interesantes sobre el Cardisoma guanhumi.',
      plataforma: 'Instagram',
      fecha: '2024-02-15',
      enlace: '#',
      imagen: 'assets/img/cangrejo/text_cardisoma.jpeg',
      categoria: 'Educativo'
    },
    {
      titulo: 'Llamado a la Acción: Protejamos al Cangrejo Azul',
      descripcion: 'Post invitando a la comunidad a participar en actividades de conservación.',
      plataforma: 'Twitter',
      fecha: '2024-02-20',
      enlace: '#',
      imagen: 'assets/img/cangrejo/map_cardisoma.jpg',
      categoria: 'Conservación'
    }
  ];
}
