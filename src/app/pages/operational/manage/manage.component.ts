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
  apiData: any[] = [];
  userData: any = {};

  fields: DynamicField[] = [
    { label: 'Centro de custo', name: 'centro_custo', type: 'title' },
    { label: 'Descrição', name: 'descricao', type: 'title' },
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
    this._taskService.findTaskByChapa(this.userData.chapa).subscribe({
      next: (res) => {
        this.apiData = res.result;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
