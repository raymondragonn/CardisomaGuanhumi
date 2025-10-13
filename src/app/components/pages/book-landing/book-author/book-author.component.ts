import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-book-author',
    templateUrl: './book-author.component.html',
    styleUrls: ['./book-author.component.scss']
})
export class BookAuthorComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    sectionTitle = [
        {
            title: 'About Author',
            paragraphText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]
    authorContent = [
        {
            title: 'Steve Augarde',
            paragraphList: [
                {
                    paragraph: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat aute irure dolor.",
                },
                {
                    paragraph: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
                }
            ],
            social: [
                {
                    icon: "lab la-facebook-f",
                    link: "#"
                },
                {
                    icon: "lab la-twitter",
                    link: "#"
                },
                {
                    icon: "lab la-linkedin-in",
                    link: "#"
                },
                {
                    icon: "lab la-instagram",
                    link: "#"
                }
            ]
        }
    ];
    authorImage = [
        {
            img: 'assets/img/author/author.jpg'
        }
    ];

}