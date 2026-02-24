import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import {
  DynamicDisplayComponent,
  DynamicField,
  ModalType,
  ActionEvent
} from '../../../../components/dynamic-display/dynamic-display.component';

import { UserService } from '../../../../core/services/user.service';
import { TaskService } from '../../../../core/services/task.service';

// ========================================
// INTERFACES
// ========================================

interface Task {
  id: string;
  centro_custo: string;
  descricao: string;
  data_inicial: string;
  data_final: string;
  valor: number;
}

interface User {
  chapa: string;
  nome: string;
}

@Component({
  selector: 'app-task-pending',
  standalone: true,
  imports: [
    CommonModule,
    DynamicDisplayComponent
  ],
  templateUrl: './task-pending.component.html',
  styleUrl: './task-pending.component.scss'
})
export class TaskPendingComponent implements OnInit {
  // ========================================
  // PROPRIEDADES
  // ========================================

  userData: User | null = null;
  apiData: Task[] = [];

  // Estados de UI
  isEmpty = false;
  isLoading = false;
  modalState: ModalType = ModalType.IDLE;
  modalMessage = '';

  // Configuração dos campos
  readonly fields: DynamicField[] = [
    // Campos visíveis no card
    {
      label: 'Centro de custo',
      name: 'centro_custo',
      type: 'title',
      style: 'card'
    },
    {
      label: 'Descrição da tarefa',
      name: 'descricao',
      type: 'title',
      style: 'card'
    },

    // Campos visíveis no bottom sheet
    {
      label: 'Descrição da tarefa',
      name: 'descricao',
      type: 'title',
      style: 'bottomSheet'
    },
    {
      label: 'Data de início',
      name: 'data_inicial',
      type: 'date',
      style: 'bottomSheet'
    },
    {
      label: 'Data de término',
      name: 'data_final',
      type: 'date',
      style: 'bottomSheet'
    },
    {
      label: 'Valor a receber',
      name: 'valor',
      type: 'title',
      style: 'bottomSheet'
    },

    // Botão de ação
    {
      name: 'Aprovar',
      type: 'button',
      style: 'bottomSheet',
      action: 'acceptTask'
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly taskService: TaskService,
  ) { }

  // ========================================
  // LIFECYCLE HOOKS
  // ========================================

  ngOnInit(): void {
    this.loadUser();
  }

  // ========================================
  // MÉTODOS DE CARREGAMENTO DE DADOS
  // ========================================

  private loadUser(): void {
    this.userService.getInfo().subscribe({
      next: (res) => {
        this.userData = res.result;
        this.loadTasks();
      },
      error: (error) => {
        console.error('Erro ao carregar usuário:', error);
        this.showErrorModal(
          error.error?.message || 'Erro ao carregar informações do usuário'
        );
      }
    });
  }

  private loadTasks(): void {
    if (!this.userData?.chapa) {
      this.showErrorModal('Usuário sem chapa definida');
      return;
    }

    this.isLoading = true;

    this.taskService
      .findPendingTaskByChapa(this.userData.chapa)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.apiData = res.result;
          this.isEmpty = this.apiData.length === 0;
        },
        error: (error) => {
          console.error('Erro ao carregar tarefas:', error);
          this.isEmpty = true;
          this.showErrorModal(
            error.error?.message || 'Erro ao carregar tarefas pendentes'
          );
        }
      });
  }

  // ========================================
  // HANDLERS DE EVENTOS DO COMPONENTE FILHO
  // ========================================

  onActionClick(event: ActionEvent<Task>): void {
    if (event.action === 'acceptTask') {
      this.approveTask(event.item);
    }
  }

  onNavigationBack(): void {
    this.router.navigate(['/dashboard/home']);
  }

  onModalClose(): void {
    this.modalState = ModalType.IDLE;
    this.modalMessage = '';
  }

  // ========================================
  // LÓGICA DE NEGÓCIO
  // ========================================

  private approveTask(task: Task): void {
    const formData = new FormData();
    formData.append('id', task.id);
    formData.append('consent', 'APROVADO');

    this.modalState = ModalType.LOADING;
    this.modalMessage = 'Processando solicitação...';

    this.taskService.update(formData).subscribe({
      next: (res) => {
        this.showSuccessModal(res.message || 'Operação realizada com sucesso');
        this.loadTasks();
      },
      error: (error) => {
        console.error('Erro ao aprovar tarefa:', error);
        this.showErrorModal(
          error.error?.message || 'Erro ao processar solicitação'
        );
      }
    });
  }

  // ========================================
  // MÉTODOS AUXILIARES
  // ========================================

  private showSuccessModal(message: string): void {
    this.modalState = ModalType.SUCCESS;
    this.modalMessage = message;
  }

  private showErrorModal(message: string): void {
    this.modalState = ModalType.ERROR;
    this.modalMessage = message;
  }
}
