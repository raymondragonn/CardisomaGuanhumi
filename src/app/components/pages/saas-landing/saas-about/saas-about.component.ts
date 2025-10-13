import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-saas-about',
    templateUrl: './saas-about.component.html',
    styleUrls: ['./saas-about.component.scss']
})
export class SaasAboutComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    aboutImage = [
        {
            img: 'assets/img/saas-about.png'
        }
    ]
    aboutContent = [
        {
            title: 'Take Your Business To The Next Level',
            textList: [
                {
                    title: "Let's Collaborate",
                    paragraph: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
                },
                {
                    title: "A Satisfied Customer",
                    paragraph: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
                },
                {
                    title: "Expertise to Build The Things",
                    paragraph: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
                }
            ]
        }
    ];

}