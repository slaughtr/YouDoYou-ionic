import { Component } from '@angular/core'
import { NavController, ViewController } from 'ionic-angular'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import * as moment from 'moment'

@Component({
  selector: 'page-add-item',
  templateUrl: 'add-item.html'
})
export class AddItemPage {

  title
  description
  due
  created
  difficulty
  estTime
  reward
  inSet
  skill
  repeat
  expOnComplete


  constructor(public navCtrl: NavController, public view: ViewController) {

  }

  saveItem(){

    let dateTime = moment().format('L') + " " + moment().format('LT')

    let newItem = {
      title: this.title,
      description: this.description,
      due: this.due,
      created: dateTime,
      difficulty: this.difficulty,
      estTime: this.estTime,
      reward: this.reward,
      inSet: this.inSet,
      skill: this.skill,
      repeat: this.repeat,
      expOnComplete: this.expOnComplete
    }

    if (newItem.reward === undefined) newItem.reward = "No Reward"
    if (newItem.inSet === undefined) newItem.inSet = "Not in a Set"
    if (newItem.skill === undefined) newItem.skill = "No Skill attributed"
    if (newItem.repeat === undefined) newItem.repeat = "No Repeat set"
    if (newItem.description === undefined) newItem.description = ""
    //arbitrary experience calculation
    //base of 1 exp, plus estTime divided by 60, plus 1/10 of difficulty
    //then the whole thing multiplied by two. Probably still a bit low
    newItem.expOnComplete = (1 + ((newItem.estTime/60)+(.1*newItem.difficulty)))*2

    this.view.dismiss(newItem)

  }

  close(){
    this.view.dismiss()
  }

}
