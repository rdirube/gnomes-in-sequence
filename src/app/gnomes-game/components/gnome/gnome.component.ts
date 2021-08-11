import {Component, Input, OnInit} from '@angular/core';
import {GnomeInfo} from '../../models/types';

@Component({
  selector: 'app-gnome',
  templateUrl: './gnome.component.html',
  styleUrls: ['./gnome.component.scss']
})
export class GnomeComponent implements OnInit {

  @Input() gnomeInfo: GnomeInfo;

  constructor() { }

  ngOnInit(): void {
  }

}
