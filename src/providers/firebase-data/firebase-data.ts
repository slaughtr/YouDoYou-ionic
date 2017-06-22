import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ToastController } from 'ionic-angular'
import {AngularFireModule } from 'angularfire2'
import {FirebaseListObservable, FirebaseObjectObservable, AngularFireDatabase } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'

import firebase from 'firebase';

@Injectable()
export class FirebaseDataProvider {

  uid

  public user: FirebaseObjectObservable<any>
  public completed: FirebaseListObservable<any>
  public todos: FirebaseListObservable<any>

  constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase, public toastCtrl: ToastController) {
    this.afAuth.authState.subscribe(auth => {
      console.log(auth)
      this.uid = auth.uid
      this.todos = db.list(this.uid+'/todos')
      this.completed = db.list(this.uid+'/completed')
      this.user = db.object(this.uid+'/user')
    })
  }

  //USER FUNCTIONS
  getUserProfile(): Promise<any> {
    return new Promise( (resolve, reject) => {
      firebase.database().ref(this.uid)
      .child('/user')
      .on('value', data => {
        resolve(data.val());
      });
    });
  }

  updateName(newName): firebase.Promise<any> {
    return firebase.database().ref(this.uid)
    .child('/user').update({
      name: newName
    });
  }


  updateExperience(expAmount, didCompleteTask) {
    firebase.database().ref(this.uid+'/user').once('value')
    .then(value => {

      let newNumTasksCompleted = value.val().numTasksCompleted
      //is exp from completing a task?
      if (didCompleteTask) newNumTasksCompleted++
      console.log('current exp before: '+value.val().currentExp)
      console.log('exp added: ' +expAmount)

      let newExp = value.val().currentExp + expAmount
      //check if leveled up
      if (newExp >= value.val().neededExp) {
        console.log(newExp)
        //leveled up
        let newLevel = value.val().level + 1
        let newNeededExp = newLevel * 100
        let adjustedCurrentExp = newExp - value.val().neededExp

        firebase.database().ref(this.uid)
        .child('/user').update({
          currentExp: adjustedCurrentExp,
          neededExp: newNeededExp,
          level: newLevel,
          numTasksCompleted: newNumTasksCompleted
        })

        let toast = this.toastCtrl.create({
         message: 'LEVEL UP! You are now level '+newLevel+'! '+(newNeededExp-adjustedCurrentExp)+' experience to the next level!',
         duration: 3000
       }).present()
      } else {
        //not leveled up
        firebase.database().ref(this.uid)
        .child('/user').update({
          currentExp: newExp,
          numTasksCompleted: newNumTasksCompleted
        })
      }
    })
  }




  //todos


}
