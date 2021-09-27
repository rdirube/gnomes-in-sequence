import { Component, Input, OnInit, ViewChildren } from '@angular/core';
import { GnomeSceneStatus } from '../../models/types';
import {
  FeedbackOxService,
  GameActionsService, HintService,
  MicroLessonCommunicationService,
  MicroLessonMetricsService
} from 'micro-lesson-core';
import { GnomeInfo, GnomeScene } from '../../models/types';
import { SurpriseAnimationInfo } from '../../models/types';
import { GnomesChallengeService } from 'src/app/shared/services/gnomes-challenge.service';
import {SubscriberOxDirective} from 'micro-lesson-components';
import { AnswerMetric } from 'ox-types';
import { GnomeAnswerService } from 'src/app/shared/services/gnome-answer.service';
import {Subscription, timer} from 'rxjs';
import { filter } from 'rxjs/operators';
import { GnomeComponent } from '../gnome/gnome.component';
import { PreloaderOxService } from 'ox-core';


@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent extends SubscriberOxDirective implements OnInit {
  
  // @ViewChildren(GnomeComponent) gnomeComponents: QueryList <GnomeComponent>;

  currentStatus: GnomeSceneStatus = 'ver';
  public gnomesTutorial: GnomeInfo[] = [];
  public allGnomes: GnomeInfo[] = [];


  public sceneSvg:string;
  public surpriseInfo: SurpriseAnimationInfo;
  public sequence: number[];
  public currentScenePositions = [];
  public sequenceSubscription: Subscription;
  public info: {
    gnomes: GnomeInfo[],
    scenes: GnomeScene[]
  };


  constructor(private challengeService: GnomesChallengeService, private answerService: GnomeAnswerService,private hintService:HintService,private preLoaderServide:PreloaderOxService){
     super()
      
      this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x === undefined)), z => {
      this.info = JSON.parse(this.preLoaderServide.getResourceData('gnome-game/jsons/gnomes-and-scenes-info.json'));
      this.sceneSvg = 'gnome-game/svg/Fondos/jardin-establo-4.svg';
      this.allGnomes = this.info.gnomes.map(gnome => {
       return  {color: gnome.color, sound: gnome.sound, reference: gnome.reference};
      });
      this.gnomesTutorial = [this.allGnomes[0],this.allGnomes[1],this.allGnomes[2],this.allGnomes[3]];
      this.currentScenePositions = this.info.scenes[6].positions;
      console.log(this.currentScenePositions);
    })
  }

    // [{"x":"8.5vh","y":"11vh"},{"x":"8vh","y":"53vh"},{"x":"98vh","y":"11vh"},{"x":"98vh","y":"53vh"}]
  


  ngOnInit(): void {

  }




  
}



