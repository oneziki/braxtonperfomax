import { AfterViewInit, Input, Output, ElementRef, HostListener, Directive, EventEmitter } from '@angular/core';

@Directive({
  selector: 'div[autosize-modal]',
})

export class AutosizeModal implements AfterViewInit {

  private el: HTMLElement;
  private _minHeight: string;
  private _clientWidth: number;
  @Output() sendHeight = new EventEmitter<any>(true);

  @Input('minHeight')
  get minHeight(): string {
    return this._minHeight;
  }
  set minHeight(val: string) {
    this._minHeight = val;
    this.updateMinHeight();
  }

  constructor(public element: ElementRef) {
    this.el = element.nativeElement;
    this._clientWidth = this.el.clientWidth;
  }

  ngAfterViewInit(): void {
    // set element resize allowed manually by user
    const style = window.getComputedStyle(this.el, null);
    if (style.resize === 'both') {
      this.el.style.resize = 'horizontal';
    } else if (style.resize === 'vertical') {
      this.el.style.resize = 'none';
    }
    // run first adjust
    this.adjust();
  }

  adjust(): void {
    // perform height adjustments after input changes, if height is different
    if (this.el.style.height === this.element.nativeElement.scrollHeight + 'px') {
      return;
    }
    this.el.style.overflow = 'hidden';
    this.el.style.height = 'auto';
    this.el.style.height = this.el.scrollHeight + 'px';
    this.sendHeight.emit(this.el.scrollHeight);
  }

  updateMinHeight(): void {
    // Set textarea min height if input defined
    this.el.style.minHeight = this._minHeight + 'px';
  }

}
