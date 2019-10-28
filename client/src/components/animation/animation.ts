import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import lottie from 'lottie-web';

@Component({
  selector: 'app-animation',
  template: '<div></div>'
})
export class AnimationComponent implements AfterViewInit {
  @Input()
  public loop = false;
  @Input()
  public sourcePath = '';
  @Output()
  public playbackEnded: EventEmitter<any> = new EventEmitter<any>();

  constructor(private container: ElementRef) {
  }

  ngAfterViewInit() {
    const animation = lottie.loadAnimation({
      container: this.container.nativeElement,
      renderer: 'svg',
      loop: this.loop,
      autoplay: true,
      path: this.sourcePath
    });
    animation.addEventListener('complete', () => {
      this.playbackEnded.emit();
    });
    animation.play();
  }
}
