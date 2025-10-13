import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book-banner',
  templateUrl: './book-banner.component.html',
  styleUrls: ['./book-banner.component.scss']
})
export class BookBannerComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    bannerContent = [
        {
            subTitle: 'A Great Book',
            title: 'Big Hard Vault',
            paragraphList: [
                {
                    text: "We passion to work hard and deliver excellent results. It could solve the needs of your customers and develop innovation."
                },
                {
                    text: "* eBook includes iBooks, PDF & ePub versions"
                }
            ],
            buttonText: 'Buy Now for $9.30',
            buttonLink: '#'
        }
    ];
    bannerImage = [
        {
            img: 'assets/img/book-banner.png'
        }
    ];

}