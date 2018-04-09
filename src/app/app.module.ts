import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ToolBarComponent } from './components/tool-bar/tool-bar.component';
import { LeftContentComponent } from './components/left-content/left-content.component';
import { RightContentComponent } from './components/right-content/right-content.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { Http, HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PlayListService } from './services/playlist.service';
import { EventService } from './services/event.service';
import { GapiService } from './services/gapi.service';
import { SheetResource } from './services/SheetResource';
import { PlaceholderDirective } from './directives/place-holder.directive';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { FooterComponent } from './footer/footer.component';
import { AuthuguardGuard } from './authuguard.guard';
import { AppModalComponent } from './app-modal/app-modal.component';
import {
  GoogleApiModule,
  GoogleApiService,
  GoogleAuthService,
  NgGapiClientConfig,
  NG_GAPI_CONFIG,
  GoogleApiConfig
} from "ng-gapi";

let gapiClientConfig: NgGapiClientConfig = {
  client_id: "123107836641-klotifbmelp7qb7hhvhv2f9josg0aihl.apps.googleusercontent.com",
  discoveryDocs: ["https://analyticsreporting.googleapis.com/$discovery/rest?version=v4"],
  scope: [
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/analytics"
  ].join(" ")
};

const appRoutes: Routes = [
  {
    path: 'callback',
    component: MainContentComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthuguardGuard],
    component: MainContentComponent
  },
  {
    path: '',
    component: LoginFormComponent
  }
]

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    })
  ],

  declarations: [
    // Components
    AppComponent, ToolBarComponent,
    MainContentComponent, LeftContentComponent,
    RightContentComponent,

    // Directives
    PlaceholderDirective,
    HeaderComponent,
    LoginFormComponent,
    FooterComponent,
    AppModalComponent
  ],

  bootstrap: [AppComponent],

  providers: [PlayListService, EventService, GapiService, SheetResource, AuthuguardGuard],
})
export class AppModule { }
