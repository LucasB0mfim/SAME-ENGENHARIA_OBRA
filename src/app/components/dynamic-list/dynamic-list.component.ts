import { RouterLink } from "@angular/router";
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { DynamicField } from './dynamic-list.interface';

@Component({
  selector: 'app-dynamic-list',
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './dynamic-list.component.html',
  styleUrl: './dynamic-list.component.scss'
})
export class DynamicListComponent {
  @Input() title: string = '';
  @Input() data: any[] = [];
  @Input() fields: DynamicField[] = [];
}
