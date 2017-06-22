import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, ToastController } from 'ionic-angular'

import { AuthProvider } from '../../providers/auth/auth'
import { FirebaseDataProvider } from '../../providers/firebase-data/firebase-data'

import * as moment from 'moment'

@IonicPage()
@Component({
  selector: 'page-todo',
  templateUrl: 'todo.html',
})
export class TodoPage {

  constructor(public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public authData: AuthProvider, public fbData: FirebaseDataProvider, public toastCtrl: ToastController) { }

  ionViewDidLoad() {  }

  showOptions(todo) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [ {
          text: 'Mark Completed',
          handler: () => this.markCompleted(todo)
        },{
          text: 'Delete todo',
          role: 'destructive',
          handler: () => this.fbData.todos.remove(todo.$key)
          //TODO: confirm delete, remind user it's not
          //same as marking complete
        },{
          text: 'Update todo',
          handler: () => this.updateTodo(todo)
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('Cancel clicked')
        } ]
    })
    actionSheet.present()
  }

  updateTodo(todo){
    //TODO: this might need to just use the add item form
    let prompt = this.alertCtrl.create({
      title: 'Todo info',
      message: "Update this todo",
      //TODO: add more properties here
      inputs: [ {
          name: 'title',
          placeholder: 'Title',
          value: todo.title
        },{
          name: 'description',
          placeholder: 'Description',
          value: todo.description
        } ],
      buttons: [ {
          text: 'Cancel',
          handler: data => console.log('Cancel clicked')
        }, {
          text: 'Save',
          handler: data => {
            this.fbData.todos.update(todo.$key, {
              title: data.title,
              description: data.description
            })
          }
        }
      ]
    })
    prompt.present()
  }

  markCompleted(todo) {
    //TODO: some kind of check somewhere to see
    //if this todo has been completed before
    this.fbData.updateExperience(todo.expOnComplete, true)

    let toast = this.toastCtrl.create({
     message: 'Good job! You earned '+todo.expOnComplete+' experience!',
     duration: 3000
   }).present()

    this.fbData.todos.remove(todo.$key)
    this.fbData.completed.push(todo)
  }

    //using moment to get time until due
    //or time since due
    timeTilDue = todo => moment(todo.due).fromNow()
  }
