import { Component } from '@angular/core'
import {  NavController, PopoverController, IonicPage } from 'ionic-angular'

import { AddItemPage } from '../add-item/add-item'
import { TodoPage } from '../todo/todo'
import { CompletedPage } from '../completed/completed'
import { ProfilePage } from '../profile/profile'

import { AuthProvider } from '../../providers/auth/auth'
import { FirebaseDataProvider } from '../../providers/firebase-data/firebase-data'

@IonicPage( { name: 'HomePage' } )

@Component({
  selector: 'HomePage',
  templateUrl: 'home.html'
})
export class HomePage {

  todoTab;
  completedTab;
  profileTab;

  constructor(public navCtrl: NavController, public authData: AuthProvider, public popCtrl: PopoverController, public fbData: FirebaseDataProvider) {
    this.todoTab = TodoPage
    this.completedTab = CompletedPage
    this.profileTab = ProfilePage
  }

  addItem(){
    let addModal = this.popCtrl.create(AddItemPage)

    addModal.onDidDismiss(todo => { if(todo) this.saveItem(todo) })
    addModal.present()
  }

  saveItem = todo => this.fbData.todos.push(todo)

}
