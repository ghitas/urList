import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
    selector: 'tool-bar',
    templateUrl: './tool-bar.component.html',
    styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {
    public username: string;
    ngOnInit(): void {
        this.username = localStorage.getItem("user");
    }
    constructor(private router: Router, private service: EventService) { }
    btnLoggout(): void {
        localStorage.clear();
        this.service.user = null;
        this.service.pass = null;
        this.router.navigate(["/"]);
        this.username = this.service.user;
    }
}
