import {Component, OnInit} from '@angular/core';
import {GnomeInfo} from '../../models/types';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent implements OnInit {

  public gnomes: GnomeInfo[];

  constructor() {
    this.gnomes = ['Amarillo', 'Celeste', 'Azul', 'Naranja'].map(color => {
      return {color};
    });
  }

  ngOnInit(): void {
  }

}
