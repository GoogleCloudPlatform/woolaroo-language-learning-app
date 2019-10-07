import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  InjectionToken,
  Input,
  Output, ViewChild
} from '@angular/core';
import { WordTranslation } from 'services/entities/translation';
import { Point } from 'util/geometry';

interface WordScrollListConfig {
  animationInterval: number;
  snapMinSpeed: number;
  snapMaxSpeed: number;
  snapAcceleration: number;
  snapDecelerationDistance: number;
  snapStickyDistance: number;
  targetPositionRatio: number;
}

export const WORD_SCROLL_LIST_CONFIG = new InjectionToken<WordScrollListConfig>('Word Scroll List config');

@Component({
  selector: 'app-word-scroll-list',
  templateUrl: './word-scroll-list.html',
  styleUrls: ['./word-scroll-list.scss']
})
export class WordScrollListComponent {
  private dragInterval: any = null;
  private dragOffsetX = 0;
  private dragVelocityX = 0;
  @Output()
  public targetPositionChanged: EventEmitter<Point> = new EventEmitter();
  @Output()
  public selectedWordChanged: EventEmitter<WordTranslation|null> = new EventEmitter();

  private _translations: WordTranslation[]|null = null;
  public get translations(): WordTranslation[]|null { return this._translations; }
  @Input('translations')
  public set translations(value: WordTranslation[]|null) {
    this._translations = value;
    if  (this._translations) {
      this.selectedWordIndex = Math.floor((this._translations.length - 1) / 2); // select center word (or left of center if even number)
    }
  }

  private _selectedWordIndex = 0;
  public get selectedWordIndex(): number { return this._selectedWordIndex; }
  @Input('selectedWordIndex')
  public set selectedWordIndex(value: number) {
    if (value === this._selectedWordIndex) {
      return;
    }
    this._selectedWordIndex = value;
    const selectedWord = this._translations && value >= 0 ? this._translations[value] : null;
    this.selectedWordChanged.emit(selectedWord);
    this.updateTargetPosition();
  }

  @ViewChild('scrollContent', { static: true })
  public scrollContent: ElementRef|null = null;

  constructor(@Inject(WORD_SCROLL_LIST_CONFIG) private config: WordScrollListConfig, private hostElement: ElementRef) {
  }

