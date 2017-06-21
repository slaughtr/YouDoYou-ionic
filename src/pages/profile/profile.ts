import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular'

import {AngularFireModule } from 'angularfire2'
import {FirebaseListObservable, FirebaseObjectObservable, AngularFireDatabase } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

import { AuthProvider } from '../../providers/auth/auth'

import * as moment from 'moment'

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public todos: FirebaseListObservable<any>
  public completed: FirebaseListObservable<any>
  public user: FirebaseObjectObservable<any>

  uid
  email

  constructor(public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public db: AngularFireDatabase, public afAuth: AngularFireAuth, public authData: AuthProvider) {
    this.afAuth.authState.subscribe(auth => {
      console.log(auth)
      this.uid = auth.uid
      this.email = auth.email
      this.todos = db.list(this.uid+'/todos')
      this.completed = db.list(this.uid+'/completed')
      this.user = db.object(this.uid+'/user')
    })
  }

  ionViewDidLoad() {  }

}
