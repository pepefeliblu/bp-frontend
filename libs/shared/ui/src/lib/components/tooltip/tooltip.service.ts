import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TooltipService {
  private tooltipEl: HTMLElement | null = null;

  show(text: string, rect: DOMRect) {
    this.hide();
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.textContent = text;
    this.tooltipEl.className = 'bp-tooltip-portal';
    document.body.appendChild(this.tooltipEl);
    // Position above the icon, horizontally centered
    const tooltipRect = this.tooltipEl.getBoundingClientRect();
    const top = rect.top - tooltipRect.height - 8;
    const left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    this.tooltipEl.style.position = 'fixed';
    this.tooltipEl.style.top = `${top}px`;
    this.tooltipEl.style.left = `${left}px`;
    this.tooltipEl.style.zIndex = '9999';
    this.tooltipEl.style.pointerEvents = 'none';
  }

  hide() {
    if (this.tooltipEl) {
      this.tooltipEl.remove();
      this.tooltipEl = null;
    }
  }
} 