import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { AmplifyService } from 'aws-amplify-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  storage :any;
  user: any;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public amplifyService: AmplifyService) {
    this.initializeApp();

    this.amplifyService = amplifyService;
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

    this.storage = amplifyService.storage();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // this.storage.put('test.txt','this is some test text!');
      // this.signupUser();
      // this.confirmUser();
      this.signInUser();
    });
  }

  signInUser() {
    this.amplifyService.auth().signIn('ptemple', 'Reykjav1k!')
      .then(user => {
        console.log(user);
        this.user = user;
      })
      .catch(err => console.log(err));
  }
  confirmUser() {
    this.amplifyService.auth().confirmSignUp('ptemple','072678', {
      // Optional. Force user confirmation irrespective of existing alias. By default set to True.
      forceAliasCreation: true
    }).then(data => console.log(data))
      .catch(err => console.log(err));
  }
  signupUser() {
    this.amplifyService.auth().signUp({
      username: "ptemple",
      password: "Reykjav1k!",
      attributes: {
        email: "preston.temple@gmail.com",          // optional
        phone_number: "+12817342001",   // optional - E.164 number convention
        // other custom attributes
      },
      validationData: []  //optional
    })
      .then(data => console.log(data))
      .catch(err => console.log(err));

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
