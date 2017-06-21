import { Component } from '@angular/core'
import { ModalController, NavController, ActionSheetController, AlertController, PopoverController } from 'ionic-angular'
import { AddItemPage } from '../add-item/add-item'
import { ItemDetailPage } from '../item-detail/item-detail'
import { TodoPage } from '../todo/todo'
import { CompletedPage } from '../completed/completed'
import { ProfilePage } from '../profile/profile'

import {AngularFireModule } from 'angularfire2'
import {FirebaseListObservable, FirebaseObjectObservable, AngularFireDatabase } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { AuthProvider } from '../../providers/auth/auth'



@Component({
  selector: 'HomePage',
  templateUrl: 'home.html'
})
export class HomePage {

  public todos: FirebaseListObservable<any>
  public completed: FirebaseListObservable<any>

  todoTab;
  completedTab;
  profileTab;

  uid;


  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public db: AngularFireDatabase, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public afAuth: AngularFireAuth, public authData: AuthProvider, public popCtrl: PopoverController) {
    this.todoTab = TodoPage
    this.completedTab = CompletedPage
    this.profileTab = ProfilePage
    this.afAuth.authState.subscribe(auth => {
      this.uid = auth.uid
      this.todos = db.list(this.uid+'/todos')
    })

  }

  ionViewDidLoad(){
  }

  addItem(){
    let addModal = this.popCtrl.create(AddItemPage)

    addModal.onDidDismiss(todo => { if(todo) this.saveItem(todo) })
    addModal.present()
  }

  saveItem(todo){
    this.todos.push(todo)
  }

}
