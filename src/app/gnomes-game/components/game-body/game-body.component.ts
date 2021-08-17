import {Component, OnInit} from '@angular/core';
import {GnomeInfo} from '../../models/types';
import {GnomesChallengeService} from '../../../shared/services/gnomes-challenge.service';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent extends SubscriberOxDirective implements OnInit {

  public gnomes: GnomeInfo[] = [];

  constructor(private challengeService: GnomesChallengeService) {
    super();
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)), z => {
      this.gnomes = this.challengeService.info.gnomes.map(gnome => {
        return {color: gnome.color};
      });
    });
  }

  ngOnInit(): void {
  }

}
