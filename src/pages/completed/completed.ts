import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular'

import { AuthProvider } from '../../providers/auth/auth'
import { FirebaseDataProvider } from '../../providers/firebase-data/firebase-data'

import * as moment from 'moment'

@IonicPage()
@Component({
  selector: 'page-completed',
  templateUrl: 'completed.html',
})
export class CompletedPage {

  constructor(public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public authData: AuthProvider, public fbData: FirebaseDataProvider) {  }

  ionViewDidLoad() { }

  showOptions(complete) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [ {
          text: 'Un-complete',
          handler: () => this.markIncomplete(complete)
        },{
          text: 'Delete forever',
          role: 'destructive',
          handler: () => this.fbData.completed.remove(complete.$key)
        },{
          text: 'Update completed item',
          handler: () => this.updateCompletedItem(complete)
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('Cancel clicked')
        } ]
    })
    actionSheet.present()
  }

  updateCompletedItem(complete){
    let prompt = this.alertCtrl.create({
      title: 'Completed item info',
      message: "Update this completed item",
      inputs: [ {
          name: 'title',
          placeholder: 'Title',
          value: complete.title
        },{
          name: 'description',
          placeholder: 'Description',
          value: complete.description
        } ],
      buttons: [ {
          text: 'Cancel',
          handler: data => console.log('Cancel clicked')
        },{
          text: 'Save',
          handler: data => {
            this.fbData.completed.update(complete.$key, {
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
    //TODO: make this set todo exp to 0 to prevent
    //gaming of this system
    this.fbData.completed.remove(complete.$key)
    this.fbData.todos.push(complete)
  }

  //TODO: format this so moment shuts up
  timeSinceCompleted = complete => moment(complete.completedOn).fromNow()

  }
