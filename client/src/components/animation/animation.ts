import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import lottie, { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-animation',
  template: '<div></div>'
})
export class AnimationComponent implements AfterViewInit {
  private animation: AnimationItem|null = null;
  @Input()
  public loop = false;
  @Input()
  public autoplay = true;
  @Input()
  public sourcePath = '';
  @Output()
  public playbackEnded: EventEmitter<any> = new EventEmitter<any>();

  public blarf = 1;

  constructor(private container: ElementRef) {
  }

  ngAfterViewInit() {
    this.animation = lottie.loadAnimation({
      container: this.container.nativeElement,
      renderer: 'svg',
      loop: this.loop,
      autoplay: this.autoplay,
      path: this.sourcePath
    });
    this.animation.addEventListener('complete', () => {
      this.playbackEnded.emit();
    });
  }

  public play() {
    if (!this.animation) {
      throw new Error('Animation not loaded');
    }
    this.animation.play();
  }

  public stop() {
    if (!this.animation) {
      throw new Error('Animation not loaded');
    }
    this.animation.stop();
  }
}
