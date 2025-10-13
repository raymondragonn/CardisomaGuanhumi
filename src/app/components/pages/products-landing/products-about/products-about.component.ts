import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-products-about',
    templateUrl: './products-about.component.html',
    styleUrls: ['./products-about.component.scss']
})
export class ProductsAboutComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    aboutImage: Image[] = [
        {
            img: 'assets/img/headphone-about.png'
        }
    ]
    aboutContent = [
        {
            subTitle: 'Headphone',
            title: 'Augmented Headphones. Now a Reality',
            paragraph: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            featuresList: [
                {
                    itemIcon: "las la-check",
                    item: "Enjoy Your Own Audio Lounge"
                },
                {
                    itemIcon: "las la-check",
                    item: "Feel The Shape Of Comfort"
                },
                {
                    itemIcon: "las la-check",
                    item: "Transform Your Journey"
                },
                {
                    itemIcon: "las la-check",
                    item: "Hear The World Around You"
                }
            ]
        }
    ];

}
class Image {
    img : string;
}