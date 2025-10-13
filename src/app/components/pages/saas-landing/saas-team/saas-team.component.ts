import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-saas-team',
    templateUrl: './saas-team.component.html',
    styleUrls: ['./saas-team.component.scss']
})
export class SaasTeamComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    sectionTitle: sectionTitleContent[] = [
        {
            title: 'Our Expert Team',
            paragraphText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ]
    singleTeamBox = [
        {
            img: 'assets/img/team/team1.jpg',
            title: 'Alex Maxwel',
            designation: 'CEO & Founder',
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
        },
        {
            img: 'assets/img/team/team2.jpg',
            title: 'Justin Roberto',
            designation: 'Co-Founder',
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
        },
        {
            img: 'assets/img/team/team3.jpg',
            title: 'Louis Agassiz',
            designation: 'Web Developer',
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
        },
        {
            img: 'assets/img/team/team4.jpg',
            title: 'Carl Anderson',
            designation: 'Web Designer',
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

}
class sectionTitleContent {
    title : string;
    paragraphText : string;
}