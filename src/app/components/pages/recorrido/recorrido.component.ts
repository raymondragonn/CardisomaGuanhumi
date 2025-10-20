import { Component, OnInit } from '@angular/core';

// Interface para los marcadores
interface Marcador {
  position: google.maps.LatLngLiteral;
  title: string;
  label?: string;
  options?: google.maps.MarkerOptions;
}

@Component({
  selector: 'app-recorrido',
  templateUrl: './recorrido.component.html',
  styleUrls: ['./recorrido.component.scss']
})
export class RecorridoComponent implements OnInit {
  // Centro del mapa (Veracruz, México) - Centrado entre los 3 puntos
  center: google.maps.LatLngLiteral = {
    lat: 19.063, // Punto medio aproximado del recorrido
    lng: -96.082
  };

  zoom = 13; // Zoom ajustado para ver toda la ruta
  
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 20,
    minZoom: 8,
    streetViewControl: true,
    fullscreenControl: true,
    mapTypeControl: true
  };

  // Array de marcadores - Puedes agregar los puntos que quieras aquí
  markers: Marcador[] = [
    {
      position: { lat: 19.055731354770252, lng: -96.09025361340882, },
      title: 'Punto 1 - Inicio del recorrido',
      label: '1',
      options: {
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        }
      }
    },
    {
      position: { lat: 19.063063986823064, lng: -96.0779088988532   },
      title: 'Punto 2 - Zona intermedia',
      label: '2',
      options: {
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
        }
      }
    },
    {
      position: { lat: 19.070931486907376, lng: -96.07456789815195 ,   },
      title: 'Punto 3 - Destino final',
      label: '3',
      options: {
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
      }
    }
  ];

  // Ruta/línea del recorrido - Array de coordenadas
  // Conecta los 3 puntos: Punto 1 (Manglar) -> Punto 2 (Zona intermedia) -> Punto 3 (Playa/Desove)
  polylinePath: google.maps.LatLngLiteral[] = [
    // Inicio - Punto 1 (Verde - Manglar)
    { lat: 19.055731354770252, lng: -96.09025361340882 },
    
    // Puntos intermedios entre Punto 1 y Punto 2
    { lat: 19.0565, lng: -96.0895 },
    { lat: 19.0575, lng: -96.0885 },
    { lat: 19.0585, lng: -96.0870 },
    { lat: 19.0595, lng: -96.0855 },
    { lat: 19.0605, lng: -96.0835 },
    { lat: 19.0615, lng: -96.0815 },
    { lat: 19.0625, lng: -96.0795 },
    
    // Punto 2 (Amarillo - Zona intermedia)
    { lat: 19.063063986823064, lng: -96.0779088988532 },
    
    // Puntos intermedios entre Punto 2 y Punto 3
    { lat: 19.0640, lng: -96.0770 },
    { lat: 19.0650, lng: -96.0762 },
    { lat: 19.0660, lng: -96.0755 },
    { lat: 19.0670, lng: -96.0750 },
    { lat: 19.0680, lng: -96.0748 },
    { lat: 19.0690, lng: -96.0747 },
    { lat: 19.0700, lng: -96.0746 },
    
    // Punto 3 - Destino final (Rojo - Playa/Desove)
    { lat: 19.070931486907376, lng: -96.07456789815195 }
  ];

  // Opciones de estilo para la línea
  polylineOptions: google.maps.PolylineOptions = {
    strokeColor: '#1e88e5',      // Color azul
    strokeOpacity: 1.0,           // Opacidad total
    strokeWeight: 4,              // Grosor de la línea
    geodesic: true,               // Línea que sigue la curvatura de la Tierra
    icons: [{
      icon: {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 3,
        strokeColor: '#0d47a1'
      },
      offset: '100%',
      repeat: '100px'             // Flechas cada 100px
    }]
  };

  constructor() { }

  ngOnInit(): void {
    console.log('RecorridoComponent inicializado');
    console.log('Marcadores:', this.markers.length);
    console.log('Puntos en la ruta:', this.polylinePath.length);
  }

  // Método para cuando se hace clic en un marcador
  onMarkerClick(marker: Marcador): void {
    console.log('Marcador clickeado:', marker.title);
    // Aquí puedes mostrar un info window o hacer lo que necesites
  }
}
