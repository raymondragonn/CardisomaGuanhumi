import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-saas-app-download',
    templateUrl: './saas-app-download.component.html',
    styleUrls: ['./saas-app-download.component.scss']
})
export class SaasAppDownloadComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }
    
    appDownloadImage: Image[] = [
        {
            img: 'assets/img/why-choose.png'
        }
    ]
    appDownloadContent: Content[] = [
        {
            title: 'Download Our Apps Today',
            paragraph1: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            paragraph2: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account the system and expound the actual teachings of the great.',
            paragraph3: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            button1: 'assets/img/store/1.png',
            button2: 'assets/img/store/2.png'
        }
    ]

}
class Image {
    img : string;
}
class Content {
    title : string;
    paragraph1 : string;
    paragraph2 : string;
    paragraph3 : string;
    button1 : string;
    button2 : string;
}