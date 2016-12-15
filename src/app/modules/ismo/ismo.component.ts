import {Component, OnInit, ApplicationRef} from '@angular/core';
import { Response, Http, Headers } from '@angular/http';
import { IWindow } from './IWindow';
import { OrderService } from "../../shared/services/order.service";
import { Order } from "../../shared/services/models/order";
import { Config } from "../../config/config";
import { Observable } from "rxjs";
import 'rxjs/operator/map';
import { setTimeout } from "timers";
import { Drink } from "./drink";

const {webkitSpeechRecognition} : IWindow = <IWindow>window;

@Component({
  selector: 'app-ismo',
  templateUrl: './ismo.component.html',
  styleUrls: ['./ismo.component.css']
})
export class IsmoComponent implements OnInit {

  public query: string;
  public isRecording: boolean;
  public orderStatusMessage: string;
  public isThinking: boolean = false;

  private recognition: any;
  private drinks: Drink[] = [
    new Drink("beer", new Order(1, [1,2,3,4,5,6])),
    new Drink("wine", new Order(1, [6,5,4,3,2,1]))
  ];

  constructor(private http: Http, private orderService: OrderService, private appRef: ApplicationRef) { }

  ngOnInit() {
    this.recognition = new webkitSpeechRecognition();
  }

  private postQuery(): void {
    this.isThinking = true;

    let header = new Headers();
    header.append("Content-Type", "application/json; charset=utf-8");
    header.append("Authorization", "Bearer " + Config.APIAI_CONFIG.clientAccessToken);

    let body = JSON.stringify({ query: this.query, lang: "en", sessionId: "somerandomthing"});

    let response = this.http.post("https://api.api.ai/v1/query?v=20150910", body, {
      headers: header
    });

    response.subscribe(
      data => {
        this.isThinking = false;
        this.handleOrderResult(data.json().result);
      },
      err => {
        this.isThinking = false;
        console.log(err.text())
      },
      () => console.log("ready")
    );
  }

  private startRecognition(): void {
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onstart = function(event) {
      console.log("recording");
    };

    this.recognition.onresult = (event) => {
      var text = "";
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        text += event.results[i][0].transcript;
      }

      this.query = text;
      this.appRef.tick();

      this.postQuery();
    };

    this.recognition.lang = "en-US";
    this.recognition.start();
    this.isRecording = true;
  }

  private stopRecognition(): void {
    console.log("ending");
    this.recognition.stop();
    this.isRecording = false;
  }

  private handleOrderResult(apiIoResult: any) : void {
    this.orderStatusMessage = apiIoResult.fulfillment.speech;
    console.log(apiIoResult.fulfillment.speech);

    if (apiIoResult.action !== "order" || apiIoResult.actionIncomplete === true) {
      this.appRef.tick();
      return;
    }

    let order = this.getOrder(apiIoResult.parameters.drink);

    if (order !== null) {
      this.orderService.sendOrder(order);
    } else {
      this.orderStatusMessage = apiIoResult.parameters.drink + " was not found in our recipe database.";
    }

    this.appRef.tick();
  }

  private getOrder(drinkName: string) : Order {
    for (let drink of this.drinks) {
      if (drink.name == drinkName) {
        return drink.order;
      }
    }

    return null;
  }
}
