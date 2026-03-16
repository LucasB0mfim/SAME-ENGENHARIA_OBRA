import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type FeedbackType = 'success' | 'error';

@Component({
  selector: 'app-toast',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  @Input() type: FeedbackType = 'success';
  @Input() message: string = '';
  @Input() visible: boolean = false;

  @Output() close = new EventEmitter<void>();
}
