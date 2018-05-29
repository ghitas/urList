import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'tool-bar',
    templateUrl: './tool-bar.component.html',
    styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {
    public username: string;
    private language = [
        {'key':'en','name': 'EN'},
        {'key':'vn','name': 'VN'}
    ]
    selectedLang = this.language[1];
    ngOnInit(): void {
        this.username = localStorage.getItem("user");
    }
    constructor(
        private router: Router, 
        private service: EventService,
        private translate: TranslateService
    ) { }
    btnLoggout(): void {
        localStorage.clear();
        this.service.user = null;
        this.service.pass = null;
        this.router.navigate(["/"]);
        this.username = this.service.user;
    }
    changeLang(lang) {
        this.translate.use(lang.key);
    }
}
