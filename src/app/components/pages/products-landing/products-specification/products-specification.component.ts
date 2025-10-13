import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-products-specification',
    templateUrl: './products-specification.component.html',
    styleUrls: ['./products-specification.component.scss']
})
export class ProductsSpecificationComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    specificationImage: Image[] = [
        {
            img: 'assets/img/specification.png'
        }
    ]
    specificationContent: Content[] = [
        {
            title: 'Wearing Style :',
            subText: 'Headband'
        },
        {
            title: 'Bluetooth Version :',
            subText: '4.5'
        },
        {
            title: 'Ear Coupling :',
            subText: 'Circumaural'
        },
        {
            title: 'Charging Time :',
            subText: '3 hours (full charge)'
        },
        {
            title: 'Impedance :',
            subText: 'Active 490 Ω / Passive 46 Ω'
        },
        {
            title: 'Contact Pressure :',
            subText: '3 N'
        },
        {
            title: 'Type :',
            subText: 'Wireless, Bluetooth'
        },
        {
            title: 'Battery :',
            subText: '1000mAh'
        },
        {
            title: 'Transducer Principle :',
            subText: 'Dynamic Closed'
        },
        {
            title: 'Operating Time :',
            subText: 'Up to 30 hours'
        }
    ]

}
class Image {
    img : string;
}
class Content {
    title : string;
    subText : string;
}