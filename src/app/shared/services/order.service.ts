import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Order } from './models/order';

@Injectable()

export class OrderService {

  constructor(private angularFire: AngularFire) {
  }

  sendOrder(order : Order) {
    let orders = this.angularFire.database.list('orders');

    orders.push(order);
  }
}