import { EventService } from '../../services/event.service';
import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;

@Component({
    selector: 'main-content',
    templateUrl: './main-content.component.html',
    styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit {
    ngOnInit(): void {
    }
    constructor(private user: EventService) {
    } 
}
