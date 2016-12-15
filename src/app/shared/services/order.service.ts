import { Injectable } from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import { Order } from './models/order';

@Injectable()
export class OrderService {

  constructor(private angularFire: AngularFire) {
  }

  sendOrder(order: Order): FirebaseObjectObservable<Order> {
    //noinspection TypeScriptUnresolvedVariable
    let key = this.angularFire.database.list('orders').push(order).key;

    order.key = key;

    return this.angularFire.database.object(`orders/${order.key}`);
  }
}