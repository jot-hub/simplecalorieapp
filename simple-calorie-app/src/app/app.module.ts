import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpErrorHandler } from './http-error-handler.service';
import { ListComponent } from './list/list.component';
import { MessageService } from './message.service';
import { PreferencesComponent } from './preferences/preferences.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';
import { EnvService } from './env.service';
import { EnvServiceFactory, EnvServiceProvider } from './env.service.provider';



@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    PreferencesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    EnvServiceProvider,
    HttpErrorHandler,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
