import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { AmplifyService } from 'aws-amplify-angular';

import { PhotoLibrary } from '@ionic-native/photo-library';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  storage :any;
  user: any;
  photos : Array<any>;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public amplifyService: AmplifyService, private photoLibrary: PhotoLibrary) {
    this.initializeApp();

    this.amplifyService = amplifyService;
    this.photoLibrary = this.photoLibrary;
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
      // this.getPhotoAuth();
      // this.getPhotos();

    });
  }
  getPhotoAuth() {
    this.photoLibrary.requestAuthorization().then(() => {
      this.getPhotos();
    })
      .catch(err => console.log('permissions weren\'t granted'));
  }

  getPhotos() {
    let photoArr :Array<any> = [];
    let storage = this.amplifyService.storage();
    storage.configure({level: 'private'});
    this.photoLibrary.getLibrary().subscribe({
      next: library => {
        library.forEach(function(libraryItem) {
          console.log(libraryItem.id);          // ID of the photo
          console.log(libraryItem.photoURL);    // Cross-platform access to photo
          console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
          console.log(libraryItem.fileName);
          console.log(libraryItem.width);
          console.log(libraryItem.height);
          console.log(libraryItem.creationDate);
          console.log(libraryItem.latitude);
          console.log(libraryItem.longitude);
          console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
          photoArr.push(libraryItem);
        });
      },
      error: err => { console.log('could not get photos'); },
      complete: () => {
        console.log('done getting photos:' + photoArr.length);
        this.photoLibrary.getPhoto(photoArr[2])
          .then(photo =>
          {
            storage.put(photoArr[2].fileName,photo)
              .then (result => console.log(result))
              .catch(err => console.log(err));;
          })
          .catch(err => console.log(err));

      }
    });
  }

  signInUser() {
    this.amplifyService.auth().signIn('ptemple', 'Reykjav1k!')
      .then(user => {
        console.log(user);
        this.user = user;
        this.getPhotos();
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
