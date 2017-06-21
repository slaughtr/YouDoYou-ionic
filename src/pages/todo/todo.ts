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
  selector: 'page-todo',
  templateUrl: 'todo.html',
})
export class TodoPage {

  public todos: FirebaseListObservable<any>
  public completed: FirebaseListObservable<any>
  public user: FirebaseObjectObservable<any>

  uid
  thisUser

  constructor(public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public db: AngularFireDatabase, public afAuth: AngularFireAuth, public authData: AuthProvider) {
    this.afAuth.authState.subscribe(auth => {
      this.uid = auth.uid
      this.todos = db.list(this.uid+'/todos')
      this.completed = db.list(this.uid+'/completed')
      this.user = this.thisUser = db.object(this.uid+'/user')
    })

  }

  ionViewDidLoad() {
    // this.user.subscribe(user => this.thisUser = user)
  }


  showOptions(todo) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Mark Completed',
          handler: () => {
            this.markCompleted(todo)
          }
        },{
          text: 'Delete todo',
          role: 'destructive',
          handler: () => {
            this.todos.remove(todo.$key)
          }
        },{
          text: 'Update todo',
          handler: () => {
            this.updateTodo(todo)
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
    console.log(this.uid)
  }

  updateTodo(todo){
    let prompt = this.alertCtrl.create({
      title: 'Todo info',
      message: "Update this todo",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          value: todo.title
        },
        {
          name: 'description',
          placeholder: 'Description',
          value: todo.description
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
    //move todo to Completed and give user experience
    let numTasksUpdated

    let currentExpUpdated = this.thisUser.currentExp + todo.expOnComplete

    if (currentExpUpdated >= this.thisUser.neededExp) {
      currentExpUpdated -= this.thisUser.neededExp
      this.levelUp(currentExpUpdated, this.thisUser.level)
    }

    console.log("user numTasksCompleted before: "+this.thisUser.numTasksCompleted)
    numTasksUpdated = this.thisUser.numTasksCompleted + 1

    console.log(numTasksUpdated)

    this.updateUserCompleted(numTasksUpdated)

    console.log(this.thisUser)

    this.todos.remove(todo.$key)
    this.completed.push(todo)
  }

  updateUserCompleted(newNum) {
    this.user.update({numTasksCompleted: newNum})
  }


  levelUp(newExp, oldLevel) {
    let newLevel = oldLevel ++
    let newNeededExp = newLevel * 100
    this.user.update({currentExp : newExp,
      neededExp : newNeededExp,
      level: newLevel})
    }
    timeTilDue(todo) {
      return moment(todo.due).fromNow()
    }

  }
