import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular'

import {AngularFireModule } from 'angularfire2'
import {FirebaseListObservable, FirebaseObjectObservable, AngularFireDatabase } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'

import { AuthProvider } from '../../providers/auth/auth'
import { FirebaseDataProvider } from '../../providers/firebase-data/firebase-data'

import * as moment from 'moment'

@IonicPage()
@Component({
  selector: 'page-todo',
  templateUrl: 'todo.html',
})
export class TodoPage {

  public todos: FirebaseListObservable<any>
  public completed: FirebaseListObservable<any>

  uid

  constructor(public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public db: AngularFireDatabase, public afAuth: AngularFireAuth, public authData: AuthProvider, public fbData: FirebaseDataProvider) {
    this.afAuth.authState.subscribe(auth => {
      this.uid = auth.uid
      this.todos = db.list(this.uid+'/todos')
      this.completed = db.list(this.uid+'/completed')
    })
  }

  ionViewDidLoad() {  }

  showOptions(todo) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [ {
          text: 'Mark Completed',
          handler: () => { this.markCompleted(todo) }
        },{
          text: 'Delete todo',
          role: 'destructive',
          handler: () => { this.todos.remove(todo.$key) }
          //TODO: confirm delete, remind user it's not
          //same as marking complete
        },{
          text: 'Update todo',
          handler: () => { this.updateTodo(todo) }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => { console.log('Cancel clicked') }
        } ]
    })
    actionSheet.present()
  }

  updateTodo(todo){
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
          handler: data => { console.log('Cancel clicked') }
        }, {
          text: 'Save',
          handler: data => {
            this.todos.update(todo.$key, {
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
    this.fbData.updateExperience(todo.expOnComplete, true)

    this.todos.remove(todo.$key)
    this.completed.push(todo)
  }





    timeTilDue(todo) { return moment(todo.due).fromNow() }

  }
