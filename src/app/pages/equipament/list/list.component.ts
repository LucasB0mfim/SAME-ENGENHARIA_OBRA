import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  isEmpty: boolean = false;
  isLoading: boolean = true;

  fields: DynamicField[] = [
    { label: 'Equipamento', name: 'nome', type: 'title' },
    { label: 'Destino', name: 'destino', type: 'text' },
    { label: 'Última atualização', name: 'atualizado_em', type: 'date' },

    { label: 'Nome', name: 'nome', type: 'bottomSheet' },
    { label: 'Origem', name: 'origem', type: 'bottomSheet' },
    { label: 'Destino', name: 'destino', type: 'bottomSheet' },
    { label: 'Dia do cadastro', name: 'criado_em', type: 'bottomSheet' },
    { label: 'última Atualização', name: 'atualizado_em', type: 'bottomSheet' },

    { label: 'Baixar QR Code', name: 'atualizado_em', type: 'button' },
    { label: 'Compartilhar QR Code', name: 'atualizado_em', type: 'button' }
  ];

  constructor(
    private readonly _equipamentService: EquipmentService
  ) { }

  ngOnInit(): void {
    this._equipamentService.findAll()
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: (res) => {
        this.apiData = res.result;
        this.isEmpty = this.apiData.length === 0;
      },
      error: (error) => {
        console.log(error);
        this.isEmpty = this.apiData.length === 0;
      }
    });
  }
}
