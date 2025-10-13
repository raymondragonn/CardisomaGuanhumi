import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-saas-partner',
    templateUrl: './saas-partner.component.html',
    styleUrls: ['./saas-partner.component.scss']
})
export class SaasPartnerComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    partnerItem = [
        {
            img: "assets/img/partner/img1.png"
        },
        {
            img: "assets/img/partner/img2.png"
        },
        {
            img: "assets/img/partner/img3.png"
        },
        {
            img: "assets/img/partner/img4.png"
        },
        {
            img: "assets/img/partner/img5.png"
        },
        {
            img: "assets/img/partner/img6.png"
        }
    ]

}