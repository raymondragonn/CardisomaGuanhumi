import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-products-banner',
    templateUrl: './products-banner.component.html',
    styleUrls: ['./products-banner.component.scss']
})
export class ProductsBannerComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    bannerContent: Content[] = [
        {
            title: 'Enjoy Every Single Beat On Headphone!',
            paragraph: 'We passion to work hard and deliver excellent results. It could solve the needs of your customers and develop innovation.',
            buttonText: 'Buy Now for $19.50',
            buttonLink: '#'
        }
    ]
    bannerImage: Image[] = [
        {
            img: 'assets/img/headphone-banner.png'
        }
    ]

}
class Content {
    title : string;
    paragraph : string;
    buttonText : string;
    buttonLink : string;
}
class Image {
    img : string;
}