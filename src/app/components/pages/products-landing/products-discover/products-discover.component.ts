import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-products-discover',
	templateUrl: './products-discover.component.html',
	styleUrls: ['./products-discover.component.scss']
})
export class ProductsDiscoverComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    sectionTitle: sectionTitleContent[] = [
        {
            title: 'More To Discover',
            paragraphText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]
    overviewContent = [
        {
            number: '01',
            title: 'Getting Started Headphone',
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
                },
                {
                    itemIcon: "las la-check",
                    item: "Clear Sound Performance"
                },
                {
                    itemIcon: "las la-check",
                    item: "Fold Control Metal Design"
                },
                {
                    itemIcon: "las la-check",
                    item: "Easy To Control Naturally"
                }
            ],
            img: 'assets/img/overview/overview4.png'
        },
        {
            number: '02',
            title: 'Enjoy Your Every Moment',
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
                },
                {
                    itemIcon: "las la-check",
                    item: "Clear Sound Performance"
                },
                {
                    itemIcon: "las la-check",
                    item: "Fold Control Metal Design"
                },
                {
                    itemIcon: "las la-check",
                    item: "Easy To Control Naturally"
                }
            ],
            img: 'assets/img/overview/overview5.png'
        },
    ];

}
class sectionTitleContent {
    title : string;
    paragraphText : string;
}