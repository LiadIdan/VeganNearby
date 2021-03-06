import { Component, Input } from '@angular/core';
import { MzBaseModal } from 'ng2-materialize';

import { AlertModalOptions, ModalService } from './../../../core/services/modal.service';

@Component({
  selector: 'vn-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})

export class AlertModalComponent extends MzBaseModal {
  @Input() public options: AlertModalOptions;
  private completed = false;

  constructor(private modalService: ModalService) {
    super();
  }

  public modalOptions: Materialize.ModalOptions = {
    dismissible: true,
    opacity: 0.5,
    complete: () => this.onComplete()
  };

  public onCancel(): void {
    this.completed = true;
    this.modalService.close();
    if (this.options.buttons[0].handler) {
      this.options.buttons[0].handler();
    }
  }

  public onConfirm(): void {
    this.completed = true;
    this.modalService.close();
    this.options.buttons[1].handler();
  }

  private onComplete(): void {
    if (!this.completed) {
      this.onCancel();
    }
  }
}
