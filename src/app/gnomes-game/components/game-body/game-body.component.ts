import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {GnomeInfo} from '../../models/types';
import {GnomesChallengeService} from '../../../shared/services/gnomes-challenge.service';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {filter, take} from 'rxjs/operators';
import {Subscription, timer} from 'rxjs';
import {TimeToLoseService} from '../../../shared/services/time-to-lose.service';
import {GnomeComponent} from '../gnome/gnome.component';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent extends SubscriberOxDirective implements OnInit {

  @ViewChildren(GnomeComponent) gnomeComponents: QueryList<GnomeComponent>;

  public gnomes: GnomeInfo[] = [];
  public playingSequence: boolean;
  private isStarted: boolean;
  public sequence: number[];
  public sequenceSubscription: Subscription;

  public readonly positionsPerScene = [
    {
      scene: 'alacena',
      positions: [
        {x: '13vh', y: '20.5vh'},
        {x: '102vh', y: '20.5vh'},
        {x: '13vh', y: '62.5vh'},
        {x: '102vh', y: '62.5vh'},
      ]
    }
  ];
  public currentPositionsPerScene = [];

  constructor(private challengeService: GnomesChallengeService,
              public timeToLose: TimeToLoseService) {
    super();
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)), z => {
      const exercise = challengeService.exercise;
      console.log(exercise);
      this.currentPositionsPerScene = this.positionsPerScene.find(y => y.scene === this.challengeService.scene.name).positions;
      this.gnomes = exercise.gnomes.map(gnome => {
        return {color: gnome.color, sound: gnome.sound};
      });
      this.sequence = this.gnomes.map( (pp, i) => i);
      timer(3000).subscribe(hhh => {
        this.playSequence(1);
      });
    });
  }

  ngOnInit(): void {
  }


  public playSequence(duration: number): void {
    this.timeToLose.stop();
    this.playingSequence = true;
    // this.currentScene.gnomes.toArray().forEach(gnome => {
    this.gnomeComponents.toArray().forEach(gnome => {
      gnome.interactable = false;
    });
    this.sequenceSubscription = timer(duration === 1 ? 500 : 1500, 1000 * duration)
      .pipe(take(this.sequence.length + 1)).subscribe(value => {
        if (value < this.sequence.length) {
          this.gnomeComponents.toArray()[this.sequence[value]].playAudio();
        }
      }, () => {

      }, () => {
        this.playingSequence = false;
        this.gnomeComponents.toArray()[this.sequence[this.sequence.length - 1]].stopAudio();
        this.gnomeComponents.toArray().forEach(gnome => {
          gnome.interactable = true;
        });
        this.timeToLose.start();
      });
  }


}
