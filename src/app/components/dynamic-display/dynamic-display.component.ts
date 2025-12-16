import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from "@angular/router";

export interface DynamicField {
  label: string;
  name: string;
  type: 'title' | 'text' | 'image' | 'date' | 'tel' | 'email' | 'name';
}

@Component({
  selector: 'app-dynamic-display',
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './dynamic-display.component.html',
  styleUrl: './dynamic-display.component.scss'
})
export class DynamicDisplayComponent {
  @Input() title: string = '';
  @Input() data: any[] = [];
  @Input() fields: DynamicField[] = [];

  constructor() { }

  /**
   * TrackBy function para otimizar renderização do *ngFor
   * Previne re-renderização desnecessária de cards
   */
  trackByIndex(index: number, item: any): number {
    return index;
  }

  /**
   * Retorna o nome do campo que é do tipo 'title'
   * Usado para alt text das imagens
   */
  getTitleField(): string {
    const titleField = this.fields.find(f => f.type === 'title');
    return titleField ? titleField.name : '';
  }
}
