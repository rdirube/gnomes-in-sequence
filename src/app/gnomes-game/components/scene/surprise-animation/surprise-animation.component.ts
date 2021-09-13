import {Component, Input, OnInit} from '@angular/core';
import {SurpriseAnimationInfo} from '../../../models/types';

@Component({
  selector: 'app-surprise-animation',
  templateUrl: './surprise-animation.component.html',
  styleUrls: ['./surprise-animation.component.scss']
})
export class SurpriseAnimationComponent implements OnInit {

  @Input() surpriseAnimationInfo: SurpriseAnimationInfo;
  animationPath = 'assets/gnome-game/animations/dragon.json';

  constructor() {
  }

  ngOnInit(): void {
  }

}
