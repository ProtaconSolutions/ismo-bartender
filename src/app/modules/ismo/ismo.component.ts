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
  public latestOrder: Order = new Order(0, [0, 0, 0, 0]);

  private recognition: any;
  private drinks: Drink[] = [
    new Drink("beer", new Order(0, [5, 0, 5, 10])),
    new Drink("milk", new Order(0, [0, 5, 0, 0])),
    new Drink("jallu", new Order(0, [0, 0, 5, 0])),
    new Drink("sake", new Order(0, [0, 0, 0, 5])),
    new Drink("jallumaito", new Order(0, [0, 10, 2, 2])),
    new Drink("sake bomb", new Order(0, [10, 0, 0, 2])),
    new Drink("kaljamaito", new Order(0, [10, 10, 0, 0]))
  ];

  constructor(private http: Http, private orderService: OrderService, private appRef: ApplicationRef) { }

  ngOnInit() {
    this.recognition = new webkitSpeechRecognition();
  }

  public getStatusText(status: number) : string {
    switch (status) {
      case 0:
        return "";
      case 1:
        return "Here we go! Coming right up..";
      case 2:
        return ":) :) :) :)";
    }
  }

  private postQuery(): void {
    let header = new Headers();
    header.append("Content-Type", "application/json; charset=utf-8");
    header.append("Authorization", "Bearer " + Config.APIAI_CONFIG.clientAccessToken);

    let body = JSON.stringify({ query: this.query, lang: "en", sessionId: "somerandomthing"});

    let response = this.http.post("https://api.api.ai/v1/query?v=20150910", body, {
      headers: header
    });

    response.subscribe(
      data => {
        this.handleOrderResult(data.json().result);
        this.isThinking = false;
        this.appRef.tick();
      },
      err => {
        console.log(err.text());
        this.isThinking = false;
        this.appRef.tick();
      },
      () => console.log("ready")
    );
  }

  private startRecognition(): void {
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.isThinking = true;
    this.isRecording = true;
    this.appRef.tick();

    this.recognition.onstart = function(event) {
      console.log("recording");
    };

    this.recognition.onend = (event) => {
      console.log("onend");
    };

    this.recognition.onresult = (event) => {
      console.log("onresult");
      var text = "";
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        text += event.results[i][0].transcript;
      }

      console.log(text);

      this.query = text;
      this.appRef.tick();

      this.postQuery();
    };

    this.recognition.onspeechend = (event) => {
      console.log("speechend");
      this.stopRecognition();
    };

    this.recognition.lang = "en-US";
    this.recognition.start();
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
      this.orderStatusMessage = this.orderStatusMessage + " One " + apiIoResult.parameters.drink + " coming right up!";
      this.orderService.sendOrder(order).subscribe((order) => {
        this.latestOrder = order;
        this.appRef.tick();
      });

      setTimeout(() => {
        this.orderStatusMessage = "";
        this.appRef.tick();
      }, 3000);
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
