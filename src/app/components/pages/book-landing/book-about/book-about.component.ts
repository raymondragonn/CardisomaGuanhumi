import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-book-about',
    templateUrl: './book-about.component.html',
    styleUrls: ['./book-about.component.scss']
})
export class BookAboutComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    aboutImage: Image[] = [
        {
            img: 'assets/img/book-about.jpg'
        }
    ]
    aboutContent = [
        {
            title: 'About The Book',
            paragraphList: [
                {
                    paragraph: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
                },
                {
                    paragraph: "Take a look at topics are discovered in this book. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
                }
            ],
            featuresList: [
                {
                    itemIcon: "las la-check",
                    item: "Design Principles"
                },
                {
                    itemIcon: "las la-check",
                    item: "White Space"
                },
                {
                    itemIcon: "las la-check",
                    item: "Responsive Design"
                },
                {
                    itemIcon: "las la-check",
                    item: "Color Theory"
                },
                {
                    itemIcon: "las la-check",
                    item: "UX Design"
                },
                {
                    itemIcon: "las la-check",
                    item: "Visual Hierarchy"
                },
                {
                    itemIcon: "las la-check",
                    item: "Writing"
                }
            ]
        }
    ];

}
class Image {
    img : string;
}