import { Component } from '@angular/core';

@Component({
  selector: 'app-sobre-especie',
  templateUrl: './sobre-especie.component.html',
  styleUrl: './sobre-especie.component.scss'
})
export class SobreEspecieComponent {

  // Características principales de la especie
  caracteristicas = [
    {
      titulo: 'Nombre Científico',
      descripcion: 'Cardisoma guanhumi',
      icono: 'bi-book'
    },
    {
      titulo: 'Nombres Comunes',
      descripcion: 'Cangrejo Azul, Blue Land Crab, Juey Azul',
      icono: 'bi-translate'
    },
    {
      titulo: 'Tamaño',
      descripcion: 'Hasta 11 cm de caparazón (machos)',
      icono: 'bi-rulers'
    },
    {
      titulo: 'Peso',
      descripcion: 'Hasta 500 gramos en adultos',
      icono: 'bi-clipboard-data'
    },
    {
      titulo: 'Longevidad',
      descripcion: '10-12 años en promedio',
      icono: 'bi-clock-history'
    },
    {
      titulo: 'Hábitat',
      descripcion: 'Manglares y zonas costeras tropicales',
      icono: 'bi-geo-alt'
    }
  ];

  // Datos sobre su ciclo de vida
  cicloVida = [
    {
      etapa: 'Desove',
      descripcion: 'Las hembras liberan hasta 700,000 huevos en el mar durante luna llena',
      duracion: 'Abril - Octubre',
      icono: 'bi-moon-stars'
    },
    {
      etapa: 'Larvas',
      descripcion: 'Las larvas (zoeas) pasan 3-4 semanas en el océano antes de regresar a tierra',
      duracion: '3-4 semanas',
      icono: 'bi-water'
    },
    {
      etapa: 'Juveniles',
      descripcion: 'Los jóvenes cangrejos migran a manglares donde crecen y se desarrollan',
      duracion: '2-3 años',
      icono: 'bi-bug'
    },
    {
      etapa: 'Adultos',
      descripcion: 'Alcanzan madurez sexual y participan en migraciones reproductivas anuales',
      duracion: '7-9 años',
      icono: 'bi-check-circle'
    }
  ];

  // Estado de conservación
  conservacion = {
    estado: 'Vulnerable',
    tendencia: 'En disminución',
    poblacion: 'Reducción del 40% en las últimas décadas',
    proteccion: 'Especie protegida en varios países del Caribe'
  };

  // Datos ecológicos
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
