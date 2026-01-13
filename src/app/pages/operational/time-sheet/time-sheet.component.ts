import { finalize } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import {
  DynamicDisplayComponent,
  DynamicField
} from '../../../components/dynamic-display/dynamic-display.component';

import { TimeSheetService } from '../../../core/services/time-sheet.service';

// ========================================
// INTERFACES
// ========================================

interface TimeSheetRecord {
  periodo: string;
  jornada_realizada: string;
}

@Component({
  selector: 'app-time-sheet',
  standalone: true,
  imports: [
    CommonModule,
    DynamicDisplayComponent,
  ],
  templateUrl: './time-sheet.component.html',
  styleUrl: './time-sheet.component.scss'
})
export class TimeSheetComponent implements OnInit {
  // ========================================
  // PROPRIEDADES
  // ========================================

  chapa = '';
  apiData: TimeSheetRecord[] = [];
  userName = 'Colaborador';

  // Estados de UI
  isEmpty = false;
  isLoading = true;

  // Configuração dos campos
  readonly fields: DynamicField[] = [
    {
      label: 'Período',
      name: 'periodo',
      type: 'date',
      style: 'card'
    },
    {
      label: 'Jornada de Trabalho',
      name: 'jornada_realizada',
      type: 'text',
      style: 'card'
    }
  ];

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly timeSheetService: TimeSheetService
  ) { }

  // ========================================
  // LIFECYCLE HOOKS
  // ========================================

  ngOnInit(): void {
    this.loadChapaFromRoute();
    this.loadTimeSheet();
  }

  // ========================================
  // MÉTODOS DE CARREGAMENTO DE DADOS
  // ========================================

  private loadChapaFromRoute(): void {
    this.activatedRoute.params.subscribe(params => {
      this.chapa = params['chapa'];
    });
  }

  private loadTimeSheet(): void {
    if (!this.chapa) {
      console.error('Chapa não encontrada na rota');
      this.isEmpty = true;
      this.isLoading = false;
      return;
    }

    this.timeSheetService
      .findEmployeeByChapa(this.chapa)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.apiData = res.result;
          this.userName = res.colaborador || 'Colaborador';
          this.isEmpty = this.apiData.length === 0;
        },
        error: (error) => {
          console.error('Erro ao buscar dados do colaborador:', error);
          this.isEmpty = true;
        }
      });
  }

  // ========================================
  // HANDLERS DE EVENTOS
  // ========================================

  onNavigationBack(): void {
    this.router.navigate(['/dashboard/operational/employees']);
  }
}
