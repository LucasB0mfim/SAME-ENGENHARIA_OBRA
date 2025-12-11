import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { EquipmentService } from '../../../core/services/equipment.service';

@Component({
  selector: 'app-equipament-list',
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './equipament-list.component.html',
  styleUrl: './equipament-list.component.scss'
})
export class EquipamentListComponent implements OnInit {

  items: any[] = [];

  constructor(
    private readonly _equipamentService: EquipmentService
  ) { }

  ngOnInit(): void {
    this._equipamentService.findAll().subscribe({
      next: (res) => {
        this.items = res.result;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getPhoto(photo: string): string {
    console.log(photo)
    if (!photo) {
      return "https://placehold.co/80x80";
    } else {
      return `http://localhost:3000/equipament/file/${photo}`;
    }
  }

  formateDate(date: string) {
    if (!date) return 'N/A';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

}
