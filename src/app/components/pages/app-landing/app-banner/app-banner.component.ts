import { Component, OnInit } from '@angular/core';

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
            title: 'Best Mobile App For Your Business',
            paragraph: 'App ipsum dolor sit amet, consectetur adipiscing elit, sed do mo tempor incididunt ut labore et dolore magna aliqua.',
            button1: 'assets/img/store/1.png',
            button2: 'assets/img/store/2.png'
        }
    ]
    bannerImage: Image[] = [
        {
            img: 'assets/img/app-banner.png'
        }
    ]

}
class Content {
    title : string;
    paragraph : string;
    button1 : string;
    button2 : string;
}
class Image {
    img : string;
}