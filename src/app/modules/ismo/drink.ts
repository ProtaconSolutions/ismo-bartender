import {Order} from "../../shared/services/models/order";

export class Drink {
  name: string;
  order: Order;

  public constructor(name: string, order: Order) {
    this.name = name;
    this.order = order;
  }
}