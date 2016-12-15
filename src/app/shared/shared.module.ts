import { NgModule } from '@angular/core';
import { OrderService } from './services/order.service';
import { AngularFireModule } from 'angularfire2';
import { Config } from "../config/config";

@NgModule({
  providers: [
    OrderService
  ],
  imports: [
    AngularFireModule.initializeApp(Config.FIREBASE_CONFIG)
  ],
  exports: [
    AngularFireModule
  ]
})

export class SharedModule { }