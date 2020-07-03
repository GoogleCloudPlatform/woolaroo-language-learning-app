import {
  AfterViewInit,
  Component,
  ContentChildren,
  Directive, ElementRef, EventEmitter,
  HostListener, Inject, InjectionToken,
  Input, OnDestroy,
  Output,
  QueryList,
  TemplateRef, ViewChild
} from '@angular/core';

@Directive({selector: '[appCarouselItem]'})
export class CarouselItem {
  public itemTemplate: TemplateRef<any>;

  constructor(private templateRef: TemplateRef<any>) {
    this.itemTemplate = this.templateRef;
  }
}

interface CarouselConfig {
  animationInterval: number;
  snapMinSpeed: number;
  snapMaxSpeed: number;
  snapAcceleration: number;
  snapDecelerationDistance: number;
  snapStickyDistance: number;
  targetPositionRatio: number;
  draggingMinDistance: number;
}

export const CAROUSEL_CONFIG = new InjectionToken<CarouselConfig>('Carousel config');

interface DragInfo {
  interval: any;
  offsetX: number;
  velocityX: number;
  startTime: number;
  lastClientX: number;
  lastClientY: number;
  minScrollPosition: number;
  maxScrollPosition: number;
  startScrollPosition: number;
}


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.html',
  styleUrls: ['./carousel.scss']
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  private dragInfo: DragInfo|null = null;
  private snapInterval: any = null;

  @ContentChildren(CarouselItem)
  items: QueryList<CarouselItem> = new QueryList();
  @ViewChild('scrollContent', { static: true })
  public scrollContent: ElementRef|null = null;

  private _currentItem: number = 0;
  public get currentItem(): number { return this._currentItem; }
  @Input()
  public set currentItem(value: number) {
    if(value != this._currentItem) {
      this._currentItem = value;
      this.currentItemChanged.emit(value);
    }
  }

  @Output()
  public currentItemChanged: EventEmitter<number> = new EventEmitter();

  public get isDragging(): boolean {
    return !!this.dragInfo && (
      Math.abs(this.dragInfo.maxScrollPosition - this.dragInfo.startScrollPosition) > this.config.draggingMinDistance
      || Math.abs(this.dragInfo.minScrollPosition - this.dragInfo.startScrollPosition) > this.config.draggingMinDistance);
  }

  constructor(@Inject(CAROUSEL_CONFIG) private config: CarouselConfig, private hostElement: ElementRef) {
  }

  ngAfterViewInit() {
    this.centerItems();
    window.addEventListener('resize', this.onWindowResize);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => {
    this.centerItems();
  };

  @HostListener('touchstart', ['$event'])
  onTouchStart(ev: TouchEvent) {
    ev.preventDefault();
    window.document.body.addEventListener('touchmove', this.onTouchMove);
    window.document.body.addEventListener('touchend', this.onTouchEnd);
    const touch = ev.touches[0];
    this.startDrag(touch.clientX, touch.clientY);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(ev: MouseEvent) {
    ev.preventDefault();
    window.document.body.addEventListener('mousemove', this.onMouseMove);
    window.document.body.addEventListener('mouseup', this.onMouseUp);
    this.startDrag(ev.clientX, ev.clientY);
  }

  onTouchEnd = () => {
    window.document.body.removeEventListener('touchmove', this.onTouchMove);
    window.document.body.removeEventListener('touchend', this.onTouchEnd);
    this.stopDrag();
  };

  onMouseUp = () => {
    window.document.body.removeEventListener('mousemove', this.onMouseMove);
    window.document.body.removeEventListener('mouseup', this.onMouseUp);
    this.stopDrag();
  };

  onTouchMove = (ev: TouchEvent) => {
    const touch = ev.touches[0];
    this.updateDrag(touch.clientX, touch.clientY);
  };

  onMouseMove = (ev: MouseEvent) => {
    this.updateDrag(ev.clientX, ev.clientY);
  };

  private static getTime(): number {
    return Date.now();
  }

  startDrag(x: number, y: number) {
    if(this.snapInterval) {
      clearInterval(this.snapInterval);
      this.snapInterval = null;
    }
    if (this.dragInfo && this.dragInfo.interval) {
      clearInterval(this.dragInfo.interval);
    }
    const positionX = this.getScrollPosition();
    const properties = { position: positionX, time: CarouselComponent.getTime() };
    this.dragInfo = {
      velocityX: 0,
      offsetX: positionX - x,
      interval: setInterval(() => this.updateScrollVelocity(properties), this.config.animationInterval),
      startScrollPosition: positionX,
      minScrollPosition: positionX,
      maxScrollPosition: positionX,
      lastClientX: x,
      lastClientY: y,
      startTime: Date.now()
    };
  }

  stopDrag() {
    if(!this.dragInfo) {
      return;
    }
    if(this.dragInfo.interval) {
      clearInterval(this.dragInfo.interval);
    }
    if (this.isDragging) {
      const velocity = this.dragInfo.velocityX;
      this.dragInfo = null;
      const snapItemIndex = this.getEndingSnapItemIndex(this.getScrollPosition(), velocity);
      this.scrollToItem(snapItemIndex, velocity);
      this.updateTargetPosition();
    } else {
      const itemIndex = this.getItemIndexFromPosition(this.dragInfo.lastClientX, this.dragInfo.lastClientY);
      this.dragInfo = null;
      if(itemIndex >= 0 && this.items && itemIndex < this.items.length) {
        this.scrollToItem(itemIndex);
      }
    }
  }

  private centerItems() {
    if (!this.scrollContent || this.currentItem < 0) {
      return;
    }
    const scrollContainer = this.hostElement.nativeElement as HTMLElement;
    const scrollContent = this.scrollContent.nativeElement;
    const items = scrollContent.getElementsByTagName('li');
    if (!items || this.currentItem >= items.length) {
      return;
    }
    const containerBounds = scrollContainer.getBoundingClientRect();
    const centerX = containerBounds.left + containerBounds.width * 0.5;
    const currentItem = items[this.currentItem];
    const currentItemBounds = currentItem.getBoundingClientRect();
    const currentItemCenterX = currentItemBounds.left + currentItemBounds.width * 0.5;
    this.setScrollPosition(centerX - currentItemCenterX);
  }

  private scrollToItem(index: number, velocity: number = 0) {
    const properties = {time: CarouselComponent.getTime(), position: this.getScrollPosition(), velocity};
    this.snapInterval = setInterval(() => this.updateSnapPosition(properties, index), this.config.animationInterval);
  }

  updateDrag(x: number, y: number) {
    if(!this.dragInfo) {
      return;
    }
    const scrollPosition = x + this.dragInfo.offsetX;
    this.dragInfo.minScrollPosition = Math.min(this.dragInfo.minScrollPosition, scrollPosition);
    this.dragInfo.maxScrollPosition = Math.max(this.dragInfo.maxScrollPosition, scrollPosition);
    this.dragInfo.lastClientX = x;
    this.dragInfo.lastClientY = y;
    this.setScrollPosition(scrollPosition);
    this.currentItem = this.getItemIndexFromScrollPosition(scrollPosition, this.currentItem);
    this.updateTargetPosition();
  }

  private updateScrollVelocity(lastProperties: {position: number, time: number}) {
    const positionX = this.getScrollPosition();
    const dx = positionX - lastProperties.position;
    const t = CarouselComponent.getTime();
    const dt = t - lastProperties.time;
    if(this.dragInfo) {
      this.dragInfo.velocityX = dx / dt;
    }
    lastProperties.position = positionX;
    lastProperties.time = t;
  }

  private updateTargetPosition() {
    if (!this.scrollContent || this.currentItem < 0) {
      return;
    }
    const scrollContainer = this.hostElement.nativeElement as HTMLElement;
    const scrollContent = this.scrollContent.nativeElement;
    const items = scrollContent.getElementsByTagName('li');
    if (!items) {
      return;
    }
    const itemIndex = Math.min(this.currentItem, items.length - 2);
    if (itemIndex < 0) {
      return;
    }
    const containerBounds = scrollContainer.getBoundingClientRect();
    const centerX = containerBounds.left + containerBounds.width * 0.5;
    const currentItem = items[itemIndex];
    const currentItemBounds = currentItem.getBoundingClientRect();
    const currentItemCenterX = currentItemBounds.left + currentItemBounds.width * 0.5;
    const dx = centerX - currentItemCenterX;
    let maxSnapDx = currentItemBounds.width * 0.5; // max distance before snapping to next element
    let adjacentItem = null;
    if (dx < 0 && itemIndex > 0) {
      adjacentItem = items[itemIndex - 1];
    } else if (dx > 0 && itemIndex < items.length - 1) {
      adjacentItem = items[itemIndex + 1];
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
    //this.targetPositionChanged.emit({ x: targetX, y: currentItemCenterY });
  }

  // predict where snap position will be after decelerating
  private getEndingSnapItemIndex(position: number, velocity: number): number {
    if (Math.abs(velocity) > this.config.snapMaxSpeed) {
      // over max speed
      velocity = Math.sign(velocity) * this.config.snapMaxSpeed;
    }
    const dt = this.config.animationInterval;
    const decelerationTime = dt * Math.ceil(Math.abs(velocity / this.config.snapAcceleration) / dt);
    const finalPosition = position + 0.5 * velocity * decelerationTime;
    return this.getItemIndexFromScrollPosition(finalPosition, this.currentItem);
  }

  private getItemSnapPosition(index: number): number {
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

  private getItemIndexFromScrollPosition(scrollPosition: number, currentIndex: number = -1): number {
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

  private getItemIndexFromPosition(x: number, y: number): number {
    if (!this.scrollContent) {
      return 0;
    }
    const scrollContent = this.scrollContent.nativeElement;
    const items = scrollContent.getElementsByTagName('li');
    for (let k = 0; k < items.length; k++) {
      const child = items[k];
      let childRect = child.getBoundingClientRect();
      if (x >= childRect.left && x <= childRect.right
        && y >= childRect.top && y <= childRect.bottom) {
        // position is within child bounds
        return k;
      }
    }
    return -1;
  }

  private updateSnapPosition(lastProperties: {position: number, velocity: number, time: number}, snapItemIndex: number) {
    let velocity = lastProperties.velocity;
    if (Math.abs(velocity) > this.config.snapMaxSpeed) {
      velocity = Math.sign(velocity) * this.config.snapMaxSpeed;
    }
    const snapPosition = this.getItemSnapPosition(snapItemIndex);
    const t = CarouselComponent.getTime();
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
      clearInterval(this.snapInterval);
      this.snapInterval = null;
      this.currentItem = this.getItemIndexFromScrollPosition(snapPosition);
    } else {
      const position = lastProperties.position + dx;
      this.setScrollPosition(position);
      lastProperties.velocity = velocity;
      lastProperties.position = position;
      lastProperties.time = t;
      this.currentItem = this.getItemIndexFromScrollPosition(position);
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
