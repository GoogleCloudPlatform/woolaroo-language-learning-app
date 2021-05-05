import { Component, ElementRef, InjectionToken, Inject, Input, ViewChild } from '@angular/core';
import { Point } from 'util/geometry';

interface SelectionLineConfig {
  animationInterval: number;
  rotateSpeed: number;
}

export const SELECTION_LINE_CONFIG = new InjectionToken<SelectionLineConfig>('Selection Line config');

@Component({
  selector: 'app-selection-line',
  template: '<hr #line />',
  styleUrls: ['./selection-line.scss']
})
export class SelectionLineComponent {
  private currentAngle = -Math.PI * 0.5;
  private targetAngle = -Math.PI * 0.5;
  private animationTimer: any = null;

  @ViewChild('line')
  public line: ElementRef|null = null;

  private _targetPosition: Point|null = null;
  public get targetPosition(): Point|null { return this._targetPosition; }
  @Input()
  public set targetPosition(value: Point|null) {
    this._targetPosition = value;
    if (value) {
      const bounds = this.hostElement.nativeElement.getBoundingClientRect();
      const dx = (bounds.left + bounds.width * 0.5) - value.x;
      const dy = bounds.top - value.y;
      this.targetAngle = Math.atan2(dy, dx);
      if (!this.animationTimer) {
        this.animationTimer = setInterval(() => this.updateAngle(), this.config.animationInterval);
      }
    }
  }

  constructor(@Inject(SELECTION_LINE_CONFIG) private config: SelectionLineConfig, private hostElement: ElementRef) {
  }

  updateAngle() {
    let complete = false;
    let angle;
    const da = this.targetAngle - this.currentAngle;
    const maxDa = this.config.rotateSpeed / this.config.animationInterval;
    if (Math.abs(da) > maxDa) {
      angle = this.currentAngle + Math.sign(da) * maxDa;
    } else {
      complete = true;
      angle = this.targetAngle;
    }
    this.setAngle(angle);
    if (complete && this.animationTimer) {
      clearInterval(this.animationTimer);
      this.animationTimer = null;
    }
  }

  setAngle(angle: number) {
    this.currentAngle = angle;
    const rot = Math.PI * 0.5 + angle;
    if (this.line) {
      const line = this.line.nativeElement as HTMLElement;
      line.style.transform = `rotate(${rot}rad)`;
      line.style.height = (100 / Math.abs(Math.sin(angle))) + '%';
    }
  }
}
