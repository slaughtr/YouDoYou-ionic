import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

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

  constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase) {
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

  updateExperience(expAmount) {
    let oldExp
    firebase.database().ref(this.uid+'/user/currentExp').once('value')
    .then(value => {
      oldExp = value.val()
      console.log('oldexp: '+oldExp)
      console.log('expAmount: '+expAmount)
      firebase.database().ref(this.uid)
      .child('/user').update({
        currentExp: oldExp+expAmount
      })
    }
    )
  }

}
