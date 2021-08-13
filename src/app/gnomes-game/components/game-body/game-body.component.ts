import {Component, OnInit} from '@angular/core';
import {GnomeInfo} from '../../models/types';
import {GnomesChallengeService} from '../../../shared/services/gnomes-challenge.service';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent implements OnInit {

  public gnomes: GnomeInfo[];

  constructor(private challengeService: GnomesChallengeService) {
    this.gnomes = this.challengeService.info.gnomes.map(gnome => {
      return {color: gnome.color};
    });
  }

  ngOnInit(): void {
  }

}
