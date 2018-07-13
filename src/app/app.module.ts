import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AuthuguardGuard } from './authuguard.guard';
import { Http, HttpModule } from '@angular/http';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { RouterModule, Routes } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RequestOptions, XHRBackend } from '@angular/http';
import { HttpService } from './services/http.service';
// modal use for all page
import { AppModalComponent } from './app-modal/app-modal.component';
// main page 
import { MainPageComponent } from './main-page/main-page.component';
import { LoginFormComponent } from './login-form/login-form.component';
// main page children
import { HeaderComponent } from './main-page/header/header.component';
import { FooterComponent } from './main-page/footer/footer.component';
import { DashboardComponent } from './main-page/dashboard/dashboard.component';
import { PlaylistManagerComponent } from './main-page/playlist-manager/playlist-manager.component';
import { UserAdministratorComponent } from './main-page/user-administrator/user-administrator.component';
// dashboard children
import { LeftContentComponent } from './main-page/dashboard/left-content/left-content.component';
import { RightContentComponent } from './main-page/dashboard/right-content/right-content.component';
// service
import { PlayListService } from './services/playlist.service';
import { EventService } from './services/event.service';
import { PlaceholderDirective } from './directives/place-holder.directive';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  {
    path: 'main-page',
    canActivate: [AuthuguardGuard],
    component: MainPageComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthuguardGuard],
        component: DashboardComponent
      }, {
        path: 'manager',
        canActivate: [AuthuguardGuard],
        component: PlaylistManagerComponent
      }, {
        path: 'adminitrator',
        canActivate: [AuthuguardGuard],
        component: UserAdministratorComponent
      }, {
        path: '',
        canActivate: [AuthuguardGuard],
        component: DashboardComponent
      }
    ]
  }, {
    path: '',
    component: LoginFormComponent
  }, {
    path: '**',
    component: PageNotFoundComponent
  }
]
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
export function httpInterceptor(backend: XHRBackend, options: RequestOptions) {
  return new HttpService(backend, options);
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgxMyDatePickerModule.forRoot(),
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],

  declarations: [
    AppComponent,
    DashboardComponent, LeftContentComponent,
    RightContentComponent,
    PlaylistManagerComponent,
    PlaceholderDirective,
    HeaderComponent,
    LoginFormComponent,
    FooterComponent,
    AppModalComponent,
    UserAdministratorComponent,
    MainPageComponent,
    PageNotFoundComponent
  ],

  bootstrap: [AppComponent],

  providers: [PlayListService, EventService, AuthuguardGuard,
    {
      provide: Http,
      useFactory: httpInterceptor,
      deps: [XHRBackend, RequestOptions]
    }
  ]
})
export class AppModule { }