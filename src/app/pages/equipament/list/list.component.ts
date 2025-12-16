import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDisplayComponent, DynamicField } from '../../../components/dynamic-display/dynamic-display.component';
import { EquipmentService } from '../../../core/services/equipment.service';

@Component({
  selector: 'app-equipament-list',
  imports: [
    CommonModule,
    DynamicDisplayComponent,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class EquipamentListComponent implements OnInit {
  apiData: any[] = [];

  fields: DynamicField[] = [
  { label: 'Nome', name: 'nome', type: 'title' },
  { label: 'Criado em', name: 'criado_em', type: 'date' },
  { label: 'Destino', name: 'destino', type: 'text' }
];


  constructor(
    private readonly _equipamentService: EquipmentService
  ) { }

  ngOnInit(): void {
    this._equipamentService.findAll().subscribe({
      next: (res) => {
        this.apiData = res.result;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