  private static getTime(): number {
    return Date.now();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(ev: TouchEvent) {
    if (this.dragInterval) {
      clearInterval(this.dragInterval);
      this.dragInterval = null;
    }
    const positionX = this.getScrollPosition();
    this.dragVelocityX = 0;
    this.dragOffsetX = positionX - ev.touches[0].clientX;
    window.document.body.addEventListener('touchmove', this.onTouchMove);
    const properties = { position: positionX, time: WordScrollListComponent.getTime() };
    this.dragInterval = setInterval(() => this.updateScrollVelocity(properties), this.config.animationInterval);
  }

  @HostListener('touchend')
  onTouchEnd() {
    window.document.body.removeEventListener('touchmove', this.onTouchMove);
    clearInterval(this.dragInterval);
    const velocity = this.dragVelocityX;
    const properties = { time: WordScrollListComponent.getTime(), position: this.getScrollPosition(), velocity };
    const snapWordIndex = this.getEndingSnapWordIndex(properties.position, velocity);
    this.dragInterval = setInterval(() => this.updateSnapPosition(properties, snapWordIndex), this.config.animationInterval);
    this.updateTargetPosition();
    // TODO
    /*if(!this._lineAnimationInterval) {
      this.setLineAngle(this._lineTargetAngle);
    }*/
  }

  onTouchMove = (ev: TouchEvent) => {
    const scrollPosition = ev.touches[0].clientX + this.dragOffsetX;
    this.setScrollPosition(scrollPosition);
    this.selectedWordIndex = this.getWordIndexFromScrollPosition(scrollPosition, this.selectedWordIndex);
    this.updateTargetPosition();
  };

  // predict where snap position will be after decelerating
  private getEndingSnapWordIndex(position: number, velocity: number): number {
    if (Math.abs(velocity) > this.config.snapMaxSpeed) {
      // over max speed
      velocity = Math.sign(velocity) * this.config.snapMaxSpeed;
    }
    const dt = this.config.animationInterval;
    const decelerationTime = dt * Math.ceil(Math.abs(velocity / this.config.snapAcceleration) / dt);
    const finalPosition = position + 0.5 * velocity * decelerationTime;
    return this.getWordIndexFromScrollPosition(finalPosition, this.selectedWordIndex);
  }

  private getWordSnapPosition(index: number): number {
    if (!this.scrollContent) {
      return 0;
    }
    const scrollContainer = this.hostElement.nativeElement;
    const scrollContent = this.scrollContent.nativeElement;
    const scrollCenterX = scrollContainer.clientWidth * 0.5;
    const centerElement = scrollContent.getElementsByTagName('li')[index];
    const centerElementCenterX = centerElement.offsetLeft + centerElement.clientWidth * 0.5;
    return scrollCenterX - centerElementCenterX;
  }

  private getWordIndexFromScrollPosition(scrollPosition: number, currentIndex: number = -1): number {
    if (!this.scrollContent) {
      return 0;
    }
    const scrollContainer = this.hostElement.nativeElement;
    const scrollContent = this.scrollContent.nativeElement;
    const centerPosition = -scrollPosition + scrollContainer.clientWidth * 0.5;
    let nearestOffsetX = 0;
    let nearestIndex = -1;
    const items = scrollContent.getElementsByTagName('li');
    for (let k = 0; k < items.length; k++) {
      const child = items[k];
      let childLeft = child.offsetLeft;
      let childRight = child.offsetLeft + child.clientWidth;
      if (k === currentIndex) {
        childLeft -= this.config.snapStickyDistance;
        childRight += this.config.snapStickyDistance;
      }
      if (centerPosition >= childLeft && centerPosition <= childRight) {
        // center position is within child bounds
        nearestIndex = k;
        break;
      }
      const childCenterX = child.offsetLeft + child.clientWidth * 0.5;
      const childOffsetX = centerPosition - childCenterX;
      if (nearestIndex < 0 || Math.abs(childOffsetX) < Math.abs(nearestOffsetX)) {
        nearestIndex = k;
        nearestOffsetX = childOffsetX;
      }
    }
    return nearestIndex;
  }

  private updateScrollVelocity(lastProperties: {position: number, time: number}) {
    const positionX = this.getScrollPosition();
    const dx = positionX - lastProperties.position;
    const t = WordScrollListComponent.getTime();
    const dt = t - lastProperties.time;
    this.dragVelocityX = dx / dt;
    lastProperties.position = positionX;
    lastProperties.time = t;
  }

  private updateTargetPosition() {
    if (!this.scrollContent || this.selectedWordIndex < 0) {
      return;
    }
    const scrollContainer = this.hostElement.nativeElement as HTMLElement;
    const scrollContent = this.scrollContent.nativeElement;
    const items = scrollContent.getElementsByTagName('li');
    if (!items || this.selectedWordIndex >= items.length) {
      return;
    }
    const containerBounds = scrollContainer.getBoundingClientRect();
    const centerX = containerBounds.left + containerBounds.width * 0.5;
    const currentItem = items[this.selectedWordIndex];
    const currentItemBounds = currentItem.getBoundingClientRect();
    const currentItemCenterX = currentItemBounds.left + currentItemBounds.width * 0.5;
    const dx = centerX - currentItemCenterX;
    let maxSnapDx = currentItemBounds.width * 0.5; // max distance before snapping to next element
    let adjacentItem = null;
    if (dx < 0 && this.selectedWordIndex > 0) {
      adjacentItem = items[this.selectedWordIndex - 1];
    } else if (dx > 0 && this.selectedWordIndex < items.length - 1) {
      adjacentItem = items[this.selectedWordIndex + 1];
    }
    if (adjacentItem) {
      // has adjacent item - adjust max snap distance to point between the items
      const otherItemBounds = adjacentItem.getBoundingClientRect();
      const otherItemCenterX = otherItemBounds.left + otherItemBounds.width * 0.5;
      maxSnapDx = Math.abs(centerX - (centerX + otherItemCenterX) * 0.5) + this.config.snapStickyDistance;
    }
    const currentItemCenterY = currentItemBounds.top + currentItemBounds.height * 0.5;
    const targetX = currentItemCenterX - currentItemBounds.width * 0.5 *
      Math.max(-1, Math.min(1, this.config.targetPositionRatio * dx / maxSnapDx));
    this.targetPositionChanged.emit({ x: targetX, y: currentItemCenterY });
  }

  private updateSnapPosition(lastProperties: {position: number, velocity: number, time: number}, snapWordIndex: number) {
    let velocity = lastProperties.velocity;
    if (Math.abs(velocity) > this.config.snapMaxSpeed) {
      velocity = Math.sign(velocity) * this.config.snapMaxSpeed;
    }
    const snapPosition = this.getWordSnapPosition(snapWordIndex);
    const t = WordScrollListComponent.getTime();
    const dt = t - lastProperties.time;
    const snapDx = snapPosition - lastProperties.position;
    velocity += snapDx < 0 ? - this.config.snapAcceleration * dt : this.config.snapAcceleration * dt;
    let maxSpeed = this.config.snapMaxSpeed;
    if (Math.abs(snapDx) <= this.config.snapDecelerationDistance) {
      // near snap position - start slowing down
      maxSpeed *= Math.abs(snapDx) / this.config.snapDecelerationDistance;
    }
    if (Math.abs(velocity) > maxSpeed) {
      // over max speed
      velocity = Math.sign(velocity) * maxSpeed;
    }
    if (Math.abs(velocity) < this.config.snapMinSpeed) {
      // under min speed
      velocity = Math.sign(velocity) * this.config.snapMinSpeed;
    }
    const dx = 0.5 * (velocity + lastProperties.velocity) * dt;
    if (Math.sign(dx) === Math.sign(snapDx) && Math.abs(dx) >= Math.abs(snapDx) && Math.abs(dx) < 10) {
      // close enough - end snap
      this.setScrollPosition(snapPosition);
      clearInterval(this.dragInterval);
      this.dragInterval = null;
      this.selectedWordIndex = this.getWordIndexFromScrollPosition(snapPosition);
    } else {
      const position = lastProperties.position + dx;
      this.setScrollPosition(position);
      lastProperties.velocity = velocity;
      lastProperties.position = position;
      lastProperties.time = t;
      this.selectedWordIndex = this.getWordIndexFromScrollPosition(position);
    }
    this.updateTargetPosition();
  }

  private getScrollPosition(): number {
    if (!this.scrollContent || !this.scrollContent.nativeElement) {
      return 0;
    }
    return this.scrollContent.nativeElement.offsetLeft;
  }

  private setScrollPosition(position: number) {
    if (!this.scrollContent || !this.scrollContent.nativeElement) {
      return;
    }
    return this.scrollContent.nativeElement.style.left = position + 'px';
  }
}
