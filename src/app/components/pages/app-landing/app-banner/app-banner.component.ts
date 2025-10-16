import { Component, OnInit } from '@angular/core';

// Interfaces
class Content {
    title : string;
    subtitle? : string;
    paragraph : string;
    button1 : string;
    button2 : string;
}
class Image {
    img : string;
}
class Stat {
    number : string;
    label : string;
}

@Component({
  selector: 'app-app-banner',
  templateUrl: './app-banner.component.html',
  styleUrls: ['./app-banner.component.scss']
})
export class AppBannerComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    mainBannerContent: Content[] = [
        {
            title: 'Cardisoma Guanhumi',
            subtitle: 'El Cangrejo Azul de las Antillas',
            paragraph: 'Conoce y protege una especie única en peligro. Juntos podemos garantizar su conservación y preservar la biodiversidad de nuestros ecosistemas costeros.',
            button1: 'Aprende Más',
            button2: 'Participa Ahora'
        }
    ]
    bannerImage: Image[] = [
        {
            img: 'assets/img/CangrejoSinFondo.png'
        }
    ]
    
    stats: Stat[] = [
        {
            number: '50%',
            label: 'Reducción poblacional'
        },
        {
            number: '3-5',
            label: 'Países donde habita'
        },
        {
            number: '20+',
            label: 'Años de vida'
        }
    ]

}