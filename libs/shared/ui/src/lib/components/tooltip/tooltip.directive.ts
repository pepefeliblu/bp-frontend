import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { TooltipService } from './tooltip.service';

@Directive({
  selector: '[libTooltip]',
  standalone: true,
})
export class TooltipDirective {
  @Input('libTooltip') tooltipText = '';

  constructor(private readonly el: ElementRef, private readonly tooltipService: TooltipService) {}

  @HostListener('mouseenter') onMouseEnter() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.tooltipService.show(this.tooltipText, rect);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.tooltipService.hide();
  }

  @HostListener('focus') onFocus() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.tooltipService.show(this.tooltipText, rect);
  }

  @HostListener('blur') onBlur() {
    this.tooltipService.hide();
  }
}
