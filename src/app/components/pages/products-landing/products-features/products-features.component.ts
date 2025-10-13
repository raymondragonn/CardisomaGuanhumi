import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-products-features',
    templateUrl: './products-features.component.html',
    styleUrls: ['./products-features.component.scss']
})
export class ProductsFeaturesComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    sectionTitle: sectionTitleContent[] = [
        {
            title: "Headphone Features",
            paragraphText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]
    singleProductsFeatures: FeaturesContent[] = [
        {
            icon: 'las la-headset',
            title: 'Clear Sound Performance',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-layer-group',
            title: 'Fold Control Metal Design',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-undo-alt',
            title: 'Easy To Control Naturally',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-fingerprint',
            title: 'Touch Sensitive Trackpad',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-sign-language',
            title: 'HD Drivers Deliver Sound',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        },
        {
            icon: 'las la-headphones',
            title: 'Comfortable To Wear',
            paragraph: 'Lorem ipsum dolor sit amet, coectetur adipisicing elit, sed do eiusmod tpor incididunt ut labore et dolore mafasgna aliqua.'
        }
    ]

}
class sectionTitleContent {
    title : string;
    paragraphText : string;
}
class FeaturesContent {
    icon : string;
    title : string;
    paragraph : string;
}