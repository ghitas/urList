import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ToolBarComponent } from './components/tool-bar/tool-bar.component';
import { LeftContentComponent } from './components/left-content/left-content.component';
import { RightContentComponent } from './components/right-content/right-content.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { Http, HttpModule } from '@angular/http';
import { PlayListService } from './services/playlist.service';
import { EventService } from './services/event.service';
import { PlaceholderDirective } from './directives/place-holder.directive';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { FooterComponent } from './footer/footer.component';
import { AuthuguardGuard } from './authuguard.guard';
import { AppModalComponent } from './app-modal/app-modal.component';
import { PlaylistManagerComponent } from './playlist-manager/playlist-manager.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
// import ngx-translate and the http loader
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
    path: 'manager',
    canActivate: [AuthuguardGuard],
    component: PlaylistManagerComponent
  },
  {
    path: '',
    component: LoginFormComponent
  }
]
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
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

    // Components
    AppComponent, ToolBarComponent,
    MainContentComponent, LeftContentComponent,
    RightContentComponent,
    PlaylistManagerComponent,

    // Directives
    PlaceholderDirective,

    HeaderComponent,

    LoginFormComponent,

    FooterComponent,

    AppModalComponent
  ],

  bootstrap: [AppComponent],

  providers: [PlayListService, EventService, AuthuguardGuard],
})
export class AppModule { }


