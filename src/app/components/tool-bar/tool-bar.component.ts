import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'tool-bar',
    templateUrl: './tool-bar.component.html',
    styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {
    public username: string;
    public language = [
        { 'key': 'en', 'name': 'EN' },
        { 'key': 'vn', 'name': 'VN' }
    ]
    selectedLang = this.language[1];
    ngOnInit(): void {
        this.username = localStorage.getItem("user");
    }
    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
    subs = new Subscription;
    constructor(
        private router: Router,
        private service: EventService,
        private translate: TranslateService
    ) {
        this.subs = this.service.componentSaid$.subscribe(mess => {
            if (mess.talkTo === "toolBar") {
                if (mess.mess === "logout ok") {
                    if (mess.accept === "yes")
                        this.logOut();
                }
            }
        });
    }
    btnLoggout(): void {
        var mess = {
            talkTo: "dialog",
            from: "toolBar",
            mess: "logout ok",
            data: {
                title: "Logout confirm",
                content: "Do you want to logout?",
                btnYN: true
            }
        }
        this.service.componentSay(mess);
    }
    logOut() {
        localStorage.clear();
        this.service.setCookie('userInfo', JSON.stringify({}), 30);
        this.service.setCookie('userChannel', JSON.stringify({}), 30);
        this.service.user = null;
        this.service.pass = null;
        this.router.navigate(["/"]);
        this.username = this.service.user;
    }
    changeLang(lang) {
        this.translate.use(lang.key);
    }
}
