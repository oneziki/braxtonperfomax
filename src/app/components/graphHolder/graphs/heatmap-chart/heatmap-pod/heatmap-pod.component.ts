import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-heatmap-pod',
  templateUrl: './heatmap-pod.component.html',
  styleUrls: ['./heatmap-pod.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeatmapPodComponent {

  @Input() podData;

  constructor() { }

}
