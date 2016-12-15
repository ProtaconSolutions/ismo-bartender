import { Component, OnInit } from '@angular/core';
import { Response, Http, Headers } from '@angular/http';
import { IWindow } from './IWindow';
import { OrderService } from "../../shared/services/order.service";
import { Order } from "../../shared/services/models/order";
import { Config } from "../../config/config";

const {webkitSpeechRecognition} : IWindow = <IWindow>window;

@Component({
  selector: 'app-ismo',
  templateUrl: './ismo.component.html',
  styleUrls: ['./ismo.component.css']
})
export class IsmoComponent implements OnInit {

  public query: string;
  public isRecording: boolean;

  private recognition: any;

  constructor(private http: Http, private orderService: OrderService) { }

  ngOnInit() {
    this.recognition = new webkitSpeechRecognition();
  }

  private postQuery(): void {
    let header = new Headers();
    header.append("Content-Type", "application/json; charset=utf-8");
    header.append("Authorization", "Bearer " + Config.APIAI_CONFIG.clientAccessToken);

    let body = JSON.stringify({ query: this.query, lang: "en", sessionId: "somerandomthing"});

    this.http.post("https://api.api.ai/v1/query?v=20150910", body, {
      headers: header
    })
    .subscribe(
      data => console.log(data.text()),
      err => console.log(err.text()),
      () => console.log("valmis")
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
      console.log("setting text: " + text);
      this.query = text;
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

  public sendTestOrder(): void {
    var testOrder = new Order();
    testOrder.state = 123;
    testOrder.recipe = [ 0, 0, 1, 0, 0, 3 ];
    this.orderService.sendOrder(testOrder);
  }
}
