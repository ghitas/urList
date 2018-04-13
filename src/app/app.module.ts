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
    RouterModule.forRoot(appRoutes)
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

  providers: [PlayListService, EventService, AuthuguardGuard],
})
export class AppModule { }
