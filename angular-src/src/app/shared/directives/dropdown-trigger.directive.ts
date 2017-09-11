import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  Renderer2
} from '@angular/core';

import { RendererService } from '../../services/renderer.service';

@Directive({
  selector: '[appDropdownTriggerFor]'
})
export class DropdownTriggerDirective implements AfterViewInit {
  @Input() private align: string;
  @Input() private belowOrigin: boolean;
  @Input() private constrainWidth: boolean;
  @Input() private dropdownButtonId: string;
  @Input() private gutter: number;
  @Input() private hover: boolean;
  @Input() private id: string;
  @Input() private inDuration: number;
  @Input() private outDuration: number;
  @Input() private stopPropagation: boolean;
  @Input() private appDropdownTriggerFor: string;
  private dropdownButtonElement: JQuery;
  private dropdownElement: JQuery;

  constructor(private renderer: Renderer2, private rendererService: RendererService) {}

  ngAfterViewInit(): void {
    this.initDropdownButtonElement();
    this.initDropdownElement();
    this.validateProperties();
    this.handleProperties();
  }

  private initDropdownButtonElement(): void {
    this.dropdownButtonElement = $(`#${this.id}`);
  }

  private initDropdownElement(): void {
    this.dropdownElement = $(`#${this.appDropdownTriggerFor}`);
  }

  private handleProperties(): void {
    this.handleDataActivates();
    this.handleDropdown();
  }

  private handleDataActivates(): void {
    this.renderer.setAttribute(this.dropdownButtonElement[0], 'data-activates', this.appDropdownTriggerFor);
  }

  private handleDropdown(): void {
    const options: Materialize.DropDownOptions = {
      alignment: this.align,
      belowOrigin: this.belowOrigin,
      constrainWidth: this.constrainWidth,
      gutter: this.gutter,
      hover: this.hover,
      inDuration: this.inDuration,
      outDuration: this.outDuration,
      stopPropagation: this.stopPropagation,
    };

    // Initialize dropdown button for dropdown
    setTimeout(() => this.rendererService.invokeMethod(this.dropdownButtonElement, 'dropdown', [options]));
  }

  private validateProperties(): void {
    if (!this.appDropdownTriggerFor) {
      throw new Error('Attribute [appDropdownTriggerFor] from dropdown-trigger is required.' + this.dropdownButtonElement);
    }
    if (!this.id) {
      throw new Error('Attribute [id] from dropdown-trigger is required.' + this.dropdownButtonElement);
    }
  }
}
