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
  public skills: FirebaseListObservable<any>

  constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase, public toastCtrl: ToastController) {
    this.afAuth.authState.subscribe(auth => {
      console.log(auth)
      this.uid = auth.uid
      this.todos = db.list(this.uid+'/todos')
      this.completed = db.list(this.uid+'/completed')
      this.skills = db.list(this.uid+'/skills')
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


  updateExperience(expAmount, didCompleteTask, skillKey) {
    //TODO: move all this to firebase functions
    //first update the user
    firebase.database().ref(this.uid+'/user').once('value')
    .then(value => {
      let newNumTasksCompleted : number = value.val().numTasksCompleted
      //is exp from completing a task?
      if (didCompleteTask) newNumTasksCompleted++

      let newExp : number = parseFloat(value.val().currentExp) + parseFloat(expAmount)
      //check if leveled up
      if (newExp >= value.val().neededExp) {
        //leveled up
        let newLevel : number = value.val().level + 1
        let newNeededExp : number = newLevel * 100
        let adjustedCurrentExp : number = newExp - parseFloat(value.val().neededExp)

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
          currentExp: newExp.toFixed(2),
          numTasksCompleted: newNumTasksCompleted
        })
      }
    })

    //now update the skill
    //check length of key first, no need to hit the
    //DB if it's not the right length
    if (skillKey.length === 20) {
      firebase.database().ref(this.uid+'/skills/'+skillKey).once('value')
      .then(value => {
        if(value){
          //in case somehow there's a faulty key,
          //let's make sure it's in the DB
          //TODO: some kind of handling on false
          let newNumTasksCompleted : number = parseInt(value.val().numTasksCompleted)
          //is exp from completing a task?
          if (didCompleteTask) newNumTasksCompleted++

          let newExp : number = parseFloat(value.val().currentExp) + parseFloat(expAmount)
          //check if leveled up
          if (newExp >= value.val().neededExp) {
            //leveled up
            let newLevel : number = parseInt(value.val().level) + 1
            let newNeededExp : number = newLevel * 100
            let adjustedCurrentExp : number = newExp - parseFloat(value.val().neededExp)

            firebase.database().ref(this.uid)
            .child('/skills/'+skillKey).update({
              currentExp: adjustedCurrentExp,
              neededExp: newNeededExp,
              level: newLevel,
              numTasksCompleted: newNumTasksCompleted
            })

            let toast = this.toastCtrl.create({
              message: 'SKILL LEVEL UP! '+ value.name + ' is now level '+newLevel+'! '+(newNeededExp-adjustedCurrentExp)+' experience to the next level!',
              duration: 3000
            }).present()
          } else {
            //not leveled up
            firebase.database().ref(this.uid+'/skills')
            .child(skillKey).update({
              currentExp: newExp.toFixed(2),
              numTasksCompleted: newNumTasksCompleted
            })
          }
        }
      })
    }

  }

  //todos


}
