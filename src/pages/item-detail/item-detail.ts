import { Component } from '@angular/core'
import { NavParams, ActionSheetController, ViewController, AlertController } from 'ionic-angular'

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {

  title
  description

  constructor(public navParams: NavParams,  public view: ViewController){

  }

  ionViewDidLoad() {
    this.title = this.navParams.get('item').title
    this.description = this.navParams.get('item').description
  }

}
