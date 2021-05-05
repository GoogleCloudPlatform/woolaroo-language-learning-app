import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-border',
  templateUrl: './progress-border.html',
  styleUrls: ['./progress-border.scss']
})
export class ProgressBorderComponent {
  @Input()
  public borderWidth = 4;
  private _progress = 0;
  public get progress() { return this._progress; }
  @Input()
  public set progress(value: number) {
    this._progress = Math.max(0, Math.min(1, value));
  }
  public radius = 12;

  public get width(): number { return 2 * this.radius; }
  public get height(): number { return 2 * this.radius; }

  public get path(): string {
    const radius = this.radius;
    const border = this.borderWidth;
    const innerRadius = radius - border;
    // don't allow progress of 1 - arc will render as empty
    const progress = Math.min(this.progress, 0.99999);
    const theta = Math.PI - 2 * Math.PI * progress;
    const sin = Math.sin(theta);
    const cos = Math.cos(theta);
    const outerX = radius + radius * sin;
    const outerY = radius + radius * cos;
    const innerX = radius + innerRadius * sin;
    const innerY = radius + innerRadius * cos;
    const largeArc = this.progress > 0.5 ? '1' : '0';
    return `
M ${radius} 0
A ${radius} ${radius} 0 ${largeArc} 1 ${outerX} ${outerY}
L ${innerX} ${innerY}
A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${radius} ${border}
L ${radius} 0`;
  }
}
