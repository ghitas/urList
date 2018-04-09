import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { GapiService } from "../services/gapi.service";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  constructor(private router: Router, 
    private user: EventService,
    private gapiService: GapiService) {
  }

  ngOnInit() {
  }

  loginUser(e) {
    e.preventDefault();
    var username = e.target.elements[0].value;
    var password = e.target.elements[1].value;
    this.user.setUserLoggedIn(username, password);
  }

  public isLoggedIn(): boolean {
    return this.gapiService.isUserSignedIn();
  }
  
  public signIn() {
    this.gapiService.signIn();
  }
  public signOut() {
    this.gapiService.signOut();
  }
}
