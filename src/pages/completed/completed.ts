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
  selector: 'page-completed',
  templateUrl: 'completed.html',
})
export class CompletedPage {

  public todos: FirebaseListObservable<any>
  public completed: FirebaseListObservable<any>

  uid

  constructor(public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public db: AngularFireDatabase, public afAuth: AngularFireAuth, public authData: AuthProvider) {
    this.afAuth.authState.subscribe(auth => {
      this.uid = auth.uid
      this.todos = db.list(this.uid+'/todos')
      this.completed = db.list(this.uid+'/completed')
    })

  }

  ionViewDidLoad() {
  }


  showOptions(complete) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Un-complete',
          handler: () => {
            this.markIncomplete(complete)
          }
        },{
          text: 'Delete forever',
          role: 'destructive',
          handler: () => {
            this.completed.remove(complete.$key)
          }
        },{
          text: 'Update completed item',
          handler: () => {
            this.updateCompletedItem(complete)
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked')
          }
        }
      ]
    })
    actionSheet.present()
  }

  updateCompletedItem(complete){
    let prompt = this.alertCtrl.create({
      title: 'Completed item info',
      message: "Update this completed item",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          value: complete.title
        },
        {
          name: 'description',
          placeholder: 'Description',
          value: complete.description
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked')
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.completed.update(complete.$key, {
              title: data.title,
              description: data.description
            })
          }
        }
      ]
    })
    prompt.present()
  }

  markIncomplete(complete) {
    //move todo to Completed and give user experience
    this.completed.remove(complete.$key)
    this.todos.push(complete)
  }

  timeTilDue(complete) {
    return moment(complete.due).fromNow()
  }

  }
