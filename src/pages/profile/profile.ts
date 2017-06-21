import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular'

import { AuthProvider } from '../../providers/auth/auth'
import { FirebaseDataProvider } from '../../providers/firebase-data/firebase-data'


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user

  constructor(public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public authData: AuthProvider, public fbData: FirebaseDataProvider) {
  
  }

  ionViewDidEnter() {
  this.fbData.getUserProfile().then(userSnapshot => this.user = userSnapshot) }

}
