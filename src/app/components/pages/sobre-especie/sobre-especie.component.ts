import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-sobre-especie',
  templateUrl: './sobre-especie.component.html',
  styleUrls: ['./sobre-especie.component.scss']
})
export class SobreEspecieComponent implements OnInit, AfterViewInit, OnDestroy {
  activeSection: string = 'descripcion-general';
  private observer?: IntersectionObserver;
  private sections: Element[] = [];
  private scrollTimeout?: any;

  ngOnInit() {
    // Inicializar con la primera sección
    this.activeSection = 'descripcion-general';
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

  seleccionarEtapa(etapa: any) {
    this.etapaSeleccionada = etapa;
  }

  cerrarEtapa() {
    this.etapaSeleccionada = null;
  }


  // Comparación entre macho y hembra
  comparacionMacho = [
    {
      caracteristica: 'Tamaño',
      descripcion: 'Más grandes que las hembras. Aproximadamente 127 mm de ancho y 102 mm de largo, peso promedio de 400 g o más',
      icono: 'bi-rulers'
    },
    {
      caracteristica: 'Quelas (Pinzas)',
      descripcion: 'Una pinza mucho más grande que la otra, ideal para combate. La pinza grande puede alcanzar hasta 300 mm',
      icono: 'bi-hand-index'
    },
    {
      caracteristica: 'Abdomen',
      descripcion: 'Abdomen estrecho y alargado (abanico), se pliega firmemente contra el cuerpo, adaptado para apareamiento',
      icono: 'bi-shapes'
    },
    {
      caracteristica: 'Coloración',
      descripcion: 'Colores más brillantes. Adultos: azul a violeta. Juveniles: canela o marrón con patas anaranjadas',
      icono: 'bi-palette'
    },
    {
      caracteristica: 'Características físicas',
      descripcion: 'Caparazón liso. Cinco pares de apéndices robustos, más largos que el ancho del cefalotórax',
      icono: 'bi-body-text'
    }
  ];

  comparacionHembra = [
    {
      caracteristica: 'Tamaño',
      descripcion: 'Más pequeñas que los machos. Dimensiones menores en ancho y largo, peso promedio menor a 400 g',
      icono: 'bi-rulers'
    },
    {
      caracteristica: 'Quelas (Pinzas)',
      descripcion: 'Pinzas de tamaño uniforme, ideales para alimentación. Más pequeñas que en machos',
      icono: 'bi-hand-index'
    },
    {
      caracteristica: 'Abdomen',
      descripcion: 'Abdomen ancho y redondeado, cubre gran parte del área ventral, perfecto para llevar huevos',
      icono: 'bi-shapes'
    },
    {
      caracteristica: 'Coloración',
      descripcion: 'Tonos más opacos y marrones. Algunas azul a violeta, otras blancas o gris ceniza. Juveniles: canela o marrón',
      icono: 'bi-palette'
    },
    {
      caracteristica: 'Características físicas',
      descripcion: 'Caparazón liso. Cinco pares de apéndices similares a machos pero de menor tamaño',
      icono: 'bi-body-text'
    }
  ];

  // Datos sobre su ciclo de vida
  cicloVida = [
    {
      etapa: 'Huevo',
      descripcion: 'Los huevos son cargados por la hembra bajo el abdomen durante poco más de dos semanas. En este tiempo cambian de color conforme el embrión se desarrolla hasta quedar listo para ser liberado al mar.',
      duracion: 'Abril - Octubre',
      icono: 'bi-moon-stars',
      fuente: 'Barrio Saucedo 2008'
    },
    {
      etapa: 'Zoea',
      descripcion: 'Tras la eclosión, las larvas emergen como zoeas planctónicas que pasan por varios estadios. Son microscópicas, dependen de las corrientes marinas y se alimentan de microplancton.',
      duracion: '1-2 semanas',
      icono: 'bi-water',
      fuente: 'Barrio Saucedo 2008'
    },
    {
      etapa: 'Megalopa / Larva',
      descripcion: 'Después de completar los estadios de zoea, la larva se convierte en megalopa, con una forma más similar a la de un cangrejo. Aunque aún puede nadar, busca un sustrato donde asentarse.',
      duracion: '1-2 semanas',
      icono: 'bi-bug',
      fuente: 'Barrio Saucedo 2008'
    },
    {
      etapa: 'Larva Juvenil',
      descripcion: 'Al asentarse, la megalopa se transforma en un pequeño cangrejo juvenil que empieza a vivir sobre el sustrato, excavar pequeñas madrigueras y alimentarse de materia orgánica.',
      duracion: '2-3 semanas',
      icono: 'bi-tree',
      fuente: 'Barrera Cordero 2023'
    },
    {
      etapa: 'Juvenil',
      descripcion: 'El cangrejo juvenil crece lentamente mediante mudas sucesivas. Su caparazón se fortalece, su dieta se diversifica y construye madrigueras más profundas para protegerse.',
      duracion: '2-3 años',
      icono: 'bi-bug',
      fuente: 'Barrera Cordero 2023'
    },
    {
      etapa: 'Preadulto',
      descripcion: 'En esta etapa el cangrejo tiene casi la apariencia de un adulto pero aún no es sexualmente maduro. Su caparazón se endurece y mejora su capacidad excavadora y actividad terrestre.',
      duracion: '1-2 años',
      icono: 'bi-arrow-up-circle',
      fuente: 'Barrera Cordero 2023'
    },
    {
      etapa: 'Adulto',
      descripcion: 'El cangrejo alcanza la madurez sexual y desarrolla completamente su coloración característica. Vive en madrigueras terrestres y las hembras regresan al mar solo para liberar las larvas.',
      duracion: '7-9 años',
      icono: 'bi-check-circle',
      fuente: 'Barrera Cordero 2023'
    }
  ];

  etapaSeleccionada: any = null;

  // Estado de conservación
  conservacion = {
    estado: 'Vulnerable',
    tendencia: 'En disminución',
    poblacion: 'Reducción del 40% en las últimas décadas',
    proteccion: 'Especie protegida en varios países del Caribe'
  };

  // Descripción general
  descripcionGeneral = {
    nombre: 'Cardisoma guanhumi',
    nombreComun: 'Cangrejo azul terrestre, Juey común, Cangrejo azul gigante',
    importancia: 'Especie clave en los ecosistemas de manglar, esencial para el mantenimiento de la salud de estos hábitats costeros.'
  };

  // Características físicas
  caracteristicasFisicas = {
    color: 'Los adultos presentan coloración azul grisácea, mientras que los jóvenes son anaranjados o marrones. Las patas pueden ser anaranjadas en juveniles.',
    tamano: 'El caparazón puede medir hasta 16 cm de diámetro. Los machos son generalmente más grandes que las hembras.',
    caparazon: 'Caparazón liso y robusto, adaptado para la vida terrestre.',
    quelas: 'Quelas dimórficas: los machos tienen una pinza mucho más grande que la otra, mientras que las hembras tienen pinzas de tamaño más uniforme.',
    ojos: 'Ojos achatados adaptados para la visión en tierra.',
    pedunculos: 'Pedúnculos de colores que van de un azul profundo a un gris pálido.'
  };

  // Ciclos de muda
  ciclosMuda = [
    {
      etapa: 'Frecuencia',
      descripcion: 'Los juveniles mudan más frecuentemente (cada 2-3 meses), mientras que los adultos mudan menos (1-2 veces al año)'
    },
    {
      etapa: 'Proceso',
      descripcion: 'Durante la muda, el cangrejo se desprende de su exoesqueleto viejo y forma uno nuevo más grande'
    },
    {
      etapa: 'Vulnerabilidad',
      descripcion: 'Durante este período, el cangrejo es muy vulnerable a depredadores y permanece escondido en su madriguera'
    }
  ];

  // Distribución y hábitat
  distribucionHabitat = {
    distribucion: 'Costa atlántica desde Florida (EE.UU.) hasta Brasil, incluyendo todo el Caribe, las Antillas y las costas de Centroamérica.',
    habitat: 'Manglares, áreas costeras con suelos arcillosos o arenosos, zonas intermareales y áreas cercanas a estuarios. Prefieren áreas con acceso tanto a tierra como a agua.',
    altitud: 'Desde el nivel del mar hasta aproximadamente 50 metros de altitud.',
    sustrato: 'Construyen madrigueras en suelos húmedos, preferiblemente en áreas con vegetación de manglar.'
  };

  // Comportamiento
  comportamiento = [
    {
      aspecto: 'Actividad',
      descripcion: 'Principalmente nocturnos, evitan la luz directa del sol. Más activos durante la noche y al amanecer.'
    },
    {
      aspecto: 'Madrigueras',
      descripcion: 'Construyen madrigueras profundas (hasta 1.5 metros) que les proporcionan refugio y mantienen la humedad necesaria.'
    },
    {
      aspecto: 'Migración',
      descripcion: 'Realizan migraciones reproductivas anuales hacia el mar para el desove, especialmente durante las lunas llenas.'
    },
    {
      aspecto: 'Territorialidad',
      descripcion: 'Los machos pueden ser territoriales, especialmente durante la época de apareamiento.'
    }
  ];

  // Alimentación
  alimentacion = {
    tipo: 'Omnívoro',
    dieta: 'Hojas, frutas caídas, materia orgánica en descomposición, pequeños invertebrados, carroña y ocasionalmente plantas vivas.',
    importancia: 'Juegan un papel crucial en la descomposición de materia orgánica y el reciclaje de nutrientes en los ecosistemas de manglar.'
  };

  // Papel ecológico
  papelEcologico = {
    rol: 'Ingeniero del ecosistema',
    funciones: [
      'Airea el suelo mediante la construcción de madrigueras',
      'Recicla nutrientes al consumir materia orgánica en descomposición',
      'Mejora la estructura del suelo en manglares',
      'Sirve como presa para diversos depredadores',
      'Contribuye a la dispersión de semillas'
    ]
  };

  // Datos ecológicos (para mantener compatibilidad)
  ecologia = [
    {
      aspecto: 'Rol Ecológico',
      detalle: 'Ingeniero del ecosistema: airea el suelo y recicla nutrientes en manglares',
      importancia: 'Alta'
    },
    {
      aspecto: 'Dieta',
      detalle: 'Omnívoro: hojas, frutas, materia orgánica, pequeños invertebrados',
      importancia: 'Media'
    },
    {
      aspecto: 'Depredadores',
      detalle: 'Mapaches, aves, peces (en estado larval)',
      importancia: 'Media'
    },
    {
      aspecto: 'Distribución',
      detalle: 'Costa atlántica desde Florida hasta Brasil, Caribe',
      importancia: 'Alta'
    }
  ];

}
