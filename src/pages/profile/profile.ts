import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular'

import { AuthProvider } from '../../providers/auth/auth'
import { FirebaseDataProvider } from '../../providers/firebase-data/firebase-data'


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public authData: AuthProvider, public fbData: FirebaseDataProvider) { }

  ionViewDidEnter() { }

  showAddSkillModal() {
    //TODO: change this to modal, add select with icon options
  let prompt = this.alertCtrl.create({
    title: 'Add a new skill',
    message: "What skill would you like to add?",
    inputs: [ {
        name: 'skillName',
        placeholder: 'Programming'
      } ],
    buttons: [ {
        text: 'Cancel',
        handler: data => console.log('Cancel clicked')
      },{
        text: 'Save',
        handler: data => this.saveSkill(data)
      } ]
  }).present();
}

saveSkill(skill) {

  let newSkill = {
    name : skill.skillName,
    level: 1,
    currentExp: 0,
    neededExp: 100,
    numTasksCompleted: 0,
    numTasksFailed: 0
  }

  this.fbData.skills.push(newSkill)
}

}
