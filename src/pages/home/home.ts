import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AmplifyService }  from 'aws-amplify-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public amplify:AmplifyService) {

    this.amplify = amplify;

  }



}
