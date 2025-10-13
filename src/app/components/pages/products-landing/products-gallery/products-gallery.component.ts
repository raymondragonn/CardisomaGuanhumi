import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-products-gallery',
    templateUrl: './products-gallery.component.html',
    styleUrls: ['./products-gallery.component.scss']
})
export class ProductsGalleryComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    sectionTitle = [
        {
            title: 'Headphone Gallery',
            paragraph: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]
    galleryItem = [
        {
            img: 'assets/img/headphone-gallery/image1.jpg'
        },
        {
            img: 'assets/img/headphone-gallery/image2.jpg'
        },
        {
            img: 'assets/img/headphone-gallery/image3.jpg'
        },
        {
            img: 'assets/img/headphone-gallery/image4.jpg'
        },
        {
            img: 'assets/img/headphone-gallery/image5.jpg'
        },
        {
            img: 'assets/img/headphone-gallery/image6.jpg'
        }
    ]

}