import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { DynamicDisplayComponent, DynamicField } from '../../../components/dynamic-display/dynamic-display.component';

import { TimeSheetService } from '../../../core/services/time-sheet.service';

@Component({
  selector: 'app-time-sheet',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    CommonModule,
    DynamicDisplayComponent,
  ],
  templateUrl: './time-sheet.component.html',
  styleUrl: './time-sheet.component.scss'
})
export class TimeSheetComponent implements OnInit {

  chapa: string = '';
  apiData: any = null;
  employeeName: string = 'Colaborador';

  fields: DynamicField[] = [
    { label: 'Período', name: 'periodo', type: 'date' },
    { label: 'Jornada de Trabalho', name: 'jornada_realizada', type: 'text' }
  ];

  constructor(
    private router: ActivatedRoute,
    private timeSheetService: TimeSheetService
  ) { }

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.chapa = params['chapa'];
    });

    this.getTimeSheet();
  }

  getTimeSheet(): void {
    this.timeSheetService.findEmployeeByChapa(this.chapa).subscribe({
      next: (res) => {
        this.apiData = res.result;
        this.employeeName = this.apiData[0]?.nome;
      },
      error: (error) => {
        console.error('Erro ao buscar dados do colaborador:', error);
      }
    });
  }
}
