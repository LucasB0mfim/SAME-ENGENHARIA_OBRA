import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { DynamicDisplayComponent, DynamicField } from '../../../components/dynamic-display/dynamic-display.component';

import { UserService } from '../../../core/services/user.service';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-manage',
  imports: [
    CommonModule,
    DynamicDisplayComponent
  ],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss'
})
export class ManageComponent implements OnInit {
  userData: any = {};
  apiData: any[] = [];

  isEmpty: boolean = false;
  isLoading: boolean = true;

  errorMessage: string = '';
  successMessage: string = '';

  fields: DynamicField[] = [
    { label: 'Descrição', name: 'descricao', type: 'title', style: 'card' },
    { label: 'Valor', name: 'valor', type: 'title', style: 'card' },

    { label: 'Centro de custo', name: 'centro_custo', type: 'title', style: 'bottomSheet' },
    { label: 'Descrição da tarefa', name: 'descricao', type: 'title', style: 'bottomSheet' },
    { label: 'Valor da premiação', name: 'valor', type: 'title', style: 'bottomSheet' },

    { label: 'Data de início', name: 'data_inicial', type: 'date', style: 'bottomSheet' },
    { label: 'Data de término', name: 'data_final', type: 'date', style: 'bottomSheet' },

    { name: 'Aprovar', type: 'button', style: 'bottomSheet', action: 'acceptTask' },
    { name: 'Recusar', type: 'button', style: 'bottomSheet', action: 'rejectTask' },
  ]

  constructor(
    private readonly _userService: UserService,
    private readonly _taskService: TaskService,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this._userService.getInfo().subscribe({
      next: (res) => {
        this.userData = res.result;
        this.getTask();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getTask(): void {
    this._taskService.findTaskByChapa(this.userData.chapa)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: (res) => {
        this.apiData = res.result;
        this.isEmpty = this.apiData.length === 0;
        },
        error: (error) => {
          console.error(error);
          this.isEmpty = this.apiData.length === 0;
        }
      });
  }

  onSubmit(formData: FormData): void {
    this._taskService.updateConsent(formData).subscribe({
      next: (res) => {
        this.successMessage = res.message;
      },
      error: (error) => {
        this.errorMessage = error.error.message;
      }
    });
  }
}
