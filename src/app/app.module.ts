import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { IsmoComponent } from './modules/ismo/ismo.component';
import {ComponentsHelper} from 'ng2-bootstrap/ng2-bootstrap'

@NgModule({
  declarations: [
    AppComponent,
    IsmoComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    FormsModule,
    HttpModule
  ],
  providers: [{provide: ComponentsHelper, useClass: ComponentsHelper}],
  bootstrap: [AppComponent]
})
export class AppModule { }
