import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-surprise-animation',
  templateUrl: './surprise-animation.component.html',
  styleUrls: ['./surprise-animation.component.scss']
})
export class SurpriseAnimationComponent implements OnInit {
  animationPath = 'assets/gnome-game/animations/dragon.json';

  constructor() { }

  ngOnInit(): void {
  }

}
