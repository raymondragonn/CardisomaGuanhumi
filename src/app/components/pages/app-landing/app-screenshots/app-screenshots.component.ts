import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-app-screenshots',
    templateUrl: './app-screenshots.component.html',
    styleUrls: ['./app-screenshots.component.scss']
})
export class AppScreenshotsComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    sectionTitle: sectionTitleContent[] = [
        {
            title: 'App Screenshots',
            paragraphText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]
    screenshotImage: Image[] = [
        {
            img: 'assets/img/screenshot/1.png'
        },
        {
            img: 'assets/img/screenshot/2.png'
        },
        {
            img: 'assets/img/screenshot/3.png'
        },
        {
            img: 'assets/img/screenshot/4.png'
        },
        {
            img: 'assets/img/screenshot/5.png'
        },
        {
            img: 'assets/img/screenshot/6.png'
        }
    ]

}
class sectionTitleContent {
    title : string;
    paragraphText : string;
}
class Image {
    img : string;
}