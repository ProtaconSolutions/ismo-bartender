import { Component, OnInit } from '@angular/core';
import { OrderService } from "../../shared/services/order.service";
import {Order} from "../../shared/services/models/order";

@Component({
  selector: 'app-ismo',
  templateUrl: './ismo.component.html',
  styleUrls: ['./ismo.component.css']
})
export class IsmoComponent implements OnInit {

  constructor(private orderService: OrderService) { }

  ngOnInit() {
  }

  public sendTestOrder() : void {
    var testOrder = new Order();
    testOrder.state = 123;
    testOrder.recipe = [ 0, 0, 1, 0, 0, 3 ];
    this.orderService.sendOrder(testOrder);
  }
}
