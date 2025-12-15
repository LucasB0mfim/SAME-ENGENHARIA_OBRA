import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from "@angular/router";

export interface DynamicListField {
  label?: string;
  name?: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea' | 'file' | 'qrcode' | 'image' | 'icon';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  accept?: string;
  mask?: string;
  min?: number;
  max?: number;
}

export interface DynamicListSection {
  fields: DynamicListField[];
  items?: any[];
}

@Component({
  selector: 'app-dynamic-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './dynamic-list.component.html',
  styleUrls: ['./dynamic-list.component.scss']
})
export class DynamicListComponent {
  @Input() sections: DynamicListSection[] = [];
  @Input() submitButtonText: string = 'Enviar';
  @Input() titleSection: string = '';
  @Input() errorMessage: string = '';
  @Input() successMessage: string = 'Formulário enviado com sucesso!';

  hasImage(fields: any[], item: any): boolean {
    return fields.some(field =>
      field.type === 'image' && item[field.name!] && item[field.name!].trim() !== ''
    );
  }
}

